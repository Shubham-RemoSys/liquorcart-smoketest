import { Locator, Page, Selectors, test } from "@playwright/test";
/**
 * This class contains all the locators and actions of the Home Page
 */
export class HomePage {
  private readonly page: Page;
  private readonly signOutBtn: Locator;
  private readonly links: Locator;
  private readonly hamburgerMenuBtn: Locator;
  private readonly accountLinkHeader: Locator;
  private readonly deliveryHours: Locator;
  private readonly pickupHours: Locator;
  private readonly signInButton: Locator;
  private readonly miniCartIcon: Locator;
  private readonly searchInputBox: Locator;
  private readonly enabledSearchIcon: Locator;
  private readonly hamburgerPanel: Locator;
  private readonly logoSection: Locator;
  private readonly logoImg: Locator;
  private readonly stateCursorActive: Locator;
  private readonly stateSearchIcon: Locator;
  private readonly autoSuggestionList: Locator;
  private readonly deliveryHoursModal: Locator;
  private readonly pickupHoursModal: Locator;
  private readonly productCategories_menuList: Locator;
  private readonly liquorSubcategory_menuList: Locator;
  private readonly liquorCategory_menuList: Locator;
  private readonly shopSpirits: Locator;
  private readonly browseByCategoryList: Locator;
  private readonly wineBannerImg: Locator;
  private readonly shopSpiritsBannerImg: Locator;
  private readonly liquorCarouselSection: Locator;
  private readonly productGrid_liquorCaraousel: Locator;
  private readonly productNameList_liquorCaraousel: Locator;
  private readonly addToCartBtnList_liquorCaraousel: Locator;
  private readonly paginationNumbers_liquorCaraousel: Locator;
  private readonly pageIndex_rightArrow: Locator;
  private readonly pageIndex_leftArrow: Locator;
  private readonly currentPageIndex: Locator;
  private readonly shopWineBTN: Locator;
  private readonly browseAllBTN: Locator;

  constructor(page: Page) {
    this.page = page;

    this.links = page.getByRole("link", { disabled: false });
    this.hamburgerMenuBtn = page.getByRole("tab");
    this.accountLinkHeader = page.getByRole("link", { name: "Account" });
    this.deliveryHours = page.locator("#business-hour");
    this.pickupHours = page.locator("#pickup-business-hour");
    this.signInButton = page.getByRole("link", { name: "Sign In" });
    this.miniCartIcon = page.getByRole("link", { name: "My Cart" });
    this.searchInputBox = page.getByRole("combobox", { name: "Search" });
    this.hamburgerPanel = page.getByRole("tabpanel");
    this.logoSection = page.locator(".logo");
    this.logoImg = page.locator(".logo > img");

    this.signOutBtn = page.getByRole("link", {
      name: "Sign Out",
    });

    this.enabledSearchIcon = page.getByRole("button", {
      name: "Search",
      disabled: false,
    });
    this.stateSearchIcon = page.getByRole("button", {
      name: "Search",
    });
    this.stateCursorActive = page.locator(".label.active");
    this.autoSuggestionList = page.getByRole("listbox").locator("li");
    this.deliveryHoursModal = page.getByRole("heading", {
      name: "Delivery Hours",
    });
    this.pickupHoursModal = page.getByRole("heading", {
      name: "Pickup Hours",
    });
    this.productCategories_menuList = page.locator(
      "ul.nav-desktop a.level-top"
    );
    this.liquorSubcategory_menuList = page
      .locator(".nav-desktop.sticker.hover >li")
      .filter({ hasText: "LIQUOR" })
      .locator("li");

    this.liquorCategory_menuList = page
      .locator("ul.nav-desktop a.level-top")
      .filter({ hasText: "LIQUOR" });

    this.shopSpirits = page.getByRole("link", { name: "Shop Spirits" });
    this.browseByCategoryList = page.locator(".categorieslist");
    this.wineBannerImg = page.locator(".shopcategory .firstcat");
    this.shopSpiritsBannerImg = page.locator(".shopcategory .secondcat");
    this.liquorCarouselSection = page.locator("#star-products");
    this.productGrid_liquorCaraousel = page.locator(".products-grid.row");
    this.productNameList_liquorCaraousel =
      this.productGrid_liquorCaraousel.locator(".prod-head");
    this.addToCartBtnList_liquorCaraousel =
      this.productGrid_liquorCaraousel.getByRole("button", {
        name: "Add to Cart",
      });
    this.paginationNumbers_liquorCaraousel = page.locator(
      ".items.pages-items li a.page"
    );
    this.pageIndex_rightArrow = page.locator(".action.next");
    this.pageIndex_leftArrow = page.locator(".action.previous");
    this.currentPageIndex = page.locator(
      ".item.current strong span:last-child"
    );
    this.shopWineBTN = page.getByRole("button", { name: "shop wine" });
    this.browseAllBTN = page.getByRole("link", { name: "Browse All" });
  }

