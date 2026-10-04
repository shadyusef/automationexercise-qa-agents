import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly productCards: Locator;
  readonly pageTitle: Locator;
  readonly cartModal: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.features_items .title');
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.cartModal = page.locator('#cartModal');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
  }

  async open(): Promise<void> { await this.page.goto('/products', { waitUntil: 'domcontentloaded' }); await this.waitReady(); }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  productName(index: number): Locator { return this.productCards.nth(index).locator('.productinfo p'); }
  productPrice(index: number): Locator { return this.productCards.nth(index).locator('.productinfo h2'); }

  async addToCart(index: number): Promise<void> {
    await this.productCards.nth(index).locator('.productinfo a.add-to-cart').click();
  }

  async continueShopping(): Promise<void> { await this.cartModal.getByRole('button', { name: 'Continue Shopping' }).click(); }
  async viewCartFromModal(): Promise<void> { await this.cartModal.getByRole('link', { name: 'View Cart' }).click(); await this.waitReady(); }

  async openProductDetails(index: number): Promise<void> {
    await this.productCards.nth(index).getByRole('link', { name: 'View Product' }).click();
    await this.waitReady();
  }

  async openCategory(parent: 'Women' | 'Men' | 'Kids', child: string): Promise<void> {
    await this.page.locator(`.category-products a[href="#${parent}"]`).click();
    await this.page.locator(`#${parent}`).getByRole('link', { name: child }).click();
  }

  async openBrand(brand: string): Promise<void> {
    await this.page.locator('.brands-name').getByRole('link', { name: brand }).click();
  }
}
