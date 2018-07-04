using System.ServiceProcess;

namespace MandrillTaskService
{
    class MandrillProgram
    {
        static void Main(string[] args)
        {
            ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[]
            {
                new CHOWindowsService()
            };
            ServiceBase.Run(ServicesToRun);
        }
    }
}
