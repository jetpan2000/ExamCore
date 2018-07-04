using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CHOStandard.MSSQL.CHOMailChimpTask.Models
{ 
    [Table("MailChimpTask")]
    public partial class MailChimpTask
    { 
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]

        public MailChimpTask()
        {
        }
        public int Id { get; set; }
        public int Status { get; set; }
        public int? AttemptsMade { get; set; } = 0;
        public DateTime? ReprocessDateTime { get; set; }
        public DateTime? LastProcessedDateTime { get; set; }
        public string Email { get; set; }
        public int CharityId { get; set; }
        public string XML { get; set; }
        public string Action { get; set; }
        public string ProcessDetails { get; set; }
        [Timestamp]
        public byte[] TS { get; set; }
    }
}