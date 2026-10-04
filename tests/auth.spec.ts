import { test, expect } from '../src/fixtures/test-fixtures';
import { isValueMissing } from '../src/utils/validation';

test.describe('Authentication', () => {
  test('[TC-AUTH-001] Register a new user and delete the account @smoke @regression', async ({ homePage, loginPage, signupPage, newUser, trackAccount }) => {
    trackAccount(newUser);
    await test.step('Open the home page and go to Signup / Login', async () => {
      await homePage.open();
      await expect(homePage.sliderHeading).toBeVisible();
      await homePage.goToLogin();
      await expect(loginPage.signupHeading).toBeVisible();
    });
    await test.step('Start signup with name and a unique email', async () => {
      await loginPage.startSignup(newUser.name, newUser.email);
      await expect(signupPage.enterAccountInfoHeading).toBeVisible();
    });
    await test.step('Fill the account details and create the account', async () => {
      await signupPage.fillAccountDetails(newUser);
      await signupPage.submit();
      await expect(signupPage.accountCreatedHeading).toHaveText(/account created!/i);
      await signupPage.continueAfterAction();
    });
    await test.step('Verify the user is logged in', async () => {
      await expect(signupPage.loggedInUserLabel(newUser.name)).toBeVisible();
    });
    await test.step('Delete the account', async () => {
      await signupPage.deleteAccount();
      await expect(signupPage.accountDeletedHeading).toHaveText(/account deleted!/i);
    });
  });

  test('[TC-AUTH-002] Login with valid credentials @smoke @regression', async ({ loginPage, registeredUser }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.email, registeredUser.password);
    await expect(loginPage.loggedInUserLabel(registeredUser.name)).toBeVisible();
  });

  test('[TC-AUTH-003] Login fails with an incorrect password @smoke @regression', async ({ loginPage, registeredUser }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.email, 'WrongPassword!1');
    await expect(loginPage.loginError).toHaveText('Your email or password is incorrect!');
    await expect(loginPage.navSignupLogin).toBeVisible();
    await expect(loginPage.loggedInUserLabel(registeredUser.name)).toBeHidden();
  });

  test('[TC-AUTH-004] Login fails with an unregistered email @regression', async ({ loginPage, newUser }) => {
    await loginPage.open();
    await loginPage.login(newUser.email, newUser.password);
    await expect(loginPage.loginError).toHaveText('Your email or password is incorrect!');
  });

  test('[TC-AUTH-005] Logout returns the user to the login page @smoke @regression', async ({ page, loginPage, registeredUser }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.email, registeredUser.password);
    await expect(loginPage.loggedInUserLabel(registeredUser.name)).toBeVisible();
    await loginPage.logout();
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.loginHeading).toBeVisible();
    await expect(loginPage.navSignupLogin).toBeVisible();
  });

  test('[TC-AUTH-006] Signup fails with an already registered email @regression', async ({ loginPage, registeredUser }) => {
    await loginPage.open();
    await loginPage.startSignup('Another Name', registeredUser.email);
    await expect(loginPage.signupError).toHaveText('Email Address already exist!');
  });

  test('[TC-AUTH-007] Signup is blocked when the name is empty @regression', async ({ page, loginPage, newUser }) => {
    await loginPage.open();
    await loginPage.signupEmail.fill(newUser.email);
    await loginPage.submitSignup();
    await expect.poll(() => isValueMissing(loginPage.signupName)).toBe(true);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('[TC-AUTH-008] Login is blocked when email and password are empty @regression', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.submitLogin();
    await expect.poll(() => isValueMissing(loginPage.loginEmail)).toBe(true);
    await expect(page).toHaveURL(/\/login$/);
  });
});
