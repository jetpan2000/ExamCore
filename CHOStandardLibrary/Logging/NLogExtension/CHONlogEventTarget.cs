using NLog;
using NLog.Targets;

namespace CHOStandard.Logging.NLogExtension
{
    [Target("CHONlogEventTarget")]
    public sealed class CHONlogEventTarget : TargetWithLayout
    {
        public CHONlogEventTarget()
        {
        }

        protected override void Write(LogEventInfo logEvent)
        {
            string logMessage = this.Layout.Render(logEvent);

            logToEventLogger(logEvent, logMessage);
        }

        private void logToEventLogger(LogEventInfo logEvent, string logMessage)
        {
                //currently appearantly not possible to log into Windows Event Log using .NET standard!
        }
    }
    
}
