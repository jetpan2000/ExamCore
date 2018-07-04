using System;
using System.Text;
using System.Security.Cryptography;
using System.IO;
using System.Xml;
using System.Xml.Serialization;
using CHOStandard.MailChimp.Models;

namespace CHOStandard.Utils
{
    public class CHOUtils
    {
        public static SHA1 sha1 = SHA1.Create();

        public static string SHA1Hash(byte[] byteArray)
        {
            return Convert.ToBase64String(sha1.ComputeHash(byteArray));
        }

        public static string MD5Hash(string input)
        {
            using (var md5 = MD5.Create())
            {
                byte[] inputBytes = Encoding.ASCII.GetBytes(input);
                byte[] hash = md5.ComputeHash(inputBytes);
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hash.Length; i++)
                {
                    sb.Append(hash[i].ToString("x2"));
                }
                return sb.ToString();
            }
        }

        public static string ToXML(Object obj)
        {
            XmlDocument xmlDoc = new XmlDocument();
            XmlSerializer xmlSerializer = new XmlSerializer(obj.GetType());
            using (MemoryStream xmlStream = new MemoryStream())
            {
                xmlSerializer.Serialize(xmlStream, obj);
                xmlStream.Position = 0;
                xmlDoc.Load(xmlStream);
                return xmlDoc.InnerXml;
            }
        }

        public static Object ToMCMemberRequest(string xml)
        {
            StringReader strReader = null;
            XmlSerializer serializer = null;
            XmlTextReader xmlReader = null;
            Object obj = null;
            strReader = new StringReader(xml);
            serializer = new XmlSerializer(typeof(MCMemberRequest));
            xmlReader = new XmlTextReader(strReader);
            obj = serializer.Deserialize(xmlReader);          
            return obj;
        }
    }    
}
