import { test, expect } from "./utils/beforeEach.js"
import { UsersPage } from "./pages/UsersPage.js"

let usersPage

test.describe("Создание пользователя", () => {
  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page)
    await usersPage.goto("/#/users")
    await usersPage.openCreateForm()
  })

  test("форма создания пользователя отображается корректно", async () => {
    await expect(usersPage.firstNameInput).toBeVisible()
    await expect(usersPage.lastNameInput).toBeVisible()
    await expect(usersPage.emailInput).toBeVisible()
    await expect(usersPage.saveButton).toBeVisible()
  })

  test("новый пользователь сохраняется успешно", async () => {
    const email = `user.${Date.now()}@example.com`

    await usersPage.fillUserForm({
      firstName: "John",
      lastName: "Tester",
      email,
    })
    await usersPage.saveAndGoTo("/#/users")

    await expect(usersPage.pageText(email)).toBeVisible()
  })
})

test.describe("Список пользователей", () => {
  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page)
    await usersPage.goto("/#/users")
  })

  test("список пользователей отображается корректно", async () => {
    await usersPage.userListVisible(true)
  })

  test("отображается основная информация о пользователях", async () => {
    await expect(usersPage.getByRole("columnheader", /email/i)).toBeVisible()
    await expect(usersPage.getByRole("columnheader", /first name/i)).toBeVisible()
    await expect(usersPage.getByRole("columnheader", /last name/i)).toBeVisible()
  })
})

test.describe("Редактирование пользователя", () => {
  let userEmail

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page)
    userEmail = `edit.${Date.now()}@example.com`

    await usersPage.goto("/#/users")
    await usersPage.openCreateForm()
    await usersPage.fillUserForm({
      firstName: "Edit",
      lastName: "User",
      email: userEmail,
    })
    await usersPage.saveAndGoTo("/#/users")

    await usersPage.pageText(userEmail).click()
  })

  test("форма редактирования отображается корректно", async () => {
    await expect(usersPage.emailInput).toBeVisible()
    await expect(usersPage.firstNameInput).toBeVisible()
    await expect(usersPage.lastNameInput).toBeVisible()
  })

  test("изменения пользователя сохраняются", async () => {
    const updatedName = `Updated${Date.now()}`

    await usersPage.firstNameInput.clear()
    await usersPage.firstNameInput.fill(updatedName)
    await usersPage.save()

    await expect(usersPage.pageText(updatedName)).toBeVisible()
  })

  test("валидация email при редактировании", async () => {
    await usersPage.emailInput.clear()
    await usersPage.emailInput.fill("not-valid-email")
    await usersPage.save()

    await expect(usersPage.pageText(/Incorrect email format/i)).toBeVisible()
  })
})

test.describe("Удаление пользователей", () => {
  let userEmail

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page)
    userEmail = `delete.${Date.now()}@example.com`

    await usersPage.goto("/#/users")
    await usersPage.openCreateForm()
    await usersPage.fillUserForm({
      firstName: "Delete",
      lastName: "User",
      email: userEmail,
    })
    await usersPage.saveAndGoTo("/#/users")
  })

  test("один пользователь удаляется успешно", async ({ page }) => {
    await expect(usersPage.pageText(userEmail)).toBeVisible()

    const userRow = page.getByRole("row").filter({ hasText: userEmail })
    await userRow.getByRole("checkbox").click()
    await usersPage.deleteSelectedButton.click()

    await expect(usersPage.pageText("Element deleted")).toBeVisible()
    await expect(usersPage.pageText(userEmail)).not.toBeVisible()
  })

  test("массовое удаление всех пользователей", async () => {
    await usersPage.deleteAllItems("No Users yet.")
  })
})
