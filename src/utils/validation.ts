import { Locator } from '@playwright/test';

/** HTML5 constraint-validation state of a form control (what the browser enforces before submit). */
export async function isValueMissing(field: Locator): Promise<boolean> {
  return field.evaluate((el) => (el as HTMLInputElement).validity.valueMissing);
}

export async function isTypeMismatch(field: Locator): Promise<boolean> {
  return field.evaluate((el) => (el as HTMLInputElement).validity.typeMismatch);
}

/** "Rs. 1,500" -> 1500 */
export function parsePrice(text: string): number {
  const match = text.match(/\d[\d,]*(\.\d+)?/);
  return match ? Number(match[0].replace(/,/g, '')) : Number.NaN;
}
