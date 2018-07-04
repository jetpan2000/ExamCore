using CHOCore.Site.Interfaces;
using CHOCore.Site.ViewModels;
using System.Collections.Generic;


namespace CHOCore.Site.Utils
{
    public class P2PViewModelHelper
    {
        private IRijndaelEncrypto _rijndaelEncrypto;
        public P2PViewModelHelper(IRijndaelEncrypto rijndaelEncrypto)
        {
            _rijndaelEncrypto = rijndaelEncrypto;
        }
        public P2PViewModel DecryptAndConstructP2PViewModel(string cypherText)
        {
            var decyptedString = _rijndaelEncrypto.DecryptToBase64(cypherText);
            var parameters = decyptedString.Split('&');
            Dictionary<string, string> parameterDictionary = new Dictionary<string, string>();
            foreach (string x in parameters)
            {
                var StringPair = x.Split('=');
                if (StringPair.Length == 2)
                    parameterDictionary.Add(StringPair[0], StringPair[1]);
            }

            var p2pViewModel = new P2PViewModel();
            if (parameterDictionary.ContainsKey("UID"))
                p2pViewModel.UID = parameterDictionary["UID"];
            if (parameterDictionary.ContainsKey("imageUrl"))
                p2pViewModel.imageUrl = parameterDictionary["imageUrl"];
            if (parameterDictionary.ContainsKey("theme"))
                p2pViewModel.theme = parameterDictionary["theme"];
            if (parameterDictionary.ContainsKey("type"))
                p2pViewModel.type = parameterDictionary["type"];
            if (parameterDictionary.ContainsKey("charityNameEn"))
                p2pViewModel.charityNameEn = parameterDictionary["charityNameEn"];
            if (parameterDictionary.ContainsKey("charityNameFr"))
                p2pViewModel.charityNameFr = parameterDictionary["charityNameFr"];
            if (parameterDictionary.ContainsKey("pageNameEn"))
                p2pViewModel.pageNameEn = parameterDictionary["pageNameEn"];
            if (parameterDictionary.ContainsKey("pageNameFr"))
                p2pViewModel.pageNameFr = parameterDictionary["pageNameFr"];
            if (parameterDictionary.ContainsKey("pageOwner"))
                p2pViewModel.pageOwner = parameterDictionary["pageOwner"];

            return p2pViewModel;
        }
    }
}
