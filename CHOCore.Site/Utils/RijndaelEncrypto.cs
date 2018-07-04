using System;
using System.IO;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using CHOCore.Site.Enums;
using CHOCore.Site.Interfaces;

namespace CHOCore.Site.Utils
{
    public class RijndaelEncrypto: IRijndaelEncrypto
    {

        private readonly byte[] p2p_iv = { 0x69, 0xfa, 0x6f, 0xf1, 0x48, 0x10, 0x54, 0x64, 0x85, 0xdc, 0xe4, 0x62, 0xe1, 0x1c, 0xc3, 0x76 };

        private readonly byte[] p2p_key = { 0xfa, 0xa7, 0x04, 0x4d, 0x3c, 0xcf, 0x92, 0xe7, 0x32, 0x8f, 0xac, 0x53, 0x8c, 0xbc, 0x8b, 0xbf, 0x0a, 0xcb, 0xbb, 0x6f, 0xad, 0x45, 0xbc, 0x7f, 0x19, 0x66, 0x52, 0x12, 0x07, 0x57, 0xa3, 0x04 };

        private byte[] iv;
        private byte[] key;

        public RijndaelEncrypto()
        {
            key = p2p_key;
            iv = p2p_iv;
        }

        public string DecryptToBase64(string cipherText)
        {
            if (string.IsNullOrEmpty(cipherText))
                throw new ArgumentNullException("cipherText in SimpleRijndael decrypt");

            if (!IsBase64String(cipherText))
                throw new Exception("The cipherText input parameter is not base64 encoded");

            string text;

            var aesAlg = new RijndaelManaged();
            aesAlg.Key = key;
            aesAlg.IV = iv;
            var decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
            var cipher = Convert.FromBase64String(cipherText);

            using (var msDecrypt = new MemoryStream(cipher))
            using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
            using (var srDecrypt = new StreamReader(csDecrypt))
                text = srDecrypt.ReadToEnd();

            return text;
        }

        private bool IsBase64String(string base64String)
        {
            base64String = base64String.Trim();
            return (base64String.Length % 4 == 0) &&
                   Regex.IsMatch(base64String, @"^[a-zA-Z0-9\+/]*={0,3}$", RegexOptions.None);
        }


        public string EncryptFromBase64(string text)
        {
            if (string.IsNullOrEmpty(text))
                throw new ArgumentNullException("text");

            var aesAlg = new RijndaelManaged();
            aesAlg.Key = key;
            aesAlg.IV = iv;
            var encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
            var msEncrypt = new MemoryStream();

            using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
            using (var swEncrypt = new StreamWriter(csEncrypt))
                swEncrypt.Write(text);

            return Convert.ToBase64String(msEncrypt.ToArray());
        }

    }
    
}
