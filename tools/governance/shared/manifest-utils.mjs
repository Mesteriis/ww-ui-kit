import { STABILITY_LEVELS } from '../catalog/stability-rules.mjs';

export function createSurface(entry) {
  return Object.freeze({
    public: true,
    requiresStorybook: false,
    requiresDocs: false,
    requiresPlaygroundScenario: false,
    coveredExports: [],
    requiredStorybookInvariants: [],
    requiredStoryVariants: [],
    storyArtifacts: [],
    requiredDocsArtifacts: [],
    docsArtifacts: [],
    requiredTestLayers: ['unit'],
    playgroundScenarios: [],
    tags: [],
    ...entry,
  });
}

export function validateSurfaceShape(entry) {
  const requiredStringFields = ['packageName', 'packageLayer', 'exportName', 'kind', 'stability'];
  for (const field of requiredStringFields) {
    if (typeof entry[field] !== 'string' || entry[field].length === 0) {
      throw new Error(`Manifest entry is missing "${field}".`);
    }
  }

  if (!STABILITY_LEVELS.includes(entry.stability)) {
    throw new Error(
      `Manifest entry "${entry.exportName}" has invalid stability "${entry.stability}".`
    );
  }

  if (!Array.isArray(entry.coveredExports)) {
    throw new Error(`Manifest entry "${entry.exportName}" has invalid "coveredExports".`);
  }

  if (!Array.isArray(entry.requiredStorybookInvariants)) {
    throw new Error(
      `Manifest entry "${entry.exportName}" has invalid "requiredStorybookInvariants".`
    );
  }

  for (const artifact of entry.storyArtifacts) {
    if (artifact.covers !== undefined && !Array.isArray(artifact.covers)) {
      throw new Error(
        `Manifest entry "${entry.exportName}" has a story artifact with invalid "covers".`
      );
    }
  }
}
