import {} from "jest";
import { isEmbedded } from "../../../src/shared/utils/isEmbedded";

describe("utils/isEmbedded.test.ts", () => {

  it("should return false when window.self is equal to window.top", () => {
    expect(isEmbedded()).toEqual(false);
  });

});
