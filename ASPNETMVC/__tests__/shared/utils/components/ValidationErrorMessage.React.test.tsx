import * as Chance from "chance";
import { shallow } from "enzyme";
import {} from "jest";
import * as React from "react";
import { ValidationErrorMessage } from "../../../../src/shared/utils/components/ValidationErrorMessage.React";

const chance = new Chance();

describe("<ValidationErrorMessage\>", () => {
  let validationErrorMessage;
  let testProps;

  beforeEach(() => {
    testProps = {
      size: "large",
      message: chance.word(),
      displayCondition: true,
    };

    validationErrorMessage = shallow(<ValidationErrorMessage {...testProps}/>);
  });

  it("should be span", () => {
    expect(validationErrorMessage.type()).toEqual("span");
  });

  it("should have a proper class names", () => {
    expect(validationErrorMessage.hasClass("form-error")).toBeTruthy();
    expect(validationErrorMessage.hasClass(testProps.size)).toBeTruthy();
    expect(validationErrorMessage.hasClass("is-visible")).toBeTruthy();
  });

  it("should render message as a text", () => {
    expect(validationErrorMessage.text()).toEqual(testProps.message);
  });

});
