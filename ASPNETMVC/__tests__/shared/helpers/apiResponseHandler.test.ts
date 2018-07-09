import * as Chance from "chance";
import {} from "jest";
import { ErrorCode, ResponseErrorType } from "../../../src/shared/constants/ErrorCode";
import { FormTypes } from "../../../src/shared/constants/FormType";
import { apiResponseHandler } from "../../../src/shared/helpers/apiResponseHandler";
import { errorCodeTranslator } from "../../../src/shared/helpers/errorCodeHelper";
import { PaypalStage } from "../../../src/shared/interfaces";
import { PageInfo } from "./../../../src/shared/interfaces/PageInfo";

const chance = new Chance();

describe("helpers/apiResponseHandler.test.ts", () => {
    let pageInfo: PageInfo;
    beforeEach(() => {
      pageInfo = {
        PageID: chance.natural(),
        PageName: chance.word(),
        PageStatus: chance.word(),
        FundID: chance.natural(),
        FundIDFR: chance.natural(),
        FundraisingProgressEnabled: chance.bool(),
        AmountRaised: chance.natural(),
        FundraisingGoalAmount: chance.natural(),
        RecentDonationsEnabled: chance.natural(),
        RecentDonations: chance.pickset([chance.word(), chance.word(), chance.word()]),
        MonthlyGivingEnabled: chance.bool(),
        PreferedDonationType: chance.natural(),
        CHOSuggestedDonationEnabled: chance.bool(),
        AmountType: chance.natural(),
        AmountLevelsDict: {},
        MonthlyAmountType: chance.natural(),
        MonthlyAmountLevelsDict: {},
        DesignationEnabled: chance.bool(),
        CardRequestEnabled: chance.bool(),
        AnonymityPrefEnabled: chance.bool(),
        RedirectURL: chance.word(),
        BackgroundImageID: chance.natural(),
        BackgroundProperties: {
          color: chance.word(),
          position: chance.word(),
          tile: chance.word(),
        },
        BrandingProperties: {
          titleBarTextColor: chance.word(),
          titleBarBackgroundColor: chance.word(),
          accentColor: chance.word(),
        },
        BackgroundType: chance.natural(),
        GoogleAnalyticsAccount: chance.word(),
        GoogleTagManagerAccount: chance.word(),
        Heading: chance.word(),
        Description: chance.word(),
        PageType: chance.natural(),
        HeaderImageID: chance.natural(),
        QuestionOne: chance.word(),
        EmbededTitle: chance.word(),
        EmbededDescription: chance.word(),
        EmbededHeaderImage: chance.natural(),
        EmbededHeaderStyle: chance.natural(),
        HideCHOEcards: chance.bool(),
        MultiStepHeader: chance.word(),
        FormType: chance.pickone([FormTypes.FULLFORM, FormTypes.MULTI_STEP]),
        SelectedOneTimeSmartSum: chance.natural(),
        SelectedMonthlySmartSum: chance.natural(),
        EnableSmartSumOneTime: chance.bool(),
        EnableSmartSumMonthly: chance.bool(),
        EnableMailingListQuestion: chance.bool(),
        EnablePhoneNumberCollection: chance.bool(),
        IsReceiptless: chance.bool(),
      };
    });
    it("should return proper donation response when apiResponseHandler.serverError is called and response passed is null or undefined", () => {
      const expectedDonationResponse = {
        errorCode: ErrorCode.GENERIC_ERROR,
        requestSent: true,
        error: ResponseErrorType.CREDIT,
      };

      expect(apiResponseHandler.serverError(null, ResponseErrorType.CREDIT, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
    });

    it("should return proper donation response when apiResponseHandler.serverError is called and response passed is not null and has properties status and ok that equals true", () => {
      const response = {
        status: chance.word(),
        ok: true,
      };
      const expectedDonationResponse = {
        errorCode: errorCodeTranslator( ResponseErrorType.CREDIT, response.status.toString(), PaypalStage.INITIAL),
        requestSent: true,
        error: ResponseErrorType.CREDIT,
      };

      expect(apiResponseHandler.serverError(response, ResponseErrorType.CREDIT, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
    });

    it("should return proper donation response when apiResponseHandler.serverError is called and response passed is not null and has properties status and ok that equals false", () => {
      const response = {
        status: chance.word(),
        ok: false,
      };
      const expectedDonationResponse = {
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        requestSent: true,
        error: ResponseErrorType.CREDIT,
      };

      expect(apiResponseHandler.serverError(response, ResponseErrorType.CREDIT, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
    });
  it("should return proper donation response when apiResponseHandler.serverError is called and response passed is not null but does not have properties: status and ok", () => {
    const response = {
      mockProperty: chance.word(),
    };
    const expectedDonationResponse = {
      errorCode: ErrorCode.GENERIC_ERROR,
      requestSent: true,
      error: ResponseErrorType.CREDIT,
    };

    expect(apiResponseHandler.serverError(response, ResponseErrorType.CREDIT, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.serverError is called and response passed is not null but does not have properties: status and ok", () => {
    const expectedDonationResponse = {
      errorCode: ErrorCode.GENERIC_ERROR,
      requestSent: true,
      error: ResponseErrorType.CREDIT,
    };

    expect(apiResponseHandler.serverError("", ResponseErrorType.CREDIT, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
  });
  it("should catch an error when apiResponseHandler.failedCredit is called and response passed is not null but does not have properties: status and ok", () => {
    const expectedDonationResponse = {
      errorCode: ErrorCode.GENERIC_ERROR,
      requestSent: true,
      error: ResponseErrorType.CREDIT,
    };

    expect(apiResponseHandler.failedCredit("", null)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.failedCredit is called and response.d[0] is equal to '0'", () => {
    const response = {
      status: chance.word(),
      ok: false,
      d: ["0", chance.word(), chance.word(), chance.word(), chance.word()],
    };
    const expectedDonationResponse = {
      errorCode: errorCodeTranslator(ResponseErrorType.CREDIT, response.d[0], null),
      mgOrderID: response.d[1],
      orderID: response.d[2],
      action: response.d[3],
      label: response.d[4],
      requestSent: true,
      error: ResponseErrorType.NONE,
      taxReceipt: !pageInfo.IsReceiptless,
    };

    expect(apiResponseHandler.failedCredit(response, pageInfo)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.failedCredit is called and response.d[0] is equal to '-1'", () => {
    const response = {
      status: chance.word(),
      ok: false,
      d: ["-1", chance.word(), chance.word(), chance.word(), chance.word()],
    };
    const expectedDonationResponse = {
      errorCode: errorCodeTranslator(ResponseErrorType.CREDIT, response.d[0], null),
      mgOrderID: response.d[2],
      orderID: response.d[3],
      action: "",
      label: "",
      requestSent: true,
      error: ResponseErrorType.NONE,
      taxReceipt: false,
    };

    expect(apiResponseHandler.failedCredit(response, pageInfo)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.failedCredit is called and response.d[0] is not equal to '-1' or '0'", () => {
    const response = {
      status: chance.word(),
      ok: false,
      d: ["-5", chance.word(), chance.word(), chance.word(), chance.word()],
    };
    const expectedDonationResponse = {
      errorCode: errorCodeTranslator(ResponseErrorType.CREDIT, response.d[0], null),
      errorMessage: response.d[1],
      requestSent: true,
      error: ResponseErrorType.CREDIT,
    };

    expect(apiResponseHandler.failedCredit(response, pageInfo)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.successCredit is called and response.d[0] is not equal to '-1' or '0'", () => {
    const response = {
      status: chance.word(),
      ok: false,
      d: ["-5", chance.word(), chance.word(), chance.word(), chance.word()],
    };
    const expectedDonationResponse = {
      errorCode: errorCodeTranslator(ResponseErrorType.CREDIT, response.d[0], null),
      errorMessage: response.d[1],
      requestSent: true,
      error: ResponseErrorType.CREDIT,
    };

    expect(apiResponseHandler.successCredit(response, pageInfo)).toEqual(expectedDonationResponse);
  });

  it("should catch an error when apiResponseHandler.successCredit is called", () => {
    const expectedDonationResponse = {
      errorCode: ErrorCode.GENERIC_ERROR,
      requestSent: true,
      error: ResponseErrorType.CREDIT,
    };

    expect(apiResponseHandler.successCredit("")).toEqual(expectedDonationResponse);
  });

  it("should catch an error when apiResponseHandler.failedGiftCard is called", () => {
    const response = {
      status: chance.word(),
      ok: false,
      text: jest.fn(),
    };
    const expectedDonationResponse = {
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      requestSent: true,
      error: ResponseErrorType.GIFTCARD,
    };

    expect(apiResponseHandler.failedGiftCard(response)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.failedPaypal is called and no response object was passed", () => {
    const expectedDonationResponse = {
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      error: ResponseErrorType.PAYPAL,
      requestSent: true,
    };

    expect(apiResponseHandler.failedPaypal(null, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.failedPaypal is called and response object has properties `error` and it has property `errorCode`", () => {
    const response = {
      error: {
        errorCode: ResponseErrorType.CREDIT,
      },
    };
    const expectedDonationResponse = {
      errorCode: errorCodeTranslator(ResponseErrorType.PAYPAL, response.error.errorCode, PaypalStage.INITIAL),
      error: ResponseErrorType.PAYPAL,
      requestSent: true,
    };

    expect(apiResponseHandler.failedPaypal(response, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.failedPaypal is called and response object does not have property `error` but has property `ok``", () => {
    const response = {
      ok: true,
      status: chance.word(),
    };
    const expectedDonationResponse = {
      errorCode: errorCodeTranslator(ResponseErrorType.PAYPAL, response.status, PaypalStage.INITIAL),
      error: ResponseErrorType.PAYPAL,
      requestSent: true,
    };

    expect(apiResponseHandler.failedPaypal(response, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.failedPaypal is called and response object does not have properties `error` and `ok``", () => {
    const response = {
      status: chance.word(),
    };
    const expectedDonationResponse = {
      errorCode: ErrorCode.GENERIC_ERROR,
      error: ResponseErrorType.PAYPAL,
      requestSent: true,
    };

    expect(apiResponseHandler.failedPaypal(response, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.paypalFinal is called and response object has properties `error` and it has property `errorCode`", () => {
    const response = {
      error: {
        errorCode: ResponseErrorType.CREDIT,
      },
    };
    const expectedDonationResponse = {
      errorCode: errorCodeTranslator(ResponseErrorType.PAYPAL, response.error.errorCode, PaypalStage.INITIAL),
      error: ResponseErrorType.PAYPAL,
      requestSent: true,
    };

    expect(apiResponseHandler.paypalFinal(response, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.paypalFinal is called and response object has no property `error` but has properties `orderID` or `myOrderID`", () => {
    const response = {
      orderID: chance.natural(),
      myOrderID: chance.natural(),
      action: jest.fn(),
      label: chance.word(),
    };
    const expectedDonationResponse = {
      errorCode: "0",
      error: ResponseErrorType.NONE,
      requestSent: true,
      action: response.action,
      label: response.label,
      mgOrderID: response.mgOrderID,
      orderID: response.orderID,
      taxReceipt: response.orderID.length > 0 && !pageInfo.IsReceiptless,
    };

    expect(apiResponseHandler.paypalFinal(response, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.paypalFinal is called and response object has no properties `error`, `orderID` and `myOrderID`", () => {
    const response = {
      mockProperty: chance.word(),
    };
    const expectedDonationResponse = {
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      error: ResponseErrorType.PAYPAL,
      requestSent: true,
    };

    expect(apiResponseHandler.paypalFinal(response, PaypalStage.INITIAL)).toEqual(expectedDonationResponse);
  });

  it("should return proper donation response when apiResponseHandler.paypalFinal is called and response object has no properties `error`, `orderID` and `myOrderID`", () => {
    const expectedDonationResponse = {
      errorCode: ErrorCode.GENERIC_ERROR,
      error: ResponseErrorType.PAYPAL,
      requestSent: true,
    };

    expect(apiResponseHandler.paypalFinal()).toEqual(expectedDonationResponse);
  });

});