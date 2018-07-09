import * as Chance from "chance";
import {} from "jest";
import * as moment from "moment";
import { dateFormat } from "../../../src/shared/constants/DateFormat";
import { DonationFrequency, FrequencyType } from "../../../src/shared/constants/Donations";
import { DonationInfoUpdateValues, donationUpdateHelper, isStartDateToday } from "../../../src/shared/helpers/donationUpdateHelper";
import { DonationInfo } from "../../../src/shared/interfaces";
import { getConfigValue, validateConfigValue } from "../../../src/shared/utils";
import { TerminationType } from "../../../src/shared/utils/api/CDN/PostDonation/models";
import { ValidationState } from "../../../src/shared/utils/validate";
import { validate } from "../../../src/shared/utils/validate";

const chance = new Chance();
const anonimous = chance.pickone([true, false]);
const currentYear = (new Date()).getFullYear();
const donationInfoUpdateValues: DonationInfoUpdateValues = {
  amount: chance.natural(),
  frequency: DonationFrequency.oneTime,
  fund: chance.natural(),
  message: chance.word(),
  anonymous: true,
  chAmount: chance.natural(),
  chAddDonation: chance.natural(),
  terminationType: TerminationType.COUNT,
  startDate: chance.word(),
  count: chance.natural(),
  answerOne: chance.word(),
};

