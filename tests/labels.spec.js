import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { LabelsPage } from "./pages/LabelsPage.js";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto("/");
  await loginPage.login("admin", "admin");
});

test.describe("Создание метки", () => {
  test("форма создания метки отображается корректно", async ({ page }) => {
    const labelsPage = new LabelsPage(page);
    await labelsPage.goto("/#/labels");
    await labelsPage.openCreateForm();

    await expect(labelsPage.nameInput).toBeVisible();
    await expect(labelsPage.saveButton).toBeVisible();
  });

  test("новая метка сохраняется успешно", async ({ page }) => {
    const labelsPage = new LabelsPage(page);
    await labelsPage.goto("/#/labels");
    await labelsPage.openCreateForm();

    await labelsPage.fillLabelForm({ name: "test" });
    await labelsPage.saveAndGoTo("/#/labels");

    await expect(
      page.getByRole("cell", { name: "test", exact: true }),
    ).toBeVisible();
  });
});

test.describe("Список меток", () => {
  test("список меток отображается корректно", async ({ page }) => {
    const labelsPage = new LabelsPage(page);
    await labelsPage.goto("/#/labels");

    await expect(labelsPage.itemsList).toBeVisible();
  });

  test("отображается основная информация о метках", async ({ page }) => {
    const labelsPage = new LabelsPage(page);
    await labelsPage.goto("/#/labels");

    await expect(
      page.getByRole("columnheader", { name: /name/i }),
    ).toBeVisible();
  });
});

test.describe("Редактирование метки", () => {
  test("форма редактирования отображается корректно", async ({ page }) => {
    const labelsPage = new LabelsPage(page);
    await labelsPage.goto("/#/labels");

    await page.getByRole("row").nth(1).click();

    await expect(labelsPage.nameInput).toBeVisible();
    await expect(labelsPage.saveButton).toBeVisible();
  });

  test("изменения метки сохраняются", async ({ page }) => {
    const labelsPage = new LabelsPage(page);
    await labelsPage.goto("/#/labels");

    await page.getByRole("row").nth(1).click();

    await labelsPage.nameInput.clear();
    await labelsPage.nameInput.fill("test");
    await labelsPage.save();

    await expect(
      page.getByRole("cell", { name: "test", exact: true }),
    ).toBeVisible();
  });
});

test.describe("Удаление меток", () => {
  test("одна метка удаляется успешно", async ({ page }) => {
    const labelsPage = new LabelsPage(page);
    await labelsPage.goto("/#/labels");

    const firstRow = page.getByRole("row").nth(1);
    const nameText = await firstRow.getByRole("cell").nth(2).textContent();

    await labelsPage.deleteItem(0);

    await expect(
      page.getByRole("cell", { name: nameText, exact: true }),
    ).not.toBeVisible();
  });

  test("массовое удаление всех меток", async ({ page }) => {
    const labelsPage = new LabelsPage(page);
    await labelsPage.goto("/#/labels");

    await labelsPage.deleteAllItems('No Labels yet.');
  });
});

