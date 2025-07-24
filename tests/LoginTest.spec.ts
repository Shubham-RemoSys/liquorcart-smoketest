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
    await loginPage.login(configData.username, configData.password);
    await expect(homePage.isSignOutButtonVisibile).toBeTruthy();
  });
});
