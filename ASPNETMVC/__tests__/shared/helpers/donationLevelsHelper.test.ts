import * as Chance from "chance";
import {} from "jest";
import { DonationFrequency } from "../../../src/shared/constants/Donations";
import { getDonationLevels, getDonationLevelsText } from "../../../src/shared/helpers/donationLevelsHelper";
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
    AmountLevelsDict:  [chance.word(), chance.word(), chance.word(), chance.word()],
    MonthlyAmountType: chance.natural(),
    MonthlyAmountLevelsDict: [chance.word(), chance.word()],
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

describe("helpers/donationLevelsHelper.test.ts", () => {

  describe("its getDonationLevelsText", () => {

    it("should return pageInfo.MonthlyAmountLevelsDict when donation frequency is set to monthly", () => {
      expect(getDonationLevelsText(DonationFrequency.monthly, pageInfo)).toEqual(pageInfo.MonthlyAmountLevelsDict);
    });

    it("should return pageInfo.MonthlyAmountLevelsDict when donation frequency is set to oneTime", () => {
      expect(getDonationLevelsText(DonationFrequency.oneTime, pageInfo)).toEqual(pageInfo.AmountLevelsDict);
    });

    it("should return empty object when donation frequency is not set to oneTime or monthly", () => {
      expect(getDonationLevelsText(chance.word(), pageInfo)).toEqual({});
    });
  });

  describe("its getDonationLevels", () => {

    it("should return array of numbers when donation frequency is set to monthly", () => {
      expect(getDonationLevels(DonationFrequency.monthly, pageInfo)).toEqual([0, 1]);
    });

    it("should return array of numbers when donation frequency is not set to monthly", () => {
      expect(getDonationLevels(DonationFrequency.oneTime, pageInfo)).toEqual([0, 1, 2, 3]);
    });

  });
});