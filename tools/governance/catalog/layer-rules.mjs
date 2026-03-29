export const PACKAGE_LAYERS = [
  'tokens',
  'themes',
  'primitives',
  'core',
  'system',
  'widget',
  'page-template',
  'app',
  'tooling',
  'third-party-adapter'
];

export const LAYER_ORDER = Object.freeze([
  'tokens',
  'themes',
  'primitives',
  'core',
  'system',
  'widget',
  'page-template',
  'app'
]);

export const ALLOWED_LAYER_IMPORTS = Object.freeze({
  tokens: [],
  themes: ['tokens'],
  primitives: ['tokens', 'themes'],
  core: ['tokens', 'themes', 'primitives'],
  system: ['tokens', 'themes', 'primitives', 'core'],
  'third-party-adapter': ['tokens', 'themes', 'primitives', 'core'],
  widget: ['tokens', 'themes', 'primitives', 'core', 'system', 'third-party-adapter'],
  'page-template': [
    'tokens',
    'themes',
    'primitives',
    'core',
    'system',
    'third-party-adapter',
    'widget'
  ],
  app: [
    'tokens',
    'themes',
    'primitives',
    'core',
    'system',
    'third-party-adapter',
    'widget',
    'page-template'
  ],
  tooling: PACKAGE_LAYERS
});

export const FORBIDDEN_PATTERNS = Object.freeze([
  '@ww/core importing systems/widgets/page-templates/apps',
  'widgets importing apps',
  'page-templates importing apps',
  'apps deep-importing packages/*/src/**',
  'vendor adapters leaking through @ww/core',
  'raw palette values outside tokens/themes',
  'raw easing curves outside tokens/themes',
  'raw z-index hacks outside sanctioned local-layer contexts',
  'public exports added without catalog/docs/tests coverage updates'
]);

export const ARCHITECTURE_SENSITIVE_PATH_PATTERNS = Object.freeze([
  /^package\.json$/,
  /^pnpm-workspace\.ya?ml$/,
  /^tsconfig\.json$/,
  /^vite\.aliases\.ts$/,
  /^packages\/[^/]+\/package\.json$/,
  /^packages\/third-party\/[^/]+\/package\.json$/,
  /^packages\/[^/]+\/src\/index\.ts$/,
  /^packages\/third-party\/[^/]+\/src\/index\.ts$/,
  /^packages\/[^/]+\/README\.md$/,
  /^packages\/third-party\/[^/]+\/README\.md$/,
  /^docs\/architecture\//,
  /^docs\/governance\//,
  /^docs\/decisions\//,
  /^tools\/governance\//,
  /^\.github\/workflows\//,
  /^\.github\/copilot-instructions\.md$/,
  /^AGENTS\.md$/,
  /^README\.md$/,
  /^CONTRIBUTING\.md$/
]);

