export const STORY_VARIANTS_BY_KIND = Object.freeze({
  'core-component': ['overview', 'states', 'theming'],
  'overlay-component': ['overview', 'states', 'theming', 'interactions'],
  'theme-surface': ['overview', 'theming', 'scoped-theme'],
  'vendor-adapter': ['overview', 'states', 'theming', 'responsive'],
  'feature-package': ['overview', 'states', 'theming', 'interactions'],
  'widget-shell': ['overview', 'composition', 'theming'],
  'page-template-shell': ['overview', 'composition', 'theming'],
  'package-surface': ['overview'],
  primitive: ['overview'],
  'helper-api': [],
});

export const STORYBOOK_INVARIANT_IDS = Object.freeze([
  'overview',
  'states',
  'theming',
  'scoped-theme',
  'composition',
  'interactions',
  'responsive',
  'accessibility',
  'keyboard',
  'focus',
  'reduced-motion',
  'overlay-runtime',
  'theme-type',
]);

export const STORYBOOK_INVARIANTS_BY_VARIANT = Object.freeze({
  overview: ['overview'],
  states: ['states'],
  theming: ['theming'],
  'scoped-theme': ['scoped-theme'],
  composition: ['composition'],
  interactions: ['interactions'],
  responsive: ['responsive'],
  accessibility: ['accessibility'],
  keyboard: ['keyboard'],
  focus: ['focus'],
  'reduced-motion': ['reduced-motion'],
  'overlay-runtime': ['overlay-runtime'],
  'theme-type': ['theme-type'],
});

export const VISUAL_SURFACE_KINDS = Object.freeze([
  'core-component',
  'overlay-component',
  'theme-surface',
  'vendor-adapter',
  'feature-package',
  'widget-shell',
  'page-template-shell',
  'primitive',
]);

export function getRequiredStoryVariants(entry) {
  if (entry.requiredStoryVariants.length > 0) {
    return entry.requiredStoryVariants;
  }

  return STORY_VARIANTS_BY_KIND[entry.kind] ?? [];
}

export function kindRequiresStorybook(kind) {
  return VISUAL_SURFACE_KINDS.includes(kind);
}

export function getRequiredStorybookInvariants(entry) {
  return [...new Set([...getRequiredStoryVariants(entry), ...entry.requiredStorybookInvariants])];
}

export function getStoryArtifactInvariantCoverage(artifact) {
  return [
    ...new Set([
      ...(STORYBOOK_INVARIANTS_BY_VARIANT[artifact.variant] ?? []),
      ...(artifact.covers ?? []),
    ]),
  ];
}
