import { test, Locator, Page, expect } from "@playwright/test";

/**
 * This class contains all the locators and actions of the Product Listing Page
 */
export class ProductListingPage {
  private readonly page: Page;
  private readonly productListSelector: string;
  private readonly productList: Locator;
  private readonly nextPageButton: Locator;
  private readonly addingStatus: Locator;
  private readonly addedStatus: Locator;
  private readonly cartLinkInNotification: Locator;
  private readonly productsListSelector: string;
  private readonly productCardList: Locator;
  private readonly noProductFoundText: Locator;
  private readonly productGrid: Locator;
  private readonly productNameLink_SKUsearch: Locator;
  private readonly productSearchedCount_SKUsearch: Locator;
  private readonly subcategoryList_FilterByCategory: Locator;
  private readonly productAddedSuccessNotification: Locator;
  private readonly breadCrumbValue: Locator;
  private readonly selectedSubCategoryName_FilterByCategory: Locator;
  private readonly pageLoaderIcon: Locator;
  private readonly clearAllLink: Locator;
  private readonly pageIndex_rightArrow: Locator;
  private readonly pageIndex_leftArrow: Locator;
  private readonly currentPageIndex: Locator;
  private readonly gridViewMode: Locator;
  private readonly listViewMode: Locator;
  private readonly gridViewStatus: Locator;
  private readonly listViewStatus: Locator;
  private readonly leftSlider_FilterByPrice: Locator;
  private readonly rightSlider_FilterByPrice: Locator;
  private readonly priceSliderCurrentValue_FilterByPrice: string;
  private readonly priceValuesTextList: Locator;
  private readonly dropdownShowPerPage_Selector: string;
  private readonly productCountResult_showPerPage: Locator;
  private readonly paginationNumbers: Locator;
  private readonly addToCartBTN: Locator;
  private readonly productNames: Locator;
  private readonly sortByArrow_setDescending: Locator;
  private readonly sortByArrow_setAscending: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productListSelector = ".product-item-link";

    this.productList = page.locator(".products-grid .product-item-link");

    this.nextPageButton = page.getByRole("link", { name: "Page Next" });

    this.addingStatus = page.getByRole("button", {
      name: "Adding...",
    });
    this.addedStatus = page.getByRole("button", { name: "Added" });

    this.cartLinkInNotification = page.getByRole("link", {
      name: "shopping cart",
    });

    this.productsListSelector = ".products-grid .product-item-link";

    this.productCardList = page.locator("[class='item product product-item']");

    this.noProductFoundText = page.getByText(
      "Your search returned no results."
    );
    this.productGrid = page.locator(".products-grid");
    this.productNameLink_SKUsearch = page.locator(".product-item-link");
    this.productSearchedCount_SKUsearch = page.locator(".toolbar-number");
    this.subcategoryList_FilterByCategory = page.locator(
      ".filter-options-content a > span"
    );
    this.productAddedSuccessNotification = page.locator(".message-success");
    this.breadCrumbValue = page.locator(".breadcrumbs strong");
    this.selectedSubCategoryName_FilterByCategory = page.locator(
      ".filter-current .filter-value"
    );
    this.pageLoaderIcon = page.locator(".loader img");
    this.clearAllLink = page.getByText("Clear All");
    this.pageIndex_rightArrow = page.locator(".action.next");
    this.pageIndex_leftArrow = page.locator(".action.previous");
    this.currentPageIndex = page.locator(
      ".item.current strong span:last-child"
    );
    this.gridViewMode = page.locator("#mode-grid");
    this.listViewMode = page.locator("#mode-list");
    this.gridViewStatus = page.locator("strong.mode-grid");
    this.listViewStatus = page.locator("strong.mode-list");
    this.leftSlider_FilterByPrice = page.locator(".noUi-handle-lower");
    this.rightSlider_FilterByPrice = page.locator(".noUi-handle-upper");

