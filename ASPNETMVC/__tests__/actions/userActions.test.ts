import * as Chance from "chance";
import {} from "jest";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { actionTypes } from "../../src/shared/actions/actionTypes";
import {
  _reloadUserInfo,
  attemptDonationSubmissionValidaiton,
  attemptPaymentSubmissionValidaiton,
  checkUserLoginStatus,
  clearUserInfo,
  editUserInfo,
  loadPaymentInfoFailed,
  loadPaymentInfoFinished,
  loadPaymentInfoStarted,
  loadUserInfo,
  loadUserInfoFailed,
  loadUserInfoFinished,
  loadUserInfoStarted,
  loadUserInfoValidation,
  logOut,
  savePaymentInfo,
  savePaymentInfoFailed,
  savePaymentInfoFinished,
  savePaymentInfoStarted,
  savePaymentValidationFailed,
  saveUserInfo,
  saveUserInfoFailed,
  saveUserInfoFinished,
  saveUserInfoStarted,
  saveUserValidationFailed,
  setLoginStatus,
  updateUser,
  userLogoutFinished,
} from "../../src/shared/actions/userActions";
import { CardType } from "../../src/shared/constants/Payment";
import { DonorType } from "../../src/shared/constants/User";
import { UserInfo, ValidationState } from "../../src/shared/interfaces/index";
import { APIUserInfo, userInfoLoader, userLogout } from "../../src/shared/utils/api/userInfoLoader";
import { APICCType, APIPaymentInfo } from "../../src/shared/utils/api/userPaymentInfoLoader";
import { fetchWrapper } from "../../src/shared/utils/fetchWrapper";
const chance = new Chance();

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe("actions/dedication Action tests", () => {
  let fakeUserInfo: UserInfo;
  let fakeAPIUserInfo: APIUserInfo;
  let fakeAPIPaymentInfo: APIPaymentInfo;

  beforeEach(() => {
    fakeUserInfo = {
      FirstName: chance.word(),
      LastName: chance.word(),
      PhoneNumber: chance.word(),
      EnableMailingOption: chance.pickone([true, false]),
      EmailAddress: chance.word(),
      SavedPaymentMethods: [
        {
          cardHolderName: chance.word(),
          ccCardType: chance.pickone(
          [
            CardType.visa,
            CardType.visaDebit,
            CardType.mastercard,
            CardType.amex,
          ]),
          ccDigits: chance.word(),
          ccExpYear: chance.word(),
          ccExpMonth: chance.word(),
          saveCCOnFile: chance.bool(),
        },
        {
          cardHolderName: chance.word(),
          ccCardType: chance.pickone(
          [
            CardType.visa,
            CardType.visaDebit,
            CardType.mastercard,
            CardType.amex,
          ]),
          ccDigits: chance.word(),
          ccExpYear: chance.word(),
          ccExpMonth: chance.word(),
          saveCCOnFile: chance.bool(),
        },
      ],
      DonorType: chance.pickone([ DonorType.personal, DonorType.company]),
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
        FirstName: chance.pickone(
        [
          ValidationState.IS_VALID ,
          ValidationState.IS_EMPTY,
          ValidationState.IS_INVALID,
          ValidationState.IS_PRISTINE,
          ValidationState.SKIPPED,
        ]),
        LastName: chance.pickone(
        [
          ValidationState.IS_VALID ,
          ValidationState.IS_EMPTY,
          ValidationState.IS_INVALID,
          ValidationState.IS_PRISTINE,
          ValidationState.SKIPPED,
        ]),
        EmailAddress: chance.pickone(
        [
          ValidationState.IS_VALID ,
          ValidationState.IS_EMPTY,
          ValidationState.IS_INVALID,
          ValidationState.IS_PRISTINE,
          ValidationState.SKIPPED,
        ]),
        CompanyName: chance.pickone(
        [
          ValidationState.IS_VALID ,
          ValidationState.IS_EMPTY,
          ValidationState.IS_INVALID,
          ValidationState.IS_PRISTINE,
          ValidationState.SKIPPED,
        ]),
        Address: {
          LineOne: chance.pickone(
          [
            ValidationState.IS_VALID ,
            ValidationState.IS_EMPTY,
            ValidationState.IS_INVALID,
            ValidationState.IS_PRISTINE,
            ValidationState.SKIPPED,
          ]),
          City: chance.pickone(
          [
            ValidationState.IS_VALID ,
            ValidationState.IS_EMPTY,
            ValidationState.IS_INVALID,
            ValidationState.IS_PRISTINE,
            ValidationState.SKIPPED,
          ]),
          ProvinceCode: chance.pickone(
          [
            ValidationState.IS_VALID ,
            ValidationState.IS_EMPTY,
            ValidationState.IS_INVALID,
            ValidationState.IS_PRISTINE,
            ValidationState.SKIPPED,
          ]),
          ProvinceOther: chance.pickone(
          [
            ValidationState.IS_VALID ,
            ValidationState.IS_EMPTY,
            ValidationState.IS_INVALID,
            ValidationState.IS_PRISTINE,
            ValidationState.SKIPPED,
          ]),
          Country: chance.pickone(
          [
            ValidationState.IS_VALID ,
            ValidationState.IS_EMPTY,
            ValidationState.IS_INVALID,
            ValidationState.IS_PRISTINE,
            ValidationState.SKIPPED,
          ]),
          PostalCode: chance.pickone(
          [
            ValidationState.IS_VALID ,
            ValidationState.IS_EMPTY,
            ValidationState.IS_INVALID,
            ValidationState.IS_PRISTINE,
            ValidationState.SKIPPED,
          ]),
        },
      },
    };

    fakeAPIUserInfo = {
      Title: chance.word(),
      FirstName: chance.word(),
      LastName: chance.word(),
      CompanyName: chance.word(),
      Line1: chance.word(),
      Line2: chance.word(),
      City: chance.word(),
      Country: chance.word(),
      Province: chance.word(),
      ProvinceOther: chance.word(),
      PostalCode: chance.word(),
      Email: chance.word(),
      PhoneNumber: chance.word(),
      MailingOptionEnabled: chance.pickone([true, false]),
      CorporateDonor: chance.bool(),
      DonorLanguageCode: chance.natural(),
      hidDonorType: chance.word(),
      isLoggedIn: chance.bool(),
      silent: chance.bool(),
    };

    fakeAPIPaymentInfo = {
      ccNumberObfuscated: chance.word(),
      ccExpMonth: chance.word(),
      ccExpYear: chance.word(),
      ccHolderName: chance.word(),
      checkSaveCCOnFile: chance.word(),
      ccType: chance.pickone(
      [
        APICCType.NONE,
        APICCType.VISA,
        APICCType.MASTERCARD,
        APICCType.AMEX,
      ]),
    };
  });

  it("should create UPDATE_USER", () => {
    const expectedAction = { type: actionTypes.UPDATE_USER, userInfo: fakeUserInfo };

    const actualAction = updateUser(fakeUserInfo);

    expect(actualAction).toEqual(expectedAction);
  });

  it("should create LOAD_USER_INFO_STARTED", () => {
    const expectedAction = { type: actionTypes.LOAD_USER_INFO_STARTED };
    const actualAction = loadUserInfoStarted();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create LOAD_USER_INFO_STARTED", () => {
    const expectedAction = { type: actionTypes.LOAD_USER_INFO_FAILED };
    const actualAction = loadUserInfoFailed();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create LOAD_USER_INFO_FINISHED", () => {
    const expectedAction = { type: actionTypes.LOAD_USER_INFO_FINISHED, userInfo: fakeAPIUserInfo };
    const actualAction = loadUserInfoFinished(fakeAPIUserInfo);
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create LOAD_USER_INFO_VALIDATION", () => {
    const fakeForceEdit = chance.bool();
     const expectedAction = { type: actionTypes.LOAD_USER_INFO_VALIDATION, forceEdit: fakeForceEdit };
     const actualAction = loadUserInfoValidation(fakeForceEdit);
     expect(actualAction).toEqual(expectedAction);
  });

  it("should create ATTEMTEPD_DONATION_SUBMISSION_FAILED", () => {
     const fakeAttemptedDonationSubmit = chance.bool();
     const expectedAction = { type: actionTypes.ATTEMTEPD_DONATION_SUBMISSION_FAILED, attemptedDonationSubmit: fakeAttemptedDonationSubmit };
     const actualAction = attemptDonationSubmissionValidaiton(fakeAttemptedDonationSubmit);
     expect(actualAction).toEqual(expectedAction);
  });

  it("should create ATTEMTEPD_DONATION_SUBMISSION_FAILED", () => {
    const fakeAttemptedPaymentSubmit = chance.bool();
    const expectedAction = { type: actionTypes.ATTEMPTED_PAYMENT_SUBMISSION_FAILED, attemptedPaymentSubmit: fakeAttemptedPaymentSubmit };
    const actualAction = attemptPaymentSubmissionValidaiton(fakeAttemptedPaymentSubmit);
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create LOAD_PAYMENT_INFO_STARTED", () => {
    const expectedAction = { type: actionTypes.LOAD_PAYMENT_INFO_STARTED };
    const actualAction = loadPaymentInfoStarted();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create LOAD_PAYMENT_INFO_FAILED", () => {
    const expectedAction = { type: actionTypes.LOAD_PAYMENT_INFO_FAILED };
    const actualAction = loadPaymentInfoFailed();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create LOAD_PAYMENT_INFO_FINISHED", () => {
    const expectedAction =
    {
      type: actionTypes.LOAD_PAYMENT_INFO_FINISHED,
      paymentInfo: fakeAPIPaymentInfo,
    };
    const actualAction = loadPaymentInfoFinished(fakeAPIPaymentInfo);
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create EDIT_USER_INFO", () => {
    const fakeEditState = chance.bool();
    const expectedAction = { type: actionTypes.EDIT_USER_INFO, editState: fakeEditState };
    const actualAction = editUserInfo(fakeEditState);
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create SAVE_USER_INFO_VALIDATION_FAILED", () => {
    const expectedAction = { type: actionTypes.SAVE_USER_INFO_VALIDATION_FAILED };
    const actualAction = saveUserValidationFailed();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create SAVE_PAYMENT_VALIDATION_FAILED", () => {
    const expectedAction = { type: actionTypes.SAVE_PAYMENT_VALIDATION_FAILED };
    const actualAction = savePaymentValidationFailed();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create SAVE_USER_INFO_STARTED", () => {
    const expectedAction = { type: actionTypes.SAVE_USER_INFO_STARTED };
    const actualAction = saveUserInfoStarted();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create SAVE_USER_INFO_FINISHED", () => {
    const expectedAction = { type: actionTypes.SAVE_USER_INFO_FINISHED };
    const actualAction = saveUserInfoFinished();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create SAVE_USER_INFO_FAILED", () => {
    const expectedAction = { type: actionTypes.SAVE_USER_INFO_FAILED, userInfo: fakeAPIUserInfo };
    const actualAction = saveUserInfoFailed(fakeAPIUserInfo);
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create SAVE_PAYMENT_INFO_STARTED", () => {
    const expectedAction = { type: actionTypes.SAVE_PAYMENT_INFO_STARTED };
    const actualAction = savePaymentInfoStarted();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create SAVE_PAYMENT_INFO_FINISHED", () => {
    const expectedAction = { type: actionTypes.SAVE_PAYMENT_INFO_FINISHED, paymentInfo: fakeAPIPaymentInfo };
    const actualAction = savePaymentInfoFinished(fakeAPIPaymentInfo);
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create SAVE_PAYMENT_INFO_FAILED", () => {
    const expectedAction = { type: actionTypes.SAVE_PAYMENT_INFO_FAILED };
    const actualAction = savePaymentInfoFailed();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create USER_LOGOUT_FINISHED", () => {
    const expectedAction = { type: actionTypes.USER_LOGOUT_FINISHED };
    const actualAction = userLogoutFinished();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create CLEAR_USER_INFO", () => {
    const expectedAction = { type: actionTypes.CLEAR_USER_INFO };
    const actualAction = clearUserInfo();
    expect(actualAction).toEqual(expectedAction);
  });

  it("should create SET_LOGIN_STATUS", () => {
    const fakeLoggedIn: boolean = chance.bool();
    const expectedAction = { type: actionTypes.SET_LOGIN_STATUS, loggedIn: fakeLoggedIn };
    const actualAction = setLoginStatus(fakeLoggedIn);
    expect(actualAction).toEqual(expectedAction);
  });

  it("should call loadUserInfo and return 'LOAD_USER_INFO_STARTED' and `CLEAR_USER_INFO` and `LOAD_USER_INFO_FAILED` when failed", () => {
    const expectedAction = [{ type: actionTypes.LOAD_USER_INFO_FAILED }, { type: actionTypes.CLEAR_USER_INFO }, { type: actionTypes.LOAD_USER_INFO_STARTED }];
    const store = mockStore({});
    const fakeResponse = [store.dispatch(loadUserInfoFailed()), store.dispatch(logOut()), store.dispatch(clearUserInfo())];
    const fakeStatus = { status: 500 };
    (fetch as any).mockResponse(fakeResponse, fakeStatus);
    store.dispatch(loadUserInfo(null));
    expect(store.getActions()).toEqual(expectedAction);
  });

  it("should call loadUserInfo and return 'LOAD_USER_INFO_FINISHED' and `EDIT_USER_INFO` when successful", () => {
    const fakeEditStateParams: boolean = false;
    const fakeUserInfoParams = {
      City: fakeAPIUserInfo.City,
      CompanyName: fakeAPIUserInfo.CompanyName,
      CorporateDonor: fakeAPIUserInfo.CorporateDonor,
      Country: fakeAPIUserInfo.Country,
      DonorLanguageCode: fakeAPIUserInfo.DonorLanguageCode,
      Email: fakeAPIUserInfo.Email,
      PhoneNumber: fakeAPIUserInfo.PhoneNumber,
      MailingOptionEnabled: fakeAPIUserInfo.MailingOptionEnabled,
      FirstName: fakeAPIUserInfo.FirstName,
      LastName: fakeAPIUserInfo.LastName,
      Line1: fakeAPIUserInfo.Line1,
      Line2: fakeAPIUserInfo.Line2,
      PostalCode: fakeAPIUserInfo.PostalCode,
      Province: fakeAPIUserInfo.Province,
      ProvinceOther: fakeAPIUserInfo.ProvinceOther,
      Title: fakeAPIUserInfo.Title,
      hidDonorType: fakeAPIUserInfo.hidDonorType,
      isLoggedIn: fakeAPIUserInfo.isLoggedIn,
      silent: fakeAPIUserInfo.silent,
    };
    const expectedAction = [{ type: actionTypes.LOAD_USER_INFO_FINISHED, userInfo: fakeUserInfoParams }, { type: actionTypes.EDIT_USER_INFO, editState: fakeEditStateParams }, { type: actionTypes.LOAD_USER_INFO_STARTED }];
    const store = mockStore({});
    const fakeResponse = [store.dispatch(loadUserInfoFinished(fakeAPIUserInfo)), store.dispatch(editUserInfo(false))];
    store.dispatch(loadUserInfo(null));
    expect(store.getActions()).toEqual(expectedAction);
  });

  it("should call userLogout and return `CLEAR_USER_INFO` when failed", () => {
     const expectedAction = [{ type: actionTypes.CLEAR_USER_INFO }];
     const fakeStatus = { status: 500 };
     (fetch as any).mockResponse(null, fakeStatus);
     const store = mockStore({});
     return store.dispatch(logOut()).catch(() => {
       expect(store.getActions()).toEqual(expectedAction);
     });
  });

  it("should call userLogout and return CLEAR_USER_INFO if successful and success params is false ", () => {
    const expectedAction = [{type: actionTypes.CLEAR_USER_INFO }];
    const fakeStatus = { status: 200 };
    (fetch as any).mockResponse(false, fakeStatus);
    const store = mockStore({});
    return store.dispatch(logOut()).then(success => {
      expect(store.getActions()).toEqual(expectedAction);
    });
  });

  it("should call saveUserInfo and return SAVE_USER_INFO_STARTED and LOAD_USER_INFO_STARTED and SAVE_USER_INFO_STARTED and SAVE_USER_INFO_FAILED if successfull", () => {
    const fakeUserInfoParams = { City: "", CompanyName: "", CorporateDonor: false, Country: "", Email: "", PhoneNumber: "", MailingOptionEnabled: false, FirstName: "", LastName: "", Line1: "", Line2: "", PostalCode: "", Province: "", ProvinceOther: "", Title: "" };
    const expectedAction = [
      {
        type: actionTypes.SAVE_USER_INFO_STARTED,
      },
      {
        type: actionTypes.LOAD_USER_INFO_STARTED,
      },
      {
        type: actionTypes.SAVE_USER_INFO_STARTED,
      },
      {
        type: actionTypes.SAVE_USER_INFO_FAILED,
        userInfo: fakeUserInfoParams,
      },
      {
        type: actionTypes.LOAD_USER_INFO_STARTED,
      },
    ];
    const store = mockStore({});
    const fakeResponse = [store.dispatch(saveUserInfoStarted()), store.dispatch(_reloadUserInfo())];
    return store.dispatch(saveUserInfo(fakeAPIUserInfo)).then(() => {
      expect(store.getActions()).toEqual(expectedAction);
    });
  });

  it("should call LOAD_USER_INFO_STARTED and SAVE_USER_INFO_FAILED and userInfo return when it is successful ", () => {
    const fakeUserInfoParams = { City: "", CompanyName: "", CorporateDonor: false, Country: "", Email: "", PhoneNumber: "", MailingOptionEnabled: false, FirstName: "", LastName: "", Line1: "", Line2: "", PostalCode: "", Province: "", ProvinceOther: "", Title: "" };
    const expectedAction = [
      {
        type: actionTypes.LOAD_USER_INFO_STARTED,
      },
      {
        type: actionTypes.SAVE_USER_INFO_FAILED,
        userInfo: fakeUserInfoParams,
      },
    ];
    const store = mockStore({});
    return store.dispatch(_reloadUserInfo()).then(() => {
      expect(store.getActions()).toEqual(expectedAction);
    });
  });

  it("should call loadUserInfo and return `LOAD_USER_INFO_STARTED` and LOAD_`USER_INFO_FAILED` when it is failed", () => {
    const expectedAction = [{ type: actionTypes.LOAD_USER_INFO_STARTED }, { type: actionTypes.LOAD_USER_INFO_FAILED }];
    const store = mockStore({});
    return store.dispatch(loadUserInfo()).then(() => {
      expect(store.getActions()).toEqual(expectedAction);
    });
  });

});