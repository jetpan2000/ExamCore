using CHOCore.ModelLibrary.General.QueryModels;
using CHOCore.Site.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CHOCore.Site.Utils
{
    public static class ViewModelHelper
    {
        public static DonateNowPageVM GetDNViewModel(int id, string _directDBConnectionString)
        {
            var donateNowModel = DonateNowQuery.getDonateNowPageByID(id, _directDBConnectionString);
            DonateNowPageVM viewModel = new DonateNowPageVM();
            viewModel.PageID = donateNowModel.PageID;
            viewModel.GoogleAnalyticsAccount = string.IsNullOrEmpty(donateNowModel.GoogleAnalyticsAccount) ? "" : donateNowModel.GoogleAnalyticsAccount;
            viewModel.GoogleTagManagerAccount = string.IsNullOrEmpty(donateNowModel.GoogleTagManagerAccount) ? "" : donateNowModel.GoogleTagManagerAccount;
            return viewModel;
        }
    }
}
