import { ALLOWED_LAYER_IMPORTS } from '../catalog/layer-rules.mjs';
import {
  PACKAGE_CLASSIFICATION,
  PACKAGE_CLASSIFICATION_MAP,
} from '../catalog/package-classification.mjs';
import { collectImports, listSourceFiles } from '../shared/imports.mjs';
import { readText } from '../shared/workspace.mjs';

function getPackageFromFile(relativePath) {
  return (
    PACKAGE_CLASSIFICATION.find((entry) => relativePath.startsWith(`${entry.physicalPath}/`)) ??
    null
  );
}

function getWorkspaceImport(specifier) {
  const workspacePackageName = Object.keys(PACKAGE_CLASSIFICATION_MAP).find(
    (packageName) => specifier === packageName
  );
  return workspacePackageName ? PACKAGE_CLASSIFICATION_MAP[workspacePackageName] : null;
}

const allowedVendorImports = new Map([
  ['apexcharts', '@ww/charts-apex'],
  ['vue3-apexcharts', '@ww/charts-apex'],
  ['@vue-flow/core', '@ww/signal-graph'],
  ['@vue-flow/background', '@ww/signal-graph'],
  ['@vue-flow/minimap', '@ww/signal-graph'],
  ['@vue-flow/controls', '@ww/signal-graph'],
]);

for (const relativePath of listSourceFiles()) {
  const currentPackage = getPackageFromFile(relativePath);
  if (!currentPackage) {
    continue;
  }

  const imports = collectImports(relativePath);
  for (const specifier of imports) {
    const importedPackage = getWorkspaceImport(specifier);
    if (importedPackage) {
      const allowedLayers = ALLOWED_LAYER_IMPORTS[currentPackage.packageLayer] ?? [];
      if (!allowedLayers.includes(importedPackage.packageLayer)) {
        throw new Error(
          `${relativePath}: ${currentPackage.packageName} (${currentPackage.packageLayer}) cannot import ${importedPackage.packageName} (${importedPackage.packageLayer}).`
        );
      }
    }

    const allowedVendorPackage = allowedVendorImports.get(specifier);
    if (allowedVendorPackage && currentPackage.packageName !== allowedVendorPackage) {
      throw new Error(
        `${relativePath}: vendor import "${specifier}" is only allowed inside ${allowedVendorPackage}.`
      );
    }
  }

  if (/\.(ts|vue|css)$/.test(relativePath) && !/\.test\.ts$/.test(relativePath)) {
    const source = readText(relativePath);
    const isPaletteRestrictedLayer =
      currentPackage.packageLayer === 'core' ||
      currentPackage.packageLayer === 'widget' ||
      currentPackage.packageLayer === 'page-template' ||
      currentPackage.packageLayer === 'system' ||
      currentPackage.packageLayer === 'third-party-adapter';

    if (isPaletteRestrictedLayer && /#[0-9a-fA-F]{3,8}\b/.test(source)) {
      throw new Error(`${relativePath}: raw hex colors are forbidden outside tokens/themes.`);
    }

    if (isPaletteRestrictedLayer && /cubic-bezier\(/.test(source)) {
      throw new Error(`${relativePath}: raw easing curves are forbidden outside tokens/themes.`);
    }

    if (
      isPaletteRestrictedLayer &&
      /(z-index\s*:\s*(?:[2-9]|[1-9][0-9]+)\b|zIndex\s*[:=]\s*(?:[2-9]|[1-9][0-9]+)\b)/.test(source)
    ) {
      throw new Error(
        `${relativePath}: raw z-index values above sanctioned local stacking are forbidden outside tokenized layer contracts.`
      );
    }

    if (
      isPaletteRestrictedLayer &&
      /--ui-(neutral|brand|success|warning|danger)-\d{2,3}/.test(source)
    ) {
      throw new Error(
        `${relativePath}: raw palette variables are forbidden outside tokens/themes.`
      );
    }
  }
}

console.log('Layer boundaries OK.');
