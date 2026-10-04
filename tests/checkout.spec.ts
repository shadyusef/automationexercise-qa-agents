import { test, expect } from '../src/fixtures/test-fixtures';
import { VALID_CARD, UserData } from '../src/utils/data';
import { isValueMissing } from '../src/utils/validation';
import { CartPage } from '../src/pages/CartPage';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductsPage';

/** Log in, put the first product in the cart and open the checkout page. */
async function loginAndReachCheckout(loginPage: LoginPage, productsPage: ProductsPage, cartPage: CartPage, user: UserData): Promise<void> {
  await loginPage.open();
  await loginPage.login(user.email, user.password);
  await expect(loginPage.loggedInUserLabel(user.name)).toBeVisible();
  await productsPage.goToProducts();
  await productsPage.addToCart(0);
  await productsPage.viewCartFromModal();
  await cartPage.proceedToCheckout();
}

test.describe('Checkout', () => {
  // Full order flows (login, checkout, pay, cleanup) legitimately take longer than the 60s default on this slow site.
  test.describe.configure({ timeout: 120_000 });

  test('[TC-CHECKOUT-001] Register during checkout and place an order @smoke @regression', async ({
    homePage, productsPage, cartPage, loginPage, signupPage, checkoutPage, newUser, trackAccount,
  }) => {
    trackAccount(newUser);
    await test.step('Add a product and start checkout as a guest', async () => {
      await productsPage.open();
      await productsPage.addToCart(0);
      await productsPage.viewCartFromModal();
      await cartPage.proceedToCheckout();
      await cartPage.goToLoginFromModal();
    });
    await test.step('Register a new account', async () => {
      await loginPage.startSignup(newUser.name, newUser.email);
      await signupPage.fillAccountDetails(newUser);
      await signupPage.submit();
      await expect(signupPage.accountCreatedHeading).toBeVisible();
      await signupPage.continueAfterAction();
      await expect(signupPage.loggedInUserLabel(newUser.name)).toBeVisible();
    });
    await test.step('Return to the cart and place the order', async () => {
      await homePage.goToCart();
      await cartPage.proceedToCheckout();
      await expect(checkoutPage.deliveryAddress).toBeVisible();
      await checkoutPage.addComment('Please leave at the door.');
      await checkoutPage.placeOrder();
      await checkoutPage.pay(VALID_CARD);
      await expect(checkoutPage.successMessage).toBeVisible();
    });
    await test.step('Delete the account', async () => {
      await signupPage.deleteAccount();
      await expect(signupPage.accountDeletedHeading).toBeVisible();
    });
  });

  test('[TC-CHECKOUT-002] A logged-in user places an order @smoke @regression', async ({
    loginPage, productsPage, cartPage, checkoutPage, registeredUser,
  }) => {
    await loginAndReachCheckout(loginPage, productsPage, cartPage, registeredUser);
    await checkoutPage.placeOrder();
    await checkoutPage.pay(VALID_CARD);
    await expect(checkoutPage.successMessage).toBeVisible();
  });

  test('[TC-CHECKOUT-003] Delivery and billing addresses match the registration data @regression', async ({
    loginPage, productsPage, cartPage, checkoutPage, registeredUser,
  }) => {
    await loginAndReachCheckout(loginPage, productsPage, cartPage, registeredUser);
    for (const address of [checkoutPage.deliveryAddress, checkoutPage.billingAddress]) {
      await expect(address).toContainText(`${registeredUser.firstName} ${registeredUser.lastName}`);
      await expect(address).toContainText(registeredUser.company);
      await expect(address).toContainText(registeredUser.address);
      await expect(address).toContainText(registeredUser.address2);
      await expect(address).toContainText(registeredUser.city);
      await expect(address).toContainText(registeredUser.state);
      await expect(address).toContainText(registeredUser.zipcode);
      await expect(address).toContainText(registeredUser.country);
      await expect(address).toContainText(registeredUser.mobile);
    }
  });

  test('[TC-CHECKOUT-004] Download the invoice after a purchase @regression', async ({
    loginPage, productsPage, cartPage, checkoutPage, registeredUser,
  }) => {
    await loginAndReachCheckout(loginPage, productsPage, cartPage, registeredUser);
    await checkoutPage.placeOrder();
    await checkoutPage.pay(VALID_CARD);
    await expect(checkoutPage.successMessage).toBeVisible();
    const download = await checkoutPage.downloadInvoice();
    expect(download.suggestedFilename()).toMatch(/invoice/i);
  });

  test('[TC-CHECKOUT-005] A guest is asked to register or log in at checkout @regression', async ({ productsPage, cartPage }) => {
    await productsPage.open();
    await productsPage.addToCart(0);
    await productsPage.viewCartFromModal();
    await cartPage.proceedToCheckout();
    await expect(cartPage.checkoutModal).toBeVisible();
    await expect(cartPage.checkoutModal.getByRole('link', { name: 'Register / Login' })).toBeVisible();
  });

  test('[TC-CHECKOUT-006] Payment is blocked when card fields are empty @regression', async ({
    page, loginPage, productsPage, cartPage, checkoutPage, registeredUser,
  }) => {
    await loginAndReachCheckout(loginPage, productsPage, cartPage, registeredUser);
    await checkoutPage.placeOrder();
    await expect(page).toHaveURL(/\/payment/);
    await checkoutPage.payButton.click();
    await expect.poll(() => isValueMissing(checkoutPage.cardNameInput)).toBe(true);
    await expect(page).toHaveURL(/\/payment/);
  });
});
