import { walkFiles, readText } from './workspace.mjs';

const IMPORT_PATTERN =
  /(?:import|export)\s+(?:type\s+)?(?:[^'"`]*?\sfrom\s+)?['"]([^'"`]+)['"]|import\(\s*['"]([^'"`]+)['"]\s*\)/g;

export function listSourceFiles() {
  return walkFiles(
    '.',
    (relativePath) =>
      /^(apps\/[^/]+\/src|packages\/[^/]+\/src|packages\/third-party\/[^/]+\/src)\/.*\.(ts|vue|css)$/.test(
        relativePath
      ) && !/\.test\.ts$/.test(relativePath)
  );
}

export function collectImports(relativePath) {
  const text = readText(relativePath);
  const imports = [];

  for (const match of text.matchAll(IMPORT_PATTERN)) {
    const specifier = match[1] ?? match[2];
    if (specifier) {
      imports.push(specifier);
    }
  }

  return imports;
}

export function collectFilesWithText(pattern) {
  return listSourceFiles().filter((relativePath) => pattern.test(readText(relativePath)));
}
