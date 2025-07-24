import { test, expect, Locator, Page } from "@playwright/test";
//Loads the json data
const configData = require("../config.json");

/**
 * This class contains all the locators and actions of the Payment Page
 */
export class PaymentPage {
  private readonly page: Page;
  private readonly signAndAccept: Locator;
  private readonly ageLimitPopup: Locator;
  private readonly placeOrderButton: Locator;
  private readonly loaderOrderSummary: Locator;
  private readonly pageLoaderSelector: string;

  constructor(page: Page) {
    this.page = page;
    this.signAndAccept = this.page.getByRole("button", {
      name: "Sign and Accept",
    });
    this.ageLimitPopup = page.getByText("You must be 21+ to proceed");

    this.placeOrderButton = page.getByRole("button", {
      name: "Place Order",
    });
    this.loaderOrderSummary = page.locator(".opc-block-summary .loading-mask");

    this.pageLoaderSelector = ".loader";
  }

  /**
   * If product category is Liquor call this method --> Validate the Age Limit confirmation dialog box
   * ======Validation Check on the Age Limit Confirmation Pop up========
   *  @returns Promise<void>
   */
  async validateAgeLimitForSpirituousLiquor(isLiquor: boolean): Promise<void> {
    if (isLiquor) {
      await this.signAndAccept.waitFor({ state: "visible", timeout: 10000 });

      //Validate text for liquor order age should be 21+
      await expect(await this.ageLimitPopup).toBeVisible();
      await this.selectConfirmAgeLimitForSpiritiousLiquor();
    }
  }

  /**
   * This function will perform click action on the Age limit confirmation dialog box for 'spirituous liquor'
   * @return  Promise<void>
   */
  async selectConfirmAgeLimitForSpiritiousLiquor(): Promise<void> {
    await test.step("Click on the 'Sign & Accept' button for 'ID required at the Door'- Age confirmation dailog box ", async () => {
      await this.signAndAccept.click();
      await this.signAndAccept.waitFor({ state: "hidden", timeout: 10 * 1000 });
    });
  }

  /**
   * Function to enter the card details in the Credit Card Section
   * Fetching the Card Test Data from the json file
   * @returns  Promise<void>
   */
  async enterCardDetails(): Promise<void> {
    await test.step("Enter Credit Card Details", async () => {
      await this.page
        .getByPlaceholder("Customer Name")
        .fill(configData.cardDetails.customerName);
      await this.page
        .getByPlaceholder("Card Number")
        .fill(configData.cardDetails.cardNumber);
      await this.page.getByPlaceholder("MM").fill(configData.cardDetails.date);
      await this.page
        .getByPlaceholder("YYYY")
        .fill(configData.cardDetails.year);
      await this.page.getByPlaceholder("CVV").fill(configData.cardDetails.cvv);
    });
  }

  /**
   * This will click on the Place Order button
   * @returns Promise<void>
   */
  async clickPlaceOrderButton(): Promise<void> {
    await test.step("Click on the 'Place Order' button", async () => {
      await this.placeOrderButton.waitFor({ state: "attached" });
      await this.placeOrderButton.click();
    });
  }

  /**
   * Waits for the page to load after navigation
   * @returns Promise<void>
   */
  async waitForPageLoading(): Promise<void> {
    await this.page.waitForSelector(this.pageLoaderSelector, {
      state: "hidden",
      timeout: 8 * 1000,
    });
  }

  /**
   * Waits for the order summary to load after navigation
   * @returns Promise<void>
   */
  async waitForOrderSummaryLoading(): Promise<void> {
    //Waiting for loader
    if (await this.loaderOrderSummary.isVisible({ timeout: 4000 })) {
      await this.loaderOrderSummary.waitFor({ state: "attached" });
      await this.loaderOrderSummary.waitFor({ state: "detached" });
    }
  }
}
