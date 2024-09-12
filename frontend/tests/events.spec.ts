import { test, expect, Page } from '@playwright/test';

test.describe('Events Page', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3000/events');
  });

  test('should display the correct title', async ({ page }: { page: Page }) => {
    const title = await page.locator('h1').textContent();
    expect(title).toBe('Events');
  });

  test('should display the correct month on load', async ({ page }: { page: Page }) => {
    const monthText = await page.locator('p.text-xl.font-semibold').textContent();
    expect(monthText).toContain('July 2024');
  });

  test('should navigate to the next month when clicking the right chevron', async ({ page }: { page: Page }) => {
    const nextChevron = page.locator('#next');
    await nextChevron.click();
    
    const monthLabel = await page.locator('p.ml-10.mt-5.text-xl.font-semibold').textContent();
    expect(monthLabel).toContain('June 2024');
  });

  test('should navigate to the previous month when clicking the left chevron', async ({ page }: { page: Page }) => {
    const prevChevron = page.locator('#prev');
    await prevChevron.click();

    const monthLabel = await page.locator('p.ml-10.mt-5.text-xl.font-semibold').textContent();
    expect(monthLabel).toContain('August 2024');
  });


  test('should switch to week view', async ({ page }: { page: Page }) => {
    await page.locator('text=Semaine').click();
    const weekText = await page.locator('p.text-xl.font-semibold').textContent();
    expect(weekText).toContain('Week of');
  });

  test('should open event list when list view is selected', async ({ page }: { page: Page }) => {
    await page.locator('text=Liste').click();
    const listViewActive = await page.locator('text=Liste').evaluate(el => el.classList.contains('bg-slate-100'));
    expect(listViewActive).toBe(true);
  });
});
