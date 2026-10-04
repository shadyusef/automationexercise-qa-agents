import { Download, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CardData } from '../utils/data';

export class CheckoutPage extends BasePage {
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly successMessage: Locator;
  readonly cardNameInput: Locator;
  readonly payButton: Locator;

  constructor(page: Page) {
    super(page);
    this.deliveryAddress = page.locator('#address_delivery');
    this.billingAddress = page.locator('#address_invoice');
    this.successMessage = page.getByText('Congratulations! Your order has been confirmed!');
    this.cardNameInput = page.locator('[data-qa="name-on-card"]');
    this.payButton = page.locator('[data-qa="pay-button"]');
  }

  async addComment(text: string): Promise<void> { await this.page.locator('textarea[name="message"]').fill(text); }
  async placeOrder(): Promise<void> { await this.page.getByRole('link', { name: 'Place Order' }).click(); await this.waitReady(); }

  async pay(card: CardData): Promise<void> {
    await this.cardNameInput.fill(card.name);
    await this.page.locator('[data-qa="card-number"]').fill(card.number);
    await this.page.locator('[data-qa="cvc"]').fill(card.cvc);
    await this.page.locator('[data-qa="expiry-month"]').fill(card.expiryMonth);
    await this.page.locator('[data-qa="expiry-year"]').fill(card.expiryYear);
    await this.payButton.click();
  }

  async downloadInvoice(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout: 30_000 }),
      this.page.getByRole('link', { name: 'Download Invoice' }).click(),
    ]);
    return download;
  }
}
