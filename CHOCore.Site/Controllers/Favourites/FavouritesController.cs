using CHOCore.Controllers.Filters;
using CHOCore.ModelLibrary.Favorite.BusinessLayer;
using CHOCore.ModelLibrary.Favourite.Models;
using CHOCore.Site;
using CHOCore.Site.Controllers;
using CHOCore.Site.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CHOCore.Controllers
{
    [MiddlewareFilter(typeof(LocalizationPipeline))]
    [LoginRequired("donor", "SignIn.aspx")]
    public class FavouritesController : LangController
    {
        private readonly ILogger<FavouritesController> _logger;
        private IConfiguration _configuration;
        static string _directDBConnectionString;
        private readonly IStringLocalizer<FavouritesController> _localizer;

        public FavouritesController(IConfiguration configuration,
            IStringLocalizer<FavouritesController> localizer,
            ILogger<FavouritesController> logger = null)
        {
            _logger = logger;
            _configuration = configuration;
            _localizer = localizer;
            _directDBConnectionString = configuration["connectionstrings:MSSQL.Main"];
        }
        public IActionResult Index()
        {
            ViewBag.Message = "CanadaHelps - Your Favourites";
            ViewBag.App = "Favourites";
            ViewBag.Lang = CurrentLanguage;
            ViewBag.Version = CacheBuster.VersionString(_configuration);
            ViewBag.ServerVersion = CacheBuster.ServerVersionString(_configuration);
            Dictionary<string, dynamic> dicFavouritesSettings = new Dictionary<string, dynamic>();

            var donorID = HttpContext.Items["DonorID"] as int?;
            if (donorID.HasValue)
            {
                try
                {
                    var result = FavouritesHelper.reshapeData(new DonorFavourites(donorID.Value, _directDBConnectionString).toList());
                    dicFavouritesSettings.Add("favouritesItems", result);
                    dicFavouritesSettings.Add("favouriteItemsHasError", "");
                    dicFavouritesSettings.Add("favouriteItemsLoading", false);
                    ViewBag.favouritesSerializedItems = JsonConvert.SerializeObject(dicFavouritesSettings);
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, $"Error while ListOfFavouritesByDonorID, donorID: {donorID}");
                    dicFavouritesSettings.Add("favouritesItems", "{}");
                    dicFavouritesSettings.Add("favouriteItemsHasError", _localizer["FavouriteApiErrorMessage"].Value);
                    dicFavouritesSettings.Add("favouriteItemsLoading", false);
                    ViewBag.favouritesSerializedItems = JsonConvert.SerializeObject(dicFavouritesSettings);
                }
            }
            return View();
        }

    }
}
