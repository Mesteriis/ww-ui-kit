# AI Ruleset Frontmatter Schema

Allowed apply modes:

- `always`
- `by model decision`
- `by file patterns`
- `manually`

Required frontmatter keys for every rule:

- `id`
- `title`
- `apply`

Conditional frontmatter keys:

- `summary`
  required for rules mirrored into the always baseline summary
- `instructions`
  required only for `by model decision`
- `patterns`
  required only for `by file patterns`
  may be a single string or an array of strings

Supported glob syntax for `patterns`:

- `*`
- `**`
- `?`

Rejected glob syntax:

- `{` and `}`
- `[` and `]`
- `!`

`pnpm check:ai-rules` rejects unsupported glob syntax instead of interpreting it loosely.

Examples:

```md
---
id: ai-always-example
title: Example always rule
apply: always
summary: Keep the baseline short and operational.
---
```

```md
---
id: ai-model-example
title: Example decision rule
apply: by model decision
instructions: use when changing package topology or public governance.
---
```

```md
---
id: ai-path-example
title: Example path rule
apply: by file patterns
patterns: packages/core/**/*
---
```

```md
---
id: ai-path-example-array
title: Example path rule with array patterns
apply: by file patterns
patterns:
  - package.json
  - *.config.*
  - tsconfig*.json
---
```

```md
---
id: ai-manual-example
title: Example manual rule
apply: manually
---
```

Body shape:

- one short scope line
- `## Do`
- `## Do not`
- optional `## Update together with`
- optional `## Related repo sources of truth`

Manifest-only metadata in `tools/governance/ai-rules/rule-manifest.mjs`:

- `mirroredInSummary`
  boolean; controls whether an always rule appears in the generated overview and thin mirrors
- `relatedDocs`
  optional array of repo-relative paths that must exist
- `layerTags`
  optional array; allowed values:
  `tokens`, `themes`, `primitives`, `core`, `system`, `widget`, `page-template`, `app`, `third-party-adapter`
- `packageTags`
  optional array; allowed values:
  `@ww/core`, `@ww/data-grid`, `@ww/docs`, `@ww/page-templates`, `@ww/playground`, `@ww/primitives`, `@ww/signal-graph`, `@ww/themes`, `@ww/tokens`, `@ww/widgets`
- `areaTags`
  optional array; allowed values:
  `accessibility`, `adr`, `ai-rules`, `architecture`, `architecture-docs`, `audit`, `automation`, `boundaries`, `build`, `catalog`, `changesets`, `ci`, `core`, `css`, `data-grid`, `decisions`, `docs`, `docs-app`, `exports`, `focus`, `github`, `governance`, `keyboard`, `lab`, `maintainer`, `maintenance`, `migration`, `motion`, `overlay`, `packages`, `page-templates`, `placement`, `playground`, `primitives`, `public-api`, `release`, `reuse`, `root-config`, `scripts`, `signal-graph`, `stability`, `storybook`, `styles`, `systems`, `testing`, `themes`, `third-party`, `tokens`, `tooling`, `topology`, `widgets`, `workflows`
