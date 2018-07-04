using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CHOCore.Site.Components
{
    public class MainTab: ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View();
        }
    }
}
