import { Locator, Page, test } from "@playwright/test";
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
}
