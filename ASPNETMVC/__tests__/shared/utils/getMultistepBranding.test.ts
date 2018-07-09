import * as Chance from "chance";
import {} from "jest";
import { cloneDeep } from "lodash";

import { PageInfo } from "../../../src/shared/interfaces/PageInfo";
import { getMultistepBranding } from "../../../src/shared/utils/";

describe("utils/getMultistepBranding.test.ts", () => {

  const chance = new Chance();

  const defaultValues = {
    multistepTextColour: "white",
    multistepOverlay: true,
  };

  const defaultBranding: PageInfo["BrandingProperties"] = {
    titleBarBackgroundColor: "#000",
    titleBarTextColor: "#FFF",
    accentColor: "#0f0",
    multistepTextColour: "black",
    multistepOverlay: false,
  };

  it("should return default values if branding object is undefined, empty, or null", () => {
    expect(getMultistepBranding(null)).toEqual(defaultValues);
    expect(getMultistepBranding(undefined)).toEqual(defaultValues);
    expect(getMultistepBranding({} as any)).toEqual(defaultValues);
  });
  it("should return default values if branding object is missing properties", () => {
    const badBranding = cloneDeep(defaultBranding);

    delete badBranding.multistepOverlay;
    delete badBranding.multistepTextColour;
    expect(getMultistepBranding(badBranding)).toEqual(defaultValues);
  });

  it("should return default values if text color is not a string or an empty string", () => {
    const badBranding = cloneDeep(defaultBranding);
    delete badBranding.multistepOverlay;
    badBranding.multistepTextColour = 55 as any;
    expect(getMultistepBranding(badBranding)).toEqual(defaultValues);
    badBranding.multistepTextColour = "" as any;
    expect(getMultistepBranding(badBranding)).toEqual(defaultValues);
    badBranding.multistepTextColour = null as any;
    expect(getMultistepBranding(badBranding)).toEqual(defaultValues);
    badBranding.multistepTextColour = false as any;
    expect(getMultistepBranding(badBranding)).toEqual(defaultValues);
  });

  it("should return valid properties if available", () => {
    const goodBranding = cloneDeep(defaultBranding);
    const expectedValues = cloneDeep(defaultValues);

    expectedValues.multistepOverlay = goodBranding.multistepOverlay;
    expectedValues.multistepTextColour = goodBranding.multistepTextColour;
    expect(getMultistepBranding(goodBranding)).toEqual(expectedValues);
  });

  it("should return overlay property even if text property is missing", () => {
    const mixedBranding = cloneDeep(defaultBranding);
    const expectedValues = cloneDeep(defaultValues);

    delete mixedBranding.multistepTextColour;
    expectedValues.multistepOverlay = mixedBranding.multistepOverlay;

    expect(getMultistepBranding(mixedBranding)).toEqual(expectedValues);
  });

  it("should return text property even if overlay property is missing", () => {
    const mixedBranding = cloneDeep(defaultBranding);
    const expectedValues = cloneDeep(defaultValues);

    delete mixedBranding.multistepOverlay;
    expectedValues.multistepTextColour = mixedBranding.multistepTextColour;

    expect(getMultistepBranding(mixedBranding)).toEqual(expectedValues);
  });
});