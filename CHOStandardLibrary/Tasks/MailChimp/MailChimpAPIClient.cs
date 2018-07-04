using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Text;
using System.Collections.Generic;
using CHOStandard.MailChimp.Models;
using System.Threading.Tasks;
using CHOStandard.Utils;
using CHOStandard.MailChimp.QueryModels;

namespace CHOStandard.Utilities.MailChimp
{
    public class MailChimpAPIClient
    {
        private static string _apiKey;
        private static string _API30UrlRoot;
        private static string _listIDs;
        private static string _strFrenchInterests;
        private static string _strEnglishInterests;

        private static Dictionary<string, bool> _dictFrenchInterests;
        private static Dictionary<string, bool> _dictEnglishInterests;

        public MailChimpAPIClient(string apiKey, string api30UrlRoot, string listIDs, string strFrenchInterests, string strEnglishInterests)
        {
            _apiKey = apiKey;
            _API30UrlRoot = api30UrlRoot;
            _listIDs = listIDs;
            _strFrenchInterests = strFrenchInterests;
            _strEnglishInterests = strEnglishInterests;
        }

        public async Task<MCMemberRequest> SetLanguageInterests(string listId, MCMemberRequest mcReq)
        {
            //check if contact email exists, if exists in MailChimp List, do not update interests.
            var resps = await GetContact(listId, mcReq.email_address);

            if (resps.Count > 0 && resps[0].statusCode == (int)HttpStatusCode.NotFound)
            {
                mcReq.interests = GetLanguageInterests(mcReq.merge_fields.LANGPREFER);

                // For new subscriber, anything through the API is implied, except WordPress registration form
                //if (mcReq.merge_fields.CONSENTTYP != ConsentType.Express) // todo: make sure call from WordPress with ConsentType.Express
                    mcReq.merge_fields.CONSENTTYP = ConsentType.Implied;
            }
            else if (resps.Count > 0 && resps[0].statusCode == (int)HttpStatusCode.OK)
            {
                if (resps[0].mcMembers[0].merge_fields.CHARITYID > 0  )  // these are all from API, set it as Implied for now
                    mcReq.merge_fields.CONSENTTYP = ConsentType.Implied;
                else
                    mcReq.merge_fields.CONSENTTYP = null;
            }

            return mcReq;
        }

        public Dictionary<string, bool> GetLanguageInterests(string lang)
        {// includes true, and false
            lang = string.IsNullOrEmpty(lang) ? "ENGLISH" : lang.ToUpper();
            if (lang == "FRENCH" && _dictFrenchInterests != null && _dictFrenchInterests.Count > 0)
                return _dictFrenchInterests;
            else if (lang == "ENGLISH" && _dictEnglishInterests != null && _dictEnglishInterests.Count > 0)
                return _dictEnglishInterests;
           
            Dictionary<string, bool> dictInterests = new Dictionary<string, bool>();

            if (!string.IsNullOrEmpty(_strEnglishInterests) && lang == "ENGLISH")
            {
                foreach (var interest in new HashSet<string>(_strEnglishInterests.Replace(",", ";").Split(';')).ToList())
                    dictInterests.Add(interest, true);

                if (!string.IsNullOrEmpty(_strFrenchInterests))  // remove french interests
                {
                    foreach (var interest in new HashSet<string>(_strFrenchInterests.Replace(",", ";").Split(';')).ToList())
                        dictInterests.Add(interest, false);
                }
            }

            if (!string.IsNullOrEmpty(_strFrenchInterests) && lang == "FRENCH")
            {
                foreach (var interest in new HashSet<string>(_strFrenchInterests.Replace(",", ";").Split(';')).ToList())
                    dictInterests.Add(interest, true);

                if (!string.IsNullOrEmpty(_strEnglishInterests)) // remove english interests
                {
                    foreach (var interest in new HashSet<string>(_strEnglishInterests.Replace(",", ";").Split(';')).ToList())
                        dictInterests.Add(interest, false);
                }
            }


            if (lang == "FRENCH")
                _dictFrenchInterests = dictInterests;
            else
                _dictEnglishInterests = dictInterests;

            return dictInterests;
        }

        public List<string> GetMailChimpListIds()
        {
            if (string.IsNullOrEmpty(_listIDs))
                throw new Exception("Connection string is not set.");            

            return new HashSet<string>(_listIDs.Replace(",",";").Split(';')).ToList();
        }      

        public async Task<List<MCAPICallResponse>> AddContact(string listId, MCMemberRequest mcReq)
        {
            mcReq.status = "subscribed";
            await SetLanguageInterests(listId, mcReq);
            return await CallMailChimpAPI($"{_API30UrlRoot}lists/{listId}/members/", "POST", _apiKey, mcReq);
        }

