using CHOCore.Controllers.Filters;
using CHOCore.Models.DonorDashboard.EF;
using CHOCore.Models.General.QueryModels;
using CHOCore.Site;
using CHOCore.Site.Controllers;
using CHOCore.Site.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using CHOCore.ModelLibrary.DonorDashboard.QueryModels;

namespace CHOCore.Controllers
{


    [MiddlewareFilter(typeof(LocalizationPipeline))]
    [LoginRequired("donor", "SignIn.aspx")]
    public class DonorDashboardController : LangController
    {
        private readonly ILogger<DonorDashboardController> _logger;
        private string _directDBConnectionString;
        private IConfiguration _configuration;
        static DbContextOptionsBuilder _optionsBuilder = new DbContextOptionsBuilder<DonorDashboardContext>();
        private string _canadahelpsGTMKey;

        public DonorDashboardController(IConfiguration configuration, ILogger<DonorDashboardController> logger = null)
        {
            _logger = logger;
            _configuration = configuration;
            _directDBConnectionString = configuration["connectionstrings:MSSQL.Main"];
            _optionsBuilder.UseSqlServer(_directDBConnectionString);
            _canadahelpsGTMKey = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("GoogleTagManager.AccountNumber");
        }
        public ActionResult Index()
        {
            ViewBag.Message = "Donor Dashboard Home Page";
            ViewBag.App = "DonorDashboard";
            ViewBag.Lang = CurrentLanguage;
            ViewBag.Version = CacheBuster.VersionString(_configuration);
            ViewBag.ServerVersion = CacheBuster.ServerVersionString(_configuration);


            var donorID = HttpContext.Items["DonorID"] as int?;
            string postalCode = ApiQuery.GetPostalCodeFromDonorID(donorID, _directDBConnectionString);
            Dictionary<string, string> dicDonorDashBoardSettings = new Dictionary<string, string>();
            dicDonorDashBoardSettings.Add("isEnabledHowCanadianGive", "true");
            dicDonorDashBoardSettings.Add("pc", postalCode);
            ViewBag.donorDashBoardAppSettings = JsonConvert.SerializeObject(dicDonorDashBoardSettings);

            ViewBag.CanadaHelpsGTM = _canadahelpsGTMKey;

            return View();
        }
    }
}