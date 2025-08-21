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
  private readonly emailError: Locator;
  private readonly showpassword: Locator;
  private readonly passwordVisibility: Locator;
  private readonly unregisteredAccErrorMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.locator(".authorization-link");
    this.username = page.getByRole("textbox", { name: "Email" });
    this.password = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Sign In" });
    this.acceptButtonSelector = ".m-accept";
    this.emailError = page.locator("#email-error");
    this.showpassword = page.locator("#show-password");
    this.passwordVisibility = page.locator("[type='text']").first();
    this.unregisteredAccErrorMsg = page
      .getByRole("alert")
      .filter({ hasText: "The account sign-in was" })
      .first();
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
      await this.signInButton.waitFor({ state: "visible", timeout: 10 * 1000 });
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

  /**
   * Get the title of the login page
   * @returns Promise<String>
   */
  async getTitleLoginPage(): Promise<String> {
    await test.step("Get the title of the 'Login Page'", async () => {
      await this.page.waitForLoadState("domcontentloaded", {
        timeout: 10 * 1000,
      });
    });
    return await this.page.title();
  }
  /**
   * Function to capture the error when any invalid email/username is entered
   * @returns Promise<String>
   */
  async getInvalidEmailError(): Promise<String> {
    await this.emailError.waitFor({ state: "visible", timeout: 7 * 1000 });
    return await this.emailError.innerText();
  }
  /**
   * Enter the email/username
   * @param username
   * @returns Promise<void>
   */
  async enterEmail(username: string): Promise<void> {
    await test.step("Enter the email", async () => {
      await this.username.fill(username);
    });
  }

  /**
   * Enter the password
   * @param password
   * @returns Promise<void>
   */
  async enterPassword(password: string): Promise<void> {
    await test.step("Enter the password", async () => {
      await this.password.fill(password);
    });
  }

  /**
   * Click on the 'Show Password' checkbox to make the password visible to the user
   * @requires Promise<void>
   */
  async clickCheckbox_showpassword(): Promise<void> {
    await test.step("Click on the 'Show Password' checkbox", async () => {
      await this.showpassword.click();
    });
  }

  /**
   * Get locator of the password visibility
   * @returns Promise<Locator>
   */
  async getLocator_passwordVisibility(): Promise<Locator> {
    return await this.passwordVisibility;
  }

  /**
   * Get the error message when an unregistered user attempts to login.
   * @returns Promise<string>
   */
  async getErrorMessage_unregisteredAccount(): Promise<string> {
    await this.unregisteredAccErrorMsg.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    return await this.unregisteredAccErrorMsg.innerText();
  }
}
