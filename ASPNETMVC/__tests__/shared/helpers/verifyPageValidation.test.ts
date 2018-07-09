import * as Chance from "chance";
import {} from "jest";
import { DedicationSendType, DedicationTypes } from "../../../src/shared/constants/Dedications";
import { DonationFrequency, FrequencyType } from "../../../src/shared/constants/Donations";
import { Pages } from "../../../src/shared/constants/Pages";
import { CardType, PaymentMethod } from "../../../src/shared/constants/Payment";
import { DonorType } from "../../../src/shared/constants/User";
import { verifyCreditCardInfo, verifyMultiStepPage, verifyPage } from "../../../src/shared/helpers/verifyPageValidation";
import { CharityInfo, DedicationInfo, DonationInfo, GlobalState, Localization, PageInfo, PageState, PaymentInfo, UserInfo } from "../../../src/shared/interfaces";
import { TerminationType } from "../../../src/shared/utils/api/CDN/PostDonation/models/index";
import { PaypalStage } from "../../../src/shared/utils/api/CDN/PostDonation/models/paypal";
import { ValidationState } from "../../../src/shared/utils/validate";

const chance = new Chance();

const anonimous = chance.pickone([true, false]);
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
const charityInfo: CharityInfo = {
  CharityID: chance.natural(),
  CharityName: chance.word(),
  CharityEmail: chance.email(),
  CharityBN: chance.word(),
  MissionStatement: chance.word(),
  FundDescription: chance.word(),
  CharityFunds: [{
    FundID: chance.natural(),
    FundDescription: chance.natural(),
    FundDetails: chance.word(),
    DefaultFund: chance.pickone([true, false]),
  }],
  CharityDelisted: chance.pickone([true, false]),
};
const currentPageState: PageState = {
  donorLoggedIn: chance.pickone([true, false]),
  loggedIn: chance.pickone([true, false]),
  forceEdit: chance.pickone([true, false]),
  editingUserInfo: false,
  attemptedDonationSubmit: chance.pickone([true, false]),
  attemptedPaymentSubmit: chance.pickone([true, false]),
  editingUserInfoLoader: chance.pickone([true, false]),
  descriptionExpanded: chance.pickone([true, false]),
  showAdvancedMonthly: chance.pickone([true, false]),
  displayPage: Pages,
  failedSections: [chance.word(), chance.word(), chance.word()],
  failedSubmit: {
    responseObject: {
      errorCode: chance.word(),
      mgOrderID: chance.word(),
      orderID: chance.word(),
      action: chance.word(),
      label: chance.word(),
      errorMessage: chance.word(),
      requestSent: chance.pickone([true, false]),
      error: 0,
      taxReceipt: chance.pickone([true, false]),
      stateDetails: {
        donationInfo: {
          amount: chance.natural(),
          frequency: DonationFrequency,
          frequencyType: FrequencyType,
          monthlyOptions: {
            terminationType: TerminationType,
            processImmediately: chance.pickone([true, false]),
            startDate: chance.word(),
            endDate: chance.word(),
            count: chance.natural(),
          },
          fund: chance.natural(),
          message: chance.word(),
          anonymous: chance.pickone([true, false]),
          canadaHelpsDonation: {
            amount: chance.natural(),
            addDonation: chance.pickone([true, false]),
          },
          appVersion: chance.word(),
          persistExpire: chance.word(),
          answerOne: chance.word(),
          _validation: {
            amount: ValidationState,
            canadaHelpsDonation: {
              amount: ValidationState,
            },
            monthlyOptions: {
              startDate: ValidationState,
              endDate: ValidationState,
              count: ValidationState,
            },
          },
        },
        userInfo: {
          FirstName: chance.word(),
          LastName: chance.word(),
          EmailAddress: chance.word(),
          SavedPaymentMethods: [{
            cardHolderName: chance.word(),
            ccCardType: CardType.visa,
            ccDigits: chance.word(),
            ccExpYear: chance.word(),
            ccExpMonth: chance.word(),
            saveCCOnFile: chance.pickone([true, false]),
          }],
          DonorType: DonorType.personal,
          Address: {
            LineTwo: chance.word(),
            City: chance.word(),
            ProvinceCode: chance.word(),
            ProvinceOther: chance.word(),
            Country: chance.word(),
            PostalCode: chance.word(),
          },
          CompanyName: chance.word(),
          appVersion: chance.word(),
          persistExpire: chance.word(),
          _validation: {
            FirstName: ValidationState,
            LastName: ValidationState,
            EmailAddress: ValidationState,
            CompanyName: ValidationState,
            Address: {
              LineOne: ValidationState,
              City: ValidationState,
              ProvinceCode: ValidationState,
              ProvinceOther: ValidationState,
              Country: ValidationState,
              PostalCode: ValidationState,
            },
          },
        },
      },
    },
  },
  defaultDonation: {
    onetime: chance.pickone([chance.natural({min: 3, max: 10}), null]),
    monthly: chance.pickone([chance.natural({min: 3, max: 10}), null]),
  },
  showRedirectMessage: chance.pickone([true, false]),
  showFrequencyLink: chance.pickone([true, false]),
};
const localization: Localization = {
  text: {
    header_donor_tax_info: "donor info",
    header_donation_details: "donation info",
    header_dedication_information: "dedication info",
    header_payment_info: "payment info",
  },
  lang: chance.pickone(["en", "fr"]),
};
const donationInfo: DonationInfo = {
  amount: chance.natural(),
  frequency: chance.pickone([DonationFrequency.monthly, DonationFrequency.oneTime]),
  frequencyType: FrequencyType.BOTH,
  monthlyOptions: {
    terminationType: TerminationType.NONE,
    processImmediately: chance.pickone([true, false]),
    startDate: chance.date({string: true, american: false}),
    endDate: chance.date({string: true, american: false}),
    count: chance.natural(),
  },
  fund: chance.natural(),
  message: chance.word(),
  anonymous: anonimous,
  canadaHelpsDonation: {
    amount: chance.natural(),
    addDonation: true,
  },
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
const dedicationInfo: DedicationInfo = {
  dedication: DedicationTypes.NO_DEDICATION,
  dedicationSendType: DedicationSendType.CHARITY_SEND_POSTCARD,
  honoreeName: chance.word(),
  eCardInfo: {
    id: chance.natural(),
    lang: chance.pickone(["en", "fr"]),
    desc: chance.word(),
    recipient: {
      fullName: chance.word(),
      email: chance.email(),
    },
    sender: {
      fullName: chance.word(),
      email: chance.email(),
    },
    message: chance.word(),
  },
  postCardInfo: {
    address: {
      lineOne: chance.word(),
      lineTwo: chance.word(),
      city: chance.word(),
      country: "CA",
      province: chance.word(),
      provinceOther: chance.word(),
      postalCode: chance.word(),
    },
    firstName: chance.word(),
    lastName: chance.word(),
    signature: chance.word(),
    message: chance.word(),
  },
  appVersion: chance.word(),
  persistExpire: chance.word(),
  _validation: {
    honoreeName: ValidationState.IS_VALID,
    eCardInfo: {
      id: ValidationState.IS_VALID,
      recipient: {
        fullName: ValidationState.IS_VALID,
        email: ValidationState.IS_VALID,
      },
      sender: {
        fullName: ValidationState.IS_VALID,
        email: ValidationState.IS_VALID,
      },
    },
    postCardInfo: {
      address: {
        lineOne: ValidationState.IS_VALID,
        city: ValidationState.IS_VALID,
        country: ValidationState.IS_VALID,
        province: ValidationState.IS_VALID,
        provinceOther: ValidationState.IS_VALID,
        postalCode: ValidationState.IS_VALID,
      },
      firstName: ValidationState.IS_VALID,
      lastName: ValidationState.IS_VALID,
    },
  },
};
const paymentInfo: PaymentInfo = {
  paymentMethod: PaymentMethod.CREDIT,
  paymentDetails: {
    credit: {
      cardholderName: chance.word(),
      cardNumber: chance.word(),
      expiryMonth: chance.word(),
      expiryYear: chance.word(),
      cvn: chance.word(),
      ccDirty: true,
    },
    paypal: {
      CID: chance.word(),
      Token: chance.word(),
      PayerID: chance.word(),
      stage: PaypalStage.INITIAL,
    },
    giftCard: {
      cardNumber: chance.word(),
      cardAmount: chance.natural(),
      cardBalance: chance.natural(),
      notifySenderOfCharityChoice: chance.pickone([true, false]),
    },
  },
  _validation: {
    paymentDetails: {
      credit: {
        cardholderName: ValidationState.IS_VALID,
        cardNumber: ValidationState.IS_VALID,
        expiryMonth: ValidationState.IS_VALID,
        expiryYear: ValidationState.IS_VALID,
        cvn: ValidationState.IS_VALID,
      },
      giftCard: {
        cardNumber: ValidationState.IS_VALID,
      },
    },
  },
};
const userInfo: UserInfo = {
  FirstName: chance.word(),
  LastName: chance.word(),
  EmailAddress: chance.word(),
  SavedPaymentMethods: [{
    cardHolderName: chance.word(),
    ccCardType: CardType.visa,
    ccDigits: chance.word(),
    ccExpYear: chance.word(),
    ccExpMonth: chance.word(),
    saveCCOnFile: chance.pickone([true, false]),
  }],
  DonorType: DonorType.personal,
  Address: {
    LineTwo: chance.word(),
    City: chance.word(),
    ProvinceCode: chance.word(),
    ProvinceOther: chance.word(),
    Country: "CA",
    PostalCode: chance.word(),
  },
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
const globalState: GlobalState = {
  charityInfo: charityInfo,
  pageInfo: pageInfo,
  currentPageState: currentPageState,
  localization: localization,
  donationInfo: donationInfo,
  dedicationInfo: dedicationInfo,
  paymentInfo: paymentInfo,
  userInfo: userInfo,
  donationResponse: {},
};

const creditCardValidation = {
  cardholderName: ValidationState.IS_VALID,
  cardNumber: ValidationState.IS_VALID,
  expiryMonth: ValidationState.IS_VALID,
  expiryYear: ValidationState.IS_VALID,
  cvn: ValidationState.IS_VALID,
};

describe("helpers/verifyPageValidation.test.ts", () => {

  describe("and its verifyPage", () => {
    it("should return valid object when the state passes the validation and donor type is personal", () => {
      const expectedResponse = {
        valid: true,
        failedSections: [],
      };
      globalState.paymentInfo.paymentMethod = PaymentMethod.PAYPAL;
      expect(verifyPage(globalState)).toEqual(expectedResponse);
    });

    it("should return valid object when the state passes the validation and donor type is company and dedication type is IN_HONOUR_OF", () => {
      const expectedResponse = {
        valid: true,
        failedSections: [],
      };
      globalState.userInfo.DonorType = DonorType.company;
      globalState.dedicationInfo.dedication = DedicationTypes.IN_HONOR_OF;
      globalState.dedicationInfo.dedicationSendType = DedicationSendType.SEND_ECARD_MYSELF;
      expect(verifyPage(globalState)).toEqual(expectedResponse);
    });

    it("should return valid object when the state passes the validation and donor's country is not Canada and dedication type is IN_HONOUR_OF", () => {
      const expectedResponse = {
        valid: true,
        failedSections: [],
      };
      globalState.userInfo.Address.Country = chance.word();
      globalState.donationInfo.canadaHelpsDonation.addDonation = false;
      globalState.donationInfo.frequency = DonationFrequency.oneTime;
      globalState.dedicationInfo.dedication = DedicationTypes.IN_HONOR_OF;
      globalState.dedicationInfo.dedicationSendType = DedicationSendType.CHARITY_SEND_POSTCARD;
      expect(verifyPage(globalState)).toEqual(expectedResponse);
    });

    it("should return invalid object when the userInfo does not pass the validation", () => {
      const expectedResponse = {
        valid: false,
        failedSections: [globalState.localization.text.header_donor_tax_info],
      };
      globalState.userInfo._validation.EmailAddress = ValidationState.IS_INVALID;
      globalState.dedicationInfo.dedication = DedicationTypes.IN_HONOR_OF;
      globalState.dedicationInfo.dedicationSendType = DedicationSendType.CHARITY_SEND_POSTCARD;
      globalState.dedicationInfo.postCardInfo.address.country = chance.word();
      expect(verifyPage(globalState)).toEqual(expectedResponse);
    });

    it("should return invalid object when the donationInfo does not pass the validation", () => {
      const expectedResponse = {
        valid: false,
        failedSections: [globalState.localization.text.header_donation_details],
      };
      globalState.userInfo._validation.EmailAddress = ValidationState.IS_VALID;
      globalState.donationInfo._validation.amount = ValidationState.IS_INVALID;
      globalState.currentPageState.defaultDonation.monthly = null;
      globalState.currentPageState.defaultDonation.onetime = null;
      expect(verifyPage(globalState)).toEqual(expectedResponse);
    });

    it("should return invalid object when the dedicationInfo does not pass the validation", () => {
      const expectedResponse = {
        valid: false,
        failedSections: [globalState.localization.text.header_dedication_information],
      };
      globalState.donationInfo._validation.amount = ValidationState.IS_VALID;
      globalState.dedicationInfo.dedication = DedicationTypes.IN_HONOR_OF;
      globalState.dedicationInfo.dedicationSendType = DedicationSendType.NOTIFY_MYSELF;
      globalState.dedicationInfo._validation.honoreeName = ValidationState.IS_INVALID;
      expect(verifyPage(globalState)).toEqual(expectedResponse);
    });

    it("should return invalid object when the paymentInfo does not pass the validation", () => {
      const expectedResponse = {
        valid: false,
        failedSections: [globalState.localization.text.header_payment_info],
      };
      globalState.dedicationInfo._validation.honoreeName = ValidationState.IS_VALID;
      globalState.paymentInfo.paymentMethod = PaymentMethod.CREDIT;
      globalState.paymentInfo._validation.paymentDetails.credit.cardNumber = ValidationState.IS_INVALID;
      expect(verifyPage(globalState)).toEqual(expectedResponse);
    });

    it("should return invalid object when payment method is GIFTCARD and giftcard's balance is less than amount provided by donor", () => {
      const expectedResponse = {
        valid: false,
        failedSections: [globalState.localization.text.header_payment_info],
      };
      globalState.paymentInfo._validation.paymentDetails.credit.cardNumber = ValidationState.IS_VALID;
      globalState.paymentInfo.paymentMethod = PaymentMethod.GIFTCARD;
      globalState.paymentInfo.paymentDetails.giftCard.cardBalance = 100;
      globalState.donationInfo.amount = 1000;
      expect(verifyPage(globalState)).toEqual(expectedResponse);
    });
    it("should return valid if the donation amount is not set but default donation is set", () => {
      const expectedResponse = {
        valid: true,
        failedSections: [],
      };
      globalState.paymentInfo.paymentDetails.giftCard.cardBalance = 10;
      globalState.donationInfo.frequency = chance.pickone([DonationFrequency.monthly, DonationFrequency.oneTime]);
      globalState.donationInfo.amount = null;
      globalState.donationInfo._validation.amount = ValidationState.IS_PRISTINE;
      globalState.currentPageState.defaultDonation.monthly = chance.natural({min: 3, max: 10});
      globalState.currentPageState.defaultDonation.onetime = chance.natural({min: 3, max: 10});
      expect(verifyPage(globalState)).toEqual(expectedResponse);
    });
  });

  describe("and its verifyCreditCardInfo", () => {
    it("should return true if credit card's state passes the validation and skipSVN is set to false", () => {
      expect(verifyCreditCardInfo(creditCardValidation, false)).toEqual(true);
    });

    it("should return true if credit card's state passes the validation and skipSVN is set to true", () => {
      expect(verifyCreditCardInfo(creditCardValidation, true)).toEqual(true);
    });

    it("should return false if one of credit card's values is not equal to IS_VALID or SKIPPED", () => {
      creditCardValidation.expiryYear = ValidationState.IS_INVALID;
      expect(verifyCreditCardInfo(creditCardValidation, true)).toEqual(false);
    });
  });

  describe("and its verifyMultiStepPage", () => {

    it("should return proper validation object if payment info does not pass validation", () => {
      const expectedValidObject = {
        valid: false,
        failedSections: [globalState.localization.text.header_payment_info],
      };
      globalState.paymentInfo.paymentMethod = PaymentMethod.CREDIT;
      globalState.paymentInfo._validation.paymentDetails.credit.cardNumber = ValidationState.IS_INVALID;
      expect(verifyMultiStepPage(globalState)).toEqual(expectedValidObject);
    });

    it("should return proper validation object if user info does not pass validation", () => {
      const expectedValidObject = {
        valid: false,
        failedSections: [globalState.localization.text.header_donor_tax_info],
      };
      globalState.paymentInfo._validation.paymentDetails.credit.cardNumber = ValidationState.IS_VALID;
      globalState.paymentInfo.paymentMethod = PaymentMethod.CREDIT;
      globalState.currentPageState.editingUserInfo = true;

      expect(verifyMultiStepPage(globalState)).toEqual(expectedValidObject);
    });

    it("should return proper validation object if donation info does not pass validation", () => {
      const expectedValidObject = {
        valid: false,
        failedSections: [globalState.localization.text.header_donation_details],
      };
      globalState.paymentInfo.paymentMethod = PaymentMethod.CREDIT;
      globalState.currentPageState.editingUserInfo = false;
      globalState.donationInfo._validation.amount = ValidationState.IS_INVALID;
      globalState.currentPageState.defaultDonation.monthly = null;
      globalState.currentPageState.defaultDonation.onetime = null;
      expect(verifyMultiStepPage(globalState)).toEqual(expectedValidObject);
    });
  });
});
