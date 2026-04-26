import { test as base, expect } from '@bgotink/playwright-coverage'
import { LoginPage } from '../pages/LoginPage.js';

export const test = base.extend({
  page: async ({ page }, apply) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/');
    await loginPage.login('admin', 'admin');
    await apply(page);
  },
});

export { expect } from '@playwright/test';