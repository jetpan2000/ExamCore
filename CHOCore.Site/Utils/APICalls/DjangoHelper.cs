using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using CHOCore.Models.General.QueryModels;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Authentication;
using CHOCore.Site.ViewModels;
using System.Threading.Tasks;

namespace CHOCore.Site.Utils.APICalls
{
    public class DjangoHelper
    {
        private DbContextOptionsBuilder _optionsBuilder;
        public DjangoHelper(DbContextOptionsBuilder optionsBuilder)
        {
            _optionsBuilder = optionsBuilder;
        }

        private async Task<string> callDjangoAPIGetTransactionsEndPoint(string encryptedString)
        {
            var hostURL = new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("Host.URL");
            var responseJson = string.Empty;
            using (var httpHandler = new HttpClientHandler())
            {
                using (var client = new HttpClient(httpHandler))
                {
                    httpHandler.SslProtocols = SslProtocols.Tls12;
                    #if DEBUG
                    httpHandler.ServerCertificateCustomValidationCallback += (message, xcert, chain, errors) => true;
                    #endif
                    client.BaseAddress = new Uri(hostURL);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var response = await client.GetAsync($"api/get-transaction/{encryptedString}");
                    if (response.IsSuccessStatusCode)
                    {
                        responseJson = await response.Content.ReadAsStringAsync();
                        
                    }
                }
            }
            return responseJson;
        }
        public async Task<P2PCampaignViewModel> getP2PCastableObjectFromAPI(string encryptedString)
        {
           
            P2PCampaignViewModel p2PCampaignVM = new P2PCampaignViewModel();
            var responseJson = await callDjangoAPIGetTransactionsEndPoint(encryptedString);
            p2PCampaignVM = JsonConvert.DeserializeObject<P2PCampaignViewModel>(responseJson);
            return p2PCampaignVM;
        }

        public async Task<string> getP2PGeneralObjectFromAPI(string encryptedString)
        {
            var responseJson = await callDjangoAPIGetTransactionsEndPoint(encryptedString);
            return responseJson;
        }
        public string getP2PSerializableAppSettings(P2PViewModel p2pDTO)
        {
            Dictionary<string, string> dicP2PCDNSettings = new Dictionary<string, string>();
            dicP2PCDNSettings.Add("UID", p2pDTO.UID);
            dicP2PCDNSettings.Add("imageUrl", p2pDTO.imageUrl);
            dicP2PCDNSettings.Add("theme", p2pDTO.theme);
            dicP2PCDNSettings.Add("type", p2pDTO.type);
            dicP2PCDNSettings.Add("charityNameEn", p2pDTO.charityNameEn);
            dicP2PCDNSettings.Add("charityNameFr", p2pDTO.charityNameFr);
            dicP2PCDNSettings.Add("pageNameEn", p2pDTO.pageNameEn);
            dicP2PCDNSettings.Add("pageNameFr", p2pDTO.pageNameFr);
            dicP2PCDNSettings.Add("pageOwner", p2pDTO.pageOwner);
            if (!string.IsNullOrEmpty(p2pDTO.pageOwner))
                dicP2PCDNSettings.Add("Page.isThirdPartyPage", "true");

            return JsonConvert.SerializeObject(dicP2PCDNSettings);
        }

        public string getP2PSerializableCampaignSettings(P2PCampaignViewModel p2PCampaignDTO)
        {
            Dictionary<string, string> dicP2PCDNCampaignSettings = new Dictionary<string, string>();
            dicP2PCDNCampaignSettings.Add("campaign_name_en", p2PCampaignDTO.campaign_name_en);
            dicP2PCDNCampaignSettings.Add("name_fr", p2PCampaignDTO.name_fr);
            dicP2PCDNCampaignSettings.Add("charity_id", p2PCampaignDTO.charity_id.ToString());
            dicP2PCDNCampaignSettings.Add("supporter_wall_message", p2PCampaignDTO.supporter_wall_message);
            dicP2PCDNCampaignSettings.Add("campaign_name_fr", p2PCampaignDTO.campaign_name_fr);
            dicP2PCDNCampaignSettings.Add("fund_id", p2PCampaignDTO.fund_id.ToString());
            dicP2PCDNCampaignSettings.Add("donation_amount", p2PCampaignDTO.donation_amount.ToString());
            dicP2PCDNCampaignSettings.Add("display_type", p2PCampaignDTO.display_type.ToString());
            dicP2PCDNCampaignSettings.Add("is_monthly", p2PCampaignDTO.is_monthly.ToString());
            dicP2PCDNCampaignSettings.Add("name_en", p2PCampaignDTO.name_en.ToString());
            dicP2PCDNCampaignSettings.Add("campaign_id", p2PCampaignDTO.campaign_id.ToString());
            return JsonConvert.SerializeObject(dicP2PCDNCampaignSettings);
        }

    }              
}
