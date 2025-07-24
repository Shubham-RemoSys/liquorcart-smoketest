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
   *  Waait for Adding/Added status dislayed on the Add To Cart button
   * @returns Promise<void>
   */
  async waitForAdding_AddedStatus(): Promise<void> {
    try {
      await this.addingStatus.waitFor({
        state: "visible",
        timeout: 5000,
      });
      await this.addedStatus.waitFor({
        state: "visible",
        timeout: 5000,
      });
    } catch (error) {
      console.log("Adding/Added Status is not displayed");
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
      await this.cartLinkInNotification.waitFor({ state: "attached" });
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
    return this.noProductFoundText;
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
}
