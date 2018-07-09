using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNETMVC.Utils
{
   
    public class EmailSender
    {
        public EmailSender()
        {

        }

        public virtual bool Send(string email, string subject, string contnet)
        {
            if (email == "jetpan2000@yahoo.ca")
            {
                throw new Exception("Not ready yet");
            }
            else
            {
                //send email
            }

            return true;
        }
    }

    public class MyCustomer
    {
        EmailSender _emailSender;
        public MyCustomer(EmailSender emailObj)
        {
            this._emailSender = emailObj;
        }
        //  public   bool AddNew(string email, EmailSender emailObj)
        public bool AddNew(string email)
        {


            //EmailSender emailObj = new EmailSender();
            this._emailSender.Send(email, "subject", "content");

            // add to db this customer
            return true;
        }
    }
}