  /**
   * This method returns list of url of the all links present on the Home Page
   * @returns Promise<string[]>
   */
  async getAllLinksURL(): Promise<string[]> {
    let urlList: string[] = [];
    await test.step("Get list of  url", async () => {
      const count: number = await this.links.count();

      for (let i = 0; i < count; i++) {
        const link: Locator = await this.links.nth(i);

        // Getting visible text of the links
        const text: string = await link.innerText();
        //Getting the href attribute value
        const href: string | null = await link.getAttribute("href");
        if (href) {
          //Printing link details
          console.log(`Visible Link ${i + 1}: ${text} --> ${href}`);

          // Converting relative href value to absolute URL
          const url: string = (await href.startsWith("http"))
            ? href
            : new URL(href, this.page.url()).toString();
          await urlList.push(url);
        } else {
          await console.log(`Visible Link ${i + 1}: ${text} --> HREF is null`);
        }
      }
    });
    return urlList;
  }

  /**
   * This will click on the Hamburger menu button
   * @returns Promise<void>
   */
  async clickHamburgerMenu(): Promise<void> {
    await test.step("Click hamburger menu buttons to expand/contract the menu section ", async () => {
      await this.hamburgerMenuBtn.waitFor({ state: "visible" });
      await this.hamburgerMenuBtn.click();
    });
  }

  /**
   * This function will select the product category from the Hamburger Menu options
   * @returns Promise<void>
   */
  async clickProductCategory(categoryName: string): Promise<void> {
    await test.step(
      "Click on the product category : " +
        categoryName +
        " from hamburger menu section",
      async () => {
        await this.page
          .getByRole("link", { name: categoryName })
          .first()
          .click();
      }
    );
  }

  /**
   * This will check the visibility of the SignOut button on the Home Page after login
   * @returns Promise<boolean>
   */
  async isSignOutButtonVisibile(): Promise<boolean> {
    return await this.signOutBtn.isVisible();
  }

  /**
   * Function to access the mini cart Link locator present on the Home Page header
   * @returns Promise<Locator>
   */
  async getLocator_minicartLink_Header(): Promise<Locator> {
    return this.miniCartIcon;
  }
  /**
   * Function to access the Delivery Hours Link locator present on the Home Page header
   * @returns Promise<Locator>
   */
  async getLocator_deliveryHoursLink_Header(): Promise<Locator> {
    return this.deliveryHours;
  }
  /**
   * Function to access the Pickup Hours Link locator present on the Home Page header
   * @returns Promise<Locator>
   */
  async getLocator_pickupHoursLink_Header(): Promise<Locator> {
    return this.pickupHours;
  }

  /**
   * Function to access the Account Link locator present on the Home Page header
   * @returns Promise<Locator>
   */
  async getLocator_accountLink_Header(): Promise<Locator> {
    return this.accountLinkHeader;
  }

  /**
   * Function to access the SignIn Link locator present on the Home Page header
   * @returns Promise<Locator>
   */
  async getLocator_signInLink_Header(): Promise<Locator> {
    return this.signInButton;
  }

