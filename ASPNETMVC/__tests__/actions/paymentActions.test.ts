import * as Chance from "chance";
import {} from "jest";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { actionTypes } from "../../src/shared/actions/actionTypes";
import { updateCreditCardDetails, updatePaymentMethod, updateGiftCardDetails, updatePaypalDetails } from "../../src/shared/actions/paymentActions";
import { PaymentMethod } from "../../src/shared/constants/Payment";
import { PaymentInfo, PaypalStage, ValidationState } from "../../src/shared/interfaces";
const chance = new Chance();

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe("actions/payment Action tests", () => {
  let fakePaymentInfo: PaymentInfo;
  beforeEach(() => {
    fakePaymentInfo = {
      paymentMethod: chance.pickone([ PaymentMethod.CREDIT, PaymentMethod.PAYPAL, PaymentMethod.GIFTCARD]),
      paymentDetails: {
        credit: {
          cardholderName: chance.word(),
          cardNumber: chance.word(),
          expiryMonth: chance.word(),
          expiryYear: chance.word(),
          cvn: chance.word(),
          ccDirty: chance.bool(),
        },
        paypal: {
          CID: chance.word(),
          Token: chance.word(),
          PayerID: chance.word(),
          stage: chance.pickone([ PaypalStage.INITIAL , PaypalStage.REDIRECT , PaypalStage.FINAL_SUBMIT]),
        },
        giftCard: {
          cardNumber: chance.word(),
          cardBalance: chance.natural(),
          cardAmount: chance.natural(),
          isSpent: chance.bool(),
          hasSenderEmail: chance.bool(),
          recipientThankYou: chance.word(),
          notifySenderOfCharityChoice: chance.bool(),
        },
      },
      _validation: {
        paymentDetails: {
          credit: {
            cardholderName: chance.pickone([
              ValidationState.IS_VALID ,
              ValidationState.IS_EMPTY,
              ValidationState.IS_INVALID,
              ValidationState.IS_PRISTINE,
              ValidationState.SKIPPED,
            ]),
            cardNumber: chance.pickone([
              ValidationState.IS_VALID ,
              ValidationState.IS_EMPTY,
              ValidationState.IS_INVALID,
              ValidationState.IS_PRISTINE,
              ValidationState.SKIPPED,
            ]),
            expiryMonth: chance.pickone([
              ValidationState.IS_VALID ,
              ValidationState.IS_EMPTY,
              ValidationState.IS_INVALID,
              ValidationState.IS_PRISTINE,
              ValidationState.SKIPPED,
            ]),
            expiryYear: chance.pickone([
              ValidationState.IS_VALID ,
              ValidationState.IS_EMPTY,
              ValidationState.IS_INVALID,
              ValidationState.IS_PRISTINE,
              ValidationState.SKIPPED,
            ]),
            cvn: chance.pickone([
              ValidationState.IS_VALID ,
              ValidationState.IS_EMPTY,
              ValidationState.IS_INVALID,
              ValidationState.IS_PRISTINE,
              ValidationState.SKIPPED,
            ]),
          },
          giftCard: {
            cardNumber: chance.pickone([
              ValidationState.IS_VALID ,
              ValidationState.IS_EMPTY,
              ValidationState.IS_INVALID,
              ValidationState.IS_PRISTINE,
              ValidationState.SKIPPED,
            ]),
          },
        },
      },
    };
  });

  it("should create UPDATE_CREDIT_DETAILS", () => {
    const expectedAction = { type: actionTypes.UPDATE_CREDIT_DETAILS, paymentInfo: fakePaymentInfo };

    const actualAction = updateCreditCardDetails(fakePaymentInfo);

    expect(actualAction).toEqual(expectedAction);
  });

  it("should create UPDATE_PAYMENT_METHOD", () => {
    const fakePaymentMethod: PaymentMethod = chance.pickone([PaymentMethod.CREDIT, PaymentMethod.PAYPAL, PaymentMethod.GIFTCARD]);
    const expectedAction = { type: actionTypes.UPDATE_PAYMENT_METHOD, paymentMethod: fakePaymentMethod };

    const actualAction = updatePaymentMethod(fakePaymentMethod);

    expect(actualAction).toEqual(expectedAction);
  });

  it("should create UPDATE_GIFTCARD_DETAILS", () => {
    const expectedAction = { type: actionTypes.UPDATE_GIFTCARD_DETAILS, paymentInfo: fakePaymentInfo };

    const actualAction = updateGiftCardDetails(fakePaymentInfo);

    expect(actualAction).toEqual(expectedAction);
  });

  it("should create UPDATE_PAYPAL_DETAILS", () => {
    const expectedAction = { type: actionTypes.UPDATE_PAYPAL_DETAILS, paymentInfo: fakePaymentInfo };

    const actualAction = updatePaypalDetails(fakePaymentInfo);

    expect(actualAction).toEqual(expectedAction);
  });
});
