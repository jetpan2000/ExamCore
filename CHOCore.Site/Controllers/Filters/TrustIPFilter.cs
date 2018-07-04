using CHOCore.Site;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System;
using CHOCore.Controllers.MailChimp;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using CHOStandard.MailChimp.Models;

namespace CHOCore.Controllers.Filters
{
    public class TrustedIPOnly : ActionFilterAttribute
    {
        private readonly MailChimpAppSettings _appSettings;
        private static ILogger<MailChimpController> _logger;
        static Dictionary<string, string> _allowableHosts = new Dictionary<string, string>();

        public static Dictionary<string, string> TrustedIPs
        {
            get
            {
                return _allowableHosts;
            }
        }

        public TrustedIPOnly(IOptions<MailChimpAppSettings> options, ILogger<MailChimpController> logger)
        {
            _appSettings = options.Value;

            if (_logger == null)
                _logger = logger;

            if (_allowableHosts.Count == 0)
                lock (_allowableHosts)
                    loadHosts(_appSettings.MailChimp.WhiteIpList);
        }

        public bool isTrustedIP(string host)
        {
            if (_allowableHosts.Count == 0)
                lock (_allowableHosts)
                    loadHosts(_appSettings.MailChimp.WhiteIpList);

            if (_allowableHosts.ContainsKey(host.ToLower())) return true;

            return false;
        }

        protected static void loadHosts(string trustedIPs)
        {
            if (_allowableHosts == null) _allowableHosts = new Dictionary<string, string>();

            string[] hostArray = trustedIPs.Split(new char[] { ';' });
            foreach (string host in hostArray)
                if (!_allowableHosts.ContainsKey(host))
                    _allowableHosts.Add(host, host);

            try
            {
                if (!_allowableHosts.ContainsKey("::1")) _allowableHosts.Add("::1", "::1");
                if (!_allowableHosts.ContainsKey("localhost")) _allowableHosts.Add("localhost", "localhost");
                if (!_allowableHosts.ContainsKey("127.0.0.1")) _allowableHosts.Add("127.0.0.1", "127.0.0.1");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Loading trusted hostIPs error: {ex.Message}");
            }
        }


        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            var ip = actionContext.HttpContext.Connection.RemoteIpAddress.ToString();

            if (!isTrustedIP(ip))
            {
                _logger.LogWarning($"Untrusted IP access:{ip}");
                actionContext.Result = new UnauthorizedResult();
            }
            base.OnActionExecuting(actionContext);
        }
    }
}
