import { test, Locator, Page } from "@playwright/test";

/**
 * This class contains all the locators and actions of the Checkout Success Page
 */

export class CheckoutSuccessPage {
  private readonly page: Page;
  private readonly continueShoppingLink: Locator;
  private readonly orderIdLabel: Locator;
  private readonly transactionIdLabel: Locator;
  private readonly orderId: Locator;

  constructor(page: Page) {
    this.page = page;

    this.continueShoppingLink = page.getByRole("link", {
      name: "Continue Shopping",
    });

    this.orderIdLabel = page.getByText("Your Order id is:");

    this.transactionIdLabel = page.getByText("Your transaction id is:");

    this.orderId = page.getByText("Your Order id is").locator("span");
  }

  /**
   * Wait for Continue Shopping button to de displayed on the Checkout success page
   * @returns Promise<void>
   */
  async waitForContinueShoppingLink(): Promise<void> {
    await this.continueShoppingLink.waitFor({
      state: "visible",
      timeout: 40 * 1000,
    });
  }

  /**
   * Get the locator of the OrderID label
   * @returns Promise<Locator>
   */
  async getLocator_orderIdLabel(): Promise<Locator> {
    return await this.orderIdLabel;
  }

  /**
   * Get the locator of the Trasaction ID label
   * @returns Promise<Locator>
   */
  async getLocator_transactionIdLabel(): Promise<Locator> {
    return await this.transactionIdLabel;
  }

  /**
   * Function to get the Order ID after successfully placing the order
   * @returns Promise<string> OrderID
   */
  async getOrderId(): Promise<string> {
    let orderID: any;
    await test.step("Get order ID", async () => {
      orderID = await this.orderId.innerText();
    });
    console.log("Order ID is : " + orderID);
    return orderID;
  }
}
