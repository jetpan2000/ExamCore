import * as Chance from "chance";
import {} from "jest";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { actionTypes } from "../../src/shared/actions/actionTypes";
import {
  updateDedication,
  updateDedicationSendType,
  updateECardInfo,
  updateHonoreeName,
} from "../../src/shared/actions/dedicationActions";
import {
  DedicationSendType, DedicationTypes,
} from "../../src/shared/constants/Dedications";
import { ECardInfo } from "../../src/shared/interfaces/DedicationInfo";
import {
  DedicationInfo,
  ValidationState,
} from "../../src/shared/interfaces/index";

const chance = new Chance();

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe("actions/dedication Action tests", () => {
  it("should create UPDATE_DEDICATION_SEND_OPTION", () => {
    const fakeSendType: DedicationSendType = chance.pickone([DedicationSendType.CHARITY_SEND_POSTCARD,
      DedicationSendType.NOTIFY_MYSELF,
      DedicationSendType.SEND_ECARD_MYSELF,
    ]);
    const expectedAction = { type: actionTypes.UPDATE_DEDICATION_SEND_OPTION, sendType: fakeSendType };

    const actualAction = updateDedicationSendType(fakeSendType);

    expect(actualAction).toEqual(expectedAction);
  });
  it("should create UPDATE_ECARD_INFO", () => {
    const fakeECardInfo: ECardInfo = {
      id: chance.natural(),
      lang: chance.word(),
      desc: chance.word(),
      recipient: {
        fullName: chance.word(),
        email: chance.word(),
      },
      sender: {
        fullName: chance.word(),
        email: chance.word(),
      },
      message: chance.word(),
    };
    const fakeECardValidation: ValidationState = chance.pickone([ValidationState.IS_VALID ,
      ValidationState.IS_EMPTY,
      ValidationState.IS_INVALID,
      ValidationState.IS_PRISTINE,
      ValidationState.SKIPPED,
    ]);
    const expectedAction = {
                             type: actionTypes.UPDATE_ECARD_INFO,
                             eCardInfo: fakeECardInfo,
                             eCardValidation: fakeECardValidation,
                           };

    const actualAction = updateECardInfo(fakeECardInfo, fakeECardValidation);

    expect(actualAction).toEqual(expectedAction);
  });
  it("should create UPDATE_DEDICATION", () => {
    const fakeDedicationInfo: DedicationInfo = {
      dedication: chance.pickone(
        [
          DedicationSendType.NOTIFY_MYSELF,
          DedicationSendType.SEND_ECARD_MYSELF,
          DedicationSendType.CHARITY_SEND_POSTCARD,
        ],
      ),
      dedicationSendType: chance.pickone(
        [
          DedicationSendType.CHARITY_SEND_POSTCARD,
          DedicationSendType.NOTIFY_MYSELF,
          DedicationSendType.SEND_ECARD_MYSELF,
        ]),
      honoreeName: chance.word(),
      eCardInfo: {
        id: chance.natural(),
        lang: chance.word(),
        desc: chance.word(),
        recipient: {
          fullName: chance.word(),
          email: chance.word(),
        },
        sender: {
          fullName: chance.word(),
          email: chance.word(),
        },
        message: chance.word(),
      },
      postCardInfo: {
        address: {
          lineOne: chance.word(),
          lineTwo: chance.word(),
          city: chance.word(),
          country: chance.word(),
          province: chance.word(),
          provinceOther: chance.word(),
          postalCode: chance.word(),
        },
        firstName: chance.word(),
        lastName: chance.word(),
        signature: chance.word(),
        message: chance.word(),
      },
      appVersion: chance.word(),
      persistExpire: chance.word(),
      _validation: {
        honoreeName: chance.pickone(
          [
            ValidationState.IS_VALID ,
            ValidationState.IS_EMPTY,
            ValidationState.IS_INVALID,
            ValidationState.IS_PRISTINE,
            ValidationState.SKIPPED,
        ]),
        eCardInfo: {
          id: chance.pickone(
          [
            ValidationState.IS_VALID ,
            ValidationState.IS_EMPTY,
            ValidationState.IS_INVALID,
            ValidationState.IS_PRISTINE,
            ValidationState.SKIPPED,
          ]),
          recipient: {
            fullName: chance.pickone(
            [
              ValidationState.IS_VALID ,
              ValidationState.IS_EMPTY,
              ValidationState.IS_INVALID,
              ValidationState.IS_PRISTINE,
              ValidationState.SKIPPED,
            ]),
            email: chance.pickone(
            [
              ValidationState.IS_VALID ,
              ValidationState.IS_EMPTY,
              ValidationState.IS_INVALID,
              ValidationState.IS_PRISTINE,
              ValidationState.SKIPPED,
            ]),
          },
          sender: {
            fullName: chance.pickone(
            [
              ValidationState.IS_VALID ,
              ValidationState.IS_EMPTY,
              ValidationState.IS_INVALID,
              ValidationState.IS_PRISTINE,
              ValidationState.SKIPPED,
            ]),
            email: chance.pickone(
            [
              ValidationState.IS_VALID ,
              ValidationState.IS_EMPTY,
              ValidationState.IS_INVALID,
              ValidationState.IS_PRISTINE,
              ValidationState.SKIPPED,
            ]),
          },
        },
        postCardInfo: {
          address: {
            lineOne: chance.pickone([ValidationState.IS_VALID , ValidationState.IS_EMPTY, ValidationState.IS_INVALID, ValidationState.IS_PRISTINE, ValidationState.SKIPPED]),
            city: chance.pickone([ValidationState.IS_VALID , ValidationState.IS_EMPTY, ValidationState.IS_INVALID, ValidationState.IS_PRISTINE, ValidationState.SKIPPED]),
            country: chance.pickone([ValidationState.IS_VALID , ValidationState.IS_EMPTY, ValidationState.IS_INVALID, ValidationState.IS_PRISTINE, ValidationState.SKIPPED]),
            province: chance.pickone([ValidationState.IS_VALID , ValidationState.IS_EMPTY, ValidationState.IS_INVALID, ValidationState.IS_PRISTINE, ValidationState.SKIPPED]),
            provinceOther: chance.pickone([ValidationState.IS_VALID , ValidationState.IS_EMPTY, ValidationState.IS_INVALID, ValidationState.IS_PRISTINE, ValidationState.SKIPPED]),
            postalCode: chance.pickone([ValidationState.IS_VALID , ValidationState.IS_EMPTY, ValidationState.IS_INVALID, ValidationState.IS_PRISTINE, ValidationState.SKIPPED]),
          },
          firstName: chance.pickone([ValidationState.IS_VALID , ValidationState.IS_EMPTY, ValidationState.IS_INVALID, ValidationState.IS_PRISTINE, ValidationState.SKIPPED]),
          lastName: chance.pickone([ValidationState.IS_VALID , ValidationState.IS_EMPTY, ValidationState.IS_INVALID, ValidationState.IS_PRISTINE, ValidationState.SKIPPED]),
        },
      },
    };
    const expectedAction = { type: actionTypes.UPDATE_DEDICATION, dedicationInfo: fakeDedicationInfo };
    const actualAction = updateDedication(fakeDedicationInfo);
    expect(actualAction).toEqual(expectedAction);
  });
  it("should create UPDATE_HONOREE_NAME", () => {
    const fakeName = chance.word();
    const fakeECardValidation: ValidationState = chance.pickone([
      ValidationState.IS_VALID,
      ValidationState.IS_EMPTY,
      ValidationState.IS_INVALID,
      ValidationState.IS_PRISTINE,
      ValidationState.SKIPPED,
    ]);
    const expectedAction = { type: actionTypes.UPDATE_HONOREE_NAME, name: fakeName, validation: fakeECardValidation };

    const actualAction = updateHonoreeName(fakeName, fakeECardValidation);

    expect(actualAction).toEqual(expectedAction);
  });
});
