using CHOCore.Site;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System;
using CHOCore.Site.Controllers;

namespace CHOCore.Controllers.Filters
{
    public class LoginRequired : ActionFilterAttribute
    {
        string _rolefilter;
        string _redirectURLOnFail;
        /// <summary>
        /// This Attribute is for controllers that requires authentication
        /// </summary>
        /// <param name="role">DONOR, APIADMIN, CHARITYADMIN or CHNADAHELPSADMIN</param>
        /// <param name="redirectURLOnFail">if this is set, it will redirect to this url if auth fails</param>
        public LoginRequired(string role, string redirectURLOnFail = null)
        {
            _redirectURLOnFail = redirectURLOnFail;
            _rolefilter = (role == null) ? "" : role;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var allowedRoles = _rolefilter.Split(',');
            var success = false;

            var rolekeyContextNamePairs = new Dictionary<string, string> {
                                                                { "DONOR", "DonorID" },
                                                                { "APIADMIN", "APIAccountAdminID" },
                                                                { "CHARITYADMIN", "CharityAdminID" },
                                                                { "CANADAHELPSADMIN", "CanadaHelpsAdminID" },
                                                              };
            foreach (var role in allowedRoles)
                foreach (var roleKeyPair in rolekeyContextNamePairs)
                    if (role.ToUpper() == roleKeyPair.Key)
                        if (int.TryParse(SessionObj.Get(roleKeyPair.Value, filterContext.HttpContext.Request), out int sessionValue))
                        {
                            success = true;
                            filterContext.HttpContext.Items[roleKeyPair.Value] = sessionValue;
                        }

            if (success)
                base.OnActionExecuting(filterContext);
            else
                filterContext.Result = getFailedAuthActionResult(filterContext);
                
        }

        private IActionResult getFailedAuthActionResult(ActionExecutingContext filterContext)
        {
            if (string.IsNullOrEmpty(_redirectURLOnFail)) return new UnauthorizedResult();

            var lang = (filterContext.Controller is LangController)? (filterContext.Controller as LangController).CurrentLanguage : "en";

            return new RedirectResult($"/{lang}/{_redirectURLOnFail}");
        }
    }
}
