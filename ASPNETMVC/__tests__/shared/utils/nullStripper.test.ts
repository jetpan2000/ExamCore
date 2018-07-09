import * as Chance from "chance";
import {} from "jest";
import nullStripper from "../../../src/shared/utils/nullStripper";

const chance = new Chance();

describe("utils/nullStripper.test.ts", () => {

  it("should return empty string if the passed value is equal to null", () => {
    expect(nullStripper(null)).toEqual("");
  });

  it("should return the same value that was passed if its type is string and not equal to null", () => {
    const value = chance.word();
    expect(nullStripper(value)).toEqual(value);
  });

  it("should return proper value if the passed value's type is not a string and it is not equal to null", () => {
    const value = chance.natural();
    expect(nullStripper(value)).toEqual(`${value}`);
  });
});
