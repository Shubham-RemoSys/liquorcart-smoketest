import { Locator, Page, test } from "@playwright/test";
//Loads the json data
const configData = require("../config.json");

/**
 * This class contains all the locators and actions of the Welcome Page
 */
export class WelcomePage {
  private readonly page: Page;
  private readonly welcomePageHeading: Locator;
  private readonly acceptButtonSelector: string;

  /**
   * Constructor of this class
   * @param page
   */
  constructor(page: Page) {
    this.page = page;
    this.welcomePageHeading = page.getByRole("heading", {
      name: "Select accept and enter to verify you are of legal drinking age",
    });
    this.acceptButtonSelector = ".m-accept";
  }
  /**
   * This function will launch the app url
   */
  async launchAppURL(): Promise<void> {
    await test.step("Launch the application", async () => {
      await this.page.goto(configData.testurl, {
        timeout: 60 * 1000,
        waitUntil: "domcontentloaded",
      });
    });
  }

  /**
   * This will accept the Accept the terms on welcome page, the user is above 21 years of age
   * @returns Promise<void>
   */
  async clickAcceptAndEnter(): Promise<void> {
    await test.step("Click on 'Accept & Enter' confirmation button", async () => {
      await this.page.locator(this.acceptButtonSelector).click();
    });
  }

  /**
   * This function will launch the app url and Accept the terms on welcome page
   * @returns Promise<void>
   */
  async launchAndAcceptTerms(): Promise<void> {
    await test.step("Launch the application", async () => {
      await this.page.goto(configData.testurl, {
        timeout: 60 * 1000,
        waitUntil: "domcontentloaded",
      });

      await this.page.waitForSelector(this.acceptButtonSelector, {
        state: "visible",
        timeout: 100 * 1000,
      });
    });
    await test.step("Click on Accept & Enter confirmation button", async () => {
      await this.clickAcceptAndEnter();
    });
  }

  /**
   * Get the locator of the Heading on the Welcome Page
   * <h1>Select accept and enter to verify you are of legal drinking age</h1>
   * @returns Promise<Locator>
   */
  async getLocator_HeadingWelcomePage(): Promise<Locator> {
    await this.welcomePageHeading.waitFor({
      state: "visible",
      timeout: 5 * 1000,
    });
    return await this.welcomePageHeading;
  }
  /**
   * Function to check the Welcome Heading via neighbouring elements on the Welcome Page
   * @returns Promise<boolean>
   */
  async isHeadingOnWelcomePageVisible(): Promise<boolean> {
    return await this.welcomePageHeading.isVisible({ timeout: 7 * 1000 });
  }
}
