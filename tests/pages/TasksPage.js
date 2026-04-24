import { expect } from "@playwright/test";
import { AppPage } from "./AppPage.js";

export class TasksPage extends AppPage {
  constructor(page) {
    super(page);

    this.taskCard = (index = 0) => page.locator('[data-rfd-draggable-id]').nth(index)
    this.editTaskButton = (index = 0) => this.taskCard(index).getByLabel("Edit");

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

    this.draftCards = this.draftBox.locator('[data-rfd-draggable-id]')
    this.toReviewCards = this.toReviewBox.locator('[data-rfd-draggable-id]')
    this.toBeFixedCards = this.toBeFixedBox.locator('[data-rfd-draggable-id]')
    this.toPublishCards = this.toPublishBox.locator('[data-rfd-draggable-id]')
    this.publishedCards = this.publishedBox.locator('[data-rfd-draggable-id]')
  }

  async fillTaskForm({ assignee, title, content, status, label }) {
    await this.titleInput.fill(title);

    if (content) {
      await this.contentInput.fill(content);
    }

    if (assignee) {
      await this.assigneeInput.click();
      await this.page.waitForSelector('[role="listbox"]');
      await this.getByRole("option", assignee).click();
      await this.page.waitForSelector('[role="listbox"]', { state: "hidden" });
    }

    if (status) {
      await this.statusInput.click();
      await this.page.waitForSelector('[role="listbox"]');
      await this.getByRole("option", status).click();
      await this.page.waitForSelector('[role="listbox"]', { state: "hidden" });
    }

    if (label) {
      await this.labelInput.click();
      await this.page.waitForSelector('[role="listbox"]');
      await this.getByRole("option", label).click();
      await this.page.keyboard.press("Escape");
      await this.page.waitForSelector('[role="listbox"]', { state: "hidden" });
    }
  }

  async filterByStatus(statusName) {
    const filterStatus = this.getByRole("combobox", /status/i);
    await filterStatus.click();
    await this.getByRole("option", statusName).click();
  }

  async filterByAssignee(assigneeName) {
    const filterAssignee = this.getByRole("combobox", /assignee/i);
    await filterAssignee.click();
    await this.page.waitForSelector('[role="listbox"]');
    await this.getByRole("option", assigneeName).click();
    await this.page.waitForLoadState("networkidle");
  }

  async filterByLabel(labelName) {
    const filterLabel = this.getByRole("combobox", /label/i);
    await filterLabel.click();
    await this.getByRole("option", labelName).click();
  }

  async deleteTask(n) {
    await this.taskCard(n -1).getByLabel("Edit").click();
    await this.getByRole("button", /delete/i).click();
    await expect(this.pageText("Element deleted")).toBeVisible();
  }
}

