using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Localization.Routing;
using Microsoft.AspNetCore.Routing;
using System.Collections.Generic;
using System.Globalization;

namespace CHOCore.Site
{
    public class LanguageRouteConstraint : IRouteConstraint
    {
        public bool Match(HttpContext httpContext, IRouter route, string routeKey, RouteValueDictionary values, RouteDirection routeDirection)
        {

            if (!values.ContainsKey("lang"))
            {
                return false;
            }

            var lang = values["lang"].ToString();

            return lang == "fr" || lang == "en";
        }
    }

    public class LocalizationPipeline
    {
        public void Configure(IApplicationBuilder app)
        {

            var supportedCultures = new List<CultureInfo>
                                {
                                    new CultureInfo("fr"),
                                    new CultureInfo("en"),                                    
                                };

            var options = new RequestLocalizationOptions()
            {

                DefaultRequestCulture = new RequestCulture(culture: "en", uiCulture: "en"),
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures,
            };
            var provider = new RouteDataRequestCultureProvider
            {
                RouteDataStringKey = "lang",
                UIRouteDataStringKey = "lang",
                Options = options
            };
            options.RequestCultureProviders = new[] { provider };

            app.UseRequestLocalization(options);
        }
    }
}
