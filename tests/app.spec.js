import { test, expect } from '@playwright/test';

test.describe('Базовый рендер приложения', () => {

  test('приложение открывается без ошибок', async ({ page }) => {
    await page.goto('/');

    // Страница загрузилась — нет пустого белого экрана
    await expect(page).not.toBeEmpty;

    // Заголовок страницы содержит название приложения
    await expect(page).toHaveTitle(/Task Manager/i);
  });

  test('отображается страница входа', async ({ page }) => {
    await page.goto('/');

    // Поле email присутствует на странице
    await expect(page.getByLabel(/email/i)).toBeVisible();

    // Поле пароля присутствует
    await expect(page.getByLabel(/password/i)).toBeVisible();

    // Кнопка входа присутствует
    await expect(page.getByRole('button', { name: /sign in|войти|login/i })).toBeVisible();
  });

});