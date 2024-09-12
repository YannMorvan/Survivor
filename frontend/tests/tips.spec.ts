import { test, expect } from '@playwright/test';

test.describe('Tips Page', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto('http://localhost:3000/tips');
  });

  test('should display the page title', async ({ page }) => {

    await expect(page.locator('h1')).toHaveText('Conseils');
  });

  test('should load and display tips data', async ({ page }) => {

    const table = page.locator('table');
    await expect(table).toBeVisible();

    const rows = await page.locator('tbody > tr');
    expect(await rows.count()).toBeGreaterThan(0);
  });
});
