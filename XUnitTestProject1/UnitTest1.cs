using System;
using Xunit;
using ASPNETMVC.Utils;
using Moq;

namespace XUnitTestProject1
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
           

            string email = "jetpan2000@yahoo.ca";
              Mock<EmailSender> emailSender = new Mock<EmailSender>();
              emailSender.Setup(x=>x.Send(email,"subject","content")).Returns(true);
            //arrange
            MyCustomer mycust = new MyCustomer();
            //act
            //  EmailSender emailSender = new EmailSender();
            bool ret = mycust.AddNew(email, emailSender.Object);

            bool ret2 = mycust.AddNew(email, new EmailSender());


            Assert.True( ret);

            Assert.True(ret2);

            //Assert;
        }
    }
}
