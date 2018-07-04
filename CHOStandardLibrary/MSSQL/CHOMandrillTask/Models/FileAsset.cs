using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace CHOStandard.MSSQL.CHOMandrillTask.Models
{ 
    [Table("FileAsset")]
    public partial class FileAsset
    { 
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]

        public FileAsset()
        {
        }
        public int ID { get; set; }
        public Guid GUID { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public byte[] Data { get; set; }
        public string FileHash { get; set; }
        public DateTime? MarkedForDeleteBy { get; set; }
    }
}