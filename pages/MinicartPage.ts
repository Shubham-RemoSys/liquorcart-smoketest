import { test, Locator, Page } from "@playwright/test";

//Load the json data
const configData = require("../config.json");

/**
 * This class contains all the locators and actions of the Mini Cart window
 */
export class MinicartPage {
  private readonly page: Page;
  private readonly minicartCount: Locator;
  private readonly miniCartIcon: Locator;
  private readonly miniCartSection: Locator;
  private readonly minicartProductNameList: Locator;
  private readonly okBtnConfirmationBox: Locator;
  private readonly emptyMiniCartText: Locator;
  private readonly closeMiniCartButton: Locator;
  private readonly OKbuttonAttentionBox: Locator;
  private readonly totalItemCount_miniCartWindow: Locator;
  private readonly cartSubtotalLabel: Locator;
  private readonly cartSubtotalAmount: Locator;
  private readonly updateBTN_minicart: Locator;
  private readonly removeItemPopup: Locator;
  private readonly removeItemPopup_okBTN: Locator;
  private readonly removeItemPopup_cancelBTN: Locator;

  constructor(page: Page) {
    this.page = page;
    this.minicartCount = page.locator(".counter-number");
    this.miniCartIcon = page.getByRole("link", { name: "My Cart" });
    this.miniCartSection = page.locator(".block-minicart");
    this.minicartProductNameList = page.locator(".product-item-name a");
    this.okBtnConfirmationBox = page.getByRole("button", { name: "OK" });
    this.emptyMiniCartText = page.getByText("You have no items in your");
    this.closeMiniCartButton = page.getByRole("button", { name: "Close" });
    this.OKbuttonAttentionBox = page
      .getByRole("dialog", { name: "Attention" })
      .getByRole("button", { name: "OK" });

    this.totalItemCount_miniCartWindow = page.locator(".items-total .count");

    this.cartSubtotalLabel = page.locator(".subtotal .label>span");

    this.cartSubtotalAmount = page.locator(".subtotal .price");

    this.updateBTN_minicart = page.getByRole("button", { name: "Update" });

    this.removeItemPopup = page.locator(".modal-inner-wrap").filter({
      hasText:
        "Are you sure you would like to remove this item from the shopping cart?",
    });

    this.removeItemPopup_okBTN = this.removeItemPopup.locator(".action-accept");

    this.removeItemPopup_cancelBTN =
      this.removeItemPopup.locator(".action-dismiss");
  }

  /**
   * Waiting for the mini cart counter number to be reflected (Count of number of items in the cart)
   * @returns Promise<void>
   */
  async waitForCartCounterToLoad(): Promise<void> {
    await this.page.waitForSelector(".counter-number", {
      state: "visible",
      timeout: 12 * 1000,
    });
  }

  /**
   * This will get the mini cart item count
   * @returns Promise<string>
   */
  async getMiniCartItemCount(): Promise<string> {
    return await this.minicartCount.innerText();
  }

  /**
   * This will click on the mini cart icon and wait for mini cart section to be visible
   * @returns Promise<void>
   */
  async openMiniCart(): Promise<void> {
    await this.page.waitForLoadState("load");
    await this.miniCartIcon.waitFor({ state: "visible", timeout: 7 * 1000 });
    await this.miniCartIcon.click();
    //wait for minicart cart window
    await this.miniCartSection.waitFor({
      state: "visible",
      timeout: 10 * 1000,
    });
  }

  /**
   * This will fetch the item name list present inside the minicart window
   * @returns Promise<string[]>
   */
  async getMiniCartProductNameList(): Promise<Array<string>> {
    await this.minicartProductNameList
      .first()
      .waitFor({ state: "visible", timeout: 7000 });
    return await this.minicartProductNameList.allInnerTexts();
  }

