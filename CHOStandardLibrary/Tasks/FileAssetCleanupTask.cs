using System;
using System.Linq;
using NLog;
using System.Collections.Generic;
using System.Threading.Tasks;
using CHOStandard.MSSQL.CHOMandrillTask.Models;
using CHOStandard.MSSQL.General.CommandModels;

namespace CHOStandard.Tasks
{
    public class FileAssetCleanUpTask : AbstractTask
    {
        public FileAssetCleanUpTask(string dbConnectionString, string versionKey, ILogger logger = null) : base(dbConnectionString,"FileAssetCleanUp.VersionKey", versionKey , logger)
        {
            _dbConnectionString = dbConnectionString;
            TaskType = TaskType.FileAssetCleanUp;
        }

        public async override Task<bool> ProcessTask()
        {
            var generalCommand = new GeneralCommand(_dbConnectionString);
            return await Task.FromResult(generalCommand.CleanupFileAssets());
        }
    }
}
