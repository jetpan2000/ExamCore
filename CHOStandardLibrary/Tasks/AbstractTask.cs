using CHOStandard.Logging;
using CHOStandard.MSSQL.General.QueryModels;
using CHOStandard.MSSQL.General.CommandModels;
using NLog;
using System;
using System.Threading.Tasks;

namespace CHOStandard.Tasks
{
    public enum TaskType
    {
        BlankTestTask = 0,
        MandrillEmail = 1,  
        FileAssetCleanUp = 2,
        MailChimpSync = 3,
    }
    public enum Status
    {
        Retrying = -1,
        Unprocessed= 0,
        InProgress = 1,
        Completed = 2,
        ErroredOut = 3,
    }
    public abstract class AbstractTask : NLoggable
    {
        const int DEFAULT_MAX_ATTEMPTS = 10;
        const int DEFAULT_TIME_RETRY_PERIOD_MINS = 5;

        public TaskType TaskType { get; protected set;}
        public int ID { get; protected set; }
        public Status Status { get; set; }
        public int AttemptsMade { get; protected set; }
        public DateTime ReprocessDateTime { get; set; }
        public DateTime LastProcessedDateTime { get; set; }
        /// <summary>
        /// Number of Attempts before it becomes ErrorOut state
        /// </summary>
        protected int MaxAttempts { get; set; } = DEFAULT_MAX_ATTEMPTS;
        /// <summary>
        /// Intervals are in minutes
        /// </summary>
        protected int RetryTimePeriod { get; set; } = DEFAULT_TIME_RETRY_PERIOD_MINS;

        protected string _dbConnectionString;

        abstract public Task<bool> ProcessTask();
        public AbstractTask(string dbString, string versionKeyName = null, string versionKeyValue= null, ILogger logger = null) : base (logger)
        {
            _dbConnectionString = dbString;
            if (!string.IsNullOrEmpty(versionKeyName))
            {
                var check = new ApplicationSettingQuery(dbString).GetValue(versionKeyName);
                if (check != versionKeyValue)
                    throw new InvalidOperationException($"Version Mismatch, {versionKeyName} should be {check} but it is {versionKeyValue}");
            }
        }

        protected void SetTaskToRetryLater()
        {
            if (AttemptsMade >= MaxAttempts)
                Status = Status.ErroredOut;
            else
            {
                AttemptsMade++;
                Status = Status.Retrying;
                IncreaseFibonachiTime();
            }
        }

        protected void SetTaskToComplete()
        {
            AttemptsMade++;
            Status = Status.Completed;

            if (TaskType == TaskType.MandrillEmail)
                new GeneralCommand(_dbConnectionString).MarkTaskFileAssetForDelete(ID);
        }

        protected void IncreaseFibonachiTime()
        {
            ReprocessDateTime = DateTime.Now.AddMinutes(fibonacciMultiple(AttemptsMade) * RetryTimePeriod);
        }

        /// <summary>
        /// Returns fibonacci number
        /// </summary>
        /// <param name="iteration">Ranged Bound to 1-30.  if its outside this range it will snap to closest edge</param>
        /// <returns></returns>
        protected int fibonacciMultiple(int iteration)
        {
            //Note: iteration of 30 is a pretty big number.  (1346269)
            //Anything above that many multiples is outside the realms of what we're doing here
            //It must be bounded properly or the return value overflows into negative
            //and serious problems occurs
            int a = 0, b = 1, c = 0;

            if (iteration < 1) iteration = 1;
            if (iteration > 30) iteration = 30;

            for (int i=0; i < iteration; i++)
            {
                c = a + b;
                a = b;
                b = c;
            }
            return c;
        }
    }
}
