using CHOCore.Controllers.Filters;
using CHOCore.Models.DonorDashboard.CommandModels;
using CHOCore.Models.DonorDashboard.EF;
using CHOCore.Models.DonorDashboard.MyGiving;
using CHOCore.Models.DonorDashboard.QueryModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;

namespace CHOCore.Controllers.DonorDashboard
{
    [Route("DonorDashboard/MyGiving")]
    [LoginRequired("Donor")]
    public class MyGivingController : Controller
    {
        private readonly ILogger<MyGivingController> _logger;
        static string _directDBConnectionString;
        static DbContextOptionsBuilder _optionsBuilder = new DbContextOptionsBuilder<DonorDashboardContext>();

        public MyGivingController(IConfiguration configuration, ILogger<MyGivingController> logger = null) : base()
        {
            _directDBConnectionString = configuration["connectionstrings:MSSQL.Main"];
            _logger = logger;
            _optionsBuilder.UseSqlServer(_directDBConnectionString);
        }

        [HttpPut, Route("year/{year:int:range(2000,2100)}/Goal/{amount:decimal:min(0)}")]
        public EmptyResult UpdateGoal(int year, decimal amount)
        {
            try
            {
                var donorID = HttpContext.Items["DonorID"] as int?;
                if (donorID.HasValue)
                    new MyGivingCommand(_optionsBuilder.Options).UpdateDonationGoal(donorID.Value, year, amount);
            }
            catch {}
            return new EmptyResult();
        }
        [HttpDelete, Route("year/{year:int:range(2000,2100)}/Goal")]
        public EmptyResult RemoveGoal(int year)
        {
            try
            {
                var donorID = HttpContext.Items["DonorID"] as int?;
                if (donorID.HasValue)
                    new MyGivingCommand(_optionsBuilder.Options).RemoveDonationGoal(donorID.Value, year);
            }
            catch {}
            return new EmptyResult();
        }

        [HttpPut, Route("year/{year:range(2000,2100)}/NonCHTotal/{amount:decimal:min(0)}")]
        public EmptyResult UpdateNonCHTotal(int year, decimal amount)
        {
            try
            {
                var donorID = HttpContext.Items["DonorID"] as int?;
                if (donorID.HasValue)
                    new MyGivingCommand(_optionsBuilder.Options).UpdateNonCHDonationTotal(donorID.Value, year, amount);
            }
            catch {}
            return new EmptyResult();
        }
        [HttpDelete, Route("year/{year:int:range(2000,2100)}/NonCHTotal")]
        public EmptyResult RemoveNonCHTotal(int year)
        {
            try
            {
                var donorID = HttpContext.Items["DonorID"] as int?;
                if (donorID.HasValue)
                    new MyGivingCommand(_optionsBuilder.Options).RemoveNonCHDonationTotal(donorID.Value, year);
            }
            catch {}
            return new EmptyResult();
        }

        [HttpGet, Route("data")]
        public ActionResult GetData()
        {
            var donorID = HttpContext.Items["DonorID"] as int?;
            if (donorID.HasValue)
            {
                try
                {
                    new MyGivingCommand(_optionsBuilder.Options).RefreshDonorDonationTotals(_directDBConnectionString, donorID.Value);
                    var myGivingDataList = new MyGivingQuery(_optionsBuilder.Options).GetData(donorID.Value);

                    return Json(ReshapeToResponse(myGivingDataList));
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, $"Error while MyGiving, donorID: {donorID}");
                    return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
                }
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost, Route("EditHistoryGoals")]
        public IActionResult UpdateHistoryGoals([FromBody]UpdateHistoryGoalRequest historyGoals)
        {
            try
            {
                if (historyGoals == null)
                {
                    return BadRequest();
                }
                var donorID = HttpContext.Items["DonorID"] as int?;
                if (donorID.HasValue)
                {
                    foreach (var other_donation in historyGoals.other_donations)
                    {
                        if (other_donation.amount.HasValue)
                        {
                            UpdateNonCHTotal(other_donation.year, other_donation.amount.Value);
                        }
                        else
                        {
                            RemoveNonCHTotal(other_donation.year);
                        }
                    }
                    foreach (var goal in historyGoals.goals)
                    {
                        if (goal.amount.HasValue)
                        {
                            UpdateGoal(goal.year, goal.amount.Value);
                        }
                        else
                        {
                            RemoveGoal(goal.year);
                        }
                    }
                    return GetData();
                }
                else
                {
                    return Unauthorized();
                }
            }catch(Exception ex)
            {
                _logger.LogError("error occured while updating myGiving data", new object[] { ex.ToString() });
                return StatusCode(500, "error occured while updating myGiving data, try again later");
            }

        }

        private GetDataResponse ReshapeToResponse(List<MyGivingData> myGivingDataList)
        {
            var getDataReponse = new GetDataResponse();
            foreach(var mgData in myGivingDataList)
            {
                getDataReponse.goals.Add(new YearAmountPair(mgData.Year, mgData.Goal.HasValue? mgData.Goal.Value : (decimal?)null));
                
                getDataReponse.other_donations.Add(new YearAmountPair(mgData.Year, mgData.DonationNonCHTotal.HasValue ? mgData.DonationNonCHTotal.Value : (decimal?)null));

                getDataReponse.canadahelps_donations.Add(new YearAmountPair(mgData.Year, mgData.DonationTotal));
            }
            return getDataReponse;
        }
    }
    [Serializable]
    public class UpdateHistoryGoalRequest
    { 
        public List<YearAmountPair> goals;
        public List<YearAmountPair> other_donations;
    }

    [Serializable]
    public class GetDataResponse
    {
        public List<YearAmountPair> goals;
        public List<YearAmountPair> canadahelps_donations;
        public List<YearAmountPair> other_donations;
        public GetDataResponse()
        {
            goals = new List<YearAmountPair>();
            canadahelps_donations = new List<YearAmountPair>();
            other_donations = new List<YearAmountPair>();
        }
    }
    [Serializable]
    public class YearAmountPair
    {
        public int year;
        public decimal? amount;

        public YearAmountPair(int year, decimal? amount)
        {
            this.year = year;
            this.amount = amount;
        }
    }
}
