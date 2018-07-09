import * as Chance from "chance";
import {} from "jest";
import { DonationFrequency, FrequencyType } from "../../../src/shared/constants/Donations";
import { getDonationSource } from "../../../src/shared/helpers/donationSourceHelper";
import { DonationInfo } from "../../../src/shared/interfaces/DonationInfo";
import { TerminationType } from "../../../src/shared/utils/api/CDN/PostDonation/models";
import { TerminationType } from "../../../src/shared/utils/api/CDN/PostDonation/models/index";
import { isEmbedded } from "../../../src/shared/utils/isEmbedded";
import { isMobile } from "../../../src/shared/utils/isMobile";
import { ValidationState } from "../../../src/shared/utils/validate";

let isEmbeddedValue = false;
jest.mock("../../../src/shared/utils/isEmbedded");
isEmbedded.mockImplementation(() => isEmbeddedValue);

let isMobileValue = false;
jest.mock("../../../src/shared/utils/isMobile");
isMobile.mockImplementation(() => isMobileValue);

const chance = new Chance();

const donationInfo: DonationInfo = {
  amount: chance.natural(),
  frequency: DonationFrequency.oneTime,
  frequencyType: FrequencyType,
  monthlyOptions: {
    terminationType: TerminationType,
    processImmediately: chance.pickone([true, false]),
    startDate: chance.date({string: true, american: false}),
    endDate: chance.date({string: true, american: false}),
    count: chance.natural(),
  },
  fund: chance.natural(),
  message: chance.word(),
  anonymous: true,
  canadaHelpsDonation: {
    amount: chance.natural(),
    addDonation: false,
  },
  appVersion: chance.word(),
  persistExpire: chance.word(),
  answerOne: chance.word(),
  _validation: {
    amount: ValidationState.IS_VALID,
    canadaHelpsDonation: {
      amount: ValidationState.IS_VALID,
    },
    monthlyOptions: {
      startDate: ValidationState.IS_VALID,
      endDate: ValidationState.IS_VALID,
      count: ValidationState.IS_VALID,
    },
  },
};

describe("helpers/donationSourceHelper.test.ts", () => {

  it("should return 'DONATE_NOW_CUSTOM_MULTISTEP' when getDonationSource is called and multi step parameter is set to true ", () => {
    expect(getDonationSource(donationInfo, true)).toEqual("DONATE_NOW_CUSTOM_MULTISTEP");
  });

  it("should return 'DONATE_NOW_CUSTOM' when getDonationSource is called and multi step parameter is set to false ", () => {
    isEmbeddedValue = true;
    expect(getDonationSource(donationInfo, false)).toEqual("DONATE_NOW_CUSTOM_EMBEDED");
  });

  it("should return 'DONATE_NOW_CUSTOM_SCHEDULED_GIVING' when getDonationSource is called and multi step parameter is set to false ", () => {
    isEmbeddedValue = false;
    donationInfo.frequency = DonationFrequency.monthly;
    expect(getDonationSource(donationInfo, false)).toEqual("DONATE_NOW_CUSTOM_SCHEDULED_GIVING");
  });

  it("should return 'DONATE_NOW_CUSTOM_SUGGESTED_CHO_DONATION' when getDonationSource is called and multi step parameter is set to false ", () => {
    donationInfo.frequency = DonationFrequency.oneTime;
    donationInfo.canadaHelpsDonation.addDonation = true;
    expect(getDonationSource(donationInfo, false)).toEqual("DONATE_NOW_CUSTOM_SUGGESTED_CHO_DONATION");
  });

  it("should return 'DONATE_NOW_CUSTOM_SUGGESTED_CHO_DONATION' when getDonationSource is called and multi step parameter is set to false ", () => {
    donationInfo.canadaHelpsDonation.addDonation = false;
    isMobileValue = true;
    expect(getDonationSource(donationInfo, false)).toEqual("DONATE_NOW_CUSTOM_MOBILE");
  });
});