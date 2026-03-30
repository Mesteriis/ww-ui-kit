import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import prettier from 'prettier';

import { createThemeSheet, THEME_NAMES, themeRegistry } from '../dist/index.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(scriptDir, '../src');

mkdirSync(srcDir, { recursive: true });

for (const themeName of THEME_NAMES) {
  const outputPath = path.resolve(srcDir, `theme-${themeName}.css`);
  const css = createThemeSheet(themeName, themeRegistry[themeName]);
  const prettierOptions = (await prettier.resolveConfig(outputPath)) ?? {};
  const formattedCss = await prettier.format(css, {
    ...prettierOptions,
    filepath: outputPath,
  });

  writeFileSync(outputPath, formattedCss, 'utf8');
}
