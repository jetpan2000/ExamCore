import * as Chance from "chance";
import { shallow } from "enzyme";
import {} from "jest";
import * as React from "react";
import { validationMessages } from "../../../../src/shared/localization/validationMessages";
import { ECardPreview } from "../../../../src/shared/utils/ECardWidget/ECardPreview.React";
import { ECardSelector } from "../../../../src/shared/utils/ECardWidget/ECardSelector.React";
import { ECardWidgetProps } from "../../../../src/shared/utils/ECardWidget/ECardWidget.React";
import { ECardWidget } from "../../../../src/shared/utils/ECardWidget/index";
import {
  ECardAppText,
  ECardInfo,
  ECardPage,
  ECardValidation,
  ECardValidationMessages,
} from "../../../../src/shared/utils/ECardWidget/models";
import { isPristineOrValid } from "../../../../src/shared/utils/index";
import { ValidationState } from "../../../../src/shared/utils/validate";

const chance = new Chance();

describe("<ECardWidget\>", () => {
  let eCardWidget;
  let testProps: ECardWidgetProps;
  let validationMessages: ECardValidationMessages;
  let localeText: ECardAppText;
  let eCardInfo: ECardInfo;
  let eCardValidation: ECardValidation;

  beforeEach(() => {
    validationMessages = {
      ecard_required: chance.word(),
      field_required: chance.word(),
      invalid_data: chance.word(),
      characters_remaining: chance.word(),
    };
    localeText = {
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
    };
    eCardInfo = {
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
    };
    eCardValidation = {
      id: ValidationState.IS_VALID,
      recipient: {
        fullName: chance.word(),
        email: chance.email(),
      },
      sender: {
        fullName: chance.word(),
        email: chance.email(),
      },
    };

    testProps = {
      lang: chance.pickone(["en", "fr"]),
      pageId: chance.natural(),
      localeText: localeText,
      validationMessages: validationMessages,
      eCardInfo: eCardInfo,
      eCardValidation: eCardValidation,
      updateECardInfo: jest.fn(),
      copyPersonalDetails: jest.fn(),
      hideCopy: false,
    };

    eCardWidget = shallow(<ECardWidget {...testProps}/>);
  });

  it("should should be a div", () => {
    expect(eCardWidget.type()).toEqual("div");
  });

  it("should have state", () => {
    const initialState = eCardWidget.instance().state.page;
    expect(initialState).toEqual(ECardPage.ECARD_PREVIEW);
  });

  describe("and its ECardPreview", () => {
    let eCardPreview;

    beforeEach(() => {
      eCardPreview = eCardWidget.childAt(0);
    });

    it("should be ECardPreview", () => {
      expect(eCardPreview.type()).toEqual(ECardPreview);
    });

    it("should have `goToPreview` as props that changes the state", () => {
      const initialState = eCardWidget.instance().state.page;
      const changeECard = eCardPreview.prop("changeECard");
      changeECard();
      const updatedState = eCardWidget.instance().state.page;
      expect(updatedState).toEqual(ECardPage.ECARD_SELECTOR);
      expect(updatedState !== initialState).toBeTruthy();
    });

    it("should have `hidden` as props that depends on the state", () => {
      expect(eCardPreview.prop("hidden")).toEqual(false);
      eCardWidget.setState({page: ECardPage.ECARD_SELECTOR});
      eCardPreview = eCardWidget.childAt(0);
      expect(eCardPreview.prop("hidden")).toEqual(true);
    });

    it("should have `text` as props", () => {
      expect(eCardPreview.prop("text")).toEqual(testProps.localeText);
    });

    it("should have `validationMessages` as props", () => {
      expect(eCardPreview.prop("validationMessages")).toEqual(testProps.validationMessages);
    });

    it("should have `eCardInfo` as props", () => {
      expect(eCardPreview.prop("eCardInfo")).toEqual(testProps.eCardInfo);
    });

    it("should have `eCardValidation` as props", () => {
      expect(eCardPreview.prop("eCardValidation")).toEqual(testProps.eCardValidation);
    });

    it("should have `updateECardInfo` as props", () => {
      expect(eCardPreview.prop("updateECardInfo")).toEqual(testProps.updateECardInfo);
    });

    it("should have `copyPersonalDetails` as props", () => {
      const copyPersonalDetails = eCardPreview.prop("copyPersonalDetails");
      copyPersonalDetails();
      expect(testProps.copyPersonalDetails).toHaveBeenCalled();
    });
  });

  describe("and its ECardSelector", () => {
    let eCardSelector;

    beforeEach(() => {
      eCardSelector = eCardWidget.childAt(1);
    });

    it("should be ECardSelector", () => {
      expect(eCardSelector.type()).toEqual(ECardSelector);
    });

    it("should have `validationMessages` as props", () => {
      expect(eCardSelector.prop("validationMessages")).toEqual(testProps.validationMessages);
    });

    it("should have `goToPreview` as props that changes the state", () => {
      eCardWidget.setState({page: ECardPage.ECARD_SELECTOR});
      const goToPreview = eCardSelector.prop("goToPreview");
      goToPreview();
      const updatedState = eCardWidget.instance().state.page;
      expect(updatedState).toEqual(ECardPage.ECARD_PREVIEW);
    });

    it("should have `hidden` as props that depends on the state", () => {
      expect(eCardSelector.prop("hidden")).toEqual(true);
      eCardWidget.setState({page: ECardPage.ECARD_SELECTOR});
      eCardSelector = eCardWidget.childAt(1);
      expect(eCardSelector.prop("hidden")).toEqual(false);
    });

    it("should have `lang` as props", () => {
      expect(eCardSelector.prop("lang")).toEqual(testProps.lang);
    });

    it("should have `pageId` as props", () => {
      expect(eCardSelector.prop("pageId")).toEqual(testProps.pageId);
    });

    it("should have `updateECardInfo` as props", () => {
      expect(eCardSelector.prop("updateECardInfo")).toEqual(testProps.updateECardInfo);
    });

    it("should have `showError` as props", () => {
      expect(eCardSelector.prop("showError")).toEqual(!isPristineOrValid(testProps.eCardValidation.id));
    });
  });

});
