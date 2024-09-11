import { test, expect, Page } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3000/dashboard');
  });

  test('should display the correct title', async ({ page }: { page: Page }) => {
    const title = await page.locator('h1').textContent();
    expect(title).toBe('Tableau de bord');
  });

  test('should display the correct welcome message', async ({ page }: { page: Page }) => {
    const welcomeMessage = await page.locator('h2').textContent();
    expect(welcomeMessage).toBe('Bienvenue !');
  });

  test('should display the correct text on the "Last 30 jours" button', async ({ page }: { page: Page }) => {
    const buttonText = await page.locator('button#Last\\ 30\\ jours\\ button p').textContent();
    expect(buttonText).toBe('30 derniers jours');
  });

  test('should toggle dropdown when "Last 30 jours" button is clicked', async ({ page }: { page: Page }) => {
    await page.locator('button#Last\\ 30\\ jours\\ button').click();
    const dropdown = await page.locator('div#dropdownDays');
    expect(await dropdown.isVisible()).toBe(true);
  });

  test('should change the period text when a dropdown item is clicked', async ({ page }: { page: Page }) => {
    await page.locator('button#Last\\ 30\\ jours\\ button').click();
    await page.locator('div#dropdownDays p:has-text("14 derniers jours")').click();
    const buttonText = await page.locator('button#Last\\ 30\\ jours\\ button p').textContent();
    expect(buttonText).toBe('14 derniers jours');
  });

  test('should display the correct text on the "Reports" button', async ({ page }: { page: Page }) => {
    const buttonText = await page.locator('button#reports\\ button p').textContent();
    expect(buttonText).toBe('Rapports');
  });

  test('should display the correct number of clients', async ({ page }: { page: Page }) => {
    const clientsText = await page.locator('div:has-text("Clients") + p').textContent();
    expect(clientsText).toBe('Quelle période les clients ont rejoints');
  });

});