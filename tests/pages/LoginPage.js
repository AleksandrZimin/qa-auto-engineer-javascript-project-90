import { AppPage } from "./AppPage.js";

export class LoginPage extends AppPage {
  constructor(page) {
    super(page);
    this.usernameInput = page.getByLabel(/username/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.signInButton = page.getByRole("button", { name: /sign in/i });
    this.logoutButton = page.getByRole("menuitem", { name: /logout/i });
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async logout() {
    await this.profileButton.click();
    await this.logoutButton.click();
  }
}

