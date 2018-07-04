using CHOCore.Site.ViewModels;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace CHOCore.Site.Utils
{
    public static class CapchaHelper
    {
        public static async Task<CaptchaVerification> VerifyCaptcha(string captchaResponse, string key)
        {

            var payload = string.Format("&secret={0}&remoteip={1}&response={2}", key, string.Empty, captchaResponse);

            var client = new HttpClient();
            client.BaseAddress = new Uri("https://www.google.com");
            var request = new HttpRequestMessage(HttpMethod.Post, "/recaptcha/api/siteverify");
            request.Content = new StringContent(payload, Encoding.UTF8, "application/x-www-form-urlencoded");
            var response = await client.SendAsync(request);
            return JsonConvert.DeserializeObject<CaptchaVerification>(response.Content.ReadAsStringAsync().Result);
        }
    }
}
