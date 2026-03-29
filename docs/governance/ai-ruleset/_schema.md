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
