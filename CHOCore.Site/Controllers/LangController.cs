using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;

namespace CHOCore.Site.Controllers
{
    /// <summary>
    /// How to use, use DonorDashboardController.cs as a template
    /// 1 - set base class to LangController
    /// 2 - add [MiddlewareFilter(typeof(LocalizationPipeline))] before the class definition as attribute
    /// 3 - profit.  All routes to the controller will work with /{lang}/, and those without defaults to en
    ///     and you'll have access to CurrentLanguage in your class
    /// </summary>
    public abstract class LangController : Controller
    {
        //TODO: Add automagic resource routing to this
        private string _currentLanguage;

        public string CurrentLanguage
        {
            get
            {
                if (!string.IsNullOrEmpty(_currentLanguage))
                    return _currentLanguage;

                var feature = HttpContext.Features.Get<IRequestCultureFeature>();
                _currentLanguage = feature.RequestCulture.Culture.TwoLetterISOLanguageName.ToLower();
                return _currentLanguage;
            }
        }
    }
}
