import { test, Locator, Page, expect } from "@playwright/test";

//Loads the json data
const configData = require("../config.json");

/**
 * This class contains all the locators and actions of the Shipping Page
 */
export class ShippingPage {
  private readonly page: Page;
  private readonly nextButton: Locator;
  private readonly driverTip_OrderSummary: Locator;
  private readonly cartSubtotal: Locator;
  private readonly deliveryRadioButton: Locator;
  private readonly checkedDeliveryButton: Locator;
  private readonly deliveryFee_OrderSummary: Locator;
  private readonly driverTip_15percent: Locator;
  private readonly loaderOrderSummary: Locator;
  private readonly pageLoaderSelector: string;
  constructor(page: Page) {
    this.page = page;

    this.nextButton = page.getByRole("button", { name: "Next" });

    this.driverTip_OrderSummary = this.page
      .getByRole("cell", {
        name: "Driver Tip",
      })
      .locator('div:has-text("Driver Tip ")');

    this.cartSubtotal = page
      .getByRole("row", { name: "Cart Subtotal" })
      .locator(".price");

    this.deliveryRadioButton = page
      .locator(".row", { hasText: "Delivery" })
      .locator(".radio");

    this.checkedDeliveryButton = page.locator(
      '[value="customshipping_delivery"][checked="customshipping_delivery"]'
    );

    this.deliveryFee_OrderSummary = page
      .getByRole("table", { name: "Order Summary" })
      .getByRole("row", { name: "Deliver" })
      .locator(".price");

    this.driverTip_15percent = page.getByRole("button", {
      name: "15%",
    });

    this.loaderOrderSummary = page.locator(".opc-block-summary .loading-mask");

    this.pageLoaderSelector = ".loader";
  }

  /**
   * This function will get the title of the Shipping page
   * @returns Promise<string>
   */
  async getTitleShippingPage(): Promise<string> {
    await this.page.waitForLoadState("domcontentloaded");
    return await this.page.title();
  }

  /**
   * This will validate the title of the shipping page
   * == Validation Check on Title of the Shipping Page ==
   * @returns Promise<void>
   */
  async validateTitle_ShippingPage(): Promise<void> {
    await expect(
      await this.getTitleShippingPage(),
      "Title of the page should be : " +
        configData.appConstants.titleShippingPage
    ).toEqual(configData.appConstants.titleShippingPage);
  }

  /**
   * Function to select the Order Type as 'Delivery'
   * @returns Promise<void>
   */
  async selectOrderType_Delivery(): Promise<void> {
    await test.step("Select the Order Type as 'Delivery'", async () => {
      await this.page.waitForSelector(this.pageLoaderSelector, {
        state: "hidden",
        timeout: 10 * 1000,
      });

      //Clicking on the Delivery radio button

      await this.deliveryRadioButton.waitFor({ state: "attached" });
      await this.deliveryRadioButton.click();
      if (
        //Check if the Delivery Order Type is actually selected or not
        await this.checkedDeliveryButton.isVisible()
      ) {
      } else {
        console.log(
          "Order Type Delivery was not clicked in first attempt -> Selecting Delivery Order Type"
        );
        await this.deliveryRadioButton.click();
      }
      await this.page.waitForSelector(this.pageLoaderSelector, {
        state: "hidden",
        timeout: 10 * 1000,
      });
    });
  }

  /**
   * Get the locator of the Delivery Fee from the Order Summary section
   * @returns Promise<Locator>
   */
  async getLocator_DeliveryFee_OrderSummary(): Promise<Locator> {
    await this.deliveryFee_OrderSummary.waitFor({ state: "visible" });
    return this.deliveryFee_OrderSummary;
  }

  /**
   * Selecting Driver Tip as 15%
   * @returns Promise<void>
   */
  async selectDriverTip(): Promise<void> {
    await test.step("Select the Driver Tip as '15%' ", async () => {
      await this.page.waitForTimeout(3000);
      try {
        await this.driverTip_15percent.waitFor({
          state: "attached",
          timeout: 10 * 1000,
        });

        await this.driverTip_15percent.click();

        await this.waitForOrderSummaryLoading();
        await this.checkIfDriverTipSelected();
      } catch (error) {
        await this.handleReloadingDriverTipSection();
      }
    });
  }
  /**
   * This function will reload the page in case the driver tip section is not loaded
   * @returns Promise<void>
   */
  async handleReloadingDriverTipSection(): Promise<void> {
    await this.page.reload();
    await this.driverTip_15percent.waitFor({
      state: "attached",
      timeout: 20 * 1000,
    });
    await this.driverTip_15percent.click();
    await this.checkIfDriverTipSelected();
  }
  /**
   * This function is to cross-check if the driver tip is selected
   * @returns Promise<void>
   */
  async checkIfDriverTipSelected(): Promise<void> {
    await this.page.waitForSelector(".tip-option.selected", {
      timeout: 10000,
    });
    if (
      !(
        (await this.driverTip_15percent.getAttribute("class")) ===
        "tip-option selected"
      )
    ) {
      await this.driverTip_15percent.click();
    }
  }

  /**
   * This method will fetch the cart sub-total amount
   * @returns Promise<number> Cart SubTotal Amount
   */
  async getSubTotalAmount_orderSummary(): Promise<number> {
    const cartSubtotal: string = await this.cartSubtotal.innerText();
    return await parseFloat(cartSubtotal.replace("$", ""));
  }

  /**
   * This function will calculate the Driver Tip amount as 15 % of the total order summary
   * @param cartSubtotalAmount
   * @returns Promise<string>: 15% value of the Order Summary
   */
  async calculate15percentDriverTip(
    cartSubtotalAmount: number
  ): Promise<string> {
    let value: any;
    await test.step("Calculate the 15% of the sub-total amount", async () => {
      value = await +(cartSubtotalAmount * 0.15).toFixed(2);
    });

    return await value.toString();
  }

  /**
   * Captures the Driver Tip value from the order summary
   * @returns Promise<string> : Driver Tip amount
   */
  async getDriverTipFromOrderSummary(): Promise<string> {
    await this.driverTip_OrderSummary.waitFor({
      state: "attached",
      timeout: 15 * 1000,
    });
    return await this.driverTip_OrderSummary.innerText();
  }

  /**
   *  Perform click action on the Next button after filling the credit card details
   * @returns Promise<void>
   */
  async clickNextButton(): Promise<void> {
    await test.step("Click Next button on Shipping Page", async () => {
      await this.nextButton.click();
      await this.page.waitForSelector(this.pageLoaderSelector, {
        state: "hidden",
        timeout: 12 * 1000,
      });
    });
  }
  /**
   * This will reload the page if Delivery Fee is reflected as 0 in Order Summary
   * @returns Promise<void>
   */
  async handleZeroDeliveryFee_OrderSummary(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded", { timeout: 6000 });
    const dFee = await this.deliveryFee_OrderSummary.innerText();
    if (dFee === "$0.00") {
      await this.page.reload();
      await this.page.waitForLoadState("domcontentloaded");
    }
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
