using CHOCore.Models.DonorDashboard.MyGiving;
using CHOCore.Models.DonorDashboard.EF;
using System.Collections.Generic;
using System.Linq;
using System;
using Microsoft.EntityFrameworkCore;

namespace CHOCore.Models.DonorDashboard.QueryModels
{
    public class MyGivingQuery
    {
        protected DonorDashboardContext _dbContext;

        public MyGivingQuery(DonorDashboardContext context)
        {
            _dbContext = context;
        }

        public MyGivingQuery(DbContextOptions dbContextOptions)
        {
            _dbContext = new DonorDashboardContext(dbContextOptions);
        }

        public List<DonorDonationGoal> GetDonationGoals(int donorID, int years = DonorDashboardContext.DEFAULT_NUM_YEARS_HISTORICAL)
        {
            var fromYear = DateTime.Now.Year - years;
            var query = _dbContext.DonorDonationGoal.Where(goal => goal.DonorID == donorID && goal.Year >= fromYear);

            return query.ToList();
        }
        public List<DonorDonationNonCHTotal> GetNonCHDonationTotal(int donorID, int years = DonorDashboardContext.DEFAULT_NUM_YEARS_HISTORICAL)
        {
            var fromYear = DateTime.Now.Year - years;
            var query = _dbContext.DonorDonationNonCHTotal.Where(goal => goal.DonorID == donorID && goal.Year >= fromYear);

            return query.ToList();
        }

        public List<DonorDonationTotal> GetDonationTotal(int donorID, int years = DonorDashboardContext.DEFAULT_NUM_YEARS_HISTORICAL)
        {
            var fromYear = DateTime.Now.Year - years;
            var query = _dbContext.DonorDonationTotal.Where(goal => goal.DonorID == donorID && goal.Year >= fromYear);

            return query.ToList();
        }
        /// <summary>
        /// Get MyGivingData in one chunk, years backwards, current year, 1 year forward for goals
        /// </summary>
        /// <param name="donorID">donorID</param>
        /// <param name="years">How many years to go back</param>
        /// <returns></returns>
        public List<MyGivingData> GetData(int donorID, int years = DonorDashboardContext.DEFAULT_NUM_YEARS_HISTORICAL)
        {
            var list = new List<MyGivingData>();
            var currentYear = DateTime.Now.Year;
            var fromYear = currentYear - years;

            if (donorID < 1)
                return list;

            for (int year = fromYear; year <= (currentYear+1); year++)
            {
                var data = new MyGivingData();
                var totalEntity = _dbContext.DonorDonationTotal.FirstOrDefault(o => o.DonorID == donorID && o.Year == year);
                var nonCHTotalEntity = _dbContext.DonorDonationNonCHTotal.FirstOrDefault(o => o.DonorID == donorID && o.Year == year);
                var goalEntity = _dbContext.DonorDonationGoal.FirstOrDefault(o => o.DonorID == donorID && o.Year == year);

                data.Year = year;
                data.Goal = goalEntity?.Goal;                                
                data.DonationNonCHTotal = nonCHTotalEntity?.Total;

                if (totalEntity != null)
                    data.DonationTotal = totalEntity.Total;

                list.Add(data);
            }
            return list;
        }
    }
}