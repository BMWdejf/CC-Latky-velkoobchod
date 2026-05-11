import { test, expect } from "@playwright/test";

test.describe("Produkty — admin CRUD", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !process.env.TEST_ADMIN_EMAIL,
      "TEST_ADMIN_EMAIL není nastaven"
    );

    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(process.env.TEST_ADMIN_EMAIL!);
    await page.getByLabel("Heslo").fill(process.env.TEST_ADMIN_PASSWORD!);
    await page.getByRole("button", { name: "Přihlásit se" }).click();
    await page.waitForURL("/dashboard");
  });

  test("navigace na produkty z sidebaru", async ({ page }) => {
    await page.getByRole("link", { name: "Produkty" }).click();
    await expect(page).toHaveURL("/dashboard/products");
    await expect(
      page.getByRole("heading", { name: "Produkty" })
    ).toBeVisible();
  });

  test("přechod na formulář nového produktu", async ({ page }) => {
    await page.goto("/dashboard/products");
    await page.getByRole("link", { name: "Přidat produkt" }).click();
    await expect(page).toHaveURL("/dashboard/products/new");
    await expect(
      page.getByRole("heading", { name: "Nový produkt" })
    ).toBeVisible();
  });

  test("vytvoření produktu s validními daty", async ({ page }) => {
    const uniqueSku = `TEST-${Date.now()}`;
    await page.goto("/dashboard/products/new");

    await page.getByLabel("Název").fill("Testovací látka");
    await page.getByLabel(/cena/i).fill("199.90");
    await page.getByLabel(/počet na skladě/i).fill("10");
    await page.getByLabel("SKU").fill(uniqueSku);
    await page.getByRole("button", { name: "Vytvořit produkt" }).click();

    await expect(page).toHaveURL("/dashboard/products");
    await expect(page.getByText("Testovací látka")).toBeVisible();
  });

  test("validace — prázdný formulář zobrazí chybu", async ({ page }) => {
    await page.goto("/dashboard/products/new");
    await page.getByRole("button", { name: "Vytvořit produkt" }).click();
    // HTML5 required validation or server-side error
    await expect(page).toHaveURL("/dashboard/products/new");
  });

  test("úprava produktu", async ({ page }) => {
    test.skip(true, "Vyžaduje existující produkt v DB");
  });

  test("smazání produktu", async ({ page }) => {
    test.skip(true, "Vyžaduje existující produkt v DB");
  });

  test("nepřihlášený uživatel je přesměrován z /dashboard/products", async ({
    page,
  }) => {
    // Clear cookies to simulate unauthenticated state
    await page.context().clearCookies();
    await page.goto("/dashboard/products");
    await expect(page).toHaveURL("/auth/login");
  });
});
