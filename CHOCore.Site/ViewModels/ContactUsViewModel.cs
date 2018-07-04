using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CHOCore.Site.ViewModels
{
    public class ContactUsViewModel
    {
        public string pageId { get; set; }
        public string caseType { get; set; }
        [Display(Name = "subject")]
        [Required(ErrorMessage = "requriedSubject")]
        public string subject { get; set; }
        public string charityName { get; set; }
        public string charityBN { get; set; }
        [Display(Name = "senderMessage")]
        [Required(ErrorMessage = "requriedSenderMessage")]
        public string senderMessage { get; set; }
        [Display(Name = "senderName")]
        [Required(ErrorMessage = "requriedSenderName")]
        public string senderName { get; set; }

        [Display(Name = "senderEmail")]
        [Required(ErrorMessage = "requiredSenderEmail")]
        [EmailAddress(ErrorMessage = "invalidEmail")]
        public string senderEmail { get; set; }
        public string customSubject { get; set; }
    }

    public class CaptchaVerification
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("error-codes")]
        public List<string> Errors { get; set; }
    }
}
