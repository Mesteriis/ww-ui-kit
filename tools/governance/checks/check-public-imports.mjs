import { collectImports, listSourceFiles } from '../shared/imports.mjs';

const disallowedPatterns = [
  {
    pattern: /^@ww\/.+\/src\//,
    message: 'Do not deep import package source files. Use official package exports.',
  },
  {
    pattern: /^@ww\/primitives\/(motion|overlay)$/,
    message: 'Do not rely on non-exported @ww/primitives subpaths. Import from @ww/primitives.',
  },
];

for (const relativePath of listSourceFiles()) {
  const imports = collectImports(relativePath);
  for (const specifier of imports) {
    const violation = disallowedPatterns.find(({ pattern }) => pattern.test(specifier));
    if (violation) {
      throw new Error(`${relativePath}: ${violation.message} Offending import: "${specifier}".`);
    }
  }
}

console.log('Public import hygiene OK.');
