export const STABILITY_LEVELS = ['stable', 'incubating', 'experimental', 'internal'];

export const STABILITY_DESCRIPTIONS = Object.freeze({
  stable:
    'Public and intentionally supported. Changes require tests, docs, and semver honesty.',
  incubating:
    'Public and reusable, but still settling. Contracts can evolve with explicit docs and changesets.',
  experimental:
    'Public for evaluation and proof flows. Behavior is real, but contract churn is still expected.',
  internal:
    'Not part of the supported consumer surface. Internal-only tooling or app scaffolding.'
});

