import { expect } from "@playwright/test";
import { AppPage } from "./AppPage.js";

export class TasksPage extends AppPage {
  constructor(page) {
    super(page);

    this.taskCard = (index = 0) =>
      page
        .locator('[class*="RaItem"], [class*="card"], [class*="Card"]')
        .nth(index);
    this.taskCardTitle = (index = 0) =>
      this.taskCard(index).locator(".MuiTypography-h5");
    this.editTaskButton = (index = 0) =>
      this.taskCard(index).getByLabel("Edit");

    this.getByRole = (role, name) => page.getByRole(role, { name: name });

    this.titleInput = page.getByLabel(/title/i);
    this.assigneeInput = page.getByLabel(/assignee/i);
    this.statusInput = page.getByLabel(/status/i);
    this.labelInput = page.getByLabel(/label/i);
    this.contentInput = page.getByRole("textbox", { name: "Content" });

    this.draftBox = page.locator('[data-rfd-droppable-id="1"]');
    this.toReviewBox = page.locator('[data-rfd-droppable-id="2"]');
    this.toBeFixedBox = page.locator('[data-rfd-droppable-id="3"]');
    this.toPublishBox = page.locator('[data-rfd-droppable-id="4"]');
    this.publishedBox = page.locator('[data-rfd-droppable-id="5"]');

    this.draftCards = this.draftBox.locator(".MuiCard-root");
    this.toReviewCards = this.toReviewBox.locator(".MuiCard-root");
    this.toBeFixedCards = this.toBeFixedBox.locator(".MuiCard-root");
    this.toPublishCards = this.toPublishBox.locator(".MuiCard-root");
    this.publishedCards = this.publishedBox.locator(".MuiCard-root");
  }

  async fillTaskForm({ assignee, title, content, status, label }) {
    await this.titleInput.fill(title);

    if (content) {
      await this.contentInput.fill(content);
    }

    if (assignee) {
      await this.assigneeInput.click();
      await this.page.waitForSelector('[role="listbox"]');
      await this.page.getByRole("option", { name: assignee }).click();
      await this.page.waitForSelector('[role="listbox"]', { state: "hidden" });
    }

    if (status) {
      await this.statusInput.click();
      await this.page.waitForSelector('[role="listbox"]');
      await this.page.getByRole("option", { name: status }).click();
      await this.page.waitForSelector('[role="listbox"]', { state: "hidden" });
    }

    if (label) {
      await this.labelInput.click();
      await this.page.waitForSelector('[role="listbox"]');
      await this.page.getByRole("option", { name: label }).click();
      await this.page.keyboard.press("Escape");
      await this.page.waitForSelector('[role="listbox"]', { state: "hidden" });
    }
  }

  async filterByStatus(statusName) {
    const filterStatus = this.page.getByRole("combobox", { name: /status/i });
    await filterStatus.click();
    await this.page.getByRole("option", { name: statusName }).click();
  }

  async filterByAssignee(assigneeName) {
    const filterAssignee = this.page.getByRole("combobox", {
      name: /assignee/i,
    });
    await filterAssignee.click();
    await this.page.waitForSelector('[role="listbox"]');
    await this.page.getByRole("option", { name: assigneeName }).click();
    // Ждём применения фильтра
    await this.page.waitForLoadState("networkidle");
  }

  async filterByLabel(labelName) {
    const filterLabel = this.page.getByRole("combobox", { name: /label/i });
    await filterLabel.click();
    await this.page.getByRole("option", { name: labelName }).click();
  }

  async deleteTask(n) {
    const card = this.page.locator(".MuiCard-root").nth(n - 1);
    await card.getByLabel("Edit").click();
    await this.page.getByRole("button", { name: /delete/i }).click();
    await expect(this.page.getByText("Element deleted")).toBeVisible();
  }
}

