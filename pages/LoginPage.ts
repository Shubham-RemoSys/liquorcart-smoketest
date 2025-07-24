import { Locator, Page, test } from "@playwright/test";
//Loads the json data
const configData = require("../config.json");

/**
 * This class contains all the locators and actions of the Login Page
 */

export class LoginPage {
  private readonly page: Page;
  private readonly signInButton: Locator;
  private readonly username: Locator;
  private readonly password: Locator;
  private readonly loginButton: Locator;
  private readonly acceptButtonSelector: string;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.locator(".authorization-link");
    this.username = page.getByRole("textbox", { name: "Email" });
    this.password = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Sign In" });
    this.acceptButtonSelector = ".m-accept";
  }

  /**
   * This function will launch the app url and click on the Accept & Enter button
   * @returns Promise<void>
   */
  async launchApp(): Promise<void> {
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
   * This will accept the confirmation box that the user is above 21 years of age
   * @returns Promise<void>
   */
  async clickAcceptAndEnter(): Promise<void> {
    await test.step("Click on Accept & Enter confirmation button", async () => {
      await this.page.locator(".m-accept").click();
    });
  }

  /**
   * Function to click on the SignIn button
   * @returns Promise<void>
   */
  async clickSignInButton(): Promise<void> {
    await test.step("Click on SignIn button", async () => {
      await this.signInButton.click();
    });
  }

  /**
   * This will login the user to the application
   * @returns Promise<void>
   */
  async login(username: string, password: string): Promise<void> {
    await test.step("Enter Username", async () => {
      await this.username.pressSequentially(username, { delay: 100 });
    });
    await test.step("Enter Password", async () => {
      await this.password.pressSequentially(password, { delay: 100 });
    });
    await test.step("Click SignIn button", async () => {
      await this.loginButton.click();
    });
  }

  /**
   ** This will launch the app and login the user to the application
   * @returns Promise<void>
   */
  async launchAndLogin(username: string, password: string): Promise<void> {
    await this.launchApp();
    await this.clickSignInButton();
    await this.login(username, password);
  }
}
