using NLog;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using CHOStandard.MSSQL.CHOMailChimpTask.Models;
using CHOStandard.MSSQL.CHOMailChimpTask.QueryModels;
using CHOStandard.MSSQL.CHOMailChimpTask.CommandModels;
using CHOStandard.MailChimp.Models;
using CHOStandard.Utils;
using CHOStandard.Utilities.MailChimp;
using Newtonsoft.Json;

namespace CHOStandard.Tasks
{
    public static class MailChimpAction
    {
        public const string PutContact = "PutContact";
        public const string DeleteContact = "DeleteContact";


    }

    public class MailChimpSyncTask : AbstractTask
    {
        private readonly object _locker = new object();

        public int CharityId { get; set; }
        public string Email { get; set; }
        public string XML { get; set; }
        public string ProcessDetails { get; set; }
        public string Action { get; set; }

        private static string _mailChimpAPIKey;                 // applicationSettings sKey: Newsletter.MailChimpAPI30Key
        private static string _mailChimpAPI30UrlRoot;           // sKey: Newsletter.MailChimpAPI30UrlRoot point to https://us16.api.mailchimp.com/3.0/
                                                                // sKey: Newsletter.MailChimp.ListIDs  all listID sepreated by ; will be synchronized according to MailChimp task table records. PutContact/DeleteContact
        MailChimpAPIClient mailChimpAPIClient;

        public MailChimpSyncTask(string dbConnectionString, string versionKey, ILogger logger = null) : base(dbConnectionString,"MailChimpService.VersionKey", versionKey , logger)
        {
            _dbConnectionString = dbConnectionString;
            TaskType = TaskType.MailChimpSync;

            var query = new MailChimpTaskQuery(dbConnectionString);
            int num;

            if (int.TryParse(query.GetApplicationSetting("MailChimpTask_MaxAttempts"), out num))
                MaxAttempts = num;
            if (int.TryParse(query.GetApplicationSetting("MailChimpTask_RetryTimePeriod"), out num))
                RetryTimePeriod = num;

            _mailChimpAPIKey = query.GetApplicationSetting("Newsletter.MailChimpAPI30Key");             // for MailChimp Site
            _mailChimpAPI30UrlRoot = query.GetApplicationSetting("Newsletter.MailChimpAPI30UrlRoot");   // for MailChimp Site 
            
            string listIDs = query.GetApplicationSetting("Newsletter.MailChimp.ListIDs");
            string englishInterests = query.GetApplicationSetting("Newsletter.MailChimp.English.Interests");
            string frenchInterests = query.GetApplicationSetting("Newsletter.MailChimp.French.Interests");

            mailChimpAPIClient = new MailChimpAPIClient(_mailChimpAPIKey, _mailChimpAPI30UrlRoot, listIDs, frenchInterests, englishInterests);
        }

        /// <summary>
        /// Process the next Mandrill Email
        /// </summary>
        /// <param name="DBConnstring">DB Connection String</param>
        /// <returns>return true if there is another </returns>
        public async override Task<bool> ProcessTask()
        {
            MailChimpTask mailChimpTask = null;
            mailChimpTask = new MailChimpTaskCommand(_dbConnectionString).GetNextMailChimpTask();

            if (mailChimpTask == null)
                return await Task.FromResult(false);

            this.ID = mailChimpTask.Id;
            this.AttemptsMade = mailChimpTask.AttemptsMade ?? 0;

            string processDetails = "";
            try
            {
                processDetails = await ProcessMailChimpTask(mailChimpTask);
            }
            catch (Exception ex)
            {
                processDetails = ex.ToString();
            }

            if (processDetails.IndexOf("OK.") < 0)
                SetTaskToRetryLater();
            else
                SetTaskToComplete();

            ProcessDetails = processDetails;
            LastProcessedDateTime = DateTime.Now;

            return Save();

        }

        public async Task<string> ProcessMailChimpTask(MailChimpTask mailChimpTask)
        {
            MCMemberRequest mcReq = (MCMemberRequest)CHOUtils.ToMCMemberRequest(mailChimpTask.XML);
            string messages = "OK.";
            List<MCAPICallResponse> apiResps;

            switch (mailChimpTask.Action)
            {
                case MailChimpAction.PutContact:
                    apiResps = await mailChimpAPIClient.PutContactAllLists(mcReq);
                    messages = MailChimpAPIClient.AnalyzeMCAPICallResponse(mailChimpTask.Action, JsonConvert.SerializeObject(mcReq), apiResps);
                  
                    break;
                case MailChimpAction.DeleteContact:
                    apiResps = await mailChimpAPIClient.DeleteContactAllLists(mcReq.email_address);
                    messages = MailChimpAPIClient.AnalyzeMCAPICallResponse(mailChimpTask.Action, JsonConvert.SerializeObject(mcReq), apiResps);

                    break;
                default:
                    break;
            }           

            return await Task.FromResult(messages);
        }

        private bool Save()
        {
            return new MailChimpTaskCommand(_dbConnectionString).SaveTask(this);
        }

    }
}
