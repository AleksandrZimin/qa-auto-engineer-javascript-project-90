import { expect } from '@playwright/test';
import { AppPage } from './AppPage.js';

export class UsersPage extends AppPage {
  constructor(page) {
    super(page);
    this.page = page;

    this.usersMenuLink = page.getByRole('menuitem', { name: /users/i });
    this.firstNameInput = page.getByLabel(/first name/i);
    this.lastNameInput = page.getByLabel(/last name/i);
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
  }

  async fillUserForm({ firstName, lastName, email }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
  }

  async userListVisible(bool = true) {
    if(bool === true) {
      await expect(this.itemsList).toBeVisible();
    } else if(bool === false) {
      await expect(this.itemsList).not.toBeVisible();
    }
  }
}