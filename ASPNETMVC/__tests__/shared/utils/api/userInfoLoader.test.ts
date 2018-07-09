import * as Chance from "chance";
import "isomorphic-fetch";
import {} from "jest";
import { userDetailsAPIEndpoint, userDetailsSaveAPIEndpoint, userInfoLoader, userInfoSaver, userLoginStatus, userLoginStatusAPIEndpoint, userLogout, userLogoutAPIEndpoint } from "../../../../src/shared/utils/api/userInfoLoader";

const chance = new Chance();

const apiUserInfoData = {
  "d": {
    Title: chance.word(),
    FirstName: chance.word(),
    LastName: chance.word(),
    CompanyName: chance.word(),
    Line1: chance.word(),
    Line2: chance.word(),
    City: chance.word(),
    Country: chance.word(),
    Province: chance.word(),
    ProvinceOther: chance.word(),
    PostalCode: chance.word(),
    Email: chance.word(),
    CorporateDonor: chance.pickone(["en", "fr"]),
    DonorLanguageCode: chance.natural(),
    hidDonorType: chance.word(),
    isLoggedIn: chance.pickone(["en", "fr"]),
    silent: chance.pickone(["en", "fr"]),
  },
};

const apiLoginStatusData = {
  "d": {
    "isLoggedIn": chance.pickone(["en", "fr"]),
    "donorName": chance.word(),
  },
};

const apiUserSaveResponseData = {
  "d": chance.pickone(["en", "fr"]),
};

const apiLogoutData = {
  "success": chance.pickone(["en", "fr"]),
};

describe("util/api/userInfoLoader.test.ts", () => {

  describe("its userInfoLoader", () => {

    it("should call fetchWrapper.get and return object", () => {
      (fetch as any).mockResponse(JSON.stringify(apiUserInfoData), { status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        },
      };

      return userInfoLoader(userDetailsAPIEndpoint).then(data => {
        expect(typeof(data)).toEqual("object");
        expect(data).toEqual(apiUserInfoData.d);
      });
    });

    it("should set Response.ok to false after bad API call", () => {
      const fakeException = JSON.stringify("Unable to complete your request");
      const fakeStatus = {
        status: 400,
        statusText: "Bad Request",
      };

      fetch.mockResponse(fakeException, fakeStatus);

      return userInfoLoader(userDetailsAPIEndpoint).catch(e => {
        expect(e.ok).toEqual(false);
      });
    });
  });

  describe("its userLoginStatus", () => {

    it("should call fetchWrapper.get and return object", () => {
      (fetch as any).mockResponse(JSON.stringify(apiLoginStatusData), { status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        },
      };

      return userLoginStatus(userLoginStatusAPIEndpoint).then(data => {
        expect(typeof(data)).toEqual("object");
        expect(data).toEqual(apiLoginStatusData);
      });
    });

    it("should set Response.ok to false after bad API call", () => {
      const fakeException = JSON.stringify("Unable to complete your request");
      const fakeStatus = {
        status: 400,
        statusText: "Bad Request",
      };

      fetch.mockResponse(fakeException, fakeStatus);

      return userLoginStatus(userLoginStatusAPIEndpoint).catch(e => {
        expect(e.ok).toEqual(false);
      });
    });
  });

  describe("its userInfoSaver", () => {

    it("should call fetchWrapper.get and return object", () => {
      fetch.mockResponse(JSON.stringify(apiUserSaveResponseData), { status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        },
      };

      return userInfoSaver(userDetailsSaveAPIEndpoint).then(data => {
        expect(typeof(data)).toEqual("string");
        expect(data).toEqual(apiUserSaveResponseData.d);
      });
    });

    it("should set Response.ok to false after bad API call", () => {
      const fakeException = JSON.stringify("Unable to complete your request");
      const fakeStatus = {
        status: 400,
        statusText: "Bad Request",
      };

      fetch.mockResponse(fakeException, fakeStatus);

      return userInfoSaver(userDetailsSaveAPIEndpoint).catch((e) => {
        expect(e.ok).toEqual(false);
      });
    });
  });

  describe("its userLogout", () => {

    it("should call fetchWrapper.get and return object", () => {
      fetch.mockResponse(JSON.stringify(apiLogoutData), { status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        },
      };

      return userLogout(userLogoutAPIEndpoint).then(data => {
        expect(typeof(data)).toEqual("string");
        expect(data).toEqual(apiLogoutData.success);
      });
    });

    it("should set Response.ok to false after bad API call", () => {
      const fakeException = JSON.stringify("Unable to complete your request");
      const fakeStatus = {
        status: 400,
        statusText: "Bad Request",
      };

      fetch.mockResponse(fakeException, fakeStatus);

      return userLogout(userLogoutAPIEndpoint).catch((e) => {
        expect(e.ok).toEqual(false);
      });
    });
  });

});