  /**
   * This function will enter the product to the search text field and click on search icon
   * @param ProductName
   * @returns Promise<void>
   */
  async searchProduct(ProductName: string): Promise<void> {
    await test.step("Enter the product name into the search box field and click the search icon.", async () => {
      await this.searchInputBox.pressSequentially(ProductName, {
        delay: 400,
      });
      await this.enabledSearchIcon.waitFor({ timeout: 15 * 1000 });
      await this.enabledSearchIcon.click();
    });
  }

  /**
   * This function will enter the product name to the search text field
   * @param ProductName
   * @returns Promise<void>
   */
  async enterProductNameToSearchBox(productName: string): Promise<void> {
    await test.step(
      "Enter the product name : " + productName + " to the search input box",
      async () => {
        await this.searchInputBox.pressSequentially(productName, {
          delay: 400,
        });
      }
    );
  }

  /**
   * Function to acces Serach Input Box locator
   * @returns Promise<Locator>
   */
  async getLocator_SearchInputBox(): Promise<Locator> {
    return this.searchInputBox;
  }

  /**
   * Function to acces enabled Search Icon locator
   * @returns Promise<Locator>
   */
  async getLocator_enabledSearchIcon(): Promise<Locator> {
    return this.enabledSearchIcon;
  }

  /**
   * Function to acces expanded Hamburger panel locator
   * @returns Promise<Locator>
   */
  async getLocator_HamburgerPanel(): Promise<Locator> {
    return this.hamburgerPanel;
  }

  /**
   * Function to acces Logo Section locator
   * @returns Promise<Locator>
   */
  async getLocator_LogoSection(): Promise<Locator> {
    return this.logoSection;
  }

  /**
   * Function to acces Logo Image locator
   * @returns Promise<Locator>
   */
  async getLocator_LogoImage(): Promise<Locator> {
    return this.logoImg;
  }

  /**
   * This function will logout the user from the application
   * @returns Promise<void>
   */
  async clickSignOutButton(): Promise<void> {
    await test.step("Click SignOut button", async () => {
      await this.signOutBtn.click();
      await this.signInButton.waitFor({ state: "visible", timeout: 15 * 1000 });
    });
  }

  /**
   * Function to get the locator of the Hamburger menu button displayed on the Home Page
   * @returns Promise<Locator>
   */
  async getLocator_HamburgerButton(): Promise<Locator> {
    await this.hamburgerMenuBtn.waitFor({
      state: "visible",
      timeout: 15 * 1000,
    });
    return await this.hamburgerMenuBtn;
  }

  /**
   * This function enters the product name to the search input box to test the autosuggestion functionality
   * @param productName
   */
  async autoSuggest_searchProduct(productName: string): Promise<void> {
    await test.step("Enter the product name into the search input box to test autosuggestion", async () => {
      await this.searchInputBox.pressSequentially(productName, {
        delay: 600,
      });
      //Wait for search icon to be enabled
      await this.enabledSearchIcon.waitFor({ timeout: 15 * 1000 });
    });
  }

  /**
   * Click inside the search input box to search any product
   * @returns Promise<void>
   */
  async clickSearchInputBox(): Promise<void> {
    await test.step("Click inside the search input box", async () => {
      await this.searchInputBox.click();
    });
  }

  /**
   * This will enter two characters in the search input box
   *  @param productName
   * @returns Promise<void>
   */
  async enterTwoChar_SearchItemBox(productName: string): Promise<void> {
    await test.step("Enter two characters in the search input box", async () => {
      await this.searchInputBox.pressSequentially(productName, {
        delay: 400,
      });
    });
  }

  /**
   * Get Locator of the current state of the search icon inside search input box
   * @returns Promise<Locator>
   */
  async getLocator_stateSearchIcon(): Promise<Locator> {
    return await this.stateSearchIcon;
  }

