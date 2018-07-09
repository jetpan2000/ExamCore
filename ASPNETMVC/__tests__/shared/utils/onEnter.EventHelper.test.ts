import * as Chance from "chance";
import {} from "jest";
import onEnter from "../../../src/shared/utils/onEnter.EventHelper";

const chance = new Chance();

describe("utils/onEnter.EventHelper.test.ts", () => {

  describe("and its onEnter when event's keyCode is equal to 13", () => {
    let event;
    let passedFunc;

    beforeEach(() => {
      event = {
        preventDefault: jest.fn(),
        keyCode: 13,
      }
      passedFunc = jest.fn();
    });

    it("should return false", () => {
      expect(onEnter(event, passedFunc)).toEqual(false);
    });

    it("event's preventDefault function should be called", () => {
      onEnter(event, passedFunc);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe("and its onEnter when event's keyCode is not equal to 13", () => {
    let event;
    let passedFunc;

    beforeEach(() => {
      event = {
        preventDefault: jest.fn(),
        keyCode: chance.natural(),
      }
      if (event.keyCode === 13) {
        event.keyCode = chance.natural();
      }
      passedFunc = jest.fn();
    });

    it("should return nothing", () => {
      expect(onEnter(event, passedFunc)).toEqual(undefined);
    });

    it("event's preventDefault function should not be called", () => {
      onEnter(event, passedFunc);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
  });
});
