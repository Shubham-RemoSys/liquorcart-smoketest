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
}
