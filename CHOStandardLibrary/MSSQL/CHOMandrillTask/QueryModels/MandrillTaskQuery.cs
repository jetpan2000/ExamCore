using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using CHOStandard.MSSQL.CHOMandrillTask.Models;
using CHOStandard.MSSQL.General.Models;

using CHOStandard.MSSQL.CHOMandrillTask.EF;

namespace CHOStandard.MSSQL.CHOMandrillTask.QueryModels
{
    public partial class MandrillTaskQuery
    {
        protected MandrillTaskContext _dbContext;

        public MandrillTaskQuery(string connString)
        {
            _dbContext = new MandrillTaskContext(connString);
        }

        public MandrillTaskQuery(MandrillTaskContext context)
        {
            _dbContext = context;
        }

        public MandrillTaskQuery(DbContextOptions dbContextOptions)
        {
            _dbContext = new MandrillTaskContext(dbContextOptions);
        }

        public string GetApplicationSetting(string sKey)
        {
            return _dbContext.ApplicationSetting.SingleOrDefault(x => x.sKey == sKey).sValue;
        }
    }
}