import * as Chance from "chance";
import {} from "jest";
import { isSafeError } from "../../../src/shared/helpers/isSafeError";

const chance = new Chance();
const safeErrorCodes = ["-901", "-902", "-912", "-913", "-916", "-917", "-918", "-919", "-945", "-947"];

describe("helpers/isSafeError.test.ts", () => {

  it("should return false when the passed code is not in the list of safe error codes", () => {
    expect(isSafeError(chance.word())).toEqual(false);
  });

  it("should return true when the passed code is not in the list of safe error codes", () => {
    expect(isSafeError(chance.pickone(safeErrorCodes))).toEqual(true);
  });
});
