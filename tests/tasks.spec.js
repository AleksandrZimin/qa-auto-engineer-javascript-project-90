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
    const taskName = `Task ${Date.now()}`;

    await tasksPage.fillTaskForm({
      title: taskName,
      content: "test content",
      assignee: "sarah@example.com",
      status: "To Publish",
      label: "task",
    });
    await tasksPage.saveAndGoTo("/#/tasks");

    await expect(tasksPage.pageText(taskName)).toBeVisible({
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
  let createdTaskName

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    createdTaskName = `Task ${Date.now()}`;

    await tasksPage.goto("/#/tasks");
    await tasksPage.openCreateForm();
    await tasksPage.fillTaskForm({
      title: createdTaskName,
      content: "edit test",
      assignee: "sarah@example.com",
      status: "Draft",
      label: "task",
    });
    await tasksPage.saveAndGoTo("/#/tasks");
  });

  test("форма редактирования отображается корректно", async () => {
    await tasksPage.editTaskButton(0).click();

    await expect(tasksPage.titleInput).toBeVisible();
    await expect(tasksPage.saveButton).toBeVisible();
  });

  test("изменения задачи сохраняются", async () => {
    const updatedName = `Updated ${Date.now()}`;

    await tasksPage.editTaskButton(0).click();
    await tasksPage.titleInput.clear();
    await tasksPage.titleInput.fill(updatedName);
    await tasksPage.save();

    await expect(tasksPage.pageText(updatedName)).toBeVisible();
  });
});

test.describe("Фильтрация задач", () => {
  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    await tasksPage.goto("/#/tasks");
  });

  test("фильтрация по статусу работает корректно", async () => {
    await tasksPage.filterByStatus("Draft");

    await expect(tasksPage.toReviewCards.first()).not.toBeVisible();
    await expect(tasksPage.toBeFixedCards.first()).not.toBeVisible();
    await expect(tasksPage.toPublishCards.first()).not.toBeVisible();
    await expect(tasksPage.publishedCards.first()).not.toBeVisible();
    await expect(tasksPage.draftCards.first()).toBeVisible();
  });

  test("фильтрация по исполнителю работает корректно", async () => {
    const taskForJane = `Jane Task ${Date.now()}`;
    const taskForOther = `Other Task ${Date.now() + 1}`;

    await tasksPage.openCreateForm();
    await tasksPage.fillTaskForm({
      title: taskForJane,
      assignee: "jane@gmail.com",
      status: "Draft",
      label: "task",
    });
    await tasksPage.saveAndGoTo("/#/tasks");

    await tasksPage.openCreateForm();
    await tasksPage.fillTaskForm({
      title: taskForOther,
      assignee: "sarah@example.com",
      status: "Draft",
      label: "task",
    });
    await tasksPage.saveAndGoTo("/#/tasks");

    await tasksPage.filterByAssignee("jane@gmail.com");

    await expect(tasksPage.pageText(taskForOther)).not.toBeVisible();
    await expect(tasksPage.pageText(taskForJane)).toBeVisible();
  });

  test("фильтрация по метке работает корректно", async () => {
    const bugTask = `Bug Task ${Date.now()}`;
    const otherTask = `Other Task ${Date.now() + 1}`;

    await tasksPage.openCreateForm();
    await tasksPage.fillTaskForm({
      title: bugTask,
      assignee: "sarah@example.com",
      status: "Draft",
      label: "bug",
    });
    await tasksPage.saveAndGoTo("/#/tasks");

    await tasksPage.openCreateForm();
    await tasksPage.fillTaskForm({
      title: otherTask,
      assignee: "sarah@example.com",
      status: "Draft",
      label: "task",
    });
    await tasksPage.saveAndGoTo("/#/tasks");

    await tasksPage.filterByLabel("bug");

    await expect(tasksPage.pageText(otherTask)).not.toBeVisible();
    await expect(tasksPage.pageText(bugTask)).toBeVisible();
  });
});

test.describe("Перемещение задачи между колонками", () => {
  let taskTitle;

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    taskTitle = `Drag Task ${Date.now()}`;

    await tasksPage.goto("/#/tasks");
    await tasksPage.openCreateForm();
    await tasksPage.fillTaskForm({
      title: taskTitle,
      content: "drag test",
      assignee: "sarah@example.com",
      status: "Draft",
      label: "task",
    });
    await tasksPage.saveAndGoTo("/#/tasks");
  });

  test("задача перемещается в другой статус", async ({ page }) => {
    const taskCard = tasksPage.draftCards.filter({ hasText: taskTitle });

    await dragAndDrop(page, taskCard, tasksPage.toReviewBox);

    await page.waitForTimeout(500);

    await expect(tasksPage.toReviewBox.getByText(taskTitle)).toBeVisible();

    await tasksPage.goto("/#/tasks");
    await expect(tasksPage.toReviewBox.getByText(taskTitle)).toBeVisible();
  });
});

test.describe("Удаление задач", () => {
  let taskTitle;

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    taskTitle = `Delete Task ${Date.now()}`;

    await tasksPage.goto("/#/tasks");
    await tasksPage.openCreateForm();
    await tasksPage.fillTaskForm({
      title: taskTitle,
      content: "delete test",
      assignee: "sarah@example.com",
      status: "Draft",
      label: "task",
    });
    await tasksPage.saveAndGoTo("/#/tasks");
  });

  test("одна задача удаляется успешно", async () => {
    // Убеждаемся что задача создана
    await expect(tasksPage.pageText(taskTitle)).toBeVisible();

    // Находим карточку и кликаем Edit через метод страницы
    const taskCard = tasksPage.draftCards.filter({ hasText: taskTitle });
    await taskCard.getByLabel("Edit").click();
    await tasksPage.getByRole("button", /delete/i).click();

    // Убеждаемся что задача удалена
    await expect(tasksPage.pageText("Element deleted")).toBeVisible();
    await tasksPage.goto("/#/tasks");
    await expect(tasksPage.pageText(taskTitle)).not.toBeVisible();
  });
});
