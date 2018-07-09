import * as Chance from "chance";
import {} from "jest";
import { cloneDeep } from "lodash";
import { PaymentMethod } from "../../../src/shared/constants/Payment";
import paymentUpdateHelper from "../../../src/shared/helpers/paymentUpdateHelper";
import { CreditUpdateValues, GiftCardUpdateValues, PaypalUpdateValues } from "../../../src/shared/helpers/paymentUpdateHelper";
import { getConfigValue, validateConfigValue } from "../../../src/shared/utils";
import { PaypalStage } from "../../../src/shared/utils/api/CDN/PostDonation/models/paypal";
import { validate } from "../../../src/shared/utils/validate";
import { PaymentInfo, ValidationState } from "../../../src/shared/utils/validate";

const chance = new Chance();

const creditCardDetails: CreditUpdateValues = {
  ccDirty: true,
  number: chance.word(),
  fullName: chance.word(),
  expiryYear: chance.word(),
  expiryMonth: chance.word(),
  cvn: chance.word(),
};

const giftCardDetails: GiftCardUpdateValues = {
  giftCardNumber: chance.word(),
  giftCardBalance: chance.natural(),
  giftCardAmount: chance.natural(),
  isSpent: true,
  hasSenderEmail: true,
  recipientThankYou: chance.word(),
  notifySenderOfCharityChoice: true,
};

const paypalUpdateValues: PaypalUpdateValues = {
  paymentMethod: PaymentMethod.CREDIT,
  paypalCID: chance.word(),
  paypalPayerID: chance.word(),
  paypalToken: chance.word(),
  paypalStage: PaypalStage.FINAL_SUBMIT,
};

const paymentInfo: PaymentInfo = {
  paymentMethod: PaymentMethod.CREDIT,
  paymentDetails: {
    credit: {
      cardholderName: chance.word(),
      cardNumber: chance.word(),
      expiryMonth: chance.word(),
      expiryYear: chance.word(),
      cvn: chance.word(),
      ccDirty: true,
    },
    paypal: {
      CID: chance.word(),
      Token: chance.word(),
      PayerID: chance.word(),
      stage: PaypalStage.INITIAL,
    },
    giftCard: {
      cardholderName: chance.word(),
      cardNumber: chance.word(),
      expiryMonth: chance.word(),
      expiryYear: chance.word(),
      cvn: chance.word(),
      ccDirty: chance.pickone([true, false]),
    },
  },
  _validation: {
    paymentDetails: {
      credit: {
        cardholderName: ValidationState.IS_VALID,
        cardNumber: ValidationState.IS_VALID,
        expiryMonth: ValidationState.IS_VALID,
        expiryYear: ValidationState.IS_VALID,
        cvn: ValidationState.IS_VALID,
      },
      giftCard: {
        cardNumber: ValidationState.IS_VALID,
      },
    },
  },
};

