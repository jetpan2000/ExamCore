import * as Chance from "chance";
import {} from "jest";
import { formatCurrency, getCentsToTwoPlaces, splitAmountIntoGroups } from "../../../src/shared/utils/formatCurrency";

const chance = new Chance();

describe("utils/formatCurrency.test.ts", () => {

  it("should return formatted currency when amount is floating type with 2 decimals, language is set to en and dividers are set to true", () => {
    const amount = chance.floating({min: 0, max: 100000, fixed: 2});
    const locale = "en";
    const splitAmount = splitAmountIntoGroups(`${amount}`);
    const dollars = splitAmount[0].join(",");
    const cents = getCentsToTwoPlaces(splitAmount[1]);
    const expectedFormat = `$${dollars}.${cents}`;
    expect(formatCurrency(amount, locale, true)).toEqual(expectedFormat);
  });

  it("should return formatted currency when amount is floating type with 2 decimals, language is set to fr and dividers are set to true", () => {
    const amount = chance.floating({min: 0, max: 100000, fixed: 2});
    const locale = "fr";
    const splitAmount = splitAmountIntoGroups(`${amount}`);
    const dollars = splitAmount[0].join(" ");
    const cents = getCentsToTwoPlaces(splitAmount[1]);
    const expectedFormat = `${dollars},${cents} $`;
    expect(formatCurrency(amount, locale, true)).toEqual(expectedFormat);
  });

  it("should return formatted currency when amount is floating type, language is set to en and dividers are set to false", () => {
    const amount = chance.floating({min: 0, max: 100000, fixed: 2});
    const locale = "en";
    const splitAmount = splitAmountIntoGroups(`${amount}`);
    const dollars = splitAmount[0].join("");
    const cents = getCentsToTwoPlaces(splitAmount[1]);
    const expectedFormat = `$${dollars}.${cents}`;
    expect(formatCurrency(amount, locale, false)).toEqual(expectedFormat);
  });

  it("should return formatted currency when amount is floating type, language is set to fr and dividers are set to false", () => {
    const amount = chance.floating({min: 0, max: 100000, fixed: 2});
    const locale = "fr";
    const splitAmount = splitAmountIntoGroups(`${amount}`);
    const dollars = splitAmount[0].join("");
    const cents = getCentsToTwoPlaces(splitAmount[1]);
    const expectedFormat = `${dollars},${cents} $`;
    expect(formatCurrency(amount, locale, false)).toEqual(expectedFormat);
  });

  it("should return formatted currency when amount is floating type with 1 decimal, language is set to en and dividers are set to true", () => {
    const amount = chance.floating({min: 0, max: 100000, fixed: 1});
    const locale = "en";
    const splitAmount = splitAmountIntoGroups(`${amount}`);
    const dollars = splitAmount[0].join(",");
    const cents = getCentsToTwoPlaces(splitAmount[1]);
    const expectedFormat = `$${dollars}.${cents}`;
    expect(formatCurrency(amount, locale, true)).toEqual(expectedFormat);
  });

  it("should return formatted currency when amount is floating type with 1 decimal, language is set to fr and dividers are set to true", () => {
    const amount = chance.floating({min: 0, max: 100000, fixed: 1});
    const locale = "fr";
    const splitAmount = splitAmountIntoGroups(`${amount}`);
    const dollars = splitAmount[0].join(" ");
    const cents = getCentsToTwoPlaces(splitAmount[1]);
    const expectedFormat = `${dollars},${cents} $`;
    expect(formatCurrency(amount, locale, true)).toEqual(expectedFormat);
  });

  it("should return formatted currency when amount is floating type with more than 2 decimals, language is set to en and dividers are set to true", () => {
    const amount = chance.floating({min: 0, max: 100000, fixed: 5});
    const locale = "en";
    const splitAmount = splitAmountIntoGroups(`${amount}`);
    const dollars = splitAmount[0].join(",");
    const cents = getCentsToTwoPlaces(splitAmount[1]);
    const expectedFormat = `$${dollars}.${cents}`;
    expect(formatCurrency(amount, locale, true)).toEqual(expectedFormat);
  });

  it("should return formatted currency when amount is floating type with more than 2 decimals, language is set to fr and dividers are set to true", () => {
    const amount = chance.floating({min: 0, max: 100000, fixed: 5});
    const locale = "fr";
    const splitAmount = splitAmountIntoGroups(`${amount}`);
    const dollars = splitAmount[0].join(" ");
    const cents = getCentsToTwoPlaces(splitAmount[1]);
    const expectedFormat = `${dollars},${cents} $`;
    expect(formatCurrency(amount, locale, true)).toEqual(expectedFormat);
  });

  it("should return formatted currency when amount is integer, language is set to en and dividers are set to true", () => {
    const amount = chance.natural();
    const locale = "en";
    const splitAmount = splitAmountIntoGroups(`${amount}`);
    const dollars = splitAmount[0].join(",");
    const cents = getCentsToTwoPlaces(splitAmount[1]);
    const expectedFormat = `$${dollars}.${cents}`;
    expect(formatCurrency(amount, locale, true)).toEqual(expectedFormat);
  });

  it("should return formatted currency when amount is integer, language is set to fr and dividers are set to true", () => {
    const amount = chance.natural();
    const locale = "fr";
    const splitAmount = splitAmountIntoGroups(`${amount}`);
    const dollars = splitAmount[0].join(" ");
    const cents = getCentsToTwoPlaces(splitAmount[1]);
    const expectedFormat = `${dollars},${cents} $`;
    expect(formatCurrency(amount, locale, true)).toEqual(expectedFormat);
  });
});
