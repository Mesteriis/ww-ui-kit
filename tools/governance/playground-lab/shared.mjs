import path from 'node:path';

import { PUBLIC_SURFACE_MANIFEST } from '../catalog/public-surface-manifest.mjs';
import {
  PLAYGROUND_LAB_MANIFEST,
  PLAYGROUND_VISUAL_SURFACE_MANIFEST,
} from '../catalog/playground-lab-manifest.mjs';
import { PLAYGROUND_SCENARIOS } from '../../../apps/playground/src/testing/scenarios.mjs';
import {
  PACKAGE_CLASSIFICATION,
  PACKAGE_CLASSIFICATION_MAP,
} from '../catalog/package-classification.mjs';
import { readText, resolveFromRoot, walkFiles } from '../shared/workspace.mjs';

const STORY_TITLE_PATTERN = /title:\s*['"`]([^'"`]+)['"`]/;
const NAMED_IMPORT_PATTERN =
  /import\s+(?:type\s+)?(?:[\w$]+\s*,\s*)?\{([\s\S]*?)\}\s+from\s+['"]([^'"`]+)['"]/g;

const packageRoots = PACKAGE_CLASSIFICATION.map((entry) => ({
  packageName: entry.packageName,
  packageLayer: entry.packageLayer,
  physicalPath: entry.physicalPath,
})).sort((left, right) => right.physicalPath.length - left.physicalPath.length);

const scenarioMap = new Map(PLAYGROUND_SCENARIOS.map((scenario) => [scenario.id, scenario]));
const publicSurfaceMap = new Map(PUBLIC_SURFACE_MANIFEST.map((entry) => [entry.exportName, entry]));

export function getVisualSurfaceManifest() {
  return PLAYGROUND_VISUAL_SURFACE_MANIFEST;
}

export function getEligibleLabManifest() {
  return PLAYGROUND_LAB_MANIFEST;
}

export function findPublicSurfaceForVisualSurface(entry) {
  const publicSurface = publicSurfaceMap.get(entry.parentManifestExportName);
  if (!publicSurface) {
    throw new Error(
      `Visual surface "${entry.exportName}" references missing public surface "${entry.parentManifestExportName}".`
    );
  }

  return publicSurface;
}

export function extractStoryTitle(relativePath) {
  const match = readText(relativePath).match(STORY_TITLE_PATTERN);
  if (!match) {
    throw new Error(`Story artifact "${relativePath}" is missing a title.`);
  }

  return match[1];
}

function normalizeImportName(rawName) {
  return rawName
    .replace(/\bas\b/g, ' as ')
    .split(' as ')[0]
    .trim();
}

export function collectNamedImports(relativePath) {
  const text = readText(relativePath);
  const imports = [];

  for (const match of text.matchAll(NAMED_IMPORT_PATTERN)) {
    const namedImports = match[1]
      .split(',')
      .map((part) => normalizeImportName(part))
      .filter(Boolean);
    imports.push({
      specifier: match[2],
      importedNames: namedImports,
    });
  }

  return imports;
}

export function listRenderableSourceFiles() {
  return walkFiles(
    '.',
    (relativePath) =>
      /^(apps\/[^/]+\/src|packages\/[^/]+\/src|packages\/third-party\/[^/]+\/src)\/.*\.(ts|vue)$/.test(
        relativePath
      ) && !/\.test\.ts$/.test(relativePath)
  );
}

export function classifyUsageOwner(relativePath) {
  const matchedPackage = packageRoots.find(
    (entry) =>
      relativePath === entry.physicalPath || relativePath.startsWith(`${entry.physicalPath}/`)
  );

  if (!matchedPackage) {
    return {
      owner: 'internal',
      layer: 'internal',
    };
  }

  return {
    owner: matchedPackage.packageName,
    layer: matchedPackage.packageLayer,
  };
}

export function classifyUsageArea(relativePath) {
  if (relativePath.startsWith('apps/docs/')) {
    return 'docs';
  }

  if (relativePath.startsWith('apps/playground/')) {
    return 'playground';
  }

  if (relativePath.startsWith('packages/widgets/')) {
    return 'widgets';
  }

  if (relativePath.startsWith('packages/page-templates/')) {
    return 'page-templates';
  }

  if (
    relativePath.startsWith('packages/data-grid/') ||
    relativePath.startsWith('packages/signal-graph/')
  ) {
    return 'systems';
  }

  if (relativePath.startsWith('packages/third-party/')) {
    return 'third-party';
  }

  if (relativePath.startsWith('packages/core/')) {
    return 'core';
  }

  return 'apps/internal';
}

function groupUsageFiles(files) {
  const grouped = new Map();

  for (const file of files) {
    const area = classifyUsageArea(file);
    if (!grouped.has(area)) {
      grouped.set(area, []);
    }
    grouped.get(area).push(file);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([area, areaFiles]) => ({
      area,
      count: areaFiles.length,
      files: areaFiles.slice(0, 10),
    }));
}

function collectImportUsageFiles(entry) {
  const files = [];

  for (const relativePath of listRenderableSourceFiles()) {
    const namedImports = collectNamedImports(relativePath);
    const hasMatch = namedImports.some(
      (candidate) =>
        candidate.specifier === entry.packageName &&
        candidate.importedNames.includes(entry.exportName)
    );

    if (hasMatch) {
      files.push(relativePath);
    }
  }

  return files;
}

function buildStoryReferences(publicSurface) {
  return publicSurface.storyArtifacts.map((artifact) => ({
    variant: artifact.variant,
    title: extractStoryTitle(artifact.file),
    file: artifact.file,
  }));
}

function buildHarnessReferences(publicSurface) {
  return publicSurface.playgroundScenarios.map((scenarioId) => {
    const scenario = scenarioMap.get(scenarioId);
    if (!scenario) {
      throw new Error(
        `Public surface "${publicSurface.exportName}" references missing playground scenario "${scenarioId}".`
      );
    }

    return {
      id: scenario.id,
      label: scenario.label,
      description: scenario.description,
      path: `/testing${scenario.hash}`,
    };
  });
}

function buildDownstreamConsumers(usageFiles, packageName) {
  const consumers = new Map();

  for (const relativePath of usageFiles) {
    const owner = classifyUsageOwner(relativePath);
    if (owner.owner === packageName) {
      continue;
    }

    if (!consumers.has(owner.owner)) {
      consumers.set(owner.owner, {
        packageName: owner.owner,
        packageLayer: owner.layer,
        files: [],
      });
    }

    consumers.get(owner.owner).files.push(relativePath);
  }

  return [...consumers.values()]
    .sort((left, right) => left.packageName.localeCompare(right.packageName))
    .map((consumer) => ({
      packageName: consumer.packageName,
      packageLayer: consumer.packageLayer,
      count: consumer.files.length,
      files: consumer.files.slice(0, 8),
    }));
}

export function generatePlaygroundLabUsage() {
  const visualSurfaceUsage = {};

  for (const entry of PLAYGROUND_VISUAL_SURFACE_MANIFEST) {
    const publicSurface = findPublicSurfaceForVisualSurface(entry);
    const usageFiles = collectImportUsageFiles(entry);
    const packageMeta = PACKAGE_CLASSIFICATION_MAP[entry.packageName];

    visualSurfaceUsage[entry.id] = {
      id: entry.id,
      title: entry.title,
      exportName: entry.exportName,
      packageName: entry.packageName,
      packageLayer: packageMeta.packageLayer,
      stability: packageMeta.stability,
      family: entry.family,
      labEligible: entry.labEligible,
      labExemptionReason: entry.labEligible ? undefined : entry.labExemptionReason,
      sourcePublicSurface: publicSurface.exportName,
      downstreamPackages: buildDownstreamConsumers(usageFiles, entry.packageName),
      usageGroups: groupUsageFiles(usageFiles),
      relatedStorybook: buildStoryReferences(publicSurface),
      relatedHarnesses: buildHarnessReferences(publicSurface),
      relatedDocs: publicSurface.docsArtifacts.map((artifact) => ({
        type: artifact.type,
        file: artifact.file,
      })),
      requiredTestLayers: publicSurface.requiredTestLayers,
      tags: publicSurface.tags,
      knownUsages: usageFiles.slice(0, 16).map((relativePath) => ({
        file: relativePath,
        area: classifyUsageArea(relativePath),
      })),
    };
  }

  return {
    generatedAt: 'generated-at-build',
    surfaces: visualSurfaceUsage,
  };
}

export function buildGeneratedUsageModule() {
  const usage = generatePlaygroundLabUsage();

  return `export const playgroundLabUsage = ${JSON.stringify(usage, null, 2)};\n`;
}

export function resolveGeneratedUsageFile() {
  return resolveFromRoot('apps/playground/src/lab/generated/playground-lab-usage.generated.ts');
}

export function listSchemaFiles() {
  return walkFiles('apps/playground/src/lab/schemas', (relativePath) =>
    relativePath.endsWith('.lab.ts')
  );
}

export function listPreviewFiles() {
  return walkFiles('apps/playground/src/lab/components', (relativePath) =>
    relativePath.endsWith('.vue')
  );
}

export function listRouteFiles() {
  return walkFiles('apps/playground/src/lab/routes', (relativePath) =>
    relativePath.endsWith('.vue')
  );
}

export function relativePackageRoot(packageName) {
  return (
    PACKAGE_CLASSIFICATION_MAP[packageName]?.physicalPath ??
    path.posix.join('packages', packageName)
  );
}
