import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { AppPage } from './pages/AppPage.js';


test.describe('Аутентификация', () => {

  test('успешный вход с валидными данными', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('admin', 'admin');

    // После входа пользователь попадает на главную страницу
    // URL меняется — больше не /login
    await expect(page).not.toHaveURL(/login/i);
  });

  test('после входа отображается интерфейс приложения', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('admin', 'admin');

    // Форма входа больше не видна
    await expect(page.getByRole('button', { name: /sign in/i })).not.toBeVisible();
  });

});

test.describe('Выход из приложения', () => {

  test('пользователь может выйти из приложения', async ({ page }) => {
    // Входим
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin');

    // Выходим через меню профиля
    const appPage = new AppPage(page);
    await appPage.logout();

    // После выхода снова видна кнопка Sign in
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

});