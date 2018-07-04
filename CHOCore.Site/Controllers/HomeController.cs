using CHOCore.Site.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace CHOCore.Controllers
{
    public class HomeController : LangController
    {
        // GET: Home
        public ActionResult Redirect()
        {
            return new NotFoundResult();
        }

        public ActionResult RedirectToDefaultLanguage()
        {
            return new NotFoundResult();
        }
    }
}