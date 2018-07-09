import * as Chance from "chance";
import {} from "jest";
import { getSenderName } from "../../../src/shared/helpers/getSenderName";
import { DonorType } from "../../../src/shared/constants/User";
import { BasicUserInfo } from "../../../src/shared/interfaces";

const chance = new Chance();
const basicUserInfo: BasicUserInfo = {
  firstName: chance.word(),
  lastName: chance.word(),
  companyName: chance.word(),
  email: chance.word(),
  donorType: DonorType.company,
};

describe("helpers/getSenderName.test.ts", () => {

  it("should return companyName if donor type is company", () => {
    expect(getSenderName(basicUserInfo)).toEqual(basicUserInfo.companyName);
  });

  it("should return concantinated first name and last name if they exist and if donor type is personal", () => {
    basicUserInfo.donorType = DonorType.personal;
    expect(getSenderName(basicUserInfo)).toEqual(`${basicUserInfo.firstName} ${basicUserInfo.lastName}`);
  });

  it("should return first name and no last name if a firstName exists, but no lastName was provided and if donor type is personal", () => {
    basicUserInfo.donorType = DonorType.personal;
    basicUserInfo.lastName = "";
    expect(getSenderName(basicUserInfo)).toEqual(basicUserInfo.firstName);
  });

  it("should return last name and no first name if a lastName exists, but no firstName was provided and if donor type is personal", () => {
    basicUserInfo.donorType = DonorType.personal;
    basicUserInfo.lastName = chance.word();
    basicUserInfo.firstName = "";
    expect(getSenderName(basicUserInfo)).toEqual(basicUserInfo.lastName);
  });

  it("should return empy string if no last and first names were provided and if donor type is personal", () => {
    basicUserInfo.donorType = DonorType.personal;
    basicUserInfo.lastName = "";
    basicUserInfo.firstName = "";
    expect(getSenderName(basicUserInfo)).toEqual("");
  });
});
