using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CHOCore.Site.Interfaces
{
    public interface IEmailHelper
    {
        void Send(bool isHtmlEmail, string body, string subject, string from, string recipients);
        void bulkSend(string from, string subject, string body, List<string> receipientList);

    }
}
