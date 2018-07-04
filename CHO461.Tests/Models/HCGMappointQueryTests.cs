using CHO461.Models.DonorDashboard.QueryModels;
using Xunit;

namespace CHO461.Tests.Models
{
    public class HCGMappointQueryTests
    {
        [Trait("DonorDashboard", "Model"), Trait("Integration", "Database"), Fact]
        public void TestGivingAreaQuery_GetAll_Integration()
        {
            var mappointQuery = new HCGMappointQuery();
            var result = mappointQuery.GetAll();

            Assert.NotEqual(result, null);
        }
    }
}