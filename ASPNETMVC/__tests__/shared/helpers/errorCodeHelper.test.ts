import * as Chance from "chance";
import {} from "jest";
import { ErrorCode, ResponseErrorType } from "../../../src/shared/constants/ErrorCode";
import { creditErrorCodeMap, errorCodeTranslator, giftErrorCodeMap, paypalErrorMap } from "../../../src/shared/helpers/errorCodeHelper";
import { PaypalStage } from "../../../src/shared/interfaces/index";

const chance = new Chance();
const creditErrorCodeList = ["0", "-1", "-2", "-3", "-4", "-5", "-6", "-7", "-8", "-9", "-10"];
const giftCardErrorCodeList = ["0", "-1", "-2"];

describe("helpers/errorCodeHelper.test.ts", () => {

  describe("its errorCodeTranslator", () => {

    it("should return proper credit card error if ResponseErrorType is equal to CREDIT", () => {
      const errorCode = chance.pickone(creditErrorCodeList);
      expect(errorCodeTranslator(ResponseErrorType.CREDIT, errorCode, PaypalStage.INITIAL)).toEqual(creditErrorCodeMap[errorCode]);
    });

    it("should return proper gift card error if ResponseErrorType is equal to GIFTCARD", () => {
      const errorCode = chance.pickone(giftCardErrorCodeList);
      expect(errorCodeTranslator(ResponseErrorType.GIFTCARD, errorCode, PaypalStage.INITIAL)).toEqual(giftErrorCodeMap[errorCode]);
    });

    it("should return proper paypal error if ResponseErrorType is equal to PAYPAL and paypalStage is equal to INITIAL", () => {
      const errorCode = chance.pickone(["0", "-1", "-2", "-5", "-7"]);
      expect(errorCodeTranslator(ResponseErrorType.PAYPAL, errorCode, PaypalStage.INITIAL)).toEqual(paypalErrorMap.initial[errorCode]);
    });

    it("should return proper paypal error if ResponseErrorType is equal to PAYPAL and paypalStage is equal to RETURN", () => {
      const errorCode = chance.pickone(["0", "-1"]);
      expect(errorCodeTranslator(ResponseErrorType.PAYPAL, errorCode, PaypalStage.RETURN)).toEqual(paypalErrorMap.redirect[errorCode]);
    });

    it("should return proper paypal error if ResponseErrorType is equal to PAYPAL and paypalStage is equal to INAL_SUBMIT", () => {
      const errorCode = chance.pickone(["0", "-2", "-3", "-4"]);
      expect(errorCodeTranslator(ResponseErrorType.PAYPAL, errorCode, PaypalStage.FINAL_SUBMIT)).toEqual(paypalErrorMap.final[errorCode]);
    });

    it("should return ErrorCode.INTERNAL_SERVER_ERROR if ResponseErrorType is equal to PAYPAL and paypalStage stage is not equal to INITIAL, REDIRECT or FINAL_SUBMIT", () => {
      const errorCode = chance.pickone(["0", "-2", "-3", "-4"]);
      expect(errorCodeTranslator(ResponseErrorType.PAYPAL, errorCode, chance.word())).toEqual(ErrorCode.INTERNAL_SERVER_ERROR);
    });
  });
});