import * as Chance from "chance";
import {} from "jest";
import { cloneDeep } from "lodash";
import dedicationUpdateHelper from "../../../src/shared/helpers/dedicationUpdateHelper";
import { ECardUpdateValues, PostCardUpdateValues } from "../helpers/dedicationUpdateHelper";
import { ValidationState } from "../../../src/shared/utils/validate";
import { DedicationSendType, DedicationTypes } from "../../../src/shared/constants/Dedications";
import { DedicationInfo } from "../../../src/shared/interfaces";

const chance = new Chance();
const postCardUpdateValues: PostCardUpdateValues = {
  firstName: chance.word(),
  lastName: chance.word(),
  lineOne: chance.word(),
  lineTwo: chance.word(),
  city: chance.word(),
  province: chance.word(),
  provinceOther: chance.word(),
  country: chance.word(),
  postalCode: chance.word(),
  signature: chance.word(),
  message: chance.word(),
};
const eCardValues: ECardUpdateValues = {
  id: chance.natural(),
  lang: chance.word(),
  desc: chance.word(),
  senderName: chance.word(),
  senderEmail: chance.email(),
  recpName: chance.word(),
  recpEmail: chance.email(),
  message: chance.word(),
};
const dedicationInfo: DedicationInfo = {
  dedication: DedicationTypes.NO_DEDICATION,
  dedicationSendType: DedicationSendType.CHARITY_SEND_POSTCARD,
  honoreeName: chance.word(),
  eCardInfo: {
    id: chance.natural(),
    lang: chance.pickone(["en", "fr"]),
    desc: chance.word(),
    recipient: {
      fullName: chance.word(),
      email: chance.email(),
    },
    sender: {
      fullName: chance.word(),
      email: chance.email(),
    },
    message: chance.word(),
  },
  postCardInfo: {
    address: {
      lineOne: chance.word(),
      lineTwo: chance.word(),
      city: chance.word(),
      country: "CA",
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
    honoreeName: ValidationState.IS_VALID,
    eCardInfo: {
      id: ValidationState.IS_VALID,
      recipient: {
        fullName: ValidationState.IS_VALID,
        email: ValidationState.IS_VALID,
      },
      sender: {
        fullName: ValidationState.IS_VALID,
        email: ValidationState.IS_VALID,
      },
    },
    postCardInfo: {
      address: {
        lineOne: ValidationState.IS_VALID,
        city: ValidationState.IS_VALID,
        country: ValidationState.IS_VALID,
        province: ValidationState.IS_VALID,
        provinceOther: ValidationState.IS_VALID,
        postalCode: ValidationState.IS_VALID,
      },
      firstName: ValidationState.IS_VALID,
      lastName: ValidationState.IS_VALID,
    },
  },
};

describe("helpers/dedicationUpdateHelper.test.ts", () => {

    it("should return proper new state when dedicationUpdateHelper.mailingAddress is called", () => {
      const expectedState = cloneDeep(dedicationInfo);
      expectedState.postCardInfo.address.city = postCardUpdateValues.city;
      expectedState.postCardInfo.address.country = postCardUpdateValues.country;
      expectedState.postCardInfo.address.lineOne = postCardUpdateValues.lineOne;
      expectedState.postCardInfo.address.lineTwo = postCardUpdateValues.lineTwo;
      expectedState.postCardInfo.address.postalCode = postCardUpdateValues.postalCode;
      expectedState.postCardInfo.address.province = postCardUpdateValues.province;
      expectedState.postCardInfo.address.provinceOther = postCardUpdateValues.provinceOther;
      expectedState.postCardInfo.firstName = postCardUpdateValues.firstName;
      expectedState.postCardInfo.lastName = postCardUpdateValues.lastName;
      expectedState.postCardInfo.message = postCardUpdateValues.message;
      expectedState.postCardInfo.signature = postCardUpdateValues.signature;

      expect(dedicationUpdateHelper.mailingAddress(postCardUpdateValues, dedicationInfo)).toEqual(expectedState: DedicationInfo);
    });

    it("should return proper new state when dedicationUpdateHelper.eCard is called", () => {
      const expectedState = cloneDeep(dedicationInfo);
      expectedState.eCardInfo.id = eCardValues.id;
      expectedState.eCardInfo.lang = eCardValues.lang;
      expectedState.eCardInfo.desc = eCardValues.desc;
      expectedState.eCardInfo.sender.fullName = eCardValues.senderName;
      expectedState.eCardInfo.sender.email = eCardValues.senderEmail;
      expectedState.eCardInfo.recipient.fullName = eCardValues.recpName;
      expectedState.eCardInfo.recipient.email = eCardValues.recpEmail;
      expectedState.eCardInfo.message = eCardValues.message;

      expect(dedicationUpdateHelper.eCard(eCardValues, dedicationInfo)).toEqual(expectedState: DedicationInfo);
    });
});