  /**
   * This will click on the 'OK' button for the 'Remove item confirmation dailog box'
   * @returns Promise<void>
   */
  async clickOkToRemoveItem(): Promise<void> {
    await test.step("Click 'OK' to remove the item from the cart", async () => {
      await this.okBtnConfirmationBox.waitFor({
        state: "visible",
        timeout: 5000,
      });
      //Click on the confirmation dailog box to delete the items
      await this.okBtnConfirmationBox.click();
    });
  }

  /**
   * This function will empty the cart
   * @returns Promise<void>
   */
  async clearCart(): Promise<void> {
    await test.step("Check if cart has items → If yes, empty the cart", async () => {
      try {
        await this.waitForCartCounterToLoad();

        await this.openMiniCart();

        let flag = false;

        while (!flag) {
          //Get item list of mini cart
          const productNameList = await this.getMiniCartProductNameList();

          for (const product of productNameList) {
            const removeIcon = await this.page
              .locator(".minicart-items-wrapper .product-item-details")
              .filter({ hasText: product })
              .getByRole("link", { name: "Remove" })
              .first();
            // Click on remove item

            await removeIcon.click();

            await this.clickOkToRemoveItem();

            try {
              // Waiting for item to be removed from the minicart
              await removeIcon.waitFor({
                state: "detached",
                timeout: 15 * 1000,
              });
              if (await this.OKbuttonAttentionBox.isVisible()) {
                console.warn("**The product is already deleted**");
                await this.clickOkAttentionPopup();
              }
            } catch (error) {
              continue;
            }
          }
          flag = await this.emptyMiniCartText.isVisible({ timeout: 4000 });
        }
      } catch (error) {
        if (await this.OKbuttonAttentionBox.isVisible()) {
          console.warn("**The product is already deleted**");
          await this.clickOkAttentionPopup();
        }
        console.log("==== Cart shows no items post-login ====");
      }
    });
  }

  /**
   * Function to access the locator of the visible text message when cart is empty i.e., "You have no items in your shopping cart."
   * @returns Promise<Locator>
   */
  async getLocator_emptyMinicartText_YouHaveNoItemsPresent(): Promise<Locator> {
    return this.emptyMiniCartText;
  }
  /**
   * This function will click on the OK button for attention popup might reflect while removing the product
   * @returns Promise<void>
   */
  async clickOkAttentionPopup(): Promise<void> {
    await this.OKbuttonAttentionBox.click();
  }

  /**
   * Get the product count reflected on the cart icon
   * @returns Promise<string | null>
   */
  async getCounterNumber(): Promise<string | null> {
    await this.minicartCount.waitFor({ state: "visible", timeout: 15 * 1000 });
    return (await this.minicartCount.innerText())?.trim();
  }

  /**
   * Get the price of the product reflected in the mini cart  
   * @param productName 
   * @returns 
   */
  async getItemPrice_miniCart(productName: string): Promise<Locator> {
    return await this.page
      .locator(".block-minicart .product-item-details")
      .filter({ hasText: productName })
      .locator(".price")
      .first();
  }

  /**
   * Get the total item count of the mini cart
   * @returns Promise<string | null | undefined> 
   */
  async getTotalItemCount_miniCart(): Promise<string | null | undefined> {
    return (
      await this.totalItemCount_miniCartWindow.first().textContent()
    )?.trim();
  }

  /**
   * Get the item quantity added to the minicart
   * @param productName 
   * @returns Promise<string | null> 
   */
  async getItemQtyValue_inputBoxMinicart(
    productName: string
  ): Promise<string | null> {
    const element = await this.page
      .locator(".block-minicart .product-item-details")
      .filter({ hasText: productName })
      .locator(".item-qty")
      .first();
    const text = element.textContent();
    return text;
  }

  /**
   * Get dynamic locator for the item qty of the input box based on the product name
   * @param productName 
   * @returns Promise<Locator>
   */
  async getLocator_getItemQty_inputBoxMinicart(productName: string): Promise<Locator> {
    return await this.page
      .locator(".block-minicart .product-item-details")
      .filter({ hasText: productName })
      .locator(".item-qty")
      .first();
  }

