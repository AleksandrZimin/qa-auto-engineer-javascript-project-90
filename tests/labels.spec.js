import { test, expect } from "./utils/beforeEach.js"
import { LabelsPage } from "./pages/LabelsPage.js"

let labelsPage

test.describe("Создание метки", () => {
  test.beforeEach(async ({ page }) => {
    labelsPage = new LabelsPage(page)
    await labelsPage.goto("/#/labels")
    await labelsPage.openCreateForm()
  })

  test("форма создания метки отображается корректно", async () => {
    await expect(labelsPage.nameInput).toBeVisible()
    await expect(labelsPage.saveButton).toBeVisible()
  })

  test("новая метка сохраняется успешно", async ({ page }) => {
    const labelName = `Label ${Date.now()}`

    await labelsPage.fillLabelForm({ name: labelName })
    await labelsPage.saveAndGoTo("/#/labels")

    await expect(
      page.getByRole("cell", { name: labelName, exact: true })
    ).toBeVisible()
  })
})

test.describe("Список меток", () => {
  test.beforeEach(async ({ page }) => {
    labelsPage = new LabelsPage(page)
    await labelsPage.goto("/#/labels")
  })

  test("список меток отображается корректно", async () => {
    await expect(labelsPage.itemsList).toBeVisible()
  })

  test("отображается основная информация о метках", async () => {
    await expect(
      labelsPage.getByRole("columnheader", /name/i)
    ).toBeVisible()
  })
})

test.describe("Редактирование метки", () => {
  let labelName

  test.beforeEach(async ({ page }) => {
    labelsPage = new LabelsPage(page)
    labelName = `Label ${Date.now()}`

    await labelsPage.goto("/#/labels")
    await labelsPage.openCreateForm()
    await labelsPage.fillLabelForm({ name: labelName })
    await labelsPage.saveAndGoTo("/#/labels")

    await labelsPage.pageText(labelName).click()
  })

  test("форма редактирования отображается корректно", async () => {
    await expect(labelsPage.nameInput).toBeVisible()
    await expect(labelsPage.saveButton).toBeVisible()
  })

  test("изменения метки сохраняются", async () => {
    const updatedName = `Updated ${Date.now()}`

    await labelsPage.nameInput.clear()
    await labelsPage.nameInput.fill(updatedName)
    await labelsPage.save()

    await expect(
      labelsPage.getByRole("cell", updatedName)
    ).toBeVisible()
  })
})

test.describe("Удаление меток", () => {
  let labelName

  test.beforeEach(async ({ page }) => {
    labelsPage = new LabelsPage(page)
    labelName = `Label ${Date.now()}`

    await labelsPage.goto("/#/labels")
    await labelsPage.openCreateForm()
    await labelsPage.fillLabelForm({ name: labelName })
    await labelsPage.saveAndGoTo("/#/labels")
  })

  test("одна метка удаляется успешно", async ({ page }) => {
    await expect(labelsPage.pageText(labelName)).toBeVisible()

    const labelRow = page.getByRole("row").filter({ hasText: labelName })
    await labelRow.getByRole("checkbox").click()
    await labelsPage.deleteSelectedButton.click()

    await expect(labelsPage.pageText("Element deleted")).toBeVisible()
    await expect(labelsPage.pageText(labelName)).not.toBeVisible()
  })

  test("массовое удаление всех меток", async () => {
    await labelsPage.deleteAllItems("No Labels yet.")
  })
})
