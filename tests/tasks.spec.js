import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { TasksPage } from "./pages/TasksPage.js";
import { dragAndDrop } from "./utils/dragAndDrop.js";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto("/");
  await loginPage.login("admin", "admin");
});

test.describe("Создание задачи", () => {
  test("форма создания задачи отображается корректно", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");
    await tasksPage.openCreateForm();

    await expect(tasksPage.titleInput).toBeVisible();
    await expect(tasksPage.saveButton).toBeVisible();
  });

  test("новая задача сохраняется успешно", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");
    await tasksPage.openCreateForm();

    await tasksPage.fillTaskForm({
      title: "Test Task",
      content: "test content",
      assignee: "sarah@example.com",
      status: "To Publish",
      label: "task",
    });
    await tasksPage.saveAndGoTo("/#/tasks");

    await expect(page.getByText("Test Task")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Список задач", () => {
  test("список задач отображается корректно", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");

    await expect(tasksPage.itemsList).toBeVisible();
  });

  test("отображается основная информация о задачах", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");

    await expect(tasksPage.getByRole("heading", "Draft")).toBeVisible();
    await expect(tasksPage.getByRole("heading", "To Review")).toBeVisible();
    await expect(tasksPage.getByRole("heading", "To Be Fixed")).toBeVisible();
    await expect(tasksPage.getByRole("heading", "To Publish")).toBeVisible();
    await expect(tasksPage.getByRole("heading", "Published")).toBeVisible();
  
    await expect(tasksPage.taskCard()).toBeVisible();
  });
});

test.describe("Редактирование задачи", () => {
  test("форма редактирования отображается корректно", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");

    // Кликаем на первую карточку задачи на доске
    await tasksPage.editTaskButton(0).click();

    await expect(tasksPage.titleInput).toBeVisible();
    await expect(tasksPage.saveButton).toBeVisible();
  });

  test("изменения задачи сохраняются", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");

    await tasksPage.editTaskButton(0).click();

    await tasksPage.titleInput.clear();
    await tasksPage.titleInput.fill("Updated Task Title");
    await tasksPage.save();

    await expect(page.getByText("Updated Task Title")).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Фильтрация задач", () => {
  test("фильтрация по статусу работает корректно", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");

    await tasksPage.filterByStatus("Draft");

    await expect(tasksPage.draftCards.first()).toBeVisible();
    await expect(tasksPage.toReviewCards.first()).not.toBeVisible();
    await expect(tasksPage.toBeFixedCards.first()).not.toBeVisible();
    await expect(tasksPage.toPublishCards.first()).not.toBeVisible();
    await expect(tasksPage.publishedCards.first()).not.toBeVisible();
  });

  test("фильтрация по исполнителю работает корректно", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");

    await tasksPage.filterByAssignee("jane@gmail.com");

    await expect(page.getByText("Index: 3329")).not.toBeVisible();

    await expect(page.getByText("Index: 3245")).toBeVisible();
    await expect(page.getByText("Index: 3266")).toBeVisible();
  });

  test("фильтрация по метке работает корректно", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");

    await tasksPage.filterByLabel("bug");

    await expect(page.getByText("Index: 3329")).not.toBeVisible();

    await expect(page.getByText("Index: 3182")).toBeVisible();
    await expect(page.getByText("Index: 3266")).toBeVisible();
  });
});

test.describe("Перемещение задачи между колонками", () => {
  test("задача перемещается в другой статус", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");

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
  test("одна задача удаляется успешно", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");

    // Запоминаем заголовок первой карточки
    const firstCard = tasksPage.taskCard(1);
    const taskTitle = await firstCard
      .locator(".MuiTypography-h5")
      .textContent();

    await tasksPage.deleteTask(1);

    // Проверяем что карточка исчезла
    await expect(
      page.locator(".MuiTypography-h5", { hasText: taskTitle }),
    ).not.toBeVisible();
  });
});

