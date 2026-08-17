import type { Locator, Page } from "@playwright/test";

export function labeledInput(page: Page, label: string): Locator {
  return page.getByLabel(label, { exact: true });
}
