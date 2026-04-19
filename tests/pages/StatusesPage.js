import { expect } from "@playwright/test";
import { AppPage } from "./AppPage.js";

export class StatusesPage extends AppPage {
  constructor(page) {
    super(page);

    this.statusesList = page.locator(".list-page");
    this.createButton = page.getByRole("link", { name: /create/i });
    this.checkboxAll = page.getByRole("checkbox", { name: /select all/i });
    this.deleteSelectedButton = page.getByRole("button", { name: /delete/i });

    this.nameInput = page.getByLabel(/name/i);
    this.slugInput = page.getByLabel(/slug/i);
    this.saveButton = page.getByRole("button", { name: /save/i });
  }

  async openCreateForm() {
    await this.createButton.click();
  }

  async fillStatusForm({ name, slug }) {
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
  }

  async save() {
    await this.saveButton.click();
  }

  async deleteStatus(rowIndex = 0) {
    const checkboxes = this.page.getByRole("checkbox");
    await checkboxes.nth(rowIndex + 1).click();
    await this.deleteSelectedButton.click();
    await expect(this.page.getByText("Element deleted")).toBeVisible();
  }

  async deleteAllStatuses() {
    await this.checkboxAll.click();
    await this.deleteSelectedButton.click();
    await expect(this.page.getByText("No Task statuses yet.")).toBeVisible();
  }
}
