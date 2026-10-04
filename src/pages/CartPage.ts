import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly rows: Locator;
  readonly emptyMessage: Locator;
  readonly checkoutModal: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#cart_info_table tbody tr');
    this.emptyMessage = page.locator('#empty_cart');
    this.checkoutModal = page.locator('#checkoutModal');
  }

  async open(): Promise<void> { await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded' }); await this.waitReady(); }

  rowName(index: number): Locator { return this.rows.nth(index).locator('.cart_description h4 a'); }
  rowPrice(index: number): Locator { return this.rows.nth(index).locator('.cart_price p'); }
  rowQuantity(index: number): Locator { return this.rows.nth(index).locator('.cart_quantity button'); }
  rowTotal(index: number): Locator { return this.rows.nth(index).locator('.cart_total_price'); }

  async removeRow(index: number): Promise<void> { await this.rows.nth(index).locator('.cart_quantity_delete').click(); }
  async proceedToCheckout(): Promise<void> { await this.waitReady(); await this.page.getByText('Proceed To Checkout').click(); }
  async goToLoginFromModal(): Promise<void> { await this.checkoutModal.getByRole('link', { name: 'Register / Login' }).click(); await this.waitReady(); }
}
