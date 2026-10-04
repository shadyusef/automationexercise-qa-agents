import { test, expect } from '../src/fixtures/test-fixtures';
import { uniqueEmail } from '../src/utils/data';
import { isTypeMismatch } from '../src/utils/validation';

const SUCCESS_TEXT = 'You have been successfully subscribed!';

test.describe('Subscription', () => {
  test('[TC-SUB-001] Subscribe from the home page footer @regression', async ({ homePage }) => {
    await homePage.open();
    await homePage.subscribe(uniqueEmail('sub'));
    await expect(homePage.subscriptionSuccess).toHaveText(SUCCESS_TEXT);
  });

  test('[TC-SUB-002] Subscribe from the cart page footer @regression', async ({ cartPage }) => {
    await cartPage.open();
    await cartPage.subscribe(uniqueEmail('sub'));
    await expect(cartPage.subscriptionSuccess).toHaveText(SUCCESS_TEXT);
  });
});

test.describe('Subscription validation', () => {
  test('[TC-SUB-003] Subscription rejects an invalid email @regression', async ({ homePage }) => {
    await homePage.open();
    await homePage.subscribe('abc');
    await expect.poll(() => isTypeMismatch(homePage.subscriptionEmail)).toBe(true);
    await expect(homePage.subscriptionSuccess).toBeHidden();
  });
});

test.describe('Page UI', () => {
  test('[TC-UI-001] Scroll to the top using the arrow button @regression', async ({ homePage }) => {
    await homePage.open();
    await homePage.scrollToFooter();
    await homePage.scrollUpArrow.click();
    await expect(homePage.sliderHeading).toBeInViewport();
  });

  test('[TC-UI-002] Scroll to the top without the arrow button @regression', async ({ homePage }) => {
    await homePage.open();
    await homePage.scrollToFooter();
    await homePage.scrollToTopManually();
    await expect(homePage.sliderHeading).toBeInViewport();
  });
});
