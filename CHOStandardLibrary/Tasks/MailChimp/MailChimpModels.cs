/*Developer Note:
 * 
 *  Please make sure files content of CanadaHelps.Core/DataObject/MailChimpModels.cs and
 *  CHOCore.ModelLibrary/MailChimp/MailChimpModels.cs are exactly same.
 *  Any update on any side better be copied to the other side.
*/
using System;
using System.Xml.Serialization;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace CHOStandard.MailChimp.Models
{
    public class MailChimpInterestCategory
    {
        public string CategoryId { get; set; }
        public Dictionary<string, bool> Interests { get; set; }
    }

    public static class UserType
    {
        public const string CharityAdmin = "Charity Admin";
        public const string LinkedUser = "Linked User";
    }

    public static class AccountType
    {
        public const string Tier1 = "Tier 1";
        public const string Tier2 = "Tier 2";
        public const string UnverifiedTier1 = "Unverified Tier 1";
        public const string UnverifiedTier2 = "Unverified Tier 2";
    }

    public static class ContactStatus
    {
        public const string subscribed = "subscribed";
        public const string unsubscribed = "unsubscribed";
        public const string cleaned = "cleaned";
        public const string pending = "pending";
    }

    public static class PrimaryAreaOfFocus
    {
        public const string ProgramDevelopment = "Program Development";
        public const string Finance = "Finance";
        public const string ExecutiveDirector = "Executive Director";
        public const string BoardMember = "Board Member";
        public const string Operations = "Operations";
        public const string CustomerSupport = "Customer Support";
        public const string Fundraising = "Fundraising";
    }

    public static class ConsentType
    {
        public const string Implied = "Implied";
        public const string Express = "Express";
    }

    public static class ConsentSource
    {
        public const string LinkedUser = "Linked User";
        public const string CharityAdmin = "Charity Admin";
        public const string Webinar = "Webinar";
        public const string Whitepaper = "Whitepaper";
        public const string NameofLeadForm = "Name of Lead Form";
        public const string GeneralSignup = "General Signup";
    }

    public class MCMember
    {
        public string email_address { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string email_type { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string status { get; set; }
        public MergeFields merge_fields { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        [XmlIgnore]
        public Dictionary<string, bool> interests { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string language { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool vip { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ip_signup { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string timestamp_signup { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ip_opt { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string timestamp_opt { get; set; }
    }

    public class MCMembers
    {
        public List<MCMemberResponse> members;
    }

    [Serializable, XmlRoot("MCMemberRequest"), XmlType("MCMemberRequest")]
    public class MCMemberRequest : MCMember
    {

    }

    public class MCMemberResponse : MCMember
    {
        public string id { get; set; }
        public string unique_email_id { get; set; }
        public string unsubscribe_reason { get; set; }
        public MemberStats stats { get; set; }
        public MCMemberRequest ToMCMemberRequest()
        {
            MCMemberRequest mcReq = new MCMemberRequest();
            mcReq.email_address = email_address;
            mcReq.email_type = email_type;
            mcReq.language = language;
            mcReq.status = status;
            mcReq.vip = vip;
            mcReq.merge_fields = merge_fields;
            return mcReq;
        }
    }

    public class MCAPICallResponse
    {
        public bool isSuccessStatusCode { get; set; }
        public int statusCode { get; set; }
        public string msg { get; set; }
        public List<MCMemberResponse> mcMembers { get; set; }
    }

    public class MergeFields
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string FNAME { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string LNAME { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string BIRTHDAY { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ROLE { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string FOCUSAREA { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string CONSENTTYP { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string CONSENTSRC { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string DONATEDATE { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string SIGNINDATE { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string USERTYPE { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ACCNTTYPE { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string TYPECHGDATE { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string BN { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ADDRESS1 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ADDRESS2 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string CITY { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string PROVINCE { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string POSTALCODE { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string COUNTRY { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string PHONENUM { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string CHARITYNAM { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? CHARITYID { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string REGISTDATE { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string LANGPREFER { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string EFT { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string SFVERIFIED { get; set; }
    }
   
    public class MemberStats
    {
        [JsonIgnore]
        public decimal avg_open_rate { get; set; }
        [JsonIgnore]
        public decimal avg_click_rate { get; set; }
    }

    public class MailChimpAppSettings
    {
        public MailChimpSettings MailChimp { get; set; }

        public class MailChimpSettings
        {
            public string WhiteIpList { get; set; }
            public string API30UrlRoot { get; set; }
        }
    }

    public class MailChimpResponseMessage
    {
        public string type { get; set; }
        public string title { get; set; }
        public int status { get; set; }
        public string detail { get; set; }
        public string instance { get; set; }
    }
}
