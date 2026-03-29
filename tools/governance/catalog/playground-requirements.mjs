export const PLAYGROUND_SCENARIO_IDS = Object.freeze([
  'themes',
  'overlays',
  'charts',
  'signal-graph',
  'data-grid-basic',
  'data-grid-states',
  'data-grid-theming',
  'data-grid-selection',
  'data-grid-composition',
  'widgets',
  'page-templates',
  'composition'
]);

export function getRequiredPlaygroundScenarios(entry) {
  return entry.playgroundScenarios;
}