const donationInfo: DonationInfo = {
  amount: chance.natural(),
  frequency: DonationFrequency.oneTime,
  frequencyType: FrequencyType.BOTH,
  monthlyOptions: {
    terminationType: TerminationType.NONE,
    processImmediately: chance.pickone([true, false]),
    startDate: chance.date({string: true, american: false, year: currentYear + 1}) as string,
    endDate: chance.date({string: true, american: false, year: currentYear + 2}) as string,
    count: chance.natural(),
  },
  fund: chance.natural(),
  message: chance.word(),
  anonymous: anonimous,
  canadaHelpsDonation: {
    amount: chance.natural(),
    addDonation: true,
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

describe("helpers/donationUpdateHelper.test.ts", () => {

  describe("its donationUpdateHelper", () => {

    it("should return proper donation info object if termination type is not equal to donationInfo.monthlyOptions.terminationType and endDate isn't provided", () => {
      const vMonthlyOptions = {
        count: ValidationState.IS_VALID,
        endDate: ValidationState.SKIPPED,
        startDate: ValidationState.IS_INVALID,
      };
      const expectedDonationInfo = {
        amount: getConfigValue("amount", donationInfo.amount, donationInfoUpdateValues),
        frequency: getConfigValue("frequency", donationInfo.frequency, donationInfoUpdateValues),
        frequencyType: donationInfo.frequencyType,
        monthlyOptions: {
          terminationType: getConfigValue("terminationType", donationInfo.monthlyOptions.terminationType, donationInfoUpdateValues),
          processImmediately: isStartDateToday(donationInfoUpdateValues, dateFormat, donationInfo.monthlyOptions.processImmediately),
          startDate: getConfigValue("startDate", donationInfo.monthlyOptions.startDate, donationInfoUpdateValues),
          endDate: getConfigValue("endDate", donationInfo.monthlyOptions.endDate, donationInfoUpdateValues),
          count: getConfigValue("count", donationInfo.monthlyOptions.count, donationInfoUpdateValues),
        },
        fund: getConfigValue("fund", donationInfo.fund, donationInfoUpdateValues),
        message: getConfigValue("message", donationInfo.message, donationInfoUpdateValues),
        anonymous: getConfigValue("anonymous", donationInfo.anonymous, donationInfoUpdateValues),
        canadaHelpsDonation: {
          amount: getConfigValue("chAmount", donationInfo.canadaHelpsDonation.amount, donationInfoUpdateValues),
          addDonation: getConfigValue("chAddDonation", donationInfo.canadaHelpsDonation.addDonation, donationInfoUpdateValues),
        },
        appVersion: donationInfo.appVersion,
        persistExpire: donationInfo.persistExpire,
        answerOne: getConfigValue("answerOne", donationInfo.answerOne, donationInfoUpdateValues),
        _validation: {
          amount: validateConfigValue("amount", donationInfo._validation.amount, validate.donation, donationInfoUpdateValues),
          canadaHelpsDonation: {
            amount: validateConfigValue("chAmount", donationInfo._validation.canadaHelpsDonation.amount, validate.donation, donationInfoUpdateValues),
          },
          monthlyOptions: vMonthlyOptions,
        },
      };
      expect(donationUpdateHelper(donationInfoUpdateValues, donationInfo)).toEqual(expectedDonationInfo as DonationInfo);
    });

    it("should return proper donation info object if termination type is not equal to donationInfo.monthlyOptions.terminationType and endDate and startDate exist", () => {
      const vMonthlyOptions = {
        count: ValidationState.IS_VALID,
        endDate: ValidationState.SKIPPED,
        startDate: ValidationState.IS_INVALID,
      };
      donationInfoUpdateValues.endDate = chance.date({string: true, american: false}) as string;
      const expectedDonationInfo = {
        amount: getConfigValue("amount", donationInfo.amount, donationInfoUpdateValues),
        frequency: getConfigValue("frequency", donationInfo.frequency, donationInfoUpdateValues),
        frequencyType: donationInfo.frequencyType,
        monthlyOptions: {
          terminationType: getConfigValue("terminationType", donationInfo.monthlyOptions.terminationType, donationInfoUpdateValues),
          processImmediately: isStartDateToday(donationInfoUpdateValues, dateFormat, donationInfo.monthlyOptions.processImmediately),
          startDate: getConfigValue("startDate", donationInfo.monthlyOptions.startDate, donationInfoUpdateValues),
          endDate: getConfigValue("endDate", donationInfo.monthlyOptions.endDate, donationInfoUpdateValues),
          count: getConfigValue("count", donationInfo.monthlyOptions.count, donationInfoUpdateValues),
        },
        fund: getConfigValue("fund", donationInfo.fund, donationInfoUpdateValues),
        message: getConfigValue("message", donationInfo.message, donationInfoUpdateValues),
        anonymous: getConfigValue("anonymous", donationInfo.anonymous, donationInfoUpdateValues),
        canadaHelpsDonation: {
          amount: getConfigValue("chAmount", donationInfo.canadaHelpsDonation.amount, donationInfoUpdateValues),
          addDonation: getConfigValue("chAddDonation", donationInfo.canadaHelpsDonation.addDonation, donationInfoUpdateValues),
        },
        appVersion: donationInfo.appVersion,
        persistExpire: donationInfo.persistExpire,
        answerOne: getConfigValue("answerOne", donationInfo.answerOne, donationInfoUpdateValues),
        _validation: {
          amount: validateConfigValue("amount", donationInfo._validation.amount, validate.donation, donationInfoUpdateValues),
          canadaHelpsDonation: {
            amount: validateConfigValue("chAmount", donationInfo._validation.canadaHelpsDonation.amount, validate.donation, donationInfoUpdateValues),
          },
          monthlyOptions: vMonthlyOptions,
        },
      };
      expect(donationUpdateHelper(donationInfoUpdateValues, donationInfo)).toEqual(expectedDonationInfo as DonationInfo);
    });

    it("should return proper donation info object if termination type is not equal to donationInfo.monthlyOptions.terminationType and endDate exists and no startDate exists", () => {
      const vMonthlyOptions = {
        count: ValidationState.IS_VALID,
        endDate: ValidationState.SKIPPED,
        startDate: ValidationState.SKIPPED,
      };
      delete donationInfoUpdateValues.startDate;
      donationInfoUpdateValues.endDate = chance.date({string: true, american: false}) as string;
      const expectedDonationInfo = {
        amount: getConfigValue("amount", donationInfo.amount, donationInfoUpdateValues),
        frequency: getConfigValue("frequency", donationInfo.frequency, donationInfoUpdateValues),
        frequencyType: donationInfo.frequencyType,
        monthlyOptions: {
          terminationType: getConfigValue("terminationType", donationInfo.monthlyOptions.terminationType, donationInfoUpdateValues),
          processImmediately: isStartDateToday(donationInfoUpdateValues, dateFormat, donationInfo.monthlyOptions.processImmediately),
          startDate: getConfigValue("startDate", donationInfo.monthlyOptions.startDate, donationInfoUpdateValues),
          endDate: getConfigValue("endDate", donationInfo.monthlyOptions.endDate, donationInfoUpdateValues),
          count: getConfigValue("count", donationInfo.monthlyOptions.count, donationInfoUpdateValues),
        },
        fund: getConfigValue("fund", donationInfo.fund, donationInfoUpdateValues),
        message: getConfigValue("message", donationInfo.message, donationInfoUpdateValues),
        anonymous: getConfigValue("anonymous", donationInfo.anonymous, donationInfoUpdateValues),
        canadaHelpsDonation: {
          amount: getConfigValue("chAmount", donationInfo.canadaHelpsDonation.amount, donationInfoUpdateValues),
          addDonation: getConfigValue("chAddDonation", donationInfo.canadaHelpsDonation.addDonation, donationInfoUpdateValues),
        },
        appVersion: donationInfo.appVersion,
        persistExpire: donationInfo.persistExpire,
        answerOne: getConfigValue("answerOne", donationInfo.answerOne, donationInfoUpdateValues),
        _validation: {
          amount: validateConfigValue("amount", donationInfo._validation.amount, validate.donation, donationInfoUpdateValues),
          canadaHelpsDonation: {
            amount: validateConfigValue("chAmount", donationInfo._validation.canadaHelpsDonation.amount, validate.donation, donationInfoUpdateValues),
          },
          monthlyOptions: vMonthlyOptions,
        },
      };
      expect(donationUpdateHelper(donationInfoUpdateValues, donationInfo)).toEqual(expectedDonationInfo as DonationInfo);
    });

    it("should return proper donation info object if termination type is not equal to donationInfo.monthlyOptions.terminationType and no endDate and no startDate exist", () => {
      const vMonthlyOptions = {
        count: ValidationState.IS_VALID,
        endDate: ValidationState.SKIPPED,
        startDate: ValidationState.SKIPPED,
      };
      delete donationInfoUpdateValues.endDate;
      const expectedDonationInfo = {
        amount: getConfigValue("amount", donationInfo.amount, donationInfoUpdateValues),
        frequency: getConfigValue("frequency", donationInfo.frequency, donationInfoUpdateValues),
        frequencyType: donationInfo.frequencyType,
        monthlyOptions: {
          terminationType: getConfigValue("terminationType", donationInfo.monthlyOptions.terminationType, donationInfoUpdateValues),
          processImmediately: isStartDateToday(donationInfoUpdateValues, dateFormat, donationInfo.monthlyOptions.processImmediately),
          startDate: getConfigValue("startDate", donationInfo.monthlyOptions.startDate, donationInfoUpdateValues),
          endDate: getConfigValue("endDate", donationInfo.monthlyOptions.endDate, donationInfoUpdateValues),
          count: getConfigValue("count", donationInfo.monthlyOptions.count, donationInfoUpdateValues),
        },
        fund: getConfigValue("fund", donationInfo.fund, donationInfoUpdateValues),
        message: getConfigValue("message", donationInfo.message, donationInfoUpdateValues),
        anonymous: getConfigValue("anonymous", donationInfo.anonymous, donationInfoUpdateValues),
        canadaHelpsDonation: {
          amount: getConfigValue("chAmount", donationInfo.canadaHelpsDonation.amount, donationInfoUpdateValues),
          addDonation: getConfigValue("chAddDonation", donationInfo.canadaHelpsDonation.addDonation, donationInfoUpdateValues),
        },
        appVersion: donationInfo.appVersion,
        persistExpire: donationInfo.persistExpire,
        answerOne: getConfigValue("answerOne", donationInfo.answerOne, donationInfoUpdateValues),
        _validation: {
          amount: validateConfigValue("amount", donationInfo._validation.amount, validate.donation, donationInfoUpdateValues),
          canadaHelpsDonation: {
            amount: validateConfigValue("chAmount", donationInfo._validation.canadaHelpsDonation.amount, validate.donation, donationInfoUpdateValues),
          },
          monthlyOptions: vMonthlyOptions,
        },
      };
      expect(donationUpdateHelper(donationInfoUpdateValues, donationInfo)).toEqual(expectedDonationInfo as DonationInfo);
    });

    it("should return proper donation info object if donation frequency is equal to monthly", () => {
      const vMonthlyOptions = {
        count: ValidationState.IS_VALID,
        endDate: ValidationState.SKIPPED,
        startDate: ValidationState.IS_VALID,
      };
      donationInfoUpdateValues.endDate = chance.date({string: true, american: false}) as string;
      donationInfoUpdateValues.frequency = DonationFrequency.monthly;
      const expectedDonationInfo = {
        amount: getConfigValue("amount", donationInfo.amount, donationInfoUpdateValues),
        frequency: getConfigValue("frequency", donationInfo.frequency, donationInfoUpdateValues),
        frequencyType: donationInfo.frequencyType,
        monthlyOptions: {
          terminationType: getConfigValue("terminationType", donationInfo.monthlyOptions.terminationType, donationInfoUpdateValues),
          processImmediately: isStartDateToday(donationInfoUpdateValues, dateFormat, donationInfo.monthlyOptions.processImmediately),
          startDate: getConfigValue("startDate", donationInfo.monthlyOptions.startDate, donationInfoUpdateValues),
          endDate: getConfigValue("endDate", donationInfo.monthlyOptions.endDate, donationInfoUpdateValues),
          count: getConfigValue("count", donationInfo.monthlyOptions.count, donationInfoUpdateValues),
        },
        fund: getConfigValue("fund", donationInfo.fund, donationInfoUpdateValues),
        message: getConfigValue("message", donationInfo.message, donationInfoUpdateValues),
        anonymous: getConfigValue("anonymous", donationInfo.anonymous, donationInfoUpdateValues),
        canadaHelpsDonation: {
          amount: getConfigValue("chAmount", donationInfo.canadaHelpsDonation.amount, donationInfoUpdateValues),
          addDonation: getConfigValue("chAddDonation", donationInfo.canadaHelpsDonation.addDonation, donationInfoUpdateValues),
        },
        appVersion: donationInfo.appVersion,
        persistExpire: donationInfo.persistExpire,
        answerOne: getConfigValue("answerOne", donationInfo.answerOne, donationInfoUpdateValues),
        _validation: {
          amount: validateConfigValue("amount", donationInfo._validation.amount, validate.donation, donationInfoUpdateValues),
          canadaHelpsDonation: {
            amount: validateConfigValue("chAmount", donationInfo._validation.canadaHelpsDonation.amount, validate.donation, donationInfoUpdateValues),
          },
          monthlyOptions: vMonthlyOptions,
        },
      };
      expect(donationUpdateHelper(donationInfoUpdateValues, donationInfo)).toEqual(expectedDonationInfo as DonationInfo);
    });

    it("should return proper donation info object if donation termination is set to NONE", () => {
      const vMonthlyOptions = {
        count: ValidationState.SKIPPED,
        endDate: ValidationState.SKIPPED,
        startDate: ValidationState.IS_VALID,
      };
      donationInfoUpdateValues.terminationType = TerminationType.NONE;
      const expectedDonationInfo = {
        amount: getConfigValue("amount", donationInfo.amount, donationInfoUpdateValues),
        frequency: getConfigValue("frequency", donationInfo.frequency, donationInfoUpdateValues),
        frequencyType: donationInfo.frequencyType,
        monthlyOptions: {
          terminationType: getConfigValue("terminationType", donationInfo.monthlyOptions.terminationType, donationInfoUpdateValues),
          processImmediately: isStartDateToday(donationInfoUpdateValues, dateFormat, donationInfo.monthlyOptions.processImmediately),
          startDate: getConfigValue("startDate", donationInfo.monthlyOptions.startDate, donationInfoUpdateValues),
          endDate: getConfigValue("endDate", donationInfo.monthlyOptions.endDate, donationInfoUpdateValues),
          count: getConfigValue("count", donationInfo.monthlyOptions.count, donationInfoUpdateValues),
        },
        fund: getConfigValue("fund", donationInfo.fund, donationInfoUpdateValues),
        message: getConfigValue("message", donationInfo.message, donationInfoUpdateValues),
        anonymous: getConfigValue("anonymous", donationInfo.anonymous, donationInfoUpdateValues),
        canadaHelpsDonation: {
          amount: getConfigValue("chAmount", donationInfo.canadaHelpsDonation.amount, donationInfoUpdateValues),
          addDonation: getConfigValue("chAddDonation", donationInfo.canadaHelpsDonation.addDonation, donationInfoUpdateValues),
        },
        appVersion: donationInfo.appVersion,
        persistExpire: donationInfo.persistExpire,
        answerOne: getConfigValue("answerOne", donationInfo.answerOne, donationInfoUpdateValues),
        _validation: {
          amount: validateConfigValue("amount", donationInfo._validation.amount, validate.donation, donationInfoUpdateValues),
          canadaHelpsDonation: {
            amount: validateConfigValue("chAmount", donationInfo._validation.canadaHelpsDonation.amount, validate.donation, donationInfoUpdateValues),
          },
          monthlyOptions: vMonthlyOptions,
        },
      };
      expect(donationUpdateHelper(donationInfoUpdateValues, donationInfo)).toEqual(expectedDonationInfo as DonationInfo);
    });

    it("should return proper donation info object if donation termination is set to END_DATE", () => {
      const minDateStart = moment();
      const minDateEnd = moment(donationInfo.monthlyOptions.startDate, dateFormat).isValid() ? moment(donationInfo.monthlyOptions.startDate, dateFormat) : moment();
      const vMonthlyOptions = {
        count: ValidationState.SKIPPED,
        endDate: validate.date(donationInfo.monthlyOptions.endDate, dateFormat, { min: minDateEnd }),
        startDate: validate.date(donationInfo.monthlyOptions.startDate, dateFormat, { min: minDateStart }),
      };
      donationInfoUpdateValues.terminationType = TerminationType.END_DATE;
      const expectedDonationInfo = {
        amount: getConfigValue("amount", donationInfo.amount, donationInfoUpdateValues),
        frequency: getConfigValue("frequency", donationInfo.frequency, donationInfoUpdateValues),
        frequencyType: donationInfo.frequencyType,
        monthlyOptions: {
          terminationType: getConfigValue("terminationType", donationInfo.monthlyOptions.terminationType, donationInfoUpdateValues),
          processImmediately: isStartDateToday(donationInfoUpdateValues, dateFormat, donationInfo.monthlyOptions.processImmediately),
          startDate: getConfigValue("startDate", donationInfo.monthlyOptions.startDate, donationInfoUpdateValues),
          endDate: getConfigValue("endDate", donationInfo.monthlyOptions.endDate, donationInfoUpdateValues),
          count: getConfigValue("count", donationInfo.monthlyOptions.count, donationInfoUpdateValues),
        },
        fund: getConfigValue("fund", donationInfo.fund, donationInfoUpdateValues),
        message: getConfigValue("message", donationInfo.message, donationInfoUpdateValues),
        anonymous: getConfigValue("anonymous", donationInfo.anonymous, donationInfoUpdateValues),
        canadaHelpsDonation: {
          amount: getConfigValue("chAmount", donationInfo.canadaHelpsDonation.amount, donationInfoUpdateValues),
          addDonation: getConfigValue("chAddDonation", donationInfo.canadaHelpsDonation.addDonation, donationInfoUpdateValues),
        },
        appVersion: donationInfo.appVersion,
        persistExpire: donationInfo.persistExpire,
        answerOne: getConfigValue("answerOne", donationInfo.answerOne, donationInfoUpdateValues),
        _validation: {
          amount: validateConfigValue("amount", donationInfo._validation.amount, validate.donation, donationInfoUpdateValues),
          canadaHelpsDonation: {
            amount: validateConfigValue("chAmount", donationInfo._validation.canadaHelpsDonation.amount, validate.donation, donationInfoUpdateValues),
          },
          monthlyOptions: vMonthlyOptions,
        },
      };
      expect(donationUpdateHelper(donationInfoUpdateValues, donationInfo)).toEqual(expectedDonationInfo as DonationInfo);
    });
  });

  describe("its isStartDateToday", () => {

    it("should return processImmeadiately parameter if there is no start date", () => {
      delete donationInfoUpdateValues.startDate;
      const processImmediately = chance.pickone([true, false]);

      expect(isStartDateToday(donationInfoUpdateValues, dateFormat, processImmediately)).toEqual(processImmediately);
    });
  });
});