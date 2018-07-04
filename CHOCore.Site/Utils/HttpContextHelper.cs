using Microsoft.AspNetCore.Http;
using System;

namespace CHOCore.Site.Utils
{
    public class HttpContextHelper
    {
        public static bool IsMobile(HttpContext context)
        {
            DeviceType deviceType = UserAgentToDeviceType(context);
            if (deviceType.Equals(DeviceType.Phone) || deviceType.Equals(DeviceType.Tablet))
            {
                return true;
            }
            return false;
        }

        public static string GetRealIP(HttpContext context, string proxyAddresses)
        {
            string currentAddress = context.Connection.RemoteIpAddress.ToString();
            if (!context.Request.Headers.ContainsKey("HTTP_X_FORWARDED_FOR") || string.IsNullOrWhiteSpace(proxyAddresses))
                return currentAddress;

            string xforward = context.Request.Headers["HTTP_X_FORWARDED_FOR"];

            foreach (var proxyAddress in proxyAddresses.Split(new Char[] { ';' }))
            {
                if (proxyAddress == currentAddress)
                {
                    var delim = new Char[] { ',' };
                    var ip = xforward.Split(delim, 2);
                    if (ip[0] != null) currentAddress = ip[0];  //top address stack of x_forwarded_for                            
                }
            }
            return currentAddress;
        }


        public enum DeviceType
        {
            Desktop,
            Tablet,
            Phone
        }

        private static DeviceType UserAgentToDeviceType(HttpContext context)
        {
            //Coding too defensively here?
            if (null == context || context.Request == null || !context.Request.Headers.ContainsKey("HTTP_USER_AGENT"))
                return DeviceType.Desktop;

            string userAgent = context.Request.Headers["HTTP_USER_AGENT"];

            if (true == string.IsNullOrWhiteSpace(userAgent))
                return DeviceType.Desktop;

            return UserAgentToDeviceType(userAgent);
        }

        private static DeviceType UserAgentToDeviceType(string userAgent)
        {
            if (userAgent.ToLowerInvariant().Contains("blackberry"))
                return DeviceType.Phone;

            if (userAgent.ToLowerInvariant().Contains("iphone"))
                return DeviceType.Phone;

            if (userAgent.ToLowerInvariant().Contains("ipad"))
                return DeviceType.Tablet;

            if (userAgent.ToLowerInvariant().Contains("android"))
            {
                if (userAgent.ToLowerInvariant().Contains("mobile"))
                    return DeviceType.Phone;
                else
                    return DeviceType.Tablet;
            }
            return DeviceType.Desktop;
        }
    }
}
