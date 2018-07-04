using System.ComponentModel.DataAnnotations.Schema;

namespace CHOStandard.MSSQL.CHOMandrillTask.Models
{ 
    [Table("MandrillTaskFileAsset")]
    public partial class MandrillTaskFileAsset
    { 
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]

        public MandrillTaskFileAsset()
        {
        }
        public int ID { get; set; }
        public int MandrillTaskID { get; set; }
        public MandrillTask MandrillTask { get; set; }
        public int FileAssetID { get; set; }
        public virtual FileAsset FileAsset { get; set; }        
    }
}