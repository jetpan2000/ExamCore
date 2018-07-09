// Testing tools import
import {} from "jest";

import { CreditUpdateValues, GiftCardUpdateValues } from "../../../src/shared/helpers/paymentUpdateHelper";

import { getConfigValue } from "../../../src/shared/utils";

// tslint:disable:variable-name
// tslint:disable:no-string-literal

describe("utils.getCardConfigValue", () => {

  const gcConfig_complete: GiftCardUpdateValues = {
    giftCardNumber: "abcd1234",
    giftCardAmount: 40,
    giftCardBalance: 30,
  };
  const ccConfig_complete: CreditUpdateValues = {
    fullName: "John B Cardholder",
    number: "4545454545454545",
    expiryMonth: "12",
    expiryYear: "2017",
    cvn: "333",
  };
  const falsyConfig = {
    propA: null,
    propB: 0,
    propC: undefined,
    propD: "",
    propE: false,
  };

  const defaultValue = "Default Value";

  it("should always return property if it exists", () => {
    // Credit Card
    expect(getConfigValue("fullName", defaultValue, ccConfig_complete)).toBe(ccConfig_complete["fullName"]);
    expect(getConfigValue("number", defaultValue, ccConfig_complete)).toBe(ccConfig_complete["number"]);
    expect(getConfigValue("expiryYear", defaultValue, ccConfig_complete)).toBe(ccConfig_complete["expiryYear"]);
    expect(getConfigValue("expiryMonth", defaultValue, ccConfig_complete)).toBe(ccConfig_complete["expiryMonth"]);
    expect(getConfigValue("cvn", defaultValue, ccConfig_complete)).toBe(ccConfig_complete["cvn"]);
    // Gift Card
    expect(getConfigValue("giftCardNumber", defaultValue, gcConfig_complete)).toBe(gcConfig_complete["giftCardNumber"]);
    expect(getConfigValue("giftCardAmount", defaultValue, gcConfig_complete)).toBe(gcConfig_complete["giftCardAmount"]);
    expect(getConfigValue("giftCardBalance", defaultValue, gcConfig_complete)).toBe(gcConfig_complete["giftCardBalance"]);
  });

  it("should return default value for a non-existant property", () => {
    expect(getConfigValue("badProperty", defaultValue, ccConfig_complete)).toBe(defaultValue);
    expect(getConfigValue("badProperty", defaultValue, gcConfig_complete)).toBe(defaultValue);
    expect(getConfigValue("badProperty", defaultValue, falsyConfig)).toBe(defaultValue);
    expect(getConfigValue("badProperty", defaultValue, {})).toBe(defaultValue);
  });

  it("should return default value for an empty or non-existent config object", () => {
    expect(getConfigValue("fullName", defaultValue, {})).toBe(defaultValue);
    expect(getConfigValue("giftCardBalance", defaultValue)).toBe(defaultValue);
  });

  it("should always return the value for an explicitly set property, even if null or falsy values", () => {
    expect(getConfigValue("propA", defaultValue, falsyConfig)).toBe(falsyConfig["propA"]);
    expect(getConfigValue("propB", defaultValue, falsyConfig)).toBe(falsyConfig["propB"]);
    expect(getConfigValue("propC", defaultValue, falsyConfig)).toBe(falsyConfig["propC"]);
    expect(getConfigValue("propD", defaultValue, falsyConfig)).toBe(falsyConfig["propD"]);
    expect(getConfigValue("propE", defaultValue, falsyConfig)).toBe(falsyConfig["propE"]);
  });

});
