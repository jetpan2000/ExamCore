using CHOStandard.Tasks;
using System;
using System.Threading.Tasks;
using System.Diagnostics;
using CHOStandard.MSSQL.General.CommandModels;

namespace MandrillTaskService
{

    public class ThreadFactory
    {
        public static async Task ProcessTasks(TaskType taskType, int sleepTime, string dbstring, string versionKey)
        {
            while (true)
            {
                await ProcessNextTask(taskType, sleepTime, dbstring, versionKey);
            }
        }

        private static async Task ProcessNextTask(TaskType taskType, int sleepTime, string dbstring, string versionKey)
        {
            bool cont = true;
            try
            {
                switch (taskType)
                {
                    case TaskType.BlankTestTask:
                        cont = false;
                        break;
                    //Note: Programmatically, after BlankTestTask the below test can be obstracted to
                    //we can cast everything to AbstractTask and run the override ProcessTask, however
                    // that loses all the debugging links and it becomes seriously hard to debug who is calling
                    //which task processor.
                    case TaskType.MandrillEmail:
                        var mandrillTask = new MandrillEmailTask(dbstring, versionKey);
                        cont = await mandrillTask.ProcessTask();
                        break;
                    case TaskType.FileAssetCleanUp:
                        var fileAssetCleanUp = new FileAssetCleanUpTask(dbstring, versionKey);
                        cont = await fileAssetCleanUp.ProcessTask();
                        break;
                    default:
                        throw new ArgumentException("Invalid TaskType while processing next Task");
                }
            }
            catch (Exception ex)
            {
                Logger.LogMessage(string.Format("Task process error, TaskType: {0}. Details: {1}", taskType, ex.Message), EventLogEntryType.Error);
                cont = false;
            }            

            if (!cont)
               await Task.Delay(sleepTime);
        }       
    }
}
