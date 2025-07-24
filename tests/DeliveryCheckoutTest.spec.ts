import { test, expect } from "../fixtures/fixture";
//Loads the json data
const configData = require("../config.json");
test.describe(
  "End-to-end checkout test - Delivery Order Type",
  { tag: "@login" },
  async () => {
    test("It can checkout via Delivery Order Type", async ({
      loginPage,
      homePage,
      minicartPage,
      productListingPage,
      shoppingCartPage,
      shippingPage,
      paymentPage,
      checkoutSuccessPage,
    }) => {
      await test.step("It can Login to the application → Check if cart has items → If yes, empty the cart", async () => {
        await loginPage.launchAndLogin(
          configData.username,
          configData.password
        );
        await minicartPage.clearCart();
      });
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
      await test.step("It can proceed to checkout and navigate to the shipping page", async () => {
        await shoppingCartPage.clickProceedToCheckoutButton();

        await shippingPage.validateTitle_ShippingPage();
      });
      await test.step("It can select the Order Type and validate the delivery fee in the order summary", async () => {
        await shippingPage.selectOrderType_Delivery();
      });

      let driverTipCalculation: string;
      await test.step("It can add Driver Tip and validate if it matches to the Order Summary", async () => {
        await shippingPage.selectDriverTip();
        const subTotal: number =
          await shippingPage.getSubTotalAmount_orderSummary();

        driverTipCalculation = await shippingPage.calculate15percentDriverTip(
          subTotal
        );
      });

      await test.step("It can click on Next button and check if the Product category is Spiritious or Not -> If Yes Confirm Age is 21+ 'ID Required at the door' ", async () => {
        await shippingPage.clickNextButton();

        await paymentPage.validateAgeLimitForSpirituousLiquor(
          configData.isliquor
        );
      });

      await test.step("It can validate the Delivery Fee in the order summary", async () => {
        await paymentPage.waitForOrderSummaryLoading();
        await expect
          .soft(
            await shippingPage.getLocator_DeliveryFee_OrderSummary(),
            "Delivery Fee should reflect same in the order summary"
          )
          .toHaveText(configData.appConstants.deliveryFee);

        const driverTipOrderSummary =
          await shippingPage.getDriverTipFromOrderSummary();
        await expect
          .soft(driverTipOrderSummary)
          .toContain(driverTipCalculation);
      });
      await test.step("It can enter card details and click on 'Place Order' button", async () => {
        await paymentPage.enterCardDetails();

        await paymentPage.clickPlaceOrderButton();
      });
      await test.step("It can validate the order confirmation details", async () => {
        await checkoutSuccessPage.waitForContinueShoppingLink();
        await expect(
          await checkoutSuccessPage.getLocator_orderIdLabel()
        ).toBeVisible();
        await expect(
          await checkoutSuccessPage.getLocator_transactionIdLabel()
        ).toBeVisible();

        await Promise.all([
          await expect(await checkoutSuccessPage.getOrderId()).not.toBeNull(),
          await expect(await checkoutSuccessPage.getOrderId()).not.toContain(
            configData.appConstants.noData
          ),
        ]);
      });
    });
  }
);
