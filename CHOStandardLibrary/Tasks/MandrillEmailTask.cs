using Mandrill;
using Mandrill.Model;
using NLog;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using CHOStandard.MSSQL.CHOMandrillTask.Models;
using CHOStandard.MSSQL.CHOMandrillTask.QueryModels;
using CHOStandard.MSSQL.CHOMandrillTask.CommandModels;
using CHOStandardLibrary.MSSQL.CHOMandrillTask.CommandModels;

namespace CHOStandard.Tasks
{
    public class MandrillEmailTask : AbstractTask
    {
        public string TemplateName { get; set; }
        public string SenderName { get; set; }
        public string SenderEmail { get; set; }
        public string Subject { get; set; }
        public string[] MergeTags { get; set; }
        List<FileAttachment> FileAttachments { get; set; }

        static readonly object _locker = new object();

        protected MandrillApi _mandrillAPI;        
        
        public MandrillEmailTask(string dbConnectionString, string versionKey, ILogger logger = null) : base(dbConnectionString,"Mandrill.VersionKey", versionKey , logger)
        {
            _dbConnectionString = dbConnectionString;
            TaskType = TaskType.MandrillEmail;

            var query = new MandrillTaskQuery(dbConnectionString);
            _mandrillAPI = new MandrillApi(query.GetApplicationSetting("Mandrill_API_Key"));
            MaxAttempts = int.Parse(query.GetApplicationSetting("MandrillTask_MaxAttempts"));
            RetryTimePeriod = int.Parse(query.GetApplicationSetting("MandrillTask_RetryTimePeriod"));
        }

        /// <summary>
        /// Process the next Mandrill Email
        /// </summary>
        /// <param name="DBConnstring">DB Connection String</param>
        /// <returns>return true if there is another </returns>
        public async override Task<bool> ProcessTask()
        {
            MandrillTask mandrillTask = null;

            lock (_locker)
            {
                mandrillTask = new MandrillTaskStoreProcs(_dbConnectionString).GetNextMandrillTask();
            }

            if (mandrillTask == null)
                return await Task.FromResult(false);

            if (!await Send(GenerateMandrillMessage(mandrillTask), mandrillTask.TemplateName))
                SetTaskToRetryLater();
            else
                SetTaskToComplete();

            return Save();
        }

        /// <summary>
        /// Builds a Mandrill Message based on whether it has template or not
        /// </summary>
        /// <returns></returns>
        private MandrillMessage GenerateMandrillMessage(MandrillTask mandrillTask)
        {
            MandrillMessage mandrillMessage = new MandrillMessage(mandrillTask.SenderEmail, "", mandrillTask.Subject, mandrillTask.Body);            
            mandrillMessage.To = mandrillTask.Recipients.Replace(";", ",").Split(',').Select(a => new MandrillMailAddress(a)).ToList();
            mandrillMessage.FromName = mandrillTask.SenderName;

            ID = mandrillTask.Id;
            AttemptsMade = mandrillTask.AttemptsMade ?? 0;
            TemplateName = mandrillTask.TemplateName;
            SenderName = mandrillTask.SenderName;
            SenderEmail = mandrillTask.SenderEmail;
            Subject = mandrillTask.Subject;
            Status = (Status)mandrillTask.Status;
            LastProcessedDateTime = DateTime.Now;
            ReprocessDateTime = DateTime.Now;

            return new MandrillTaskCommand(_dbConnectionString).PopupMandrillMessage(mandrillTask, mandrillMessage);
        }

        private bool Save()
        {
            return new MandrillTaskCommand(_dbConnectionString).SaveTask(this);
        }
       
        protected async Task<bool> SendMessage(string toEmail, string fromEmail, string subject, string body)
        {
            var message = new MandrillMessage(fromEmail, toEmail, subject, body);
            return await Send(message);
        }

        protected async Task<bool> Send(MandrillMessage message, string templateName = "")
        {
            try
            {
                if (string.IsNullOrEmpty(templateName))
                    await _mandrillAPI.Messages.SendAsync(message, async: false);
                else
                    await _mandrillAPI.Messages.SendTemplateAsync(message, templateName, async: false);
            }
            catch (Exception ex)
            {
                Log("Send email task error.", 0, LogLevel.Error, exception: ex);
                return false;
            }
            return true;
        }     

        public async Task<MandrillTask> AddMandrillTask(string templateName, string senderName, string senderEmail, string recipients, string subject, string body, string mergeTags, List<Guid> fileGuids)
        {
            return await new MandrillTaskCommand(_dbConnectionString).AddMandrillTask(templateName, senderName, senderEmail, recipients, subject, body, mergeTags, fileGuids);
        }       
    }

    public class FileAttachment
    {
        public string FileType { get; set; }
        public string FileName { get; set; }
        public string FileID { get; set; }

    }
}
