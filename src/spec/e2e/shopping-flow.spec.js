// const { test, expect } = require('@playwright/test');

// // Mock product data
// const mockProducts = [
//   {
//     id: 1,
//     name: "Test Rug 1",
//     description: "Beautiful handcrafted rug",
//     price: 299.99,
//     imageUrls: ["https://via.placeholder.com/400"],
//     quantity: 5,
//     v_quantities: [5],
//     v_ids: ["TEST_VAR_1"],
//     v_names: ["Standard"],
//   },
//   {
//     id: 2,
//     name: "Test Rug 2",
//     description: "Modern geometric design",
//     price: 199.99,
//     imageUrls: ["https://via.placeholder.com/400"],
//     quantity: 3,
//     v_quantities: [3],
//     v_ids: ["TEST_VAR_2"],
//     v_names: ["Standard"],
//   },
//   {
//     id: 3,
//     name: "Sold Out Rug",
//     description: "Currently unavailable",
//     price: 399.99,
//     imageUrls: ["https://via.placeholder.com/400"],
//     quantity: 0,
//     v_quantities: [0],
//     v_ids: ["TEST_VAR_3"],
//     v_names: ["Standard"],
//   },
// ];

// test.describe('Shopping Flow - Browse to Checkout', () => {
//   test.beforeEach(async ({ page }) => {
//     // Mock the API endpoint for products
//     await page.route('**/api/items', async (route) => {
//       await route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify(mockProducts),
//       });
//     });

//     // Mock individual product requests
//     await page.route('**/api/items/*', async (route) => {
//       const url = route.request().url();
//       const id = parseInt(url.split('/').pop());
//       const product = mockProducts.find(p => p.id === id);
      
//       if (product) {
//         await route.fulfill({
//           status: 200,
//           contentType: 'application/json',
//           body: JSON.stringify(product),
//         });
//       } else {
//         await route.fulfill({
//           status: 404,
//           contentType: 'application/json',
//           body: JSON.stringify({ error: 'Item not found' }),
//         });
//       }
//     });

//     await page.goto('/');
//   });

//   test('complete purchase flow: home -> shop -> product -> cart -> checkout', async ({ page }) => {
//     // 1. Start from home page
//     await expect(page.locator('h1')).toContainText('Welcome to CYO Rugs', { timeout: 10000 });
    
//     // 2. Navigate to shop
//     await page.click('text=SHOP');
//     await expect(page.locator('.shopTitle')).toContainText('Hand Tufted Rugs');
//     await page.waitForSelector('.rugGrid', { timeout: 10000 });
    
//     // 3. Verify products are displayed
//     const products = page.locator('.rugCard');
//     expect(await products.count()).toBeGreaterThan(0);
    
//     // 4. Click on first product
//     const firstProduct = products.first();
//     await expect(firstProduct.locator('.rugCardTitle')).toBeVisible();
//     await expect(firstProduct.locator('.rugPrice')).toBeVisible();
//     await firstProduct.click();
    
//     // 5. Verify product page loads
//     await page.waitForSelector('.product-container', { timeout: 10000 });
//     await expect(page.locator('.product-name')).toContainText('Test Rug 1');
    
//     // 6. Add to cart
//     const addToCartButton = page.locator('button:has-text("Add to Cart")');
//     await addToCartButton.click();
//     await expect(page.locator('.Toastify__toast--success')).toBeVisible({ timeout: 5000 });
    
//     // 7. Navigate to cart
//     await page.click('text=CART');
//     await expect(page.locator('.cart-title')).toContainText('Your Cart');
//     await expect(page.locator('.cart-item')).toBeVisible();
    
//     // 8. Proceed to checkout
//     const checkoutButton = page.locator('button:has-text("Proceed to Checkout")');
//     await expect(checkoutButton).toBeVisible();
//     await checkoutButton.click();
    
//     // Verify checkout initiated
//     await page.waitForTimeout(2000);
//     expect(page.url()).toBeTruthy();
//   });

//   test('can manage cart: add multiple items and update quantities', async ({ page }) => {
//     await page.goto('/shop');
//     await page.waitForSelector('.rugGrid', { timeout: 10000 });
    
//     const products = page.locator('.rugCard');
//     expect(await products.count()).toBeGreaterThanOrEqual(2);
    
//     // Add first product
//     await products.nth(0).click();
//     await page.waitForSelector('.product-container', { timeout: 10000 });
//     await page.locator('button:has-text("Add to Cart")').click();
//     await page.waitForTimeout(1000);
    
//     // Add second product
//     await page.goto('/shop');
//     await page.waitForSelector('.rugGrid', { timeout: 10000 });
//     await products.nth(1).click();
//     await page.waitForSelector('.product-container', { timeout: 10000 });
//     await page.locator('button:has-text("Add to Cart")').click();
//     await page.waitForTimeout(1000);
    
//     // Go to cart and verify items
//     await page.goto('/cart');
//     const cartItems = page.locator('.cart-item');
//     expect(await cartItems.count()).toBeGreaterThanOrEqual(2);
    
//     // Test quantity increase
//     const increaseBtn = cartItems.first().locator('.quantity-btn').last();
//     await increaseBtn.click();
//     await page.waitForTimeout(500);
    
//     // Test item removal
//     const decreaseBtn = cartItems.first().locator('.quantity-btn').first();
//     const initialCount = await cartItems.count();
    
//     // Click decrease multiple times to remove item
//     for (let i = 0; i < 5; i++) {
//       const itemStillExists = await cartItems.first().count() > 0;
//       if (itemStillExists) {
//         await decreaseBtn.click();
//         await page.waitForTimeout(300);
//       }
//     }
    
//     // Verify item was removed
//     const finalCount = await page.locator('.cart-item').count();
//     expect(finalCount).toBeLessThan(initialCount);
//   });
// });

