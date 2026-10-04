import { test, expect } from '../src/fixtures/test-fixtures';
import { parsePrice } from '../src/utils/validation';

test.describe('Cart', () => {
  test('[TC-CART-001] Add two products and verify price, quantity and total @smoke @regression', async ({ productsPage, cartPage }) => {
    await productsPage.open();
    const expected: { name: string; price: string }[] = [];
    for (const index of [0, 1]) {
      expected.push({
        name: ((await productsPage.productName(index).textContent()) ?? '').trim(),
        price: ((await productsPage.productPrice(index).textContent()) ?? '').trim(),
      });
    }

    await productsPage.addToCart(0);
    await productsPage.continueShopping();
    await productsPage.addToCart(1);
    await productsPage.viewCartFromModal();

    await expect(cartPage.rows).toHaveCount(2);
    for (const [i, item] of expected.entries()) {
      await expect(cartPage.rowName(i)).toHaveText(item.name);
      await expect(cartPage.rowPrice(i)).toHaveText(item.price);
      await expect(cartPage.rowQuantity(i)).toHaveText('1');
      await expect(cartPage.rowTotal(i)).toHaveText(item.price);
    }
  });

  test('[TC-CART-002] Cart shows the quantity chosen on the product page @smoke @regression', async ({ productsPage, productDetailPage, cartPage }) => {
    await productsPage.open();
    await productsPage.openProductDetails(0);
    await productDetailPage.setQuantity(4);
    await productDetailPage.addToCart();
    await productDetailPage.viewCartFromModal();
    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.rowQuantity(0)).toHaveText('4');
  });

  test('[TC-CART-003] Remove a product from the cart @smoke @regression', async ({ productsPage, cartPage }) => {
    await productsPage.open();
    await productsPage.addToCart(0);
    await productsPage.viewCartFromModal();
    await expect(cartPage.rows).toHaveCount(1);
    await cartPage.removeRow(0);
    await expect(cartPage.emptyMessage).toBeVisible();
  });

  test('[TC-CART-004] An empty cart shows the empty message @regression', async ({ cartPage }) => {
    await cartPage.open();
    await expect(cartPage.emptyMessage).toContainText('Cart is empty!');
  });

  test('[TC-CART-005] Add a product from the recommended items @regression', async ({ homePage, productsPage, cartPage }) => {
    await homePage.open();
    const item = await homePage.addRecommendedItemToCart();
    await productsPage.viewCartFromModal();
    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.rowName(0)).toHaveText(item.name);
    await expect(cartPage.rowPrice(0)).toHaveText(item.price);
  });

  test('[TC-CART-006] Line total equals unit price times quantity @regression', async ({ productsPage, productDetailPage, cartPage }) => {
    await productsPage.open();
    await productsPage.openProductDetails(0);
    const unitPrice = parsePrice(((await productDetailPage.price.textContent()) ?? '').trim());
    await productDetailPage.setQuantity(3);
    await productDetailPage.addToCart();
    await productDetailPage.viewCartFromModal();
    await expect(cartPage.rowQuantity(0)).toHaveText('3');
    await expect(cartPage.rowTotal(0)).toHaveText(new RegExp(`${unitPrice * 3}$`));
  });
});
