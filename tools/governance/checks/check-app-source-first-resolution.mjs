import path from 'node:path';

import { listWorkspacePackages, readJson, readText, walkFiles } from '../shared/workspace.mjs';
import { collectImports } from '../shared/imports.mjs';

const WORKSPACE_PACKAGE_MAP = new Map(
  listWorkspacePackages().map((entry) => [entry.packageName, entry.physicalPath])
);

const APPS = [
  {
    name: '@ww/docs',
    appRoot: 'apps/docs',
    configFile: 'apps/docs/.storybook/main.ts',
    configExpectations: [
      /from 'vite-tsconfig-paths'/,
      /from '\.\.\/\.\.\/\.\.\/vite\.aliases'/,
      /\btsconfigPaths\(\)/,
      /\bvue\(\)/,
      /resolve:\s*{\s*alias:\s*workspaceAliases\s*,?\s*}/s,
    ],
  },
  {
    name: '@ww/playground',
    appRoot: 'apps/playground',
    configFile: 'apps/playground/vite.config.ts',
    configExpectations: [
      /from '\.\.\/\.\.\/vite\.aliases'/,
      /plugins:\s*\[\s*vue\(\)\s*,\s*tsconfigPaths\(\)\s*]/,
      /resolve:\s*{\s*alias:\s*workspaceAliases\s*,?\s*}/s,
    ],
  },
  {
    name: '@ww/playground',
    appRoot: 'apps/playground',
    configFile: 'apps/playground/vitest.config.ts',
    configExpectations: [
      /from '\.\.\/\.\.\/vite\.aliases'/,
      /plugins:\s*\[\s*vue\(\)\s*,\s*tsconfigPaths\(\)\s*]/,
      /resolve:\s*{\s*alias:\s*workspaceAliases\s*,?\s*}/s,
    ],
  },
];

const IMPORT_AUDIT_FILES = [
  'apps/docs/.storybook/main.ts',
  'apps/docs/.storybook/preview.ts',
  'apps/playground/vite.config.ts',
  'apps/playground/vitest.config.ts',
];

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function getWorkspaceDependencySourceMap(appRoot) {
  const packageJson = readJson(`${appRoot}/package.json`);
  const dependencyNames = Object.keys(packageJson.dependencies ?? {}).filter((name) =>
    WORKSPACE_PACKAGE_MAP.has(name)
  );

  return Object.fromEntries(
    dependencyNames.map((packageName) => {
      const packagePath = WORKSPACE_PACKAGE_MAP.get(packageName);
      const relativeSourcePath = toPosixPath(
        path.posix.relative(appRoot, `${packagePath}/src/index.ts`)
      );
      return [packageName, [relativeSourcePath]];
    })
  );
}

function assertTsconfigUsesSourcePaths(appRoot) {
  const tsconfig = readJson(`${appRoot}/tsconfig.json`);
  const actualPaths = tsconfig.compilerOptions?.paths ?? {};
  const expectedPaths = getWorkspaceDependencySourceMap(appRoot);

  for (const [packageName, expectedValue] of Object.entries(expectedPaths)) {
    const actualValue = actualPaths[packageName];
    if (!actualValue) {
      throw new Error(
        `${appRoot}/tsconfig.json must map "${packageName}" to workspace source. Missing path entry.`
      );
    }

    if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
      throw new Error(
        `${appRoot}/tsconfig.json must map "${packageName}" to ${expectedValue[0]}, received ${JSON.stringify(actualValue)}.`
      );
    }
  }
}

function assertMaintainerScriptsStaySourceFirst() {
  const scripts = readJson('package.json').scripts ?? {};

  if (/@ww\/docs\^\.\.\./.test(scripts['dev:docs'] ?? '')) {
    throw new Error('package.json dev:docs must not prebuild workspace package dependencies.');
  }

  if (/@ww\/playground\^\.\.\./.test(scripts['dev:playground'] ?? '')) {
    throw new Error(
      'package.json dev:playground must not prebuild workspace package dependencies.'
    );
  }

  if (/@ww\/docs\^\.\.\./.test(scripts['test:e2e'] ?? '')) {
    throw new Error('package.json test:e2e must not prebuild workspace package dependencies.');
  }
}

function assertConfigUsesWorkspaceAliases(configFile, configExpectations) {
  const source = readText(configFile);

  for (const pattern of configExpectations) {
    if (!pattern.test(source)) {
      throw new Error(
        `${configFile} must preserve workspace source-first resolution. Missing pattern ${pattern}.`
      );
    }
  }
}

function assertNoWorkspaceDistImports(relativePath) {
  const imports = collectImports(relativePath);

  for (const specifier of imports) {
    if (/^@ww\/.+\/dist(?:\/|$)/.test(specifier)) {
      throw new Error(
        `${relativePath} must not import workspace dist artifacts. Offending import: "${specifier}".`
      );
    }

    if (/(?:^|\/)packages(?:\/third-party)?\/.+\/dist(?:\/|$)/.test(specifier)) {
      throw new Error(
        `${relativePath} must not import workspace dist artifacts. Offending import: "${specifier}".`
      );
    }
  }
}

for (const app of APPS) {
  assertConfigUsesWorkspaceAliases(app.configFile, app.configExpectations);
  assertTsconfigUsesSourcePaths(app.appRoot);
}

assertMaintainerScriptsStaySourceFirst();

for (const relativePath of [
  ...IMPORT_AUDIT_FILES,
  ...walkFiles('apps/docs/src', (relativePath) => /\.(ts|vue)$/.test(relativePath)),
  ...walkFiles('apps/playground/src', (relativePath) => /\.(ts|vue|mjs)$/.test(relativePath)),
]) {
  assertNoWorkspaceDistImports(relativePath);
}

console.log('App source-first resolution OK.');
