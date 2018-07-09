import * as Chance from "chance";
import { shallow } from "enzyme";
import {} from "jest";
import * as React from "react";
import EmailButton from "../../../../../../social_media/components/email/button.js";
import FacebookButton from "../../../../../../social_media/components/facebook/button.js";
import GoogleButton from "../../../../../../social_media/components/google/button.js";
import TwitterButton from "../../../../../../social_media/components/twitter/button.js";
import { SocialButtons } from "../../../../../src/shared/utils/components/SocialButtons/index";

const chance = new Chance();

describe("<SocialButtons\>", () => {
  let socialButtons;
  let testProps;

  beforeEach(() => {
    testProps = {
      url: chance.word(),
      shareText: chance.word(),
      emailSubject: chance.word(),
      emailBody: chance.word(),
      hashtags: [chance.word(), chance.word(), chance.word()]
    };

    socialButtons = shallow(<SocialButtons {...testProps}/>);
  });

  it("should should be a div", () => {
    expect(socialButtons.type()).toEqual("div");
  });

  describe("and its FacebookButton", () => {
    let facebookBtn;

    beforeEach(() => {
      facebookBtn = socialButtons.childAt(0);
    });

    it("should be a FaceBookButton", () => {
      expect(facebookBtn.type()).toEqual(FacebookButton);
    });

    it("should have url as a prop", () => {
      expect(facebookBtn.prop("url")).toEqual(testProps.url);
    });

    it("should have quote as a prop", () => {
      expect(facebookBtn.prop("quote")).toEqual(testProps.shareText);
    });

    it("should have a span as a child", () => {
      const span = facebookBtn.childAt(0);
      expect(span.type()).toEqual("span");
    });
  });

  describe("and its TwitterButton", () => {
    let twitterButton;

    beforeEach(() => {
      twitterButton = socialButtons.childAt(1);
    });

    it("should be a FaceBookButton", () => {
      expect(twitterButton.type()).toEqual(TwitterButton);
    });

    it("should have url as a prop", () => {
      expect(twitterButton.prop("url")).toEqual(testProps.url);
    });

    it("should have text as a prop", () => {
      expect(twitterButton.prop("text")).toEqual(testProps.shareText);
    });

    it("should have a span as a child", () => {
      const span = twitterButton.childAt(0);
      expect(span.type()).toEqual("span");
    });
  });

  describe("and its GoogleButton", () => {
    let googleButton;

    beforeEach(() => {
      googleButton = socialButtons.childAt(2);
    });

    it("should be a FaceBookButton", () => {
      expect(googleButton.type()).toEqual(GoogleButton);
    });

    it("should have url as a prop", () => {
      expect(googleButton.prop("url")).toEqual(testProps.url);
    });

    it("should have a span as a child", () => {
      const span = googleButton.childAt(0);
      expect(span.type()).toEqual("span");
    });
  });

  describe("and its EmailButton", () => {
    let emailButton;

    beforeEach(() => {
      emailButton = socialButtons.childAt(3);
    });

    it("should be a FaceBookButton", () => {
      expect(emailButton.type()).toEqual(EmailButton);
    });

    it("should have subject as a prop", () => {
      expect(emailButton.prop("subject")).toEqual(testProps.emailSubject);
    });

    it("should have body as a prop", () => {
      expect(emailButton.prop("body")).toEqual(testProps.emailBody);
    });

    it("should have a span as a child", () => {
      const span = emailButton.childAt(0);
      expect(span.type()).toEqual("span");
    });
  });

});