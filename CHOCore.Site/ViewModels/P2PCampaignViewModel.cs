using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CHOCore.Site.ViewModels
{
    public class P2PCampaignViewModel
    {
        public string campaign_name_en { get; set; }
        public string name_fr { get; set; }
        public int charity_id { get; set; }
        public string supporter_wall_message { get; set; }
        public string campaign_name_fr { get; set; }
        public int fund_id { get; set; }
        public decimal donation_amount { get; set; }
        public int display_type { get; set; }
        public bool is_monthly { get; set; }
        public string name_en { get; set; }
        public int id { get; set; }
        public int campaign_id { get; set; }
    }
}
