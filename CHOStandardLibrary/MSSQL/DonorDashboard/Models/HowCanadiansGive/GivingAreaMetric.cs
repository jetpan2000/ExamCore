using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace CHOCore.Models.DonorDashboard.HowCanadiansGive
{

    [Table("GivingAreaMetric")]
    public class GivingAreaMetric
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        [IgnoreDataMember]
        public int ID { get; set; }
        public int MetricTypeID { get; set; }
        [IgnoreDataMember]
        [ForeignKey("GivingAreaID")]
        public GivingArea GivingArea { get; set; }
        [IgnoreDataMember]
        public int GivingAreaID { get; set; }

        public int Year { get; set; }
        public decimal Value { get; set; }

    }
}
