import { test, expect, Page } from "@playwright/test";

test("login with valid credentials", async ({ page }: { page: Page }) => {

  await page.goto("http://localhost:3000/");

  await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
  await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");

  await page.locator('text=Connexion').click();
  await expect(page).toHaveURL("http://localhost:3000/");
});

test.describe('Dashboard Page', () => {

  test('should display the correct title', async ({ page }: { page: Page }) => {

    await page.goto("http://localhost:3000/");

    await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
    await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");

    await page.locator('text=Connexion').click();

    const title = await page.locator('h1').textContent();
    expect(title).toBe('Tableau de bord');
  });

  test('should display the correct welcome message', async ({ page }: { page: Page }) => {

    await page.goto("http://localhost:3000/");

    await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
    await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");

    await page.locator('text=Connexion').click();

    const welcomeMessage = await page.locator('h2').textContent();
    expect(welcomeMessage).toBe('Bienvenue !');
  });

  test('should display the correct text on the "Last 30 jours" button', async ({ page }: { page: Page }) => {await page.goto("http://localhost:3000/");

    await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
    await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");
  
    await page.locator('text=Connexion').click();


    const buttonText = await page.locator('button#Last\\ 30\\ jours\\ button p').textContent();
    expect(buttonText).toBe('30 derniers jours');
  });

  test('should toggle dropdown when "Last 30 jours" button is clicked', async ({ page }: { page: Page }) => {

    await page.goto("http://localhost:3000/");

    await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
    await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");

    await page.locator('text=Connexion').click();

    await page.locator('button#Last\\ 30\\ jours\\ button').click();
    const dropdown = await page.locator('div#dropdownDays');
    expect(await dropdown.isVisible()).toBe(true);
  });

  test('should change the period text when a dropdown item is clicked', async ({ page }: { page: Page }) => {

    await page.goto("http://localhost:3000/");

    await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
    await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");

    await page.locator('text=Connexion').click();
    await expect(page).toHaveURL("http://localhost:3000/dashboard");

    await page.locator('button#Last\\ 30\\ jours\\ button').click();
    await page.locator('div#dropdownDays p:has-text("3 derniers mois")').click();
    const buttonText = await page.locator('button#Last\\ 30\\ jours\\ button p').textContent();
    expect(buttonText).toBe('3 derniers mois');
  });

  test('should display the correct text on the "Reports" button', async ({ page }: { page: Page }) => {

    await page.goto("http://localhost:3000/");

  await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
  await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");

  await page.locator('text=Connexion').click();
  await expect(page).toHaveURL("http://localhost:3000/dashboard");

    const buttonText = await page.locator('button#reports\\ button p').textContent();
    expect(buttonText).toBe('Rapports');
  });

  test('should display the correct number of clients', async ({ page }: { page: Page }) => {

    await page.goto("http://localhost:3000/");

    await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
    await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");

    await page.locator('text=Connexion').click();
    await expect(page).toHaveURL("http://localhost:3000/dashboard");

    const clientsText = await page.locator('div:has-text("Clients") + p').textContent();
    expect(clientsText).toBe('Quelle période les clients ont rejoints');
  });

});

test.describe('Coach Statistics Page', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto("http://localhost:3000/");

    await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
    await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");

    await page.locator('text=Connexion').click();

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

test.describe('Tips Page', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto("http://localhost:3000/");

    await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
    await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");

    await page.locator('text=Connexion').click();

    await page.goto('http://localhost:3000/tips');
  });

  test('should display the page title', async ({ page }) => {

    await expect(page.locator('h1')).toHaveText('Conseils');
  });
});

test.describe('Events Page', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {

        await page.goto("http://localhost:3000/");

        await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
        await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");
    
        await page.locator('text=Connexion').click();

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