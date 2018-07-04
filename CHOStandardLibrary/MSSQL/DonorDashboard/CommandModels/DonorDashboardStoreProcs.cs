using CHOStandard.Utilities.MSSQL;
using System;
using System.Transactions;

namespace CHOStandard.Models.DonorDashboard.CommandModels
{
    public class DonorDashboardStoreProcs : StoreProcGroup
    {
        internal DonorDashboardStoreProcs(string connectionString): base(connectionString)
        { }

        //delete all donationTotals for that donor that year and recalculate.
        public void UpdateDonorDonationTotalByYear(int donorID, int year)
        {
            using (var scope = new TransactionScope(TransactionScopeOption.Required, getTransactionOption(IsolationLevel.ReadUncommitted)))
            {
                using (var con = getConnection())
                {
                    try
                    {
                        var command = getCommand(con, "DonorDonationTotalRecalculate");

                        command.Parameters.AddWithValue("DonorID", donorID);
                        command.Parameters.AddWithValue("Year", year);
                        command.ExecuteNonQuery();
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                }
                scope.Complete();
            }
        }
    }
}
