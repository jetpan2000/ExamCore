using Microsoft.Extensions.Configuration;
using System;
using System.Text;

namespace CHOCore.Site.Utils
{
    public static class CacheBuster
    {
        public static string VersionString(IConfiguration configuration)
        {
            return configuration["ApplicationVersion"] + configuration["VersionStub"];
        }

        public static string ServerVersionString(IConfiguration configuration)
        {
            return Environment.MachineName + ":" + VersionString(configuration);
        }
        public static string VersionStub(IConfiguration configuration)
        {
            return configuration["VersionStub"];
        }
    }
}
