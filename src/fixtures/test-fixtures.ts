import { test as base, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ContactPage } from '../pages/ContactPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ProductsPage } from '../pages/ProductsPage';
import { SignupPage } from '../pages/SignupPage';
import { buildUser, UserData } from '../utils/data';

const AD_HOSTS = ['googlesyndication.com', 'doubleclick.net', 'googleadservices.com', 'adservice.google.com', 'googletagmanager.com'];

interface Fixtures {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  contactPage: ContactPage;
  /** A fresh, unique user object. Not registered. */
  newUser: UserData;
  /** Register a user for guaranteed cleanup: after the test the account is deleted if it still exists. */
  trackAccount: (user: UserData) => void;
  /** A user registered through the UI and logged out. Deleted in teardown even if setup fails midway. */
  registeredUser: UserData;
}

export const test = base.extend<Fixtures>({
  // Block third-party ads for every test; the site's ad overlays intercept clicks.
  page: async ({ page }, use) => {
    await page.route('**/*', (route) => {
      const host = new URL(route.request().url()).hostname;
      return AD_HOSTS.some((h) => host.endsWith(h)) ? route.abort() : route.continue();
    });
    await use(page);
  },
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  signupPage: async ({ page }, use) => { await use(new SignupPage(page)); },
  productsPage: async ({ page }, use) => { await use(new ProductsPage(page)); },
  productDetailPage: async ({ page }, use) => { await use(new ProductDetailPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  contactPage: async ({ page }, use) => { await use(new ContactPage(page)); },

  // eslint-disable-next-line no-empty-pattern
  newUser: async ({}, use) => { await use(buildUser()); },

  trackAccount: async ({ homePage, loginPage, signupPage }, use) => {
    const users: UserData[] = [];
    await use((user) => { users.push(user); });

    for (const user of users) {
      await homePage.open();
      if (!(await homePage.isLoggedInAs(user.name))) {
        await loginPage.open();
        await loginPage.login(user.email, user.password);
        await loginPage.loggedInUserLabel(user.name).or(loginPage.loginError).first().waitFor();
        // Login failed: the account was never created or the test already deleted it. Nothing to clean.
        if (!(await loginPage.loggedInUserLabel(user.name).isVisible())) continue;
      }
      await signupPage.deleteAccount();
      await expect(signupPage.accountDeletedHeading).toBeVisible();
    }
  },

  registeredUser: async ({ loginPage, signupPage, newUser, trackAccount }, use) => {
    trackAccount(newUser); // registered before the UI work so a mid-setup failure still gets cleaned up
    await loginPage.open();
    await loginPage.startSignup(newUser.name, newUser.email);
    await signupPage.fillAccountDetails(newUser);
    await signupPage.submit();
    await expect(signupPage.accountCreatedHeading).toBeVisible();
    await signupPage.continueAfterAction();
    await signupPage.logout();
    await use(newUser);
  },
});

export { expect };
