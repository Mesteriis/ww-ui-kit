import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { PACKAGE_CLASSIFICATION } from '../catalog/package-classification.mjs';
import {
  getRequiredStorybookInvariants,
  getRequiredStoryVariants,
  getStoryArtifactInvariantCoverage,
  kindRequiresStorybook,
  STORYBOOK_INVARIANT_IDS,
} from '../catalog/storybook-requirements.mjs';
import { PUBLIC_SURFACE_MANIFEST } from '../catalog/public-surface-manifest.mjs';
import {
  collectNamedRuntimeExports,
  isLikelyVisualRuntimeExport,
  splitManifestExportName,
} from '../shared/public-exports.mjs';
import { fileExists, readText } from '../shared/workspace.mjs';

const STORY_SOURCE_ROOT = 'apps/docs/src/stories';

const collectStorySourceFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const nextPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectStorySourceFiles(nextPath);
    }

    if (nextPath.endsWith('.ts') || nextPath.endsWith('.vue')) {
      return [nextPath];
    }

    return [];
  });

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isDirectStoryReferenceExport = (exportName) => /^(Ui[A-Z]|Primitive[A-Z])/.test(exportName);

const storySourceFiles = collectStorySourceFiles(STORY_SOURCE_ROOT);
const storySourceCorpus = storySourceFiles.map((file) => readText(file)).join('\n');

const hasDirectStoryReference = (exportName) => {
  const escaped = escapeRegex(exportName);
  return [
    new RegExp(`<${escaped}(?=[\\s>])`),
    new RegExp(`\\b${escaped}\\b\\s*(?:,|}|\\)|:)`),
    new RegExp(`import[^\\n]*\\b${escaped}\\b`),
    new RegExp(`components\\s*:\\s*{[^}]*\\b${escaped}\\b`, 's'),
    new RegExp(`name:\\s*['"]${escaped}['"]`),
  ].some((pattern) => pattern.test(storySourceCorpus));
};

const storybookSurfaceByExport = new Map();
for (const entry of PUBLIC_SURFACE_MANIFEST) {
  for (const exportName of splitManifestExportName(entry.exportName)) {
    storybookSurfaceByExport.set(exportName, entry);
  }

  for (const exportName of entry.coveredExports ?? []) {
    storybookSurfaceByExport.set(exportName, entry);
  }
}

for (const entry of PUBLIC_SURFACE_MANIFEST) {
  if (kindRequiresStorybook(entry.kind) && !entry.requiresStorybook) {
    throw new Error(`Public visual surface "${entry.exportName}" must declare Storybook coverage.`);
  }
}

for (const packageEntry of PACKAGE_CLASSIFICATION.filter((entry) => entry.public)) {
  const runtimeExports = collectNamedRuntimeExports(
    `${packageEntry.physicalPath}/src/index.ts`
  ).filter(isLikelyVisualRuntimeExport);

  for (const exportName of runtimeExports) {
    const surface = storybookSurfaceByExport.get(exportName);
    if (!surface?.requiresStorybook) {
      throw new Error(
        `Public visual export "${exportName}" from "${packageEntry.packageName}" must resolve to a manifest surface with Storybook coverage.`
      );
    }
  }
}

for (const entry of PUBLIC_SURFACE_MANIFEST.filter((surface) => surface.requiresStorybook)) {
  const requiredVariants = getRequiredStoryVariants(entry);
  const requiredInvariants = getRequiredStorybookInvariants(entry);
  const actualVariants = new Set(entry.storyArtifacts.map((artifact) => artifact.variant));
  const actualInvariants = new Set();

  if (entry.storyArtifacts.length === 0) {
    throw new Error(
      `Public surface "${entry.exportName}" requires Storybook but has no artifacts.`
    );
  }

  for (const requiredVariant of requiredVariants) {
    if (!actualVariants.has(requiredVariant)) {
      throw new Error(
        `Public surface "${entry.exportName}" is missing required Storybook variant "${requiredVariant}".`
      );
    }
  }

  for (const invariantId of requiredInvariants) {
    if (!STORYBOOK_INVARIANT_IDS.includes(invariantId)) {
      throw new Error(
        `Public surface "${entry.exportName}" declares unknown required Storybook invariant "${invariantId}".`
      );
    }
  }

  for (const artifact of entry.storyArtifacts) {
    for (const invariantId of getStoryArtifactInvariantCoverage(artifact)) {
      if (!STORYBOOK_INVARIANT_IDS.includes(invariantId)) {
        throw new Error(
          `Story artifact "${artifact.file}" for "${entry.exportName}" declares unknown invariant "${invariantId}".`
        );
      }

      actualInvariants.add(invariantId);
    }

    if (!fileExists(artifact.file)) {
      throw new Error(
        `Story artifact "${artifact.file}" for "${entry.exportName}" does not exist.`
      );
    }

    if (!/title:\s*['"`]/.test(readText(artifact.file))) {
      throw new Error(
        `Story artifact "${artifact.file}" for "${entry.exportName}" is missing a Storybook title.`
      );
    }
  }

  for (const requiredInvariant of requiredInvariants) {
    if (!actualInvariants.has(requiredInvariant)) {
      throw new Error(
        `Public surface "${entry.exportName}" is missing required Storybook invariant "${requiredInvariant}".`
      );
    }
  }

  for (const exportName of splitManifestExportName(entry.exportName)) {
    if (!isDirectStoryReferenceExport(exportName)) {
      continue;
    }

    if (!hasDirectStoryReference(exportName)) {
      throw new Error(
        `Public Storybook export "${exportName}" is not referenced directly by any Storybook story or harness source.`
      );
    }
  }
}

console.log('Storybook coverage OK.');
