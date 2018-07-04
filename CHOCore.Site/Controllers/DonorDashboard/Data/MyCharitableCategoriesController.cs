using CHOCore.Controllers.Filters;
using CHOCore.Models.DonorDashboard.CommandModels;
using CHOCore.Models.DonorDashboard.EF;
using CHOCore.Models.DonorDashboard.MyCharitableCategories;
using CHOCore.Models.DonorDashboard.QueryModels;
using CHOCore.Models.DonorDashboard.WaysIGive;
using CHOCore.Models.General.QueryModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Authentication;
using System.Threading.Tasks;

namespace CHOCore.Controllers.DonorDashboard
{
    [Route("DonorDashboard/MyCharitableCategories")]
    [LoginRequired("Donor")]
    public class MyCharitableCategoriesController : Controller
    {
        static string _directDBConnectionString;
        readonly ILogger<MyCharitableCategoriesController> _logger;
        static DbContextOptionsBuilder _optionsBuilder = new DbContextOptionsBuilder<DonorDashboardContext>();

        public MyCharitableCategoriesController(IConfiguration configuration, ILogger<MyCharitableCategoriesController> logger = null) : base()
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
                    var donorDonationsByCharity = new WaysIGiveCommand(_optionsBuilder.Options).GetByDonorFilterless(_directDBConnectionString, donorID.Value);
                    var charityCategories = await GetCharityCategories(donorDonationsByCharity);
                    return Json(CalculateCategoryCount(donorDonationsByCharity, charityCategories)) as ActionResult;
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, $"Error while GetWaysIGive, donorID: {donorID}");
                    return new StatusCodeResult((int)HttpStatusCode.InternalServerError) as ActionResult;
                }
            }
            else
            {
                return Unauthorized();
            }
        }

        /// <summary>
        /// Returns a List of WaysIGiveData, but the category is not WaysIGive Categories, it is charity Categories
        /// </summary>
        /// <param name="donorDonationsByCharity"></param>  
        /// <param name="charityCategories"></param>
        /// <returns>a list of transactions sorted by its charity categories</returns>
        protected List<WaysIGiveCategoryData> CalculateCategoryCount(List<CharityTransactionData> donorDonationsByCharity, List<CharityCategories> charityCategories)
        {
            var ret = new List<WaysIGiveCategoryData>();
            foreach (var charityCategory in charityCategories)
                foreach (var categoryID in charityCategory.categoryIDs)
                    IncrementCountInCategory(ret, donorDonationsByCharity, categoryID, charityCategory.charityID, charityCategory.slug);

            return ret;
        }

        private void IncrementCountInCategory(List<WaysIGiveCategoryData> ret, List<CharityTransactionData> donorDonationsByCharity, int categoryID, int charityID, string slug)
        {
            WaysIGiveCategoryData categoryToIncrease;
            try
            {
                categoryToIncrease = ret.Where(cat => cat.categoryID.Equals(categoryID)).Single();
            }
            catch (InvalidOperationException)
            {
                categoryToIncrease = new WaysIGiveCategoryData();
                categoryToIncrease.categoryID = categoryID;
                ret.Add(categoryToIncrease);
            }

            var charityReference = donorDonationsByCharity.Where(c => c.charityID.Equals(charityID)).Single();
            categoryToIncrease.count += charityReference.transactionCount;
            categoryToIncrease.Charities.Add(new charity
                    { id = charityID,
                      name_en = charityReference.name_en,
                      name_fr = charityReference.name_fr,
                      slug = slug});
        }

        /// <summary>
        /// Returns a list of charities
        /// </summary>
        /// <param name="donorDonationsByCharity"></param>
        /// <returns>a list of charities and what categories they belong to</returns>
        protected async Task<List<CharityCategories>> GetCharityCategories(List<CharityTransactionData> donorDonationsByCharity)
        {
            var ret = new List<CharityCategories>();
            const int MAXCOUNT = 250;
            if (donorDonationsByCharity.Count == 0)
                return ret;

            string charityList = "";

            int count = 0;
            foreach (var charityTransactionData in donorDonationsByCharity)
            {
                charityList += ',' + charityTransactionData.charityID.ToString();                
                if (++count >= MAXCOUNT) break;
            }

            charityList = charityList.Substring(1);

            return await APICallToGetDjangoCategories(charityList);          
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
                    var result = new MyCharitableCategoriesQuery(_optionsBuilder.Options).GetListOfPercentagesForWays();
                    return Json(result);
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, $"Error while GetAllPercentages for MyCharitable Categories, donorID: {donorID}");
                    return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
                }
            }
            return new NotFoundResult();
        }

        public class CharityCategories
        {
            public int charityID { get; set; }
            public List<int> categoryIDs { get; set; } = new List<int>();
            public string slug { get; set; }
        }
    }
}
