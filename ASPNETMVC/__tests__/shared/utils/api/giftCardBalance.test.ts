import * as Chance from "chance";
import "isomorphic-fetch";
import {} from "jest";
import { giftCardBalanceEndpoint, loadGiftCardBalance } from "../../../../src/shared/utils/api/giftCardBalance";

const chance = new Chance();

const cardNumber = chance.word();
describe("util/api/giftCardBalance.test.ts", () => {

    it("should call fetchWrapper.get and return object", () => {
      const expectedData = {
        "mockData": chance.word(),
      };
      fetch.mockResponse(JSON.stringify(expectedData), { status: 200, statusText: "Success",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": "",
        },
      };

      const endPoint = giftCardBalanceEndpoint.default(cardNumber);

      return loadGiftCardBalance(cardNumber).then(data => {
        expect(typeof(data)).toEqual(typeof(expectedData));
        expect(data).toEqual(expectedData);
        expect(fetch.mock.calls[0][0].url).toEqual(endPoint);
      });
    });

});
