using System;
using System.Net;
using System.Collections.Specialized;
using Microsoft.EntityFrameworkCore;
using CHOCore.Models.DonorDashboard.EF;
using Microsoft.Extensions.Configuration;
using CHOCore.Models.General.QueryModels;
using System.Text;
using System.Threading;
using Microsoft.AspNetCore.Http;
using CHOCore.Site.Interfaces;
using Microsoft.Extensions.Logging;

namespace CHOCore.Site.Utils
{
    public class SalesForceHelper: ISalesForceHelper
    {
        private bool submitToSF;
        static DbContextOptionsBuilder _optionsBuilder = new DbContextOptionsBuilder<DonorDashboardContext>();
        private string _directDBConnectionString;
        private IConfiguration _configuration;
        private readonly IHttpContextAccessor _accsessor;
        private IEmailHelper _emailHelper;
        private ILogger<SalesForceHelper> _logger;
        private string _salesForceOrgID;
        private string _adminEmailAddress;

        public SalesForceHelper(IConfiguration configuration, 
            IHttpContextAccessor accessor,
            IEmailHelper emailHelper,
            ILogger<SalesForceHelper> logger = null)
        {
            _emailHelper = emailHelper;
            _logger = logger;
            _directDBConnectionString = configuration["connectionstrings:MSSQL.Main"];
            _accsessor = accessor;
            _optionsBuilder.UseSqlServer(_directDBConnectionString);
            _configuration = configuration;
            submitToSF = bool.Parse(new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("Help.SubmitCaseToSalesForce"));
            _salesForceOrgID = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("SalesForce.OrgID");
            _adminEmailAddress = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("Admin.CHAdministratorEmail");

        }
        public bool SubmitCaseToSalesForce(string caseType, string subject, string charityName, string charityBN, string senderMsg, string senderName, string senderEmail)
        {
            if (false == submitToSF)
                return false;

            WebClient webClient = new WebClient();
            NameValueCollection data = new NameValueCollection();

            data.Add("orgid", _salesForceOrgID);

            data.Add("recordType", "012500000005RTD");

            data.Add("name", senderName);
            data.Add("email", senderEmail);
            senderMsg = senderMsg + string.Empty;
            data.Add("description", senderMsg);

            //Case type: Donor, Charity, GivingPages
            data.Add("type", caseType);
            //Case sub-type (custom SF field)
            data.Add("00N50000002dtY7", subject);
            data.Add("subject", subject);

            //User correspondence language
            string current_culture = string.Empty;
            var culture = Thread.CurrentThread.CurrentUICulture;
            if (culture.Name.ToLowerInvariant() == "fr-ca")
            {
                current_culture = "French";
            }
            else if (culture.Name.ToLowerInvariant() == "en-ca")
            {
                current_culture = "English";
            }
            data.Add("00N50000002dvyl", current_culture);

            if (true == caseType.ToLower().Equals("charity"))
            {
                data.Add("company", charityBN);

                //Custom field "Web Charity Name"
                data.Add("00N50000002dw1p", charityName);
            }

            data.Add("external", "1");

            webClient.Encoding = Encoding.UTF8;

            byte[] result = null;
            string output = null;

            try
            {
                result = webClient.UploadValues("https://www.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8", "POST", data);
                output = Encoding.UTF8.GetString(result);
                if (false == string.IsNullOrEmpty(output))
                {
                    return false;
                }

            }
            catch (Exception ex)
            {
                _logger.LogError($"Problem occurred at SubmitCaseToSalesForce method {ex.Message}");
                return false;
            }
            return true;
        }

        public void SubmitCaseViaEmail(string subject, string charityName, string charityBN, string senderMsg, string senderName, string senderEmail, bool isCharity, string customSubject)
        {

            string body = "Charity Name: ";

            // Add Charity info
            if (isCharity)
            {
                 if (true == string.IsNullOrEmpty(charityName))
                {
                    body += "N/A\r\n";
                }
                else
                {
                    body += charityName + "\r\n";
                }
                body += "BN: ";
                if (true == string.IsNullOrEmpty(charityBN))
                {
                    body += "N/A\r\n";
                }
                else
                {
                    body += charityBN + "\r\n";
                }
            }

            body += senderMsg;
            body += collectBrowserInfo();
            string fromAddress = senderName + "<" + senderEmail + ">";
            if (customSubject != null && customSubject != "")
            {
                _emailHelper.Send(false, body, customSubject, fromAddress, "gpsupport@canadahelps.org");
            }
            else
            {
                _emailHelper.Send(false, body, subject, fromAddress, _adminEmailAddress);
            }
        }

        private string collectBrowserInfo()
        {
            StringBuilder output = new StringBuilder();
            output.Append("\r\n\r\n*************************\r\n");
            output.Append("Browser: " + _accsessor.HttpContext.Request.Headers["User-Agent"].ToString() + "\r\n");
            return output.ToString();
        }
    }
}
