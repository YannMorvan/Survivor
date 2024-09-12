import { test, expect } from '@playwright/test';

test.describe('Coach Statistics Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the statistics page before each test
    await page.goto('http://localhost:3000/statistics');
  });

  test('should load the statistics page', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Statistiques');
  });

  test('should display the correct text on button', async ({ page }) => {
    const buttonText = await page.locator('button#Last\\ 30\\ jours\\ button p')
    

    await expect(page.locator('h1')).toHaveText('Statistiques');
  });

  test('should allow selecting the second coach', async ({ page }) => {
    await page.click('#dropdownUsersButton2');
    const secondCoach = page.locator('ul > li:nth-child(2)');

    const selectedCoach2 = await page.locator('#dropdownUsersButton2');
    await expect(page.locator('h1')).toHaveText('Statistiques');
  });

  test('should display average rating for the selected coach', async ({ page }) => {
  
    await page.click('#dropdownUsersButton');
    const firstCoach = page.locator('ul > li:nth-child(1)');

    const avgRating = await page.locator('.text-6xl');
    await expect(page.locator('h1')).toHaveText('Statistiques');
  });
});
