import * as Chance from "chance";
import {} from "jest";
import urlParser from "../../../src/shared/utils/urlParser";

const chance = new Chance();
const hostNameStr = `www.${chance.word()}`;
const queryString = chance.word();
const pathNameStr = `/${chance.word()}/${chance.word()}/`;
let hrefStr = `https://${hostNameStr}${pathNameStr}?q=${queryString}`;
Object.defineProperty(location, "href", {
  value: hrefStr,
  configurable: true,
});

const mask = "/:lang(en|fr)/dn/:id([0-9]+)/:page?";

describe("utils/urlParser.test.ts", () => {

  describe("and its urlParser.queryString", () => {
    it("should return url's query string", () => {
      expect(urlParser.queryString(hrefStr)).toEqual({q: queryString});
      expect(urlParser.queryString()).toEqual({q: queryString});
    });
  });

  describe("and its urlParser.hostName", () => {
    it("should return url's hostname", () => {
      expect(urlParser.hostName(hrefStr)).toEqual(hostNameStr);
      expect(urlParser.hostName()).toEqual(hostNameStr);
    });
  });

  describe("and its urlParser.pathname", () => {
    it("should return url's pathname", () => {
      expect(urlParser.path(hrefStr)).toEqual(pathNameStr);
      expect(urlParser.path()).toEqual(pathNameStr);
    });
  });

  describe("and its urlParser.pathValuesByMask", () => {
    let language;
    let id;
    let pageNumber;
    let pathNameMaskStr;

    beforeEach(() => {
      language = chance.pickone(["en", "fr"]);
      id = chance.natural({min: 100000000, max: 999999999});
      pageNumber = chance.natural();
      pathNameMaskStr = `/${language}/dn/${id}/${pageNumber}`;
      hrefStr = `https://${hostNameStr}${pathNameMaskStr}?q=${queryString}`;
    });

    it("should return null when url does not match a mask", () => {
      expect(urlParser.pathValuesByMask(chance.word(), hrefStr)).toEqual(null);
      expect(urlParser.pathValuesByMask(chance.word())).toEqual(null);
    });

    it("should return proper object", () => {
      const expectedObject = urlParser.pathValuesByMask(mask, hrefStr);
      expect(expectedObject.url).toEqual(pathNameMaskStr);
      expect(expectedObject.values.lang).toEqual(language);
      expect(expectedObject.values.id).toEqual(id.toString());
      expect(expectedObject.values.page).toEqual(pageNumber.toString());
    });
  });

});
