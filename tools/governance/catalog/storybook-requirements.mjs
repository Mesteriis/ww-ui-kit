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

export function getRequiredStoryVariants(entry) {
  if (entry.requiredStoryVariants.length > 0) {
    return entry.requiredStoryVariants;
  }

  return STORY_VARIANTS_BY_KIND[entry.kind] ?? [];
}
