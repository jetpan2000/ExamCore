import * as Chance from "chance";
import "isomorphic-fetch";
import {} from "jest";
import { APICCType, getIssuer, saveCCInfoApiEndpoint, userPaymentDetailsAPIEndpoint, userPaymentInfoLoader, userPaymentInfoSaver } from "../../../../src/shared/utils/api/userPaymentInfoLoader";

const chance = new Chance();

const apiPaymentInfoData = {
  "d": {
    "ccNumberObfuscated": chance.word(),
    "ccExpMonth": chance.word(),
    "ccExpYear": chance.word(),
    "ccHolderName": chance.word(),
    "checkSaveCCOnFile": chance.word(),
    "ccType": APICCType,
  },
};

const ccInfoData = {
  "edCCInfo_lstCCExpMonth_new": chance.word(),
  "edCCInfo_lstCCExpYear_new": chance.word(),
  "edCCInfo_txtCCHolderName_new": chance.word(),
  "edCCInfo_txtCCNumber_new": chance.word(),
};

const storedPaymentMethodData = {
  "cardHolderName": chance.word(),
  "ccCardType": chance.word(),
  "ccDigits": chance.word(),
  "ccExpYear": chance.word(),
  "ccExpMonth": chance.word(),
  "saveCCOnFile": chance.pickone(["en", "fr"]),
};

const expectedData = {
  ccNumberObfuscated: apiPaymentInfoData.d.edCCInfo_txtCCNumber_new,
  ccExpMonth: apiPaymentInfoData.d.edCCInfo_lstCCExpMonth_new,
  ccExpYear: apiPaymentInfoData.d.edCCInfo_lstCCExpYear_new,
  ccHolderName: apiPaymentInfoData.d.edCCInfo_txtCCHolderName_new,
  checkSaveCCOnFile: apiPaymentInfoData.d.chkSaveCCOnFile,
  ccType: apiPaymentInfoData.d.ccType,
};

describe("util/api/userPaymentInfoLoader.test.ts", () => {

  describe("its userPaymentInfoLoader", () => {

    it("should call fetchWrapper.get and return proper object", () => {
      fetch.mockResponse(JSON.stringify(apiPaymentInfoData), { status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        }
      };

      return userPaymentInfoLoader(userPaymentDetailsAPIEndpoint).then(data => {
        expect(typeof(data)).toEqual("object");
        expect(data).toEqual(expectedData);
      });
    });

    it("should set Response.ok to false after bad API call", () => {
      const fakeException = JSON.stringify("Unable to complete your request");
      const fakeStatus = {
        status: 400,
        statusText: "Bad Request",
      };

      fetch.mockResponse(fakeException, fakeStatus);

      return userPaymentInfoLoader(userPaymentDetailsAPIEndpoint).catch((e) => {
        expect(e.ok).toEqual(false);
      });
    });
  });

  describe("its userPaymentInfoSaver", () => {

    it("should call fetchWrapper.get and return proper object when cardType is equal to mastercard", () => {
      fetch.mockResponse(JSON.stringify(apiPaymentInfoData), { status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        },
      };

      return userPaymentInfoSaver(ccInfoData, storedPaymentMethodData).then((data) => {
        expect(typeof(data)).toEqual("object");
        expect(data).toEqual(expectedData);
      });
    });

    it("should call fetchWrapper.get and return proper object when cardType is equal to visa", () => {
      fetch.mockResponse(JSON.stringify(apiPaymentInfoData), { status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        },
      };

      return userPaymentInfoSaver(ccInfoData, storedPaymentMethodData).then((data) => {
        expect(data).toEqual(expectedData);
      });
    });

    it("should return {errorCode: '-973'} if data received is equal to {'d': null} even if api call was successful", () => {
      const apiPaymentInfoNullData = {
        "d": null,
      };
      fetch.mockResponse(JSON.stringify(apiPaymentInfoNullData), { status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        },
      };

      return userPaymentInfoSaver(ccInfoData, storedPaymentMethodData).catch(e => {
        expect(e).toEqual({errorCode: "-973"});
      });
    });

    it("should set Response.ok to false after bad API call", () => {
      const fakeException = JSON.stringify("Unable to complete your request");
      const fakeStatus = {
        status: 400,
        statusText: "Bad Request",
      };

      fetch.mockResponse(fakeException, fakeStatus);

      return userPaymentInfoSaver(ccInfoData, storedPaymentMethodData).catch(e => {
        expect(e.ok).toEqual(false);
      });
    });
  });

  describe("getIssuer", () => {

    it('should return "VISA" when CardType.visa is passed', () => {
      expect(getIssuer(0)).toEqual("VISA");
    });

    it('should return "MASTERCARD" when CardType.visa is passed', () => {
      expect(getIssuer(2)).toEqual("MASTERCARD");
    });

    it('should return "AMEX" when CardType.visa is passed', () => {
      expect(getIssuer(3)).toEqual("AMEX");
    });
  });

});
