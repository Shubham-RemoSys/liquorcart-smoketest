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
}
