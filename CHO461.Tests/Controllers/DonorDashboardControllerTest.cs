using CHO461.Controllers;
using System.Web.Mvc;
using Xunit;

namespace CHO461.Tests.Controllers
{
    public class DonorDashboardControllerTest
    {
        [Trait("DonorDashboard", "Controller"), Fact]
        public void Index()
        {
            // Arrange
            var controller = new DonorDashboardController();

            // Act
            var result = controller.Index() as ViewResult;

            // Assert            
            Assert.NotNull(result);
            Assert.Equal("Donor Dashboard Home Page", result.ViewBag.Message);
        }
    }
}
