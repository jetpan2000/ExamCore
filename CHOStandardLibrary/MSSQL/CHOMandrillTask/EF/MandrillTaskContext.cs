using Microsoft.EntityFrameworkCore;
using CHOStandard.MSSQL.General.Models;
using CHOStandard.MSSQL.CHOMandrillTask.Models;

namespace CHOStandard.MSSQL.CHOMandrillTask.EF
{
    public partial class MandrillTaskContext : DbContext
    {
        private static DbContextOptionsBuilder optionsBuilder = new DbContextOptionsBuilder<MandrillTaskContext>();

        public MandrillTaskContext(DbContextOptions dbContextOptions)
            : base(dbContextOptions)
        {
        }

        public MandrillTaskContext(string _directDBConnectionString)
            : this(optionsBuilder.UseSqlServer(_directDBConnectionString).Options)
        {
        }

        public virtual DbSet<ApplicationSetting> ApplicationSetting { get; set; }
        public virtual DbSet<FileAsset> FileAsset { get; set; }
        public virtual DbSet<MandrillTask> MandrillTask { get; set; }
        public virtual DbSet<MandrillTaskFileAsset> MandrillTaskFileAsset { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MandrillTaskFileAsset>()
                .HasOne(pt => pt.MandrillTask)
                .WithMany(p => p.MandrillTaskFileAssets)
                .HasForeignKey(pt => pt.MandrillTaskID);
        }
    }
}
