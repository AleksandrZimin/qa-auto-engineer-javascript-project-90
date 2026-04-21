import { test, expect } from "./utils/beforeEach.js";
import { StatusesPage } from "./pages/StatusesPage.js";

let statusesPage;

test.describe("Создание статуса", () => {
  test.beforeEach(async ({ page }) => {
    statusesPage = new StatusesPage(page);

    await statusesPage.goto("/#/task_statuses");
    await statusesPage.openCreateForm();
  });

  test("форма создания статуса отображается корректно", async () => {
    await expect(statusesPage.nameInput).toBeVisible();
    await expect(statusesPage.slugInput).toBeVisible();
    await expect(statusesPage.saveButton).toBeVisible();
  });

  test("новый статус сохраняется успешно", async () => {
    await statusesPage.fillStatusForm({
      name: "In Review",
      slug: "in-review",
    });
    await statusesPage.saveAndGoTo("/#/task_statuses");

    await expect(statusesPage.pageText("In Review")).toBeVisible();
  });
});

test.describe("Список статусов", () => {
  test.beforeEach(async ({ page }) => {
    statusesPage = new StatusesPage(page);
    await statusesPage.goto("/#/task_statuses");
  });

  test("список статусов отображается корректно", async () => {
    await expect(statusesPage.itemsList).toBeVisible();
  });

  test("отображается основная информация о статусах", async () => {
    await expect(statusesPage.getByRole("columnheader", /name/i)).toBeVisible();
    await expect(statusesPage.getByRole("columnheader", /slug/i)).toBeVisible();
  });
});

test.describe("Редактирование статуса", () => {
  test.beforeEach(async ({ page }) => {
    statusesPage = new StatusesPage(page);

    await statusesPage.goto("/#/task_statuses");
    await page.getByRole("row").nth(1).click();
  });

  test("форма редактирования отображается корректно", async () => {
    await expect(statusesPage.nameInput).toBeVisible();
    await expect(statusesPage.slugInput).toBeVisible();
  });

  test("изменения статуса сохраняются", async () => {
    await statusesPage.nameInput.clear();
    await statusesPage.nameInput.fill("Updated Status");
    await statusesPage.save();

    await expect(statusesPage.pageText("Updated Status")).toBeVisible();
  });
});

test.describe("Удаление статусов", () => {
  test.beforeEach(async ({ page }) => {
    statusesPage = new StatusesPage(page);
    await statusesPage.goto("/#/task_statuses");
  });

  test("один статус удаляется успешно", async ({ page }) => {
    const firstRow = page.getByRole("row").nth(1);
    const nameCell = firstRow.getByRole("cell").nth(2);
    const nameText = await nameCell.textContent();

    await statusesPage.deleteItem(0);

    await expect(statusesPage.getByRole("cell", nameText)).not.toBeVisible();
  });

  test("массовое удаление всех статусов", async () => {
    await statusesPage.deleteAllItems("No Task statuses yet.");
  });
});

