using CHOStandard.MSSQL.CHOMandrillTask.EF;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CHOStandard.MSSQL.General.QueryModels
{
    public class ApplicationSettingQuery
    {
        private string _dbConnectionString;

        public ApplicationSettingQuery(string dbString)
        {
            _dbConnectionString = dbString;
        }

        public string GetValue(string sKey)
        {
            using (var _dbContext = new MandrillTaskContext(_dbConnectionString))
            {
                var pair = _dbContext.ApplicationSetting.FirstOrDefault(o => o.sKey == sKey);

                return pair?.sValue;
            }
        }
    }
}