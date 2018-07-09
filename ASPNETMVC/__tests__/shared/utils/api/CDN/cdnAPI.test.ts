import * as Chance from "chance";
import "isomorphic-fetch";
import {} from "jest";
import { PageInfo } from "../../../../../src/shared/interfaces/PageInfo";
import { cdnAPIEndpoint, cdnAPILoader } from "../../../../../src/shared/utils/api/CDN/cdnAPI";

const chance = new Chance();

const expectedData = {
  "PageID": chance.natural(),
  "PageName": chance.word(),
  "PageStatus": chance.word(),
  "CharityBN": chance.natural(),
  "CharityDelisted": chance.word(),
  "CharityEmail": chance.email(),
  "CharityFunds": chance.word(),
  "CharityID": chance.word(),
  "CharityName": chance.word(),
  "FundDescription": chance.word(),
  "MissionStatement": chance.word(),
  "FundID": chance.natural(),
  "FundIDFR": chance.natural(),
  "FundraisingProgressEnabled": chance.bool(),
  "AmountRaised": chance.floating(),
  "FundraisingGoalAmount": chance.natural(),
  "RecentDonationsEnabled": chance.bool(),
  "RecentDonations": [],
  "MonthlyGivingEnabled": chance.bool(),
  "PreferedDonationType": chance.natural(),
  "CHOSuggestedDonationEnabled": chance.bool(),
  "AmountType": chance.natural(),
  "AmountLevelsDict": chance.word(),
  "MonthlyAmountType": chance.natural(),
  "MonthlyAmountLevelsDict": {},
  "DesignationEnabled": chance.bool(),
  "CardRequestEnabled": chance.bool(),
  "IsReceiptless": chance.bool(),
  "AnonymityPrefEnabled": chance.bool(),
  "RedirectURL": chance.word(),
  "BackgroundImageID": chance.natural(),
  "BackgroundType": chance.natural(),
  "GoogleAnalyticsAccount": chance.word(),
  "GoogleTagManagerAccount": chance.word(),
  "Heading": chance.word(),
  "Description": chance.word(),
  "PageType": chance.natural(),
  "HeaderImageID": chance.natural(),
  "QuestionOne": chance.word(),
  "EmbededTitle": chance.word(),
  "EmbededDescription": chance.word(),
  "EmbededHeaderImage": chance.natural(),
  "EmbededHeaderStyle": chance.natural(),
  "HideCHOEcards": chance.bool(),
  "BackgroundProperties": '{"color": "pink", "position": "top", "tile": "true"}',
  "BrandingProperties": '{"titleBarTextColor": "green", "titleBarBackgroundColor": "yellow", "accentColor": "white"}',
  "MultiStepHeader": chance.sentence(),
  "FormType": chance.pickone([0, 1]),
};
const pageID = chance.natural();
const lang = chance.pickone(["en", "fr"]);
const expectedFetchRequestURL = `/services/wa/api/donatenowpage/${lang}/${pageID}`;

describe("utils/api/CDN/cdnAPI.test.ts", () => {

  it("should return proper data after successful API call", () => {
    (fetch as any).mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": "",
      },
    });

    return cdnAPILoader(cdnAPIEndpoint.loadPage(lang, pageID)).then(data => {
      expect((fetch as any).mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
      expect(typeof(data)).toEqual("object");

      const charityInfo = {
          CharityName: expectedData.CharityName,
          CharityBN: expectedData.CharityBN,
          CharityEmail: expectedData.CharityEmail,
          CharityFunds: expectedData.CharityFunds,
          CharityID: expectedData.CharityID,
          MissionStatement: expectedData.MissionStatement,
          FundDescription: expectedData.FundDescription,
          CharityDelisted: expectedData.CharityDelisted,
        };
        const pageInfo: PageInfo = {
          PageID: expectedData.PageID,
          PageName: expectedData.PageName,
          PageStatus: expectedData.PageStatus,
          FundID: expectedData.FundID,
          FundIDFR: expectedData.FundIDFR,
          FundraisingProgressEnabled: expectedData.FundraisingProgressEnabled,
          AmountRaised: expectedData.AmountRaised,
          FundraisingGoalAmount: expectedData.FundraisingGoalAmount,
          RecentDonationsEnabled: expectedData.RecentDonationsEnabled,
          RecentDonations: expectedData.RecentDonations,
          MonthlyGivingEnabled: expectedData.MonthlyGivingEnabled,
          PreferedDonationType: expectedData.PreferedDonationType,
          CHOSuggestedDonationEnabled: expectedData.CHOSuggestedDonationEnabled,
          AmountType: expectedData.AmountType,
          AmountLevelsDict: expectedData.AmountLevelsDict || {},
          MonthlyAmountType: expectedData.MonthlyAmountType,
          MonthlyAmountLevelsDict: expectedData.MonthlyAmountLevelsDict || {},
          DesignationEnabled: expectedData.DesignationEnabled,
          CardRequestEnabled: expectedData.CardRequestEnabled,
          AnonymityPrefEnabled: expectedData.AnonymityPrefEnabled,
          IsReceiptless: expectedData.IsReceiptless,
          RedirectURL: expectedData.RedirectURL,
          BackgroundImageID: expectedData.BackgroundImageID,
          BackgroundProperties: JSON.parse(expectedData.BackgroundProperties),
          BrandingProperties: JSON.parse(expectedData.BrandingProperties),
          BackgroundType: expectedData.BackgroundType,
          GoogleAnalyticsAccount: expectedData.GoogleAnalyticsAccount,
          GoogleTagManagerAccount: expectedData.GoogleTagManagerAccount,
          Heading: expectedData.Heading,
          Description: expectedData.Description,
          PageType: expectedData.PageType,
          HeaderImageID: expectedData.HeaderImageID,
          QuestionOne: expectedData.QuestionOne,
          EmbededTitle: expectedData.EmbededTitle,
          EmbededDescription: expectedData.EmbededDescription,
          EmbededHeaderImage: expectedData.EmbededHeaderImage,
          EmbededHeaderStyle: expectedData.EmbededHeaderStyle,
          HideCHOEcards: expectedData.HideCHOEcards,
          FormType: expectedData.FormType,
          MultiStepHeader: expectedData.MultiStepHeader,
        };
        const globalState = {
          pageInfo: pageInfo,
          charityInfo: charityInfo,
        };

        expect(data).toEqual(globalState);
    });
  });

  it("should set Response.ok to false after bad API call", () => {
    const fakeException = JSON.stringify("Unable to complete your request");
    const fakeStatus = {
      status: 400,
      statusText: "Bad Request",
    };

    fetch.mockResponse(fakeException, fakeStatus);

    return cdnAPILoader(cdnAPIEndpoint.loadPage(lang, pageID)).catch(e => {
      expect(e.ok).toEqual(false);
    });
  });

});
