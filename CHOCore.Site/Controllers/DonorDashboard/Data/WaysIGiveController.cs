using CHOCore.Controllers.Filters;
using CHOCore.Models.DonorDashboard.CommandModels;
using CHOCore.Models.DonorDashboard.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using CHOCore.Models.DonorDashboard.WaysIGive;
using System.Collections.Generic;
using System.Threading.Tasks;
using static CHOCore.Controllers.DonorDashboard.MyCharitableCategoriesController;
using CHOCore.Models.General.QueryModels;
using System.Net.Http;
using System.Security.Authentication;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Linq;
using CHOCore.ModelLibrary.DonorDashboard.QueryModels;

namespace CHOCore.Controllers.DonorDashboard.Data
{
    [Route("DonorDashboard/WaysIGive")]
    [LoginRequired("Donor")]
    public class WaysIGiveController : Controller
    {
        static string _directDBConnectionString;
        readonly ILogger<WaysIGiveController> _logger;
        static DbContextOptionsBuilder _optionsBuilder = new DbContextOptionsBuilder<DonorDashboardContext>();

        public WaysIGiveController(IConfiguration configuration, ILogger<WaysIGiveController> logger = null) : base()
        {
            _directDBConnectionString = configuration["connectionstrings:MSSQL.Main"];
            _optionsBuilder.UseSqlServer(_directDBConnectionString);
            _logger = logger;
        }
        [HttpGet("")]
        public async Task<ActionResult> GetAll()
        {
            var donorID = HttpContext.Items["DonorID"] as int?;
            if (donorID.HasValue)
            {
                try
                {
                    var result = new WaysIGiveCommand(_optionsBuilder.Options).GetByDonorFilteredByCategory(_directDBConnectionString, donorID.Value);                    
                    await FillCharitySlugs(result);
                    return Json(result);
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, $"Error while GetWaysIGive, donorID: {donorID}");
                    return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
                }
            }
            else
            {
                return Unauthorized();
            }
        }

        protected async Task FillCharitySlugs(List<WaysIGiveCategoryData> result)
        {
            var charityList = getUniqueCharityList(result);
            var charitySlugs = await APICallToGetDjangoCategories(charityList);

            foreach (var categoryData in result)
                foreach(var charity in categoryData.Charities)
                {
                    var charitySlug = charitySlugs.Where(c => c.charityID.Equals(charity.id)).FirstOrDefault();
                    if (charitySlug != null)
                        charity.slug = charitySlug.slug;
                }
        }

        private string getUniqueCharityList(List<WaysIGiveCategoryData> result)
        {
            var listOfUniqueCharityIDs = new List<int>();

            foreach (var categoryData in result)
                foreach (var charity in categoryData.Charities)
                    if (!listOfUniqueCharityIDs.Exists(x => x.Equals(charity.id)))
                        listOfUniqueCharityIDs.Add(charity.id);

            return String.Join(',', listOfUniqueCharityIDs);
        }

        protected async Task<List<CharityCategories>> APICallToGetDjangoCategories(string charityList)
        {
            List<CharityCategories> ret = null;
            var hostURL = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("Host.URL");
            using (var httpHandler = new HttpClientHandler())
            {
                using (var client = new HttpClient(httpHandler))
                {
                    httpHandler.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls11 | SslProtocols.Tls;
#if DEBUG
                    httpHandler.ServerCertificateCustomValidationCallback += (message, xcert, chain, errors) => true;
#endif
                    client.BaseAddress = new Uri(hostURL);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var response = await client.GetAsync($"api/categories/base_categories/?charity-list={charityList}");
                    if (response.IsSuccessStatusCode)
                    {
                        var responseJson = await response.Content.ReadAsStringAsync();
                        ret = JsonConvert.DeserializeObject<List<CharityCategories>>(responseJson);
                    }
                }
            }
            return ret;
        }

        [HttpGet, Route("percentages")]
        public ActionResult GetAllPercentages()
        {
            var donorID = HttpContext.Items["DonorID"] as int?;
            if (donorID.HasValue)
            {
                try
                {
                    var result = new WaysIGiveQuery(_optionsBuilder.Options).GetListOfPercentagesForWays();
                    return Json(result);
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, $"Error while GetWaysIGive, donorID: {donorID}");
                    return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
                }
            }
            return new NotFoundResult();
        }
    }
}
