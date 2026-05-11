import { test as setup } from "@playwright/test";
import path from "path";

const adminAuthFile = path.join(
  __dirname,
  ".auth/admin.json"
);
const customerAuthFile = path.join(
  __dirname,
  ".auth/customer.json"
);

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/auth/login");
  await page.getByLabel("Email").fill(process.env.TEST_ADMIN_EMAIL!);
  await page.getByLabel("Heslo").fill(process.env.TEST_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Přihlásit se" }).click();
  await page.waitForURL("/dashboard");
  await page.context().storageState({ path: adminAuthFile });
});

setup("authenticate as customer", async ({ page }) => {
  await page.goto("/auth/login");
  await page.getByLabel("Email").fill(process.env.TEST_CUSTOMER_EMAIL!);
  await page.getByLabel("Heslo").fill(process.env.TEST_CUSTOMER_PASSWORD!);
  await page.getByRole("button", { name: "Přihlásit se" }).click();
  await page.waitForURL("/account");
  await page.context().storageState({ path: customerAuthFile });
});
