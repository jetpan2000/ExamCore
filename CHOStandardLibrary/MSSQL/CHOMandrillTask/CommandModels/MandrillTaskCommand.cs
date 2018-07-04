using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using NLog;
using Mandrill.Model;
using CHOStandard.Logging;
using Microsoft.EntityFrameworkCore;
using CHOStandard.MSSQL.CHOMandrillTask.EF;
using CHOStandard.MSSQL.CHOMandrillTask.Models;
using CHOStandard.Tasks;
using CHOStandard.MSSQL.General.CommandModels;
using CHOStandardLibrary.MSSQL.CHOMandrillTask.CommandModels;

namespace CHOStandard.MSSQL.CHOMandrillTask.CommandModels
{
    public class MandrillTaskCommand : NLoggable
    {
        private string _dbConnectionString;

        public MandrillTaskCommand(string connString)
        {
            _dbConnectionString = connString;
        }

        public bool SaveTask(MandrillEmailTask mandrillEmailTask)
        {
            using (var _dbContext = new MandrillTaskContext(_dbConnectionString))
            {
                MandrillTask mandrillTask = _dbContext.MandrillTask.SingleOrDefault(x => x.Id == mandrillEmailTask.ID);
                mandrillTask.Status = (int)mandrillEmailTask.Status;
                mandrillTask.ReprocessDateTime = mandrillEmailTask.ReprocessDateTime;
                mandrillTask.LastProcessedDateTime = mandrillEmailTask.LastProcessedDateTime;
                mandrillTask.AttemptsMade = mandrillEmailTask.AttemptsMade;
                try
                {
                    _dbContext.SaveChanges();
                    return true;
                }
                catch (Exception ex)
                {
                    Log("Save email task error.", 0, LogLevel.Error, new object[] { mandrillEmailTask.ID }, ex);
                    return false;
                }
            }
        }

        public async Task<MandrillTask> AddMandrillTask(string templateName, string senderName, string senderEmail, string recipients, string subject, string body, string mergeTags, List<Guid> fileGuids)
        {
            try
            {
                if (!string.IsNullOrEmpty(mergeTags))
                {
                    try
                    {
                        JsonConvert.DeserializeObject<Dictionary<string, string>>(mergeTags);
                    }
                    catch
                    {
                        throw new Exception(string.Format("Invalid MergeTags: {0}", mergeTags));
                    }
                }

                var mandrillTask = new MandrillTask() { TemplateName = templateName, SenderName = senderName, SenderEmail = senderEmail, Recipients = recipients, Subject = subject, Body = body, MergeTags = mergeTags };

                using (var _dbContext = new MandrillTaskContext(_dbConnectionString))
                {
                    _dbContext.Entry(mandrillTask).State = EntityState.Added;
                    _dbContext.SaveChanges();

                    if (fileGuids?.Count > 0)
                    {
                        try
                        {
                            var fileAssets = _dbContext.FileAsset.Where(x => fileGuids.Contains(x.GUID));
                            foreach (var fa in fileAssets)
                            {
                                var mtfa = new MandrillTaskFileAsset() { MandrillTaskID = mandrillTask.Id, FileAssetID = fa.ID };
                                _dbContext.Entry(mtfa).State = EntityState.Added;
                            }
                            _dbContext.SaveChanges();
                        }
                        catch (Exception ex2)
                        {
                            Log(string.Format("AddMandrillTask file assets error: {0}", ex2.Message), 0, LogLevel.Error, new object[] { string.Format("TemplateName:{0}, Sender:{1}, FromEmail:{2}, Recipients:{3}, Subject:{4}, Body:{5}, MergeTags:{6}", templateName, senderName, senderEmail, recipients, subject, body, mergeTags), fileGuids }, ex2);
                        }
                    }
                }

                return await Task.FromResult(mandrillTask);
            }
            catch (Exception ex)
            {
                Log(string.Format("AddMandrillSendMailTask error: {0}", ex.Message), 0, LogLevel.Error, new object[] { string.Format("TemplateName:{0}, Sender:{1}, FromEmail:{2}, Recipients:{3}, Subject:{4}, Body:{5}, MergeTags:{6}", templateName, senderName, senderEmail, recipients, subject, body, mergeTags) }, ex);
                throw;
            }
        }

        public MandrillMessage PopupMandrillMessage(MandrillTask mandrillTask, MandrillMessage mandrillMessage)
        {
            var fileAssets = new MandrillTaskStoreProcs(_dbConnectionString).GetFileAsset(mandrillTask.Id);
            foreach (var f in fileAssets)
            {
                var fileName = string.IsNullOrEmpty(f.FileExtension) ? f.FileName : f.FileName + "." + f.FileExtension;
                mandrillMessage.Attachments.Add(new MandrillAttachment() { Type = MimeMapping.MimeTypes.GetMimeMapping(f.FileExtension.ToLower()), Name = fileName, Content = f.Data });
            }

            if (!string.IsNullOrEmpty(mandrillTask.MergeTags))
            {
                try
                {
                    Dictionary<string, string> tags = JsonConvert.DeserializeObject<Dictionary<string, string>>(mandrillTask.MergeTags);
                    foreach (var tag in tags)
                        mandrillMessage.AddGlobalMergeVars(tag.Key, tag.Value);
                }
                catch (Exception ex)
                {
                    Log("PopupMandrillMessage error.", 0, LogLevel.Error, new object[] { mandrillTask.Id }, ex);
                    throw;
                }
            }
            
            return mandrillMessage;
        }

        public void DetachAndMarkFilesForDeletion(int id)
        {
            using (var _dbContext = new MandrillTaskContext(_dbConnectionString))
            {
                var mandrillTask = _dbContext.MandrillTask.SingleOrDefault(x => x.Id == id);
                if (mandrillTask == null)
                    return;

                var mtfa = _dbContext.MandrillTaskFileAsset.Where(x => x.MandrillTaskID == id);
                foreach (var mtfa1 in mtfa)
                {
                    var fa = _dbContext.FileAsset.SingleOrDefault(x => x.ID == mtfa1.FileAssetID);
                    if (fa != null)
                    {
                        fa.MarkedForDeleteBy = DateTime.Now.AddDays(3);
                        _dbContext.Entry(fa).State = EntityState.Modified;
                    }

                    _dbContext.Entry(mtfa1).State = EntityState.Deleted;
                }

                _dbContext.SaveChanges();
            }
        }
    }
}
