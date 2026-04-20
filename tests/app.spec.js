import { test, expect } from '@playwright/test';

test('Приложение успешно рендерится', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Task Manager/i);

  await expect(page.getByLabel(/username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
});