  /**
   * Get Locator of the active state of the cursor when user performs click inside the search input box
   * @returns Promise<Locator>
   */
  async getLocator_cursorActive(): Promise<Locator> {
    await this.stateCursorActive.first().waitFor({
      state: "visible",
      timeout: 7 * 1000,
    });
    return await this.stateCursorActive;
  }

  /**
   * This will enter single characters in the search input box
   *  @param productName
   * @returns Promise<void>
   */
  async enterSingleChar_SearchItemBox(productName: string): Promise<void> {
    await test.step("Enter single character in the search input box", async () => {
      await this.searchInputBox.pressSequentially(productName, {
        delay: 400,
      });
    });
  }

  /**
   * Function to click on the search icon inside the search input box
   * @returns Promise<void>
   */
  async click_SearchIcon_SearchInputBox(): Promise<void> {
    await test.step("Click on the search icon inside the search input box once it's enabled", async () => {
      await this.enabledSearchIcon.click();
    });
  }
  /**
   * Function to click on the SignIn button
   * @returns Promise<void>
   */
  async clickSignInButton(): Promise<void> {
    await test.step("Click on SignIn button", async () => {
      await this.signInButton.waitFor({ state: "visible", timeout: 7 * 1000 });
      await this.signInButton.click();
    });
  }

  /**
   * Get the locator of the Search Item box autosuggestion list
   * @returns Promise<Locator>
   */
  async getLocator_autoSuggestionsList(): Promise<Locator> {
    await this.page.waitForTimeout(2000);
    await this.autoSuggestionList.first().waitFor({
      state: "visible",
      timeout: 10 * 1000,
    });
    return await this.autoSuggestionList;
  }
  /**
   * Function to click on Delivery Hours
   * @returns Pomise<void>
   */
  async clickDeliveryHours(): Promise<void> {
    await test.step("Click on 'Delivery Hours'", async () => {
      await this.deliveryHours.click();
    });
  }

  /**
   * Function to click on the Liquor Category in the Hamburger Menu
   */
  async clickLiquorCategory_HamburgerMenu(): Promise<void> {
    await this.liquorCategory_menuList.click();
  }

  /**
   * Get Locator of the Delivery Hours Modal where the store delivery time is reflected
   * @returns Promise<Locator>
   */
  async getLocator_deliveryHoursModal(): Promise<Locator> {
    return this.deliveryHoursModal;
  }

  /**
   * Function to click on Pickup Hours
   * @returns Pomise<void>
   */
  async clickPickupHours(): Promise<void> {
    await test.step("Click on 'Pickup Hours'", async () => {
      await this.pickupHours.click();
    });
  }

  /**
   * Function to click on the subcategory based on the given category & subcategory name
   * using dynamic locator
   * @param categoryName
   * @param subcategoryName
   * @returns Promise<void>
   */
  async clickSubcategory_HamburgerMenuList(
    categoryName: string,
    subcategoryName: string
  ): Promise<void> {
    await this.page
      .locator(".nav-desktop.sticker.hover >li")
      .filter({ hasText: categoryName })
      .locator("li")
      .filter({ hasText: subcategoryName })
      .click();
  }

  /**
   * Function to click on the All links at the bottom of the categories.
   * @param categoryName
   * @returns Promise<void>
   */
  async clickOnAllLink_HamburgerMenuList(categoryName: string): Promise<void> {
    await this.page
      .locator(".nav-desktop.sticker.hover >li")
      .filter({ hasText: categoryName })
      .locator("li")
      .filter({ hasText: "All " + categoryName })
      .click();
  }

  /**
   * Get Locator of the Pickup Hours Modal where the store pickup time is reflected
   * @returns Promise<Locator>
   */
  async getLocator_pickupHoursModal(): Promise<Locator> {
    return this.pickupHoursModal;
  }

  /**
   * Get locator of the Product categories reflected under the Hamburger Menu List
   * @returns Promise<Locator>
   */
  async getLocator_productCategories_menuList(): Promise<Locator> {
    return await this.productCategories_menuList;
  }

