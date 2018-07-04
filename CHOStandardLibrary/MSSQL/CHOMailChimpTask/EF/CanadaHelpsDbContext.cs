using Microsoft.EntityFrameworkCore;
using CHOStandard.MailChimp.MSSQL.Models;

namespace CHOStandard.MailChimp.MSSQL.EF
{
    public partial class CanadaHelpsDbContext : DbContext
    {
        private static DbContextOptionsBuilder optionsBuilder = new DbContextOptionsBuilder<CanadaHelpsDbContext>();

        public CanadaHelpsDbContext(DbContextOptions dbContextOptions)
            : base(dbContextOptions)
        {
        }

        public CanadaHelpsDbContext(string _directDBConnectionString)
            : this(optionsBuilder.UseSqlServer(_directDBConnectionString).Options)
        {
        }

        public virtual DbSet<ApplicationSetting> ApplicationSetting { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
    }
}
