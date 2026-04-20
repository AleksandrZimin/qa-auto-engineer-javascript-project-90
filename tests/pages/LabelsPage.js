import { AppPage } from './AppPage.js';

export class LabelsPage extends AppPage {
  constructor(page) {
    super(page);

    this.nameInput = page.getByLabel(/name/i);
  }

  async openCreateForm() {
    await this.createButton.click();
  }

  async fillLabelForm({ name }) {
    await this.nameInput.fill(name);
  }
}