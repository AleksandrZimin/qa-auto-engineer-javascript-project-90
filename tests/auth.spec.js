import { test, expect } from '@bgotink/playwright-coverage'
import { LoginPage } from "./pages/LoginPage.js";

test.describe("Аутентификация", () => {
  test("успешный вход: редирект и скрытие формы", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("admin", "admin");

    await expect(page).not.toHaveURL(/login/i);
    await expect(loginPage.getByRole("button", /sign in/i)).not.toBeVisible();
  });
});

test.describe("Выход из приложения", () => {
  test("пользователь может выйти из приложения", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("admin", "admin");
    await loginPage.logout();

    await expect(loginPage.getByRole("button", /sign in/i)).toBeVisible();
  });
});
