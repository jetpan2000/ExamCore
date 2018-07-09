import * as Chance from "chance";
import "isomorphic-fetch";
import {} from "jest";
import { fetchWrapper, makeRequest, makeUnparsedRequest } from "../../../src/shared/utils/fetchWrapper";

const chance = new Chance();

const expectedData = {
  "PageID": chance.natural(),
  "PageName": chance.word(),
  "PageStatus": chance.word(),
  "BackgroundProperties": {
    "color": chance.word(),
    "position": chance.word(),
    "tile": chance.word(),
  },
  "BrandingProperties": {
    "titleBarTextColor": chance.word(),
    "titleBarBackgroundColor": chance.word(),
    "accentColor": chance.word(),
   },
};
const expectedFetchRequestURL = `/services/wa/api/donatenowpage/${chance.pickone(["en", "fr"])}/${chance.natural()}`;
const fetchInstance = fetchWrapper({url: expectedFetchRequestURL});

describe("utils/fetchWrapper.ts", () => {

  it("should call fetchWrapper.get and return parsed data after successful API call", () => {
    (fetch as any).mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success", headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": "",
      },
    });

    return fetchInstance.get().then(data => {
      expect(data).toEqual(expectedData);
      expect((fetch as any).mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
    });
  });

  it("should call fetchWrapper.get and return error after bad API call", () => {
    const fakeException = JSON.stringify("Unable to complete your request");
    const fakeStatus = {
      status: 400,
      statusText: "Bad Request",
    };

    (fetch as any).mockResponse(fakeException, fakeStatus);

    return fetchInstance.get().catch(e => {
      expect(e.ok).toEqual(false);
    });
  });

  it("should call fetchWrapper.get and return unparsed data", () => {
    (fetch as any).mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success" });

    return fetchInstance.get().then(data => {
      expect(data).toEqual(JSON.stringify(expectedData));
      expect((fetch as any).mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
    });
  });

  it("should call fetchWrapper.post if no parameters are provided", () => {
    (fetch as any).mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success", headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": "",
      },
    });

    return fetchInstance.post().then(data => {
      expect(data).toEqual(expectedData);
      expect((fetch as any).mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
    });
  });

  it("should call fetchWrapper.post if body is passed as a parameter", () => {
    (fetch as any).mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success", headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": "",
      },
    });

    const body = {
      "mockBody": chance.word(),
    };

    return fetchInstance.post(body).then(data => {
      expect(data).toEqual(expectedData);
      expect((fetch as any).mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
    });
  });

  it("should call fetchWrapper.put if body is not passed as a parameter", () => {
    (fetch as any).mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success", headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": "",
      },
    });

    return fetchInstance.put().then(data => {
      expect(data).toEqual(expectedData);
      expect((fetch as any).mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
    });
  });

  it("should call fetchWrapper.request if body is not passed as a parameter", () => {
    (fetch as any).mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success", method: "GET", headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": "",
      },
    });

    return fetchInstance.request().then(data => {
      expect(typeof data).toEqual("object");
      expect((fetch as any).mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
    });
  });

  it("should call fetchWrapper.put if body is passed as a parameter", () => {
    (fetch as any).mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success", headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": "",
      },
    });

    const body = {
      "mockBody": chance.word(),
    };

    return fetchInstance.put(body).then(data => {
      expect(data).toEqual(expectedData);
      expect((fetch as any).mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
    });
  });

  it("should call fetchWrapper.delete", () => {
    (fetch as any).mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success", headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": "",
      },
    });

    return fetchInstance.delete().then(data => {
      expect(data).toEqual(expectedData);
      expect((fetch as any).mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
    });
  });

  it("should call fetchWrapper.head", () => {
    (fetch as any).mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success", headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": "",
      },
    });

    return fetchInstance.head().then(data => {
      expect(data).toEqual(expectedData);
      expect((fetch as any).mock.calls[0][0].url).toEqual(expectedFetchRequestURL);
    });
  });

  /*
  it("should call makeRequest and return error after bad API call", () => {
    const fakeException = JSON.stringify("Unable to complete your request");
    const fakeStatus = {
      status: 400,
      statusText: "Bad Request",
    };

    (fetch as any).mockResponse(fakeException, fakeStatus);

    return makeRequest(expectedFetchRequestURL).catch(e => {
      expect(e.ok).toEqual(false);
    });
  });

  it("should call makeUnparsedRequest and return error after bad API call", () => {
    const fakeException = JSON.stringify("Unable to complete your request");
    const fakeStatus = {
      status: 500,
      statusText: "Bad Request",
    };

    (fetch as any).mockResponse(fakeException, fakeStatus);

    return makeUnparsedRequest(chance.word()).catch(e => {
      expect(e.ok).toEqual(false);
    });
  });
  */
});
