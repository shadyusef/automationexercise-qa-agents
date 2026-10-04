import { test, expect } from '../src/fixtures/test-fixtures';

test.describe('Products', () => {
  test('[TC-PRODUCTS-001] All products and product details are displayed @smoke @regression', async ({ productsPage, productDetailPage }) => {
    await productsPage.open();
    await expect(productsPage.pageTitle).toHaveText(/all products/i);
    await expect(productsPage.productCards.first()).toBeVisible();

    const listName = ((await productsPage.productName(0).textContent()) ?? '').trim();
    const listPrice = ((await productsPage.productPrice(0).textContent()) ?? '').trim();
    await productsPage.openProductDetails(0);

    await expect(productDetailPage.name).toHaveText(listName);
    await expect(productDetailPage.price).toHaveText(listPrice);
    await expect(productDetailPage.category).toHaveText(/Category:\s*\S+/);
    await expect(productDetailPage.availability).toHaveText(/Availability:\s*\S+/);
    await expect(productDetailPage.condition).toHaveText(/Condition:\s*\S+/);
    await expect(productDetailPage.brand).toHaveText(/Brand:\s*\S+/);
  });

  test('[TC-PRODUCTS-002] Search by product name lists that product @smoke @regression', async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.search('Blue Top');
    await expect(productsPage.pageTitle).toHaveText(/searched products/i);
    await expect(productsPage.productCards.getByText('Blue Top', { exact: true }).first()).toBeVisible();
  });

  test('[TC-PRODUCTS-003] Search with an unknown term shows no products @regression', async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.search('zzzxqwv');
    await expect(productsPage.pageTitle).toHaveText(/searched products/i);
    await expect(productsPage.productCards).toHaveCount(0);
  });

  test('[TC-PRODUCTS-004] Filter products by category Women > Dress @regression', async ({ homePage, productsPage }) => {
    await homePage.open();
    await productsPage.openCategory('Women', 'Dress');
    await expect(productsPage.pageTitle).toHaveText(/women - dress products/i);
    await expect(productsPage.productCards.first()).toBeVisible();
  });

  test('[TC-PRODUCTS-005] Filter products by brand Polo @regression', async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.openBrand('Polo');
    await expect(productsPage.pageTitle).toHaveText(/brand - polo products/i);
    await expect(productsPage.productCards.first()).toBeVisible();
  });

  test('[TC-PRODUCTS-006] Submit a review on a product @regression', async ({ productsPage, productDetailPage, newUser }) => {
    await productsPage.open();
    await productsPage.openProductDetails(0);
    await productDetailPage.submitReview(newUser.name, newUser.email, 'Great quality, automated review.');
    await expect(productDetailPage.reviewSuccess).toHaveText('Thank you for your review.');
  });
});
