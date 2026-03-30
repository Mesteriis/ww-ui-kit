import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

interface AxeCheckOptions {
  exclude?: string | readonly string[];
  include?: string | readonly string[];
  disabledRules?: string | readonly string[];
}

const AXE_RUNNING_RETRY_LIMIT = 5;

function toArray(value?: string | readonly string[]) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? [...value] : [value];
}

export async function expectNoAxeViolations(page: Page, options: AxeCheckOptions = {}) {
  const analyze = async () => {
    let builder = new AxeBuilder({ page });

    for (const selector of toArray(options.include)) {
      builder = builder.include(selector);
    }

    for (const selector of toArray(options.exclude)) {
      builder = builder.exclude(selector);
    }

    const disabledRules = toArray(options.disabledRules);
    if (disabledRules.length > 0) {
      builder = builder.disableRules(disabledRules);
    }

    return builder.analyze();
  };

  let lastError: Error | undefined;
  for (let attempt = 0; attempt < AXE_RUNNING_RETRY_LIMIT; attempt += 1) {
    try {
      const { violations } = await analyze();
      const formattedViolations = violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => node.target.join(' ')),
        help: violation.help,
      }));

      expect(formattedViolations, JSON.stringify(formattedViolations, null, 2)).toEqual([]);
      return;
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes('Axe is already running')) {
        throw error;
      }

      lastError = error;
      await page.waitForTimeout(100 * (attempt + 1));
    }
  }

  throw lastError ?? new Error('Axe analysis did not complete.');
}
