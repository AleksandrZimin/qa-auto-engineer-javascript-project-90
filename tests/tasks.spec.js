import { test, expect } from "./utils/beforeEach.js";
import { TasksPage } from "./pages/TasksPage.js";
import { dragAndDrop } from "./utils/dragAndDrop.js";

let tasksPage;

test.describe("Создание задачи", () => {
  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);

    await tasksPage.goto("/#/tasks");
    await tasksPage.openCreateForm();
  });

  test("форма создания задачи отображается корректно", async () => {
    await expect(tasksPage.titleInput).toBeVisible();
    await expect(tasksPage.saveButton).toBeVisible();
  });

  test("новая задача сохраняется успешно", async () => {
    await tasksPage.fillTaskForm({
      title: "Test Task",
      content: "test content",
      assignee: "sarah@example.com",
      status: "To Publish",
      label: "task",
    });
    await tasksPage.saveAndGoTo("/#/tasks");

    await expect(tasksPage.pageText("Test Task")).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Список задач", () => {
  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");
  });

  test("список задач отображается корректно", async () => {
    await expect(tasksPage.itemsList).toBeVisible();
  });

  test("отображается основная информация о задачах", async () => {
    await expect(tasksPage.getByRole("heading", "Draft")).toBeVisible();
    await expect(tasksPage.getByRole("heading", "To Review")).toBeVisible();
    await expect(tasksPage.getByRole("heading", "To Be Fixed")).toBeVisible();
    await expect(tasksPage.getByRole("heading", "To Publish")).toBeVisible();
    await expect(tasksPage.getByRole("heading", "Published")).toBeVisible();

    await expect(tasksPage.taskCard()).toBeVisible();
  });
});

test.describe("Редактирование задачи", () => {
  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");
  });

  test("форма редактирования отображается корректно", async () => {
    await tasksPage.editTaskButton(0).click();

    await expect(tasksPage.titleInput).toBeVisible();
    await expect(tasksPage.saveButton).toBeVisible();
  });

  test("изменения задачи сохраняются", async () => {
    await tasksPage.editTaskButton(0).click();

    await tasksPage.titleInput.clear();
    await tasksPage.titleInput.fill("Updated Task Title");
    await tasksPage.save();

    await expect(tasksPage.pageText("Updated Task Title")).toBeVisible();
  });
});

test.describe("Фильтрация задач", () => {
  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");
  });

  test("фильтрация по статусу работает корректно", async () => {
    await tasksPage.filterByStatus("Draft");

    await expect(tasksPage.draftCards.first()).toBeVisible();
    await expect(tasksPage.toReviewCards.first()).not.toBeVisible();
    await expect(tasksPage.toBeFixedCards.first()).not.toBeVisible();
    await expect(tasksPage.toPublishCards.first()).not.toBeVisible();
    await expect(tasksPage.publishedCards.first()).not.toBeVisible();
  });

  test("фильтрация по исполнителю работает корректно", async () => {
    await tasksPage.filterByAssignee("jane@gmail.com");

    await expect(tasksPage.pageText("Index: 3329")).not.toBeVisible();

    await expect(tasksPage.pageText("Index: 3245")).toBeVisible();
    await expect(tasksPage.pageText("Index: 3266")).toBeVisible();
  });

  test("фильтрация по метке работает корректно", async () => {
    await tasksPage.filterByLabel("bug");

    await expect(tasksPage.pageText("Index: 3329")).not.toBeVisible();

    await expect(tasksPage.pageText("Index: 3182")).toBeVisible();
    await expect(tasksPage.pageText("Index: 3266")).toBeVisible();
  });
});

test.describe("Перемещение задачи между колонками", () => {
  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");
  });

  test("задача перемещается в другой статус", async ({ page }) => {
    const taskTitle = await tasksPage.taskCardTitle(1).textContent();

    await dragAndDrop(page, tasksPage.taskCard(1), tasksPage.toReviewBox);

    await expect(
      tasksPage.toReviewBox.locator(".MuiTypography-h5", {
        hasText: taskTitle,
      }),
    ).toBeVisible();

    await tasksPage.goto("/#/tasks");
    await expect(
      tasksPage.toReviewBox.locator(".MuiTypography-h5", {
        hasText: taskTitle,
      }),
    ).toBeVisible();
  });
});

test.describe("Удаление задач", () => {
  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");
  });

  test("одна задача удаляется успешно", async () => {
    const firstCard = tasksPage.taskCard(1);
    const taskTitle = await firstCard.locator(".MuiTypography-h5").textContent();

    await tasksPage.deleteTask(1);

    await expect(
      firstCard.locator(".MuiTypography-h5", { hasText: taskTitle })).not.toBeVisible();
  });
});

