import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Alias } from 'vite';

const rootDir = path.dirname(fileURLToPath(new URL('./package.json', import.meta.url)));

export const workspaceAliases: Alias[] = [
  {
    find: /^@ww\/themes\/theme-light\.css$/,
    replacement: path.resolve(rootDir, 'packages/themes/src/theme-light.css'),
  },
  {
    find: /^@ww\/themes\/theme-dark\.css$/,
    replacement: path.resolve(rootDir, 'packages/themes/src/theme-dark.css'),
  },
  {
    find: /^@ww\/themes\/theme-belovodye\.css$/,
    replacement: path.resolve(rootDir, 'packages/themes/src/theme-belovodye.css'),
  },
  {
    find: /^@ww\/core\/styles\.css$/,
    replacement: path.resolve(rootDir, 'packages/core/src/styles/index.css'),
  },
  {
    find: /^@ww\/core\/motion\.css$/,
    replacement: path.resolve(rootDir, 'packages/core/src/styles/motion.css'),
  },
  {
    find: /^@ww\/charts-apex\/styles\.css$/,
    replacement: path.resolve(rootDir, 'packages/third-party/charts-apex/src/styles/index.css'),
  },
  {
    find: /^@ww\/tsparticles\/styles\.css$/,
    replacement: path.resolve(rootDir, 'packages/third-party/tsparticles/src/styles/index.css'),
  },
  {
    find: /^@ww\/signal-graph\/styles\.css$/,
    replacement: path.resolve(rootDir, 'packages/signal-graph/src/styles/index.css'),
  },
  {
    find: /^@ww\/data-grid\/styles\.css$/,
    replacement: path.resolve(rootDir, 'packages/data-grid/src/styles/index.css'),
  },
  {
    find: /^@ww\/interaction\/styles\.css$/,
    replacement: path.resolve(rootDir, 'packages/interaction/src/styles/index.css'),
  },
  {
    find: /^@ww\/widgets\/styles\.css$/,
    replacement: path.resolve(rootDir, 'packages/widgets/src/styles/index.css'),
  },
  {
    find: /^@ww\/page-templates\/styles\.css$/,
    replacement: path.resolve(rootDir, 'packages/page-templates/src/styles/index.css'),
  },
  {
    find: /^@ww\/tokens$/,
    replacement: path.resolve(rootDir, 'packages/tokens/src/index.ts'),
  },
  {
    find: /^@ww\/themes$/,
    replacement: path.resolve(rootDir, 'packages/themes/src/index.ts'),
  },
  {
    find: /^@ww\/primitives$/,
    replacement: path.resolve(rootDir, 'packages/primitives/src/index.ts'),
  },
  {
    find: /^@ww\/core$/,
    replacement: path.resolve(rootDir, 'packages/core/src/index.ts'),
  },
  {
    find: /^@ww\/charts-apex$/,
    replacement: path.resolve(rootDir, 'packages/third-party/charts-apex/src/index.ts'),
  },
  {
    find: /^@ww\/tsparticles$/,
    replacement: path.resolve(rootDir, 'packages/third-party/tsparticles/src/index.ts'),
  },
  {
    find: /^@ww\/signal-graph$/,
    replacement: path.resolve(rootDir, 'packages/signal-graph/src/index.ts'),
  },
  {
    find: /^@ww\/data-grid$/,
    replacement: path.resolve(rootDir, 'packages/data-grid/src/index.ts'),
  },
  {
    find: /^@ww\/interaction$/,
    replacement: path.resolve(rootDir, 'packages/interaction/src/index.ts'),
  },
  {
    find: /^@ww\/widgets$/,
    replacement: path.resolve(rootDir, 'packages/widgets/src/index.ts'),
  },
  {
    find: /^@ww\/page-templates$/,
    replacement: path.resolve(rootDir, 'packages/page-templates/src/index.ts'),
  },
];

export const workspaceRoot = rootDir;
