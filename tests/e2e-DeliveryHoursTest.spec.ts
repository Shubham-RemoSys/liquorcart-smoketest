import { test, expect } from "../fixtures/fixture";
//Load the json data
const configData = require("../config.json");
const appConstant = configData.appConstants;
test.describe("Delivery Hours", { tag: "@e2e" }, async () => {
  //Preconditions
  test.beforeEach(
    "It can navigate to the 'Welcome Page' and accept the 'Terms'",
    async ({ welcomePage }) => {
      await welcomePage.launchAndAcceptTerms();
    }
  );
  test("C7518: Delivery hours are shown and modal can be closed", async ({
    homePage,
  }) => {
    await test.step("It can open Delivery Hours modal", async () => {
      await homePage.clickDeliveryHours();
      await expect(
        (
          await (await homePage.getLocator_deliveryHoursModal()).innerText()
        ).trim()
      ).toEqual(appConstant.deliveryHoursModal);
    });
    await test.step("It can show the times of Delivery for Monday - Sunday", async () => {
      //Looping - Dynamic locator for the Business Days 'Day Tag'
      for (const day of appConstant.days) {
        const dayTag = await homePage.getLocatorDynamic_deliveryBusinessDays(
          day
        );

        //Validating that the day value exist
        await expect(dayTag).toBeVisible();

        // Extract the full text (e.g., "Monday: 10 AM - 7 PM")
        const fullText = await dayTag.innerText();

        // Removing the day part to get the time
        const timeText = fullText.replace(day, "").trim();

        // Validate that time value is not empty
        await expect(timeText.length).toBeGreaterThan(7);
      }
    });

    await test.step("It can click any where on the page & validate Delivery Hours modal is closed", async () => {
      await (await homePage.getLocator_deliveryHoursModal()).click();
      await expect(
        await homePage.getLocator_deliveryHoursModal()
      ).not.toBeVisible();
    });
  });
});
