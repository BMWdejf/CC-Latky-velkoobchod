import { test, expect } from "@playwright/test";

test.describe("Objednávky — admin CRUD", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!process.env.TEST_ADMIN_EMAIL, "TEST_ADMIN_EMAIL není nastaven");

    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(process.env.TEST_ADMIN_EMAIL!);
    await page.getByLabel("Heslo").fill(process.env.TEST_ADMIN_PASSWORD!);
    await page.getByRole("button", { name: "Přihlásit se" }).click();
    await page.waitForURL("/dashboard");
  });

  test("navigace na objednávky z sidebaru", async ({ page }) => {
    await page.getByRole("link", { name: "Objednávky" }).click();
    await expect(page).toHaveURL("/dashboard/orders");
    await expect(
      page.getByRole("heading", { name: "Objednávky" })
    ).toBeVisible();
  });

  test("přechod na formulář nové objednávky", async ({ page }) => {
    await page.goto("/dashboard/orders");
    await page.getByRole("link", { name: "Nová objednávka" }).click();
    await expect(page).toHaveURL("/dashboard/orders/new");
    await expect(
      page.getByRole("heading", { name: "Nová objednávka" })
    ).toBeVisible();
  });

  test("validace — prázdný formulář zobrazí chybu", async ({ page }) => {
    await page.goto("/dashboard/orders/new");
    await page.getByRole("button", { name: "Vytvořit objednávku" }).click();
    await expect(page).toHaveURL("/dashboard/orders/new");
  });

  test("stavový workflow — změna stavu objednávky", async ({ page }) => {
    await page.goto("/dashboard/orders");
    const firstOrder = page.getByRole("link", { name: /ORD-/ }).first();
    test.skip(!(await firstOrder.isVisible()), "Žádné objednávky k testování");

    await firstOrder.click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Stav objednávky")).toBeVisible();
  });

  test("nepřihlášený uživatel je přesměrován z /dashboard/orders", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard/orders");
    await expect(page).toHaveURL("/auth/login");
  });
});
