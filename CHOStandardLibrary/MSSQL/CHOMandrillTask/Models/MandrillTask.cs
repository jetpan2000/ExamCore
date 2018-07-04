using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;

namespace CHOStandard.MSSQL.CHOMandrillTask.Models
{ 
    [Table("MandrillTask")]
    public partial class MandrillTask
    { 
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]

        public MandrillTask()
        {
        }
        public int Id { get; set; }
        public int Status { get; set; }
        public int? AttemptsMade { get; set; }
        public DateTime? ReprocessDateTime { get; set; }
        public DateTime? LastProcessedDateTime { get; set; }
        public string TemplateName { get; set; }
        public string SenderName { get; set; }
        public string SenderEmail { get; set; }
        public string Subject { get; set; }
        public string Recipients { get; set; }
        public string MergeTags { get; set; }
        public string Body { get; set; }
        [Timestamp]
        public byte[] TS { get; set; }
        public virtual ICollection<MandrillTaskFileAsset> MandrillTaskFileAssets { get; set; }
    }
}