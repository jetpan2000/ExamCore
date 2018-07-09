import * as Chance from "chance";
import {} from "jest";
import { LogoCardTypes } from "../../../src/shared/constants/Payment";
import { CharityFunds } from "../../../src/shared/interfaces/";
import { allValuesEqual, getCardType, getConfigValue, getDescription, getLanguageCode, getSafeFundID, isPristineOrValid, redirectTo, validateConfigValue } from "../../../src/shared/utils/index";
import { isEmbedded } from "../../../src/shared/utils/isEmbedded";
import { ValidationState } from "../../../src/shared/utils/validate";

const chance = new Chance();

const isEmbededValue = true;
jest.mock("../../../src/shared/utils/isEmbedded");
isEmbedded.mockImplementation(() => isEmbededValue);

global.window.open = jest.fn();

describe("utils/index.test.ts", () => {

  describe("and its getSafeFundID method", () => {
    it("should execute getSafeFundID and return expected first FundID if useDefault set to true", () => {
      // harcoded FundID in order to see correct FundID
      const funds: CharityFunds[] = [
        {
          FundID: chance.natural(),
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: false,
        },
        {
          FundID: chance.natural(),
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: true,
        },
        {
          FundID: chance.natural(),
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: false,
        },
      ];

      const fundIDs: Array<number> = [];
      funds.forEach(item => {
        if (item.DefaultFund) {
          fundIDs.push(item.FundID);
        }
      });

      const fundID: number | null = chance.natural();
      const useDefault: boolean = true;
      const result: number = getSafeFundID(funds, fundID, useDefault);
      expect(result).toEqual(fundIDs[0]);
    });
    it("should execute getSafeFundID and return fakeFundID if useDefault set to false", () => {
      const funds: CharityFunds[] = [
        {
          FundID: 101,
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: false,
        },
        {
          FundID: 102,
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: true,
        },
        {
          FundID: 103,
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: false,
        },
      ];
      const fakeFundID: number | null = 102;
      const fakeuUeDefault: boolean = false;
      const result: number = getSafeFundID(funds, fakeFundID, fakeuUeDefault);
      expect(result).toEqual(fakeFundID);
    });
    it("should execute getSafeFundIDa and return FundID of the fund that has DefaultFund set to true if useDefault set to false", () => {
      const funds: CharityFunds[] = [
        {
          FundID: 101,
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: false,
        },
        {
          FundID: 102,
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: true,
        },
        {
          FundID: 103,
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: false,
        },
      ];
      const fakeFundID: number | null = 105;
      const fakeuUeDefault: boolean = false;
      const result: number = getSafeFundID(funds, fakeFundID, fakeuUeDefault);
      expect(result).toEqual(102);
    });
    it("should execute getSafeFundIDa and return first FundID if useDefault set to false", () => {
      const funds: CharityFunds[] = [
        {
          FundID: 101,
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: false,
        },
        {
          FundID: 102,
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: false,
        },
        {
          FundID: 103,
          FundDescription: chance.natural(),
          FundDetails: chance.word(),
          DefaultFund: false,
        },
      ];
      const fakeFundID: number | null = 105;
      const fakeuUeDefault: boolean = false;
      const result: number = getSafeFundID(funds, fakeFundID, fakeuUeDefault);
      expect(result).toEqual(101);
    });
    it("should execute getSafeFundID and return fakeFundID if useDefault set to false", () => {
      const funds: CharityFunds[] = [];
      const fakeFundID: number | null = 101;
      const fakeuUeDefault: boolean = false;
      const result: number = getSafeFundID(funds, fakeFundID, fakeuUeDefault);
      expect(result).toEqual(fakeFundID);
    });
    it("should execute getSafeFundIDa and return 0 if fakeFundID is eqal to null and useDefault set to false", () => {
      const funds: CharityFunds[] = [];
      const fakeFundID: number | null = null;
      const fakeuUeDefault: boolean = false;
      const result: number = getSafeFundID(funds, fakeFundID, fakeuUeDefault);
      expect(result).toEqual(0);
    });
  });

  describe("and its getCardType", () => {
    it("should execute getCardType and return invalid when no card number was passed", () => {
      const fakeCardNumber: string | null = null;
      expect(getCardType(fakeCardNumber)).toEqual(LogoCardTypes.invalid);
    });
    it("should execute getCardType and return invalid when card number passed does not begin with either 4, 5, 2 or 3", () => {
      const fakeCardNumber: string | null = `6724${chance.word()}`;
      expect(getCardType(fakeCardNumber)).toEqual(LogoCardTypes.invalid);
    });
    it("should execute getCardType and return TD VIsa Debit or 2 from LogoCardTypes", () => {
      const fakeCardNumber1: string | null = `4724${chance.word()}`;
      expect(getCardType(fakeCardNumber1)).toEqual(LogoCardTypes.visaDebit);
      const fakeCardNumber2: string | null = `4506${chance.word()}`;
      expect(getCardType(fakeCardNumber2)).toEqual(LogoCardTypes.visaDebit);
    });
    it("should execute getCardType and return Visa or 1 from LogoCardTypes", () => {
      const fakeCardNumber: string | null = `4${chance.word()}`;
      expect(getCardType(fakeCardNumber)).toEqual(LogoCardTypes.visa);
    });
    it("should execute getCardType and return mastercard or 0 from LogoCardTypes", () => {
      const fakeCardNumber1: string | null = `5${chance.word()}`;
      expect(getCardType(fakeCardNumber1)).toEqual(LogoCardTypes.mastercard);
      const fakeCardNumber2: string | null = `2${chance.word()}`;
      expect(getCardType(fakeCardNumber2)).toEqual(LogoCardTypes.mastercard);
    });
    it("should execute getCardType and return mastercard or 0 from LogoCardTypes", () => {
      const fakeCardNumber1: string | null = `3${chance.word()}`;
      expect(getCardType(fakeCardNumber1)).toEqual(LogoCardTypes.amex);
    });
  });

  describe("and its getConfigValue", () => {
    it("should execute getConfigValue and return config object with associated property", () => {
      const fakeProperty: string = "setting";
      const fakeDefaultValue: any = chance.word();
      const randomString: string = chance.word();
      interface GenericObject {
        [key: string]: string;
      }
      const fakeConfig: GenericObject = {
        setting: randomString,
      };
      expect(getConfigValue(fakeProperty, fakeDefaultValue, fakeConfig)).toEqual(randomString);
    });
    it("should execute getConfigValue and return defaultValue with property not existed in object", () => {
      const fakeProperty: string = "setting";
      const fakeDefaultValue: any = chance.word();
      const randomString: string = chance.word();
      interface GenericObject {
        [key: string]: string;
      }
      const fakeConfig: GenericObject = {
        conf: randomString,
      };
      expect(getConfigValue(fakeProperty, fakeDefaultValue, fakeConfig)).toEqual(fakeDefaultValue);
    });
  });

  describe("and its validateConfigValue", () => {
    it("should execute validateConfigValue and return ValidationState with same enum type", () => {
      const fakeProperty: string = "settings";
      const fakeCurrentValidationState: ValidationState = ValidationState.IS_EMPTY;
      const randomString: string = chance.word();
      const fakeValidFunc =  (value: any) => {
        return ValidationState.IS_EMPTY;
      };
      interface GenericObject {
        [key: string]: string;
      }
      const fakeConfig: GenericObject = {
        setting: randomString,
      };
      expect(validateConfigValue(fakeProperty, fakeCurrentValidationState, fakeValidFunc, fakeConfig)).toEqual(ValidationState.IS_EMPTY);
    });
    it("should execute validateConfigValue and return config with associated property", () => {
      const fakeProperty: string = "fakeProperty";
      const fakeCurrentValidationState: ValidationState = ValidationState.IS_VALID;
      const fakeValidFunc =  (value: any) => {
        return ValidationState.IS_VALID;
      };
      interface GenericObject {
        [key: string]: string;
      }
      const fakeConfig: GenericObject = {
        fakeProperty: chance.word(),
      };
      expect(validateConfigValue(fakeProperty, fakeCurrentValidationState, fakeValidFunc, fakeConfig)).toEqual(ValidationState.IS_VALID);
    });
  });

  describe("and its isPristineOrValid", () => {
    it("should execute isPristineOrValid and return false if not IS_VALID OR IS_PRISTINE", () => {
      expect(isPristineOrValid(ValidationState.IS_INVALID)).toEqual(false);
      expect(isPristineOrValid(ValidationState.IS_EMPTY)).toEqual(false);
    });
    it("should execute isPristineOrValid and return true if IS_VALID OR IS_PRISTINE", () => {
      expect(isPristineOrValid(ValidationState.IS_VALID)).toEqual(true);
      expect(isPristineOrValid(ValidationState.IS_PRISTINE)).toEqual(true);
    });
  });

  describe("and its allValuesEqual", () => {
    it("should execute allValuesEqual and return `TRUE` if valueToCompare found", () => {
      let fakeArray: Array<string> = [];
      const fakeValueToCompare = chance.word();
      fakeArray = [...fakeArray, fakeValueToCompare];
      expect(allValuesEqual(fakeArray, fakeValueToCompare)).toEqual(true);
    });
    it("should execute allValuesEqual and return `FALSE` if valueToCompare found", () => {
      let fakeArray: Array<string> = [];
      const fakeValueToCompare = chance.word();
      fakeArray = [...fakeArray, chance.word()];
      expect(allValuesEqual(fakeArray, fakeValueToCompare)).toEqual(false);
    });
  });

  describe("and its getLanguageCode", () => {

    it('should return 2 if passed language is "fr"', () => {
      expect(getLanguageCode("fr")).toEqual(2);
    });

    it('should return 1 if passed language is "en"', () => {
      expect(getLanguageCode("en")).toEqual(1);
    });
  });

  describe("and its redirectTo", () => {

    it("should call window.open function", () => {
      redirectTo(chance.word());
      expect(global.window.open).toHaveBeenCalled();
    });

    it("should change window.location.href", () => {
      isEmbededValue = false;
      const newURL = `https://${chance.word()}/${chance.word()}/`;
      redirectTo(newURL);
      expect(window.location.href).toEqual("about:blank");
    });
  });

  describe("and its getDescription", () => {
    let description;
    let mission;

    it("should return description string if description passed exists and its length is more than 0", () => {
      description = chance.word();
      mission = chance.word();
      expect(getDescription(description, mission)).toEqual(description);
    });

    it("should return mission string if no description was passed but mission exists and its length is more than 0", () => {
      description = "";
      mission = chance.word();
      expect(getDescription(description, mission)).toEqual(mission);
    });

    it("should return empty string if no mission and no description exist or they are empty strings", () => {
      description = "";
      mission = "";
      expect(getDescription(description, mission)).toEqual("");
    });
  });
});
