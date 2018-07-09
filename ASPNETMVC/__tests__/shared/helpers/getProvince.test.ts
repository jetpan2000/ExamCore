import * as Chance from "chance";
import {} from "jest";
import { getProvince } from "../../../src/shared/helpers/getProvince";

const chance = new Chance();

describe("helpers/getProvince.test.ts", () => {

  it("should return province if country passed is equal to Canada", () => {
    expect(getProvince("ON", "", "Canada")).toEqual("ON");
  });

  it("should return state if country passed is not equal to Canada", () => {
    const state = chance.word();
    expect(getProvince("", state, chance.word())).toEqual(state);
  });
});