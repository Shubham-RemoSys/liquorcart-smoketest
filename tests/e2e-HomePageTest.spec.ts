import { test, expect } from "../fixtures/fixture";
import { HomePage } from "../pages/HomePage";
import { ProductListingPage } from "../pages/ProductListingPage";

//Load the json data
const configData = require("../config.json");
const appConstant = configData.appConstants;
const hamburgerMenuData = configData.hamburgerMenuData;

test.describe("HomePage", { tag: "@e2e" }, async () => {
  //Preconditions
  test.beforeEach(
    "It can navigate to the 'Welcome Page' and accept the 'Terms'",
    async ({ welcomePage }) => {
      await welcomePage.launchAndAcceptTerms();
    }
  );

  /**
   * Helper Function : Encapsulates a common step that is repeated across multiple test cases.
   * @param homePage
   * @param productListingPage
   * @returns Promise<void>
   */
  async function shopSpiritsNavigationValidation_C7527(
    homePage: HomePage,
    productListingPage: ProductListingPage
  ): Promise<void> {
    await test.step("It can click on the 'Shop Spirits' button within the embedded video on the homepage", async () => {
      await homePage.clickShopSpiritsButton();
    });
    await test.step("It can validate search results are displayed for all liquor types", async () => {
      const actualTitle = await productListingPage.getPageTitle();

      await expect(actualTitle.toLowerCase()).toEqual(
        appConstant.titleLiquorCategoryPage.toLowerCase()
      );

      const breadCrumbValue =
        await productListingPage.getBreadCrumbValue_selectedCategory();
      await expect(breadCrumbValue).toEqual(appConstant.breadCrumbLiquor);
    });
  }

  test("C7527: Shop spirts directs to the Liquor category", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that clicking on 'Shop Spirits' directs you to the liquor category selections.",
    });
    await shopSpiritsNavigationValidation_C7527(homePage, productListingPage);
  });

  test("C7528: Filter by Category for Liquor", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that Liquor can be filtered by category and that the results match the selection criteria.",
    });

    // Loading the subcategory names variables from JSON file
    const subcategoryFilter1 = hamburgerMenuData.liquorSubcategoryVodka; //VODKA
    const subcategoryFilter2 = hamburgerMenuData.liquorSubcategoryWhiskey; //WHISKEY

    /**
     * Helper Function : For repeated test steps
     * Click on the "Shop Spirits" button within the embedded video on the homepage.
     * And Validate Search results are displayed for all liquor types.
     */
    await shopSpiritsNavigationValidation_C7527(homePage, productListingPage);

    await test.step(`It can Select a filter under the Filter By Category section`, async () => {
      //Selecting filter under the 'Filter By Category' section
      await productListingPage.selectSubcategoryName_FilterByCategory(
        subcategoryFilter1
      );
    });

    await test.step(`It can validate search results are displayed for '${subcategoryFilter1}' liquor type`, async () => {
      //Fetching the value reflected above Filter By Category section after the subCategory is selected
      const selectedSubCatText =
        await productListingPage.getSelectedSubCategoryTexts_FilterByCategory();

      for (const expected of [subcategoryFilter1.toLowerCase()]) {
        await expect(selectedSubCatText).toContain(expected);
      }
    });

    await test.step(`It can select another filter under the Filter By Category section`, async () => {
      //Selecting another filter under the Filter By Category section
      await productListingPage.selectSubcategoryName_FilterByCategory(
        subcategoryFilter2
      );
    });
    await test.step(`It can validate search results are displayed for both '${subcategoryFilter1}' & '${subcategoryFilter2}' liquor types`, async () => {
      //Fetching the values reflected above Filter By Category section after the subCategory is selected
      const selectedSubCatText =
        await productListingPage.getSelectedSubCategoryTexts_FilterByCategory();

      for (const expected of [
        subcategoryFilter1.toLowerCase(),
        subcategoryFilter2.toLowerCase(),
      ]) {
        await expect(selectedSubCatText).toContain(expected);
      }
    });

    await test.step("It can click on Clear All link above the Filter By Category section", async () => {
      //Click on the 'Clear All' link
      await productListingPage.clickClearAll_FilterByCategory();
    });

    await test.step("It can validate all the filters are cleared and search results are displayed for all liquor types", async () => {
      // Get the locator of the selected filter/subcategory
      const selectedSubCategoryFilter =
        await productListingPage.getLocator_selectedSubCategoryName_FilterByCategory();

      // Wait until the "Clear All" link is no longer visible
      await selectedSubCategoryFilter.first().waitFor({
        state: "hidden",
        timeout: 30 * 1000,
      });

      // Validating all the filter are cleared
      await expect(selectedSubCategoryFilter).not.toBeVisible();

      const actualTitle = await productListingPage.getPageTitle();

      // Vaildating search results are displayed for all liquor types
      await expect(actualTitle.toLowerCase()).toEqual(
        appConstant.titleLiquorCategoryPage.toLowerCase()
      );
      const breadCrumbValue =
        await productListingPage.getBreadCrumbValue_selectedCategory();

      await expect(breadCrumbValue).toEqual(appConstant.breadCrumbLiquor);

      const urlFlag = await productListingPage.isURLendWith(
        appConstant.urlQueryParamLiquorPage
      );
      await expect(
        urlFlag,
        "URL should end with :" + appConstant.urlQueryParamLiquorPage
      ).toBeTruthy();
    });
  });
  test("C7529:	Filter by Price for Liquor", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that Liquor can be filtered by Price by using the slider and that the results match the selection criteria.",
    });

    /**
     * Helper Function : For repeated test steps
     * Click on the "Shop Spirits" button within the embedded video on the homepage.
     * And Validate Search results are displayed for all liquor types.
     */
    await shopSpiritsNavigationValidation_C7527(homePage, productListingPage);

    await test.step("It can adjust the left slider under the Filter by Price section to the right", async () => {
      // Adjusting the left slider to the right
      await productListingPage.adjustPriceSlider_FilterByPrice("left", 50);
    });

    //Fetching the current value after the left price slider is adjusted
    await test.step("It can validate the search results show the items that fall within that price range", async () => {
      const leftSliderValue =
        await productListingPage.getCurrentValuePriceSlider_FilterByPrice(
          "left"
        );

      await productListingPage.waitForPageLoader();
      // const priceList = await page.locator(".price-wrapper span").all();
      const priceList = await productListingPage.getAllPriceValuesList();
      for (const price of priceList) {
        await expect(Number(leftSliderValue)).toBeLessThan(Number(price));
      }
    });

    await test.step("It can adjust the right slider under the Filter by Price section to the right", async () => {
      await productListingPage.adjustPriceSlider_FilterByPrice("right", 50);
    });

    await test.step("It can validate the search results show the items that fall within that price range", async () => {
      const rightSliderValue =
        await productListingPage.getCurrentValuePriceSlider_FilterByPrice(
          "right"
        );

      await productListingPage.waitForPageLoader();

      const priceList = await productListingPage.getAllPriceValuesList();
      for (const price of priceList) {
        await expect(Number(rightSliderValue)).toBeGreaterThan(Number(price));
      }
    });
  });

  test("C7530: Filter by Category and Price", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that Liquor can be filtered by both Category and Price and that the results match the selection criteria.",
    });

    // Loading the subcategory name variable from JSON file
    const subcategoryFilter1 = hamburgerMenuData.liquorSubcategoryVodka;

    /**
     * Helper Function : For repeated test steps
     * Click on the "Shop Spirits" button within the embedded video on the homepage.
     * And Validate Search results are displayed for all liquor types.
     */
    await shopSpiritsNavigationValidation_C7527(homePage, productListingPage);

    await test.step(`It can Select a filter under the Filter By Category section`, async () => {
      //Selecting the filter under the Filter By Category section

      await productListingPage.selectSubcategoryName_FilterByCategory(
        subcategoryFilter1
      );
    });

    await test.step(`It can validate search results are displayed for '${subcategoryFilter1}' liquor type`, async () => {
      //Fetching the value reflected above Filter By Category section after the subCategory is selected
      const selectedSubCatText =
        await productListingPage.getSelectedSubCategoryTexts_FilterByCategory();

      for (const expected of [subcategoryFilter1.toLowerCase()]) {
        await expect(selectedSubCatText).toContain(expected);
      }
    });

    await test.step("It can adjust the left slider under the Filter by Price section to the right", async () => {
      // Adjusting the left slider to the right
      await productListingPage.adjustPriceSlider_FilterByPrice("left", 50);
    });

    await test.step("It can validate the search results show the items that fall within that price range", async () => {
      const leftSliderValue =
        await productListingPage.getCurrentValuePriceSlider_FilterByPrice(
          "left"
        );

      await productListingPage.waitForPageLoader();
      // const priceList = await page.locator(".price-wrapper span").all();
      const priceList = await productListingPage.getAllPriceValuesList();
      for (const price of priceList) {
        await expect(Number(leftSliderValue)).toBeLessThan(Number(price));
      }
    });
  });

  test("C7531: Number of results per page can be updated", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that the number of results on the page can be adjusted by toggling the dropdown menu for the “Show X per page” setting and the results match the selection criteria.",
    });
    // Loading the dropdown values variables from JSON file
    const dropdownValue24 = appConstant.show24ItemsPerPage;
    const dropdownValue36 = appConstant.show36ItemsPerPage;

    /**
     * Helper Function : For repeated test steps
     * Click on the "Shop Spirits" button within the embedded video on the homepage.
     * And Validate Search results are displayed for all liquor types.
     */
    await shopSpiritsNavigationValidation_C7527(homePage, productListingPage);

    await test.step(`It can scroll to the bottom of the search results and click on the dropdown next to 'Show' and select '${dropdownValue24}'`, async () => {
      //Scrolling to the bottom of the search results
      await productListingPage.scrollTillPaginationSection();

      //Select the dropdown value as '24'
      await productListingPage.selectDropdown_ShowItemsPerPage(dropdownValue24);
    });
    await test.step(`It can validate the Search results show '${dropdownValue24}' items per page`, async () => {
      // Get the product count displayed in toolbar
      const displayedCount = await productListingPage.getDisplayedItemsCount();

      const actualItems = dropdownValue24; //Test Data

      // Validate both match
      await expect(displayedCount).toEqual(actualItems);
    });

    await test.step(`It can scroll to the bottom of the search results and click on the dropdown next to 'Show' and select '${dropdownValue36}'`, async () => {
      //Scrolling to the bottom of the search results
      await productListingPage.scrollTillPaginationSection();

      //Select the dropdown value as 36
      await productListingPage.selectDropdown_ShowItemsPerPage(dropdownValue36);
    });
    await test.step(`It can validate the Search results show '${dropdownValue36}' items per page`, async () => {
      // Get the product count displayed in toolbar
      const displayedCount = await productListingPage.getDisplayedItemsCount();

      const actualItems = dropdownValue36; //Test Data

      // Validate both match
      await expect(displayedCount).toEqual(actualItems);
    });
  });

  test("C7532: Page index selection", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that you can choose a page to view by clicking on the page number at the bottom of the results.",
    });

    /**
     * Helper Function : For repeated test steps
     * Click on the "Shop Spirits" button within the embedded video on the homepage.
     * And Validate Search results are displayed for all liquor types.
     */
    await shopSpiritsNavigationValidation_C7527(homePage, productListingPage);

    await test.step("It can scroll to the bottom of the search results and click on one of the page numbers other than '1'", async () => {
      //Scrolling to the bottom of the search results
      await productListingPage.scrollTillPaginationSection();

      await productListingPage.clickPageNumber_Pagination("2");
    });

    await test.step("It can validate that the user is brought to that page within the search results and the page number at the bottom is black and cannot be clicked on", async () => {
      // Locator - Index of the current page
      const currentPage =
        await productListingPage.getLocator_CurrentPageIndex();

      // Validating the Current page should not be 1
      expect(await currentPage.textContent()).not.toBe("1");

      // Validate it has the expected CSS style
      const color = await productListingPage.getColorOfLocator(
        await productListingPage.getLocator_CurrentPageIndex()
      );

      // Validating the page number is highlighted in black
      await expect(color).toBe("rgb(51, 51, 51)");
    });
  });

  test("C7533: Back and forth arrows", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that clicking on the back arrow returns you to the previous page and clicking on the forward arrow brings you to the next page.",
    });

    /**
     * Helper Function : For repeated test steps
     * Click on the "Shop Spirits" button within the embedded video on the homepage.
     * And Validate Search results are displayed for all liquor types.
     */
    await shopSpiritsNavigationValidation_C7527(homePage, productListingPage);

    await test.step("It can scroll to the bottom of the search results and click on the 'Right arrow' to the right of the page number indexes", async () => {
      //Scrolling to the bottom of the search results
      await productListingPage.scrollTillPaginationSection();

      //Click on the right arrow of the pagination section
      await productListingPage.clickPageIndex_Arrow("right");
    });

    await test.step("It can validate that the user is brought to the second page of the search results", async () => {
      // Get the locator - Index of the current page
      const currentPage =
        await productListingPage.getLocator_CurrentPageIndex();

      await expect(await currentPage.textContent()).toEqual("2");

      // Validating the URL of the second page navigated
      const flag = await productListingPage.isURLendWith("p=2");
      await expect(flag).toBeTruthy();
    });

    await test.step("It can scroll to the bottom of the search results and click on the 'Left arrow' to the left of the page number indexes", async () => {
      //Scrolling to the bottom of the search results
      await productListingPage.scrollTillPaginationSection();

      await productListingPage.clickPageIndex_Arrow("left");
    });

    await test.step("It can validate that the user is brought to the first page of the search results", async () => {
      // Get the locator - Index of the current page
      const currentPage =
        await productListingPage.getLocator_CurrentPageIndex();

      //Validating the user is brought to the first page of the search results
      expect(await currentPage.textContent()).toEqual("1");
    });
  });

  test("C7534: Results View can be changed from Grid to List", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that the View of the results page can be changed from 'Grid View' to 'List View'",
    });

    /**
     * Helper Function : For repeated test steps
     * Click on the "Shop Spirits" button within the embedded video on the homepage.
     * And Validate Search results are displayed for all liquor types.
     */
    await shopSpiritsNavigationValidation_C7527(homePage, productListingPage);

    await test.step("It can click on the 'List View' icon at the very top of the search results page", async () => {
      //Click on the list view
      await productListingPage.clickListViewMode();
    });
    await test.step("It can validate the results are displayed in 'List View'", async () => {
      //Validating the results are in List View
      const flag = await productListingPage.isListViewModeActive();
      await expect(flag).toBeTruthy();
    });

    await test.step("It can click on the 'Grid View' icon at the very top of the search results page", async () => {
      //Click on the grid view
      await productListingPage.clickGridViewMode();
    });

    await test.step("It can validate the results are displayed in 'Grid View'", async () => {
      //Validating the results are in Grid View
      const flag = await productListingPage.isGridViewModeActive();
      await expect(flag).toBeTruthy();
    });
  });

  test("C7535: Success toast appears when adding Item to Cart", async ({
    homePage,
    productListingPage,
    minicartPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that after adding an Item to your cart that a green success toast appears stating, 'You added Item Name to your shopping cart' and that clicking on Shopping cart direct to your cart.",
    });
    // Loading the product names variables from JSON file
    const productName = configData.productInfo.itemName;

    /**
     * Helper Function : For repeated test steps
     * Click on the "Shop Spirits" button within the embedded video on the homepage.
     * And Validate Search results are displayed for all liquor types.
     */
    await shopSpiritsNavigationValidation_C7527(homePage, productListingPage);

    await test.step("It can click on 'Add To Cart' button below one of the items that are in stock", async () => {
      // Clear the cart if any product is added to the cart
      await minicartPage.clearCart();

      // Add the product to the cart
      await await productListingPage.findAndAddProductToCart(productName);
    });
    await test.step("A green success toast appears at the top of the page that says, You added item name to your shopping cart and the Cart icon at the top of the page shows a '1' next to it", async () => {
      const successMessageFlag =
        await productListingPage.isProductAddedSuccessMessageDisplayed(
          productName
        );

      // Check the visibility of the success message
      await expect(successMessageFlag).toBeTruthy();

      // Get the success message notification text
      const successMsg =
        await productListingPage.getProductAddedSuccessMessage();

      await expect(successMsg?.trim()).toEqual(
        "You added " + productName + " to your shopping cart."
      );

      // Wait for the Product QTY to be displayed
      await minicartPage.waitForCartCounterToLoad();

      // Get the QTY of the Items added to the cart
      const productCount = await minicartPage.getCounterNumber();

      // Validate the Item QTY count
      await expect(productCount).toEqual("1");
    });
  });

  test("C7536: Liquor Cart logo returns to homepage", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that clicking on the LiquorCart logo returns you to the home page.",
    });

    /**
     * Helper Function : For repeated test steps
     * Click on the "Shop Spirits" button within the embedded video on the homepage.
     * And Validate Search results are displayed for all liquor types.
     */
    await shopSpiritsNavigationValidation_C7527(homePage, productListingPage);

    await test.step("It can click on the Liquor Cart icon at the top of the page", async () => {
      //Click on the Liquor Cart logo
      (await homePage.getLocator_LogoSection()).click();
    });

    await test.step("It can validate user is returned to the 'Liquor Cart' homepage", async () => {
      //Get the title of the page
      const title = await homePage.getTitle();

      //Validating the user is returned to the Home Page
      await expect(title).toEqual(appConstant.titleHomePage);
    });
  });

  test("C7537: Browse by Category shows results for that category", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that clicking on the Browse By Category containers redirect you to the results that match the selection criteria.",
    });

    await test.step("It can click on one of the options under the 'Browse By Category' heading", async () => {
      // Select the category name under the Browse By Category section
      await homePage.selectCategory_BrowseByCategory(
        hamburgerMenuData.liquorSubcategoryVodka
      );
    });

    await test.step("It can validate that search results are displayed for that Category type", async () => {
      const title = await productListingPage.getPageTitle();
      await expect(title).toEqual(appConstant.titleVodkaSubCategoryPage);
    });
  });

  test("C7538: Browse All shows all results", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that clicking on the Browse All redirect you to the all liquor page.",
    });

    await test.step("It can click on the 'Browse All' button below Browse By Category section", async () => {
      //Click Browse All button
      await homePage.clickBrowseAllButton();
    });

    await test.step("It can validate search results are displayed for all liquor types", async () => {
      const actualTitle = await productListingPage.getPageTitle();

      await expect(actualTitle.toLowerCase()).toEqual(
        appConstant.titleLiquorCategoryPage.toLowerCase()
      );

      const breadCrumbValue =
        await productListingPage.getBreadCrumbValue_selectedCategory();
      await expect(breadCrumbValue).toEqual(appConstant.breadCrumbLiquor);
    });
  });

  test("C7539: Shop Wine banner", async ({ homePage, productListingPage }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that clicking on the Shop Wine banner directs you to results that match the selection criteria.",
    });

    await test.step("It can click on the 'Shop Wine' banner image", async () => {
      //Click on 'Shop Wine' banner image
      await homePage.clickShopWineButton_bannerImg();
    });

    await test.step("It can validate search results are displayed for all wine types", async () => {
      const actualTitle = await productListingPage.getPageTitle();
      await expect(actualTitle).toEqual(appConstant.titleWineCategoryPage);
    });
  });

  test("C7540: Shop Sprits banner", async ({
    homePage,
    productListingPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that clicking on the 'Shop Spirits' banner directs you to results that match the selection criteria.",
    });

    await test.step("It can click on the 'Shop Spirits' banner image", async () => {
      //Click on 'Shop Spirits' banner image
      await homePage.clickShopWSpiritsutton_bannerImg();
    });
    await test.step("It can validate search results are displayed for all wine types", async () => {
      const actualTitle = await productListingPage.getPageTitle();
      await expect(actualTitle).toEqual(appConstant.titleLiquorCategoryPage);
    });
  });

  test("C7541: Add item from Liquor Carousel", async ({
    homePage,
    productListingPage,
    minicartPage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that you can add an item presented in the Liquor Carousel to your cart.",
    });

    await test.step("It can scroll down past the Shop Wine and Shop Spirits banner", async () => {
      //Scroll to the Liquor Caraousel section
      await homePage.scrollToLiquorCarouselSection();
    });

    await test.step("It can  click on the 'Add to Cart' button for one of the three presented options in the liquor carousel", async () => {
      //Add the product to the cart
      await homePage.addProduct_LiquorCaraousel();
    });

    await test.step("A green success toast appears at the top of the page that says, 'You added Item Name to your shopping cart'  and the Cart icon at the top of the page shows a '1' next to it.", async () => {
      //Fetch the product name from liquor caraousel section
      const productName = await (
        await homePage.getLocator_productNameList_liquorCaraousel()
      )
        .first()
        .innerText();

      const successMessageFlag =
        await productListingPage.isProductAddedSuccessMessageDisplayed(
          productName
        );

      // Get the success message notification text
      const successMsg =
        await productListingPage.getProductAddedSuccessMessage();

      // Check the visibility of the success message
      await expect(successMessageFlag).toBeTruthy();

      await expect(successMsg?.trim()).toEqual(
        "You added " + productName + " to your shopping cart."
      );

      // Wait for the Product QTY to be displayed
      await minicartPage.waitForCartCounterToLoad();

      // Get the QTY of the Items added to the cart
      const productCount = await minicartPage.getCounterNumber();

      // Validate the Item QTY count
      await expect(productCount).toEqual("1");
    });
  });

  test("C7542: Out of Stock items don’t appear in the Liquor Carousel", async ({
    homePage,
  }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that Out of Stock items don’t appear in the Liquor Carousel.",
    });
    await test.step("It can scroll down past the Shop Wine and Shop Spirits banner", async () => {
      //Scroll to the Liquor Caraousel section
      await homePage.scrollToLiquorCarouselSection();
    });
    await test.step("It can click on the right arrow until you reach the last page of the Liquor Carousel and validate all presented items should show an 'Add to Cart' button", async () => {
      //Get the locator for the Product Grid - liquorCaraousel
      const productGrid =
        await homePage.getLocator_productGrid_liquorCaraousel();

      //Get the locator of the list of product names reflected in the liquorCaraousel section
      const productNameList =
        await homePage.getLocator_productNameList_liquorCaraousel();

      // Get the locator for the 'Add to cart' button reflected for the products in the liquorCaraousel section
      const buttonList =
        await homePage.getLocator_addToCartBtnList_liquorCaraousel();

      // Get the locator for the Right arrow in the liquorCaraousel section pagination
      const rightArrowKey = await homePage.getLocator_pageIndex_rightArrow();

      while (true) {
        await productGrid.waitFor({ state: "visible", timeout: 10 * 1000 });
        await expect(await productNameList.count()).toEqual(
          await buttonList.count()
        );

        for (const element of await buttonList.all()) {
          const text = (await element.textContent())?.trim();

          // Validating all presented items should show an "Add to Cart" button.
          await expect(text).toEqual("Add to Cart");
        }

        //Iterate till right arrow key is present
        if (await rightArrowKey.isVisible()) {
          const firstProductName = await productNameList.first().textContent();

          await rightArrowKey.click();
          try {
            await productNameList
              .first()
              .filter({ hasText: firstProductName ?? "" })
              .waitFor({ state: "hidden", timeout: 15 * 1000 });
          } catch (e) {
            console.warn(
              "First Product element did not become hidden in time on 1st page, continuing towards the validation..."
            );
          }
        } else {
          break;
        }
      }
    });
  });
  test("C7543: Liquor Carousel Page index selection", async ({ homePage }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that you can choose a page to view by clicking on the page number at the bottom of the results.",
    });
    await test.step("It can scroll down past the Shop Wine and Shop Spirits banner", async () => {
      //Scroll to the Liquor Caraousel section
      await homePage.scrollToLiquorCarouselSection();
    });

    await test.step("It can validate all presented items should show an 'Add to Cart' button", async () => {
      //Get the locator for the Product Grid - liquorCaraousel
      const productGrid =
        await homePage.getLocator_productGrid_liquorCaraousel();

      //Get the locator of the list of product names reflected in the liquorCaraousel section
      const productNameList =
        await homePage.getLocator_productNameList_liquorCaraousel();

      // Get the locator for the 'Add to cart' buttons reflected for the products in the liquorCaraousel section
      const buttonList =
        await homePage.getLocator_addToCartBtnList_liquorCaraousel();
      await productGrid.waitFor({ state: "visible", timeout: 10 * 1000 });

      await expect(await productNameList.count()).toEqual(
        await buttonList.count()
      );
      for (const element of await buttonList.all()) {
        const text = (await element.textContent())?.trim();

        // Validating all presented items should show an "Add to Cart" button.
        await expect(text).toEqual("Add to Cart");
      }
    });

    await test.step("It can click on one of the page numbers below & validate Liquor Carousel is updated with different items and the page number becomes highlighted and cannot be clicked", async () => {
      //Get the locator of the page number list of liquor caraousel section
      const pageNumbersLocator =
        await homePage.getLocator_paginationNumbers_liquorCaraousel();

      // Clicking on a page other than "1"
      for (const element of await pageNumbersLocator.all()) {
        const pageNum = await element.textContent();

        //Capture the list name of product
        const productNameListLocator =
          await homePage.getLocator_productNameList_liquorCaraousel();
        const firstProductName = await (
          await homePage.getLocator_productNameList_liquorCaraousel()
        )
          .first()
          .textContent();
        const firstPageProducts = await (
          await homePage.getLocator_productNameList_liquorCaraousel()
        ).allInnerTexts();

        if (pageNum !== "1") {
          await element.click();
          try {
            await productNameListLocator
              .first()
              .filter({ hasText: firstProductName ?? "" })
              .waitFor({ state: "hidden", timeout: 15 * 1000 });
          } catch (e) {
            console.warn(
              "First Product element did not become hidden in time on 1st page, continuing towards the validation..."
            );
          }
          const secondPageProducts =
            await productNameListLocator.allInnerTexts();

          await expect(firstPageProducts).not.toEqual(secondPageProducts);
          break;
        }
      }

      //Get the locator of the current page index
      const currentPageIndex = await homePage.getLocator_CurrentPageIndex();

      // Validate it has the expected CSS style
      const color = await homePage.getColorOfLocator(currentPageIndex);

      // Validate the selected/current page index is highlighed
      await expect(color).toBe("rgb(51, 51, 51)");
    });
  });
  test("C7544: Liquor Carousel Back and forth arrows", async ({ homePage }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that clicking on the back arrow returns you to the previous page and clicking on the forward arrow brings you to the next page.",
    });
    await test.step("It can scroll down past the Shop Wine and Shop Spirits banner", async () => {
      //Scroll to the Liquor Caraousel section
      await homePage.scrollToLiquorCarouselSection();
    });

    await test.step("It can validate all presented items should show an 'Add to Cart' button", async () => {
      //Get the locator for the Product Grid - liquorCaraousel
      const productGrid =
        await homePage.getLocator_productGrid_liquorCaraousel();

      //Get the locator of the list of product names reflected in the liquorCaraousel section
      const productNameList =
        await homePage.getLocator_productNameList_liquorCaraousel();

      // Get the locator for the 'Add to cart' buttons reflected for the products in the liquorCaraousel section
      const buttonList =
        await homePage.getLocator_addToCartBtnList_liquorCaraousel();

      await productGrid.waitFor({ state: "visible", timeout: 7 * 1000 });

      await expect(await productNameList.count()).toEqual(
        await buttonList.count()
      );

      for (const element of await buttonList.all()) {
        const text = (await element.textContent())?.trim();

        // Validating all presented items should show an "Add to Cart" button.
        await expect(text).toEqual("Add to Cart");
      }
    });

    await test.step("It can click on the right arrow to the right of the page number indexes", async () => {
      //Click on the righ arrow: pagination
      await homePage.clickPageIndex_Arrow("right");
    });

    await test.step("It can validate that user is brought to the second page of the Liquor Carousel", async () => {
      // Get the locator - Index of the current page
      const currentPage = await homePage.getLocator_CurrentPageIndex();

      await expect(await currentPage.textContent()).toEqual("2");
    });

    await test.step("It can click on the left arrow to the left of the page number indexes", async () => {
      //Click on the left arrow : Pagination
      await homePage.clickPageIndex_Arrow("left");
    });

    await test.step("It can validate that user is brought to the first page of the Liquor Carousel", async () => {
      // Locator - Index of the current page
      const currentPage = await homePage.getLocator_CurrentPageIndex();

      await expect(await currentPage.textContent()).toEqual("1");
    });
  });

  test("C7545: Shop wine button", async ({ homePage, productListingPage }) => {
    test.info().annotations.push({
      type: "Description",
      description:
        "Verify that clicking on the Shop Wine button directs you to results that match the selection criteria.",
    });
    await test.step("It can scroll down past the Liquor Carousel", async () => {
      await homePage.scrollToLiquorCarouselSection();
    });

    await test.step("It can click on the 'Shop Wine' button located under the 'Explore our vast selection of Wines heading", async () => {
      await homePage.clickShopWineButton();
    });

    await test.step("It can validate Search results are displayed for all wine types", async () => {
      const actualTitle = await homePage.getTitle();
      await expect(actualTitle).toEqual(appConstant.titleWineCategoryPage);

      const breadCrumbValue =
        await productListingPage.getBreadCrumbValue_selectedCategory();
      await expect(breadCrumbValue).toEqual(appConstant.breadCrumbWine);
    });
  });
});
