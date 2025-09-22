import { test, expect } from "../fixtures/fixture";
import { MinicartPage } from "../pages/MinicartPage";

//Load the json data
const configData = require("../config.json");
const appConstant = configData.appConstants;
const productInfo = configData.productInfo;

test.describe("Shopping Cart", { tag: "@e2e" }, () => {
  test.describe("Precondition: User has accepted the Terms", () => {
    //Preconditions
    test.beforeEach(
      "It can navigate to the 'Welcome Page' and accept the 'Terms'",
      async ({ welcomePage }) => {
        await welcomePage.launchAndAcceptTerms();
      }
    );

    test("C7546: Cart with no items", async ({ minicartPage, page }) => {
      test.info().annotations.push({
        type: "Description",
        description:
          "Verify that when you click on that Cart without adding items that you receive a message that says, 'You have no items in your shopping cart.'",
      });
      await test.step("It can click on the Shopping Cart icon next to the Search bar", async () => {
        await minicartPage.openMiniCart();
      });

      await test.step("It can validate the dropdown appears that says,'You have no items in your shopping cart.'", async () => {
        //Get the locator for the empty cart notification
        const noItemsTextLocator =
          await minicartPage.getLocator_emptyMinicartText_YouHaveNoItemsPresent();

        //Fetch the empty cart notification
        const emptyCartNotificationText =
          await noItemsTextLocator.textContent();

        //Validate the cart is empty
        await expect(emptyCartNotificationText).toEqual(
          appConstant.emptyCartNotification
        );
      });
    });

    test("C7547: Cart displays quantity", async ({
      productListingPage,
      minicartPage,
      homePage,
    }) => {
      const firstProduct = productInfo.itemName;
      const secondProduct = productInfo.itemName2;
      test.info().annotations.push({
        type: "Description",
        description:
          "Verify that the quantity of items added to your cart appears next to the Cart icon.",
      });
      await test.step("It can click on the 'Shop Spirits' button within the embedded video on the homepage", async () => {
        //Click on Shop Spirits button
        await homePage.clickShopSpiritsButton();
      });
      await test.step("It can validate search results are displayed for all liquor types", async () => {
        //Get the title of the page
        const actualTitle = await productListingPage.getPageTitle();

        //Validating the results are displayed for all type liquor
        await expect(actualTitle.toLowerCase()).toEqual(
          appConstant.titleLiquorCategoryPage.toLowerCase()
        );

        const breadCrumbValue =
          await productListingPage.getBreadCrumbValue_selectedCategory();
        await expect(breadCrumbValue).toEqual(appConstant.breadCrumbLiquor);
      });

      await test.step("It can click on the 'Add to Cart' button below one of the items that are in stock", async () => {
        //Add a product to the cart
        await productListingPage.findAndAddProductToCart(firstProduct);
      });

      await test.step("A green success toast appears at the top of the page that says, You added item name to your shopping cart and the Cart icon at the top of the page shows a '1' next to it", async () => {
        //Fetch the Cart is successfully added notification
        const successMessageFlag =
          await productListingPage.isProductAddedSuccessMessageDisplayed(
            firstProduct
          );

        // Check the visibility of the success message
        await expect(successMessageFlag).toBeTruthy();

        // Get the success message notification text
        const successMsg =
          await productListingPage.getProductAddedSuccessMessage();

        //Validating the success toast
        await expect(successMsg?.trim()).toEqual(
          "You added " + firstProduct + " to your shopping cart."
        );

        //Checking the visibility of te success toast to handle the synchronization
        const successNotificationLocator =
          await productListingPage.getLocator_productAddedSuccessNotification();
        await successNotificationLocator.waitFor({
          state: "hidden",
          timeout: 7 * 1000,
        });

        // Wait for the Product QTY to be displayed
        await minicartPage.waitForCartCounterToLoad();

        // Get the QTY of the Items added to the cart
        const productCount = await minicartPage.getCounterNumber();

        // Validate the Item QTY count
        await expect(productCount).toEqual("1");
      });
      await test.step("It can click on the 'Add to Cart' button below one of the other items that are in stock", async () => {
        await productListingPage.findAndAddProductToCart(secondProduct);
      });
      await test.step("A green success toast appears at the top of the page that says, You added item name to your shopping cart and the Cart icon at the top of the page shows a '1' next to it", async () => {
        const successMessageFlag =
          await productListingPage.isProductAddedSuccessMessageDisplayed(
            secondProduct
          );

        // Check the visibility of the success message
        await expect(successMessageFlag).toBeTruthy();

        // Get the success message notification text
        const successMsg =
          await productListingPage.getProductAddedSuccessMessage();

        await expect(successMsg?.trim()).toEqual(
          "You added " + secondProduct + " to your shopping cart."
        );

        // Wait for the Product QTY to be displayed
        await minicartPage.waitForCartCounterToLoad();

        // Get the QTY of the Items added to the cart
        const productCount = await minicartPage.getCounterNumber();

        // Validate the Item QTY count
        await expect(productCount).toEqual("2");
      });
    });

    test("C7548: Cart contains Items added, subtotal, and quantity", async ({
      productListingPage,
      minicartPage,
      homePage,
    }) => {
      const firstProduct = productInfo.itemName;
      const secondProduct = productInfo.itemName2;
      test.info().annotations.push({
        type: "Description",
        description:
          "Verify that after adding an Item to your cart that clicking on it displays the number of items, the cart subtotal, and the items that were added.",
      });

      await test.step("It can click on the 'Shop Spirits' button within the embedded video on the homepage", async () => {
        //Click Shop Spirit button
        await homePage.clickShopSpiritsButton();
      });

      await test.step("It can validate search results are displayed for all liquor types", async () => {
        const actualTitle = await productListingPage.getPageTitle();

        await expect(actualTitle.toLowerCase()).toEqual(
          appConstant.titleLiquorCategoryPage.toLowerCase()
        );

        const breadCrumbValue =
          await productListingPage.getBreadCrumbValue_selectedCategory();
        await expect(breadCrumbValue).toEqual(appConstant.breadCrumbLiquor);
      });

      await test.step("It can click on the 'Add to Cart' button below one of the items that are in stock", async () => {
        await productListingPage.findAndAddProductToCart(firstProduct);
      });

      await test.step("A green success toast appears at the top of the page that says, You added item name to your shopping cart and the Cart icon at the top of the page shows a '1' next to it", async () => {
        const successMessageFlag =
          await productListingPage.isProductAddedSuccessMessageDisplayed(
            firstProduct
          );

        // Check the visibility of the success message
        await expect(successMessageFlag).toBeTruthy();

        // Get the success message notification text
        const successMsg =
          await productListingPage.getProductAddedSuccessMessage();

        await expect(successMsg?.trim()).toEqual(
          "You added " + firstProduct + " to your shopping cart."
        );

        const successNotificationLocator =
          await productListingPage.getLocator_productAddedSuccessNotification();
        await successNotificationLocator.waitFor({
          state: "hidden",
          timeout: 5 * 1000,
        });

        // Wait for the Product QTY to be displayed next to the cart icon
        await minicartPage.waitForCartCounterToLoad();

        // Get the QTY of the Items added to the cart
        const productCount = await minicartPage.getCounterNumber();

        // Validate the Item QTY count
        await expect(productCount).toEqual("1");
      });

      await test.step("It can click on the 'Add to Cart' button below one of the other items that are in stock", async () => {
        //Add another product to the cart
        await productListingPage.findAndAddProductToCart(secondProduct);
      });

      await test.step("A green success toast appears at the top of the page that says, You added item name to your shopping cart and the Cart icon at the top of the page shows a '2' next to it", async () => {
        const successMessageFlag =
          await productListingPage.isProductAddedSuccessMessageDisplayed(
            secondProduct
          );

        // Check the visibility of the success message
        await expect(successMessageFlag).toBeTruthy();

        // Get the success toast notification text
        const successMsg =
          await productListingPage.getProductAddedSuccessMessage();

        await expect(successMsg?.trim()).toEqual(
          "You added " + secondProduct + " to your shopping cart."
        );

        // Wait for the Product QTY to be displayed
        await minicartPage.waitForCartCounterToLoad();

        // Get the QTY of the Items added to the cart
        const productCount = await minicartPage.getCounterNumber();

        // Validate the Item QTY count
        await expect(productCount).toEqual("2");
      });

      await test.step("It can click on the Cart icon", async () => {
        //Click on the cart icon
        await minicartPage.openMiniCart();
      });

      await test.step("It can validate a dropdown appears showing the number of items (2), the Cart Subtotal, and the two items with their prices and quantity", async () => {
        //Get the total count of the products added to the cart
        const totalItemCount = await minicartPage.getTotalItemCount_miniCart();

        //Validate number of items are '2'
        await expect(totalItemCount, {
          message: "Number of items in the minicart window should be '2'",
        }).toEqual("2");

        await expect(await minicartPage.getItemPrice_miniCart(firstProduct), {
          message:
            "Price for : '" +
            firstProduct +
            "' should be visible in the minicart window",
        }).toBeVisible();
        await expect(
          await minicartPage.getLocator_getItemQty_inputBoxMinicart(firstProduct),
          {
            message:
              "Qty for : '" +
              firstProduct +
              "' should be visible in the minicart window",
          }
        ).toBeVisible();

        //Validate the cartsubtotal label
        await expect(
          await minicartPage.getLocator_cartSubtotalLabel()
        ).toBeVisible();

        //Validate the cartsubtotal amount value is reflected
        await expect(
          await minicartPage.getLocator_cartSubtotalAmount()
        ).toBeVisible();

        //For second product

        await expect(await minicartPage.getItemPrice_miniCart(secondProduct), {
          message:
            "Price for : '" +
            secondProduct +
            "' should be visible in the minicart window",
        }).toBeVisible();
        await expect(
          await minicartPage.getLocator_getItemQty_inputBoxMinicart(secondProduct),
          {
            message:
              "Qty for : '" +
              secondProduct +
              "' should be visible in the minicart window",
          }
        ).toBeVisible();
      });
    });
  });

  test.describe("Prerequisite: An Item has been added to the Cart. ", () => {
    const productName = productInfo.itemName;
    //Preconditions
    test.beforeEach(
      "It can navigate to the 'Welcome Page' and accept the 'Terms'",
      async ({ welcomePage, homePage, productListingPage }) => {
        await welcomePage.launchAndAcceptTerms();

        //Click on the Shop Spirits button
        await homePage.clickShopSpiritsButton();

        //Add a product to the cart
        await productListingPage.findAndAddProductToCart(productName);

        //Check the visibility of the success notification
        await productListingPage.isProductAddedSuccessMessageDisplayed(
          productName
        );
      }
    );

    test("C7549: Item quantity can be updated in Cart", async ({
      minicartPage,
    }) => {
      test.info().annotations.push({
        type: "Description",
        description:
          "Verify that when you update the quantity of an item within your Cart that the Update button appears.",
      });

      await test.step("It can click on the Cart icon", async () => {
        //Click on the cart icon
        await minicartPage.openMiniCart();
      });

      // Using minicartUtility function to validate a dropdown appears showing the number of items, the Cart Subtotal, and the item with it's prices and quantity.
      await miniCartValidationUtilityTestStep(productName, minicartPage);

      await test.step("It can click within the quantity field and change the number from 1 to 2", async () => {
        //Change the item QTY
        await minicartPage.changeItemQty_inputBoxMinicart(productName, "2");
      });

      await test.step("It can validate an 'Update' button appears next to the quantity field", async () => {
        //Validate the update button appears while updating the item QTY
        await expect(
          await minicartPage.isUpdateBtnVisible_minicart()
        ).toBeTruthy();
      });
    });

    test("C7550: Clicking update after changing quantity updates the subtotal and number of items in Cart", async ({
      minicartPage,
    }) => {
      test.info().annotations.push({
        type: "Description",
        description:
          "Verify that after changing the quantity of an item within your Cart and clicking on 'Update' that the subtotal and the number of Items within your cart are updated.",
      });
      await test.step("It can click on the Cart icon", async () => {
        //Click on the cart icon
        await minicartPage.openMiniCart();
      });

      // Using minicartUtility function to validate a dropdown appears showing the number of items, the Cart Subtotal, and the item with it's prices and quantity.
      await miniCartValidationUtilityTestStep(productName, minicartPage);

      await test.step("It can click within the quantity field and change the number from 1 to 2", async () => {
        //Change the item QTY from '1' to '2'
        await minicartPage.changeItemQty_inputBoxMinicart(productName, "2");
      });

      await test.step("It can validate an 'Update' button appears next to the quantity field", async () => {
        await expect(
          await minicartPage.isUpdateBtnVisible_minicart()
        ).toBeTruthy();
      });

      await test.step("It can click on the 'Update' button", async () => {
        //Click on the 'Update' button
        await minicartPage.clickUpdateBtn_minicart();
      });

      await test.step("It can validate a dropdown appears showing the number of items (2), the Cart Subtotal, and the two items with their prices and quantity", async () => {});
      //Get the total count of the products added to the cart
      const totalItemCount = await minicartPage.getTotalItemCount_miniCart();

      //Validate number of items are '2'
      await expect(totalItemCount).toEqual("2");

      await expect(await minicartPage.getItemPrice_miniCart(productName), {
        message:
          "Price for : '" +
          productName +
          "' should be visible in the minicart window",
      }).toBeVisible();
      await expect(
        await minicartPage.getLocator_getItemQty_inputBoxMinicart(productName),
        {
          message:
            "Qty for : '" +
            productName +
            "' should be visible in the minicart window",
        }
      ).toBeVisible();

      //Validate the cartsubtotal label
      await expect(
        await minicartPage.getLocator_cartSubtotalLabel()
      ).toBeVisible();

      //Validate the cartsubtotal amount value is reflected
      await expect(
        await minicartPage.getLocator_cartSubtotalAmount()
      ).toBeVisible();
    });

    test("C7551: Removing single item from Cart", async ({
      minicartPage,
    }) => {
      test.info().annotations.push({
        type: "Description",
        description:
          "Verify that when you click on the Delete icon when there’s 1 item in your Cart that that a popup appears confirming that you want to remove the Item from your Cart.",
      });
      await test.step("It can click on the Cart icon", async () => {
        //Click on the cart icon
        await minicartPage.openMiniCart();
      });

      // Using minicartUtility function to validate a dropdown appears showing the number of items, the Cart Subtotal, and the item with it's prices and quantity.
      await miniCartValidationUtilityTestStep(productName, minicartPage);

      await test.step("It can click on the delete icon", async () => {
        await minicartPage.clickDeleteIcon_Minicart(productName);
      });

      await test.step("It can validate A popup appears that says, 'Are you sure you would like to remove this item from the shopping cart?' and there are two options Cancel and Ok", async () => {
        await expect(
          await minicartPage.isRemoveItemPopup_visible()
        ).toBeTruthy();
      });
    });

    test("C7552: Declining the Item deletion", async ({
      productListingPage,
      minicartPage,
    }) => {
      test.info().annotations.push({
        type: "Description",
        description:
          "Verify that when you click on “Cancel” after selecting the Delete icon within the Cart that the popup is closed, and the Item remains in the Cart.",
      });
      await test.step("It can click on the Cart icon", async () => {
        await productListingPage.isProductAddedSuccessMessageDisplayed(
          productName
        );
        await minicartPage.openMiniCart();
      });

      // Using minicartUtility function to validate a dropdown appears showing the number of items, the Cart Subtotal, and the item with it's prices and quantity.
      await miniCartValidationUtilityTestStep(productName, minicartPage);

      await test.step("It can click on the delete icon", async () => {
        await minicartPage.clickDeleteIcon_Minicart(productName);
      });

      await test.step("It can validate A popup appears that says, 'Are you sure you would like to remove this item from the shopping cart?' and there are two options Cancel and Ok", async () => {
        await expect(
          await minicartPage.isRemoveItemPopup_visible()
        ).toBeTruthy();
      });

      await test.step("It can click on 'Cancel'", async () => {
        await minicartPage.getLocator_removeItemPopup_cancelBTN();
      });

      await test.step("It can validate the popup and Cart preview are closed and the Item remains in the Cart", async () => {
        await expect(
          await minicartPage.isMinicartSection_visible()
        ).toBeTruthy();

        await expect(
          Number(await minicartPage.getTotalItemCount_miniCart())
        ).toBeGreaterThan(0);
      });
    });

    test("C7553: Approving the Item deletion", async ({
      minicartPage,
      productListingPage,
    }) => {
      test.info().annotations.push({
        type: "Description",
        description:
          "Verify that when you click on “Ok” after selecting the Delete icon within the Cart closes the popup and clears the cart.",
      });
      await test.step("It can click on the Cart icon", async () => {
        await productListingPage.isProductAddedSuccessMessageDisplayed(
          productName
        );
        await minicartPage.openMiniCart();
      });

    // Using minicartUtility function to validate a dropdown appears showing the number of items, the Cart Subtotal, and the item with it's prices and quantity.
      await miniCartValidationUtilityTestStep(productName, minicartPage);

      await test.step("It can click on the delete icon", async () => {
        await minicartPage.clickDeleteIcon_Minicart(productName);
      });

      await test.step("It can validate A popup appears that says, 'Are you sure you would like to remove this item from the shopping cart?' and there are two options Cancel and Ok", async () => {
        await expect(
          await minicartPage.isRemoveItemPopup_visible()
        ).toBeTruthy();
      });

      await test.step("It can click on 'OK'", async () => {
        (await minicartPage.getLocator_removeItemPopup_okBTN()).click();
      });

      await test.step("It can validate the popup is closed and the Cart preview says, 'You have no items in your shopping cart'", async () => {
        //Get the locator for the empty cart notification
        const noItemsTextLocator =
          await minicartPage.getLocator_emptyMinicartText_YouHaveNoItemsPresent();

        const emptyCartNotificationText =
          await noItemsTextLocator.textContent();

        console.log(emptyCartNotificationText);

        await expect(emptyCartNotificationText).toEqual(
          "You have no items in your shopping cart."
        );
      });
    });

    test("C7555: Gear icon directs to Item page", async ({
      minicartPage,
      productPage,
    }) => {
      test.info().annotations.push({
        type: "Description",
        description:
          "Verify that when you click on the Gear icon next to an Item in your Cart that you’re brough to the Items page.",
      });

      await test.step("It can click on the Cart icon", async () => {
        //Click on minicart icon
        await minicartPage.openMiniCart();
      });

      // Using minicartUtility function to validate a dropdown appears showing the number of items, the Cart Subtotal, and the item with it's prices and quantity.
      await miniCartValidationUtilityTestStep(productName, minicartPage);

      await test.step("It can click on the Gear icon", async () => {
        //Click on the Edit Gear
        await minicartPage.clickEditGear_Minicart(productName);
      });

      await test.step("It can validate the user is redirected to the Item page", async () => {
        //Fetch the breadcrumb value
        const breadcrumbValue =
          await productPage.getBreadCrumbValue_productPage();

        await expect(breadcrumbValue).toEqual(productName);
      });
    });

    test("C7556: Can update quantity after clicking Gear icon", async ({
      minicartPage,
      productPage,
    }) => {
      const qty: string = "3";
      test.info().annotations.push({
        type: "Description",
        description:
          "Verify that you’re able to update the quantity of an item after clicking on the 'Update Cart' button.",
      });
      await test.step("It can click on the Cart icon", async () => {
        //Click on minicart icon
        await minicartPage.openMiniCart();
      });

     // Using minicartUtility function to validate a dropdown appears showing the number of items, the Cart Subtotal, and the item with it's prices and quantity.
      await miniCartValidationUtilityTestStep(productName, minicartPage);

      await test.step("It can click on the Gear icon", async () => {
        //Click on the Edit Gear
        await minicartPage.clickEditGear_Minicart(productName);
      });

      await test.step("It can validate the user is redirected to the Item page", async () => {
        //Fetch the breadcrumb value
        const breadcrumbValue =
          await productPage.getBreadCrumbValue_productPage();

        await expect(breadcrumbValue).toEqual(productName);
      });

      await test.step("It can click within the quantity field, update the quantity, and then click on 'Update Cart'", async () => {
        await productPage.enterQty_qtyInputbox(qty);
        await productPage.clickUpdateCartBTN();
      });
      await test.step("It can validate the user brought to the Cart and a green success toast appears that says, 'Item Name was updated in your shopping cart'", async () => {
        const successMessageFlag =
          await productPage.isProductAddedSuccessMessageDisplayed(productName);

        // Check the visibility of the success message
        await expect(successMessageFlag).toBeTruthy();

        const successToast = await productPage.getProductAddedSuccessMessage();
        await expect(successToast?.trim()).toEqual(
          productName + " was updated in your shopping cart."
        );

        const text = await minicartPage.getTotalItemCount_miniCart();
        console.log(text);
        await expect(text).toEqual(qty);
      });
    });
  });

  test.describe("Prerequisite: Multiple Items have been added to the Cart", () => {
    const list = productInfo.itemList;
    //Preconditions
    test.beforeEach(
      "It can navigate to the 'Welcome Page' and accept the 'Terms'",
      async ({ welcomePage, homePage, productListingPage, minicartPage }) => {
        await welcomePage.launchAndAcceptTerms();
        await homePage.clickShopSpiritsButton();
        await productListingPage.addMutilpleProductFromList(
          productInfo.itemList
        );
      }
    );

    test("C7554: Approving the Item deletion when more than one item is in the Cart", async ({
      minicartPage,
    }) => {
      test.info().annotations.push({
        type: "Description",
        description:
          "Verify that when you click on 'Ok' after selecting the Delete icon within the Cart removes the selected item and the Subtotal and number of items within the Cart is updated.",
      });
      await test.step("It can click on the Cart icon", async () => {
        await minicartPage.openMiniCart();
      });
      await test.step("It can validate a dropdown appears showing the number of items, the Cart Subtotal, and the item with it's prices and quantity.", async () => {
        //Get the total count of the products added to the cart
        const totalItemCount = await minicartPage.getTotalItemCount_miniCart();

        //Validate number of items are greater than '0'
        await expect(Number(totalItemCount)).toBeGreaterThan(0);

        //Validate the cartsubtotal label
        await expect(
          await minicartPage.getLocator_cartSubtotalLabel()
        ).toBeVisible();

        //Validate the cartsubtotal amount value is reflected
        await expect(
          await minicartPage.getLocator_cartSubtotalAmount()
        ).toBeVisible();

        let temp = 0;
        for (const product of list) {
          temp++;
          await expect(await minicartPage.getItemPrice_miniCart(product), {
            message:
              "Price for : '" +
              product +
              "' should be visible in the minicart window",
          }).toBeVisible();
          await expect(
            await minicartPage.getLocator_getItemQty_inputBoxMinicart(product),
            {
              message:
                "Qty for : '" +
                product +
                "' should be visible in the minicart window",
            }
          ).toBeVisible();
          if (temp === 10) {
            break;
          }
        }
      });
      await test.step("It can click on the delete icon", async () => {
        await minicartPage.clickDeleteIcon_Minicart(list[0]);
      });

      await test.step("It can validate A popup appears that says, 'Are you sure you would like to remove this item from the shopping cart?' and there are two options Cancel and Ok", async () => {
        await expect(
          await minicartPage.isRemoveItemPopup_visible()
        ).toBeTruthy();
      });
      await test.step("It can click on 'OK'", async () => {
        (await minicartPage.getLocator_removeItemPopup_okBTN()).click();
      });

      await test.step("It can validate the Cart preview is updated to show the number of items, the Cart Subtotal, and the items with their prices and quantity", async () => {
        for (const product of list) {
          await expect(await minicartPage.getItemPrice_miniCart(product), {
            message:
              "Price for : '" +
              product +
              "' should be visible in the minicart window",
          }).toBeVisible();
          await expect(
            await minicartPage.getLocator_getItemQty_inputBoxMinicart(product),
            {
              message:
                "Qty for : '" +
                product +
                "' should be visible in the minicart window",
            }
          ).toBeVisible();

          //Validate the cartsubtotal label
          await expect(
            await minicartPage.getLocator_cartSubtotalLabel()
          ).toBeVisible();

          //Validate the cartsubtotal amount value is reflected
          await expect(
            await minicartPage.getLocator_cartSubtotalAmount()
          ).toBeVisible();
        }
      });
    });

    test("C7557: Maximum of 10 items in Cart preview", async ({
      minicartPage,
      page,
    }) => {
      test.info().annotations.push({
        type: "Description",
        description: "Verify that the Cart preview shows a max of 10 Items.",
      });
      await test.step("It can click on the cart icon", async () => {
        await minicartPage.openMiniCart();
      });

      await test.step("It can validate a dropdown appears showing the number of items 10 of X and only 10 of the added items are shown", async () => {});
      const locator = await page.locator(".items-total");
      await locator.first().waitFor({ state: "visible", timeout: 10 * 1000 });

      const text = (await locator.innerText())?.trim();
      console.log(text);
      await expect(
        text?.startsWith("10 of ") && text.endsWith(" Items in Cart")
      ).toBeTruthy();
    });
  });
});

