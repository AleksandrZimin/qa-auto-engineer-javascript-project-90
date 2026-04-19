import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { StatusesPage } from "./pages/StatusesPage.js";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto("/");
  await loginPage.login("admin", "admin");
});

test.describe("Создание статуса", () => {
  test("форма создания статуса отображается корректно", async ({ page }) => {
    const statusesPage = new StatusesPage(page);
    await statusesPage.goto("/#/task_statuses");
    await statusesPage.openCreateForm();

    await expect(statusesPage.nameInput).toBeVisible();
    await expect(statusesPage.slugInput).toBeVisible();
    await expect(statusesPage.saveButton).toBeVisible();
  });

  test("новый статус сохраняется успешно", async ({ page }) => {
    const statusesPage = new StatusesPage(page);
    await statusesPage.goto("/#/task_statuses");
    await statusesPage.openCreateForm();

    await statusesPage.fillStatusForm({
      name: "In Review",
      slug: "in-review",
    });
    await statusesPage.saveAndGoTo('/#/task_statuses');

    await expect(page.getByText("In Review")).toBeVisible();
  });
});

test.describe("Список статусов", () => {
  test("список статусов отображается корректно", async ({ page }) => {
    const statusesPage = new StatusesPage(page);
    await statusesPage.goto("/#/task_statuses");

    await expect(statusesPage.statusesList).toBeVisible();
  });

  test("отображается основная информация о статусах", async ({ page }) => {
    const statusesPage = new StatusesPage(page);
    await statusesPage.goto("/#/task_statuses");

    await expect(
      page.getByRole("columnheader", { name: /name/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /slug/i }),
    ).toBeVisible();
  });
});

test.describe("Редактирование статуса", () => {
  test("форма редактирования отображается корректно", async ({ page }) => {
    const statusesPage = new StatusesPage(page);
    await statusesPage.goto("/#/task_statuses");

    await page.getByRole("row").nth(1).click();

    await expect(statusesPage.nameInput).toBeVisible();
    await expect(statusesPage.slugInput).toBeVisible();
  });

  test("изменения статуса сохраняются", async ({ page }) => {
    const statusesPage = new StatusesPage(page);
    await statusesPage.goto("/#/task_statuses");

    await page.getByRole("row").nth(1).click();

    await statusesPage.nameInput.clear();
    await statusesPage.nameInput.fill("Updated Status");
    await statusesPage.save();

    await expect(page.getByText("Updated Status")).toBeVisible();
  });
});

test.describe("Удаление статусов", () => {
  test("один статус удаляется успешно", async ({ page }) => {
    const statusesPage = new StatusesPage(page);
    await statusesPage.goto("/#/task_statuses");

    // Берём ячейку с названием статуса (колонка Name — обычно 2-я или 3-я)
    const firstRow = page.getByRole("row").nth(1);
    const nameCell = firstRow.getByRole("cell").nth(2); // ← попробуй nth(2) вместо nth(1)
    const nameText = await nameCell.textContent();

    await statusesPage.deleteStatus(0);

    // Ищем точное совпадение в таблице, не по всей странице
    await expect(
      page.getByRole("cell", { name: nameText, exact: true }),
    ).not.toBeVisible();
  });

  test("массовое удаление всех статусов", async ({ page }) => {
    const statusesPage = new StatusesPage(page);
    await statusesPage.goto("/#/task_statuses");

    await statusesPage.deleteAllStatuses();
  });
});
