using CHO461.Models.DonorDashboard.QueryModels;
using Xunit;

namespace CHO461.Tests.Models
{
    public class GivingAreaQueryTests
    {
        [Trait("DonorDashboard", "Model"), Trait("Integration","Database"),  Fact]
        public void TestGivingAreaQuery_GetAll_Integration()
        {
            var givingAreaQuery = new GivingAreaQuery();
            var result = givingAreaQuery.GetAll();

            Assert.NotEqual(result, null);
        }
    }
}
