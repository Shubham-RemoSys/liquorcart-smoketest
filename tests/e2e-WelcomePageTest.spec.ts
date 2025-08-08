import { test, expect } from "../fixtures/fixture";
//Load the json data
const configData = require("../config.json");

test.describe("Welcome Page", { tag: "@e2e" }, async () => {
  //Preconditions
  test.beforeEach(
    "It can launch the browser and open the application",
    async ({ welcomePage }) => {
      await welcomePage.launchAppURL();
    }
  );
  test("C7508: User can accept the terms and access the main page", async ({
    welcomePage,
    homePage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that a user is naviagated to the Home Page after accepting 'Terms' on the 'Welcome Page'",
    });

    await test.step("It can validate the Welcome Page is displayed", async () => {
      await expect(await welcomePage.isHeadingOnWelcomePageVisible(), {
        message: "The Welcome page is displayed.",
      }).toBeTruthy();
    });

    //Accepting the Terms
    await welcomePage.clickAcceptAndEnter();
    await test.step("It can validate user can navigate to the 'HomePage' after accepting the 'Terms' on 'WelcomePage'", async () => {
      await expect(await homePage.getLocator_HamburgerButton(), {
        message: "User is brought to the LiquorCart homepage.",
      }).toBeVisible();
    });
  });
});
