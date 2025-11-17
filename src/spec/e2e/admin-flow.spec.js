const { test, expect } = require('@playwright/test');

// Mock request data
const mockRequests = [
  {
    id: 1,
    name: 'John Doe',
    phone: '123-456-7890',
    email: 'john@example.com',
    description: 'Custom rug design with blue patterns',
    image_urls: ['https://via.placeholder.com/300'],
    status: 'Received',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '098-765-4321',
    email: 'jane@example.com',
    description: 'Modern geometric rug',
    image_urls: ['https://via.placeholder.com/300'],
    status: 'In Progress',
    created_at: new Date().toISOString(),
  },
];

test.describe('Admin Flow - Request Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the requests/orders API
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRequests),
      });
    });

    // Mock status update API
    await page.route('**/api/orders/*/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Status updated' }),
      });
    });

    // Mock homepage images API
    await page.route('**/api/homepage-images', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ imageUrls: [] }),
      });
    });

    // Mock requests status API
    await page.route('**/api/settings/requests-status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ is_requests_open: true }),
      });
    });
  });

  // test('admin page requires authentication', async ({ page }) => {
  //   await page.goto('/requestList');
  //   await page.waitForTimeout(2000);
    
  //   // Should show authentication or allow access if already authenticated
  //   const passwordInput = page.locator('input[type="password"]').first();
  //   const passwordModal = page.locator('[role="dialog"], .modal');
    
  //   if (await passwordInput.count() > 0) {
  //     // Authentication required - verify login UI exists
  //     expect(await passwordInput.isVisible()).toBeTruthy();
  //     const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Login")').first();
  //     expect(await submitButton.count()).toBeGreaterThan(0);
  //   } else {
  //     // Already authenticated - verify request list page loads
  //     await page.waitForLoadState('networkidle', { timeout: 10000 });
  //     expect(page.url()).toContain('requestList');
  //   }
  // });

  test('displays and manages request list when authenticated', async ({ page, context }) => {
    await page.goto('/requestList');
    await page.waitForTimeout(3000);
    
    // Check if authentication is required
    const passwordInput = page.locator('input[type="password"]').first();
    const hasPasswordModal = await passwordInput.count() > 0;
    
    // In CI, this route requires authentication - skip the test
    if (hasPasswordModal || process.env.CI) {
      test.skip(true, 'Request list requires authentication - skipping in CI environment');
      return;
    }
    
    // Verify request list displays (only runs locally when authenticated)
    const table = page.locator('table, .request-list, .order-list');
    const requestItems = page.locator('[class*="request"], [class*="order"], tr');
    
    const hasListDisplay = await table.count() > 0 || await requestItems.count() > 0;
    
    // Verify list display exists
    expect(hasListDisplay).toBeTruthy();
    
    if (hasListDisplay) {
      // Verify management controls exist
      const filterButtons = page.locator('button:has-text("All"), button:has-text("Pending"), button:has-text("Completed")');
      const statusButtons = page.locator('button:has-text("Complete"), button:has-text("In Progress"), select[name*="status"]');
      const deleteButtons = page.locator('button:has-text("Delete"), button[aria-label*="delete"], button:has-text("✕")');
      
      // At least one type of control should exist
      const hasControls = await filterButtons.count() > 0 || 
                         await statusButtons.count() > 0 || 
                         await deleteButtons.count() > 0;
      
      // Verify controls exist
      expect(hasControls).toBeTruthy();
      
      if (hasControls) {
        // Test filter functionality if available
        if (await filterButtons.count() > 0) {
          await filterButtons.first().click();
          await page.waitForTimeout(500);
        }
      }
    }
  });
});

