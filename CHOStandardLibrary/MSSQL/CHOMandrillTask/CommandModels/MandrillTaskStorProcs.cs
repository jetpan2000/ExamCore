using CHOStandard.MSSQL.CHOMandrillTask.Models;
using CHOStandardLibrary.MSSQL.General.CHOCore.Utilities.MSSQL;
using System;
using System.Collections.Generic;
using System.Text;

namespace CHOStandardLibrary.MSSQL.CHOMandrillTask.CommandModels
{

    public class MandrillTaskStoreProcs : StoreProcGroup
    {
        internal MandrillTaskStoreProcs(string connectionString) : base(connectionString)
        { }
        public MandrillTask GetNextMandrillTask()
        {
            MandrillTask mandrillTask = null;
            using (var con = getConnection())
            {
                var command = getCommand(con, "MandrillTaskGetNext");
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        mandrillTask = new MandrillTask();
                        mandrillTask.Id = Convert.ToInt32(reader["ID"].ToString());
                        mandrillTask.Status = Convert.ToInt32(reader["Status"].ToString());
                        mandrillTask.ReprocessDateTime = reader["ReprocessDateTime"] as DateTime?;
                        mandrillTask.AttemptsMade = reader["AttemptsMade"] as int?;
                        mandrillTask.LastProcessedDateTime = reader["LastProcessedDateTime"] as DateTime?;
                        mandrillTask.TemplateName = reader["TemplateName"] as string;
                        mandrillTask.SenderName = reader["SenderName"] as string;
                        mandrillTask.SenderEmail = reader["SenderEmail"] as string;
                        mandrillTask.Subject = reader["Subject"] as string;
                        mandrillTask.Recipients = reader["Recipients"] as string;
                        mandrillTask.MergeTags = reader["MergeTags"] as string;
                        mandrillTask.Body = reader["Body"] as string;
                    }
                }
            }
            return mandrillTask;
        }
        public List<FileAsset> GetFileAsset(int taskID)
        {
            var fileAssets = new List<FileAsset>();
            using (var con = getConnection())
            {
                var command = getCommand(con, "FileAssetGetByTaskID");
                command.Parameters.AddWithValue("TaskID", taskID);
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var fileAsset = new FileAsset();

                        fileAsset.ID = Convert.ToInt32(reader["ID"].ToString());
                        fileAsset.GUID = new Guid(reader["GUID"].ToString());
                        fileAsset.FileExtension = reader["FileExtension"] as string;
                        fileAsset.FileName = reader["FileName"] as string;
                        fileAsset.Data = reader["Data"] as byte[];
                        fileAsset.FileHash = reader["FileHash"] as string;
                        fileAsset.MarkedForDeleteBy = reader["MarkedForDeleteBy"] as DateTime?;

                        fileAssets.Add(fileAsset);
                    }
                }
            }
            return fileAssets;
        }

        public void saveMandrillTask(MandrillTask task)
        {
            using (var con = getConnection())
            {
                var command = getCommand(con, "MandrillTaskUpdate");
                command.Parameters.AddWithValue("ID", task.Id);
                command.Parameters.AddWithValue("Status", task.Status);
                command.Parameters.AddWithValue("ReprocessingTime", task.ReprocessDateTime);
                command.Parameters.AddWithValue("AttemptsMade", task.AttemptsMade);
                command.Parameters.AddWithValue("LastProcessedDateTime", task.LastProcessedDateTime);
                command.ExecuteNonQuery();
            }
        }
    }
}
