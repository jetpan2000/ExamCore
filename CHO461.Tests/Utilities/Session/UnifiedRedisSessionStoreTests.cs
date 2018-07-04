using CHO461.Utilities.Session;
using System;
using Xunit;

namespace CHO461.Tests.Utilities.Session
{
    public class UnifiedRedisSessionStoreTests
    {
        UnifiedRedisSessionStore sessionStore;
        int sessionID;

        public UnifiedRedisSessionStoreTests()
        {
            sessionStore = new UnifiedRedisSessionStore("10.0.100.170");
        }

        [Trait("Utilities", "Session"), Fact]
        public void StoreValue_GetValue_Successful()
        {
            sessionID = new Random().Next(9999999);

            sessionStore.Set(sessionID.ToString(), "userID", "12345", 5, "unittest/");
            var ret = sessionStore.GetValue(sessionID.ToString(), "userID", "unittest/");

            Assert.Equal("12345", ret);
        }

        [Trait("Utilities", "Session"), Fact]
        public void Retrieve_NonExistent_Key()
        {
            var differentSessionID = new Random().Next(9999999);

            var ret = sessionStore.GetValue(differentSessionID.ToString(), "nothere", keyPrefix: "unittest/");

            Assert.Equal(null, ret);
        }
        [Trait("Utilities", "Session"), Fact]
        public void Retrieve_NonExistent_Field()
        {

            var ret = sessionStore.GetValue(sessionID.ToString(), "nosuchfield", keyPrefix: "unittest/");

            Assert.Equal(null, ret);
        }
    }
}