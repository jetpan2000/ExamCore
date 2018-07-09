import * as Chance from "chance";
import {} from "jest";
import userUpdateHelper from "../../../src/shared/helpers/userUpdateHelper";
import { UserUpdateValues } from "../../../src/shared/helpers/userUpdateHelper";
import { validateConfigValue } from "../../../src/shared/utils";
import { validate } from "../../../src/shared/utils/validate";
import { DonorType } from "../../../src/shared/constants/User";
import { UserInfo, ValidationState } from "../../../src/shared/utils/validate";
import { DonorType } from "../../../src/shared/constants/User";
import { CardType } from "../../../src/shared/constants/Payment";

const chance = new Chance();
const userUpdateValues: UserUpdateValues = {
  email: chance.email(),
  donorType: DonorType.personal,
  firstName: chance.word(),
  lastName: chance.word(),
  companyName: chance.word(),
  addressLineOne: chance.word(),
  addressLineTwo: chance.word(),
  city: chance.word(),
  province: chance.word(),
  provinceOther: chance.word(),
  country: chance.word(),
  postalCode: chance.word(),
  paypalCID: chance.word(),
  paypalToken: chance.word(),
  paypalPayerID: chance.word(),
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

describe("helpers/userUpdateHelper.test.ts", () => {

  it("should return proper User object when DonorType is personal", () => {
    const expectedUser = {
      EmailAddress: userUpdateValues.email,
      FirstName: userUpdateValues.firstName,
      LastName: userUpdateValues.lastName,
      CompanyName: userUpdateValues.companyName,
      Address: {
        LineOne: userUpdateValues.addressLineOne,
        LineTwo: userUpdateValues.addressLineTwo,
        City: userUpdateValues.city,
        ProvinceCode: userUpdateValues.province,
        ProvinceOther: userUpdateValues.provinceOther,
        Country: userUpdateValues.country,
        PostalCode: userUpdateValues.postalCode,
      },
      appVersion: userInfo.appVersion,
      persistExpire: userInfo.persistExpire,
      SavedPaymentMethods: userInfo.SavedPaymentMethods,
      DonorType: userInfo.DonorType,
      _validation: {
        EmailAddress: userInfo._validation.EmailAddress,
        FirstName: userInfo._validation.FirstName,
        LastName: userInfo._validation.LastName,
        CompanyName: userInfo._validation.CompanyName,
        Address: {
          LineOne: validateConfigValue("addressLineOne",      userInfo._validation.Address.LineOne,       text => validate.requiredText(text), userUpdateValues),
          City: validateConfigValue("city",                   userInfo._validation.Address.City,          text => validate.requiredText(text), userUpdateValues),
          ProvinceCode: validateConfigValue("province",       userInfo._validation.Address.ProvinceCode,  text => validate.requiredText(text), userUpdateValues),
          ProvinceOther: validateConfigValue("provinceOther", userInfo._validation.Address.ProvinceOther, text => validate.requiredText(text), userUpdateValues),
          Country: validateConfigValue("country",             userInfo._validation.Address.Country,       text => validate.requiredText(text), userUpdateValues),
          PostalCode: validateConfigValue("postalCode",       userInfo._validation.Address.PostalCode,    text => validate.postalCode(text, userInfo.Address.Country), userUpdateValues),
        },
      },
    };

    expect(userUpdateHelper(userUpdateValues, userInfo)).toEqual(expectedUser: UserInfo);
  });

  it("should return proper User object when DonorType is company", () => {
    userUpdateValues.donorType = DonorType.company;
    const nameValidationStates = {
      FirstName: ValidationState.SKIPPED,
      LastName: ValidationState.SKIPPED,
      CompanyName: userInfo._validation.CompanyName,
    };
    userUpdateValues.firstName = "";
    userUpdateValues.lastName = "";
    const expectedUser = {
      EmailAddress: userUpdateValues.email,
      FirstName: "",
      LastName: "",
      CompanyName: userUpdateValues.companyName,
      Address: {
        LineOne: userUpdateValues.addressLineOne,
        LineTwo: userUpdateValues.addressLineTwo,
        City: userUpdateValues.city,
        ProvinceCode: userUpdateValues.province,
        ProvinceOther: userUpdateValues.provinceOther,
        Country: userUpdateValues.country,
        PostalCode: userUpdateValues.postalCode,
      },
      appVersion: userInfo.appVersion,
      persistExpire: userInfo.persistExpire,
      SavedPaymentMethods: userInfo.SavedPaymentMethods,
      DonorType: userUpdateValues.donorType,
      _validation: {
        EmailAddress: validateConfigValue("email",      userInfo._validation.EmailAddress,  text => validate.email(text), userUpdateValues),
        FirstName: validateConfigValue("firstName",       nameValidationStates.FirstName,   text => validate.requiredText(text), userUpdateValues),
        LastName: validateConfigValue("lastName",          nameValidationStates.LastName,    text => validate.requiredText(text), userUpdateValues),
        CompanyName: validateConfigValue("companyName", nameValidationStates.CompanyName, text => validate.requiredText(text), userUpdateValues),
        Address: {
          LineOne: validateConfigValue("addressLineOne",      userInfo._validation.Address.LineOne,       text => validate.requiredText(text), userUpdateValues),
          City: validateConfigValue("city",                   userInfo._validation.Address.City,          text => validate.requiredText(text), userUpdateValues),
          ProvinceCode: validateConfigValue("province",       userInfo._validation.Address.ProvinceCode,  text => validate.requiredText(text), userUpdateValues),
          ProvinceOther: validateConfigValue("provinceOther", userInfo._validation.Address.ProvinceOther, text => validate.requiredText(text), userUpdateValues),
          Country: validateConfigValue("country",             userInfo._validation.Address.Country,       text => validate.requiredText(text), userUpdateValues),
          PostalCode: validateConfigValue("postalCode",       userInfo._validation.Address.PostalCode,    text => validate.postalCode(text, userInfo.Address.Country), userUpdateValues),
        },
      },
    };

    expect(userUpdateHelper(userUpdateValues, userInfo)).toEqual(expectedUser: UserInfo);
  });

  it("should return proper User object when DonorType is company and company name's length is not more than 0 and country is Canada", () => {
    userUpdateValues.donorType = DonorType.company;
    const nameValidationStates = {
      FirstName: ValidationState.SKIPPED,
      LastName: ValidationState.SKIPPED,
      CompanyName: ValidationState.IS_PRISTINE,
    };
    userUpdateValues.firstName = "";
    userUpdateValues.lastName = "";
    userInfo.CompanyName = "";
    userUpdateValues.country = "CA";
    const expectedUser = {
      EmailAddress: userUpdateValues.email,
      FirstName: "",
      LastName: "",
      CompanyName: userUpdateValues.companyName,
      Address: {
        LineOne: userUpdateValues.addressLineOne,
        LineTwo: userUpdateValues.addressLineTwo,
        City: userUpdateValues.city,
        ProvinceCode: userUpdateValues.province,
        ProvinceOther: userUpdateValues.provinceOther,
        Country: userUpdateValues.country,
        PostalCode: userUpdateValues.postalCode,
      },
      appVersion: userInfo.appVersion,
      persistExpire: userInfo.persistExpire,
      SavedPaymentMethods: userInfo.SavedPaymentMethods,
      DonorType: userUpdateValues.donorType,
      _validation: {
        EmailAddress: validateConfigValue("email",      userInfo._validation.EmailAddress,  text => validate.email(text), userUpdateValues),
        FirstName: validateConfigValue("firstName",       nameValidationStates.FirstName,   text => validate.requiredText(text), userUpdateValues),
        LastName: validateConfigValue("lastName",          nameValidationStates.LastName,    text => validate.requiredText(text), userUpdateValues),
        CompanyName: validateConfigValue("companyName", nameValidationStates.CompanyName, text => validate.requiredText(text), userUpdateValues),
        Address: {
          LineOne: validateConfigValue("addressLineOne",      userInfo._validation.Address.LineOne,       text => validate.requiredText(text), userUpdateValues),
          City: validateConfigValue("city",                   userInfo._validation.Address.City,          text => validate.requiredText(text), userUpdateValues),
          ProvinceCode: validateConfigValue("province",       userInfo._validation.Address.ProvinceCode,  text => validate.requiredText(text), userUpdateValues),
          ProvinceOther: validateConfigValue("provinceOther", userInfo._validation.Address.ProvinceOther, text => validate.requiredText(text), userUpdateValues),
          Country: validateConfigValue("country",             userInfo._validation.Address.Country,       text => validate.requiredText(text), userUpdateValues),
          PostalCode: validateConfigValue("postalCode",       userInfo._validation.Address.PostalCode,    text => validate.postalCode(text, userInfo.Address.Country), userUpdateValues),
        },
      },
    };

    expect(userUpdateHelper(userUpdateValues, userInfo)).toEqual(expectedUser: UserInfo);
  });
});
