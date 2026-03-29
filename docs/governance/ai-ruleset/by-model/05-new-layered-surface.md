---
id: ai-model-new-layered-surface
title: Apply system, widget, and page-template placement discipline
apply: by model decision
instructions: use when adding a new system package, widget, page template, or composition surface above an existing system.
---
Use this rule when a reusable surface could land in more than one layer.

## Do

- Put feature-first engines such as data-grid or signal-graph in systems.
- Put black-box reusable business blocks above systems in widgets.
- Put reusable layout shells in page templates.
- Keep domain-specific wrappers, route pages, and backend orchestration in apps.

## Do not

- Do not put system engines into widgets because the UI looks opinionated.
- Do not put widget-level reusable blocks into apps only because a demo already exists there.
- Do not make page templates act like route pages.
- Do not duplicate system logic in a higher layer instead of composing it.

## Related repo sources of truth

- `docs/architecture/placement-rules.md`
- `packages/data-grid/README.md`
- `packages/widgets/README.md`
- `packages/page-templates/README.md`
