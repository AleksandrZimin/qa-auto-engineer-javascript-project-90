export class AppPage {
  constructor(page) {
    this.page = page;
    this.profileButton = page.getByRole("button", { name: /profile/i });
  }

  async goto(route = "/") {
    await this.page.goto(route);
  }

  async logout() {
    // Открываем меню профиля
    await this.profileButton.click();
    // Кликаем Logout в выпадающем меню
    await this.page.getByRole("menuitem", { name: /logout/i }).click();
  }
}
