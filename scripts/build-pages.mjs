import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const rootDir = process.cwd();
const siteSourceDir = resolve(rootDir, 'site');
const docsSourceDir = resolve(rootDir, 'apps/docs/storybook-static');
const playgroundSourceDir = resolve(rootDir, 'apps/playground/dist');
const outputDir = resolve(rootDir, 'site-dist');

const copyDir = async (source, target) => {
  await cp(source, target, { recursive: true });
};

const ensureBuildInputs = async () => {
  await Promise.all([
    readFile(resolve(siteSourceDir, 'index.html'), 'utf8'),
    readFile(resolve(siteSourceDir, 'site.css'), 'utf8'),
    readFile(resolve(docsSourceDir, 'index.html'), 'utf8'),
    readFile(resolve(playgroundSourceDir, 'index.html'), 'utf8'),
  ]);
};

await ensureBuildInputs();
await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

await copyDir(siteSourceDir, outputDir);
await copyDir(docsSourceDir, resolve(outputDir, 'docs'));
await copyDir(playgroundSourceDir, resolve(outputDir, 'playground'));

const indexHtml = await readFile(resolve(siteSourceDir, 'index.html'), 'utf8');
const playgroundIndexHtml = await readFile(resolve(playgroundSourceDir, 'index.html'), 'utf8');
await writeFile(resolve(outputDir, '404.html'), indexHtml, 'utf8');
await writeFile(resolve(outputDir, 'playground', '404.html'), playgroundIndexHtml, 'utf8');
await writeFile(resolve(outputDir, '.nojekyll'), '', 'utf8');
