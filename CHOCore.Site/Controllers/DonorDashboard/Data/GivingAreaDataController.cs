using CHOCore.Models.DonorDashboard.EF;
using CHOCore.Models.DonorDashboard.QueryModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CHOCore.Controllers.DonorDashboard.Data
{   
    [Route("DonorDashboard/Data/HCG/GivingArea")]
    public class GivingAreaDataController: Controller
    {

        static string _directDBConnectionString;
        static DbContextOptionsBuilder _optionsBuilder = new DbContextOptionsBuilder<DonorDashboardContext>();

        public GivingAreaDataController(IConfiguration configuration) : base()
        {
            _directDBConnectionString = configuration["connectionstrings:MSSQL.Main"];
            _optionsBuilder.UseSqlServer(_directDBConnectionString);
        }

        [HttpGet("")]
        public ActionResult GetAll()
        {
            return Json(new GivingAreaQuery(_optionsBuilder.Options).GetAll());
        }
    }
}