import { PUBLIC_SURFACE_MANIFEST } from '../catalog/public-surface-manifest.mjs';
import { PACKAGE_CLASSIFICATION_MAP } from '../catalog/package-classification.mjs';
import {
  buildGeneratedUsageModule,
  findPublicSurfaceForVisualSurface,
  getEligibleLabManifest,
  getVisualSurfaceManifest,
  listSchemaFiles,
} from '../playground-lab/shared.mjs';
import { fileExists, readText } from '../shared/workspace.mjs';

const publicSurfaceNames = new Set(PUBLIC_SURFACE_MANIFEST.map((entry) => entry.exportName));
const visualSurfaces = getVisualSurfaceManifest();
const eligibleEntries = getEligibleLabManifest();
const declaredSchemaFiles = new Set(listSchemaFiles());
const manifestSchemaFiles = new Set();

function getPackageIndexPath(packageName) {
  const packageMeta = PACKAGE_CLASSIFICATION_MAP[packageName];
  if (!packageMeta) {
    throw new Error(`Unknown package "${packageName}" in playground lab check.`);
  }

  return `${packageMeta.physicalPath}/src/index.ts`;
}

function exportExists(packageName, exportName) {
  const packageIndexPath = getPackageIndexPath(packageName);
  if (!fileExists(packageIndexPath)) {
    throw new Error(`Package index "${packageIndexPath}" does not exist.`);
  }

  const indexText = readText(packageIndexPath);
  return new RegExp(`\\b${exportName}\\b`).test(indexText);
}

for (const entry of visualSurfaces) {
  if (!publicSurfaceNames.has(entry.parentManifestExportName)) {
    throw new Error(
      `Visual surface "${entry.exportName}" references missing public surface "${entry.parentManifestExportName}".`
    );
  }

  findPublicSurfaceForVisualSurface(entry);

  if (!exportExists(entry.packageName, entry.exportName)) {
    throw new Error(
      `Visual surface "${entry.exportName}" is not exported from "${getPackageIndexPath(entry.packageName)}".`
    );
  }

  if (!entry.labEligible && !entry.labExemptionReason) {
    throw new Error(
      `Visual surface "${entry.exportName}" is not lab-eligible and must declare a rationale.`
    );
  }

  if (!entry.labEligible) {
    continue;
  }

  if (!entry.previewModes.includes('single') || !entry.previewModes.includes('matrix')) {
    throw new Error(
      `Lab surface "${entry.exportName}" must support both single and matrix preview modes.`
    );
  }

  if (entry.copyFormats.length === 0) {
    throw new Error(`Lab surface "${entry.exportName}" must declare at least one copy format.`);
  }

  for (const [kind, relativePath] of Object.entries(entry.runtimeFiles)) {
    if (!fileExists(relativePath)) {
      throw new Error(
        `Lab surface "${entry.exportName}" references missing ${kind} file "${relativePath}".`
      );
    }
  }

  manifestSchemaFiles.add(entry.runtimeFiles.schema);
}

for (const schemaFile of declaredSchemaFiles) {
  if (!manifestSchemaFiles.has(schemaFile)) {
    throw new Error(
      `Schema file "${schemaFile}" is not referenced by the playground lab manifest.`
    );
  }
}

const relativeGeneratedUsagePath =
  'apps/playground/src/lab/generated/playground-lab-usage.generated.ts';
if (!fileExists(relativeGeneratedUsagePath)) {
  throw new Error(
    `Generated playground lab usage file "${relativeGeneratedUsagePath}" is missing.`
  );
}

const expectedGeneratedModule = buildGeneratedUsageModule();
const actualGeneratedModule = readText(relativeGeneratedUsagePath);
if (expectedGeneratedModule !== actualGeneratedModule) {
  throw new Error(
    `Playground lab usage artifact is stale. Run "node ./tools/governance/playground-lab/build-playground-lab-artifacts.mjs".`
  );
}

const usageJson = actualGeneratedModule
  .replace(/^export const playgroundLabUsage = /, '')
  .replace(/;\s*$/, '');
const usageRecords = JSON.parse(usageJson).surfaces;
if (!usageRecords) {
  throw new Error(
    'Generated playground lab usage module did not export "playgroundLabUsage.surfaces".'
  );
}

for (const entry of eligibleEntries) {
  const usage = usageRecords[entry.id];
  if (!usage) {
    throw new Error(`Lab surface "${entry.exportName}" is missing generated usage data.`);
  }

  const hasUsageData =
    usage.knownUsages.length > 0 ||
    usage.relatedStorybook.length > 0 ||
    usage.relatedHarnesses.length > 0 ||
    usage.relatedDocs.length > 0;

  if (!hasUsageData) {
    throw new Error(
      `Lab surface "${entry.exportName}" has no downstream usage or related governance data.`
    );
  }
}

console.log(
  `Playground lab OK: ${visualSurfaces.length} visual surfaces audited, ${eligibleEntries.length} lab entries validated.`
);