  /**
   * Function to enter/change the qty of the items
   * @param productName 
   * @param qty 
   * @returns Promise<void> 
   */
  async changeItemQty_inputBoxMinicart(
    productName: string,
    qty: string
  ): Promise<void> {
    const element = await this.page
      .locator(".block-minicart .product-item-details")
      .filter({ hasText: productName })
      .locator(".item-qty");

    await element.clear();
    await element.pressSequentially(qty, { delay: 400 });
  }

  /**
   * Function to click on the edit icon in the minicart window
   * @param productName
   * @returns Promise<void>
   */
  async clickEditGear_Minicart(productName: string): Promise<void> {
    await this.page
      .locator(".block-minicart .product-item-details")
      .filter({ hasText: productName })
      .locator(".action.edit")
      .first()
      .click();
  }
  
  /**
   * Check the visiblity of the update button when the item qty is changed in the minicart window
   * @returns Promise<boolean>
   */
  async isUpdateBtnVisible_minicart(): Promise<boolean> {
    await this.updateBTN_minicart
      .first()
      .waitFor({ state: "visible", timeout: 7 * 1000 });
    return this.updateBTN_minicart.isVisible();
  }

  /**
   * Function to click on the update button when the qty is changed
   * @returns Promise<void>
   */
  async clickUpdateBtn_minicart(): Promise<void> {
    await this.updateBTN_minicart
      .first()
      .waitFor({ state: "visible", timeout: 7 * 1000 });
    await this.updateBTN_minicart.click();
    await this.updateBTN_minicart
      .first()
      .waitFor({ state: "hidden", timeout: 7 * 1000 });
  }

  /**
   * Function to click on the remove/delete icon in the minicart window
   * @param productName
   * @returns Promise<void>
   */
  async clickDeleteIcon_Minicart(productName: string): Promise<void> {
    await this.page
      .locator(".block-minicart .product-item-details")
      .filter({ hasText: productName })
      .getByRole("link", { name: "Remove" })
      .first()
      .click();
  }

  /**
   * Check the visibility of the remove item popup when the remove icon is clicked on the minicart
   * @returns Promise<boolean>
   */
  async isRemoveItemPopup_visible(): Promise<boolean> {
    await this.removeItemPopup
      .first()
      .waitFor({ state: "visible", timeout: 7 * 1000 });

    return this.removeItemPopup.isVisible();
  }

  /**
   * Get Locator of the OK button of the Remove Product confirmation box
   * @returns Promise<Locator>
   */
  async getLocator_removeItemPopup_okBTN(): Promise<Locator> {
    await this.removeItemPopup_okBTN.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    return this.removeItemPopup_okBTN;
  }

  /**
   * Get Locator of the Cancel button of the Remove Product confirmation box
   * @returns Promise<Locator>
   */
  async getLocator_removeItemPopup_cancelBTN(): Promise<Locator> {
    await this.removeItemPopup_cancelBTN.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    return this.removeItemPopup_cancelBTN;
  }

  /**
   * Get locator of the cart subtotal amount reflected in the minicart window
   * @returns Promise<Locator>
   */
  async getLocator_cartSubtotalAmount(): Promise<Locator> {
    await this.cartSubtotalAmount.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    return this.cartSubtotalAmount;
  }

  /**
   * Get locator of the cart subtotal label reflected in the minicart window
   * @returns Promise<Locator>
   */
  async getLocator_cartSubtotalLabel(): Promise<Locator> {
    await this.cartSubtotalLabel.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    return this.cartSubtotalLabel;
  }

  /**
   * Function to check if the miniCart section/window is visible
   * @returns Promise<boolean> 
   */
  async isMinicartSection_visible(): Promise<boolean> {
    await this.miniCartSection
      .first()
      .waitFor({ state: "visible", timeout: 7 * 1000 });
    return this.miniCartSection.isVisible();
  }
}
