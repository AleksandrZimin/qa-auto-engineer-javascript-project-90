import { test, expect } from '@playwright/test';
import { AppPage } from "./pages/AppPage.js";


test('Приложение успешно рендерится', async ({ page }) => {
  const appPage = new AppPage(page);
  
  await appPage.goto();

  await expect(page).toHaveTitle(/Task Manager/i);

  await expect(page.getByLabel(/username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await expect(appPage.getByRole('button', /sign in/i)).toBeVisible();
});