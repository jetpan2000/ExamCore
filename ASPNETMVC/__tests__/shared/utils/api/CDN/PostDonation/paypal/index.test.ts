import * as Chance from "chance";
import "isomorphic-fetch";
import {} from "jest";

import { getPaypalDetails, initializePaypalDonation, submitPaypalDonation } from "../../../../../../../src/shared/utils/api/CDN/PostDonation/paypal/index";
import { FormTypes } from "../../../../../../../src/shared/constants/FormType";

const chance = new Chance();

describe("utils/api/CDN/PostDonation/paypal/index", () => {

  describe("its initializePaypalDonation", () => {
    let paypalInitialRequest;

    beforeEach(() => {
      paypalInitialRequest = {
        paypalDonationVM: {
          LanguageCode: chance.natural(),
          DonationAmount: chance.natural(),
          isMonthly: chance.word(),
          CHODonationAmount: chance.natural(),
          ECardRequested: chance.pickone([true, false]),
          DonationEcardVM: {
            RecipientName: chance.word(),
            RecipientEmail: chance.word(),
            SenderName: chance.word(),
            SenderEmail: chance.word(),
            Message: chance.word(),
            DetailID: chance.word(),
          },
          DonationCardRequested: chance.pickone([true, false]),
          DonationCardRequestVM: {
            CardMessage: chance.word(),
            CardSignature: chance.word(),
            City: chance.word(),
            Country: chance.word(),
            FirstName: chance.word(),
            LastName: chance.word(),
            PostalCode: chance.word(),
            Province: chance.word(),
            Street1: chance.word(),
            Street2: chance.word(),
            Title: chance.word(),
          },
          PageID: chance.natural(),
          CharityID: chance.natural(),
          FundID: chance.natural(),
          HonoureeName: chance.word(),
          HonoureeType: chance.word(),
          MessageToCharity: chance.word(),
          CharityURL: chance.word(),
          AnonymityID: chance.natural(),
          MonthlyGiftTerminationType: chance.word(),
          MonthlyGiftRecurrenceDate: Date,
          MonthlyGiftEndDate: new Date(chance.date({string: true, american: false})),
          MonthlyGiftEndCount: chance.word(),
          MonthlyGiftProcessToday: chance.natural(),
          isMobile: chance.pickone([true, false]),
          isEmbeded: chance.pickone([true, false]),
        },
        extraInfo: {
          QuestionOne: chance.word(),
          AnswerOne: chance.word(),
        },
      };
    });

    it("should return string after successful API call", () => {
      const expectedData = chance.string();
      (fetch as any).mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success"});

      return initializePaypalDonation(paypalInitialRequest, FormTypes.FULLFORM).then(data => {
        expect((fetch as any).mock.calls[0][0].url).toEqual("/services/wa/dnm/PostToPayPalWithExtraInfo");
        expect(typeof(data)).toEqual("string");
        expect(data).toEqual(expectedData);
      });
    });

    it("should catch error if API returned error object", () => {
      const expectedError = {
        "mockKey1": chance.word(),
        "mockKey2": chance.word(),
        "mockKey3": chance.word(),
      };

      fetch.mockResponse(JSON.stringify(expectedError), { status: 200, statusText: "Success"});

      return initializePaypalDonation(chance.word(), FormTypes.FULLFORM).catch(e => {
        expect(e).toEqual(expectedError);
        expect(typeof(e)).toEqual("object");
      });
    });

    it("should return error if not data passed failed during JSON parse", () => {
      const expectedData = chance.word();
      fetch.mockResponse(expectedData, { status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        },
      });

      return initializePaypalDonation(JSON.stringify(paypalInitialRequest), FormTypes.FULLFORM).catch(e => {
        expect(e).toEqual("JSON Parse failed");
      });
    });

    it("should set Response.ok to false after bad API call", () => {
      const fakeException = JSON.stringify("Unable to complete your request");
      const fakeStatus = {
        status: 400,
        statusText: "Bad Request",
      };

      fetch.mockResponse(fakeException, fakeStatus);

      return initializePaypalDonation(chance.word(), FormTypes.FULLFORM).catch( e => {
        expect(e.ok).toEqual(false);
      });
    });
  });

  describe("its getPaypalDetails", () => {
    let paypalRedirectRequest;

    beforeEach(() => {
      paypalRedirectRequest = {
        token: chance.word(),
      };
    });

    it("should return data object after successful API call", () => {
      const expectedRedirectFromPaypalResponse = {
        paypalConfirmVM: {
          DonorProfile: {
            Title: chance.word(),
            DonorFirstName: chance.word(),
            DonorLastName: chance.word(),
            CompanyName: chance.word(),
            Street1: chance.word(),
            Street2: chance.word(),
            City: chance.word(),
            Country: chance.word(),
            Province: chance.word(),
            PostalCode: chance.word(),
            DonorEmailAddress: chance.word(),
            DonorLanguageCode: chance.natural(),
            DonorID: chance.natural(),
            isLoggedIn: chance.pickone([true, false]),
            hidDonorType: chance.word(),
            ProvinceOther: chance.word(),
          },
          CID: chance.word(),
          Token: chance.word(),
          PayerID: chance.word(),
        },
        paypalDonationInfoVM: {
          LanguageCode: chance.natural(),
          PageID: chance.natural(),
          FundID: chance.natural(),
          HonoureeType: chance.natural(),
          HonoureeName: chance.word(),
          MessageToCharity: chance.word(),
          DonationAmount: chance.natural(),
          isMonthly: chance.pickone([true, false]),
          CHODonationAmount: chance.natural(),
          MonthlyGiftTerminationType: chance.natural(),
          MonthlyGiftRecurrenceDate: `${new Date(chance.date({string: true, american: false}))}`,
          MonthlyGiftEndDate: `${new Date(chance.date({string: true, american: false}))}`,
          MonthlyGiftEndCount: chance.natural(),
          MonthlyDonationType: chance.natural(),
          AnonymityID: chance.natural(),
          MonthlyGiftProcessToday: true,
          CharityID: chance.natural(),
          CharityName: chance.word(),
          CharityURL: chance.word(),
          GoogleAnalyticsAccount: chance.word(),
          GoogleTagManagerAccount: chance.word(),
          DonorID: chance.natural(),
          DonationCardRequested: chance.pickone([true, false]),
          ECardRequested: chance.pickone([true, false]),
          DonationEcardVM: {
            RecipientName: chance.word(),
            RecipientEmail: chance.word(),
            SenderName: chance.word(),
            SenderEmail: chance.word(),
            Message: chance.word(),
            DetailID: chance.word(),
          },
          DonationCardRequestVM: {},
          DonationSourceOverride: chance.word(),
          DonationSourceID: chance.natural(),
          PartnerTransactionID: chance.word(),
          PartnerOverRide: {
            ID: chance.natural(),
            Data: {
              QuestionOne: chance.word(),
              AnswerOne: chance.word(),
              PhoneNumber: chance.word(),
              AddToMailingList: chance.pickone([true, false]),
            },
          },
          isMobile: chance.pickone([true, false]),
          isEmbeded: chance.pickone([true, false]),
        },
      };
      fetch.mockResponse(JSON.stringify(expectedRedirectFromPaypalResponse), {status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        },
      });

      return getPaypalDetails(paypalRedirectRequest).then(data => {
        expect(typeof(data)).toEqual("object");
        expect(data).toEqual(expectedRedirectFromPaypalResponse);
      });
    });

    it("should set Response.ok to false after bad API call", () => {
      const fakeException = JSON.stringify("Unable to complete your request");
      const fakeStatus = {
        status: 400,
        statusText: "Bad Request",
      };

      fetch.mockResponse(fakeException, fakeStatus);

      return initializePaypalDonation(paypalRedirectRequest, FormTypes.FULLFORM).catch( e => {
        expect(e.ok).toEqual(false);
      });
    });
  });

  describe("its submitPaypalDonation", () => {
    let paypalSubmitRequest;

    beforeEach(() => {
      paypalSubmitRequest = {
        DonorProfile: {
          Title: chance.word(),
          DonorFirstName: chance.word(),
          DonorLastName: chance.word(),
          CompanyName: chance.word(),
          Street1: chance.word(),
          Street2: chance.word(),
          City: chance.word(),
          Country: chance.word(),
          Province: chance.word(),
          PostalCode: chance.word(),
          DonorEmailAddress: chance.word(),
          DonorLanguageCode: chance.natural(),
          DonorID: chance.natural(),
          isLoggedIn: chance.pickone([true, false]),
          hidDonorType: chance.word(),
          ProvinceOther: chance.word(),
        },
        CID: chance.word(),
        Token: chance.word(),
        PayerID: chance.word(),
      };
    });

    it("should return string after successful API call", () => {
      const expectedPaypalDonationSubmitResponse = {
        orderID: chance.word(),
        mgOrderID: chance.word(),
        action: chance.word(),
        label: chance.word(),
      };

      fetch.mockResponse(JSON.stringify(expectedPaypalDonationSubmitResponse), {status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        },
        url: "/services/wa/dnm/SubmitPayPalDonation",
      });

      return submitPaypalDonation(paypalSubmitRequest).then(data => {
        expect(typeof(data)).toEqual("object");
        expect(data).toEqual(expectedPaypalDonationSubmitResponse);
      });
    });

    it("should set Response.ok to false after bad API call", () => {
      const fakeException = JSON.stringify("Unable to complete your request");
      const fakeStatus = {
        status: 400,
        statusText: "Bad Request",
      };

      fetch.mockResponse(fakeException, fakeStatus);

      return submitPaypalDonation(chance.word()).catch(e => {
        expect(e.ok).toEqual(false);
      });
    });
  });
});
