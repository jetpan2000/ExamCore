using Microsoft.EntityFrameworkCore;
using CHOStandard.MSSQL.General.Models;
using CHOStandard.MSSQL.CHOMailChimpTask.Models;

namespace CHOStandard.MSSQL.CHOMailChimpTask.EF
{
    public partial class MailChimpTaskDbContext : DbContext
    {
        private static DbContextOptionsBuilder optionsBuilder = new DbContextOptionsBuilder<MailChimpTaskDbContext>();

        public MailChimpTaskDbContext(DbContextOptions dbContextOptions)
            : base(dbContextOptions)
        {
        }

        public MailChimpTaskDbContext(string _directDBConnectionString)
            : this(optionsBuilder.UseSqlServer(_directDBConnectionString).Options)
        {
        }

        public virtual DbSet<MailChimpTask> MailChimpTasks { get; set; }
        public virtual DbSet<ApplicationSetting> ApplicationSettings { get; set; }
    }
}