describe("helpers/userUpdateHelper.test.ts", () => {

  it("should return proper paymentInfo object when paymentUpdateHelper.credit is called", () => {
    const expectedPaymentInfo = {
      paymentMethod: paymentInfo.paymentMethod,
      paymentDetails: {
        credit: {
          cardholderName: getConfigValue("fullName", paymentInfo.paymentDetails.credit.cardholderName, creditCardDetails),
          cardNumber: getConfigValue("number", paymentInfo.paymentDetails.credit.cardNumber, creditCardDetails),
          expiryYear: getConfigValue("expiryYear", paymentInfo.paymentDetails.credit.expiryYear, creditCardDetails),
          expiryMonth: getConfigValue("expiryMonth", paymentInfo.paymentDetails.credit.expiryMonth, creditCardDetails),
          cvn: getConfigValue("cvn", paymentInfo.paymentDetails.credit.cvn, creditCardDetails),
          ccDirty: getConfigValue("ccDirty", paymentInfo.paymentDetails.credit.ccDirty, creditCardDetails),
        },
        paypal: paymentInfo.paymentDetails.paypal,
        giftCard: paymentInfo.paymentDetails.giftCard,
      },
      _validation: {
        paymentDetails: {
          credit: {
            cardholderName: validateConfigValue("fullName", paymentInfo._validation.paymentDetails.credit.cardholderName, text => validate.requiredText(text), creditCardDetails),
            cardNumber: validateConfigValue("number", paymentInfo._validation.paymentDetails.credit.cardNumber, cardNumber => validate.creditCard(cardNumber), creditCardDetails),
            expiryYear: validateConfigValue("expiryYear", paymentInfo._validation.paymentDetails.credit.expiryYear, text => validate.requiredText(text), creditCardDetails),
            expiryMonth: validateConfigValue("expiryMonth", paymentInfo._validation.paymentDetails.credit.expiryMonth, text => validate.requiredText(text), creditCardDetails),
            cvn: validateConfigValue("cvn", paymentInfo._validation.paymentDetails.credit.cvn, text => validate.requiredText(text), creditCardDetails),
          },
          giftCard: paymentInfo._validation.paymentDetails.giftCard,
        },
      },
    };
    expect(paymentUpdateHelper.credit(creditCardDetails, paymentInfo)).toEqual(expectedPaymentInfo: PaymentInfo);
  });

  it("should return proper paymentInfo object when paymentUpdateHelper.giftCard is called", () => {
    const expectedPaymentInfo = {
      paymentMethod: paymentInfo.paymentMethod,
      paymentDetails: {
        credit: paymentInfo.paymentDetails.credit,
        paypal: paymentInfo.paymentDetails.paypal,
        giftCard: {
          cardNumber: getConfigValue("giftCardNumber", paymentInfo.paymentDetails.giftCard.cardNumber, giftCardDetails),
          cardBalance: getConfigValue("giftCardBalance", paymentInfo.paymentDetails.giftCard.cardBalance, giftCardDetails),
          cardAmount: getConfigValue("giftCardAmount", paymentInfo.paymentDetails.giftCard.cardAmount, giftCardDetails),
          isSpent: getConfigValue("isSpent", paymentInfo.paymentDetails.giftCard.isSpent, giftCardDetails),
          hasSenderEmail: getConfigValue("hasSenderEmail", paymentInfo.paymentDetails.giftCard.hasSenderEmail, giftCardDetails),
          recipientThankYou: getConfigValue("recipientThankYou", paymentInfo.paymentDetails.giftCard.recipientThankYou, giftCardDetails),
          notifySenderOfCharityChoice: getConfigValue("notifySenderOfCharityChoice", paymentInfo.paymentDetails.giftCard.notifySenderOfCharityChoice, giftCardDetails),
        },
      },
      _validation: {
        paymentDetails: {
          credit: paymentInfo._validation.paymentDetails.credit,
          giftCard: {
            cardNumber: validateConfigValue("giftCardNumber", paymentInfo._validation.paymentDetails.giftCard.cardNumber, cardNumber => validate.giftCard(cardNumber), giftCardDetails),
          },
        },
      },
    };
    expect(paymentUpdateHelper.giftCard(giftCardDetails, paymentInfo)).toEqual(expectedPaymentInfo: PaymentInfo);
  });

  it("should return proper paymentInfo object when paymentUpdateHelper.giftCardValidation is called", () => {
    const validation = ValidationState.IS_VALID;
    const expectedPaymentInfo: PaymentInfo = cloneDeep(paymentInfo);
    expectedPaymentInfo._validation.paymentDetails.giftCard.cardNumber = validation;

    expect(paymentUpdateHelper.giftCardValidation(validation, paymentInfo)).toEqual(expectedPaymentInfo);
  });

  it("should return proper paymentInfo object when paymentUpdateHelper.paypal is called", () => {
    const expectedPaymentInfo: PaymentInfo = {
      paymentMethod: getConfigValue("paymentMethod", paymentInfo.paymentMethod, paypalUpdateValues),
      paymentDetails: {
        giftCard: paymentInfo.paymentDetails.giftCard,
        credit: paymentInfo.paymentDetails.credit,
        paypal: {
          CID: getConfigValue("paypalCID",          paymentInfo.paymentDetails.paypal.CID, paypalUpdateValues),
          PayerID: getConfigValue("paypalPayerID",  paymentInfo.paymentDetails.paypal.PayerID, paypalUpdateValues),
          Token: getConfigValue("paypalToken",      paymentInfo.paymentDetails.paypal.Token, paypalUpdateValues),
          stage: getConfigValue("paypalStage",      paymentInfo.paymentDetails.paypal.stage, paypalUpdateValues),
        },
      },
      _validation: paymentInfo._validation,
    };

    expect(paymentUpdateHelper.paypal(paypalUpdateValues, paymentInfo)).toEqual(expectedPaymentInfo: PaymentInfo);
  });
});
