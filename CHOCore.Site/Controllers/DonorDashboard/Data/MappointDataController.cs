using CHOCore.Models.DonorDashboard.EF;
using CHOCore.Models.DonorDashboard.QueryModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CHOCore.Controllers.DonorDashboard.Data
{
    //HCG - How Canadians Give
    [Route("DonorDashboard/Data/HCG/Mappoint")]
    public class MappointDataController : Controller
    {
        static string _directDBConnectionString;
        static DbContextOptionsBuilder _optionsBuilder = new DbContextOptionsBuilder<DonorDashboardContext>();

        public MappointDataController(IConfiguration configuration) : base()
        {
            _directDBConnectionString = configuration["connectionstrings:MSSQL.Main"];
            _optionsBuilder.UseSqlServer(_directDBConnectionString);
        }
        [HttpGet("")]
        public ActionResult GetAll()
        {
            return Json(new HCGMappointQuery(_optionsBuilder.Options).GetAll());
        }
    }
}