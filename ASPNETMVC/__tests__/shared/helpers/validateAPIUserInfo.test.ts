import * as Chance from "chance";
import {} from "jest";
import { validateAPIUserInfo } from "../../../src/shared/helpers/validateAPIUserInfo";
import { APIUserInfo } from "../../../src/shared/utils/api/userInfoLoader";

const chance = new Chance();
const apiUserInfo: APIUserInfo = {
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
  Email: chance.email(),
  CorporateDonor: true,
  DonorLanguageCode: chance.natural(),
  hidDonorType: chance.word(),
  isLoggedIn: true,
  silent: true
};

describe("helpers/validateAPIUserInfo.test.ts", () => {

  it("should return true when user info passes the validation and user's type is Corporate Donor", () => {
    expect(validateAPIUserInfo(apiUserInfo)).toEqual(true);
  });

  it("should return true when user info passes the validation and user's type is not Corporate Donor", () => {
    apiUserInfo.CorporateDonor = false;
    expect(validateAPIUserInfo(apiUserInfo)).toEqual(true);
  });

  it("should return false if at least one of the fields in user info are not valid to IS_VALID or SKIPPED", () => {
    apiUserInfo.City = null;
    expect(validateAPIUserInfo(apiUserInfo)).toEqual(false);
  });
});
