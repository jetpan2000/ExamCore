using CHOCore.Models.DonorDashboard.EF;
using System.Linq;
using System;
using CHOCore.Models.DonorDashboard.MyGiving;
using Microsoft.EntityFrameworkCore;

namespace CHOCore.Models.DonorDashboard.CommandModels
{
    public class MyGivingCommand
    {
        protected DonorDashboardContext _dbContext;
        static TimeSpan RECALC_INTERVAL = new TimeSpan(24, 0, 0); //24 hours

        public MyGivingCommand(DonorDashboardContext context)
        {
            _dbContext = context;
        }

        public MyGivingCommand(DbContextOptions dbContextOptions)
        {
            _dbContext = new DonorDashboardContext(dbContextOptions);
        }

        public void RefreshDonorDonationTotals(string connectionString
                                                , int donorID
                                                , int yearsBack = DonorDashboardContext.DEFAULT_NUM_YEARS_HISTORICAL)                                               
        {
            var procs = new DonorDashboardStoreProcs(connectionString);
            var currentYear = DateTime.Now.Year;

            if (yearsBack > 10)
                yearsBack = 10;
            if (yearsBack < 0)
                yearsBack = 0;

            if (yearsBack > 0)
                // update Totals for last X years if those totals do not exist
                for (int year = currentYear - yearsBack; year < currentYear; year++)
                {
                    if (_dbContext.DonorDonationTotal.Any(o => o.DonorID == donorID && o.Year == year))
                        continue;

                    procs.UpdateDonorDonationTotalByYear(donorID, year);
                }

            //update totals for current year if cached total is less than recalculation cache
            var totalEntity = _dbContext.DonorDonationTotal.FirstOrDefault(o => o.DonorID == donorID && o.Year == currentYear);
            var recalculateThisYearTotalThreashhold = DateTime.Now - RECALC_INTERVAL;

            if (totalEntity == null || totalEntity.LastUpdated < recalculateThisYearTotalThreashhold)
                procs.UpdateDonorDonationTotalByYear(donorID, currentYear);
        }

        public void UpdateDonationGoal(int donorID, int year, decimal goalAmount)
        {
            var entity = _dbContext.DonorDonationGoal.FirstOrDefault(o => o.DonorID == donorID && o.Year == year);

            if (entity == null)
            {
                var newGoal = new DonorDonationGoal() { DonorID = donorID, Year = year, Goal = goalAmount };
                _dbContext.DonorDonationGoal.Add(newGoal);
            }
            else
            {
                entity.Goal = goalAmount;                
            }
            _dbContext.SaveChanges();
        }

        public void UpdateNonCHDonationTotal(int donorID, int year, decimal total)
        {
            var entity = _dbContext.DonorDonationNonCHTotal.FirstOrDefault(o => o.DonorID == donorID && o.Year == year);

            if (entity == null)
            {
                var newTotal = new DonorDonationNonCHTotal() { DonorID = donorID, Year = year, Total = total };
                _dbContext.DonorDonationNonCHTotal.Add(newTotal);
            }
            else
            {
                entity.Total = total;
            }
            _dbContext.SaveChanges();
        }

        public void RemoveNonCHDonationTotal(int donorID, int year)
        {
            var entity = _dbContext.DonorDonationNonCHTotal.FirstOrDefault(o => o.DonorID == donorID && o.Year == year);

            if (entity != null)
            {
                _dbContext.DonorDonationNonCHTotal.Remove(entity);
                _dbContext.SaveChanges();
            }
        }

        public void RemoveDonationGoal(int donorID, int year)
        {
            var entity = _dbContext.DonorDonationGoal.FirstOrDefault(o => o.DonorID == donorID && o.Year == year);

            if (entity != null)
            {
                _dbContext.DonorDonationGoal.Remove(entity);
                _dbContext.SaveChanges();
            }
        }

    }
}
