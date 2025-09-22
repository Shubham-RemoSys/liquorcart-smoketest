import { test, Locator, Page, expect } from "@playwright/test";

/**
 * This class contains all the locators and actions of the individual Product/Item Page
 */
export class ProductPage {
  private readonly page: Page;
  private readonly breadCrumbValue: Locator;
  private readonly qtyInputBox: Locator;
  private readonly updateCartBTN: Locator;
  private readonly productAddedSuccessNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.breadCrumbValue = page.locator(".breadcrumbs strong");
    this.qtyInputBox = page.locator("#qty");
    this.updateCartBTN = page.getByText("Update Cart");

    this.productAddedSuccessNotification = page.locator(".message-success");
  }
  /**
   * Get the breadcrumb value of the navigated product page
   * @returns Promise<string>
   */
  async getBreadCrumbValue_productPage(): Promise<string> {
    await this.breadCrumbValue.waitFor({ state: "visible", timeout: 7 * 1000 });
    return await this.breadCrumbValue.innerText();
  }

  /**
   * Function to enter/update the quantity value in the qty input box
   * @param qty
   */
  async enterQty_qtyInputbox(qty: string): Promise<void> {
    await this.qtyInputBox.fill(qty);
  }

  /**
   * Function to click on the Update Cart button on the individual Product Page
   */
  async clickUpdateCartBTN(): Promise<void> {
    await this.updateCartBTN.waitFor({ state: "visible", timeout: 7 * 1000 });
    await this.updateCartBTN.click();
  }

  /**
   * Check the visibility of the 'Product Added to the Cart' success notification
   * @param productName
   * @returns Promise<boolean>
   */
  async isProductAddedSuccessMessageDisplayed(
    productName: string
  ): Promise<boolean> {
    try {
      const notificationLocator = await this.productAddedSuccessNotification;
      await notificationLocator.waitFor({
        state: "visible",
        timeout: 10 * 1000,
      });
      const result = await notificationLocator.textContent();

      return await notificationLocator.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get the 'Product Added to the Cart' success notification text
   * @returns Promise<string | null>
   */
  async getProductAddedSuccessMessage(): Promise<string | null> {
    const notificationLocator = await this.productAddedSuccessNotification;
    await notificationLocator.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    const result = await notificationLocator.textContent();

    return result;
  }
}
