using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using CHOCore.ModelLibrary.HealthCheck;
using Microsoft.Extensions.Configuration;
using CHOCore.Models.General.QueryModels;
using Microsoft.EntityFrameworkCore;
using CHOCore.Models.DonorDashboard.EF;

namespace CHOCore.Site.Controllers.Internal
{
    [Route("api/CoreSite/HealthCheck")]
    public class HealthCheckController : Controller
    {
        private static string _sqlMainConnectionString;

        public HealthCheckController(IConfiguration configuration) : base()
        {
            _sqlMainConnectionString = configuration["connectionstrings:MSSQL.Main"];
        }
        [HttpGet("")]
        public ActionResult Get()
        {
            var sqlDict = new Dictionary<string, string>();
            var optionsBuilder = new DbContextOptionsBuilder<DonorDashboardContext>();
            optionsBuilder.UseSqlServer(_sqlMainConnectionString);
            var redisServer = new ApplicationSettingQuery(optionsBuilder.Options).GetValue("UnifiedRedisServerIP");
            sqlDict.Add("Main SQLstring", _sqlMainConnectionString);
            return Json(HealthCheckInformation.GenerateChoCore(sqlDict, redisServer));
        }
    }
}