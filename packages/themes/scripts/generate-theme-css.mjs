import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createThemeSheet, THEME_NAMES, themeRegistry } from '../dist/index.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(scriptDir, '../src');

mkdirSync(srcDir, { recursive: true });

for (const themeName of THEME_NAMES) {
  writeFileSync(
    path.resolve(srcDir, `theme-${themeName}.css`),
    createThemeSheet(themeName, themeRegistry[themeName]),
    'utf8'
  );
}
