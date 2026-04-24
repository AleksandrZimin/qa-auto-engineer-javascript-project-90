import { test, expect } from "./utils/beforeEach.js";
import { LabelsPage } from "./pages/LabelsPage.js";

let labelsPage;

test.describe("Создание метки", () => {
  test.beforeEach(async ({ page }) => {
    labelsPage = new LabelsPage(page);

    await labelsPage.goto("/#/labels");
    await labelsPage.openCreateForm();
  });

  test("форма создания метки отображается корректно", async () => {
    await expect(labelsPage.nameInput).toBeVisible();
    await expect(labelsPage.saveButton).toBeVisible();
  });

  test("новая метка сохраняется успешно", async ({ page }) => {
    await labelsPage.fillLabelForm({ name: "test" });
    await labelsPage.saveAndGoTo("/#/labels");

    await expect(
      page.getByRole("cell", { name: "test", exact: true }),
    ).toBeVisible();
  });
});

test.describe("Список меток", () => {
  test.beforeEach(async ({ page }) => {
    labelsPage = new LabelsPage(page);
    await labelsPage.goto("/#/labels");
  });

  test("список меток отображается корректно", async () => {
    await expect(labelsPage.itemsList).toBeVisible();
  });

  test("отображается основная информация о метках", async () => {
    await expect(
      labelsPage.getByRole("columnheader", /name/i)).toBeVisible();
  });
});

test.describe("Редактирование метки", () => {
  test.beforeEach(async ({ page }) => {
    labelsPage = new LabelsPage(page);

    await labelsPage.goto("/#/labels");
    await page.getByRole("row").nth(1).click();
  });

  test("форма редактирования отображается корректно", async () => {
    await expect(labelsPage.nameInput).toBeVisible();
    await expect(labelsPage.saveButton).toBeVisible();
  });

  test("изменения метки сохраняются", async () => {
    await labelsPage.nameInput.clear();
    await labelsPage.nameInput.fill("test");
    await labelsPage.save();

    await expect(
     labelsPage.getByRole("cell", "test"),
    ).toBeVisible();
  });
});

test.describe("Удаление меток", () => {
  test.beforeEach(async ({ page }) => {
    labelsPage = new LabelsPage(page);
    await labelsPage.goto("/#/labels");
  });

  test("одна метка удаляется успешно", async ({ page }) => {
    const firstRow = page.getByRole("row").nth(1);
    const nameText = await firstRow.getByRole("cell").nth(2).textContent();

    await labelsPage.deleteItem(0);

    await expect(labelsPage.getByRole("cell", nameText)).not.toBeVisible();
  });

  test("массовое удаление всех меток", async () => {
    await labelsPage.deleteAllItems("No Labels yet.");
  });
});
