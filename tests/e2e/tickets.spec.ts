import { test, expect } from "@playwright/test";

test.describe("Ticketový systém — customer flow", () => {
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

  test("navigace na podporu ze sidebaru", async ({ page }) => {
    await page.getByRole("link", { name: "Podpora" }).click();
    await expect(page).toHaveURL("/account/support");
    await expect(page.getByRole("heading", { name: "Podpora" })).toBeVisible();
  });

  test("přechod na formulář nového tiketu", async ({ page }) => {
    await page.goto("/account/support");
    await page.getByRole("link", { name: "Nový tiket" }).click();
    await expect(page).toHaveURL("/account/support/new");
    await expect(
      page.getByRole("heading", { name: "Nový tiket" })
    ).toBeVisible();
  });

  test("validace — prázdný formulář nezpůsobí odeslání", async ({ page }) => {
    await page.goto("/account/support/new");
    await page.getByRole("button", { name: "Odeslat tiket" }).click();
    await expect(page).toHaveURL("/account/support/new");
  });
});

test.describe("Ticketový systém — admin flow", () => {
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

  test("admin vidí sekci podpora", async ({ page }) => {
    await page.getByRole("link", { name: "Podpora" }).click();
    await expect(page).toHaveURL("/dashboard/support");
    await expect(page.getByRole("heading", { name: "Podpora" })).toBeVisible();
  });

  test("nepřihlášený uživatel je přesměrován z /account/support", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/account/support");
    await expect(page).toHaveURL("/auth/login");
  });
});
