import { errors, Locator, Page } from '@playwright/test';

/** Header and footer elements shared by every page. */
export abstract class BasePage {
  readonly navSignupLogin: Locator;
  protected readonly navProducts: Locator;
  protected readonly navCart: Locator;
  protected readonly navContact: Locator;
  protected readonly navLogout: Locator;
  protected readonly navDeleteAccount: Locator;
  protected readonly loggedInAs: Locator;
  readonly subscriptionEmail: Locator;
  readonly subscribeButton: Locator;
  readonly subscriptionSuccess: Locator;
  readonly scrollUpArrow: Locator;

  constructor(protected readonly page: Page) {
    const header = page.locator('header#header');
    this.navSignupLogin = header.locator('a[href="/login"]');
    this.navProducts = header.locator('a[href="/products"]');
    this.navCart = header.locator('a[href="/view_cart"]');
    this.navContact = header.locator('a[href="/contact_us"]');
    this.navLogout = header.locator('a[href="/logout"]');
    this.navDeleteAccount = header.locator('a[href="/delete_account"]');
    this.loggedInAs = header.getByText('Logged in as');
    this.subscriptionEmail = page.locator('#susbscribe_email'); // sic: typo is in the site markup
    this.subscribeButton = page.locator('#subscribe');
    this.subscriptionSuccess = page.locator('#success-subscribe');
    this.scrollUpArrow = page.locator('#scrollUp');
  }

  /** The site binds its click handlers on window load; clicking earlier silently does nothing. Best effort: ad/analytics hosts can delay load, so do not fail on timeout. */
  async waitReady(): Promise<void> {
    await this.page.waitForLoadState('load', { timeout: 20_000 }).catch((error: unknown) => {
      if (!(error instanceof errors.TimeoutError)) throw error; // only a slow third-party load is tolerated
    });
  }

  async goToLogin(): Promise<void> { await this.navSignupLogin.click(); await this.waitReady(); }
  async goToProducts(): Promise<void> { await this.navProducts.click(); await this.waitReady(); }
  async goToCart(): Promise<void> { await this.navCart.click(); await this.waitReady(); }
  async goToContact(): Promise<void> { await this.navContact.click(); await this.waitReady(); }
  async logout(): Promise<void> { await this.navLogout.click(); await this.page.waitForURL(/\/login/); await this.waitReady(); }
  async deleteAccount(): Promise<void> { await this.navDeleteAccount.click(); }

  /** Waits for the header to settle, then reports whether `name` is logged in. */
  async isLoggedInAs(name: string): Promise<boolean> {
    const label = this.loggedInUserLabel(name);
    await label.or(this.navSignupLogin).first().waitFor();
    return label.isVisible();
  }

  loggedInUserLabel(name: string): Locator {
    return this.page.locator('header#header').getByText(`Logged in as ${name}`);
  }

  async subscribe(email: string): Promise<void> {
    await this.subscriptionEmail.scrollIntoViewIfNeeded();
    await this.subscriptionEmail.fill(email);
    await this.subscribeButton.click();
  }

  async scrollToTopManually(): Promise<void> {
    await this.page.mouse.wheel(0, -20_000);
  }

  async scrollToFooter(): Promise<void> {
    await this.page.locator('footer#footer').scrollIntoViewIfNeeded();
  }
}
