using CHOCore.Site.Utils;
using CHOCore.Utilities.APIClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace CHOCore.Site.Controllers.DN
{
    [Produces("application/json")]
    public class DNSubmitController : Controller
    {
        private readonly ILogger<DNSubmitController> _logger;
        private IConfiguration _configuration;
        private string _internalAPISubmitDonationUrl;
        private string _internalAPISetExpressCheckoutUrl;
        private P2PViewModelHelper _p2pviewmodelhelper;

        public DNSubmitController(IConfiguration configuration
                                 , P2PViewModelHelper p2pviewmodelhelper
                                 , ILogger<DNSubmitController> logger = null)
        {
            _logger = logger;
            _configuration = configuration;
            _internalAPISubmitDonationUrl = $"https://{configuration["DNSubmitController_Settings:internalAPIHost"]}{configuration["DNSubmitController_Settings:submitDonationEndpoint"]}";
            _internalAPISetExpressCheckoutUrl = $"https://{configuration["DNSubmitController_Settings:internalAPIHost"]}{configuration["DNSubmitController_Settings:setExpressCheckoutEndpoint"]}";
            _p2pviewmodelhelper = p2pviewmodelhelper;
        }
        /// <summary>
        /// DonationSourceRoot, DonorInfo.DonorID, DonorInfo.DonationIPAddress, IsMobile is set by this method
        /// value passed in those 4 fields are ignored
        /// </summary>
        /// <param name="donationRequest"></param>
        /// <returns></returns>
        [Route("DN/SubmitDonation")]
        [HttpPost]
        public async Task<ActionResult> SubmitDonation([FromBody]DNDonationRequest donationRequest)
        {
            donationRequest.DonationSourceRoot = DNDonation_SourceRoot.Charity;
            return await processDonationRequest(donationRequest);
        }
        /// <summary>
        /// DonationSourceRoot, DonorInfo.DonorID, DonorInfo.DonationIPAddress, IsMobile is set by this method
        /// value passed in those 4 fields are ignored, used by p2p and third party
        /// </summary>
        /// <param name="donationRequest"></param>
        /// <returns></returns>
        [Route("DN/SubmitDonation/P2P")]
        [HttpPost]
        public async Task<ActionResult> SubmitP2PDonation([FromBody]DNP2PDonationRequest donationRequest)
        {

            var query = Request.QueryString;

            int campaignID = 0;
            if (query.HasValue)
            {
                var p2p_data_parsed = HttpUtility.ParseQueryString(query.ToString());
                var encryptedString =  p2p_data_parsed.Get("d");
                if (int.TryParse(p2p_data_parsed.Get("cid"), out campaignID))
                    donationRequest.P2PExtraInfo.CampaignID = campaignID;
                var p2pViewModel = _p2pviewmodelhelper.DecryptAndConstructP2PViewModel(encryptedString);

                if (int.TryParse(p2pViewModel.UID, out int djangoTransactionID))
                    donationRequest.P2PExtraInfo.DjangoID = djangoTransactionID;

                switch (p2pViewModel.type)
                {
                    case "thirdParty":
                        donationRequest.DonationSourceRoot = DNDonation_SourceRoot.Third_Party;
                        break;
                    default:
                        donationRequest.DonationSourceRoot = DNDonation_SourceRoot.P2P;
                        break;
                }
                return await processDonationRequest(donationRequest);
            }
            return null;
        }
        /// <summary>
        /// DonationSourceRoot, DonorInfo.DonorID, DonorInfo.DonationIPAddress, IsMobile is set by this method
        /// value passed in those 4 fields are ignored
        /// </summary>
        /// <param name="donationRequest"></param>
        /// <returns></returns>
        [Route("DN/SubmitDonation/Multistep")]
        [HttpPost]
        public async Task<ActionResult> SubmitMultistepDonation([FromBody]DNDonationRequest donationRequest)
        {
            donationRequest.DonationSourceRoot = DNDonation_SourceRoot.MultiStep;
            return await processDonationRequest(donationRequest);
        }
        [Route("DN/SetPaypalExpressCheckout")]
        public async Task<ActionResult> SetPaypayExpressCheckout([FromBody]DNDonationRequest donationRequest)
        {
            //even though this is set to charity, it doesn't really matter - 
            //only a few thing in this payload is used to set the express checkout basket in Paypal
            //such as charityName and amounts
            donationRequest.DonationSourceRoot = DNDonation_SourceRoot.Charity;
            return await processExpressCheckout(donationRequest);
        }

        #region private methods
        private async Task<ActionResult> processExpressCheckout(DNDonationRequest donationRequest)
        {
            try
            {
                fillClientBrowserInfo(donationRequest, _configuration["CHO.ProxyIP"]);
                var responseFromInternalAPI = await DNDonationHelper.PostPaypalExpressCheckout(_internalAPISetExpressCheckoutUrl, donationRequest);

                return new JsonResult(responseFromInternalAPI);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogWarning(ex, $"HTTException while posting to {_internalAPISetExpressCheckoutUrl}");
                return new JsonResult(new SetPaypalExpressCheckoutErrorResponse("DNDonationHelper.PostPaypalExpressCheckout", -1, new Exception
                                        ($"Webexception, calling {_internalAPISubmitDonationUrl}, param :{donationRequest}", ex)));
            }
            catch (InvalidCastException ex)
            {
                _logger.LogError(ex, $"Unexpected Payload posting to {_internalAPISetExpressCheckoutUrl}");
                return new JsonResult(new SetPaypalExpressCheckoutErrorResponse("DNDonationHelper.PostPaypalExpressCheckout", -2, new Exception
                                        ($"Invalid Cast, usually due to unexpected results, calling {_internalAPISubmitDonationUrl}, param :{donationRequest}", ex)));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected Exception while posting to {_internalAPISetExpressCheckoutUrl}");
                return new JsonResult(new SetPaypalExpressCheckoutErrorResponse("DNDonationHelper.PostPaypalExpressCheckout", -3, new Exception
                                        ($"Unexpected Error, calling {_internalAPISetExpressCheckoutUrl}, param :{donationRequest}", ex)));
            }
        }

        private async Task<ActionResult> processDonationRequest(DNDonationRequest donationRequest)
        {
            try
            {
                fillClientBrowserInfo(donationRequest, _configuration["CHO.ProxyIP"]);
                if (donationRequest is DNP2PDonationRequest)
                {
                    var p2pSubmitRequest = (DNP2PDonationRequest)donationRequest;
                    return new JsonResult(await DNDonationHelper.Post(_internalAPISubmitDonationUrl + "/p2p", p2pSubmitRequest));
                }

                return new JsonResult(await DNDonationHelper.Post(_internalAPISubmitDonationUrl, donationRequest));
            }
            catch (HttpRequestException ex)
            {
                _logger.LogWarning(ex, $"HTTException while posting to {_internalAPISubmitDonationUrl}");
                return new JsonResult(new SubmitDonationErrorResponse("DNDonationHelper.Post", -1, new Exception
                                        ($"Webexception, calling {_internalAPISubmitDonationUrl}, param :{donationRequest}", ex)));
            }
            catch (InvalidCastException ex)
            {
                _logger.LogError(ex, $"Unexpected Payload posting to {_internalAPISubmitDonationUrl}");
                return new JsonResult(new SubmitDonationErrorResponse("DNDonationHelper.Post", -2, new Exception
                                        ($"Invalid Cast, usually due to unexpected results, calling {_internalAPISubmitDonationUrl}, param :{donationRequest}", ex)));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected Exception while posting to {_internalAPISubmitDonationUrl}");
                return new JsonResult(new SubmitDonationErrorResponse("DNDonationHelper.Post", -3, new Exception
                                        ($"Unexpected Error, calling {_internalAPISubmitDonationUrl}, param :{donationRequest}", ex)));
            }
        }

        private void fillClientBrowserInfo(DNDonationRequest donationRequest, string proxyIPs)
        {
            if (donationRequest.DonorInfo == null)
                donationRequest.DonorInfo = new DonorInformation();

            donationRequest.DonorInfo.DonationIPAddress = HttpContextHelper.GetRealIP(HttpContext, proxyIPs);
            var userIDstr = SessionObj.GetUserID(Request);
            donationRequest.DonorInfo.DonorID = string.IsNullOrEmpty(userIDstr) ? 0 : int.Parse(userIDstr);
            donationRequest.IsMobile = HttpContextHelper.IsMobile(HttpContext);
        }
        #endregion
    }
}
 