  /**
   * Dynamic locator for the subcategory list based on the Category name parameter
   * @param categoryName
   * @returns Promise<Locator>
   */
  async getLocatorDynamic_productSubcategoryMenuList(
    categoryName: string
  ): Promise<Locator> {
    return await this.page
      .locator(".nav-desktop.sticker.hover >li")
      .filter({ hasText: categoryName })
      .locator("li");
  }

  /**
   * Dynamic locator for the Delivery Hours Business Days
   * @param day
   * @returns
   */
  async getLocatorDynamic_deliveryBusinessDays(day: string): Promise<Locator> {
    const dayTag = await this.page.locator(
      `#business-hour-details p:has-text("${day}")`
    );
    await dayTag.waitFor({ state: "visible", timeout: 7000 });
    return await dayTag;
  }

  /**
   * Dynamic locator for the Pickup Hours Business Days
   * @param day
   * @returns
   */
  async getLocatorDynamic_pickupBusinessDays(day: string): Promise<Locator> {
    const dayTag = await this.page.locator(
      `#pickup-business-hour-details p:has-text("${day}")`
    );
    await dayTag.waitFor({ state: "visible", timeout: 7000 });
    return await dayTag;
  }

  /**
   * Get the locator for the subcategory list of the Liquor
   * @returns Promise<Locator>
   */
  async getLocator_liquorSubcategory_menuList(): Promise<Locator> {
    return this.liquorSubcategory_menuList;
  }

  /**
   * Function to click on the Shop Spirits button within the embedded video on the homepage
   * @returns Promise<void>
   */
  async clickShopSpiritsButton(): Promise<void> {
    await test.step("Click on the 'Shop Spirits' button within the embedded video on the homepage", async () => {
      await this.shopSpirits.waitFor({ state: "visible", timeout: 7 * 1000 });
      await this.shopSpirits.click();
    });
  }
  /**
   * Function to click on the Shop Wine banner Image
   * @returns Promise<void>
   */
  async clickShopWineButton_bannerImg(): Promise<void> {
    await test.step("Click on the Shop Wine banner image", async () => {
      await this.wineBannerImg.waitFor({ state: "visible", timeout: 7 * 1000 });
      await this.wineBannerImg.click();
      await this.page.waitForLoadState("domcontentloaded");
    });
  }

  /**
   * Function to click on the Shop Spirits banner Image
   * @returns Promise<void>
   */
  async clickShopWSpiritsutton_bannerImg(): Promise<void> {
    await test.step("Click on the Shop Spirits banner image", async () => {
      await this.shopSpiritsBannerImg.waitFor({
        state: "visible",
        timeout: 7 * 1000,
      });
      await this.shopSpiritsBannerImg.click();
    });
  }

  /**
   * Function to get the title of the page
   * @returns Promise<string>
   */
  async getTitle(): Promise<string> {
    await this.page.waitForLoadState("networkidle");
    return await this.page.title();
  }

  /**
   * Function to select a category below the 'Browse By Category' section
   * @param productCategory
   * @returns Promise<void>
   */
  async selectCategory_BrowseByCategory(
    productCategory: string
  ): Promise<void> {
    await test.step(
      "Select the " +
        productCategory +
        " category from the 'Browse By Category section",
      async () => {
        const element = await this.browseByCategoryList.getByRole("heading", {
          name: productCategory,
        });
        await element.waitFor({ state: "visible", timeout: 7 * 1000 });
        await element.click();
      }
    );
  }

  /**
   * Function to scroll till the Liquor Carousel Section
   * @returns Promise<void>
   */
  async scrollToLiquorCarouselSection(): Promise<void> {
    await test.step("Scroll to the Liquor Carousel Section", async () => {
      await this.liquorCarouselSection.waitFor({
        state: "visible",
        timeout: 7 * 1000,
      });
      await this.liquorCarouselSection.scrollIntoViewIfNeeded();
    });
  }

