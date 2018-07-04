using NLog;
using System;

namespace CHOStandard.Logging
{
    public class NLoggable
    {
        private readonly ILogger _logger;

        public NLoggable(ILogger logger = null)
        {
            _logger = logger;
        }

        protected void Log(string message,
                            int eventID,
                            LogLevel loglevel = null, 
                            object[] args = null, 
                            Exception exception = null)
        {
            
            if (_logger != null)
            {
                if (loglevel == null)
                    loglevel = LogLevel.Trace;

                var logEvent = new LogEventInfo(loglevel, _logger.Name, message);
                logEvent.Exception = exception;
                logEvent.Parameters = args;
                logEvent.Properties.Add("EventID", eventID);

                _logger.Log(logEvent);
            }
        }
    }
}
