using CHO461.Controllers.DonorDashboard.Data;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Xunit;

namespace CHO461.Tests.Controllers
{
    public class GivingAreaDataControllerTest
    {
        [Trait("DonorDashboard", "Controller"), Fact]
        public void GetAll_Returns_JSON()
        {
            // Arrange
            var controller = new GivingAreaDataController();
            var js = new JavaScriptSerializer();
            // Act
            var result = controller.GetAll() as JsonResult;
            // Assert            
            Assert.NotNull(result);
            Assert.Equal(result.JsonRequestBehavior, JsonRequestBehavior.AllowGet);
        }
    }
}