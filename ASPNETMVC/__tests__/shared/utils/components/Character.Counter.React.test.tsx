import * as Chance from "chance";
import { shallow } from "enzyme";
import {} from "jest";
import * as React from "react";
import { CharacterCounter } from "../../../../src/shared/utils/components/CharacterCounter.React";

const chance = new Chance();

const charactersRemaining = chance.word();

describe("<CharacterCounter\>", () => {
  let characterCounter;
  let testProps;

  beforeEach(() => {
    testProps = {
      characters_remaining: jest.fn(() => charactersRemaining),
      characterCount: chance.natural(),
      maxCharacters: chance.natural(),
    };

    characterCounter = shallow(<CharacterCounter {...testProps}/>);
  });

  it("should should be a span", () => {
    expect(characterCounter.type()).toEqual("span");
  });

  it("should render the value that characters_remaining function is returning", () => {
    expect(characterCounter.text()).toEqual(charactersRemaining);
  });

  describe("when characterCount length is more than 0", () => {
    it("should have `hidden` prop equal to false", () => {
      expect(characterCounter.prop("hidden")).toEqual(false);
    });

    it("should have `aria-hidden` prop equal to false", () => {
      expect(characterCounter.prop("aria-hidden")).toEqual(false);
    });
  });

  describe("when characterCount length is equal or less than 0", () => {
    beforeEach(() => {
      characterCounter.setProps({characterCount: 0});
    });

    it("should have `hidden` prop equal to true", () => {
      expect(characterCounter.prop("hidden")).toEqual(true);
    });

    it("should have `aria-hidden` prop equal to true", () => {
      expect(characterCounter.prop("aria-hidden")).toEqual(true);
    });
  });

});