    this.priceSliderCurrentValue_FilterByPrice = "aria-valuetext";
    this.priceValuesTextList = page.locator(".price-wrapper span");
    this.dropdownShowPerPage_Selector = "#limiter";
    this.productCountResult_showPerPage = page.locator(
      "#toolbar-amount .toolbar-number"
    );
    this.paginationNumbers = page.locator(
      ".items.pages-items li span:nth-of-type(2)"
    );
    this.addToCartBTN = page.getByRole("button", { name: "Add to Cart" });
    this.productNames = page.locator(".product .product-item-link");
    this.sortByArrow_setDescending = page.locator(".sort-asc");
    this.sortByArrow_setAscending = page.locator(".sort-desc");
  }

  /**
   * This will wait for product list to be visible on the product listing page after selecting any category
   * @returns Promise<void>
   */
  async waitForProductListVisibility(): Promise<void> {
    // Wait for item to be visible
    await this.page.waitForSelector(this.productListSelector, {
      state: "visible",
    });
  }

  /**
   * Get the dynamic locator of "Add To Cart" button for the desired product to be added to the cart
   * @param productName
   * @returns Promise<Locator>
   */
  async getLocator_addToCartButtonForDesiredProduct(
    productName: string
  ): Promise<Locator> {
    return this.page
      .locator(".product-item-details")
      .filter({ hasText: productName })
      .getByRole("button", { name: "Add to Cart" })
      .first();
  }

  /**
   * Function to click on the Add To Cart button based on the product name
   * @param categoryName
   */
  async clickAddToCartbutton(productName: string) {
    await test.step(
      "Click on Add To Cart button for product : " + productName,
      async () => {
        const addToCartButton =
          await this.getLocator_addToCartButtonForDesiredProduct(productName);
        await addToCartButton.click();
        await this.waitForAdding_AddedStatus();
      }
    );
  }
  /**
   *  Wait for Adding/Added status dislayed on the Add To Cart button
   * @returns Promise<void>
   */
  async waitForAdding_AddedStatus(): Promise<void> {
    try {
      await this.addingStatus.waitFor({
        state: "visible",
        timeout: 500,
      });
      await this.addedStatus.waitFor({
        state: "visible",
        timeout: 500,
      });
    } catch (error) {
      console.log("Waited for Adding/Added Status...");
    }
  }
  /**
   * Function to find the product via pagination and then Add to the Cart
   * @param productName
   * @returns  Promise<void>
   */
  async findAndAddProductToCart(productName: string): Promise<void> {
    await test.step("Find the product via pagination and Add to cart", async () => {
      let pageFlag = true;
      while (pageFlag) {
        await this.page.waitForSelector(this.productsListSelector); // Wait for products to load

        //Get the product names from the list
        const productNameList = await this.productList.allInnerTexts();
        const nextBtn = this.nextPageButton;

        if (productNameList.includes(productName)) {
          await this.clickAddToCartbutton(productName);
          pageFlag = false; // Product found and added, exit loop
        } else if (await nextBtn.isVisible({ timeout: 2000 })) {
          const nextBtnUrl = await nextBtn.getAttribute("href");

          await this.clickNextPageButton();
          if (nextBtnUrl) {
            await this.page.waitForURL(nextBtnUrl);
          } else {
            await expect(false, "Next button URL not found").toBe(true);
          }
        } else {
          await expect(
            false,
            `Product "${productName}" not present in this category`
          ).toBe(true);
          pageFlag = false; // Product not found and no next button, exit loop
        }
      }
    });
  }

  /**
   * Function to navigate to the shopping cart page via Shopping Cart link attached to the notification
   * @returns Promise<void>
   */
  async navigateToShoppingCartFromNotification(): Promise<void> {
    await test.step("Navigate to the shopping cart page via notification link", async () => {
      // Wait for the link to be attached to the DOM (i.e., appears in the notification)
      await this.cartLinkInNotification.waitFor({
        state: "visible",
        timeout: 5000,
      });
      // Click on the shopping cart link to navigate to the cart page
      await this.cartLinkInNotification.click();
    });
  }

  /**
   * Function to get locator of all the product cards on the product listing page, default size is 12
   * @returns Promise<Locator>
   */
  async getLocator_productCardList(): Promise<Locator> {
    return this.productCardList;
  }

  /**
   * Function to get locator of empty search results on product listing page when searched product is not present
   * @returns Promise<Locator>
   */
  async getLocator_noProductFoundText(): Promise<Locator> {
    await this.noProductFoundText.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    return await this.noProductFoundText;
  }
  /**
   *  This function will click on the NEXT button
   * @returns Promise<void>
   */
  async clickNextPageButton(): Promise<void> {
    await test.step("Click the Next button to go to the next page.", async () => {
      await this.nextPageButton.click();
    });
  }

  /**
   * Get the locator of the Product list/Grid - card which contains all the info when navigated to the search results
   * @returns  Promise<Locator>
   */
  async getLocator_productGrid(): Promise<Locator> {
    await this.productGrid
      .first()
      .waitFor({ state: "visible", timeout: 7 * 1000 });
    return await this.productGrid;
  }

  /**
   * Get Locator for the product name when SKU is searched
   * @returns Promise<Locator>
   */
  async getLocator_productNameLink_forSKUsearch(): Promise<Locator> {
    await this.productNameLink_SKUsearch
      .first()
      .waitFor({ state: "visible", timeout: 7 * 1000 });

    return await this.productNameLink_SKUsearch;
  }

  /**
   * Get locator of the result count if the searched SKU
   * @returns Promise<Locator>
   */
  async getLocator_productSearchedCount_SKUsearch(): Promise<Locator> {
    await this.productSearchedCount_SKUsearch
      .first()
      .waitFor({ state: "visible", timeout: 7 * 1000 });

    return await this.productSearchedCount_SKUsearch;
  }
  /**
   * Get the title of the page
   * @returns Promise<string>
   */
  async getPageTitle(): Promise<string> {
    await this.page.waitForLoadState("domcontentloaded");
    return await this.page.title();
  }

  /**
   * Get Locator of the subcategory list reflected below the Filter By Category section
   * @returns Promise<Locator>
   */

  async getLocator_subcategoryList_FilterByCategory(): Promise<Locator> {
    await this.subcategoryList_FilterByCategory
      .first()
      .waitFor({ state: "visible" });
    return await this.subcategoryList_FilterByCategory;
  }

  /**
   * Get the locator of the selected subcategory name under Filter By Category section
   * @returns Promise<Locator>
   */
  async getLocator_selectedSubCategoryName_FilterByCategory(): Promise<Locator> {
    return this.selectedSubCategoryName_FilterByCategory;
  }

  /**
   * Get the breadcrumb value of the selected category
   * @returns Promise<string>
   */
  async getBreadCrumbValue_selectedCategory(): Promise<string> {
    await this.breadCrumbValue.waitFor({ state: "visible", timeout: 5 * 1000 });
    return await this.breadCrumbValue.innerText();
  }

  /**
   * When the user selects the subcategory name under the Filter By Category section this function will
   * fetch all subcategory text reflected above the Filter By category section (already lowercased + trimmed)
   * @returns  Promise<string[]
   */
  async getSelectedSubCategoryTexts_FilterByCategory(): Promise<string[]> {
    await this.selectedSubCategoryName_FilterByCategory
      .last()
      .waitFor({ state: "attached", timeout: 10 * 1000 });

    await this.page.waitForLoadState("domcontentloaded");
    await this.waitForPageLoader();

    const allValues =
      await this.selectedSubCategoryName_FilterByCategory.allInnerTexts();

    return allValues.map((text) => text.toLowerCase().trim());
  }

  /**
   * Function to select a filter under the Filter By cayegory section
   * @param subcategoryName
   * @returns Promise<void>
   */
  async selectSubcategoryName_FilterByCategory(
    subcategoryName: string
  ): Promise<void> {
    await test.step(`Select the '${subcategoryName}' filter under the Filter By Category section`, async () => {
      const subcategoryNamesLocator = await (
        await this.getLocator_subcategoryList_FilterByCategory()
      ).all();

      for (const subcategory of subcategoryNamesLocator) {
        await subcategory.waitFor({ state: "visible", timeout: 15 * 1000 });
        const text = await subcategory.textContent();
        if (text?.toLowerCase().includes(subcategoryName.toLowerCase())) {
          await subcategory.click();
          //return true;
        }
      }
    });
  }

  /**
   * Function to click on 'Clear All' link above Filter By Category section for the selected filter/subcategory
   * @returns Promise<void>
   */
  async clickClearAll_FilterByCategory(): Promise<void> {
    await test.step("Click on the 'Clear All' link above the Filter By Category section", async () => {
      await this.clearAllLink.click();
    });
  }

  /**
   * Get the product count results at the toolbar after selecting the Show results per page dropdown
   * @returns Promise<number>
   */
  async getDisplayedItemsCount(): Promise<string> {
    await this.page.waitForLoadState("load");
    await this.addToCartBTN
      .first()
      .waitFor({ state: "visible", timeout: 10 * 1000 });

    const spans = await this.productCountResult_showPerPage.all();

    let countText: string;
    if (spans.length >= 2) {
      // Scenario 1 → take second span (index 1)
      countText = await spans[1].innerText();
    } else if (spans.length === 1) {
      // Scenario 2 → only one span
      countText = await spans[0].innerText();
    } else {
      throw new Error("No .toolbar-number spans found in #toolbar-amount");
    }

    return countText.trim();
  }

  /**
   * Function to scroll till the pagination section
   * @returns Promise<void>
   */
  async scrollTillPaginationSection(): Promise<void> {
    await test.step("Scroll to the bottom of the search results", async () => {
      await this.pageIndex_rightArrow.waitFor({
        state: "visible",
        timeout: 7 * 1000,
      });
      await this.pageIndex_rightArrow.scrollIntoViewIfNeeded();
    });
  }

  /**
   * Function to wait for the loader icon to be detached from the DOM structure
   * @returns Promise<void>
   */
  async waitForPageLoader(): Promise<void> {
    await this.pageLoaderIcon
      .waitFor({ state: "detached", timeout: 5000 })
      .catch(() => console.log("Waited for the page to loaded "));
  }

  /**
   * Function to click on the page index arrows (Left/Right)
   * @returns Promise<void>
   */
  async clickPageIndex_Arrow(arrow: "left" | "right"): Promise<void> {
    await test.step("Click on the right arrow to the right of the page number indexes", async () => {
      if (arrow === "right") {
        await this.pageIndex_rightArrow.waitFor({
          state: "visible",
          timeout: 10 * 1000,
        });
        await this.pageIndex_rightArrow.click();
        await this.waitForPageLoader();
      } else if (arrow === "left") {
        await this.pageIndex_leftArrow.waitFor({
          state: "visible",
          timeout: 10 * 1000,
        });
        await this.pageIndex_leftArrow.click();
        await this.waitForPageLoader();
      }
    });
  }

  /**
   * Get locator of the index of the current page
   */
  async getLocator_CurrentPageIndex(): Promise<Locator> {
    await this.currentPageIndex.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    return this.currentPageIndex;
  }

  /**
   * Function to click the the product view as list
   * @returns Promise<void>
   */
  async clickListViewMode(): Promise<void> {
    await test.step("Click on the 'List View' icon at the very top of the search results page", async () => {
      await this.page.waitForLoadState("load");
      await this.listViewMode.waitFor({ state: "visible", timeout: 15 * 1000 });
      await this.listViewMode.click();
    });
  }

  /**
   * Function to click the product view as Grid
   * @returns Promise<void>
   */
  async clickGridViewMode(): Promise<void> {
    await test.step("Click on the 'Grid View' icon at the very top of the search results page.", async () => {
      await this.gridViewMode.waitFor({
        state: "visible",
        timeout: 7 * 1000,
      });
      await this.gridViewMode.click();
    });
  }

  /**
   * Check if the List View is selected or not
   * @returns Promise<boolean>
   */
  async isListViewModeActive(): Promise<boolean> {
    try {
      await this.listViewStatus.waitFor({
        state: "visible",
        timeout: 15 * 1000,
      });
      return await this.listViewStatus.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if the Grid View is selected or not
   * @returns Promise<boolean>
   */
  async isGridViewModeActive(): Promise<boolean> {
    try {
      await this.gridViewStatus.waitFor({ state: "visible", timeout: 3000 });
      return await this.gridViewStatus.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check the visibility of the 'Product Added to the Cart' success notification
   * @param productName
   * @returns Promise<boolean>
   */
  async isProductAddedSuccessMessageDisplayed(
    productName: string
  ): Promise<boolean> {
    try {
      const notificationLocator = await this.productAddedSuccessNotification;
      await notificationLocator.waitFor({
        state: "visible",
        timeout: 10 * 1000,
      });
      const result = await notificationLocator.textContent();

      return await notificationLocator.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get the 'Product Added to the Cart' success notification text
   * @returns Promise<string | null>
   */
  async getProductAddedSuccessMessage(): Promise<string | null> {
    const notificationLocator = await this.productAddedSuccessNotification;
    await notificationLocator.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    const result = await notificationLocator.textContent();

    return result;
  }

  /**
   * Get locator of the Left Slider : Filter By Price
   * @returns Promise<Locator>
   */
  async getLocator_leftSliderFilterByPrice(): Promise<Locator> {
    await this.leftSlider_FilterByPrice.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    return this.leftSlider_FilterByPrice;
  }

  /**
   * Get locator of the Right Slider : Filter By Price
   * @returns Promise<Locator>
   */
  async getLocator_rightSliderFilterByPrice(): Promise<Locator> {
    await this.rightSlider_FilterByPrice.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    return this.rightSlider_FilterByPrice;
  }

  /**
   * Function to adjust the price slider for left/right side based on the locator provided
   * @param slider
   * @param side
   * @param offset
   */
  async adjustPriceSlider_FilterByPrice(
    side: "left" | "right",
    offset: number = 50
  ): Promise<void> {
    if (side === "left") {
      await this.leftSlider_FilterByPrice.waitFor({
        state: "visible",
        timeout: 10 * 1000,
      });

      const box = await this.leftSlider_FilterByPrice.boundingBox();
      if (!box) throw new Error("Slider bounding box not found");

      await this.leftSlider_FilterByPrice.hover();
      await this.page.mouse.down();
      // move towards right (+offset)
      await this.page.mouse.move(box.x + offset, box.y + box.height / 2);
    } else if (side === "right") {
      await this.rightSlider_FilterByPrice.waitFor({
        state: "visible",
        timeout: 10 * 1000,
      });

      const box = await this.rightSlider_FilterByPrice.boundingBox();
      if (!box) throw new Error("Slider bounding box not found");

      await this.rightSlider_FilterByPrice.hover();
      await this.page.mouse.down();
      // move towards left (box.x + box.width - offset)
      await this.page.mouse.move(
        box.x + box.width - offset,
        box.y + box.height / 2
      );
    }

    await this.page.mouse.up();
  }

  /**
   * Fetch the current value of the price slider for left/right side
   * @returns Promise<string>
   */
  async getCurrentValuePriceSlider_FilterByPrice(
    side: "left" | "right"
  ): Promise<string | null> {
    if (side === "left") {
      return this.leftSlider_FilterByPrice.getAttribute(
        this.priceSliderCurrentValue_FilterByPrice
      );
    } else if (side === "right") {
      return this.rightSlider_FilterByPrice.getAttribute(
        this.priceSliderCurrentValue_FilterByPrice
      );
    }
    return null;
  }

  /**
   * Fetch all prices values as text in a list to compare the price filter from slider adjustment operation
   * @returns Promise<number[]>
   */
  async getAllPriceValuesList(): Promise<number[]> {
    const prices = await this.priceValuesTextList.all();
    const priceValues: number[] = [];

    for (const el of prices) {
      const priceText = (await el.textContent())?.trim() ?? "";
      const numericPrice = Number(priceText.replace("$", ""));
      priceValues.push(numericPrice);
    }

    return priceValues;
  }

  /**
   * Function to select the dropdown of the Show results per page - 24,36
   * @param items : number of results per page
   */
  async selectDropdown_ShowItemsPerPage(items: string): Promise<void> {
    await test.step(`Click on the dropdown and select '${items}' `, async () => {
      await this.page.selectOption(this.dropdownShowPerPage_Selector, items);
      await this.waitForPageLoader();
      await this.page.waitForLoadState("domcontentloaded");
    });
  }

  /**
   * Function to click on the page number - Pagination
   * @returns Promise<void>
   */
  async clickPageNumber_Pagination(expectedPageNumber: string): Promise<void> {
    await test.step(
      "Click on the page number : " + expectedPageNumber,
      async () => {
        for (const element of await this.paginationNumbers.all()) {
          const pageNum = await element.textContent();
          if (pageNum == expectedPageNumber) {
            await element.click();
            await this.waitForPageLoader();
            break;
          }
        }
      }
    );
  }

  /**
   * Get the color of the locator
   * @param locator
   * @returns Promise<string>
   */
  async getColorOfLocator(locator: Locator): Promise<string> {
    return await locator.evaluate((el) => getComputedStyle(el).color);
  }

  /**
   * Checks whether the current page URL ends with the given query parameter.
   * @param queryParam
   * @returns Promise<boolean>
   */
  async isURLendWith(queryParam: string): Promise<boolean> {
    await this.page.waitForLoadState("domcontentloaded");
    if (await this.page.url().endsWith(queryParam)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get locator for the success notification user gets when any product is succesfully added to the cart
   * @returns Promise<Locator>
   */
  async getLocator_productAddedSuccessNotification(): Promise<Locator> {
    return this.productAddedSuccessNotification;
  }

  /**
   * Get the price of the product based on the product name parameter
   * @param productName 
   * @returns Promise<number | null>
   */
  async getItemPrice(productName: string): Promise<number | null> {
    const element = await this.page
      .locator(".product-item-details")
      .filter({ hasText: productName })
      .locator(".price")
      .first();
    const text = await element.textContent();
    return text ? parseFloat(text.trim().replace("$", "")) : null;
  }

  /**
   * Function to add mutiple products to the cart provided via list
   * @param productList 
   * @returns Promise<void>
   */
  async addMutilpleProductFromList(productList: string[]): Promise<void> {
    for (const productName of productList) {
      await this.findAndAddProductToCart(productName);
    }
    await this.page.waitForLoadState("domcontentloaded", {
      timeout: 10 * 1000,
    });
  }

  /**
   * Get the list of product names present on the page
   * @returns Promise<string[]>
   */
  async getProductNames(): Promise<string[]> {
    // Wait until at least one product is visible
    await this.productNames.first().waitFor({ state: "visible" });

    // Collect all product names
    const names: string[] = [];
    const count = await this.productNames.count();

    for (let i = 0; i < count; i++) {
      const text = await this.productNames.nth(i).textContent();
      if (text) names.push(text.trim());
    }
    return names;
  }

  /**
   * Function to click on Sort By Arrow button to set descending order
   * @returns Promise<void>
   */
  async clickSortByArrow_setDescending(): Promise<void> {
    await this.sortByArrow_setDescending.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    await this.sortByArrow_setDescending.click();
    await this.waitForPageLoader();
  }

  /**
   * Function to click on Sort By Arrow button to set ascending order
   * @returns Promise<void>
   */
  async clickSortByArrow_setAscending(): Promise<void> {
    await this.sortByArrow_setAscending.waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    await this.sortByArrow_setAscending.click();
    await this.waitForPageLoader();
  }
}
