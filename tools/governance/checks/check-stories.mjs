import { getRequiredStoryVariants } from '../catalog/storybook-requirements.mjs';
import { PUBLIC_SURFACE_MANIFEST } from '../catalog/public-surface-manifest.mjs';
import { fileExists, readText } from '../shared/workspace.mjs';

for (const entry of PUBLIC_SURFACE_MANIFEST.filter((surface) => surface.requiresStorybook)) {
  const requiredVariants = getRequiredStoryVariants(entry);
  const actualVariants = new Set(entry.storyArtifacts.map((artifact) => artifact.variant));

  for (const requiredVariant of requiredVariants) {
    if (!actualVariants.has(requiredVariant)) {
      throw new Error(
        `Public surface "${entry.exportName}" is missing required Storybook variant "${requiredVariant}".`
      );
    }
  }

  for (const artifact of entry.storyArtifacts) {
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
}

console.log('Storybook coverage OK.');
