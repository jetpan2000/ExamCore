import * as Chance from "chance";
import "isomorphic-fetch";
import {} from "jest";
import { cloneDeep } from "lodash";
import * as moment from "moment";
import { dateFormat } from "../../../../../../src/shared/constants/DateFormat";
import { DedicationSendType, DedicationTypes } from "../../../../../../src/shared/constants/Dedications";
import { DonationFrequency, FrequencyType } from "../../../../../../src/shared/constants/Donations";
import { FormTypes } from "../../../../../../src/shared/constants/FormType";
import { Pages } from "../../../../../../src/shared/constants/Pages";
import { CardType, PaymentMethod } from "../../../../../../src/shared/constants/Payment";
import { DonorType } from "../../../../../../src/shared/constants/User";
import { getDonationSource } from "../../../../../../src/shared/helpers/donationSourceHelper";
import { CharityInfo, DedicationInfo, DonationInfo, GlobalState, Localization, PageInfo, PageState, PaymentInfo } from "../../../../../../src/shared/interfaces/index";
import { ProcessToday } from "../../../../../../src/shared/utils/api/CDN/PostDonation/models";
import { TerminationType } from "../../../../../../src/shared/utils/api/CDN/PostDonation/models/index";
import { PaypalStage } from "../../../../../../src/shared/utils/api/CDN/PostDonation/models/paypal";
import { requestObject } from "../../../../../../src/shared/utils/api/CDN/PostDonation/requestObject";
import { getLanguageCode } from "../../../../../../src/shared/utils/index";
import { ValidationState } from "../../../../../../src/shared/utils/validate";
const chance = new Chance();

