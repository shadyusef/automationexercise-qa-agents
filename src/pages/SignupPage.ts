import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserData } from '../utils/data';

export class SignupPage extends BasePage {
  readonly enterAccountInfoHeading: Locator;
  readonly accountCreatedHeading: Locator;
  readonly accountDeletedHeading: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.enterAccountInfoHeading = page.getByText('Enter Account Information');
    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');
    this.accountDeletedHeading = page.locator('[data-qa="account-deleted"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async fillAccountDetails(user: UserData): Promise<void> {
    const p = this.page;
    await p.locator(user.title === 'Mr' ? '#id_gender1' : '#id_gender2').check();
    await p.locator('[data-qa="password"]').fill(user.password);
    await p.locator('[data-qa="days"]').selectOption(user.birthDay);
    await p.locator('[data-qa="months"]').selectOption({ label: user.birthMonth });
    await p.locator('[data-qa="years"]').selectOption(user.birthYear);
    await p.locator('#newsletter').check();
    await p.locator('#optin').check();
    await p.locator('[data-qa="first_name"]').fill(user.firstName);
    await p.locator('[data-qa="last_name"]').fill(user.lastName);
    await p.locator('[data-qa="company"]').fill(user.company);
    await p.locator('[data-qa="address"]').fill(user.address);
    await p.locator('[data-qa="address2"]').fill(user.address2);
    await p.locator('[data-qa="country"]').selectOption(user.country);
    await p.locator('[data-qa="state"]').fill(user.state);
    await p.locator('[data-qa="city"]').fill(user.city);
    await p.locator('[data-qa="zipcode"]').fill(user.zipcode);
    await p.locator('[data-qa="mobile_number"]').fill(user.mobile);
  }

  async submit(): Promise<void> { await this.page.locator('[data-qa="create-account"]').click(); }
  async continueAfterAction(): Promise<void> { await this.continueButton.click(); }
}
