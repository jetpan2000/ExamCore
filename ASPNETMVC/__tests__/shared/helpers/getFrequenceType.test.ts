import {} from "jest";
import { getFrequencyType } from "../../../src/shared/helpers/getFrequencyType";
import { FrequencyType } from "../../../src/shared/constants/Donations";

describe("helpers/getFrequencyType.test.ts", () => {

  it("should return FrequencyType.ONE_TIME_ONLY if apiFrequencyType is equal to 1", () => {
    expect(getFrequencyType(1)).toEqual(FrequencyType.ONE_TIME_ONLY);
  });

  it("should return FrequencyType.MONTHLY_ONLY if apiFrequencyType is equal to 2", () => {
    expect(getFrequencyType(2)).toEqual(FrequencyType.MONTHLY_ONLY);
  });

  it("should return FrequencyType.BOTH if apiFrequencyType is equal to 0", () => {
    expect(getFrequencyType(0)).toEqual(FrequencyType.BOTH);
  });
});