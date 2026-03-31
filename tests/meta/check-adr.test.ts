import { describe, expect, it } from 'vitest';

import {
  isArchitectureSensitiveFileChange,
  isDependencyOnlyPackageManifestChange,
} from '../../tools/governance/checks/check-adr.mjs';

describe('ADR governance check', () => {
  it('treats dependency-only package manifest bumps as ADR-exempt', () => {
    expect(
      isDependencyOnlyPackageManifestChange(
        {
          name: 'belovodye-uikit',
          private: true,
          devDependencies: {
            'typescript-eslint': '^8.57.2',
          },
        },
        {
          name: 'belovodye-uikit',
          private: true,
          devDependencies: {
            'typescript-eslint': '^8.58.0',
          },
        }
      )
    ).toBe(true);
  });

  it('keeps non-dependency package manifest changes architecture-sensitive', () => {
    expect(
      isDependencyOnlyPackageManifestChange(
        {
          name: 'belovodye-uikit',
          private: true,
          scripts: {
            verify: 'pnpm verify',
          },
        },
        {
          name: 'belovodye-uikit',
          private: true,
          scripts: {
            verify: 'pnpm verify --filter @ww/core',
          },
        }
      )
    ).toBe(false);
  });

  it('ignores dependency-only package manifest changes when detecting ADR-sensitive files', () => {
    expect(
      isArchitectureSensitiveFileChange('package.json', {
        loadPackageManifestPair: () => ({
          previousManifest: {
            name: 'belovodye-uikit',
            devDependencies: {
              'typescript-eslint': '^8.57.2',
            },
          },
          nextManifest: {
            name: 'belovodye-uikit',
            devDependencies: {
              'typescript-eslint': '^8.58.0',
            },
          },
        }),
      })
    ).toBe(false);
  });

  it('still treats governed docs paths as ADR-sensitive', () => {
    expect(isArchitectureSensitiveFileChange('docs/governance/ai-rules.md')).toBe(true);
  });
});
