using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Configuration;
using System.Threading;
using System.Threading.Tasks;
using CHOStandard.Tasks;
using System.IO;

namespace MandrillTaskService
{
    public partial class CHOWindowsService : ServiceBase
    {
        const int DEFAULT_NUM_THREADS = 1;
        const int DEFAULT_SLEEPTIME_MS = 10000;
        private static int threads;
        volatile static bool[] threadIsRunning;
        volatile static bool timeToStop = false;
        private static int sleepTime;
        private static TaskType taskType;
        private static string DBConnectionString;
        private static readonly string CHO_TASK_SERVICE_VERSION_KEY= "5ec5a65b-8ddb-4013-a617-e06f1d274fa6"; // must be same with sValue of application setting sKey
        public CHOWindowsService() 
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            //args, then read file
            //initialize dbstring etc
            try
            {
                InitializeCHOWindowsService(args);                

                StartTaskThreads();

                Logger.LogMessage($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")} Started CHO task windows service: {taskType}");
            }
            catch (Exception ex)
            {
                Logger.LogMessage($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")} Service OnStart error: {ex.Message}", EventLogEntryType.Error);
            }
        }

        protected override void OnStop()
        {
            timeToStop = true;

            for (int i = 0; i < threads; i++)
            {
                while (threadIsRunning[i] == true)
                {
                    Thread.Sleep(1000);
                }
            }

            base.OnStop();
            Logger.LogMessage($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")} Stopped CHO task windows service gracefully: {taskType}");
        }

        private static void InitializeCHOWindowsService(string[] args)
        {
            string threadsSetting = args.Length > 0 ? args[0] : ConfigurationManager.AppSettings["Threads"];
            if (!int.TryParse(threadsSetting, out threads))
                threads = DEFAULT_NUM_THREADS;

            threadIsRunning = new bool[threads];

            if (!int.TryParse(ConfigurationManager.AppSettings["SleepTime"], out sleepTime))
                sleepTime = DEFAULT_SLEEPTIME_MS;

            if (Enum.TryParse(ConfigurationManager.AppSettings["TaskType"], out TaskType taskTypeSetting))
                taskType = taskTypeSetting;
            else
            {
                Logger.LogMessage("Illegal enum task type.", EventLogEntryType.Error);
                throw new Exception("Illegal enum task type.");
            }

            DBConnectionString = ConfigurationManager.AppSettings["DBConnectionString"];

            Logger.LogMessage(string.Format("CHOService initialized: DBConnectionString: {0}, TaskType: {1}, Threads: {2}, SleepTime: {3}.", DBConnectionString, taskType, threads, sleepTime));
        }

        public static void StartTaskThreads()
        {
            for (int i = 0; i < threads; i++)
            {
                Task.Factory.StartNew(() => ProcessTasks(i, taskType, sleepTime, DBConnectionString, CHO_TASK_SERVICE_VERSION_KEY));

                Thread.Sleep(3000);
            }
        }

        public static async Task ProcessTasks(int threadNo, TaskType taskType, int sleepTime, string dbstring, string versionKey)
        {
            while (true && !timeToStop)
            {
                await ProcessNextTask(threadNo, taskType, sleepTime, dbstring, versionKey);
            }
        }

        private static async Task ProcessNextTask(int threadNo, TaskType taskType, int sleepTime, string dbstring, string versionKey)
        {
            bool cont = true;
            try
            {
                threadIsRunning[threadNo] = true;
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
                        var mandrillEmailTask = new MandrillEmailTask(dbstring, versionKey);
                        cont = await mandrillEmailTask.ProcessTask();
                        break;
                    case TaskType.FileAssetCleanUp:
                        var fileAssetCleanUp = new FileAssetCleanUpTask(dbstring, versionKey);
                        cont = await fileAssetCleanUp.ProcessTask();
                        break;
                    default:
                        throw new ArgumentException("Invalid TaskType while processing next Task");
                }
                threadIsRunning[threadNo] = false;
            }
            catch (Exception ex)
            {
                threadIsRunning[threadNo] = false;
                Logger.LogMessage(string.Format("Task process error, TaskType: {0}. Details: {1}", taskType, ex.Message), EventLogEntryType.Error);
                cont = false;
            }

            if (!cont)
                await Task.Delay(sleepTime);
        }
    }

    public class Logger
    {
        private static string sSource = "CHO_info";
        private static string sLog = "Application";

        public static void LogMessage(string message, EventLogEntryType logType = EventLogEntryType.Information)
        {
            if (!EventLog.SourceExists(sSource))
                EventLog.CreateEventSource(sSource, sLog);

            EventLog.WriteEntry(sSource, message, logType);            
        }
    }
}
