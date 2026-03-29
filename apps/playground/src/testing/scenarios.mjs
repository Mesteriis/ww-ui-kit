import scenarios from './scenarios.json' with { type: 'json' };

export const PLAYGROUND_SCENARIOS = Object.freeze(scenarios);

export const PLAYGROUND_SCENARIO_IDS = Object.freeze(PLAYGROUND_SCENARIOS.map((scenario) => scenario.id));
