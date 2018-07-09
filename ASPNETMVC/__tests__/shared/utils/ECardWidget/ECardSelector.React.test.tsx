import * as Chance from "chance";
import { shallow } from "enzyme";
import {} from "jest";
import * as React from "react";
import { ValidationErrorMessage } from "../../../../src/shared/utils/components/ValidationErrorMessage.React";
import {
  ECardComponent,
  ECards,
  ECardSelector,
  ECardSelectorProps,
  TabContentContainers,
  Tabs,
} from "../../../../src/shared/utils/ECardWidget/ECardSelector.React";
import onEnter from "../../../../src/shared/utils/onEnter.EventHelper";

const chance = new Chance();

jest.mock("../../../../src/shared/utils/onEnter.EventHelper");
(onEnter as any).mockImplementation(() => false);

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

  it("should be a div", () => {
    expect(eCardSelector.type()).toEqual("div");
  });

  describe("and its ecard container", () => {
    let eCardContainer;

    beforeEach(() => {
      eCardContainer = eCardSelector.childAt(0);
    });

    it("should be a div", () => {
      expect(eCardContainer.type()).toEqual("div");
    });

    it("should have `ecard-container` class", () => {
      expect(eCardContainer.hasClass("ecard-container")).toBeTruthy();
    });

    describe("and its first columns", () => {
      let firstColumns;

      beforeEach(() => {
        firstColumns = eCardContainer.childAt(0);
      });

      it("should be a div", () => {
        expect(firstColumns.type()).toEqual("div");
      });

      it("should have `ecard-container` class", () => {
        expect(firstColumns.hasClass("columns")).toBeTruthy();
      });

      describe("and its Tabs", () => {
        let tabs;

        beforeEach(() => {
          tabs = firstColumns.childAt(0);
        });

        it("should be a div", () => {
          expect(tabs.type()).toEqual(Tabs);
        });

        it("should have categories as prop", () => {
          expect(tabs.prop("categories")).toEqual(eCardSelector.state().categories);
        });

        it("should have selectedCategoryId as prop", () => {
          expect(tabs.prop("selectedCategoryId")).toEqual(eCardSelector.state().selectedCategoryId);
        });

        it("should have onSelect as prop that updates selected category", () => {
          const onSelect = tabs.prop("onSelect");
          const categoryId = chance.natural();
          onSelect(categoryId);

          expect(eCardSelector.state().selectedCategoryId).toEqual(categoryId);
        });
      });
    });

    describe("and its second columns", () => {
      let secondColumns;

      beforeEach(() => {
        secondColumns = eCardContainer.childAt(2);
      });

      it("should be a div", () => {
        expect(secondColumns.type()).toEqual("div");
      });

      it("should have `ecard-container` class", () => {
        expect(secondColumns.hasClass("columns")).toBeTruthy();
      });

      describe("and its TabContentContainers", () => {
        let tabContentContainers;

        beforeEach(() => {
          tabContentContainers = secondColumns.childAt(0);
        });

        it("should have categories as prop", () => {
          expect(tabContentContainers.prop("categories")).toEqual(eCardSelector.state().categories);
        });

        it("should have selectedCategoryId as prop", () => {
          expect(tabContentContainers.prop("selectedCategoryID")).toEqual(eCardSelector.state().selectedCategoryId);
        });

        it("should have _cardSelected as prop that calls goToPreview()", () => {
          const cardSelected = tabContentContainers.prop("_cardSelected");
          cardSelected();

          expect(testProps.goToPreview).toHaveBeenCalled();
        });

        it("should have onChange as prop that calls goToPreview()", () => {
          const onChange = tabContentContainers.prop("onChange");
          const eCardId = chance.word();
          const eCardDesc = chance.sentence();
          onChange(eCardId, eCardDesc);

          expect(testProps.updateECardInfo).toHaveBeenCalled();
        });
      });
    });
  });

  describe("and its ValidationErrorMessages", () => {
    let validationMessage;

    beforeEach(() => {
      validationMessage = eCardSelector.childAt(1);
    });

    it("should be ValidationErrorMessage", () => {
      expect(validationMessage.type()).toEqual(ValidationErrorMessage);
    });

    it("should have message as a prop", () => {
      expect(validationMessage.prop("message")).toEqual(testProps.validationMessages.ecard_required);
    });

    it("should have message as a prop", () => {
      expect(validationMessage.prop("displayCondition")).toEqual(testProps.showError);
    });
  });

});

