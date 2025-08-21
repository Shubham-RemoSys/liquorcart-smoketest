import { title } from "process";
import { test, expect } from "../fixtures/fixture";
//Load the json data
const configData = require("../config.json");

test.describe("User-Login Validation Test", { tag: "@login" }, async () => {
  test("It can login with valid credentials", async ({
    loginPage,
    homePage,
  }) => {
    await loginPage.launchApp();
    await loginPage.clickSignInButton();
    //Validating the title of SignIn Page
    await expect(await loginPage.getTitleLoginPage()).toEqual(
      configData.appConstants.titleLoginPage
    );
    await loginPage.login(configData.username, configData.password);
    await expect(await homePage.isSignOutButtonVisibile()).toBeTruthy();
  });
});
