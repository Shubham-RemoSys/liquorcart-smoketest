import { test, expect } from "../fixtures/fixture";
const configData = require("../config.json");

test.describe(
  "Add to Cart Test for Logged-In user",
  { tag: "@login" },
  async () => {
    test("It can validate product addition to the cart", async ({
      loginPage,
      homePage,
      productListingPage,
      minicartPage,
      shoppingCartPage,
    }) => {
      //Launch and login to the application
      await loginPage.launchApp();
      await loginPage.clickSignInButton();
      await loginPage.login(configData.username, configData.password);

      // Clear the cart
      await minicartPage.clearCart();

      await test.step("It can add a product to the cart", async () => {
        await homePage.clickHamburgerMenu();
        await homePage.clickProductCategory(
          configData.productInfo.itemCategory
        );
        await productListingPage.findAndAddProductToCart(
          configData.productInfo.itemName
        );
      });
      await test.step("It can navigate to the shopping cart page & validate the product is added to the cart", async () => {
        await productListingPage.navigateToShoppingCartFromNotification();
        await expect(
          await shoppingCartPage.getLocator_productName_shoppingCart(
            configData.productInfo.itemName
          ),
          "The product should be present in the cart."
        ).toBeVisible();
      });
    });
  }
);
