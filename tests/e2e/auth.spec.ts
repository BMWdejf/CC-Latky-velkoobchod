import { test, expect } from "@playwright/test";

test.describe("Auth — přihlášení a registrace", () => {
  test("login stránka je dostupná", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("heading", { name: "Přihlášení" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Heslo")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Přihlásit se" })
    ).toBeVisible();
  });

  test("register stránka je dostupná", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(
      page.getByRole("heading", { name: "Registrace" })
    ).toBeVisible();
    await expect(page.getByLabel("Celé jméno")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Heslo")).toBeVisible();
  });

  test("odkaz z loginu na registraci funguje", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("link", { name: "Registrujte se" }).click();
    await expect(page).toHaveURL("/auth/register");
  });

  test("odkaz z registrace na login funguje", async ({ page }) => {
    await page.goto("/auth/register");
    await page.getByRole("link", { name: "Přihlaste se" }).click();
    await expect(page).toHaveURL("/auth/login");
  });

  test("neplatné přihlášení zobrazí chybu", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel("Email").fill("neexistuje@test.com");
    await page.getByLabel("Heslo").fill("spatneheslo");
    await page.getByRole("button", { name: "Přihlásit se" }).click();
    await expect(page.getByText(/přihlášení selhalo|invalid/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("nepřihlášený uživatel je přesměrován z /dashboard", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/auth/login");
  });

  test("nepřihlášený uživatel je přesměrován z /account", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL("/auth/login");
  });

  test("admin se přihlásí a je přesměrován na /dashboard", async ({
    page,
  }) => {
    test.skip(
      !process.env.TEST_ADMIN_EMAIL,
      "TEST_ADMIN_EMAIL není nastaven"
    );

    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(process.env.TEST_ADMIN_EMAIL!);
    await page.getByLabel("Heslo").fill(process.env.TEST_ADMIN_PASSWORD!);
    await page.getByRole("button", { name: "Přihlásit se" }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("customer se přihlásí a je přesměrován na /account", async ({
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
    await expect(page).toHaveURL("/account");
  });
});
