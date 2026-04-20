import { AppPage } from "./AppPage.js";

export class StatusesPage extends AppPage {
  constructor(page) {
    super(page);

    this.nameInput = page.getByLabel(/name/i);
    this.slugInput = page.getByLabel(/slug/i);
  }

  async fillStatusForm({ name, slug }) {
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
  }
}

