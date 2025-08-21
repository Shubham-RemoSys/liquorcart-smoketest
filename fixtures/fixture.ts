import { test as fixture, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { ProductListingPage } from "../pages/ProductListingPage";
import { MinicartPage } from "../pages/MinicartPage";
import { ShoppingCartPage } from "../pages/ShoppingCartPage";
import { ShippingPage } from "../pages/ShippingPage";
import { PaymentPage } from "../pages/PaymentPage";
import { CheckoutSuccessPage } from "../pages/CheckoutSuccessPage";
import { WelcomePage } from "../pages/WelcomePage";

type pages = {
  loginPage: LoginPage;
  homePage: HomePage;
  productListingPage: ProductListingPage;
  minicartPage: MinicartPage;
  shoppingCartPage: ShoppingCartPage;
  shippingPage: ShippingPage;
  paymentPage: PaymentPage;
  checkoutSuccessPage: CheckoutSuccessPage;
  welcomePage: WelcomePage;
};

const test = fixture.extend<pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productListingPage: async ({ page }, use) => {
    await use(new ProductListingPage(page));
  },
  minicartPage: async ({ page }, use) => {
    await use(new MinicartPage(page));
  },
  shoppingCartPage: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },
  shippingPage: async ({ page }, use) => {
    await use(new ShippingPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  checkoutSuccessPage: async ({ page }, use) => {
    await use(new CheckoutSuccessPage(page));
  },
  welcomePage: async ({ page }, use) => {
    await use(new WelcomePage(page));
  },
});
export { test, expect };
