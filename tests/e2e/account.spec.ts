import { test, expect } from "@playwright/test";

test.describe("Klientský účet", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !process.env.TEST_CUSTOMER_EMAIL,
      "TEST_CUSTOMER_EMAIL není nastaven"
    );

    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(process.env.TEST_CUSTOMER_EMAIL!);
    await page.getByLabel("Heslo").fill(process.env.TEST_CUSTOMER_PASSWORD!);
    await page.getByRole("button", { name: "Přihlásit se" }).click();
    await page.waitForURL("/account");
  });

  test("přihlášený zákazník vidí přehled účtu", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Přehled" })
    ).toBeVisible();
  });

  test("navigace na objednávky", async ({ page }) => {
    await page.getByRole("link", { name: "Objednávky" }).click();
    await expect(page).toHaveURL("/account/orders");
    await expect(
      page.getByRole("heading", { name: "Moje objednávky" })
    ).toBeVisible();
  });

  test("navigace na faktury", async ({ page }) => {
    await page.getByRole("link", { name: "Faktury" }).click();
    await expect(page).toHaveURL("/account/invoices");
    await expect(
      page.getByRole("heading", { name: "Moje faktury" })
    ).toBeVisible();
  });

  test("navigace na profil", async ({ page }) => {
    await page.getByRole("link", { name: "Profil" }).click();
    await expect(page).toHaveURL("/account/profile");
    await expect(
      page.getByRole("heading", { name: "Profil" })
    ).toBeVisible();
  });

  test("zákazník nemá přístup do /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/account");
  });

  test("nepřihlášený uživatel je přesměrován z /account", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/account");
    await expect(page).toHaveURL("/auth/login");
  });
});

test.describe("Izolace dat — zákazník vidí jen svá data", () => {
  test("zákazník nemůže přistoupit k objednávce jiného zákazníka", async ({
    page,
  }) => {
    test.skip(
      !process.env.TEST_CUSTOMER_EMAIL,
      "TEST_CUSTOMER_EMAIL není nastaven"
    );

    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(process.env.TEST_CUSTOMER_EMAIL!);
    await page.getByLabel("Heslo").fill(process.env.TEST_CUSTOMER_PASSWORD!);
    await page.getByRole("button", { name: "Přihlásit se" }).click();
    await page.waitForURL("/account");

    // Pokus o přístup k neexistující / cizí objednávce → 404
    await page.goto("/account/orders/00000000-0000-0000-0000-000000000000");
    // Next.js 404 page or redirect
    const url = page.url();
    expect(
      url.includes("not-found") ||
        url.includes("404") ||
        !url.includes("/account/orders/00000000")
    ).toBeTruthy();
  });
});
