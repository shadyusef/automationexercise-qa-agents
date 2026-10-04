import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  readonly heading: Locator;
  readonly successMessage: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  private readonly fileInput: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Get In Touch' });
    this.successMessage = page.locator('.alert-success:visible').filter({ hasText: 'Success! Your details have been submitted successfully.' }).first();
    this.nameInput = page.locator('[data-qa="name"]');
    this.emailInput = page.locator('[data-qa="email"]');
    this.subjectInput = page.locator('[data-qa="subject"]');
    this.messageInput = page.locator('[data-qa="message"]');
    this.submitButton = page.locator('[data-qa="submit-button"]');
    this.fileInput = page.locator('input[name="upload_file"]');
  }

  async fill(form: { name: string; email: string; subject: string; message: string; filePath?: string }): Promise<void> {
    await this.nameInput.fill(form.name);
    await this.emailInput.fill(form.email);
    await this.subjectInput.fill(form.subject);
    await this.messageInput.fill(form.message);
    if (form.filePath) await this.fileInput.setInputFiles(form.filePath);
  }

  /** The site raises a JS confirm() on submit; accept it before the click that triggers it. */
  async submit(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }
}
