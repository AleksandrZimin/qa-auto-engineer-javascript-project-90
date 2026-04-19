import { expect } from '@playwright/test';
import { AppPage } from './AppPage.js';

export class UsersPage extends AppPage {
  constructor(page) {
    super(page);
    this.page = page;

    // Навигация
    this.usersMenuLink = page.getByRole('menuitem', { name: /users/i });

    // Список
    this.usersList = page.locator('.list-page');
    this.createButton = page.getByRole('link', { name: /create/i });
    this.checkboxAll = page.getByRole('checkbox', { name: /select all/i });
    this.deleteSelectedButton = page.getByRole('button', { name: /delete/i });

    // Форма создания/редактирования
    this.firstNameInput = page.getByLabel(/first name/i);
    this.lastNameInput = page.getByLabel(/last name/i);
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.saveButton = page.getByRole('button', { name: /save/i });

    // Подтверждение удаления
    this.getByText = (text) => page.getByText(text);
  }

  async openCreateForm() {
    await this.createButton.click();
  }

  async fillUserForm({ firstName, lastName, email }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
  }

  async save() {
    await this.saveButton.click();
  }

  async deleteUser(rowIndex = 0) {
    // Чекбокс конкретной строки
    const checkboxes = this.page.getByRole('checkbox');
    await checkboxes.nth(rowIndex + 1).click(); // +1 т.к. первый — Select All
    await this.deleteSelectedButton.click();
    await expect(this.getByText('Element deleted')).toBeVisible();
  }

  async deleteAllUsers() {
    await this.checkboxAll.click();
    await this.deleteSelectedButton.click();
    await expect(this.getByText("No Users yet.")).toBeVisible();
  }

  async userListVisible(bool = true) {
    if(bool === true) {
      await expect(this.usersList).toBeVisible();
    } else if(bool === false) {
      await expect(this.usersList).not.toBeVisible();
    }
  }
}