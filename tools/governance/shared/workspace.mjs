import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT_DIR = path.dirname(fileURLToPath(new URL('../../../package.json', import.meta.url)));

export const POSIX_SEPARATOR = '/';
const IGNORED_DIRECTORY_NAMES = new Set([
  '.git',
  '.turbo',
  '.idea',
  '.changeset',
  'coverage',
  'dist',
  'site-dist',
  'storybook-static',
  'node_modules'
]);

export function toPosixPath(filePath) {
  return filePath.split(path.sep).join(POSIX_SEPARATOR);
}

export function resolveFromRoot(...segments) {
  return path.resolve(ROOT_DIR, ...segments);
}

export function readText(relativePath) {
  return fs.readFileSync(resolveFromRoot(relativePath), 'utf8');
}

export function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

export function fileExists(relativePath) {
  return fs.existsSync(resolveFromRoot(relativePath));
}

export function directoryExists(relativePath) {
  const absolutePath = resolveFromRoot(relativePath);
  return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory();
}

export function walkFiles(relativeDirectory, predicate = () => true) {
  const absoluteDirectory = resolveFromRoot(relativeDirectory);
  if (!fs.existsSync(absoluteDirectory)) {
    return [];
  }

  const collectedFiles = [];
  const visit = (absolutePath) => {
    const stats = fs.lstatSync(absolutePath);
    if (stats.isSymbolicLink()) {
      return;
    }

    if (stats.isDirectory()) {
      for (const entry of fs.readdirSync(absolutePath)) {
        if (IGNORED_DIRECTORY_NAMES.has(entry)) {
          continue;
        }
        visit(path.join(absolutePath, entry));
      }
      return;
    }

    const relativePath = toPosixPath(path.relative(ROOT_DIR, absolutePath));
    if (predicate(relativePath)) {
      collectedFiles.push(relativePath);
    }
  };

  visit(absoluteDirectory);
  return collectedFiles.sort();
}

export function listWorkspacePackageJsonPaths() {
  return walkFiles('.', (relativePath) =>
    /^(apps\/[^/]+|packages\/[^/]+|packages\/third-party\/[^/]+)\/package\.json$/.test(relativePath)
  );
}

export function listWorkspacePackages() {
  return listWorkspacePackageJsonPaths().map((packageJsonPath) => {
    const packageJson = readJson(packageJsonPath);
    return {
      packageName: packageJson.name,
      physicalPath: path.posix.dirname(packageJsonPath),
      private: Boolean(packageJson.private)
    };
  });
}

export function relativePathFromAbsolute(absolutePath) {
  return toPosixPath(path.relative(ROOT_DIR, absolutePath));
}