  /**
   * Function to click on the Add To cart button for first item from the Liquor Caraousel section
   * @returns Promise<void>
   */
  async addProduct_LiquorCaraousel(): Promise<void> {
    await test.step("Click on the 'Add to Cart' button on one of the product from the Liquor Caraousel section", async () => {
      await this.addToCartBtnList_liquorCaraousel.first().click();
    });
  }

  /**
   * Get locator for the product reflected under liquor caraousel section
   * @returns  Promise<Locator>
   */
  async getLocator_productGrid_liquorCaraousel(): Promise<Locator> {
    return this.productGrid_liquorCaraousel;
  }
  /**
   * Get locator for the first product reflected under liquor caraousel section
   * @returns  Promise<Locator>
   */
  async getLocator_productNameList_liquorCaraousel(): Promise<Locator> {
    return this.productNameList_liquorCaraousel;
  }
  /**
   * Get locator for Add To Cart buttons reflected under liquor caraousel section for the products
   * @returns  Promise<Locator>
   */
  async getLocator_addToCartBtnList_liquorCaraousel(): Promise<Locator> {
    return this.addToCartBtnList_liquorCaraousel;
  }
  /**
   * Get locator for page navigation right arrow key reflected under liquor caraousel section for the pagination
   * @returns Promise<Locator>
   */
  async getLocator_pageIndex_rightArrow(): Promise<Locator> {
    return this.pageIndex_rightArrow;
  }

  /**
   * Get locator for page numbers other than the selected one reflected under liquor caraousel section for the pagination
   * @returns Promise<Locator>
   */
  async getLocator_paginationNumbers_liquorCaraousel(): Promise<Locator> {
    return this.paginationNumbers_liquorCaraousel;
  }
  /**
   * Function to click on the page index arrows (Left/Right)
   * @returns Promise<void>
   */
  async clickPageIndex_Arrow(arrow: "left" | "right"): Promise<void> {
    await test.step("click on the right arrow to the right of the page number indexes", async () => {
      if (arrow === "right") {
        await this.pageIndex_rightArrow.waitFor({
          state: "visible",
          timeout: 7 * 1000,
        });
        const firstProductName = await this.productNameList_liquorCaraousel
          .first()
          .textContent();
        await this.pageIndex_rightArrow.click();
        //   Wait mechanism
        await this.productNameList_liquorCaraousel
          .first()
          .filter({ hasText: firstProductName ?? "" })
          .waitFor({ state: "hidden", timeout: 7 * 1000 });
      } else if (arrow === "left") {
        await this.pageIndex_leftArrow.waitFor({
          state: "visible",
          timeout: 7 * 1000,
        });
        const firstProductName = await this.productNameList_liquorCaraousel
          .first()
          .textContent();
        await this.pageIndex_leftArrow.click();
        //   Wait mechanism
        await this.productNameList_liquorCaraousel
          .first()
          .filter({ hasText: firstProductName ?? "" })
          .waitFor({ state: "hidden", timeout: 7 * 1000 });
      }
    });
  }

  /**
   * Get locator of the index of the current page
   * @returns Promise<Locator>
   */
  async getLocator_CurrentPageIndex(): Promise<Locator> {
    await this.currentPageIndex.waitFor({
      state: "visible",
      timeout: 10 * 1000,
    });
    return this.currentPageIndex;
  }

  /**
   * Function to click on the Shop Wine button button located under the 'Explore our vast selection of Wines' heading.
   * @returns Promise<void>
   */
  async clickShopWineButton(): Promise<void> {
    await this.shopWineBTN.waitFor({ state: "visible", timeout: 7 * 1000 });
    await this.shopWineBTN.click();
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
   * Function to click on the 'Browse All' button on the Home Page
   * @returns Promise<void>
   */
  async clickBrowseAllButton(): Promise<void> {
    await test.step("Click on the 'Browse All' button", async () => {
      await this.browseAllBTN.waitFor({ state: "visible", timeout: 7 * 1000 });
      await this.browseAllBTN.click();
    });
  }
}
