import { test, expect } from "../fixtures/fixture";
//Load the json data
const configData = require("../config.json");

test.describe("Product Search Test", { tag: "@guest" }, async () => {
  test.beforeEach("It can navigate to the Home Page", async ({ loginPage }) => {
    await loginPage.launchApp();
  });
  test("It can search a valid product", async ({
    homePage,
    productListingPage,
  }) => {
    const productName: string = configData.productInfo.itemName;

    //Search the valid product name
    await homePage.searchProduct(productName);

    await test.step("It can navigate to the product listing page & validate that the searched product should be displayed", async () => {
      await expect(
        await productListingPage.getLocator_addToCartButtonForDesiredProduct(
          productName
        )
      ).toBeVisible();
    });
  });

  test("It can validate invalid search result", async ({
    homePage,
    productListingPage,
  }) => {
    //Search the invalid product name
    const invalidProductName: string = configData.productInfo.invalidItemName;
    await homePage.searchProduct(invalidProductName);

    await test.step("Navigate to the product listing page & validate invalid searched result", async () => {
      await expect(
        await productListingPage.getLocator_noProductFoundText()
      ).toBeVisible({ timeout: 15000 });
    });
  });
});
