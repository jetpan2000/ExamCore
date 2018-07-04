using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CHOCore.Models.DonorDashboard.HowCanadiansGive
{

    [Table("GivingArea")]
    public partial class GivingArea
    {

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]

        internal GivingArea()
        {
        }

        public int ID { get; set; }

        public int? ParentAreaID { get; set; }

        [StringLength(50)]
        public string AreaType { get; set; }

        [StringLength(255)]
        public string Name_EN { get; set; }

        [StringLength(255)]
        public string Name_FR { get; set; }

        public decimal CenterLongitude { get; set; }
        public decimal CenterLatitude { get; set; }
        public virtual ICollection<GivingAreaMetric> GivingAreaMetrics { get; set; }

    }
}
