using System;
using System.Text;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using CHOCore.Controllers.Filters;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using CHOCore.Models.General.QueryModels;
using CHOStandard.MailChimp.Models;
using CHOStandard.Utilities.MailChimp;
using CHOStandard.MSSQL.CHOMailChimpTask.CommandModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CHOCore.Controllers.MailChimp
{
    [Route("/MailChimp")]
    public class MailChimpController : Controller
    {
        private static string _API30UrlRoot;
        private static string _connString;
        private readonly ILogger<MailChimpController> _logger;
        private static MailChimpAppSettings _appSettings;
        private static string _listIDs;
        private static string _englishInterests;
        private static string _frenchInterests;

        public MailChimpController(IConfiguration configuration, IOptions<MailChimpAppSettings> appSettings, ILogger<MailChimpController> logger = null)
        {
            _logger = logger;
            _appSettings = appSettings.Value;

            _API30UrlRoot = _appSettings.MailChimp.API30UrlRoot;
            _connString = configuration["connectionstrings:MSSQL.Main"];

            if (string.IsNullOrEmpty(_listIDs))
            {
                var query = new ApplicationSettingsDBQuery(_connString);
                _listIDs = query.GetValue("Newsletter.MailChimp.ListIDs");
                _englishInterests = query.GetValue("Newsletter.MailChimp.English.Interests");
                _frenchInterests = query.GetValue("Newsletter.MailChimp.French.Interests");
            }
        }   

        [HttpGet]
        [ServiceFilter(typeof(TrustedIPOnly))]
        [Route("{apiKey}/Lists/{listId}/contacts/{email}")]
        public async Task<ActionResult> GetListContact([FromRoute] string apiKey, [FromRoute] string listId, [FromRoute] string email)
        {
            MailChimpAPIClient apiHelper = new MailChimpAPIClient(apiKey, _API30UrlRoot, _listIDs, _frenchInterests, _englishInterests);

            if (listId.ToLower() != "any")
            {
                var resps = await apiHelper.GetContact(listId, email);
                return Ok(resps);
            }

            var listIds = apiHelper.GetMailChimpListIds();
            string messages = "";

            foreach (var listId1 in listIds)
            {
                var apiResps = await apiHelper.GetContact(listId1, email);
                foreach (var resp1 in apiResps)
                {
                    if (resp1.statusCode == 200 && resp1.mcMembers != null && resp1.mcMembers.Count > 0)
                        return Ok(apiResps);
                    else
                        messages += $"{resp1.statusCode}, {resp1.msg}; ";
                }
                    
            }

            _logger.LogError($"MailChimpController GetListContact error: {apiKey}, {email}:  {messages}");

            MCAPICallResponse resp = new MCAPICallResponse();
            resp.statusCode = 404;
            resp.msg = messages;
            return Ok(new List<MCAPICallResponse>() { resp });
        }        

        [HttpGet]
        [ServiceFilter(typeof(TrustedIPOnly))]
        [Route("{apiKey}/Lists")]
        public async Task<ActionResult> GetAllLists([FromRoute] string apiKey)
        {
            string apiUrl = $"{_API30UrlRoot}lists";
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("apikey", apiKey);

                var response = await client.GetAsync(apiUrl);
                if (!response.IsSuccessStatusCode)
                {
                    string msg = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"MailChimpController GetAllLists error: {apiKey}, {msg}");
                    return StatusCode((int)response.StatusCode);
                }
                string listsJson = await response.Content.ReadAsStringAsync();
                return Ok(new { listsJson = listsJson });
            }
        }

        [HttpPost]
        [ServiceFilter(typeof(TrustedIPOnly))]
        [Route("{apiKey}/Lists/{listId}/Contacts")]
        public async Task<ActionResult> AddContact([FromRoute] string apiKey, [FromRoute] string listId, [FromBody] MCMemberRequest mcReq)
        {
            MailChimpAPIClient apiHelper = new MailChimpAPIClient(apiKey, _API30UrlRoot, _listIDs, _frenchInterests, _englishInterests);
            return Ok(await apiHelper.AddContact(listId, mcReq));
        }

        [HttpPost]
        [ServiceFilter(typeof(TrustedIPOnly))]
        [Route("{apiKey}/Lists/All/Contacts")]
        public async Task<ActionResult> PutContactAllLists ([FromRoute] string apiKey, [FromBody] MCMemberRequest mcReq)
        {
            MailChimpAPIClient apiHelper = new MailChimpAPIClient(apiKey, _API30UrlRoot, _listIDs, _frenchInterests, _englishInterests);
            List<MCAPICallResponse> apiResps = await apiHelper.PutContactAllLists(mcReq);
            return Ok(apiResps);          
        }      

        [HttpPut]
        [ServiceFilter(typeof(TrustedIPOnly))]
        [Route("{apiKey}/Lists/{listId}/Contacts")]
        public async Task<ActionResult> UpdateContact([FromRoute] string apiKey, [FromRoute] string listId, [FromBody] MCMemberRequest mcReq)
        {
            MailChimpAPIClient apiHelper = new MailChimpAPIClient(apiKey, _API30UrlRoot, _listIDs, _frenchInterests, _englishInterests);
            var apiResps = await apiHelper.PutContact(listId, mcReq);

            return Ok(apiResps);
        }

        [HttpPut]
        [ServiceFilter(typeof(TrustedIPOnly))]
        [Route("{apiKey}/Lists/All/Contacts")]
        public async Task<ActionResult> AddContactAllLists([FromRoute] string apiKey, [FromBody] MCMemberRequest mcReq)
        {
            MailChimpAPIClient apiHelper = new MailChimpAPIClient(apiKey, _API30UrlRoot, _listIDs, _frenchInterests, _englishInterests);
            List<MCAPICallResponse> apiResps = await apiHelper.UpdateContactAllLists(mcReq);
            return Ok(apiResps);
        }
        
        [HttpPut]
        [ServiceFilter(typeof(TrustedIPOnly))]
        [Route("{apiKey}/{listId}/Charity/Profile")]
        public async Task<ActionResult> UpdateCharityProfileLists([FromRoute] string apiKey, string listId, [FromBody] MCMemberRequest mcReq)
        {
            MailChimpAPIClient apiClient = new MailChimpAPIClient(apiKey, _API30UrlRoot, _listIDs, _frenchInterests, _englishInterests);
            List<MCAPICallResponse> apiResps = null;
            var cmd = new MailChimpTaskCommand(_connString);
            var adminEmails = cmd.GetCharityAdminEmails((int)mcReq.merge_fields.CHARITYID);

            if (listId.ToLower() == "all")
                apiResps = await apiClient.UpdateCharityProfileAllLists(adminEmails, mcReq.merge_fields);
            else
                apiResps = await apiClient.UpdateCharityProfile(listId, adminEmails, mcReq.merge_fields);

            return Ok(apiResps);
        }

        [HttpPut]
        [ServiceFilter(typeof(TrustedIPOnly))]
        [Route("{apiKey}/{listId}/Charity/DonationDate")]
        public async Task<ActionResult> UpdateCharityDonationDateLists([FromRoute] string apiKey, string listId, [FromBody] MCMemberRequest mcReq)
        {
            MailChimpAPIClient apiClient = new MailChimpAPIClient(apiKey, _API30UrlRoot, _listIDs, _frenchInterests, _englishInterests);
            List<MCAPICallResponse> apiResps = null;
            var cmd = new MailChimpTaskCommand(_connString);
            var adminEmails = cmd.GetCharityAdminEmails((int)mcReq.merge_fields.CHARITYID);

            if (listId.ToLower() == "all")
                apiResps = await apiClient.UpdateCharityProfileAllLists(adminEmails, mcReq.merge_fields, true);
            else
                apiResps = await apiClient.UpdateCharityProfile(listId, adminEmails, mcReq.merge_fields, true);

            return Ok(apiResps);
        }

        [HttpDelete]
        [ServiceFilter(typeof(TrustedIPOnly))]
        [Route("{apiKey}/Lists/{listId}/Contacts")]
        public async Task<ActionResult> DeleteContact([FromRoute] string apiKey, [FromRoute] string listId, [FromBody] MCMemberRequest mcReq)
        {
            MailChimpAPIClient apiHelper = new MailChimpAPIClient(apiKey, _API30UrlRoot, _listIDs, _frenchInterests, _englishInterests);
            return Ok(await apiHelper.DeleteContact(listId, mcReq.email_address));
        }

        [HttpDelete]
        [ServiceFilter(typeof(TrustedIPOnly))]
        [Route("{apiKey}/Lists/All/Contacts")]
        public async Task<ActionResult> DeleteContactAllLists([FromRoute] string apiKey, [FromBody] MCMemberRequest mcReq)
        {
            MailChimpAPIClient apiHelper = new MailChimpAPIClient(apiKey, _API30UrlRoot, _listIDs, _frenchInterests, _englishInterests);
            var apiResps = await apiHelper.DeleteContactAllLists(mcReq.email_address);
            return Ok(apiResps);
        }
    }
}
