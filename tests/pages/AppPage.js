import { expect } from "@playwright/test";

export class AppPage {
  constructor(page) {
    this.page = page;

    this.itemsList = page.locator(".list-page");
    this.profileButton = page.getByRole("button", { name: /profile/i });
    this.saveButton = page.getByRole('button', { name: /save/i });
    this.createButton = page.getByRole('link', { name: /create/i });
    this.deleteSelectedButton = page.getByRole('button', { name: /delete/i });
    this.checkboxes = page.getByRole('checkbox');
    this.checkboxAll = page.getByRole('checkbox', { name: /select all/i });
    this.pageText = (text) => page.getByText(text);
    this.getByRole = (role, name) => page.getByRole(role, { name: name });
  }

  async goto(route = "/") {
    await this.page.goto(route);
  }

  async saveAndGoTo(route = "/") {
    await this.saveButton.click();
    await expect(this.pageText('Element created')).toBeVisible();
    await this.page.goto(route);
  }

  async deleteItem(rowIndex = 0) {
    await this.checkboxes.nth(rowIndex + 1).click();
    await this.deleteSelectedButton.click();
    await expect(this.pageText('Element deleted')).toBeVisible();
  }

  async deleteAllItems(text) {
    await this.checkboxAll.click();
    await this.deleteSelectedButton.click();
    await expect(this.pageText(text)).toBeVisible();
  }

  async save() {
    await this.saveButton.click();
  }

  async openCreateForm() {
    await this.createButton.click();
  }
}

