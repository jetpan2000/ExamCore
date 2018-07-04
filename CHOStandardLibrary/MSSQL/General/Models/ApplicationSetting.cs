using System.ComponentModel.DataAnnotations.Schema;

namespace CHOStandard.MSSQL.General.Models
{ 
    [Table("ApplicationSetting")]
    public partial class ApplicationSetting
    { 
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]

        public ApplicationSetting()
        {
        }
        public int ID { get; set; }
        public string sKey { get; set; }
        public string sValue { get; set; }
    }
}