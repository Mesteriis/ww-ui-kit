import runtimeScenarios from './scenarios.json';

export interface PlaygroundScenario {
  id: string;
  label: string;
  hash: string;
  description: string;
}

const typedScenarios: readonly PlaygroundScenario[] = runtimeScenarios;

export const PLAYGROUND_SCENARIOS = Object.freeze(typedScenarios);
export const PLAYGROUND_SCENARIO_IDS = Object.freeze(
  PLAYGROUND_SCENARIOS.map((scenario) => scenario.id)
);