        public async Task<List<MCAPICallResponse>> PutContactAllLists(MCMemberRequest mcReq)
        {
            List<string> listIds = GetMailChimpListIds();
            List<MCAPICallResponse> apiResps = new List<MCAPICallResponse>();
            foreach (var listId in listIds)
                apiResps.AddRange(await PutContact(listId, mcReq));

            return apiResps;
        }

        public async Task<List<MCAPICallResponse>> PutContact(string listId, MCMemberRequest mcReq)
        {
            string subscriberHash = CHOUtils.MD5Hash(mcReq.email_address.ToLower());
            await SetLanguageInterests(listId, mcReq);
            return await CallMailChimpAPI($"{_API30UrlRoot}lists/{listId}/members/{subscriberHash}", "PUT", _apiKey, mcReq);
        }

        public async Task<List<MCAPICallResponse>> UpdateContactAllLists(MCMemberRequest mcReq)
        {
            List<string> listIds = GetMailChimpListIds();
            List<MCAPICallResponse> apiResps = new List<MCAPICallResponse>();
            foreach (var listId in listIds)
                apiResps.AddRange(await PutContact(listId, mcReq));

            return apiResps;
        }

        public async Task<List<MCAPICallResponse>> DeleteContact(string listId, string email)
        {
            string subscriberHash = CHOUtils.MD5Hash(email.ToLower());
            string apiUrl = $"{_API30UrlRoot}lists/{listId}/members/{subscriberHash}";
            MCAPICallResponse apiResp = new MCAPICallResponse();

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("apikey", _apiKey);

                try
                {
                    var response = await client.DeleteAsync(apiUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        apiResp.statusCode = (int) HttpStatusCode.OK;
                    }
                    else
                    {
                        apiResp.msg = await response.Content.ReadAsStringAsync();
                        apiResp.statusCode = (int)response.StatusCode;
                    }
                }
                catch (WebException wex)
                {
                    apiResp.statusCode = (int)HttpStatusCode.InternalServerError;
                    apiResp.msg = wex.ToString();

                    if (wex.Status == WebExceptionStatus.ProtocolError)
                    {
                        var response = wex.Response as HttpWebResponse;
                        if (response != null)
                        {
                            apiResp.statusCode = (int)response.StatusCode;
                            apiResp.msg = wex.ToString();
                        }
                    }
                }
                catch (Exception ex)
                {
                    apiResp.statusCode = (int)HttpStatusCode.InternalServerError;
                    apiResp.msg = ex.ToString();
                }
            }

            return new List<MCAPICallResponse>() { apiResp };
        }

        public async Task<List<MCAPICallResponse>> DeleteContactAllLists(string email)
        {
            List<string> listIds = GetMailChimpListIds();
            List<MCAPICallResponse> apiResps = new List<MCAPICallResponse>();
            foreach (var listId in listIds)
                apiResps.AddRange(await DeleteContact(listId, email));

            return apiResps;
        }

