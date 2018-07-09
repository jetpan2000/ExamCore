import * as Chance from "chance";
import {} from "jest";
import { DonationFrequency, FrequencyType } from "../../../src/shared/constants/Donations";
import { ResponseErrorType } from "../../../src/shared/constants/ErrorCode";
import { Pages } from "../../../src/shared/constants/Pages";
import { DonorType } from "../../../src/shared/constants/User";
import { Address, AppText, CharityFunds, CharityInfo, CHDonation, DonationInfo, DonationResponse, Localization, MonthlyOptions, PageInfo, PageState, UserInfo } from "../../../src/shared/interfaces/";
import { TerminationType } from "../../../src/shared/utils/api/CDN/PostDonation/models/index";
import { getDataLayer, getOrderID, getTransactionTotal } from "../../../src/shared/utils/getDataLayer";
import { ValidationState } from "../../../src/shared/utils/validate";

import { FormTypes } from "../../../src/shared/constants/FormType";
import { getDonationSource, sourceAddons } from "../../../src/shared/helpers/donationSourceHelper";
import { isEmbedded } from "../../../src/shared/utils/isEmbedded";
import { isMobile } from "../../../src/shared/utils/isMobile";

let isEmbededValue = false;
let isMobileValue = false;

jest.mock("../../../src/shared/utils/isEmbedded");
(isEmbedded as any).mockImplementation(() => isEmbededValue);

jest.mock("../../../src/shared/utils/isMobile");
(isMobile as any).mockImplementation(() => isMobileValue);

const chance = new Chance();
(window as any).ga = jest.fn();

