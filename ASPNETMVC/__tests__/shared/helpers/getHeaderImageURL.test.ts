import * as Chance from "chance";
import {} from "jest";
import getHeaderImageURL from "../../../src/shared/helpers/getHeaderImageURL";
import { PageInfo } from "../../../src/shared/interfaces";

const chance = new Chance();

const pageInfo: PageInfo = {
  PageID: chance.natural(),
  PageName: chance.word(),
  PageStatus: chance.word(),
  FundID: chance.natural(),
  FundIDFR: chance.natural(),
  FundraisingProgressEnabled: chance.pickone([true, false]),
  AmountRaised: chance.natural(),
  FundraisingGoalAmount: chance.natural(),
  RecentDonationsEnabled: chance.pickone([true, false]),
  RecentDonations: [chance.word(), chance.word(), chance.word()],
  MonthlyGivingEnabled: chance.pickone([true, false]),
  PreferedDonationType: chance.natural(),
  CHOSuggestedDonationEnabled: chance.pickone([true, false]),
  AmountType: chance.natural(),
  AmountLevelsDict:  [],
  MonthlyAmountType: chance.natural(),
  MonthlyAmountLevelsDict: [],
  DesignationEnabled: chance.pickone([true, false]),
  CardRequestEnabled: chance.pickone([true, false]),
  AnonymityPrefEnabled: chance.pickone([true, false]),
  RedirectURL: chance.word(),
  BackgroundImageID: chance.natural(),
  BackgroundProperties: {
    color: chance.word(),
    position: chance.word(),
    tile: chance.word(),
  },
  BrandingProperties: {
    titleBarTextColor: chance.word(),
    titleBarBackgroundColor: chance.word(),
    accentColor: chance.word(),
  },
  BackgroundType: chance.natural(),
  GoogleAnalyticsAccount: chance.word(),
  GoogleTagManagerAccount: chance.word(),
  Heading: chance.word(),
  Description: chance.word(),
  PageType: chance.natural(),
  HeaderImageID: chance.natural(),
  QuestionOne: chance.word(),
  EmbededTitle: chance.word(),
  EmbededDescription: chance.word(),
  EmbededHeaderImage: chance.natural(),
  EmbededHeaderStyle: chance.natural(),
  HideCHOEcards: chance.pickone([true, false]),
 };

describe("helpers/getHeaderImageURL.test.ts", () => {

  it("should return proper url if pageInfo.HeaderImageId is more than 0", () => {
    expect(getHeaderImageURL("en", pageInfo, chance.natural())).toEqual(`/image_ssl.aspx?dnImageID=${pageInfo.HeaderImageID}`);
  });

  it("should return url if pageInfo.HeaderImageId is equal or less than 0 and if language is English", () => {
    pageInfo.HeaderImageID = 0;
    const charityID = chance.natural();

    expect(getHeaderImageURL("en", pageInfo, charityID)).toEqual(`/en/charities/logo/${charityID}/`);
  });

  it("should return url if pageInfo.HeaderImageId is equal or less than 0 and if language is French", () => {
    pageInfo.HeaderImageID = 0;
    const charityID = chance.natural();

    expect(getHeaderImageURL("fr", pageInfo, charityID)).toEqual(`/fr/organismesdebienfaisance/logo/${charityID}/`);
  });
});