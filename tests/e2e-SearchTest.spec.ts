import { test, expect } from "../fixtures/fixture";

//Load the json data
const configData = require("../config.json");
const productName: string = configData.productInfo.itemName;
test.describe("Search", { tag: "@e2e" }, async () => {
  //Preconditions
  test.beforeEach(
    "It can navigate to the 'Welcome Page' and accept the 'Terms'",
    async ({ welcomePage }) => {
      await welcomePage.launchAndAcceptTerms();
    }
  );

  test("C7520: Search becomes active", async ({ homePage }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that search becomes active after entering 3 characters",
    });

    await test.step("It can click in the Search bar & validate the Cursor is visible and the Search Bar icon is inactive", async () => {
      //Click inside the Search Bar
      await homePage.clickSearchInputBox();

      //Validating if the cursor is active on click - Search Input Box
      await expect(await homePage.getLocator_cursorActive(), {
        message: "Cursor is visible ",
      }).toBeVisible();

      //Validating if the search icon is inactive/disabled - Search Input Box
      await expect(await homePage.getLocator_stateSearchIcon(), {
        message: "Search Bar icon is inactive.",
      }).toBeDisabled();
    });

    await test.step("It can enter two characters & validate Search bar icon is inactive", async () => {
      await homePage.enterTwoChar_SearchItemBox(configData.productInfo.twoChar);

      //Validating if the search icon is disabled after entering two characters- Search Input Box
      await expect(await homePage.getLocator_stateSearchIcon(), {
        message: "Search Bar icon is inactive.",
      }).toBeDisabled();
    });

    await test.step("It can add an additional character & validate Search Bar icon becomes active.", async () => {
      //Enter one more character
      await homePage.enterSingleChar_SearchItemBox(
        configData.productInfo.singleChar
      );

      //Validating if the search icon is enabled - Search Input Box
      await expect(await homePage.getLocator_stateSearchIcon(), {
        message: "Search Bar icon becomes active.",
      }).toBeEnabled();
    });
  });

  test("C7521: Search displays valid results", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that searching for a valid product will display matches that are relevant to the search.",
    });

    await test.step("It can click in the Search bar & validate the Cursor is visible and the Search Bar icon is inactive", async () => {
      //Click inside the Search Bar
      await homePage.clickSearchInputBox();

      //Validating if the cursor is active on click - Search Input Box
      await expect(await homePage.getLocator_cursorActive(), {
        message: "Cursor is visible ",
      }).toBeVisible();

      //Validating if the search icon is inactive/disabled - Search Input Box
      await expect(await homePage.getLocator_stateSearchIcon(), {
        message: "Search Bar icon is inactive.",
      }).toBeDisabled();
    });

    await test.step("It can enter a search term for that will generate results & validate Search Bar icon becomes active.", async () => {
      //Search the valid product name
      await homePage.enterProductNameToSearchBox(productName);

      //Validating if the search icon is enabled - Search Input Box
      await expect(await homePage.getLocator_stateSearchIcon(), {
        message: "Search Bar icon becomes active.",
      }).toBeEnabled();
    });

    await test.step("It can click on the Search Bar icon & validate results are displayed that match the term entered", async () => {
      //clicking on the search icon - Search Input Box
      await homePage.click_SearchIcon_SearchInputBox();

      // Validating if the results matches the enetered product name
      await expect(
        await productListingPage.getLocator_addToCartButtonForDesiredProduct(
          productName
        )
      ).toBeVisible();
    });
  });

  //Test Case 3
  test("C7522: No search results", async ({ homePage, productListingPage }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that searching for an invalid product will display a message that search returned no results",
    });
    await test.step("It can click in the Search bar & validate the Cursor is visible and the Search Bar icon is inactive", async () => {
      //Click inside the Search Bar
      await homePage.clickSearchInputBox();

      //Validating if the cursor is active on click - Search Input Box
      await expect(await homePage.getLocator_cursorActive(), {
        message: "Cursor is visible ",
      }).toBeVisible();

      //Validating if the search icon is inactive/disabled - Search Input Box
      await expect(await homePage.getLocator_stateSearchIcon(), {
        message: "Search Bar icon is inactive.",
      }).toBeDisabled();
    });

    await test.step("It can enter a term that or string or a string of over 3 characters that will not generate results & validate Search Bar icon becomes active", async () => {
      //Enter an invalid item name/string that will not generate the results
      await homePage.enterProductNameToSearchBox(
        configData.productInfo.invalidItemName
      );
      //Validating if the search icon is enabled - Search Input Box
      await expect(await homePage.getLocator_stateSearchIcon(), {
        message: "Search Bar icon becomes active",
      }).toBeEnabled();
    });

    await test.step("It can click on the Search Bar icon & validate search returned no results", async () => {
      await homePage.click_SearchIcon_SearchInputBox();

      //Validating that it should not return the result
      await expect(
        await await productListingPage.getLocator_noProductFoundText(),
        { message: "Your search returned no results" }
      ).toContainText(configData.appConstants.noSearchResult);
    });
  });

  test("C7523: Search makes suggestions", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that once you begin typing the name of a specific item that search suggestions are made",
    });

    await test.step("It can click in the Search bar & validate the Cursor is visible and the Search Bar icon is inactive", async () => {
      //Click inside the Search Bar
      await homePage.clickSearchInputBox();

      //Validating if the cursor is active on click - Search Input Box
      await expect(await homePage.getLocator_cursorActive(), {
        message: "Cursor is visible ",
      }).toBeVisible();

      //Validating if the search icon is inactive/disabled - Search Input Box
      await expect(await homePage.getLocator_stateSearchIcon(), {
        message: "Search Bar icon is inactive.",
      }).toBeDisabled();
    });

    await test.step("It can begin typing the name of the product & validate search suggestion appears under the search bar", async () => {
      await homePage.autoSuggest_searchProduct(
        await configData.productInfo.autoSuggestItem
      );

      // Validating search suggestion appears
      await expect(
        await (await homePage.getLocator_autoSuggestionsList()).first()
      ).toBeVisible();
    });
    await test.step("It can click on the search suggestion & validate results are displayed that match the search suggestion", async () => {
      const list = await homePage.getLocator_autoSuggestionsList();

      const firstSuggestion = await list.first().innerText();

      await list.first().click();
      const productGridList = await productListingPage.getLocator_productGrid();

      await expect((await productGridList.innerText()).toLowerCase()).toContain(
        firstSuggestion.toLowerCase()
      );
    });
  });
  test("C7584: Search by SKU", async ({ homePage, productListingPage }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that searching for a specific products SKU number displays the correct result.",
    });

    await test.step("It can click in the Search bar & validate the Cursor is visible and the Search Bar icon is inactive", async () => {
      //Click inside the Search Bar
      await homePage.clickSearchInputBox();

      //Validating if the cursor is active on click - Search Input Box
      await expect(await homePage.getLocator_cursorActive(), {
        message: "Cursor is visible ",
      }).toBeVisible();

      //Validating if the search icon is inactive/disabled - Search Input Box
      await expect(await homePage.getLocator_stateSearchIcon(), {
        message: "Search Bar icon is inactive.",
      }).toBeDisabled();
    });

    await test.step("It can enter a product SKU number & validate search Bar icon becomes active.", async () => {
      //Enter SKU number
      await homePage.enterProductNameToSearchBox(configData.productInfo.sku);

      //Validating if the search icon is enabled - Search Input Box
      await expect(await homePage.getLocator_stateSearchIcon(), {
        message: "Search Bar icon becomes active.",
      }).toBeEnabled();
    });

    await test.step("It can click on Search Bar icon & validate User is brought to the Item page that matches the SKU that was entered", async () => {
      //Clicking on the search icon - Search Input Box
      await homePage.click_SearchIcon_SearchInputBox();

      //Fetching the searched SKU product name
      const productName = await (
        await productListingPage.getLocator_productNameLink_forSKUsearch()
      ).innerText();

      //Validating the SKU linked product is displayed
      await expect(productName).toEqual(
        await configData.productInfo.skuItemName
      );

      const toolbarCount = await (
        await productListingPage.getLocator_productSearchedCount_SKUsearch()
      ).innerText();
      //Validating only one result is found for the searched SKU
      await expect(Number(toolbarCount)).toEqual(1);
    });
  });
});
