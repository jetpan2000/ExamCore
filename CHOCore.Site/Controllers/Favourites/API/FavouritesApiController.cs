using System;
using CHOCore.Controllers.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using CHOCore.Models.General.EF;
using Microsoft.AspNetCore.Http;
using CHOCore.ModelLibrary.Favorite.BusinessLayer;
using CHOCore.ModelLibrary.Favourite.Models;
using System.Collections.Generic;
using System.Linq;
using CHOCore.Site.Utils;
using CHOCore.ModelLibrary.Favourite.EF;

namespace CHOCore.Site.Controllers.Favourites.API
{
    [Route("Favourites/")]
    public class FavouritesApiController : Controller
    {
        static string _directDBConnectionString;
        readonly ILogger<FavouritesApiController> _logger;
        static DbContextOptionsBuilder _optionsBuilder = new DbContextOptionsBuilder<ApplicationSettingsDBContext>();
        private FavouritesContext _context;

        public FavouritesApiController(IConfiguration configuration,
             FavouritesContext context,
            ILogger<FavouritesApiController> logger = null)
        {
            _directDBConnectionString = configuration["connectionstrings:MSSQL.Main"];
            _optionsBuilder.UseSqlServer(_directDBConnectionString);
            _logger = logger;
            _context = context;
        }

        [LoginRequired("Donor")]
        [HttpGet("check/{charityID}")]
        public IActionResult CheckAvailability(int charityID)
        {
            var donorID = HttpContext.Items["DonorID"] as int?;
            if (donorID.HasValue)
            {
                try
                {
                    var obj = _context.DonorFavouriteCharities.FirstOrDefault(x => x.CharityID == charityID && x.DonorID == donorID);
                    if(obj == null)
                    {
                        return BadRequest();
                    }
                    return Ok(new { exist = (obj.Deleted == 1) ? false : true });
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, $"Error while Retrieving existence record: {donorID}");
                    return StatusCode(500);
                }
            }
            else
            {
                return Unauthorized();
            }
        }

        [LoginRequired("Donor")]
        [HttpGet("all")]
        public IActionResult GetListOfFavouritesForDonor()
        {
            var donorID = HttpContext.Items["DonorID"] as int?;
            if (donorID.HasValue)
            {
                try
                {
                    var result = FavouritesHelper.reshapeData(new DonorFavourites(donorID.Value, _directDBConnectionString).toList());
                    return Ok(result);
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, $"Error while ListOfFavouritesByDonorID, donorID: {donorID}");
                    return StatusCode(500);
                }
            }
            else
            {
                return Unauthorized();
            }
        }

        [LoginRequired("Donor")]
        [HttpDelete("remove/{charityID}")]
        public IActionResult DeleteCharityFromFavouriteList([FromRoute]int charityID)
        {
            var donorID = HttpContext.Items["DonorID"] as int?;
            if (donorID.HasValue)
            {
                try
                {
                    if(charityID == 0)
                    {
                        return BadRequest();
                    }
                    new DonorFavourites(donorID.Value, _directDBConnectionString).remove(charityID);
                    return NoContent();
                }
                catch(Exception ex)
                {
                    _logger?.LogError(ex, $"Error while Deleting Charity, donorID: {donorID}");
                    return StatusCode(500);
                }
            }
            else
            {
                return Unauthorized();
            }
        }

        [LoginRequired("Donor")]
        [HttpPost("add")]
        public IActionResult AddCharityToFavouriteList([FromBody]int charityID)
        {
            var donorID = HttpContext.Items["DonorID"] as int?;
            if (donorID.HasValue)
            {
                try
                {
                    if (charityID == 0)
                    {
                        return BadRequest();
                    }
                    new DonorFavourites(donorID.Value, _directDBConnectionString).add(charityID);
                    return StatusCode(201);
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, $"Error while inserting charity to favourite, donorID: {donorID}");
                    return StatusCode(500);
                }
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost("noauthadd")]
        public IActionResult AddCharityToFavouriteList(int charityID, int donorID)
        {
            try
            {
                if (charityID == 0 || donorID == 0)
                {
                    return BadRequest();
                }
                new DonorFavourites(donorID, _directDBConnectionString).add(charityID);
                return StatusCode(201);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, $"Error while inserting charity to favourite, donorID: {donorID}");
                return StatusCode(500);
            }
        }
    }
}