describe("<Tabs\>", () => {
  let tabs;
  let testProps;

  beforeEach(() => {

    testProps = {
      categories: [
        {
          CategoryID: chance.natural(),
          CategoryName: chance.word(),
          DefaultCategory: chance.pickone([true, false]),
          EcardImages: [
            {
              id: chance.natural(),
              desc: chance.word(),
              name: chance.word(),
            },
            {
              id: chance.natural(),
              desc: chance.word(),
              name: chance.word(),
            },
          ],
        },
        {
          CategoryID: chance.natural(),
          CategoryName: chance.word(),
          DefaultCategory: chance.pickone([true, false]),
          EcardImages: [
            {
              id: chance.natural(),
              desc: chance.word(),
              name: chance.word(),
            },
            {
              id: chance.natural(),
              desc: chance.word(),
              name: chance.word(),
            },
          ],
        },
      ],
      selectedCategoryId: chance.natural(),
      onSelect: jest.fn(),
    };

    tabs = shallow(<Tabs {...testProps}/>);
  });

  it("should be a ul", () => {
    expect(tabs.type()).toEqual("ul");
  });

  describe("and its children", () => {
    let liChildren;

    beforeEach(() => {
      liChildren = tabs.children();
    });

    it("should be li", () => {
      liChildren.map(liChild => {
        expect(liChild.type()).toEqual("li");
      });
    });

    it("should have <a> children", () => {
      liChildren.map(liChild => {
        expect(liChild.childAt(0).type()).toEqual("a");
      });
    });

    it("their <a> children that have onClick that calls props.onSelect()", () => {
      liChildren.map(liChild => {
        const onClick = liChild.childAt(0).prop("onClick");
        onClick();
        expect(testProps.onSelect).toHaveBeenCalled();
      });
    });

    it("their <a> children that have onKeyDown that calls onEnter()", () => {
      liChildren.map((liChild, index) => {
        const onKeyDown = liChild.childAt(0).prop("onKeyDown");
        onKeyDown({}, testProps.onSelect, testProps.categories[index].CategoryID);
        expect(onEnter).toHaveBeenCalled();
      });
    });
  });
});

describe("<TabContentContainers\>", () => {
  let tabsContentContainers;
  let testProps;

  beforeEach(() => {

    testProps = {
      categories: [
        {
          CategoryID: chance.natural(),
          CategoryName: chance.word(),
          DefaultCategory: chance.pickone([true, false]),
          EcardImages: [
            {
              id: chance.natural(),
              desc: chance.word(),
              name: chance.word(),
            },
            {
              id: chance.natural(),
              desc: chance.word(),
              name: chance.word(),
            },
          ],
        },
        {
          CategoryID: chance.natural(),
          CategoryName: chance.word(),
          DefaultCategory: chance.pickone([true, false]),
          EcardImages: [
            {
              id: chance.natural(),
              desc: chance.word(),
              name: chance.word(),
            },
            {
              id: chance.natural(),
              desc: chance.word(),
              name: chance.word(),
            },
          ],
        },
      ],
      selectedCategoryId: chance.natural(),
      _cardSelected: jest.fn(),
      onChange: jest.fn(),
    };

    tabsContentContainers = shallow(<TabContentContainers {...testProps}/>);
  });

  it("should be a div", () => {
    expect(tabsContentContainers.type()).toEqual("div");
  });

  describe("and its children", () => {
    let sectionChildren;

    beforeEach(() => {
      sectionChildren = tabsContentContainers.children();
    });

    it("should be section", () => {
      sectionChildren.map(sectionChild => {
        expect(sectionChild.type()).toEqual("section");
      });
    });

    it("should have <ECards> children", () => {
      sectionChildren.map(sectionChild => {
        expect(sectionChild.childAt(0).type()).toEqual(ECards);
      });
    });

    it("ECards should have _cardSelected as a prop", () => {
      sectionChildren.map(sectionChild => {
        const _cardSelected = sectionChild.childAt(0).prop("_cardSelected");
        _cardSelected();

        expect(testProps._cardSelected).toHaveBeenCalled();
      });
    });

    it("ECards should have onChange as a prop", () => {
      sectionChildren.map(sectionChild => {
        const onChange = sectionChild.childAt(0).prop("onChange");
        onChange();

        expect(testProps.onChange).toHaveBeenCalled();
      });
    });
  });
});

