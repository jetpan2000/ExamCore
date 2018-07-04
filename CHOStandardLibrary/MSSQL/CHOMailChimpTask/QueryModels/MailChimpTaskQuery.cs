using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using CHOStandard.MSSQL.CHOMailChimpTask.Models;
using CHOStandard.MSSQL.General.Models;

using CHOStandard.MSSQL.CHOMailChimpTask.EF;

namespace CHOStandard.MSSQL.CHOMailChimpTask.QueryModels
{
    public partial class MailChimpTaskQuery
    {
        protected MailChimpTaskDbContext _dbContext;

        public MailChimpTaskQuery(string connString)
        {
            _dbContext = new MailChimpTaskDbContext(connString);
        }

        public MailChimpTaskQuery(MailChimpTaskDbContext context)
        {
            _dbContext = context;
        }

        public MailChimpTaskQuery(DbContextOptions dbContextOptions)
        {
            _dbContext = new MailChimpTaskDbContext(dbContextOptions);
        }

        public string GetApplicationSetting(string sKey)
        {
            return _dbContext.ApplicationSettings.SingleOrDefault(x => x.sKey == sKey)?.sValue;
        }
    }
}