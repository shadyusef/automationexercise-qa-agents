import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly sliderHeading: Locator;
  readonly recommendedItems: Locator;

  constructor(page: Page) {
    super(page);
    this.sliderHeading = page.locator('#slider-carousel').getByRole('heading', { name: 'Full-Fledged practice website for Automation Engineers' });
    this.recommendedItems = page.locator('.recommended_items');
  }

  async open(): Promise<void> { await this.page.goto('/', { waitUntil: 'domcontentloaded' }); await this.waitReady(); }

  async addRecommendedItemToCart(): Promise<{ name: string; price: string }> {
    await this.recommendedItems.scrollIntoViewIfNeeded();
    const card = this.recommendedItems.locator('.item.active .product-image-wrapper').first();
    const name = ((await card.locator('.productinfo p').textContent()) ?? '').trim();
    const price = ((await card.locator('.productinfo h2').textContent()) ?? '').trim();
    await card.locator('a.add-to-cart').click();
    return { name, price };
  }
}
