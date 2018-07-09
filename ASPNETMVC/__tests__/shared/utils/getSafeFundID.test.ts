// Testing tools import
import {} from "jest";

// Types
import { CharityFunds } from "../../../src/shared/interfaces";

// To test
import { getSafeFundID } from "../../../src/shared/utils/";

describe("utils.getSafeFundID", () => {
  const charityFunds: CharityFunds[] = [
    {
      FundID: 1,
      FundDescription: 0,
      DefaultFund: false,
      FundDetails: "Fund 1",
    },
    {
      FundID: 2,
      FundDescription: 0,
      DefaultFund: false,
      FundDetails: "Fund 2",
    },
    {
      FundID: 3,
      FundDescription: 0,
      DefaultFund: false,
      FundDetails: "Fund 3",
    },
    {
      FundID: 4,
      FundDescription: 0,
      DefaultFund: false,
      FundDetails: "Fund 4",
    },
  ];
  const charityFundsDefault: CharityFunds[] = [
    {
      FundID: 1,
      FundDescription: 0,
      DefaultFund: false,
      FundDetails: "Fund 1",
    },
    {
      FundID: 2,
      FundDescription: 0,
      DefaultFund: false,
      FundDetails: "Fund 2",
    },
    {
      FundID: 3,
      FundDescription: 0,
      DefaultFund: true,
      FundDetails: "Fund 3",
    },
    {
      FundID: 4,
      FundDescription: 0,
      DefaultFund: true,
      FundDetails: "Fund 4",
    },
  ];

  it("should return first ID by default", () => {
    expect(getSafeFundID(charityFunds, null)).toEqual(charityFunds[0].FundID);
    expect(getSafeFundID(charityFunds)).toEqual(charityFunds[0].FundID);
    expect(getSafeFundID(charityFunds, undefined)).toEqual(charityFunds[0].FundID);
  });
  it("should return the first fundID if no matching fund is found", () => {
    expect(getSafeFundID(charityFunds, 9001)).toEqual(charityFunds[0].FundID);
  });
  it("should always return a matching fund ID if possible", () => {
    expect(getSafeFundID(charityFunds, 1)).toEqual(1);
    expect(getSafeFundID(charityFunds, 2)).toEqual(2);
    expect(getSafeFundID(charityFunds, 3)).toEqual(3);
    expect(getSafeFundID(charityFunds, 4)).toEqual(4);
  });
  it("should return the given fundID if the fund array is empty", () => {
    expect(getSafeFundID([], 1)).toEqual(1);
    expect(getSafeFundID([], 5)).toEqual(5);
    expect(getSafeFundID([], 12554)).toEqual(12554);
  });

  // React requires a valid initial value for controlled components, undefined and null are not acceptable
  it("should always return a number", () => {
    expect(getSafeFundID([])).toEqual(jasmine.any(Number));
    expect(getSafeFundID([], undefined)).toEqual(jasmine.any(Number));
    expect(getSafeFundID([], null)).toEqual(jasmine.any(Number));
    expect(getSafeFundID([], 1)).toEqual(jasmine.any(Number));
    expect(getSafeFundID(charityFunds, null)).toEqual(jasmine.any(Number));
    expect(getSafeFundID(charityFunds, undefined)).toEqual(jasmine.any(Number));
  });

  it("should return the first default fund if set (if useDefault flag is true)", () => {
    expect(getSafeFundID(charityFundsDefault, 1, true)).toEqual(3);
    expect(getSafeFundID(charityFundsDefault, 2, true)).toEqual(3);
    expect(getSafeFundID(charityFundsDefault, 3, true)).toEqual(3);
    expect(getSafeFundID(charityFundsDefault, 4, true)).toEqual(3);
    expect(getSafeFundID(charityFundsDefault, null, true)).toEqual(3);
    expect(getSafeFundID(charityFundsDefault, undefined, true)).toEqual(3);
  });

  // Necessary to work with local storage
  it("should return the matching fund, default fund, or first fund (in that order)", () => {
    expect(getSafeFundID(charityFundsDefault, 1)).toEqual(1);
    expect(getSafeFundID(charityFundsDefault, 2)).toEqual(2);
    expect(getSafeFundID(charityFundsDefault, 3)).toEqual(3);
    expect(getSafeFundID(charityFundsDefault, 4)).toEqual(4);
    expect(getSafeFundID(charityFundsDefault)).toEqual(3);
  });
});