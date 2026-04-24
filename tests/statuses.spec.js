import { test, expect } from "./utils/beforeEach.js"
import { StatusesPage } from "./pages/StatusesPage.js"

let statusesPage

test.describe("Создание статуса", () => {
  test.beforeEach(async ({ page }) => {
    statusesPage = new StatusesPage(page)
    await statusesPage.goto("/#/task_statuses")
    await statusesPage.openCreateForm()
  })

  test("форма создания статуса отображается корректно", async () => {
    await expect(statusesPage.nameInput).toBeVisible()
    await expect(statusesPage.slugInput).toBeVisible()
    await expect(statusesPage.saveButton).toBeVisible()
  })

  test("новый статус сохраняется успешно", async () => {
    const statusName = `Status ${Date.now()}`
    const statusSlug = `status-${Date.now()}`

    await statusesPage.fillStatusForm({
      name: statusName,
      slug: statusSlug,
    })
    await statusesPage.saveAndGoTo("/#/task_statuses")

    await expect(statusesPage.pageText(statusName)).toBeVisible()
  })
})

test.describe("Список статусов", () => {
  test.beforeEach(async ({ page }) => {
    statusesPage = new StatusesPage(page)
    await statusesPage.goto("/#/task_statuses")
  })

  test("список статусов отображается корректно", async () => {
    await expect(statusesPage.itemsList).toBeVisible()
  })

  test("отображается основная информация о статусах", async () => {
    await expect(statusesPage.getByRole("columnheader", /name/i)).toBeVisible()
    await expect(statusesPage.getByRole("columnheader", /slug/i)).toBeVisible()
  })
})

test.describe("Редактирование статуса", () => {
  let statusName

  test.beforeEach(async ({ page }) => {
    statusesPage = new StatusesPage(page)
    statusName = `Status ${Date.now()}`

    await statusesPage.goto("/#/task_statuses")
    await statusesPage.openCreateForm()
    await statusesPage.fillStatusForm({
      name: statusName,
      slug: `status-${Date.now()}`,
    })
    await statusesPage.saveAndGoTo("/#/task_statuses")

    await statusesPage.pageText(statusName).click()
  })

  test("форма редактирования отображается корректно", async () => {
    await expect(statusesPage.nameInput).toBeVisible()
    await expect(statusesPage.slugInput).toBeVisible()
  })

  test("изменения статуса сохраняются", async () => {
    const updatedName = `Updated ${Date.now()}`

    await statusesPage.nameInput.clear()
    await statusesPage.nameInput.fill(updatedName)
    await statusesPage.save()

    await expect(statusesPage.pageText(updatedName)).toBeVisible()
  })
})

test.describe("Удаление статусов", () => {
  let statusName

  test.beforeEach(async ({ page }) => {
    statusesPage = new StatusesPage(page)
    statusName = `Status ${Date.now()}`

    await statusesPage.goto("/#/task_statuses")
    await statusesPage.openCreateForm()
    await statusesPage.fillStatusForm({
      name: statusName,
      slug: `status-${Date.now()}`,
    })
    await statusesPage.saveAndGoTo("/#/task_statuses")
  })

  test("один статус удаляется успешно", async ({ page }) => {
    await expect(statusesPage.pageText(statusName)).toBeVisible()

    const statusRow = page.getByRole("row").filter({ hasText: statusName })
    await statusRow.getByRole("checkbox").click()
    await statusesPage.deleteSelectedButton.click()

    await expect(statusesPage.pageText("Element deleted")).toBeVisible()
    await expect(statusesPage.pageText(statusName)).not.toBeVisible()
  })

  test("массовое удаление всех статусов", async () => {
    await statusesPage.deleteAllItems("No Task statuses yet.")
  })
})
