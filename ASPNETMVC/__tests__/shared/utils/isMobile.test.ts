import {} from "jest";
import { isMobile } from "../../../src/shared/utils/isMobile";

describe("utils/isMobile.test.ts", () => {

  it("should return false if no mobile device was detected", () => {
    expect(isMobile()).toEqual(false);
  });
});
