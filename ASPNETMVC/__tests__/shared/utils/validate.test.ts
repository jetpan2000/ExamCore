import * as Chance from "chance";
import {} from "jest";
import * as moment from "moment";
import { allFieldsAreValidOrSkipped, getOverallValidationState, replacePristineWithEmpty, replaceSkippedWithPristine, validate, validateIncomingData, ValidationState } from "../../../src/shared/utils/validate";

const chance = new Chance();

const locales: string[] = [ "AT", "AU", "BE", "CA", "CH", "CZ", "DE", "DK", "DZ", "ES", "FI", "FR", "GB", "GR", "IL", "IN", "IS", "IT", "JP", "KE", "LI", "MX", "NL", "NO", "PL", "PT", "RO", "RU", "SA", "SE", "TW", "US", "ZA", "ZM" ];
const currentYear = (new Date()).getFullYear();
const currentMonth = 6;
const dateFormat: string = "DD/MM/YYYY";
const minDateStart = moment();
const maxDateStart = moment(`01/${currentMonth}/${currentYear + 2}`, dateFormat);
const futureDate = `01/${currentMonth}/${currentYear + 1}`;
const pastDate = `01/${currentMonth}/${currentYear - 1}`;

describe("utils/validate.test.ts", () => {
  beforeEach(() => {
    // Empty
  });

  describe("and its validate.email", () => {
    it("should return `ValidationState.IS_INVALID` when string is not equal to email", () => {
      expect(validate.email(chance.word())).toEqual(ValidationState.IS_INVALID);
    });

    it("should return `ValidationState.IS_EMPTY` when empty string is passed", () => {
      expect(validate.email("")).toEqual(ValidationState.IS_EMPTY);
    });

    it("should return `ValidationState.IS_VALID` when valid email address is passed", () => {
      expect(validate.email(`${chance.word()}@${chance.word()}.com`)).toEqual(ValidationState.IS_VALID);
    });
  });

  describe("and its validate.creditCard", () => {
    it("should return `ValidationState.IS_INVALID` when input is not a valid credit card number", () => {
      expect(validate.creditCard(chance.word())).toEqual(ValidationState.IS_INVALID);
    });

    it("should return `ValidationState.IS_EMPTY` when empty string is passed", () => {
      expect(validate.creditCard("")).toEqual(ValidationState.IS_EMPTY);
    });

    it("should return `ValidationState.IS_VALID` when valid credit card number is passed", () => {
      expect(validate.creditCard(`4111111111111111`)).toEqual(ValidationState.IS_VALID);
    });
  });

  describe("and its validate.donation", () => {
    it("should return `ValidationState.IS_INVALID` when amount is less than 3", () => {
      const amount = chance.natural({min: 0, max: 2});
      expect(validate.donation(amount)).toEqual(ValidationState.IS_INVALID);
    });

    it("should return `ValidationState.IS_EMPTY` when null or NaN is passed", () => {
      expect(validate.donation(null)).toEqual(ValidationState.IS_EMPTY);
      expect(validate.donation(chance.word())).toEqual(ValidationState.IS_EMPTY);
    });

    it("should return `ValidationState.IS_VALID` when the amount is more than 3 and it is a number", () => {
      const amount = chance.natural({min: 3, max: 1000000});
      expect(validate.donation(amount)).toEqual(ValidationState.IS_VALID);
    });
  });

  describe("and its validate.monthlyCount", () => {
    it("should return `ValidationState.IS_INVALID` when NaN is passed", () => {
      expect(validate.monthlyCount(chance.word())).toEqual(ValidationState.IS_INVALID);
    });

    it("should return `ValidationState.IS_INVALID` when number less than 1 is passed", () => {
      expect(validate.monthlyCount(0)).toEqual(ValidationState.IS_INVALID);
    });

    it("should return `ValidationState.IS_VALID` when number more than 1 is passed", () => {
      const amount = chance.natural({min: 2, max: 1000000});
      expect(validate.monthlyCount(amount)).toEqual(ValidationState.IS_VALID);
    });
  });

  describe("and its validate.requiredText", () => {
    it("should return `ValidationState.IS_EMPTY` when empty string is passed", () => {
      expect(validate.requiredText("")).toEqual(ValidationState.IS_EMPTY);
    });

    it("should return `ValidationState.IS_VALID` when not an empty string is passed", () => {
      expect(validate.requiredText(chance.sentence())).toEqual(ValidationState.IS_VALID);
    });
  });

  describe("and its validate.giftCard", () => {
    it("should return `ValidationState.IS_INVALID` when the passed string's length is not equal to 8 or the string is not alphanumeric", () => {
      expect(validate.giftCard("h6d3")).toEqual(ValidationState.IS_INVALID);
      expect(validate.giftCard("h6d3+=7d")).toEqual(ValidationState.IS_INVALID);
    });

    it("should return `ValidationState.IS_EMPTY` when empty string is passed", () => {
      expect(validate.giftCard("")).toEqual(ValidationState.IS_EMPTY);
    });

    it("should return `ValidationState.IS_VALID` when valid credit card number is passed", () => {
      expect(validate.giftCard(`4g8s0dh3`)).toEqual(ValidationState.IS_VALID);
    });
  });

  describe("and its validate.expiryDate", () => {
    it("should return `ValidationState.IS_EMPTY` when month or year passed is an empty string", () => {
      expect(validate.expiryDate("", "")).toEqual(ValidationState.IS_EMPTY);
      expect(validate.expiryDate(chance.natural(), "")).toEqual(ValidationState.IS_EMPTY);
      expect(validate.expiryDate("", chance.natural())).toEqual(ValidationState.IS_EMPTY);
    });

    it("should return `ValidationState.IS_VALID` when a future date is used", () => {
      expect(validate.expiryDate(chance.natural({min: currentMonth}), chance.natural({min: currentYear}))).toEqual(ValidationState.IS_VALID);
    });

    it("should return `ValidationState.IS_INVALID` when a past date is used", () => {
      const month = chance.natural({min: 1, max: 12});
      expect(validate.expiryDate(month, chance.natural({min: 1970, max: (currentYear - 1)}))).toEqual(ValidationState.IS_INVALID);
    });
  });

  describe("and its validate.postalCode", () => {
    it("should return `ValidationState.IS_VALID` when passed locale is a part of locales array and the postal code belongs to locale", () => {
      expect(validate.postalCode("M5V 1S2", "CA")).toEqual(ValidationState.IS_VALID);
    });

    it("should return `ValidationState.IS_VALID` when unknown country code is passed", () => {
      expect(validate.postalCode("M5V 1S2", chance.word())).toEqual(ValidationState.IS_VALID);
    });

    it("should return `ValidationState.IS_INVALID` when passed locale is a part of locales array and the postal code does not belong to locale", () => {
      const locale = "CZ";
      expect(validate.postalCode("M5V 1S2", locale)).toEqual(ValidationState.IS_INVALID);
    });

    it("should return `ValidationState.IS_EMPTY` when empty string is passed", () => {
      const locale = locales[(Math.random() * (locales.length - 1) | 0)];
      expect(validate.postalCode("", locale)).toEqual(ValidationState.IS_EMPTY);
    });

    it("should return `ValidationState.IS_VALID` when a passed string is a unvalidated country code", () => {
      expect(validate.postalCode("M5V 1S2", chance.word())).toEqual(ValidationState.IS_VALID);
    });
  });

  describe("and its validate.date", () => {
    it("should return `ValidationState.IS_EMPTY` when month or year passed is an empty string", () => {
      expect(validate.date("", dateFormat, { min: minDateStart })).toEqual(ValidationState.IS_EMPTY);
    });

    it("should return `ValidationState.IS_VALID` when a future date is used", () => {
      expect(validate.date(futureDate, dateFormat, { min: minDateStart })).toEqual(ValidationState.IS_VALID);
    });

    it("should return `ValidationState.IS_INVALID` when a date in non-valid format is passed", () => {
      expect(validate.date(chance.word(), dateFormat, { min: minDateStart })).toEqual(ValidationState.IS_INVALID);
    });

    it("should return `ValidationState.IS_INVALID` when a past date is used", () => {
      expect(validate.date(pastDate, dateFormat, { min: minDateStart })).toEqual(ValidationState.IS_INVALID);
    });
  });

  describe("and its validate.isDateBetween", () => {

    describe("when in config valid min and max dates are passed", () => {
      it("should return `ValidationState.IS_VALID` when a date in between min and max dates is used", () => {
        expect(validate.isDateBetween(moment(futureDate, dateFormat), {
          min: minDateStart,
          max: maxDateStart,
        })).toEqual(ValidationState.IS_VALID);
      });

      it("should return `ValidationState.IS_INVALID` when a date before min date or after max date is used", () => {
        expect(validate.isDateBetween(moment(pastDate, dateFormat), {
          min: minDateStart,
          max: maxDateStart,
        })).toEqual(ValidationState.IS_INVALID);
      });
    });

    describe("when in config valid max date is passed and no min date is passed", () => {
      it("should return `ValidationState.IS_VALID` when a date before max date is used", () => {
        expect(validate.isDateBetween(moment(futureDate, dateFormat), {
          max: maxDateStart,
        })).toEqual(ValidationState.IS_VALID);
      });

      it("should return `ValidationState.IS_INVALID` when a date after max date is used", () => {
        const afterMaxDate = moment(`01/${currentMonth}/${currentYear + 3}`, dateFormat);
        expect(validate.isDateBetween(moment(afterMaxDate, dateFormat), {
          max: maxDateStart,
        })).toEqual(ValidationState.IS_INVALID);
      });
    });

    describe("when in config valid min date is passed and no max date is passed", () => {
      it("should return `ValidationState.IS_VALID` when a date after min date is used", () => {
        expect(validate.isDateBetween(moment(futureDate, dateFormat), {
          min: minDateStart,
        })).toEqual(ValidationState.IS_VALID);
      });

      it("should return `ValidationState.IS_INVALID` when a date before min date is used", () => {
        expect(validate.isDateBetween(moment(pastDate, dateFormat), {
          min: minDateStart,
        })).toEqual(ValidationState.IS_INVALID);
      });
    });

    it("should return `ValidationState.IS_INVALID` when a passed value is not a date in a proper format", () => {
      expect(validate.isDateBetween(moment(chance.word(), dateFormat), { min: minDateStart })).toEqual(ValidationState.IS_INVALID);
    });

    it("should return `ValidationState.IS_VALID` when a passed value is in a date and no min and max dates are provided", () => {
      expect(validate.isDateBetween(moment(futureDate, dateFormat), {})).toEqual(ValidationState.IS_VALID);
    });
  });

  describe("and its validate.isNumber", () => {
    it("should return `ValidationState.IS_EMPTY` when null or undefined is passed", () => {
      expect(validate.isNumber(null)).toEqual(ValidationState.IS_EMPTY);
      expect(validate.isNumber(undefined)).toEqual(ValidationState.IS_EMPTY);
    });

    it("should return `ValidationState.IS_VALID` when a number is passed", () => {
      expect(validate.isNumber(chance.natural())).toEqual(ValidationState.IS_VALID);
    });

    it("should return `ValidationState.IS_INVALID` when not a number is passed", () => {
      expect(validate.isNumber(chance.word())).toEqual(ValidationState.IS_INVALID);
    });
  });

  describe("and its getOverallValidationState", () => {
    it("should return ValidationState.IS_VALID if all fields in a passed array are equal to ValidationState.IS_VALID", () => {
      expect(getOverallValidationState([ValidationState.IS_VALID, ValidationState.IS_VALID, ValidationState.IS_VALID])).toEqual(ValidationState.IS_VALID);
    });

    it("should return ValidationState.IS_PRISTINE if all fields in a passed array are equal to ValidationState.IS_PRISTINE", () => {
      expect(getOverallValidationState([ValidationState.IS_PRISTINE, ValidationState.IS_PRISTINE, ValidationState.IS_PRISTINE])).toEqual(ValidationState.IS_PRISTINE);
    });

    it("should return ValidationState.SKIPPED if all fields in a passed array are equal to ValidationState.SKIPPED", () => {
      expect(getOverallValidationState([ValidationState.SKIPPED, ValidationState.SKIPPED, ValidationState.SKIPPED])).toEqual(ValidationState.SKIPPED);
    });

    it("should return ValidationState.IS_INVALID if not all fields in a passed array are equal and if one or all of them are equal to ValidationState.IS_INVALID or ValidationState.IS_EMPTY", () => {
      expect(getOverallValidationState([ValidationState.IS_PRISTINE, ValidationState.SKIPPED, ValidationState.IS_VALID])).toEqual(ValidationState.IS_INVALID);
      expect(getOverallValidationState([ValidationState.IS_INVALID, ValidationState.IS_INVALID, ValidationState.IS_INVALID])).toEqual(ValidationState.IS_INVALID);
      expect(getOverallValidationState([ValidationState.IS_EMPTY, ValidationState.IS_EMPTY, ValidationState.IS_EMPTY])).toEqual(ValidationState.IS_INVALID);
    });
  });

  describe("and its replacePristineWithEmpty", () => {
    it("should return ValidationState.SKIPPED if skipCondition is true", () => {
      expect(replacePristineWithEmpty(ValidationState, true)).toEqual(ValidationState.SKIPPED);
    });

    it("should return ValidationState.IS_EMPTY if skipCondition is false and ValidationState.IS_PRISTINE", () => {
      expect(replacePristineWithEmpty(ValidationState.IS_PRISTINE, false)).toEqual(ValidationState.IS_EMPTY);
    });

    it("should return validation object if skipCondition is false and validation is not IS_PRISTINE", () => {
      expect(replacePristineWithEmpty(ValidationState)).toEqual(ValidationState);
    });
  });

  describe("and its replaceSkippedWithPristine", () => {
    it("should return ValidationState.IS_PRISTINE if validation passed is ValidationState.SKIPPED", () => {
      expect(replaceSkippedWithPristine(ValidationState.SKIPPED)).toEqual(ValidationState.IS_PRISTINE);
    });

    it("should return validation object if validation passed is not equal to ValidationState.SKIPPED", () => {
      expect(replaceSkippedWithPristine(ValidationState.IS_EMPTY)).toEqual(ValidationState.IS_EMPTY);
    });
  });

  describe("and its allFieldsAreValidOrSkipped", () => {
    it("should return true if all fields in a passed array are equal to ValidationState.IS_VALID or ValidationState.SKIPPED", () => {
      expect(allFieldsAreValidOrSkipped([ValidationState.IS_VALID, ValidationState.IS_VALID, ValidationState.SKIPPED])).toEqual(true);
    });

    it("should return false if one of the fields in a passed array is not equal to ValidationState.IS_VALID or ValidationState.SKIPPED", () => {
      expect(allFieldsAreValidOrSkipped([ValidationState.IS_VALID, ValidationState.IS_EMPTY, ValidationState.SKIPPED])).toEqual(false);
    });
  });

  describe("and its validateIncomingData", () => {
    it("should return ValidationState.SKIPPED if skipCondition passed to the function is equal to true", () => {
      expect(validateIncomingData([], jest.fn(), true)).toEqual(ValidationState.SKIPPED);
    });

    it("should return validation function if skipCondition passed to the function is equal to false", () => {
      const data = [];
      const validationFunction = jest.fn();
      expect(validateIncomingData(data, validationFunction, false)).toEqual(validationFunction(data));
    });

    it("should return validation function if skipCondition is not passed", () => {
      const data = [];
      const validationFunction = jest.fn();
      expect(validateIncomingData(data, validationFunction)).toEqual(validationFunction(data));
    });
  });
});