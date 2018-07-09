import * as Chance from "chance";
import {shallow} from 'enzyme';
import {} from "jest";
import * as React from "react";
import { ECardPreview, ECardPreviewProps } from "../../../../src/shared/utils/ECardWidget/ECardPreview.React";
import onEnter from "../../../../src/shared/utils/onEnter.EventHelper";
import { ValidationState } from "../../../../src/shared/utils/validate";

const chance = new Chance();

jest.mock("../../../../src/shared/utils/onEnter.EventHelper");
onEnter.mockImplementation(() => true);

describe("<ECardPreview\>", () => {
  let eCardPreview;
  let testProps: ECardPreviewProps;

  beforeEach(() => {

    testProps = {
      hidden: false,
      text: {
        recipient_details: chance.word(),
        recipient_name: chance.word(),
        recipient_email: chance.word(),
        sender_details: chance.word(),
        sender_name: chance.word(),
        sender_email: chance.word(),
        message: chance.word(),
        ecard_preview: chance.word(),
        has_sent_you_an_ecard: chance.word(),
        change_ecard: chance.word(),
        email: chance.word(),
        copy_from_above: chance.word(),
        ecard_category: chance.word(),
      },
      eCardInfo: {
        id: chance.natural(),
        lang: chance.word(),
        desc: chance.word(),
        recipient: {
          fullName: chance.word(),
          email: chance.email(),
        },
        sender: {
          fullName: chance.word(),
          email: chance.word(),
        },
        message: chance.word(),
      },
      validationMessages: {
        ecard_required: chance.word(),
        field_required: chance.word(),
        invalid_data: jest.fn(),
        characters_remaining: chance.word(),
      },
      eCardValidation: {
        id: ValidationState.IS_VALID,
        recipient: {
          fullName: chance.word(),
          email: chance.email(),
        },
        sender: {
          fullName: chance.word(),
          email: chance.email(),
        },
      },
      updateECardInfo: jest.fn(),
      changeECard: jest.fn(),
      copyPersonalDetails: jest.fn(),
      hideCopy: false,
    };

    eCardPreview = shallow(<ECardPreview {...testProps}/>);
  });

  it("should should be a div", () => {
    expect(eCardPreview.type()).toEqual("div");
  });

  describe("and its changeECard button", () => {
    let button;

    beforeEach(() => {
      button = eCardPreview.find("button.hollow");
    });

    it("should be a <button>", () => {
      expect(button.type()).toEqual("button");
    });

    it("should change eCard onClick", () => {
      const onClick = button.prop("onClick");
      onClick();
      expect(testProps.changeECard).toHaveBeenCalled();
    });
  });

  describe("and its recipient full name input", () => {
    let nameInput;

    beforeEach(() => {
      nameInput = eCardPreview.find("input#eCard_RecipientName");
    });

    it("should be an <input>", () => {
      expect(nameInput.type()).toEqual("input");
    });

    it("should have onChange prop that calls `updateECardInfo` function", () => {
      const onChange = nameInput.prop("onChange");
      const event = {
        target: {
          value: chance.word(),
        },
      };
      onChange(event);
      expect(testProps.updateECardInfo).toHaveBeenCalled();
    });
  });

  describe("and its recipient email input", () => {
    let emailInput;

    beforeEach(() => {
      emailInput = eCardPreview.find("input#eCard_RecipientEmail");
    });

    it("should be an <input>", () => {
      expect(emailInput.type()).toEqual("input");
    });

    it("should have onChange prop that calls `updateECardInfo` function", () => {
      const onChange = emailInput.prop("onChange");
      const event = {
        target: {
          value: chance.word(),
        },
      };
      onChange(event);
      expect(testProps.updateECardInfo).toHaveBeenCalled();
    });
  });

  describe("and its eCard message textarea", () => {
    let textarea;

    beforeEach(() => {
      textarea = eCardPreview.find("textarea#eCard_Message");
    });

    it("should be an <textarea>", () => {
      expect(textarea.type()).toEqual("textarea");
    });

    it("should have onChange prop that calls `updateECardInfo` function", () => {
      const onChange = textarea.prop("onChange");
      const event = {
        target: {
          value: chance.word(),
        },
      };
      onChange(event);
      expect(testProps.updateECardInfo).toHaveBeenCalled();
    });
  });

  describe("and its cory personal details button", () => {
    let copyDetails;

    beforeEach(() => {
      copyDetails = eCardPreview.find("a#copyPersonalDetailsBtn");
    });

    it("should be an <a>", () => {
      expect(copyDetails.type()).toEqual("a");
    });

    it("should have onClick that copy's personal details", () => {
      const onClick = copyDetails.prop("onClick");
      const event = {
        target: {
          value: chance.word(),
        },
      };
      onClick(event);
      expect(testProps.copyPersonalDetails).toHaveBeenCalled();
    });

    it("should have onKeyDown that calls onEnter", () => {
      const onKeyDown = copyDetails.prop("onKeyDown");
      const event = {
        target: {
          value: chance.word(),
        },
      };
      onKeyDown(event);
      expect(onEnter).toHaveBeenCalled();
    });
  });

  describe("and its sender's full name input", () => {
    let senderNameInput;

    beforeEach(() => {
      senderNameInput = eCardPreview.find("input#eCard_SenderName");
    });

    it("should be an <input>", () => {
      expect(senderNameInput.type()).toEqual("input");
    });

    it("should have onChange prop that calls `updateECardInfo` function", () => {
      const onChange = senderNameInput.prop("onChange");
      const event = {
        target: {
          value: chance.word(),
        },
      };
      onChange(event);
      expect(testProps.updateECardInfo).toHaveBeenCalled();
    });
  });

  describe("and its sender's email input", () => {
    let senderEmailInput;

    beforeEach(() => {
      senderEmailInput = eCardPreview.find("input#eCard_SenderEmail");
    });

    it("should be an <input>", () => {
      expect(senderEmailInput.type()).toEqual("input");
    });

    it("should have onChange prop that calls `updateECardInfo` function", () => {
      const onChange = senderEmailInput.prop("onChange");
      const event = {
        target: {
          value: chance.word(),
        },
      };
      onChange(event);
      expect(testProps.updateECardInfo).toHaveBeenCalled();
    });
  });

});
