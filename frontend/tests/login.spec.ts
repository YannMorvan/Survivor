import { test, expect, Page } from "@playwright/test";

test("login with valid credentials", async ({ page }: { page: Page }) => {

  await page.goto("http://localhost:3000/");

  await page.locator('[placeholder="Email"]').fill("jeanne.martin@soul-connection.fr");
  await page.locator('[placeholder="Password"]').fill("naouLeA82oeirn");

  await page.locator('text=Connexion à votre compte').click();
  await expect(page).toHaveURL("http://localhost:3000/");
});

test("login with invalid credentials", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000/");
  
    await page.locator('[placeholder="Email"]').fill("invalid@example.com");
    await page.locator('[placeholder="Password"]').fill("wrongpassword");
  
    await page.locator('text=Connexion à votre compte').click();
    await expect(page).toHaveURL("http://localhost:3000/");
  });
  
  test.describe("Login Page Style and Text Tests", () => {
  
    test("verify email and password input styles", async ({ page }: { page: Page }) => {
      await page.goto("http://localhost:3000/");
  
      const emailInput = page.locator('input[placeholder="Email"]');
      const passwordInput = page.locator('input[placeholder="Password"]');

      await expect(emailInput).toHaveAttribute("placeholder", "Email");
      await expect(passwordInput).toHaveAttribute("placeholder", "Password");
  
      const emailBorder = await emailInput.evaluate((el) => getComputedStyle(el).border);
      expect(emailBorder).toContain("1px solid rgb(225, 232, 241)");
  
      const passwordBorder = await passwordInput.evaluate((el) => getComputedStyle(el).border);
      expect(passwordBorder).toContain("1px solid rgb(225, 232, 241)");

      await emailInput.focus();
      const emailFocusStyle = await emailInput.evaluate((el) => getComputedStyle(el).boxShadow);
      expect(emailFocusStyle).toContain("rgb(255, 255, 255) 0px 0px 0px 0px, rgb(3, 105, 161) 0px 0px 0px 2px, rgba(0, 0, 0, 0) 0px 0px 0px 0px");
    });
  });

  test("verify input text values", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000/");
  
    const emailInput = page.locator('input[placeholder="Email"]');
    const passwordInput = page.locator('input[placeholder="Password"]');

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");

    await expect(emailInput).toHaveValue("test@example.com");
    await expect(passwordInput).toHaveValue("password123");
  });
  
  test("verify button text and disabled state", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000/");
  
    const submitButton = page.locator('button[id="Connexion"]');
  
    await expect(submitButton).toHaveText("Connexion");
  });
  
  test("verify page title and heading", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000/");

    await expect(page).toHaveTitle("Survivor App");

    const heading = page.locator("h2");
    await expect(heading).toHaveText("Connexion à votre compte");
  });
  
  