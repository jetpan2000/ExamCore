using CHOCore.Site.Enums;
using CHOCore.Site.Utils;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace CHOCore.Site.TagHelpers
{
    [HtmlTargetElement("styles", Attributes = "lang")]
    public class CssRenderingTagHelper:TagHelper
    {
        [HtmlAttributeName("lang")]
        public string Language { get; set; }

        [HtmlAttributeNotBound]
        [ViewContext]
        public ViewContext ViewContext { get; set; }

        private IConfiguration _configuration;

        public CssRenderingTagHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            string version = CacheBuster.VersionString(_configuration);
            var viewPath = ((RazorView)ViewContext.View).Path;
            Dictionary<string, string> CSSStyleTags = new Dictionary<string, string>();
            if (viewPath.IndexOf(ApplicationName.DonorDashBoard.ToString(), StringComparison.InvariantCultureIgnoreCase) > 0)
            {
                CSSStyleTags.Add("canadahelps", "<link rel=\"stylesheet\" type=\"text/css\" href=\"/secure/css/canadahelps.min.css?v=" + version + "\"/>");
            }
            else if (viewPath.IndexOf(ApplicationName.Favourites.ToString(), StringComparison.InvariantCultureIgnoreCase) > 0)
            {
                CSSStyleTags.Add("canadahelps", "<link rel=\"stylesheet\" type=\"text/css\" href=\"/secure/css/canadahelps.min.css?v=" + version + "\"/>");
                CSSStyleTags.Add("ch_favourite", "<link rel=\"stylesheet\" type=\"text/css\" href=\"/secure/css/app.ch_favourites.css?v=" + version + "\"/>");
            }

            foreach (var cssTag in CSSStyleTags)
            {
                output.PostContent.AppendHtml(cssTag.Value);
            }
            base.Process(context, output);
        }
    }
}