describe("<ECards\>", () => {
  let eCards;
  let testProps;

  beforeEach(() => {

    testProps = {
      ecards: [
        {
          id: chance.natural(),
          desc: chance.word(),
          name: chance.word(),
        },
      ],
      _cardSelected: jest.fn(),
      onChange: jest.fn(),
    };

    eCards = shallow(<ECards {...testProps}/>);
  });

  it("should be a fieldset", () => {
    expect(eCards.type()).toEqual("fieldset");
  });

  describe("should have row child", () => {
    let row;

    beforeEach(() => {
      row = eCards.childAt(0);
    });

    it("should be a div", () => {
      expect(row.type()).toEqual("div");
    });

    describe("and its children", () => {
      let eCardChildren;

      beforeEach(() => {
        eCardChildren = row.children();
      });

      it("should be ECardComponent", () => {
        eCardChildren.map(eCardChild => {
          expect(eCardChild.type()).toEqual(ECardComponent);
        });
      });

      it("its children should have _cardSelected as a prop", () => {
        eCardChildren.map(eCardChild => {
          const _cardSelected = eCardChild.prop("_cardSelected");
          _cardSelected();

          expect(testProps._cardSelected).toHaveBeenCalled();
        });
      });

      it("its children should have onChange as a prop", () => {
        eCardChildren.map(eCardChild => {
          const onChange = eCardChild.prop("onChange");
          onChange();

          expect(testProps.onChange).toHaveBeenCalled();
        });
      });
    });
  });
});

describe("<ECardComponent\>", () => {
  let eCardComponent;
  let testProps;

  beforeEach(() => {

    testProps = {
      ecard: {
        id: chance.natural(),
        desc: chance.word(),
        name: chance.word(),
      },
      _cardSelected: jest.fn(),
      onChange: jest.fn(),
    };

    eCardComponent = shallow(<ECardComponent {...testProps}/>);
  });

  it("should be a div", () => {
    expect(eCardComponent.type()).toEqual("div");
  });

  describe("and its input child", () => {
    let input;

    beforeEach(() => {
      input = eCardComponent.childAt(0);
    });

    it("should be an <input>", () => {
      expect(input.type()).toEqual("input");
    });

    it("should have onKeyDown prop that calls onEnter", () => {
      const onKeyDown = input.prop("onKeyDown");
      onKeyDown();

      expect(onEnter).toHaveBeenCalled();
    });

    it("should have onChange prop", () => {
      const onChange = input.prop("onChange");
      onChange();

      expect(testProps.onChange).toHaveBeenCalled();
    });
  });

  describe("and its label child", () => {
    let label;

    beforeEach(() => {
      label = eCardComponent.childAt(1);
    });

    it("should be a <label>", () => {
      expect(label.type()).toEqual("label");
    });

    it("should have onClick prop", () => {
      const onClick = label.prop("onClick");
      onClick();

      expect(testProps._cardSelected).toHaveBeenCalled();
    });
  });
});