import { PUBLIC_SURFACE_MANIFEST } from '../catalog/public-surface-manifest.mjs';
import { getRequiredPlaygroundScenarios } from '../catalog/playground-requirements.mjs';
import { PLAYGROUND_SCENARIOS } from '../../../apps/playground/src/testing/scenarios.mjs';
import { readText, walkFiles } from '../shared/workspace.mjs';

const scenarioMap = new Map(PLAYGROUND_SCENARIOS.map((scenario) => [scenario.id, scenario]));
const playgroundSource = walkFiles('apps/playground/src', (relativePath) =>
  /\.vue$/.test(relativePath)
)
  .map((relativePath) => readText(relativePath))
  .join('\n');

for (const entry of PUBLIC_SURFACE_MANIFEST.filter(
  (surface) => surface.requiresPlaygroundScenario
)) {
  const requiredScenarios = getRequiredPlaygroundScenarios(entry);
  for (const scenarioId of requiredScenarios) {
    if (!scenarioMap.has(scenarioId)) {
      throw new Error(
        `Public surface "${entry.exportName}" requires missing playground scenario "${scenarioId}".`
      );
    }

    if (!playgroundSource.includes(`data-playground-scenario="${scenarioId}"`)) {
      throw new Error(
        `Playground scenario "${scenarioId}" is declared but not mounted in apps/playground/src/*.vue.`
      );
    }
  }
}

console.log('Playground coverage OK.');
