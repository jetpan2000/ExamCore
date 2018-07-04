using CHO461.Controllers;
using Moq;
using System.Web.Mvc;
using Xunit;

namespace CHO461.Tests
{
    public class HomeControllerTests
    {
        [Fact, Trait("DonorDashboard", "Controller")]
        public void ActionRedirectTest()
        {
            // arrange
            var controller = CreateHomeControllerWithSetURL("https://localhost:8443/");
            // Act
            ActionResult result = controller.Redirect();
            // Assert            
            RedirectResult routeResult = result as RedirectResult;
            Assert.Equal(routeResult.Url, "https://localhost");

        }

        HomeController CreateHomeControllerWithSetURL(string urlHost)
        {

            var mock = new Mock<ControllerContext>();
            mock.SetupGet(p => p.HttpContext.Request.Url).Returns(new System.Uri(urlHost));

            var controller = new HomeController();
            controller.ControllerContext = mock.Object;

            return controller;
        }
    }
}
