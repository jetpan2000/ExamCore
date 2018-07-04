using CHOCore.Models.DonorDashboard.EF;
using CHOCore.Models.General.QueryModels;
using CHOCore.Utilities.Session;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CHOCore.Site
{
    public static class SessionObj
    {

        public static string Get(string key, HttpRequest request)
        {
            var optionsBuilder = new DbContextOptionsBuilder<DonorDashboardContext>();            
            optionsBuilder.UseSqlServer(Startup.Configuration["ConnectionStrings:MSSQL.Main"]);
            string server = new ApplicationSettingQuery(optionsBuilder.Options).GetValue("UnifiedRedisServerIP");
            return UnifiedSession.Get(server, key, AuthHelper.GetSessionID(request));
        }

        public static string GetUserID(HttpRequest request)
        {
            return SessionObj.Get("UserID", request);
        }
    }
}