import { test, expect } from "@playwright/test";

test.describe("Zákazníci — admin CRUD", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!process.env.TEST_ADMIN_EMAIL, "TEST_ADMIN_EMAIL není nastaven");

    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(process.env.TEST_ADMIN_EMAIL!);
    await page.getByLabel("Heslo").fill(process.env.TEST_ADMIN_PASSWORD!);
    await page.getByRole("button", { name: "Přihlásit se" }).click();
    await page.waitForURL("/dashboard");
  });

  test("navigace na zákazníky z sidebaru", async ({ page }) => {
    await page.getByRole("link", { name: "Zákazníci" }).click();
    await expect(page).toHaveURL("/dashboard/customers");
    await expect(page.getByRole("heading", { name: "Zákazníci" })).toBeVisible();
  });

  test("přechod na formulář nového zákazníka", async ({ page }) => {
    await page.goto("/dashboard/customers");
    await page.getByRole("link", { name: "Přidat zákazníka" }).click();
    await expect(page).toHaveURL("/dashboard/customers/new");
    await expect(page.getByRole("heading", { name: "Nový zákazník" })).toBeVisible();
  });

  test("vytvoření zákazníka s validními daty", async ({ page }) => {
    await page.goto("/dashboard/customers/new");

    await page.getByLabel("Název firmy").fill("Testovací Textil s.r.o.");
    await page.getByLabel("Kontaktní osoba").fill("Jan Novák");
    await page.getByLabel("Email").fill("jan@testovaci.cz");
    await page.getByRole("button", { name: "Vytvořit zákazníka" }).click();

    await expect(page).toHaveURL("/dashboard/customers");
    await expect(page.getByText("Testovací Textil s.r.o.")).toBeVisible();
  });

  test("validace — prázdný formulář zobrazí chybu", async ({ page }) => {
    await page.goto("/dashboard/customers/new");
    await page.getByRole("button", { name: "Vytvořit zákazníka" }).click();
    await expect(page).toHaveURL("/dashboard/customers/new");
  });

  test("nepřihlášený uživatel je přesměrován z /dashboard/customers", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard/customers");
    await expect(page).toHaveURL("/auth/login");
  });
});
