import { Page, Locator } from "@playwright/test";

/**
 * This class contains all the locators and actions of the Shopping Cart Page
 */
export class ShoppingCartPage {
  private readonly page: Page;
  private readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.proceedToCheckoutButton = page.getByRole("button", {
      name: "Proceed to Checkout",
    });
  }

  /**
   * Click on the "Proceed to Checkout" button.
   * Includes wait for the button to be visible before clicking.
   */
  async clickProceedToCheckoutButton(): Promise<void> {
    // This line includes the wait for visibility
    await this.proceedToCheckoutButton.waitFor({
      state: "visible",
      timeout: 5000,
    });
    await this.proceedToCheckoutButton.click();
  }

  /**
   * Get Locator on the basis of the Product name on Shopping Cart page
   * @param productName
   * @returns Promise<Locator>
   */
  async getLocator_productName_shoppingCart(
    productName: string
  ): Promise<Locator> {
    return await this.page
      .getByRole("cell", {
        name: productName,
      })
      .first();
  }
}
