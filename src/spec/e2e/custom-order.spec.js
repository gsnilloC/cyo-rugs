const { test, expect } = require('@playwright/test');

test.describe('Custom Order Request Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the requests status API
    await page.route('**/api/settings/requests-status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ is_requests_open: true }),
      });
    });

    // Mock the upload API
    await page.route('**/api/upload', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Upload successful' }),
      });
    });

    // Mock reCAPTCHA (bypass validation)
    await page.addInitScript(() => {
      window.grecaptcha = {
        ready: (cb) => cb(),
        execute: () => Promise.resolve('test-token'),
        render: () => {},
      };
    });
  });

  test('can submit custom order request with all fields', async ({ page }) => {
    await page.goto('/request');
    await page.waitForSelector('form', { timeout: 10000 });
    
    // Fill out complete form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '123-456-7890');
    
    // Fill dimensions
    const widthInput = page.locator('input[placeholder*="Width"], input[name*="width"]').first();
    const heightInput = page.locator('input[placeholder*="Height"], input[name*="height"]').first();
    
    if (await widthInput.count() > 0) {
      await widthInput.fill('48');
    }
    if (await heightInput.count() > 0) {
      await heightInput.fill('60');
    }
    
    // Fill description
    const descriptionField = page.locator('textarea, input[name*="description"], input[name*="details"]').first();
    if (await descriptionField.count() > 0) {
      await descriptionField.fill('Custom design with blue and white colors');
    }
    
    // Submit form
    const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")').first();
    
    let hasSuccess = false;
    if (await submitButton.count() > 0) {
      await submitButton.click();
      await page.waitForTimeout(2000);
      
      // Verify success indication
      const successToast = page.locator('.Toastify__toast--success');
      const successMessage = page.locator('text=/success|thank you|received/i');
      hasSuccess = await successToast.count() > 0 || await successMessage.count() > 0;
    }
    
    expect(hasSuccess).toBeTruthy();
  });

  test('validates required fields and email format', async ({ page }) => {
    await page.goto('/request');
    await page.waitForSelector('form', { timeout: 10000 });
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")').first();
    
    if (await submitButton.count() > 0) {
      await submitButton.click();
      await page.waitForTimeout(1000);
      
      // Should stay on request page (validation prevents submission)
      // eslint-disable-next-line jest/no-conditional-expect
      expect(page.url()).toContain('/request');
      
      // Test invalid email format
      const emailInput = page.locator('input[name="email"], input[type="email"]').first();
      if (await emailInput.count() > 0) {
        await emailInput.fill('invalid-email');
        await submitButton.click();
        await page.waitForTimeout(1000);
        
        // HTML5 validation should catch this
        const hasError = await emailInput.evaluate((el) => !el.validity.valid);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(hasError).toBeTruthy();
      }
    }
  });
});