const anonimous = chance.pickone([true, false]);
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
  AmountLevelsDict:  {},
  MonthlyAmountType: chance.natural(),
  MonthlyAmountLevelsDict: {},
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
const currentPageState: PageState = {
  pageType: FormTypes.FULL_FORM,
  donorLoggedIn: chance.pickone([true, false]),
  loggedIn: chance.pickone([true, false]),
  forceEdit: chance.pickone([true, false]),
  editingUserInfo: chance.pickone([true, false]),
  attemptedDonationSubmit: chance.pickone([true, false]),
  attemptedPaymentSubmit: chance.pickone([true, false]),
  editingUserInfoLoader: chance.pickone([true, false]),
  descriptionExpanded: chance.pickone([true, false]),
  showAdvancedMonthly: chance.pickone([true, false]),
  displayPage: Pages.FULL_FORM,
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
          frequencyType: FrequencyType.BOTH,
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
  showRedirectMessage: chance.pickone([true, false]),
  showFrequencyLink: chance.pickone([true, false]),
};
const localization: Localization = {
  text: {},
  lang: chance.pickone(["en", "fr"]),
};
const donationInfo: DonationInfo = {
  amount: chance.natural(),
  frequency: DonationFrequency.monthly,
  frequencyType: FrequencyType.BOTH,
  monthlyOptions: {
    terminationType: TerminationType,
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
      country: chance.word(),
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
    honoreeName: ValidationState,
    eCardInfo: {
      id: ValidationState,
      recipient: {
        fullName: ValidationState,
        email: ValidationState,
      },
      sender: {
        fullName: ValidationState,
        email: ValidationState,
      },
    },
    postCardInfo: {
      address: {
        lineOne: ValidationState,
        city: ValidationState,
        country: ValidationState,
        province: ValidationState,
        provinceOther: ValidationState,
        postalCode: ValidationState,
      },
      firstName: ValidationState,
      lastName: ValidationState,
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
      ccDirty: chance.pickone([true, false]),
    },
    paypal: {
      CID: chance.word(),
      Token: chance.word(),
      PayerID: chance.word(),
      stage: PaypalStage.INITIAL,
    },
    giftCard: {
      cardholderName: chance.word(),
      cardNumber: chance.word(),
      expiryMonth: chance.word(),
      expiryYear: chance.word(),
      cvn: chance.word(),
      ccDirty: chance.pickone([true, false]),
    },
  },
  _validation: {
    paymentDetails: {
      credit: {
        cardholderName: ValidationState,
        cardNumber: ValidationState,
        expiryMonth: ValidationState,
        expiryYear: ValidationState,
        cvn: ValidationState,
      },
      giftCard: {
        cardNumber: ValidationState,
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
    LineOne: chance.word(),
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

describe("utils/api/CDN/PostDonation/requestObject.test.ts", () => {

  it("should call request.credit when there is no dedication and return proper data object", () => {
    const ccExp = globalState.paymentInfo.paymentDetails.credit.expiryMonth + globalState.paymentInfo.paymentDetails.credit.expiryYear.substr(globalState.paymentInfo.paymentDetails.credit.expiryYear.length - 2, 2);
    globalState.donationInfo.anonymous = false;
    const expectedData = {
      donateNowVM: {
        PageID: globalState.pageInfo.PageID,
        DonorInfoVM: {
          Title: "",
          DonorFirstName: globalState.userInfo.FirstName,
          DonorLastName: globalState.userInfo.LastName,
          CompanyName: globalState.userInfo.CompanyName,
          DonorEmailAddress: globalState.userInfo.EmailAddress,
          Street1: globalState.userInfo.Address.LineOne,
          Street2: globalState.userInfo.Address.LineTwo,
          City: globalState.userInfo.Address.City,
          Province: globalState.userInfo.Address.ProvinceCode,
          Country: globalState.userInfo.Address.Country,
          PostalCode: globalState.userInfo.Address.PostalCode,
          DonorLanguageCode: getLanguageCode(globalState.localization.lang),
          isLoggedIn: globalState.currentPageState.donorLoggedIn,
          hidDonorType: globalState.userInfo.DonorType,
          ProvinceOther: globalState.userInfo.Address.ProvinceOther,
        },
        PaymentInfoVM: {
          CCNum: globalState.paymentInfo.paymentDetails.credit.cardNumber,
          CCExp: ccExp,
          CardHolderName: globalState.paymentInfo.paymentDetails.credit.cardholderName,
          CVN: globalState.paymentInfo.paymentDetails.credit.cvn,
          PostalCode: globalState.userInfo.Address.PostalCode,
        },
        CCDirty: globalState.paymentInfo.paymentDetails.credit.ccDirty,
        DonationInfoVM: {
          Amount: globalState.donationInfo.amount,
          FundID: globalState.donationInfo.fund,
          FundName: "",
          CharityBN: globalState.charityInfo.CharityBN,
          CharityID: globalState.charityInfo.CharityID,
          DonationSourceID: globalState.pageInfo.PageID,
          MessageToCharity: globalState.donationInfo.message,
          Honouree: globalState.dedicationInfo.honoreeName,
          HonoureeType: "0",
          AnonymityID: 0,
          CommunicationFrequency: 6,
        },
        DonationEcardVM: null,
        DonationCardRequestVM: null,
        MonthlyDonation: globalState.donationInfo.frequency === DonationFrequency.monthly,
        IsEmbeded: false,
        MonthlyDonationInfoVM: {
          TerminationType: globalState.donationInfo.monthlyOptions.terminationType,
          RecurrenceDate: globalState.donationInfo.monthlyOptions.startDate,
          EndDate: globalState.donationInfo.monthlyOptions.endDate,
          EndAfterCount: isNaN(Number.parseInt(globalState.donationInfo.monthlyOptions.count as any)) ? "0" : globalState.donationInfo.monthlyOptions.count.toString(),
          ProcessToday: globalState.donationInfo.monthlyOptions.processImmediately ? ProcessToday.YES : ProcessToday.NO,
        },
        CHODonation: globalState.donationInfo.canadaHelpsDonation.addDonation,
        CHODonationAmount: globalState.donationInfo.canadaHelpsDonation.amount,
        CaptchaVM: {
          Challenge: null,
          Response: null,
        },
      },
      extraInfo: {
        AnswerOne: globalState.donationInfo.answerOne,
        QuestionOne: globalState.pageInfo.QuestionOne,
      },
    };

    expect(requestObject.credit(globalState)).toEqual(expectedData);
  });

  it("should call request.credit when dedication type exists, donationInfo frequency is 'oneTime' and return proper data object", () => {
    const ccExp = globalState.paymentInfo.paymentDetails.credit.expiryMonth + globalState.paymentInfo.paymentDetails.credit.expiryYear.substr(globalState.paymentInfo.paymentDetails.credit.expiryYear.length - 2, 2);
    globalState.donationInfo.anonymous = false;
    globalState.dedicationInfo.dedication = DedicationTypes.IN_MEMORY_OF;
    globalState.donationInfo.frequency = DonationFrequency.oneTime;
    const expectedData = {
      donateNowVM: {
        PageID: globalState.pageInfo.PageID,
        DonorInfoVM: {
          Title: "",
          DonorFirstName: globalState.userInfo.FirstName,
          DonorLastName: globalState.userInfo.LastName,
          CompanyName: globalState.userInfo.CompanyName,
          DonorEmailAddress: globalState.userInfo.EmailAddress,
          Street1: globalState.userInfo.Address.LineOne,
          Street2: globalState.userInfo.Address.LineTwo,
          City: globalState.userInfo.Address.City,
          Province: globalState.userInfo.Address.ProvinceCode,
          Country: globalState.userInfo.Address.Country,
          PostalCode: globalState.userInfo.Address.PostalCode,
          DonorLanguageCode: getLanguageCode(globalState.localization.lang),
          isLoggedIn: globalState.currentPageState.donorLoggedIn,
          hidDonorType: globalState.userInfo.DonorType,
          ProvinceOther: globalState.userInfo.Address.ProvinceOther,
        },
        PaymentInfoVM: {
          CCNum: globalState.paymentInfo.paymentDetails.credit.cardNumber,
          CCExp: ccExp,
          CardHolderName: globalState.paymentInfo.paymentDetails.credit.cardholderName,
          CVN: globalState.paymentInfo.paymentDetails.credit.cvn,
          PostalCode: globalState.userInfo.Address.PostalCode,
        },
        CCDirty: globalState.paymentInfo.paymentDetails.credit.ccDirty,
        DonationInfoVM: {
          Amount: globalState.donationInfo.amount,
          FundID: globalState.donationInfo.fund,
          FundName: "",
          CharityBN: globalState.charityInfo.CharityBN,
          CharityID: globalState.charityInfo.CharityID,
          DonationSourceID: globalState.pageInfo.PageID,
          MessageToCharity: globalState.donationInfo.message,
          Honouree: globalState.dedicationInfo.honoreeName,
          HonoureeType: "2",
          AnonymityID: 0,
          CommunicationFrequency: 6,
        },
        DonationEcardVM: null,
        DonationCardRequestVM: {
          Title: "",
          FirstName: globalState.dedicationInfo.postCardInfo.firstName,
          LastName: globalState.dedicationInfo.postCardInfo.lastName,
          CardMessage: globalState.dedicationInfo.postCardInfo.message,
          CardSignature: globalState.dedicationInfo.postCardInfo.signature,
          Street1: globalState.dedicationInfo.postCardInfo.address.lineOne,
          Street2: globalState.dedicationInfo.postCardInfo.address.lineTwo,
          City: globalState.dedicationInfo.postCardInfo.address.city,
          Province: globalState.dedicationInfo.postCardInfo.address.provinceOther,
          Country: globalState.dedicationInfo.postCardInfo.address.country,
          PostalCode: globalState.dedicationInfo.postCardInfo.address.postalCode,
        },
        MonthlyDonation: globalState.donationInfo.frequency === DonationFrequency.monthly,
        IsEmbeded: false,
        MonthlyDonationInfoVM: null,
        CHODonation: globalState.donationInfo.canadaHelpsDonation.addDonation,
        CHODonationAmount: globalState.donationInfo.canadaHelpsDonation.amount,
        CaptchaVM: {
          Challenge: null,
          Response: null,
        },
      },
      extraInfo: {
        AnswerOne: globalState.donationInfo.answerOne,
        QuestionOne: globalState.pageInfo.QuestionOne,
      },
    };

    expect(requestObject.credit(globalState)).toEqual(expectedData);
  });

  it("should call request.credit and return proper credit donation request object when dedication is null or undefined", () => {
    const ccExp = globalState.paymentInfo.paymentDetails.credit.expiryMonth + globalState.paymentInfo.paymentDetails.credit.expiryYear.substr(globalState.paymentInfo.paymentDetails.credit.expiryYear.length - 2, 2);
    const newState = cloneDeep(globalState);
    newState.dedicationInfo = null;
    newState.donationInfo.anonymous = false;
    newState.donationInfo.frequency = DonationFrequency.oneTime;
    const expectedData = {
      donateNowVM: {
        PageID: newState.pageInfo.PageID,
        DonorInfoVM: {
          Title: "",
          DonorFirstName: newState.userInfo.FirstName,
          DonorLastName: newState.userInfo.LastName,
          CompanyName: newState.userInfo.CompanyName,
          DonorEmailAddress: newState.userInfo.EmailAddress,
          Street1: newState.userInfo.Address.LineOne,
          Street2: newState.userInfo.Address.LineTwo,
          City: newState.userInfo.Address.City,
          Province: newState.userInfo.Address.ProvinceCode,
          Country: newState.userInfo.Address.Country,
          PostalCode: newState.userInfo.Address.PostalCode,
          DonorLanguageCode: getLanguageCode(newState.localization.lang),
          isLoggedIn: newState.currentPageState.donorLoggedIn,
          hidDonorType: newState.userInfo.DonorType,
          ProvinceOther: newState.userInfo.Address.ProvinceOther,
        },
        PaymentInfoVM: {
          CCNum: newState.paymentInfo.paymentDetails.credit.cardNumber,
          CCExp: ccExp,
          CardHolderName: newState.paymentInfo.paymentDetails.credit.cardholderName,
          CVN: newState.paymentInfo.paymentDetails.credit.cvn,
          PostalCode: newState.userInfo.Address.PostalCode,
        },
        CCDirty: newState.paymentInfo.paymentDetails.credit.ccDirty,
        DonationInfoVM: {
          Amount: newState.donationInfo.amount,
          FundID: newState.donationInfo.fund,
          FundName: "",
          CharityBN: newState.charityInfo.CharityBN,
          CharityID: newState.charityInfo.CharityID,
          DonationSourceID: newState.pageInfo.PageID,
          MessageToCharity: newState.donationInfo.message,
          Honouree: "",
          HonoureeType: "0",
          AnonymityID: 0,
          CommunicationFrequency: 6,
        },
        DonationEcardVM: null,
        DonationCardRequestVM: null,
        MonthlyDonation: newState.donationInfo.frequency === DonationFrequency.monthly,
        IsEmbeded: false,
        MonthlyDonationInfoVM: null,
        CHODonation: newState.donationInfo.canadaHelpsDonation.addDonation,
        CHODonationAmount: newState.donationInfo.canadaHelpsDonation.amount,
        CaptchaVM: {
          Challenge: null,
          Response: null,
        },
      },
      extraInfo: {
        AnswerOne: newState.donationInfo.answerOne,
        QuestionOne: newState.pageInfo.QuestionOne,
      },
    };

    expect(requestObject.credit(newState)).toEqual(expectedData);
  });

  it("should call requestObject.giftCard and return proper data object", () => {
    const giftCardExpectedData = {
      GiftCardVM: {
        id: globalState.paymentInfo.paymentDetails.giftCard.cardNumber,
        GiftCardNumber: globalState.paymentInfo.paymentDetails.giftCard.cardNumber,
        GiftCardAmount: globalState.paymentInfo.paymentDetails.giftCard.cardAmount,
        GiftCardBalance: globalState.paymentInfo.paymentDetails.giftCard.cardBalance,
        IsSpent: globalState.paymentInfo.paymentDetails.giftCard.isSpent,
        HasSenderEmail: globalState.paymentInfo.paymentDetails.giftCard.hasSenderEmail,
        RecipientThankYou: globalState.paymentInfo.paymentDetails.giftCard.recipientThankYou ? globalState.paymentInfo.paymentDetails.giftCard.recipientThankYou : "",
        NotifySenderOfCharityChoice: globalState.paymentInfo.paymentDetails.giftCard.notifySenderOfCharityChoice ? "1" : "0",
      },
      CharityID: globalState.charityInfo.CharityID,
      Amount: globalState.donationInfo.amount,
      MessageToCharity: globalState.donationInfo.message,
      DonationSourceString: getDonationSource(globalState.donationInfo, globalState.currentPageState.pageType === FormTypes.MULTI_STEP),
      LanguageCode: getLanguageCode(globalState.localization.lang),
      FundID: globalState.donationInfo.fund.toString(),
      DonationSourceID: globalState.pageInfo.PageID,
    };

    expect(requestObject.giftCard(globalState)).toEqual(giftCardExpectedData);
  });

  describe("and its requestObject.paypal", () => {

    it("should call initial() when honouree type is 'IN_MEMORY_OF' and dedicationSendType is 'SEND_ECARD_MYSELF' and return proper data object", () => {
      globalState.donationInfo.anonymous = true;
      globalState.dedicationInfo.dedicationSendType = DedicationSendType.SEND_ECARD_MYSELF;
      globalState.dedicationInfo.dedication = DedicationTypes.IN_MEMORY_OF;

      const expectedPaypalInitData = {
        paypalDonationVM: {
          LanguageCode: getLanguageCode(globalState.localization.lang),
          DonationAmount: globalState.donationInfo.amount,
          isMonthly: globalState.donationInfo.frequency === DonationFrequency.monthly,
          CHODonationAmount: globalState.donationInfo.canadaHelpsDonation.addDonation ? globalState.donationInfo.canadaHelpsDonation.amount : 0,
          ECardRequested: globalState.dedicationInfo.dedicationSendType === DedicationSendType.SEND_ECARD_MYSELF,
          DonationEcardVM: {
            RecipientName: globalState.dedicationInfo.eCardInfo.recipient.fullName,
            RecipientEmail: globalState.dedicationInfo.eCardInfo.recipient.email,
            SenderName: globalState.dedicationInfo.eCardInfo.sender.fullName,
            SenderEmail: globalState.dedicationInfo.eCardInfo.sender.email,
            Message: globalState.dedicationInfo.eCardInfo.message,
            DetailID: globalState.dedicationInfo.eCardInfo.id.toString(),
          },
          DonationCardRequested: false,
          DonationCardRequestVM: null,
          PageID: globalState.pageInfo.PageID,
          CharityID: globalState.charityInfo.CharityID,
          FundID: globalState.donationInfo.fund,
          HonoureeName: globalState.dedicationInfo.honoreeName,
          HonoureeType: "2",
          MessageToCharity: globalState.donationInfo.message,
          CharityURL: globalState.pageInfo.RedirectURL,
          AnonymityID: 7,
          MonthlyGiftTerminationType: globalState.donationInfo.monthlyOptions.terminationType,
          MonthlyGiftRecurrenceDate: moment(globalState.donationInfo.monthlyOptions.startDate, dateFormat).toDate(),
          MonthlyGiftEndDate: moment(globalState.donationInfo.monthlyOptions.endDate, dateFormat).toDate(),
          MonthlyGiftEndCount: isNaN(Number.parseInt(globalState.donationInfo.monthlyOptions.count as any)) ? "0" : globalState.donationInfo.monthlyOptions.count.toString(),
          MonthlyGiftProcessToday: globalState.donationInfo.monthlyOptions.processImmediately ? ProcessToday.YES : ProcessToday.NO,
          isMobile: false,
          isEmbeded: false,
        },
        extraInfo: {
          QuestionOne: globalState.pageInfo.QuestionOne,
          AnswerOne: globalState.donationInfo.answerOne,
        },
      };
      expect(requestObject.paypal.initial(globalState)).toEqual(expectedPaypalInitData);
    });

    it("should call initial() when honouree type is 'IN_MEMORY_OF' and dedicationSendType is 'CHARITY_SEND_POSTCARD' and return proper data object", () => {
      globalState.donationInfo.anonymous = true;
      globalState.dedicationInfo.dedicationSendType = DedicationSendType.CHARITY_SEND_POSTCARD;
      globalState.dedicationInfo.dedication = DedicationTypes.IN_MEMORY_OF;
      globalState.dedicationInfo.postCardInfo.address.country = "CA";

      const expectedPaypalInitData = {
        paypalDonationVM: {
          LanguageCode: getLanguageCode(globalState.localization.lang),
          DonationAmount: globalState.donationInfo.amount,
          isMonthly: globalState.donationInfo.frequency === DonationFrequency.monthly,
          CHODonationAmount: globalState.donationInfo.canadaHelpsDonation.addDonation ? globalState.donationInfo.canadaHelpsDonation.amount : 0,
          ECardRequested: globalState.dedicationInfo.dedicationSendType === DedicationSendType.SEND_ECARD_MYSELF,
          DonationEcardVM: null,
          DonationCardRequested: true,
          DonationCardRequestVM: {
            Title: "",
            FirstName: globalState.dedicationInfo.postCardInfo.firstName,
            LastName: globalState.dedicationInfo.postCardInfo.lastName,
            CardMessage: globalState.dedicationInfo.postCardInfo.message,
            CardSignature: globalState.dedicationInfo.postCardInfo.signature,
            Street1: globalState.dedicationInfo.postCardInfo.address.lineOne,
            Street2: globalState.dedicationInfo.postCardInfo.address.lineTwo,
            City: globalState.dedicationInfo.postCardInfo.address.city,
            Province: globalState.dedicationInfo.postCardInfo.address.province,
            Country: globalState.dedicationInfo.postCardInfo.address.country,
            PostalCode: globalState.dedicationInfo.postCardInfo.address.postalCode,
          },
          PageID: globalState.pageInfo.PageID,
          CharityID: globalState.charityInfo.CharityID,
          FundID: globalState.donationInfo.fund,
          HonoureeName: globalState.dedicationInfo.honoreeName,
          HonoureeType: "2",
          MessageToCharity: globalState.donationInfo.message,
          CharityURL: globalState.pageInfo.RedirectURL,
          AnonymityID: 7,
          MonthlyGiftTerminationType: globalState.donationInfo.monthlyOptions.terminationType,
          MonthlyGiftRecurrenceDate: moment(globalState.donationInfo.monthlyOptions.startDate, dateFormat).toDate(),
          MonthlyGiftEndDate: moment(globalState.donationInfo.monthlyOptions.endDate, dateFormat).toDate(),
          MonthlyGiftEndCount: isNaN(Number.parseInt(globalState.donationInfo.monthlyOptions.count as any)) ? "0" : globalState.donationInfo.monthlyOptions.count.toString(),
          MonthlyGiftProcessToday: globalState.donationInfo.monthlyOptions.processImmediately ? ProcessToday.YES : ProcessToday.NO,
          isMobile: false,
          isEmbeded: false,
        },
        extraInfo: {
          QuestionOne: globalState.pageInfo.QuestionOne,
          AnswerOne: globalState.donationInfo.answerOne,
        },
      };
      expect(requestObject.paypal.initial(globalState)).toEqual(expectedPaypalInitData);
    });

    it("should call initial() when honouree type is 'IN_HONOR_OF', the device is mobile and return proper data object", () => {
      globalState.donationInfo.anonymous = true;
      globalState.dedicationInfo.dedicationSendType = DedicationSendType.SEND_ECARD_MYSELF;
      globalState.dedicationInfo.dedication = DedicationTypes.IN_HONOR_OF;
      global.navigator.__defineGetter__("userAgent", function () {
        return "iPhone";
      });

      const expectedPaypalInitData = {
        paypalDonationVM: {
          LanguageCode: getLanguageCode(globalState.localization.lang),
          DonationAmount: globalState.donationInfo.amount,
          isMonthly: globalState.donationInfo.frequency === DonationFrequency.monthly,
          CHODonationAmount: globalState.donationInfo.canadaHelpsDonation.addDonation ? globalState.donationInfo.canadaHelpsDonation.amount : 0,
          ECardRequested: globalState.dedicationInfo.dedicationSendType === DedicationSendType.SEND_ECARD_MYSELF,
          DonationEcardVM: {
            RecipientName: globalState.dedicationInfo.eCardInfo.recipient.fullName,
            RecipientEmail: globalState.dedicationInfo.eCardInfo.recipient.email,
            SenderName: globalState.dedicationInfo.eCardInfo.sender.fullName,
            SenderEmail: globalState.dedicationInfo.eCardInfo.sender.email,
            Message: globalState.dedicationInfo.eCardInfo.message,
            DetailID: globalState.dedicationInfo.eCardInfo.id.toString(),
          },
          DonationCardRequested: false,
          DonationCardRequestVM: null,
          PageID: globalState.pageInfo.PageID,
          CharityID: globalState.charityInfo.CharityID,
          FundID: globalState.donationInfo.fund,
          HonoureeName: globalState.dedicationInfo.honoreeName,
          HonoureeType: "1",
          MessageToCharity: globalState.donationInfo.message,
          CharityURL: globalState.pageInfo.RedirectURL,
          AnonymityID: 7,
          MonthlyGiftTerminationType: globalState.donationInfo.monthlyOptions.terminationType,
          MonthlyGiftRecurrenceDate: moment(globalState.donationInfo.monthlyOptions.startDate, dateFormat).toDate(),
          MonthlyGiftEndDate: moment(globalState.donationInfo.monthlyOptions.endDate, dateFormat).toDate(),
          MonthlyGiftEndCount: isNaN(Number.parseInt(globalState.donationInfo.monthlyOptions.count as any)) ? "0" : globalState.donationInfo.monthlyOptions.count.toString(),
          MonthlyGiftProcessToday: globalState.donationInfo.monthlyOptions.processImmediately ? ProcessToday.YES : ProcessToday.NO,
          isMobile: true,
          isEmbeded: false,
        },
        extraInfo: {
          QuestionOne: globalState.pageInfo.QuestionOne,
          AnswerOne: globalState.donationInfo.answerOne,
        },
      };

      expect(requestObject.paypal.initial(globalState)).toEqual(expectedPaypalInitData);
    });

    it("should call redirect() and return proper data object", () => {
      const token = chance.word();
      expect(requestObject.paypal.redirect(token)).toEqual({token: token});
    };

    it("should call submit() and return proper data object", () => {
      const expectedSubmitData = {
        DonorProfile: {
          Title: "",
          DonorFirstName: globalState.userInfo.FirstName,
          DonorLastName: globalState.userInfo.LastName,
          CompanyName: globalState.userInfo.CompanyName,
          DonorEmailAddress: globalState.userInfo.EmailAddress,
          Street1: globalState.userInfo.Address.LineOne,
          Street2: globalState.userInfo.Address.LineTwo,
          City: globalState.userInfo.Address.City,
          Country: globalState.userInfo.Address.Country,
          Province: globalState.userInfo.Address.ProvinceCode,
          PostalCode: globalState.userInfo.Address.PostalCode,
          DonorLanguageCode: getLanguageCode(globalState.localization.lang),
          isLoggedIn: globalState.currentPageState.donorLoggedIn,
          hidDonorType: globalState.userInfo.DonorType,
          ProvinceOther: globalState.userInfo.Address.ProvinceOther,
        },
        CID: globalState.paymentInfo.paymentDetails.paypal.CID,
        Token: globalState.paymentInfo.paymentDetails.paypal.Token,
        PayerID: globalState.paymentInfo.paymentDetails.paypal.PayerID,
      };

      expect(requestObject.paypal.submit(globalState)).toEqual(expectedSubmitData);
    };
  });

});