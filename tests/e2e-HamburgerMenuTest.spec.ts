import { test, expect } from "../fixtures/fixture";
//Load the json data
const configData = require("../config.json");
const appConstant = configData.appConstants;
const hamburgerMenuData = configData.hamburgerMenuData;

test.describe("Hamburger Menu", { tag: "@e2e" }, async () => {
  //Preconditions
  test.beforeEach(
    "It can navigate to the 'Welcome Page' and accept the 'Terms'",
    async ({ welcomePage }) => {
      await welcomePage.launchAndAcceptTerms();
    }
  );
  test("C7524: Category headers direct you to full category results", async ({
    homePage,
    productListingPage,
  }) => {
    await test.step("It can open Hamburger menu and validate a list of categories and subcategories are displayed", async () => {
      await homePage.clickHamburgerMenu();

      //Getting the list of product categories with help of locator
      const productCatItemsText = await (
        await homePage.getLocator_productCategories_menuList()
      ).allInnerTexts();

      // Validating all expected categories exist in the list
      for (const category of hamburgerMenuData.productCategoryList) {
        //Soft Assert since values might differ for different environments
        await expect.soft(productCatItemsText).toContain(category);
      }

      for (const categoryName of productCatItemsText) {
        const productSubcategoryList = await (
          await homePage.getLocatorDynamic_productSubcategoryMenuList(
            categoryName
          )
        ).allInnerTexts();

        await expect(productSubcategoryList.length).toBeGreaterThan(1);
      }
    });

    await test.step("It can click on one of the Category headings and validate all results for that Category are displayed", async () => {
      //Captures the list of Subcategory reflected below the Liquor Category in the Hamburger Menu
      const liquorSubcategoryList = await (
        await homePage.getLocator_liquorSubcategory_menuList()
      ).allInnerTexts();

      //Clicking on the Liquor product category
      await homePage.clickLiquorCategory_HamburgerMenu();

      const expectedTitle = await productListingPage.getPageTitle();
      await expect(appConstant.titleLiquorCategoryPage.toLowerCase()).toEqual(
        expectedTitle.toLowerCase()
      );

      // Getting the liquor subcategory list from the Product Listing Page
      //Locator
      const subcategoryList_Liquor =
        await productListingPage.getLocator_subcategoryList_FilterByCategory();

      // Capturing the subcategory list reflected on the Product listing page under 'Filter By Category' section
      const subcategoryListAllinnerText_Liquor =
        await subcategoryList_Liquor.allInnerTexts();

      // Trimming the values of the sub-categories on product isting page to get the proper names
      const trimmedSubCatList = subcategoryListAllinnerText_Liquor.map(
        (item) => {
          // This will get the value - everything before space+number
          const match = item.match(/^(.*?)\s\d/);
          return match ? match[1].trim() : item;
        }
      );

      for (const names of await trimmedSubCatList) {
        await expect(liquorSubcategoryList).toContain(names.toUpperCase());
      }
    });
  });

  test("C7525: Subcategories direct to individual results", async ({
    homePage,
    productListingPage,
  }) => {
    await test.step("It can open Hamburger menu and validate a list of categories and subcategories are displayed", async () => {
      await homePage.clickHamburgerMenu();
      //Getting the list of product categories with help of locator
      const productCatItemsText = await (
        await homePage.getLocator_productCategories_menuList()
      ).allInnerTexts();

      // Validate all expected categories exist in the list
      for (const category of hamburgerMenuData.productCategoryList) {
        await expect.soft(productCatItemsText).toContain(category);
      }

      for (const categoryName of productCatItemsText) {
        const productSubcategoryList = await (
          await homePage.getLocatorDynamic_productSubcategoryMenuList(
            categoryName
          )
        ).allInnerTexts();

        await expect(productSubcategoryList.length).toBeGreaterThan(1);
      }
    });

    await test.step("It can Click on one of the subcategories under the main category & validate results pertinent to that subcategory are displayed", async () => {
      await homePage.clickSubcategory_HamburgerMenuList(
        hamburgerMenuData.liquorCategory,
        hamburgerMenuData.liquorSubcategoryVodka
      );

      const expectedTitle = await productListingPage.getPageTitle();
      await expect(appConstant.titleVodkaSubCategoryPage).toEqual(
        expectedTitle
      );
    });
  });

  test("C7526: The “All” links direct you to full category results", async ({
    homePage,
    productListingPage,
  }) => {
    await test.step("It can open Hamburger menu and validate a list of categories and subcategories are displayed", async () => {
      await homePage.clickHamburgerMenu();

      //Getting the list of product categories with help of locator
      const productCatItemsText = await (
        await homePage.getLocator_productCategories_menuList()
      ).allInnerTexts();

      // Validate all expected categories exist in the list
      for (const category of hamburgerMenuData.productCategoryList) {
        await expect.soft(productCatItemsText).toContain(category);
      }

      for (const categoryName of productCatItemsText) {
        const productSubcategoryList = await (
          await homePage.getLocatorDynamic_productSubcategoryMenuList(
            categoryName
          )
        ).allInnerTexts();
        await expect(productSubcategoryList.length).toBeGreaterThan(1);
      }
    });

    await test.step("It can click on one of the 'All' links at the bottom of the categories & validate all results for that Category are displayed", async () => {
      //Click on one of the "All" links at the bottom of the categories.
      await homePage.clickOnAllLink_HamburgerMenuList(
        hamburgerMenuData.beerCategory
      );

      const expectedTitle = (
        await productListingPage.getPageTitle()
      ).toLowerCase();
      await expect(
        appConstant.titleAllBeerSubCategoryPage.toLowerCase()
      ).toEqual(expectedTitle);
    });
  });

  test("C7586: Hamburger menu can be closed", async ({ homePage }) => {
    await test.step("It can open Hamburger menu and validate a list of categories and subcategories are displayed", async () => {
      await homePage.clickHamburgerMenu();
      //Getting the list of product categories with help of locator
      const productCatItemsText = await (
        await homePage.getLocator_productCategories_menuList()
      ).allInnerTexts();

      // Validate all expected categories exist in the list
      for (const category of hamburgerMenuData.productCategoryList) {
        await expect.soft(productCatItemsText).toContain(category);
      }

      for (const categoryName of productCatItemsText) {
        const productSubcategoryList = await (
          await homePage.getLocatorDynamic_productSubcategoryMenuList(
            categoryName
          )
        ).allInnerTexts();

        await expect(productSubcategoryList.length).toBeGreaterThan(1);
      }
    });

    await test.step("It can contract the hamburger menu section", async () => {
      await homePage.clickHamburgerMenu();
      await expect(
        (
          await homePage.getLocator_HamburgerPanel()
        ).isHidden
      ).toBeTruthy();
    });
  });
});
