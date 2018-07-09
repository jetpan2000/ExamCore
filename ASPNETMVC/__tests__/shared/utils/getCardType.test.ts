// Testing tools import
import {} from "jest";

// Types
import { LogoCardTypes } from "../../../src/shared/constants/Payment";

// To test
import { getCardType } from "../../../src/shared/utils/";

describe("utils.getCardType", () => {
  it("should return LogoCardTypes.visa for values starting with 4", () => {
    expect(getCardType("4")).toEqual(LogoCardTypes.visa);
    expect(getCardType("4667")).toEqual(LogoCardTypes.visa);
    expect(getCardType("4545454545454545")).toEqual(LogoCardTypes.visa);
  });
  it("should return LogoCardTypes.visaDebit for CIBC and TD cards", () => {
    expect(getCardType("4506")).toEqual(LogoCardTypes.visaDebit);
    expect(getCardType("4506000011112222")).toEqual(LogoCardTypes.visaDebit);
    expect(getCardType("4724")).toEqual(LogoCardTypes.visaDebit);
    expect(getCardType("4724000011112222")).toEqual(LogoCardTypes.visaDebit);
  });
  it("should return LogoCardTypes.mastercard cards starting with 5 and 2", () => {
    expect(getCardType("5")).toEqual(LogoCardTypes.mastercard);
    expect(getCardType("2")).toEqual(LogoCardTypes.mastercard);
    expect(getCardType("5454545454545454")).toEqual(LogoCardTypes.mastercard);
    expect(getCardType("2020202020202020")).toEqual(LogoCardTypes.mastercard);
  });
  it("should return LogoCardTypes.amex cards starting with 3", () => {
    expect(getCardType("3")).toEqual(LogoCardTypes.amex);
    expect(getCardType("3030303030303030")).toEqual(LogoCardTypes.amex);
  });
  it("should return LogoCardTypes.invalid for all other card numbers", () => {
    expect(getCardType("1")).toEqual(LogoCardTypes.invalid);
    expect(getCardType("6")).toEqual(LogoCardTypes.invalid);
    expect(getCardType("7")).toEqual(LogoCardTypes.invalid);
    expect(getCardType("8")).toEqual(LogoCardTypes.invalid);
    expect(getCardType("9")).toEqual(LogoCardTypes.invalid);
    expect(getCardType("0")).toEqual(LogoCardTypes.invalid);
  });
  it("should return LogoCardTypes.invalid for null, invalid, or empty values", () => {
    expect(getCardType("")).toEqual(LogoCardTypes.invalid);
    expect(getCardType(null)).toEqual(LogoCardTypes.invalid);
    expect(getCardType(undefined)).toEqual(LogoCardTypes.invalid);
    expect(getCardType("cardnumber")).toEqual(LogoCardTypes.invalid);
    expect(getCardType("undefined")).toEqual(LogoCardTypes.invalid);
    expect(getCardType("true")).toEqual(LogoCardTypes.invalid);
    expect(getCardType("false")).toEqual(LogoCardTypes.invalid);
    expect(getCardType("null")).toEqual(LogoCardTypes.invalid);
  });
});