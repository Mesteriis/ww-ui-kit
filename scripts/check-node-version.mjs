import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const expectedVersion = fs.readFileSync(path.join(rootDir, '.node-version'), 'utf8').trim();
const expectedMajor = Number.parseInt(expectedVersion.split('.')[0] ?? '', 10);
const actualVersion = process.versions.node;
const actualMajor = Number.parseInt(actualVersion.split('.')[0] ?? '', 10);

if (Number.isNaN(expectedMajor) || Number.isNaN(actualMajor)) {
  console.error(
    '[node-version] Unable to parse the expected or current Node.js version. Check .node-version and your local runtime.'
  );
  process.exit(1);
}

if (expectedMajor !== actualMajor) {
  console.error(
    [
      `[node-version] Expected Node.js ${expectedVersion}.x from .node-version, but found ${actualVersion}.`,
      '[node-version] Root repo workflows fail fast on unsupported runtimes because CI validates only Node 24.x.',
      '[node-version] Switch your local Node version, then rerun pnpm install.',
    ].join('\n')
  );
  process.exit(1);
}
