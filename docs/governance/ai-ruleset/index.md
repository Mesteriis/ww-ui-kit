# AI Ruleset Index

Canonical machine-oriented index for the repository AI rules pack.

Canonical source of truth: [`docs/governance/ai-ruleset/`](./README.md)

Apply modes:

- `always`
- `by model decision`
- `by file patterns`
- `manually`

## Always rules

Apply mode: `always`

| id | title | file |
| --- | --- | --- |
| ai-always-layer-placement | Preserve canonical layer order and placement discipline | [always/00-layer-placement.md](./always/00-layer-placement.md) |
| ai-always-public-api-discipline | Treat export maps and the public surface manifest as governed API | [always/01-public-api-discipline.md](./always/01-public-api-discipline.md) |
| ai-always-visual-runtime-contracts | Keep visual tokens, theme axes, motion, overlays, and z-index inside sanctioned contracts | [always/02-visual-runtime-contracts.md](./always/02-visual-runtime-contracts.md) |
| ai-always-proof-sync | Synchronize stories, docs, playground proofs, tests, ADRs, and changesets with public changes | [always/03-proof-sync.md](./always/03-proof-sync.md) |
| ai-always-reuse-boundaries | Keep reusable packages free of route, backend, and product orchestration | [always/04-reuse-boundaries.md](./always/04-reuse-boundaries.md) |
| ai-always-accessibility-contracts | Treat accessibility contracts as structural UI behavior | [always/05-accessibility-contracts.md](./always/05-accessibility-contracts.md) |

## By-model rules

Apply mode: `by model decision`

| id | title | file |
| --- | --- | --- |
| ai-model-architecture-sensitive-changes | Apply architecture-sensitive change discipline | [by-model/00-architecture-sensitive-changes.md](./by-model/00-architecture-sensitive-changes.md) |
| ai-model-public-api-changes | Apply public API and export-map change discipline | [by-model/01-public-api-changes.md](./by-model/01-public-api-changes.md) |
| ai-model-new-package-or-topology | Apply package creation and topology change discipline | [by-model/02-new-package-or-topology.md](./by-model/02-new-package-or-topology.md) |
| ai-model-testing-and-docs-contract | Apply docs-as-contract and test contour discipline | [by-model/03-testing-and-docs-contract.md](./by-model/03-testing-and-docs-contract.md) |
| ai-model-release-and-stability | Apply stability status and changeset discipline | [by-model/04-release-and-stability.md](./by-model/04-release-and-stability.md) |
| ai-model-new-layered-surface | Apply system, widget, and page-template placement discipline | [by-model/05-new-layered-surface.md](./by-model/05-new-layered-surface.md) |
| ai-model-css-architecture | Apply CSS architecture and token discipline | [by-model/06-css-architecture.md](./by-model/06-css-architecture.md) |

## By-path rules

Apply mode: `by file patterns`

| id | title | file |
| --- | --- | --- |
| ai-path-packages-tokens | packages/tokens path rules | [by-path/packages-tokens.md](./by-path/packages-tokens.md) |
| ai-path-packages-themes | packages/themes path rules | [by-path/packages-themes.md](./by-path/packages-themes.md) |
| ai-path-packages-primitives | packages/primitives path rules | [by-path/packages-primitives.md](./by-path/packages-primitives.md) |
| ai-path-packages-core | packages/core path rules | [by-path/packages-core.md](./by-path/packages-core.md) |
| ai-path-packages-data-grid | packages/data-grid path rules | [by-path/packages-data-grid.md](./by-path/packages-data-grid.md) |
| ai-path-packages-signal-graph | packages/signal-graph path rules | [by-path/packages-signal-graph.md](./by-path/packages-signal-graph.md) |
| ai-path-packages-widgets | packages/widgets path rules | [by-path/packages-widgets.md](./by-path/packages-widgets.md) |
| ai-path-packages-page-templates | packages/page-templates path rules | [by-path/packages-page-templates.md](./by-path/packages-page-templates.md) |
| ai-path-packages-third-party | packages/third-party path rules | [by-path/packages-third-party.md](./by-path/packages-third-party.md) |
| ai-path-apps-docs | apps/docs path rules | [by-path/apps-docs.md](./by-path/apps-docs.md) |
| ai-path-apps-playground | apps/playground path rules | [by-path/apps-playground.md](./by-path/apps-playground.md) |
| ai-path-docs-decisions | docs/decisions path rules | [by-path/docs-decisions.md](./by-path/docs-decisions.md) |
| ai-path-docs-architecture | docs/architecture path rules | [by-path/docs-architecture.md](./by-path/docs-architecture.md) |
| ai-path-tools-governance | tools/governance path rules | [by-path/tools-governance.md](./by-path/tools-governance.md) |
| ai-path-scripts | scripts path rules | [by-path/scripts.md](./by-path/scripts.md) |
| ai-path-github-workflows | .github/workflows path rules | [by-path/github-workflows.md](./by-path/github-workflows.md) |
| ai-path-root-config | root config path rules | [by-path/root-config.md](./by-path/root-config.md) |

## Manual rules

Apply mode: `manually`

| id | title | file |
| --- | --- | --- |
| ai-manual-release-maintainer | Release maintainer workflow | [manual/release-maintainer.md](./manual/release-maintainer.md) |
| ai-manual-adr-migration | ADR migration and historical normalization | [manual/adr-migration.md](./manual/adr-migration.md) |
| ai-manual-package-topology-audit | Package topology audit and reshuffle | [manual/package-topology-audit.md](./manual/package-topology-audit.md) |
| ai-manual-playground-lab-maintenance | Playground lab taxonomy and schema maintenance | [manual/playground-lab-maintenance.md](./manual/playground-lab-maintenance.md) |
| ai-manual-rule-pack-maintenance | AI rule pack maintenance | [manual/rule-pack-maintenance.md](./manual/rule-pack-maintenance.md) |
