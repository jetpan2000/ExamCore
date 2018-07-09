import * as Chance from "chance";
import "isomorphic-fetch";
import {} from "jest";
import { eCardAPIEndpoint, eCardAPILoader } from "../../../../../src/shared/utils/api/eCards/eCardAPI";

const chance = new Chance();

const expectedData = {
  "CategoryID": chance.natural(),
  "CategoryName": chance.word(),
  "DefaultCategory": chance.pickone(["en", "fr"]),
  "EcardImages": [],
};
const pageID = chance.natural();
const lang = chance.pickone(["en", "fr"]);
const expectedFetchRequestURL = `/services/wa/api/donatenowpage/${lang}/${pageID}/ecarddetails`;

describe("util/api/CDN/cdnAPI.test.ts", () => {

  it("should return proper data with cdn endpoint after successful API call", () => {
    fetch.mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": "",
      },
    });

    return eCardAPILoader(eCardAPIEndpoint.cdn(lang, pageID)).then(data => {
      expect(fetch.mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
      expect(typeof(data)).toEqual("object");
      expect(data).toEqual(expectedData);
    });
  });

  it("should return proper data with general endpoint after successful API call", () => {
    fetch.mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": "",
      },
    });

    return eCardAPILoader().then(data => {
      expect(fetch.mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
      expect(typeof(data)).toEqual("object");
      expect(data).toEqual(expectedData);
    });
  });

  it("should set Response.ok to false after bad API call", () => {
    const fakeException = JSON.stringify("Unable to complete your request");
    const fakeStatus = {
      status: 400,
      statusText: "Bad Request",
    };

    fetch.mockResponse(fakeException, fakeStatus);

    return eCardAPILoader(eCardAPIEndpoint.cdn(lang, pageID)).catch((e) => {
      expect(e.ok).toEqual(false);
    });
  });

});
