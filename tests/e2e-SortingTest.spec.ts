import { test, expect } from "../fixtures/fixture";

//Load the json data
const configData = require("../config.json");
const appConstant = configData.appConstants;

test.describe("Sorting", { tag: "@e2e" }, async () => {
  //Preconditions
  test.beforeEach(
    "It can accept the 'Terms' and 'Login' to the application",
    async ({ loginPage }) => {
      await loginPage.launchAndLogin(configData.username, configData.password);
    }
  );

  test("C7594: Results can be sorted by Product Name in Ascending Order", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that search results can be sorted by Product Name in Ascending Order.",
    });

    await homePage.clickBrowseAllButton();
    await test.step("It can validate search results are displayed for all liquor types", async () => {
      const actualTitle = await productListingPage.getPageTitle();

      expect(actualTitle.toLowerCase()).toEqual(
        appConstant.titleLiquorCategoryPage.toLowerCase()
      );

      const breadCrumbValue =
        await productListingPage.getBreadCrumbValue_selectedCategory();
      expect(breadCrumbValue).toEqual(appConstant.breadCrumbLiquor);
    });

    await test.step("It can validate all liquor results are displayed and sorted by Product Name in Ascending Order", async () => {
      const productNames = await productListingPage.getProductNames();

      // Create a sorted copy (lexicographic)
      const sorted = [...productNames].sort();

      // Validate the items order show clear results if order is wrong
      for (let i = 0; i < productNames.length; i++) {
        expect(
          productNames[i],
          `Product name at index ${i}, expected : ${sorted[i]} & found : ${productNames[i]}`
        ).toBe(sorted[i]);
      }
    });
  });

  test("C7595: Results can be sorted by Product Name in Descending Order", async ({
    productListingPage,
    homePage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that search results can be sorted by Product Name in Descending Order.",
    });

    await homePage.clickBrowseAllButton();
    await test.step("It can validate search results are displayed for all liquor types", async () => {
      const actualTitle = await productListingPage.getPageTitle();

      expect(actualTitle.toLowerCase()).toEqual(
        appConstant.titleLiquorCategoryPage.toLowerCase()
      );

      const breadCrumbValue =
        await productListingPage.getBreadCrumbValue_selectedCategory();
      expect(breadCrumbValue).toEqual(appConstant.breadCrumbLiquor);
    });

    await test.step("It can click on the Arrow next to the Product Name dropdown", async () => {
      await productListingPage.clickSortByArrow_setDescending();
    });

    await test.step("It can validate items are displayed and sorted by Product Name in Descending Order", async () => {
      const productNames = await productListingPage.getProductNames();

      // Create a sorted copy (descending lexicographic)
      const sorted = [...productNames].sort((a, b) => b.localeCompare(a));

      // Validate the items order show clear results if order is wrong
      for (let i = 0; i < productNames.length; i++) {
        expect(
          productNames[i],
          `Product name at index ${i}, expected : ${sorted[i]} & found : ${productNames[i]}`
        ).toBe(sorted[i]);
      }
    });
  });
});
