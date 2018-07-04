using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CHOCore.Models.DonorDashboard.HowCanadiansGive
{

    [Table("HCG_Mappoint")]
    public partial class HCGMappoint
    {

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]

        public HCGMappoint()
        {
        }
        public int ID { get; set; }
       
        public decimal Longitude { get; set; }

        public decimal Latitude { get; set; }

        public decimal AvgDonation { get; set; }

    }
}