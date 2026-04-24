import { test, expect } from "./utils/beforeEach.js";
import { UsersPage } from "./pages/UsersPage.js";

let usersPage;

test.describe("Создание пользователя", () => {
  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");
    await usersPage.openCreateForm();
  });

  test("форма создания пользователя отображается корректно", async () => {
    await expect(usersPage.firstNameInput).toBeVisible();
    await expect(usersPage.lastNameInput).toBeVisible();
    await expect(usersPage.emailInput).toBeVisible();
    await expect(usersPage.saveButton).toBeVisible();
  });

  test("новый пользователь сохраняется успешно", async () => {
    await usersPage.fillUserForm({
      firstName: "John",
      lastName: "Tester",
      email: "john.tester@example.com",
    });
    await usersPage.saveAndGoTo("/#/users");

    await expect(usersPage.pageText("john.tester@example.com")).toBeVisible();
  });
});

test.describe("Список пользователей", () => {
  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");
  });

  test("список пользователей отображается корректно", async () => {
    await usersPage.userListVisible(true);
  });

  test("отображается основная информация о пользователях", async () => {
    await expect(usersPage.getByRole("columnheader", /email/i)).toBeVisible();
    await expect(usersPage.getByRole("columnheader", /first name/i)).toBeVisible();
    await expect(usersPage.getByRole("columnheader", /last name/i)).toBeVisible();
  });
});

test.describe("Редактирование пользователя", () => {
  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);

    await usersPage.goto("/#/users");
    await page.getByRole("row").nth(1).click();
  });

  test("форма редактирования отображается корректно", async () => {
    await expect(usersPage.emailInput).toBeVisible();
    await expect(usersPage.firstNameInput).toBeVisible();
    await expect(usersPage.lastNameInput).toBeVisible();
  });

  test("изменения пользователя сохраняются", async () => {
    await usersPage.firstNameInput.clear();
    await usersPage.firstNameInput.fill("UpdatedName");
    await usersPage.save();

    await expect(usersPage.pageText("UpdatedName")).toBeVisible();
  });

  test("валидация email при редактировании", async () => {
    await usersPage.emailInput.clear();
    await usersPage.emailInput.fill("not-valid-email");
    await usersPage.save();

    await expect(usersPage.pageText(/Incorrect email format/i)).toBeVisible();
  });
});

test.describe("Удаление пользователей", () => {
  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");
  });

  test("один пользователь удаляется успешно", async ({ page }) => {
    const firstRow = page.getByRole("row").nth(1);
    const emailCell = firstRow.getByRole("cell").nth(2);
    const emailText = await emailCell.textContent();

    await usersPage.deleteItem(0);

    await expect(usersPage.pageText(emailText)).not.toBeVisible();
  });

  test("массовое удаление всех пользователей", async () => {
    await usersPage.deleteAllItems("No Users yet.");
  });
});
