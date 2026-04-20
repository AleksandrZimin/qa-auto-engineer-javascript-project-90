import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { UsersPage } from "./pages/UsersPage.js";

// Входим один раз перед каждым тестом
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto("/");
  await loginPage.login("admin", "admin");
});

test.describe("Создание пользователя", () => {
  test("форма создания пользователя отображается корректно", async ({
    page,
  }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");
    await usersPage.openCreateForm();

    await expect(usersPage.firstNameInput).toBeVisible();
    await expect(usersPage.lastNameInput).toBeVisible();
    await expect(usersPage.emailInput).toBeVisible();
    await expect(usersPage.saveButton).toBeVisible();
  });

  test("новый пользователь сохраняется успешно", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");
    await usersPage.openCreateForm();

    await usersPage.fillUserForm({
      firstName: "John",
      lastName: "Tester",
      email: "john.tester@example.com",
    });
    await usersPage.saveAndGoTo('/#/users');

    await expect(page.getByText("john.tester@example.com")).toBeVisible();
  });
});

test.describe("Список пользователей", () => {
  test("список пользователей отображается корректно", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");
    await usersPage.userListVisible(true);
  });

  test("отображается основная информация о пользователях", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");

    await expect(
      page.getByRole("columnheader", { name: /email/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /first name/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /last name/i }),
    ).toBeVisible();
  });
});

test.describe("Редактирование пользователя", () => {
  test("форма редактирования отображается корректно", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");

    await page.getByRole("row").nth(1).click();

    await expect(usersPage.emailInput).toBeVisible();
    await expect(usersPage.firstNameInput).toBeVisible();
    await expect(usersPage.lastNameInput).toBeVisible();
  });

  test("изменения пользователя сохраняются", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");

    await page.getByRole("row").nth(1).click();

    await usersPage.firstNameInput.clear();
    await usersPage.firstNameInput.fill("UpdatedName");
    await usersPage.save();

    await expect(page.getByText("UpdatedName")).toBeVisible();
  });

  test("валидация email при редактировании", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");

    await page.getByRole("row").nth(1).click();

    await usersPage.emailInput.clear();
    await usersPage.emailInput.fill("not-valid-email");
    await usersPage.save();

    await expect(page.getByText(/Incorrect email format/i)).toBeVisible();
  });
});

test.describe("Удаление пользователей", () => {
  test("один пользователь удаляется успешно", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");

    const firstRow = page.getByRole("row").nth(1);
    const emailCell = firstRow.getByRole("cell").nth(2);
    const emailText = await emailCell.textContent();

    await usersPage.deleteItem(0);

    await expect(page.getByText(emailText)).not.toBeVisible();
  });

  test("массовое удаление всех пользователей", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto("/#/users");

    await usersPage.deleteAllItems('No Users yet.');

    // Список пуст
    await expect(page.getByText(/no users|empty/i)).toBeVisible();
  });
});

