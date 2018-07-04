using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using NLog;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using CHOStandard.Logging;
using Microsoft.EntityFrameworkCore;
using CHOStandard.MSSQL.CHOMailChimpTask.EF;
using CHOStandard.MSSQL.CHOMailChimpTask.Models;
using CHOStandard.Tasks;

namespace CHOStandard.MSSQL.CHOMailChimpTask.CommandModels
{
    public class MailChimpTaskCommand : NLoggable
    {
        private string _dbConnectionString;
        private static readonly object _locker = new object();

        public MailChimpTaskCommand(string connString)
        {
            _dbConnectionString = connString;
        }

        public List<string> GetCharityAdminEmails(int charityId)
        {
            var emails = new List<string>();

            using (var db = new MailChimpTaskDbContext(_dbConnectionString))
            {
                try
                {
                    DbCommand cmd = db.Database.GetDbConnection().CreateCommand();
                    cmd.CommandText = "GetCharityAdminEmailsPrimaryAndLinked";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@CharityID", charityId));
                    db.Database.OpenConnection();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            emails.Add(reader["email"].ToString());
                        }
                    }

                    return emails;
                }
                catch (Exception ex)
                {
                    Log($"GetCharityAdminEmails for charity:{charityId} error.", 0, LogLevel.Error, null, ex);
                    return null;
                }
            }
        }

        public bool AddMailChimpTask(MailChimpTask mailChimpTask)
        {
            using (var dbContext = new MailChimpTaskDbContext(_dbConnectionString))
            {
                try
                {
                    dbContext.Entry(mailChimpTask).State = EntityState.Added;
                    dbContext.SaveChanges();
                    return true;
                }
                catch(Exception ex)
                {
                    Log("Add MailChimp task error.", 0, LogLevel.Error, new object[] { mailChimpTask.XML }, ex);
                    return false;
                }
            }
        }

        public bool SaveTask(MailChimpSyncTask syncTask)
        {
            lock (_locker)
            {
                using (var _dbContext = new MailChimpTaskDbContext(_dbConnectionString))
                {
                    MailChimpTask mcTask = _dbContext.MailChimpTasks.SingleOrDefault(x => x.Id == syncTask.ID);
                    if (mcTask == null)
                        return false;

                    try
                    {
                        int cnt = 0;
                        while (true)
                        {
                            try
                            {
                                mcTask.Status = (int)syncTask.Status;

                                if (syncTask.Status == Status.Retrying)
                                    mcTask.ReprocessDateTime = syncTask.ReprocessDateTime;

                                mcTask.LastProcessedDateTime = syncTask.LastProcessedDateTime;
                                mcTask.AttemptsMade = syncTask.AttemptsMade;
                                mcTask.ProcessDetails = syncTask.ProcessDetails;

                                _dbContext.Entry(mcTask).State = EntityState.Modified;

                                cnt++;

                                _dbContext.SaveChanges();
                                return true;
                            }
                            catch (DbUpdateConcurrencyException updex)
                            {
                                if (cnt > 5)
                                    throw new Exception($"SaveTask error after 5 tries: TaskID:{mcTask.Id}, New Status:{mcTask.Status}, {updex.ToString()}");

                                updex.Entries.Single().Reload();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Log("Save MailChimp task error.", 0, LogLevel.Error, new object[] { syncTask.ID }, ex);
                        throw new Exception($"SaveTask error: TaskID:{mcTask.Id}, New Status:{mcTask.Status}, {ex.ToString()}");
                    }
                }
            }
        }

        public bool SaveTaskDetails(MailChimpTask mailChimpTask)
        {
            using (var _dbContext = new MailChimpTaskDbContext(_dbConnectionString))
            {
                MailChimpTask mcTask = _dbContext.MailChimpTasks.SingleOrDefault(x => x.Id == mailChimpTask.Id);
                if (mcTask == null)
                    return false;
              
                mcTask.ProcessDetails = mailChimpTask.ProcessDetails;

                try
                {
                    _dbContext.Entry(mcTask).State = EntityState.Modified;
                    _dbContext.SaveChanges();
                    return true;
                }
                catch (Exception ex)
                {
                    Log("Save MailChimpTask process details error.", 0, LogLevel.Error, new object[] { mailChimpTask.Id }, ex);
                    return false;
                }
            }
        }

        public MailChimpTask GetNextMailChimpTask()
        {
            DateTime now = DateTime.Now;

            lock (_locker)
            {
                using (var _dbContext = new MailChimpTaskDbContext(_dbConnectionString))
                {
                    var task = _dbContext.MailChimpTasks.Where(t => t.Status == (int)Status.Unprocessed || (t.Status == (int)Status.Retrying && t.ReprocessDateTime < now))
                    //.OrderBy(x => x.LastProcessedDateTime)
                    .FirstOrDefault();

                    if (task == null)
                        return null;

                    try
                    {
                        task.Status = (int)Status.InProgress;

                        _dbContext.Entry(task).State = EntityState.Modified;
                        _dbContext.SaveChanges();
                        return task;
                    }
                    catch (DbUpdateConcurrencyException ucex)
                    {
                        Log("DbUpdateConcurrencyException detected.", 0, LogLevel.Debug, exception: ucex);
                        return null;
                    }
                    catch (Exception ex)
                    {
                        Log("GetNextMailChimpTask exception.", 0, LogLevel.Error, exception: ex);
                        throw;
                    }
                }
            }
        }
    }
}
