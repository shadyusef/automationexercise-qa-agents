import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly info: Locator;
  readonly name: Locator;
  readonly category: Locator;
  readonly price: Locator;
  readonly availability: Locator;
  readonly condition: Locator;
  readonly brand: Locator;
  readonly reviewSuccess: Locator;
  readonly cartModal: Locator;

  constructor(page: Page) {
    super(page);
    this.info = page.locator('.product-information');
    this.name = this.info.locator('h2');
    this.category = this.info.locator('p', { hasText: 'Category:' });
    this.price = this.info.locator('span span');
    this.availability = this.info.locator('p', { hasText: 'Availability:' });
    this.condition = this.info.locator('p', { hasText: 'Condition:' });
    this.brand = this.info.locator('p', { hasText: 'Brand:' });
    this.reviewSuccess = page.locator('#review-section .alert-success');
    this.cartModal = page.locator('#cartModal');
  }

  async setQuantity(quantity: number): Promise<void> { await this.page.locator('#quantity').fill(String(quantity)); }
  async addToCart(): Promise<void> { await this.page.locator('button.cart').click(); }
  async viewCartFromModal(): Promise<void> { await this.cartModal.getByRole('link', { name: 'View Cart' }).click(); await this.waitReady(); }

  async submitReview(name: string, email: string, review: string): Promise<void> {
    await this.page.locator('#name').fill(name);
    await this.page.locator('#email').fill(email);
    await this.page.locator('#review').fill(review);
    await this.page.locator('#button-review').click();
  }
}
