using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CHOCore.Site.Interfaces
{
    public interface IRijndaelEncrypto
    {
        string DecryptToBase64(string cipherText);
        string EncryptFromBase64(string text);
    }
}
