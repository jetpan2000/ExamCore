using System;
using System.Collections.Generic;
using System.Text;
using CHOStandard.Tasks;
using System.Linq;
using NLog;
using CHOStandard.Utils;
using CHOStandard.Logging;
using Microsoft.EntityFrameworkCore;
using CHOStandard.MSSQL.CHOMandrillTask.EF;
using CHOStandard.MSSQL.CHOMandrillTask.Models;

namespace CHOStandard.MSSQL.General.CommandModels
{
    public class GeneralCommand : NLoggable
    {
        private string _dbConnectionString;

        public GeneralCommand(string connString)
        {
            _dbConnectionString = connString;
        }

        public Guid AddFileToDB(string fileName, string extension, byte[] data)
        {
            using (var _dbContext = new MandrillTaskContext(_dbConnectionString))
            {
                string fileHash = CHOUtils.SHA1Hash(data);
                var fa = _dbContext.FileAsset.FirstOrDefault(x => x.FileName == fileName && x.FileExtension == extension && x.FileHash == fileHash);
                if (fa != null)
                    return fa.GUID;

                fa = new FileAsset() { GUID = Guid.NewGuid(), FileName = fileName, FileExtension = extension, Data = data, FileHash = fileHash };
                _dbContext.Entry(fa).State = EntityState.Added;
                _dbContext.SaveChanges();
                return fa.GUID;
            }
        }

        public int MarkTaskFileAssetForDelete(int taskId)
        {
            try
            {
                using (var _dbContext = new MandrillTaskContext(_dbConnectionString))
                {
                    var taskFileAssets = _dbContext.MandrillTaskFileAsset.Where(x => x.MandrillTaskID == taskId);
                    foreach (var tfa in taskFileAssets)
                    {
                        var fa = _dbContext.FileAsset.SingleOrDefault(x => x.ID == tfa.FileAssetID);
                        if (fa != null)
                        {
                            fa.MarkedForDeleteBy = DateTime.Now;
                            _dbContext.Entry(fa).State = EntityState.Modified;
                        }
                        _dbContext.Entry(tfa).State = EntityState.Deleted;
                    }
                    _dbContext.SaveChanges();
                }

                return 1;
            }
            catch(Exception ex)
            {
                Log(string.Format("CleanupFileAssets error: {0}", ex.Message), 28000, LogLevel.Error, exception: ex);
                return -1;
            }
        }

        public bool CleanupFileAssets()
        {
            var now = DateTime.Now;
            using (var _dbContext = new MandrillTaskContext(_dbConnectionString))
            {
                var fileAssetsToDelete = _dbContext.FileAsset.Where(x => x.MarkedForDeleteBy < now);
                if (fileAssetsToDelete == null)
                    return false;

                try
                {
                    foreach (var f1 in fileAssetsToDelete)
                    {
                        var mtfa1 = _dbContext.MandrillTaskFileAsset.FirstOrDefault(x => x.FileAssetID == f1.ID);
                        if (mtfa1 == null)
                            _dbContext.Entry(f1).State = EntityState.Deleted;
                    }
                    _dbContext.SaveChanges();

                }
                catch (Exception ex)
                {
                    Log(string.Format("CleanupFileAssets error: {0}", ex.Message), 0, LogLevel.Error, exception: ex);
                    throw;
                }

                return false;
            }
        }

        public string GetAttachmentType(string fileExtension)
        {
            try
            {
                return MimeMapping.MimeTypes.GetMimeMapping(fileExtension.ToLower());
            }
            catch (Exception ex)
            {
                Log("Attachment type error.", 0, LogLevel.Error, new object[] { fileExtension }, ex);
            }
            return "";
        }
    }
}
