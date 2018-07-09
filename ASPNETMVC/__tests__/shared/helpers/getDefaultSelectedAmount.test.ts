import * as Chance from "chance";
import {} from "jest";

import { getDefaultSelectedAmount, getSecondOrDefaultAmount } from "../../../src/shared/helpers/getDefaultSelectedAmount";

const chance = new Chance();

describe("shared/helpers/getDefaultSelectedAmount.test.ts", () => {
  describe("getSecondOrDefaultAmount()", () => {

    const amountLevelsFull = {
      "10": chance.sentence(),
      "20": chance.sentence(),
      "50": chance.sentence(),
      "100": chance.sentence(),
    };
    const amountLevelsHalf = {
      "50": chance.sentence(),
      "100": chance.sentence(),
    };
    const amountLevelsOne = {
      "100": chance.sentence(),
    };
    const amountLevelsEmpty = {};
    const amountLevelsNull = null;
    const amountLevelsUndef = undefined;

    it("should return the second amount by default if it exists as a number", () => {
      expect(getSecondOrDefaultAmount(amountLevelsFull)).toEqual(20);
      expect(getSecondOrDefaultAmount(amountLevelsHalf)).toEqual(100);
      expect(getSecondOrDefaultAmount(amountLevelsOne)).toEqual(100);
    });
    it("should return null if amounts are empry, null, or undefined", () => {
      expect(getSecondOrDefaultAmount(amountLevelsEmpty)).toEqual(null);
      expect(getSecondOrDefaultAmount(amountLevelsNull)).toEqual(null);
      expect(getSecondOrDefaultAmount(amountLevelsUndef)).toEqual(null);
    });
    it("should return the position passed in, if available", () => {
      expect(getSecondOrDefaultAmount(amountLevelsFull, 0)).toEqual(10);
      expect(getSecondOrDefaultAmount(amountLevelsFull, 1)).toEqual(20);
      expect(getSecondOrDefaultAmount(amountLevelsFull, 2)).toEqual(50);
      expect(getSecondOrDefaultAmount(amountLevelsFull, 3)).toEqual(100);
      expect(getSecondOrDefaultAmount(amountLevelsFull, 4)).toEqual(10);
    });
    it("should return null if the position is less than 0", () => {
      expect(getSecondOrDefaultAmount(amountLevelsFull, -1)).toEqual(null);
      expect(getSecondOrDefaultAmount(amountLevelsHalf, -1)).toEqual(null);
      expect(getSecondOrDefaultAmount(amountLevelsOne, -1)).toEqual(null);
      expect(getSecondOrDefaultAmount(amountLevelsEmpty, -1)).toEqual(null);
      expect(getSecondOrDefaultAmount(amountLevelsNull, -1)).toEqual(null);
      expect(getSecondOrDefaultAmount(amountLevelsUndef, -1)).toEqual(null);
    });
  });
});