import { APIResponse } from "@playwright/test";
import { test, expect } from "../fixtures/fixture";
//Loads the json data
const configData = require("../config.json");

test.describe("Home Page Elements Test", { tag: "@guest" }, async () => {
  test.beforeEach("It can navigate to the Home Page", async ({ loginPage }) => {
    await loginPage.launchApp();
  });
  test("It can validate all links on the Home Page", async ({
    homePage,
    request,
  }) => {
    for (const link of await homePage.getAllLinksURL()) {
      if (!link.startsWith("http://") && !link.startsWith("https://")) {
        console.warn(`Skipping unsupported URL: ${link}`);
        continue;
      }
      const response: APIResponse = await request.get(link);
      test.step("It can validate the status code for => " + link, async () => {
        await expect
          .soft(response.status(), `Expected status < 404 for URL: ${link}`)
          .toBeLessThan(404);
      });
    }
  });
  test("It can validate the header of the Home Page", async ({ homePage }) => {
    await homePage.clickHamburgerMenu();
    await test.step("It can expand the hamburger menu section ", async () => {
      await expect(
        (await homePage.getLocator_HamburgerPanel()).isVisible()
      ).toBeTruthy();
    });
    await homePage.clickHamburgerMenu();
    await test.step("It can contract the hamburger menu section ", async () => {
      await expect(
        (
          await homePage.getLocator_HamburgerPanel()
        ).isHidden
      ).toBeTruthy();
    });

    await test.step("It can validate the logo of the application & url should be attached to it", async () => {
      await expect(await homePage.getLocator_LogoSection()).toBeVisible();
      await expect(await homePage.getLocator_LogoSection()).toHaveAttribute(
        "href",
        configData.testurl
      );
      await expect(await homePage.getLocator_LogoImage()).toHaveAttribute(
        "src",
        configData.logourl
      );
    });

    await test.step("It can validate the search input box, search icon should be enabled when user enters any item name", async () => {
      await expect(await homePage.getLocator_SearchInputBox()).toBeVisible();
      await expect(await homePage.getLocator_SearchInputBox()).toBeEditable();

      // Entering Item name in inputbox
      const productName: string = configData.productInfo.itemName;
      await homePage.enterProductNameToSearchBox(productName);
      await expect(
        await homePage.getLocator_enabledSearchIcon(),
        "'Search Icon' should be enabled"
      ).toBeEnabled();
    });

    await test.step("It can validate header links visibility & clickability", async () => {
      await expect(
        await homePage.getLocator_minicartLink_Header()
      ).toBeVisible();
      await expect(
        await homePage.getLocator_minicartLink_Header()
      ).toBeEnabled();

      await expect(
        await homePage.getLocator_deliveryHoursLink_Header()
      ).toBeVisible();
      await expect(
        await homePage.getLocator_deliveryHoursLink_Header()
      ).toBeEnabled();

      await expect(
        await homePage.getLocator_pickupHoursLink_Header()
      ).toBeVisible();
      await expect(
        await homePage.getLocator_pickupHoursLink_Header()
      ).toBeEnabled();

      await expect(
        await homePage.getLocator_accountLink_Header()
      ).toBeVisible();
      await expect(
        await homePage.getLocator_accountLink_Header()
      ).toBeEnabled();

      await expect(await homePage.getLocator_signInLink_Header()).toBeVisible();
      await expect(await homePage.getLocator_signInLink_Header()).toBeEnabled();
    });
  });
});
