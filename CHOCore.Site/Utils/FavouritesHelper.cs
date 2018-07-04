using CHOCore.ModelLibrary.Favourite.Models;
using System.Collections.Generic;
using System.Linq;

namespace CHOCore.Site.Utils
{
    public class FavouritesHelper
    {
        public static FavouriteModel reshapeData(IEnumerable<FavouriteListModel> favouriteList)
        {
            return new FavouriteModel
            {
                totalThisYear = favouriteList.ToList().Sum(x => x.thisYearAmount),
                totalLastYear = favouriteList.ToList().Sum(x => x.lastYearAmount),
                favourites = favouriteList
            };
        }
    }
}