/**
 * Helper Function : Encapsulates a common step that is repeated across multiple test cases.
 * For the test step to validate a dropdown appears showing the number of items, the Cart Subtotal, and the item with it's prices and quantity.
 * @param productName
 * @param minicartPage
 */
async function miniCartValidationUtilityTestStep(
  productName: string,
  minicartPage: MinicartPage
) {
  await test.step("It can validate a dropdown appears showing the number of items, the Cart Subtotal, and the item with it's prices and quantity.", async () => {
    //Get the total count of the products added to the cart
    const totalItemCount = await minicartPage.getTotalItemCount_miniCart();

    //Validate number of items are '1'
    await expect(totalItemCount).toEqual("1");

    await expect(await minicartPage.getItemPrice_miniCart(productName), {
      message:
        "Price for : '" +
        productName +
        "' should be visible in the minicart window",
    }).toBeVisible();
    await expect(await minicartPage.getLocator_getItemQty_inputBoxMinicart(productName), {
      message:
        "Qty for : '" +
        productName +
        "' should be visible in the minicart window",
    }).toBeVisible();

    //Validate the cartsubtotal label
    await expect(
      await minicartPage.getLocator_cartSubtotalLabel()
    ).toBeVisible();

    //Validate the cartsubtotal amount value is reflected
    await expect(
      await minicartPage.getLocator_cartSubtotalAmount()
    ).toBeVisible();
  });
}