        public async Task<List<MCAPICallResponse>> GetContact(string listId, string email)
        {
            string subscriberHash = CHOUtils.MD5Hash(email.ToLower());
            string apiUrl = $"{_API30UrlRoot}lists/{listId}/members/{subscriberHash}";
            MCAPICallResponse apiResp = new MCAPICallResponse();

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("apikey", _apiKey);

                try
                {
                    var response = await client.GetAsync(apiUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        apiResp.statusCode = (int) HttpStatusCode.OK;
                        apiResp.mcMembers = new List<MCMemberResponse>() { JsonConvert.DeserializeObject<MCMemberResponse>(await response.Content.ReadAsStringAsync()) };
                    }
                    else
                    {
                        apiResp.msg = await response.Content.ReadAsStringAsync();
                        apiResp.statusCode = (int)response.StatusCode;
                    }
                }
                catch(Exception ex)
                {
                    apiResp.statusCode = (int)HttpStatusCode.InternalServerError; ;

                    apiResp.msg = ex.ToString();
                }

                return new List<MCAPICallResponse>() { apiResp };
            }
        }      

        public async Task<List<MCAPICallResponse>> UpdateCharityProfileAllLists(List<string> adminEmails, MergeFields mfCharity, bool ifUpdateDonationDate = false)
        {
            List<string> listIds = GetMailChimpListIds();
            List<MCAPICallResponse> apiRespsAll = new List<MCAPICallResponse>();

            foreach (var listId in listIds)
            {
                var resps = await UpdateCharityProfile(listId, adminEmails, mfCharity, ifUpdateDonationDate);
                if (resps != null)
                    apiRespsAll.AddRange(resps);
            }

            return apiRespsAll;
        }

        public async Task<List<MCAPICallResponse>> UpdateCharityProfile(string listId, List<string> adminEmails, MergeFields mfCharity, bool ifUpdateDonationDate = false)
        {
            int charityId = mfCharity.CHARITYID ?? -1;
            if (charityId < 1)
                return null;
            
            if (adminEmails == null || adminEmails.Count == 0)
                return null;

            List<MCAPICallResponse> apiResps = new List<MCAPICallResponse>();
            MCMemberRequest mcReq = new MCMemberRequest();
            MergeFields mf = new MergeFields();
            mcReq.merge_fields = mf;

            foreach (var email in adminEmails)
            {
                mcReq.email_address = email;
                UpdateMergeFieldsCharityInfo(mcReq.merge_fields, mfCharity, ifUpdateDonationDate);
                apiResps.AddRange(await PutContact(listId, mcReq));
            }

            return apiResps;
        }

        public static void UpdateMergeFieldsCharityInfo(MergeFields mf, MergeFields mfCharity, bool ifUpdateDonationDate = false)
        {
            mf.BN = mfCharity.BN;
            mf.ADDRESS1 = mfCharity.ADDRESS1;
            mf.ADDRESS2 = mfCharity.ADDRESS2;
            mf.CITY = mfCharity.CITY;
            mf.PROVINCE = mfCharity.PROVINCE;
            mf.POSTALCODE = mfCharity.POSTALCODE;
            mf.COUNTRY = mfCharity.COUNTRY;
            mf.CHARITYID = mfCharity.CHARITYID;
            mf.CHARITYNAM = mfCharity.CHARITYNAM;
            mf.ACCNTTYPE = mfCharity.ACCNTTYPE;
            mf.REGISTDATE = mfCharity.REGISTDATE;
            mf.LANGPREFER = mfCharity.LANGPREFER;
            mf.EFT = mfCharity.EFT;

            if (ifUpdateDonationDate)
                mf.DONATEDATE = string.IsNullOrEmpty(mfCharity.DONATEDATE) ? DateTime.Now.ToString("MM/dd/yyyy") : mfCharity.DONATEDATE;
        }

        private async Task<List<MCAPICallResponse>> CallMailChimpAPI(string apiUrl, string method, string apiKey, MCMemberRequest mcReq)
        {
            method = method.ToUpper();

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("apikey", apiKey);
                MCAPICallResponse apiResp = new MCAPICallResponse();

                try
                {
                        string json = JsonConvert.SerializeObject(mcReq);
                        var request = new HttpRequestMessage(new HttpMethod(method), apiUrl)
                        {
                            Content = new StringContent(json, Encoding.UTF8, "application/json")
                        };

                    var response = await client.SendAsync(request);
                    string retStr = await response.Content.ReadAsStringAsync();
                    apiResp.statusCode = (int)response.StatusCode;
                    apiResp.isSuccessStatusCode = response.IsSuccessStatusCode;

                    if (response.IsSuccessStatusCode)
                    {
                        if (retStr.IndexOf("[") == 0)
                            apiResp.mcMembers = JsonConvert.DeserializeObject<List<MCMemberResponse>>(retStr);
                        else
                        {
                            apiResp.mcMembers = new List<MCMemberResponse>() { JsonConvert.DeserializeObject<MCMemberResponse>(retStr) };
                        }
                    }
                    else
                    {
                        apiResp.msg = retStr;
                    }
                }
                catch (WebException wex)
                {
                    apiResp.statusCode = (int)HttpStatusCode.InternalServerError;
                    apiResp.msg = wex.ToString();
                }
                catch (Exception ex)
                {
                    apiResp.statusCode = (int)HttpStatusCode.InternalServerError;
                    apiResp.msg = ex.ToString();
                }

                return new List<MCAPICallResponse>() { apiResp };
            }
        }

        public static string AnalyzeMCAPICallResponse(string action, string jsonSent, List<MCAPICallResponse> apiResps)
        {
            int apiCalls = apiResps.Count;
            int apiCallSuccesses = 0;
            string messages = "";

            foreach (var resp in apiResps)
            {
                if (resp.isSuccessStatusCode)
                    apiCallSuccesses++;
                else
                {
                    messages += resp.msg + "; ";
                }
            }

            if (messages == "" && apiResps.Count > 0)
                messages = "OK.";
            else if (apiResps.Count == 0)
                messages = "No API response returned.";
            else if (messages.Length >= 2)
                messages = messages.Substring(0, messages.Length - 2);

            return $"{apiCallSuccesses} succeeded out of {apiCalls} MailChimp API response(s). Action: {action}. Processed object: {jsonSent}.  Details: {messages}";
        }
    }
}
