using System.Linq;
using CHOStandard.MailChimp.MSSQL.EF;
using CHOStandard.MSSQL.CHOMailChimpTask.EF;

namespace CHOStandard.MailChimp.QueryModels
{
    public class ApplicationSettingQuery
    {
        private string _dbString;

        public ApplicationSettingQuery(string dbString)
        {
            _dbString = dbString;
        }

        public string GetValue(string sKey)
        {
            using (var dbContext = new MailChimpTaskDbContext(_dbString))
            {
                var pair = dbContext.ApplicationSettings.FirstOrDefault(o => o.sKey == sKey);
                return pair?.sValue;
            }
        }
    }
}