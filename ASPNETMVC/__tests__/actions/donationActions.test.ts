import * as Chance from "chance";
import {} from "jest";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { actionTypes } from "../../src/shared/actions/actionTypes";
import {
  toggleAnonymity,
  updateAnswerOne,
  updateCanadaHelpsDonation,
  updateDonation,
  updateDonationAmount,
  updateDonationFrequency,
  updateDonationFund,
  updateDonationMessage,
  updateFrequencyType,
  validateDonationFailed,
} from "../../src/shared/actions/donationActions";
import {
  DonationFrequency,
  FrequencyType,
} from "../../src/shared/constants/Donations";
import { CHDonation, DonationInfo, ValidationState } from "../../src/shared/interfaces/index";
import { TerminationType } from "../../src/shared/utils/api/CDN/PostDonation/models/index";

const chance = new Chance();

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe("actions/dedication Action tests", () => {
  let fakeDonationInfo: DonationInfo;
  beforeEach(() => {
    fakeDonationInfo = {
      amount: chance.natural(),
      frequency: chance.pickone([DonationFrequency.oneTime, DonationFrequency.monthly]),
      frequencyType: chance.pickone([
        FrequencyType.ONE_TIME_ONLY,
        FrequencyType.MONTHLY_ONLY,
        FrequencyType.BOTH,
      ]),
      monthlyOptions: {
        terminationType: chance.pickone([TerminationType.COUNT, TerminationType.END_DATE, TerminationType.NONE]),
        processImmediately: chance.bool(),
        startDate: chance.word(),
        endDate: chance.word(),
        count: chance.natural(),
      },
      fund: chance.natural(),
      message: chance.word(),
      anonymous: chance.bool(),
      canadaHelpsDonation: {
        amount: chance.natural(),
        addDonation: chance.bool(),
      },
      appVersion: chance.word(),
      persistExpire: chance.word(),
      answerOne: chance.word(),
      _validation: {
        amount: chance.pickone(
        [
          ValidationState.IS_VALID ,
          ValidationState.IS_EMPTY,
          ValidationState.IS_INVALID,
          ValidationState.IS_PRISTINE,
          ValidationState.SKIPPED,
        ]),
        canadaHelpsDonation: {
        amount: chance.pickone(
        [
          ValidationState.IS_VALID ,
          ValidationState.IS_EMPTY,
          ValidationState.IS_INVALID,
          ValidationState.IS_PRISTINE,
          ValidationState.SKIPPED,
        ]),
      },
      monthlyOptions: {
        startDate: chance.pickone(
        [
          ValidationState.IS_VALID ,
          ValidationState.IS_EMPTY,
          ValidationState.IS_INVALID,
          ValidationState.IS_PRISTINE,
          ValidationState.SKIPPED,
        ]),
        endDate: chance.pickone(
        [
          ValidationState.IS_VALID ,
          ValidationState.IS_EMPTY,
          ValidationState.IS_INVALID,
          ValidationState.IS_PRISTINE,
          ValidationState.SKIPPED,
        ]),
        count: chance.pickone(
        [
          ValidationState.IS_VALID ,
          ValidationState.IS_EMPTY,
          ValidationState.IS_INVALID,
          ValidationState.IS_PRISTINE,
          ValidationState.SKIPPED,
        ]),
      },
    },
  };
  });
  it("should create UPDATE_DONATION_FREQUENCY", () => {
    const fakeFrequency: DonationFrequency = chance.pickone([DonationFrequency.oneTime, DonationFrequency.monthly]);
    const expectedAction = { type: actionTypes.UPDATE_DONATION_FREQUENCY, frequency: fakeFrequency };
    const actualAction = updateDonationFrequency(fakeFrequency);

    expect(actualAction).toEqual(expectedAction);
  });

  it("should create UPDATE_DONATION_FREQUENCY_TYPE", () => {
    const fakeFrequency: DonationFrequency = chance.pickone([
      DonationFrequency.oneTime,
      DonationFrequency.monthly,
    ]);
    const fakeFrequencyType: FrequencyType = chance.pickone([
      FrequencyType.ONE_TIME_ONLY,
      FrequencyType.MONTHLY_ONLY,
      FrequencyType.BOTH,
    ]);
    const expectedAction = {
      type: actionTypes.UPDATE_DONATION_FREQUENCY_TYPE,
      frequency: fakeFrequency,
      frequencyType: fakeFrequencyType,
     };
    const actualAction = updateFrequencyType(fakeFrequency, fakeFrequencyType);

    expect(actualAction).toEqual(expectedAction);
  });

  it("should create UPDATE_DONATION", () => {
    const expectedAction = { type: actionTypes.UPDATE_DONATION, donationInfo: fakeDonationInfo };
    const actualAction = updateDonation(fakeDonationInfo);

    expect(actualAction).toEqual(expectedAction);
  });

  it("should create UPDATE_DONATION_AMOUNT", () => {
    const fakeAmount: number = chance.natural();
    const fakeValidity: ValidationState = chance.pickone([ValidationState.IS_VALID, ValidationState.IS_EMPTY, ValidationState.IS_INVALID, ValidationState.IS_PRISTINE, ValidationState.SKIPPED]);
    const expectedAction = { type: actionTypes.UPDATE_DONATION_AMOUNT, amount: fakeAmount, validity: fakeValidity };
    const actualAction = updateDonationAmount(fakeAmount, fakeValidity);

    expect(actualAction).toEqual(expectedAction);
  });

  it("should create UPDATE_ANSWER_ONE", () => {
    const fakeAnswerOne: string = chance.word();
    const expectedAction = { type: actionTypes.UPDATE_ANSWER_ONE, answerOne: fakeAnswerOne };
    const actualAction = updateAnswerOne(fakeAnswerOne);
  });

  it("should create UPDATE_DONATION_FUND", () => {
    const fakeFundID: number = chance.natural();
    const expectedAction = { type: actionTypes.UPDATE_DONATION_FUND, fundID: fakeFundID };
    const actualAction = updateDonationFund(fakeFundID);
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create UPDATE_DONATION_MESSAGE", () => {
     const fakeMessage: string = chance.word();
     const expectedAction = { type: actionTypes.UPDATE_DONATION_MESSAGE, message: fakeMessage };
     const actualAction = updateDonationMessage(fakeMessage);
     expect(actualAction).toEqual(expectedAction);
  });

  it("should create TOGGLE_ANONYMITY", () => {
     const expectedAction = { type: actionTypes.TOGGLE_ANONYMITY};
     const actualAction = toggleAnonymity();
     expect(actualAction).toEqual(expectedAction);
  });

  it("should create UPDATE_CH_DONATION", () => {
    const fakeDonation: CHDonation = { amount: chance.natural(), addDonation: chance.bool() };
    const fakeValidity: ValidationState = chance.pickone([
      ValidationState.IS_VALID,
      ValidationState.IS_EMPTY,
      ValidationState.IS_INVALID,
      ValidationState.IS_PRISTINE,
      ValidationState.SKIPPED,
    ]);
    const expectedAction = { type: actionTypes.UPDATE_CH_DONATION, donation: fakeDonation, validity: fakeValidity };
    const actualAction = updateCanadaHelpsDonation(fakeDonation, fakeValidity);
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create VALIDATE_DONATION_INFO_FAILED", () => {
     const expectedAction = { type: actionTypes.VALIDATE_DONATION_INFO_FAILED };
     const actualAction = validateDonationFailed();
     expect(actualAction).toEqual(expectedAction);
  });
});