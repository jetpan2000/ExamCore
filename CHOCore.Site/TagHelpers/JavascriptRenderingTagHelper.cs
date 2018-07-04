
using CHOCore.Site.Enums;
using CHOCore.Site.Utils;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;

namespace CHOCore.Site.TagHelpers
{
    [HtmlTargetElement("scripts", Attributes="lang")]
    public class JavascriptRenderingTagHelper : TagHelper
    {
        [HtmlAttributeName("lang")]
        public string Language { get; set; }

        [HtmlAttributeNotBound]
        [ViewContext]
        public ViewContext ViewContext { get; set; }

        private IConfiguration _configuration;
        private IHostingEnvironment _env;
        public JavascriptRenderingTagHelper(IConfiguration configuration, IHostingEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            string version = CacheBuster.VersionString(_configuration);
            string minVersion = string.Empty;
            if (!_env.IsEnvironment("Development") && 
                !_env.IsEnvironment("Beta") && 
                !_env.IsEnvironment("Feature") && 
                !_env.IsEnvironment("BetaV2"))
                minVersion = ".min";
            var viewPath = ((RazorView)ViewContext.View).Path;
            Dictionary<string, string> jsScriptTags = new Dictionary<string, string>();
            jsScriptTags.Add("canadahelpsjs", "<script src=\"/secure/js/canadahelps" + minVersion + ".js?v=" + version + "\">" + "</script>");
            jsScriptTags.Add("commonjs", "<script src=\"/secure/js/common" + minVersion + ".js?v=" + version + "\">" + "</script>");
            if (viewPath.IndexOf(ApplicationName.DonorDashBoard.ToString(), StringComparison.InvariantCultureIgnoreCase) > 0)
            {
                jsScriptTags.Add("ch_donordashboardjs", "<script src=\"/secure/js/ch_donordashboard" + minVersion + ".js?v=" + version + "\">" + "</script>");
                jsScriptTags.Add("ch_discoveryjs", "<script src=\"/secure/js/ch_discovery" + minVersion + ".js?v=" + version + "\">" + "</script>");
            }
            else if (viewPath.IndexOf(ApplicationName.Favourites.ToString(), StringComparison.InvariantCultureIgnoreCase) > 0)
            {
                jsScriptTags.Add("ch_favouritejs", "<script src=\"/secure/js/ch_favourites" + minVersion + ".js?v=" + version + "\">" + "</script>");
            }

            foreach(var scriptTag in jsScriptTags)
            {
                output.PostContent.AppendHtml(scriptTag.Value);
            }
            base.Process(context, output);
        }
    }
}
