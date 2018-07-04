using CHO461.Models.DonorDashboard.CommandModels;
using CHO461.Models.DonorDashboard.QueryModels;
using System;
using Xunit;

namespace CHO461.Tests.Models
{
    public class MyGivingQueryCommandTests
    {
        [Trait("DonorDashboard", "Model"), Trait("Integration", "Database"), Fact]
        public void AddingDonorGoalTest()
        {
            var myGivingCommand = new MyGivingCommand();
            myGivingCommand.UpdateDonationGoal(12345, 2017, 100);
            myGivingCommand.UpdateDonationGoal(12345, 2016, 200);
            myGivingCommand.UpdateDonationGoal(12345, 2015, 300);
            var myGivingQuery = new MyGivingQuery();
            var result = myGivingQuery.GetDonationGoals(12345,3);

            var result2017 = result.Find(o => o.Year == 2017);
            var result2016 = result.Find(o => o.Year == 2016);
            var result2015 = result.Find(o => o.Year == 2015);

            Assert.Equal(100, result2017.Goal);
            Assert.Equal(200, result2016.Goal);
            Assert.Equal(300, result2015.Goal);
        }

        [Trait("DonorDashboard", "Model"), Trait("Integration", "Database"), Fact]
        public void DeleteDonationGoalTest()
        {
            var myGivingCommand = new MyGivingCommand();
            myGivingCommand.UpdateDonationGoal(12345, 2017, 100);
            myGivingCommand.UpdateDonationGoal(12345, 2016, 200);
            myGivingCommand.UpdateDonationGoal(12345, 2015, 300);
            myGivingCommand.RemoveDonationGoal(12345, 2017);
            myGivingCommand.RemoveDonationGoal(12345, 2016);
            myGivingCommand.RemoveDonationGoal(12345, 2015);

            var myGivingQuery = new MyGivingQuery();
            var result = myGivingQuery.GetDonationGoals(12345, 3);

            var result2017 = result.Find(o => o.Year == 2017);
            var result2016 = result.Find(o => o.Year == 2016);
            var result2015 = result.Find(o => o.Year == 2015);

            Assert.Equal(null, result2017);
            Assert.Equal(null, result2016);
            Assert.Equal(null, result2015);
        }
        [Trait("DonorDashboard", "Model"), Trait("Integration", "Database"), Fact]
        public void AddingDonorNonCHDonationTest()
        {
            var myGivingCommand = new MyGivingCommand();
            myGivingCommand.UpdateNonCHDonationTotal(12345, 2017, 100);
            myGivingCommand.UpdateNonCHDonationTotal(12345, 2016, 200);
            myGivingCommand.UpdateNonCHDonationTotal(12345, 2015, 300);
            var myGivingQuery = new MyGivingQuery();
            var result = myGivingQuery.GetNonCHDonationTotal(12345, 3);

            var result2017 = result.Find(o => o.Year == 2017);
            var result2016 = result.Find(o => o.Year == 2016);
            var result2015 = result.Find(o => o.Year == 2015);

            Assert.Equal(100, result2017.Total);
            Assert.Equal(200, result2016.Total);
            Assert.Equal(300, result2015.Total);
        }

        [Trait("DonorDashboard", "Model"), Trait("Integration", "Database"), Fact]
        public void DeleteDonationNonCHDonationTest()
        {
            var myGivingCommand = new MyGivingCommand();
            myGivingCommand.UpdateNonCHDonationTotal(12345, 2017, 100);
            myGivingCommand.UpdateNonCHDonationTotal(12345, 2016, 200);
            myGivingCommand.UpdateNonCHDonationTotal(12345, 2015, 300);
            myGivingCommand.RemoveNonCHDonationTotal(12345, 2017);
            myGivingCommand.RemoveNonCHDonationTotal(12345, 2016);
            myGivingCommand.RemoveNonCHDonationTotal(12345, 2015);

            var myGivingQuery = new MyGivingQuery();
            var result = myGivingQuery.GetNonCHDonationTotal(12345, 3);

            var result2017 = result.Find(o => o.Year == 2017);
            var result2016 = result.Find(o => o.Year == 2016);
            var result2015 = result.Find(o => o.Year == 2015);

            Assert.Equal(null, result2017);
            Assert.Equal(null, result2016);
            Assert.Equal(null, result2015);
        }
        [Trait("DonorDashboard", "Model"), Trait("Integration", "Database"), Fact]
        public void CalculateAndCheckDonationTotalTest()
        {
            var myGivingCommand = new MyGivingCommand();
            myGivingCommand.RefreshDonorDonationTotals("data source=sql2-dev;initial catalog=CanadaHelps_Dev;integrated security=True;MultipleActiveResultSets=True", 200571, 0);
            var myGivingQuery = new MyGivingQuery();
            var result = myGivingQuery.GetDonationTotal(200571);

            Assert.NotNull(result);
        }

        [Trait("DonorDashboard", "Model"), Trait("Integration", "Database"), Fact]
        public void CalculateAndGetMyGivingDataForDonorTest()
        {
            var myGivingCommand = new MyGivingCommand();
            myGivingCommand.UpdateDonationGoal(200571, 2017, 400);
            myGivingCommand.UpdateDonationGoal(200571, 2016, 500);
            myGivingCommand.UpdateDonationGoal(200571, 2015, 600);
            myGivingCommand.RefreshDonorDonationTotals("data source=sql2-dev;initial catalog=CanadaHelps_Dev;integrated security=True;MultipleActiveResultSets=True", 200571, 0);
            myGivingCommand.UpdateNonCHDonationTotal(200571, 2017, 100);
            myGivingCommand.UpdateNonCHDonationTotal(200571, 2016, 200);
            myGivingCommand.UpdateNonCHDonationTotal(200571, 2015, 300);

            var myGivingQuery = new MyGivingQuery();
            var result = myGivingQuery.GetData(200571);


            var result2017 = result.Find(o => o.Year == 2017);
            var result2016 = result.Find(o => o.Year == 2016);
            var result2015 = result.Find(o => o.Year == 2015);
            var result2014 = result.Find(o => o.Year == 2014);
            var result2013 = result.Find(o => o.Year == 2013);
            var result2018 = result.Find(o => o.Year == 2018);

            Assert.Equal(400, result2017.Goal);
            Assert.Equal(500, result2016.Goal);
            Assert.Equal(600, result2015.Goal);
            Assert.Equal(100, result2017.DonationNonCHTotal);
            Assert.Equal(200, result2016.DonationNonCHTotal);
            Assert.Equal(300, result2015.DonationNonCHTotal);
            Assert.True(result2017.DonationTotal != 0);
            Assert.True(result2016.DonationTotal != 0);
            Assert.NotNull(result2018);
            Assert.NotNull(result2013);
            Assert.NotNull(result2014);

        }
    }
}