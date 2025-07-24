import { test, expect } from "../fixtures/fixture";
const configData = require("../config.json");
test.describe("Cart Retain Test", { tag: "@login" }, async () => {
  test("It can reatin the cart items when transitioning from guest to logged-in user.", async ({
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

    //SignOut from the application
    await homePage.clickSignOutButton();

    await test.step("It can add a product to the cart", async () => {
      await homePage.clickHamburgerMenu();
      await homePage.clickProductCategory(configData.productInfo.itemCategory);
      await productListingPage.findAndAddProductToCart(
        configData.productInfo.itemName
      );
    });
    await test.step("It can navigate to the shopping cart page & login to the app", async () => {
      await productListingPage.navigateToShoppingCartFromNotification();
    });

    //Login to the application after navigating to the cart page
    await loginPage.clickSignInButton();
    await loginPage.login(configData.username, configData.password);

    await expect(
      await shoppingCartPage.getLocator_productName_shoppingCart(
        configData.productInfo.itemName
      ),
      "The product should be present in the cart."
    ).toBeVisible();
  });
});
