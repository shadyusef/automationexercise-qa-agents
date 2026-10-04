import fs from 'fs';
import { test, expect } from '../src/fixtures/test-fixtures';
import { uniqueEmail } from '../src/utils/data';
import { isTypeMismatch, isValueMissing } from '../src/utils/validation';

test.describe('Contact us', () => {
  test('[TC-CONTACT-001] Submit the contact form with an attachment @regression', async ({ homePage, contactPage }, testInfo) => {
    const attachment = testInfo.outputPath('upload.txt');
    fs.writeFileSync(attachment, 'Sample attachment for the contact form test.');

    await homePage.open();
    await homePage.goToContact();
    await expect(contactPage.heading).toBeVisible();
    await contactPage.fill({
      name: 'QA Tester',
      email: uniqueEmail('contact'),
      subject: 'Order question',
      message: 'This message was sent by an automated test.',
      filePath: attachment,
    });
    await contactPage.submit();
    await expect(contactPage.successMessage).toBeVisible();
  });

  test('[TC-CONTACT-002] Contact form rejects an invalid email format @regression', async ({ page, contactPage }) => {
    await page.goto('/contact_us', { waitUntil: 'domcontentloaded' });
    await contactPage.waitReady();
    await contactPage.fill({ name: 'QA Tester', email: 'abc', subject: 'Subject', message: 'Message' });
    await contactPage.submit();
    await expect.poll(() => isTypeMismatch(contactPage.emailInput)).toBe(true);
    await expect(contactPage.successMessage).toBeHidden();
  });

  test('[TC-CONTACT-003] Contact form requires mandatory fields @regression', async ({ page, contactPage }) => {
    test.fail(true, 'BUG-001: only Email is required; Name, Subject and Message can be left empty.');
    await page.goto('/contact_us', { waitUntil: 'domcontentloaded' });
    await contactPage.waitReady();
    await contactPage.submit();
    await expect.poll(() => isValueMissing(contactPage.nameInput)).toBe(true);
    await expect(contactPage.successMessage).toBeHidden();
  });
});
