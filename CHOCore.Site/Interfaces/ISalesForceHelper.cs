using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CHOCore.Site.Interfaces
{
    public interface ISalesForceHelper
    {
        bool SubmitCaseToSalesForce(string caseType, string subject, string charityName, string charityBN, string senderMsg, string senderName, string senderEmail);
        void SubmitCaseViaEmail(string subject, string charityName, string charityBN, string senderMsg, string senderName, string senderEmail, bool isCharity, string customSubject);
    }
}
