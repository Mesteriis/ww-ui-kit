import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { buildGeneratedUsageModule, resolveGeneratedUsageFile } from './shared.mjs';

const outputFile = resolveGeneratedUsageFile();

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, buildGeneratedUsageModule(), 'utf8');

console.log(`Playground lab artifacts updated: ${outputFile}`);
