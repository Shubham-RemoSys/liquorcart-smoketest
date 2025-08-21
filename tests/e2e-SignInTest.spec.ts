import { test, expect } from "../fixtures/fixture";
//Load the json data
const configData = require("../config.json");

test.describe("Sign In", { tag: "@e2e" }, async () => {
  //Preconditions
  test.beforeEach(
    "It can navigate to the 'Welcome Page' and accept the 'Terms'",
    async ({ welcomePage }) => {
      await welcomePage.launchAndAcceptTerms();
    }
  );

  test("C7510: Invalid email address error", async ({
    loginPage,
    homePage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that when an invalid email format is entered that error validation message appears.",
    });

    await homePage.clickSignInButton();

    //Validating the title of SignIn Page
    await expect(await loginPage.getTitleLoginPage()).toEqual(
      configData.appConstants.titleLoginPage
    );

    await test.step("It can enter an email that's not in proper format, any password, and then click on 'Sign In'", async () => {
      await loginPage.login(
        configData.loginInfo.invalidUsername,
        configData.loginInfo.invalidPassword
      );
    });

    const errorMessage: String = await loginPage.getInvalidEmailError();

    test.step("It can validate the error message when an invalid email format is entered", async () => {
      await expect(errorMessage, {
        message: "Please enter a valid email address (Ex: johndoe@domain.com).",
      }).toEqual(configData.appConstants.invalidEmailError);
    });
  });

  test("C7511: Unregistered account error", async ({ loginPage, homePage }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that an error appears when an unregistered user attempts to login.",
    });

    await homePage.clickSignInButton();

    //Validating the title of SignIn Page
    await expect(await loginPage.getTitleLoginPage()).toEqual(
      configData.appConstants.titleLoginPage
    );

    await test.step("It can enter an unregistered email address, any password, and click on 'Sign In'", async () => {
      await loginPage.login(
        configData.loginInfo.unregisteredEmail,
        configData.loginInfo.invalidPassword
      );
    });

    const errorMessage = await loginPage.getErrorMessage_unregisteredAccount();

    test.step("It can validate that an error appears when an unregistered user attempts to login.", async () => {
      await expect(errorMessage, {
        message:
          "The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.",
      }).toEqual(configData.appConstants.unregisteredEmailError);
    });
  });

  test("C7512: Enabling Show Password displays the password", async ({
    homePage,
    loginPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that the password is shown when enabling “Show Password”.",
    });

    await homePage.clickSignInButton();
    //Validating the title of SignIn Page
    await expect(await loginPage.getTitleLoginPage()).toEqual(
      configData.appConstants.titleLoginPage
    );

    await loginPage.enterEmail(configData.loginInfo.username);
    await loginPage.enterPassword(configData.loginInfo.password);
    await loginPage.clickCheckbox_showpassword();

    test.step("It can validate if the password is visible when 'Show Password' is checked", async () => {
      await expect(await loginPage.getLocator_passwordVisibility(), {
        message: "The password is exposed.",
      }).toBeVisible();
    });
  });

  /**
 *       C7513 Reset Password - Verify that you can reset your password and receive the password reset email.
 * 
         C7514 Login with reset password - Verify that after resetting your password you’re able to login.

         These test cases involves external email verification, which is not consistently automatable 
         due to third-party dependencies and security constraints.
 */
});
