import { STABILITY_LEVELS } from '../catalog/stability-rules.mjs';

export function createSurface(entry) {
  return Object.freeze({
    public: true,
    requiresStorybook: false,
    requiresDocs: false,
    requiresPlaygroundScenario: false,
    requiredStoryVariants: [],
    storyArtifacts: [],
    requiredDocsArtifacts: [],
    docsArtifacts: [],
    requiredTestLayers: ['unit'],
    playgroundScenarios: [],
    tags: [],
    ...entry
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
}

