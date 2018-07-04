using CHOCore.Models.DonorDashboard.EF;
using CHOCore.Models.General.QueryModels;
using CHOCore.Site.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;

namespace CHOCore.Site.Utils
{
    public class EmailHelper:IEmailHelper
    {
        private static DbContextOptionsBuilder _optionsBuilder = new DbContextOptionsBuilder<DonorDashboardContext>();
        private string _directDBConnectionString;
        private IConfiguration _configuration;
        private ILogger<EmailHelper> _logger;

        public EmailHelper(IConfiguration configuration, ILogger<EmailHelper> logger = null)
        {
            _logger = logger;
            _configuration = configuration;
            _directDBConnectionString = configuration["connectionstrings:MSSQL.Main"];
            _optionsBuilder.UseSqlServer(_directDBConnectionString);

        }


        #region methods

        public void Send(bool isHtmlEmail, string body, string subject, string from, string recipients)
        {
            SmtpClient mailClient = new SmtpClient();
            mailClient.Host = _configuration["mailSettings:host"];
            mailClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            mailClient.UseDefaultCredentials = Convert.ToBoolean(_configuration["mailSettings:defaultCredentials"]);
            mailClient.Port = Convert.ToInt32(_configuration["mailSettings:port"]);
            mailClient.Credentials = new NetworkCredential(new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("Text.Email.UserName"),
                                                           new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("Text.Email.Password"));
            mailClient.EnableSsl = true;

            string fromadrs = _configuration["EmailAddress:From"];
            var mailMessage = new MailMessage(fromadrs, recipients, subject, string.Empty);
            if (isHtmlEmail)
                mailMessage.IsBodyHtml = true;

            if (!String.IsNullOrEmpty(body))
            {
                mailMessage.Body = body;
                mailMessage.BodyEncoding = System.Text.Encoding.UTF8;
            }

            try
            {
                mailClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                mailMessage.From = new MailAddress(new ApplicationSettingQuery(_optionsBuilder.Options).GetValue("ChoAdminEmail"), "CanadaHelps.org");
                mailMessage.SubjectEncoding = System.Text.Encoding.UTF8;
                mailClient.Send(mailMessage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send an email: {ex.Message}");
            }
        }
        public void bulkSend(string from, string subject, string body, List<string> receipientList)
        {
            foreach (string email in receipientList)
            {
                if (!String.IsNullOrEmpty(email))
                {
                    var mailMessage = new MailMessage(from, email, subject, body);
                    mailMessage.ReplyToList.Add(new MailAddress(from.ToString(), "CanadaHelps.org"));
                    this.Send(false, body, subject, from, email);
                }
            }
        }

        #endregion methods
    }
}
