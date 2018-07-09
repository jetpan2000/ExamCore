import * as Chance from "chance";
import { shallow } from "enzyme";
import {} from "jest";
import * as React from "react";
import { eCardAPILoader } from "../../../../src/shared/utils/api/eCards/eCardAPI";
import { ECardSelector, ECardSelectorProps } from "../../../../src/shared/utils/ECardWidget/ECardSelector.React";

const chance = new Chance();

const categoryID1 = chance.natural();
const categoryName1 = chance.word();
const eCardImageID1 = chance.natural();
const eCardImageDesc1 = chance.sentence();
const eCardImageName1 = chance.word();
const categoryID2 = chance.natural();
const categoryName2 = chance.word();
const eCardImageID2 = chance.natural();
const eCardImageDesc2 = chance.sentence();
const eCardImageName2 = chance.word();

const eCardCategories = [
  {
    CategoryID: categoryID1,
    CategoryName: categoryName1,
    DefaultCategory: true,
    EcardImages: [
      {
        id: eCardImageID1,
        desc: eCardImageDesc1,
        name: eCardImageName1,
      },
    ],
  },
  {
    CategoryID: categoryID2,
    CategoryName: categoryName2,
    DefaultCategory: true,
    EcardImages: [
      {
        id: eCardImageID2,
        desc: eCardImageDesc2,
        name: eCardImageName2,
      },
    ],
  },
];

jest.mock("../../../../src/shared/utils/api/eCards/eCardAPI");
eCardAPILoader.mockImplementation(data => Promise.resolve(eCardCategories));

describe("<ECardSelector />", () => {
  let eCardSelector;
  let testProps: ECardSelectorProps;

  beforeEach(() => {

    testProps = {
      validationMessages: {
        ecard_required: chance.word(),
        field_required: chance.word(),
        invalid_data: chance.word(),
        characters_remaining: chance.word(),
      },
      text: {
        recipient_details: chance.word(),
        recipient_name: chance.word(),
        recipient_email: chance.word(),
        sender_details: chance.word(),
        sender_name: chance.word(),
        sender_email: chance.word(),
        message: chance.word(),
        ecard_preview: chance.word(),
        has_sent_you_an_ecard: chance.word(),
        change_ecard: chance.word(),
        email: chance.word(),
        copy_from_above: chance.word(),
        ecard_category: chance.word(),
      },
      hidden: false,
      lang: chance.pickone(["en", "fr"]),
      pageId: chance.natural(),
      updateECardInfo: jest.fn(),
      goToPreview: jest.fn(),
      showError: false,
    };

    eCardSelector = shallow(<ECardSelector {...testProps}/>);
  });

  it("should call eCardAPILoader andd change the state of the component", () => {
    expect(eCardAPILoader).toHaveBeenCalled();
    expect(eCardSelector.state().categories).toEqual(eCardCategories);
  });
});