describe("utils/getDataLayer.test.ts", () => {
  let charityInfo: CharityInfo;
  let funds: CharityFunds;
  let monthlyOptions: MonthlyOptions;
  let chDonation: CHDonation;
  let donationInfo: DonationInfo;
  let userInfo: UserInfo;
  let address: Address;
  let pageInfo: PageInfo;
  let donationResponse: DonationResponse;
  let locale: Localization;
  let pageState: PageState;

  beforeEach(() => {

    charityInfo = {
      CharityID: chance.natural(),
      CharityName: chance.word(),
      CharityEmail: chance.word(),
      CharityBN: chance.word(),
      MissionStatement: chance.word(),
      FundDescription: chance.word(),
      CharityFunds: [],
      CharityDelisted: chance.pickone([true, false]),
    };

    funds = [
      {
        FundID: chance.natural(),
        FundDescription: chance.natural(),
        FundDetails: chance.word(),
        DefaultFund: false,
      },
      {
        FundID: chance.natural(),
        FundDescription: chance.natural(),
        FundDetails: chance.word(),
        DefaultFund: true,
      },
      {
        FundID: chance.natural(),
        FundDescription: chance.natural(),
        FundDetails: chance.word(),
        DefaultFund: false,
      },
    ];

    monthlyOptions = {
      terminationType: TerminationType.NONE,
      processImmediately: chance.pickone([true, false]),
      startDate: chance.word(),
      endDate: chance.word(),
      count: chance.natural(),
    };

    chDonation = {
      amount: chance.natural(),
      addDonation: chance.pickone([true, false]),
    };

    donationInfo = {
      amount: chance.natural(),
      frequency: DonationFrequency.oneTime,
      frequencyType: FrequencyType.BOTH,
      monthlyOptions: monthlyOptions,
      fund: chance.natural(),
      message: chance.word(),
      anonymous: chance.pickone([true, false]),
      canadaHelpsDonation: chDonation,
      appVersion: chance.word(),
      persistExpire: chance.word(),
      answerOne: chance.word(),
      _validation: {
        amount: ValidationState.IS_VALID,
        canadaHelpsDonation: {
          amount: ValidationState.IS_VALID,
        },
        monthlyOptions: {
          startDate: ValidationState.IS_VALID,
          endDate: ValidationState.IS_VALID,
          count: ValidationState.IS_VALID,
        },
      },
    };

    address = {
      LineOne: chance.word(),
      LineTwo: chance.word(),
      City: chance.word(),
      ProvinceCode: chance.word(),
      ProvinceOther: chance.word(),
      Country: chance.word(),
      PostalCode: chance.word(),
    };

    userInfo = {
      FirstName: chance.word(),
      LastName: chance.word(),
      EmailAddress: chance.word(),
      SavedPaymentMethods: [],
      DonorType: DonorType.personal,
      Address: address,
      CompanyName: chance.word(),
      appVersion: chance.word(),
      persistExpire: chance.word(),
      _validation: {
        FirstName: ValidationState.IS_VALID,
        LastName: ValidationState.IS_VALID,
        EmailAddress: ValidationState.IS_VALID,
        CompanyName: ValidationState.IS_VALID,
        Address: {
          LineOne: ValidationState.IS_VALID,
          City: ValidationState.IS_VALID,
          ProvinceCode: ValidationState.IS_VALID,
          ProvinceOther: ValidationState.IS_VALID,
          Country: ValidationState.IS_VALID,
          PostalCode: ValidationState.IS_VALID,
        },
      },
    };

    donationResponse = {
      errorCode: chance.word(),
      mgOrderID: chance.word(),
      orderID: chance.word(),
      action: chance.word(),
      label: chance.word(),
      errorMessage: chance.word(),
      requestSent: chance.pickone([true, false]),
      error: ResponseErrorType.CREDIT,
      taxReceipt: chance.pickone([true, false]),
      stateDetails: {
        donationInfo: donationInfo,
        userInfo: userInfo,
      },
    };

    locale = {
      text: {} as AppText,
      lang: chance.pickone(["en", "fr"]),
    };

    pageInfo = {
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
      AmountLevelsDict: { key: chance.word() },
      MonthlyAmountType: chance.natural(),
      MonthlyAmountLevelsDict: { key: chance.word() },
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
      MultiStepHeader: chance.word(),
      FormType: chance.pickone([0, 1]),
    };

    pageState = {
      pageType: FormTypes.FULLFORM,
      loggedIn: chance.pickone([true, false]),
      donorLoggedIn: chance.pickone([true, false]),
      forceEdit: chance.pickone([true, false]),
      editingUserInfo: chance.pickone([true, false]),
      editingUserInfoLoader: chance.pickone([true, false]),
      descriptionExpanded: chance.pickone([true, false]),
      showAdvancedMonthly: chance.pickone([true, false]),
      displayPage: Pages.FULL_FORM,
      attemptedDonationSubmit: chance.pickone([true, false]),
      attemptedPaymentSubmit: chance.pickone([true, false]),
      showFrequencyLink: chance.pickone([true, false]),
      failedSections: [chance.word(), chance.word(), chance.word()],
      showRedirectMessage: chance.pickone([true, false]),
      failedSubmit: {
        responseObject: donationResponse,
      },
    };

    (window as any).dataLayer = [];
  });
  it("expect getDataLayer to push to window.dataLayer a new object when there is no pageInfo.GoogleAnalyticsAccount and no pageInfo.GoogleTagManagerAccount passed", () => {
    const transationTotal = chDonation.addDonation ? donationInfo.amount + donationInfo.canadaHelpsDonation.amount : donationInfo.amount;
    const expectedObject = [
      { eventCategory: "DONATION",
        eventAction: donationResponse.action,
        eventLabel: donationResponse.label,
      },
      { event: "ch.donationCompleteGAEvent" },
      { transactionId: `${donationResponse.orderID}`,
        transactionAffiliation: `language code (${locale.lang})`,
        transactionTotal: transationTotal,
        transactionProducts: [{
          id: getOrderID(donationResponse.stateDetails.donationInfo.frequency, donationResponse),
          sku: `${charityInfo.CharityID}`,
          name: `${charityInfo.CharityName}`,
          category: getDonationSource(donationResponse.stateDetails.donationInfo),
          price: `${donationResponse.stateDetails.donationInfo.amount}`,
          quantity: 1,
        }] },
      { event: "ch.donationComplete" },
    ];
    pageInfo.GoogleAnalyticsAccount = null;
    pageInfo.GoogleTagManagerAccount = null;

    getDataLayer(charityInfo, pageInfo, pageState, locale, donationResponse);
    expect((window as any).dataLayer).toEqual(expectedObject);
  });

  it("expect getDataLayer to push to window.dataLayer a new object when there pageInfo.GoogleAnalyticsAccount and pageInfo.GoogleTagManagerAccount exist", () => {
    const transationTotal = chDonation.addDonation ? donationInfo.amount + donationInfo.canadaHelpsDonation.amount : donationInfo.amount;
    const expectedObject = [
      { eventCategory: "DONATION",
        eventAction: donationResponse.action,
        eventLabel: donationResponse.label,
      },
      { event: "ch.donationCompleteGAEvent" },
      { transactionId: `${donationResponse.orderID}`,
        transactionAffiliation: `language code (${locale.lang})`,
        transactionTotal: transationTotal,
        transactionProducts: [{
          id: getOrderID(donationResponse.stateDetails.donationInfo.frequency, donationResponse),
          sku: `${charityInfo.CharityID}`,
          name: `${charityInfo.CharityName}`,
          category: getDonationSource(donationResponse.stateDetails.donationInfo),
          price: `${donationResponse.stateDetails.donationInfo.amount}`,
          quantity: 1,
        }] },
      { event: "ch.donationComplete" },
    ];
    pageInfo.GoogleTagManagerAccount = null;

    getDataLayer(charityInfo, pageInfo, pageState, locale, donationResponse);
    expect((window as any).dataLayer).toEqual(expectedObject);
    expect((window as any).ga).toHaveBeenCalled();
    expect((window as any).ga).toHaveBeenCalledTimes(3);
  });

  it("expect getTransactionTotal to return donationInfo.amount when donationInfo.canadaHelpsDonation.addDonation is set to false", () => {
    donationInfo.canadaHelpsDonation.addDonation = false;
    const amount = getTransactionTotal(donationResponse);

    expect(amount).toEqual(donationInfo.amount);
  });

  it("expect getTransactionTotal to return the sum of donationInfo.amount and donationInfo.canadaHelpsDonation.amount when donationInfo.canadaHelpsDonation.addDonation is set to tru", () => {
    donationInfo.canadaHelpsDonation.addDonation = true;
    const amount = getTransactionTotal(donationResponse);

    expect(amount).toEqual(donationInfo.amount + donationInfo.canadaHelpsDonation.amount);
  });

  describe("its getDonationSource ", () => {
    let expectedSource;

    beforeEach(() => {
      expectedSource = "DONATE_NOW_CUSTOM";
    });

    it('should return "DONATE_NOW_CUSTOM" if isEmbeded, isMobile, donationInfo.canadaHelpsDonation.addDonation are false and donationInfo.frequency is not equal to DonationFrequency.monthly', () => {
      chDonation.addDonation = false;
      const source = getDonationSource(donationResponse.stateDetails.donationInfo);

      expect(source).toEqual(expectedSource);
    });

    it('should return "DONATE_NOW_CUSTOM_SUGGESTED_CHO_DONATION" if isEmbeded, isMobile are false, donationInfo.frequency is not equal to DonationFrequency.monthly and donationInfo.canadaHelpsDonation.addDonation is set to true', () => {
      chDonation.addDonation = true;
      const source = getDonationSource(donationResponse.stateDetails.donationInfo);

      expect(source).toEqual(`${expectedSource}${sourceAddons.suggestedCHODonation}`);
    });

    it('should return "DONATE_NOW_CUSTOM_EMBEDED" if isMobile, donationInfo.canadaHelpsDonation.addDonation are false, donationInfo.frequency is not equal to DonationFrequency.monthly and isEmbeded is set to true', () => {
      isEmbededValue = false;
      chDonation.addDonation = false;
      donationInfo.frequency = DonationFrequency.monthly;
      const source = getDonationSource(donationResponse.stateDetails.donationInfo);

      expect(source).toEqual(`${expectedSource}${sourceAddons.scheduledGiving}`);
    });

    it('should return "DONATE_NOW_CUSTOM_MOBILE" if isEmbeded, donationInfo.canadaHelpsDonation.addDonation are false, donationInfo.frequency is not equal to DonationFrequency.monthly and isMobile is set to true', () => {
      isMobileValue = true;
      isEmbededValue = false;
      chDonation.addDonation = false;
      const source = getDonationSource(donationResponse.stateDetails.donationInfo);

      expect(source).toEqual(`${expectedSource}${sourceAddons.mobile}`);
    });

    it('should return "DONATE_NOW_CUSTOM_MOBILE" if isEmbeded, isMobile, donationInfo.canadaHelpsDonation.addDonation are false and donationInfo.frequency is equal to DonationFrequency.monthly', () => {
      isMobileValue = false;
      isEmbededValue = false;
      chDonation.addDonation = false;
      donationInfo.frequency = DonationFrequency.monthly;
      const source = getDonationSource(donationResponse.stateDetails.donationInfo);

      expect(source).toEqual(`${expectedSource}${sourceAddons.scheduledGiving}`);
    });
  });

  describe("its getOrderID", () => {
    it("should donationResponse.orderID when donationInfo.frequency is not equal to DonationFrequency.monthly", () => {
      expect(getOrderID(DonationFrequency.oneTime, donationResponse)).toEqual(donationResponse.orderID);
    });

    it("should donationResponse.mgOrderID when donationInfo.frequency is equal to DonationFrequency.monthly", () => {
      expect(getOrderID(DonationFrequency.monthly, donationResponse)).toEqual(donationResponse.mgOrderID);
    });
  });

});
