using CHOCore.Models.DonorDashboard.EF;
using CHOCore.Models.General.QueryModels;
using CHOCore.Site;
using CHOCore.Site.Controllers;
using CHOCore.Site.Interfaces;
using CHOCore.Site.Utils;
using CHOCore.Site.Utils.APICalls;
using CHOCore.Site.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CHOCore.Controllers
{
    [MiddlewareFilter(typeof(LocalizationPipeline))]
    public class DNController : LangController
    {
        private readonly ILogger<DNController> _logger;
        private readonly IStringLocalizer<DNController> _localizer;
        private IConfiguration _configuration;
        static DbContextOptionsBuilder _optionsBuilder = new DbContextOptionsBuilder<DonorDashboardContext>();
        private string _directDBConnectionString;
        private IHttpContextAccessor _accessor;
        private ISalesForceHelper _salesForceHelper;
        private string _cdnCapchaKey;
        private string _canadahelpsGTMKey;
        private P2PViewModelHelper _p2pviewmodelhelper;

        public DNController(IConfiguration configuration,
            IHttpContextAccessor accessor,
            ISalesForceHelper salesForceHelper,
            IStringLocalizer<DNController> localizer,
            P2PViewModelHelper p2pviewmodelhelper,
            ILogger<DNController> logger = null)
        {
            _salesForceHelper = salesForceHelper;
            _logger = logger;
            _accessor = accessor;
            _configuration = configuration;
            _localizer = localizer;
            _directDBConnectionString = configuration["connectionstrings:MSSQL.Main"];
            _optionsBuilder.UseSqlServer(_directDBConnectionString);
            _cdnCapchaKey = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("CDN.CapchaKey");
            _canadahelpsGTMKey = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("GoogleTagManager.AccountNumber");
            _p2pviewmodelhelper = p2pviewmodelhelper;
        }

        [Route("{lang}/dn/{id}", Name = "customDonateNow")]
        [Route("{lang}/dne/{id}", Name = "customDonateNowEmbedded")]
        [Route("{lang}/dn/{id}/{*wild}")]
        [Route("{lang}/dne/{id}/{*wild}")]
        public ActionResult Index(int id)
        {
            ViewBag.PayPal_ENV = _configuration["paypalSettings:env"];
            ViewBag.CDNName = "fullform";
            ViewBag.Lang = CurrentLanguage;
            ViewBag.Version = CacheBuster.VersionString(_configuration);
            ViewBag.ServerVersion = CacheBuster.ServerVersionString(_configuration);
            ViewBag.LoggedIn = SessionObj.GetUserID(Request) == null ? false : true;
            ViewBag.CanadaHelpsGTM = _canadahelpsGTMKey;
            var viewModel = ViewModelHelper.GetDNViewModel(id, _directDBConnectionString);
            return View("~/Views/DN/Index.cshtml", viewModel);
        }

        [HttpGet]
        [Route("{lang}/dn/contactus/")]
        [Route("{lang}/dne/contactus/")]
        public IActionResult ContactUs(string pageid = "" ,string firstname = "" ,string lastname = "", string email = "", string charityname = "", string charityBN = "")
        {
            ViewBag.CDNName = "fullform";
            ViewBag.Lang = CurrentLanguage;
            ViewBag.Version = CacheBuster.VersionString(_configuration);
            ViewBag.ServerVersion = CacheBuster.ServerVersionString(_configuration);
            ViewBag.GoogleTagManagerDebug = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("GoogleTagManager.Debug");
            ViewBag.GoogleAnalytics_AccountNumber = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("GoogleAnalytics.AccountNumber");

            var culture = System.Threading.Thread.CurrentThread.CurrentUICulture;
            ContactUsViewModel _vm = new ContactUsViewModel
            {
                pageId = pageid,
                caseType = "Charity",
                senderName = $"{firstname} {lastname}",
                senderEmail = email,
                charityName = charityname,
                charityBN = charityBN,
                customSubject = "Custom Donate Now"
            };
            return View("~/Views/DN/ContactUs.cshtml", _vm);
        }

        [HttpPost]
        [Route("{lang}/dn/contactus/")]
        [Route("{lang}/dne/contactus/")]
        public async Task<IActionResult> ContactUs(ContactUsViewModel _vm)
        {
            ViewBag.CDNName = "fullform";
            ViewBag.Lang = CurrentLanguage;
            ViewBag.Version = CacheBuster.VersionString(_configuration);
            ViewBag.ServerVersion = CacheBuster.ServerVersionString(_configuration);
            ViewBag.GoogleTagManagerDebug = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("GoogleTagManager.Debug");
            ViewBag.GoogleAnalytics_AccountNumber = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("GoogleAnalytics.AccountNumber");

            var captchaResponse = _accessor.HttpContext.Request.Form["g-recaptcha-response"];
            var result = await CapchaHelper.VerifyCaptcha(captchaResponse, _cdnCapchaKey);
            if(!result.Success){
                ModelState.AddModelError("" ,"Captcha is not valid");
                return View("~/Views/DN/ContactUs.cshtml", _vm);
            }
            if (!ModelState.IsValid)
            {
                return View("~/Views/DN/ContactUs.cshtml", _vm);
            }
            string caseType = _vm.caseType;
            string subject = _vm.subject;
            string charityName = _vm.charityName;
            string charityBN = _vm.charityBN;
            string senderMessage = _vm.senderMessage;
            string senderName = _vm.senderName;
            string senderEmail = _vm.senderEmail;
            string customSubject = _vm.customSubject;
            bool isCharity = (caseType == "Charity");


            bool submitted = _salesForceHelper.SubmitCaseToSalesForce(caseType, subject, charityName, charityBN, senderMessage, senderName, senderEmail);
            if (false == submitted)
            {
                _salesForceHelper.SubmitCaseViaEmail(subject, charityName, charityBN, senderMessage, senderName, senderEmail, isCharity, customSubject);
            }
            string url = $"<a href='{Url.RouteUrl("customDonateNow", new { id = _vm.pageId })}'>{_localizer["returnBackMSG"]}</a>";
            ViewData["SuccessMSG"] = $"<span style='margin-left:10px;color:#22967C'>{_localizer["SuccessMSG"]}</span> {url}";
            return View("~/Views/DN/ContactUs.cshtml");
        }

        [Route("{lang}/dn/m/{id}/{*wild}")]
        [Route("{lang}/dne/m/{id}/{*wild}")]
        public IActionResult MultiStep(int id)
        {
            ViewBag.PayPal_ENV = _configuration["paypalSettings:env"];
            ViewBag.CDNName = "multistep";
            ViewBag.Lang = CurrentLanguage;
            ViewBag.Version = CacheBuster.VersionString(_configuration);
            ViewBag.ServerVersion = CacheBuster.ServerVersionString(_configuration);
            ViewBag.LoggedIn = SessionObj.GetUserID(Request) == null ? false : true;
            ViewBag.CanadaHelpsGTM = _canadahelpsGTMKey;
            var viewModel = ViewModelHelper.GetDNViewModel(id, _directDBConnectionString);
            return View("~/Views/DN/Multistep.cshtml", viewModel);
        }

        [Route("{lang}/dn/t/{id}/{*wild}")]
        [Route("{lang}/dne/t/{id}/{*wild}")]
        public IActionResult Tribute(int id)
        {
            ViewBag.PayPal_ENV = _configuration["paypalSettings:env"];
            ViewBag.CDNName = "tribute";
            ViewBag.Lang = CurrentLanguage;
            ViewBag.Version = CacheBuster.VersionString(_configuration);
            ViewBag.ServerVersion = CacheBuster.ServerVersionString(_configuration);
            ViewBag.LoggedIn = SessionObj.GetUserID(Request) == null ? false : true;
            ViewBag.CanadaHelpsGTM = _canadahelpsGTMKey;
            var viewModel = ViewModelHelper.GetDNViewModel(id, _directDBConnectionString);
            return View("~/Views/DN/Tribute.cshtml", viewModel);
        }

        [HttpGet]
        [Route("{lang}/p2p/")]
        public async Task<IActionResult> P2P([FromQuery] string d)
        {
            string encryptedString = d;
            DjangoHelper djangoP2PHelper = new DjangoHelper(_optionsBuilder);
            var p2pDTO = _p2pviewmodelhelper.DecryptAndConstructP2PViewModel(encryptedString);

            //Making ViewBag 
            ViewBag.PayPal_ENV = _configuration["paypalSettings:env"];
            ViewBag.CDNName = "p2p";
            ViewBag.Lang = CurrentLanguage;
            ViewBag.Version = CacheBuster.VersionString(_configuration);
            ViewBag.ServerVersion = CacheBuster.ServerVersionString(_configuration);
            ViewBag.LoggedIn = SessionObj.GetUserID(Request) == null ? false : true;
            ViewBag.CanadaHelpsGTM = _canadahelpsGTMKey;
            ViewBag.GoogleTagManagerAccountNumber = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("GoogleTagManager.AccountNumber");
            ViewBag.GoogleTagManagerDebug = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("GoogleTagManager.Debug");
            ViewBag.DonateNowP2PDonationSource = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("DonateNow.P2PDonationSource");
            ViewBag.CHWebApplicationVersion = CacheBuster.ServerVersionString(_configuration);

            ViewBag.p2pTransaction = await djangoP2PHelper.getP2PGeneralObjectFromAPI(encryptedString);
            ViewBag.p2pAppSettings = djangoP2PHelper.getP2PSerializableAppSettings(p2pDTO);

            return View("~/Views/DN/P2P.cshtml");
        }
    }
}
