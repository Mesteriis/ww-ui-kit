import type { Page } from '@playwright/test';

export async function failOnConsoleErrors(page: Page) {
  page.on('pageerror', (error) => {
    throw error;
  });

  page.on('console', (message) => {
    if (message.type() === 'error') {
      throw new Error(`Browser console error: ${message.text()}`);
    }
  });
}

