import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';

test.describe('Аутентификация', () => {

  test('успешный вход с валидными данными', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('admin', 'admin');

    await expect(page).not.toHaveURL(/login/i);
  });

  test('после входа отображается интерфейс приложения', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin');

    await expect(page.getByRole('button', { name: /sign in/i })).not.toBeVisible();
  });

});

test.describe('Выход из приложения', () => {

  test('пользователь может выйти из приложения', async ({ page }) => {

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin');
    await loginPage.logout();

    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

});