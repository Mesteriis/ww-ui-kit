---
id: ADR-0024
title: Core Layout Utility Surfaces
status: accepted
date: 2026-04-03
owners:
  - platform
tags:
  - components
  - governance
  - layout
  - public-api
relatedPackages:
  - @ww/core
  - @ww/page-templates
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0024 Core Layout Utility Surfaces

## Context

The repository already separates shell-level layout from baseline reusable components. `@ww/page-templates` owns generic shells such as `UiLayout`, `UiVerticalLayout`, and `UiHorizontalLayout`, while `@ww/core` owns reusable controls, display surfaces, and low-level composition helpers.

Consumers still need a governed baseline for smaller layout concerns inside cards, forms, status sections, and action rows:

- token-driven flex alignment without inline ad hoc CSS
- responsive utility grids for cards and metadata blocks
- explicit spacing and compact grouping between adjacent controls

Leaving those needs to local wrappers would weaken Storybook, playground, and manifest governance. Reusing page-template shells for these cases would also blur the boundary between utility layout and app-shell ownership.

## Decision

Add `UiFlex`, `UiGrid`, and `UiSpace` as governed `@ww/core` public layout-utility surfaces.

- `UiFlex` is the thin flexbox utility for direction, wrap, justify, align, gap, and inline/block framing.
- `UiGrid` is the utility grid surface for token-driven gutters and responsive item spans through the governed `items` model.
- `UiSpace` is the spacing and compact-grouping wrapper for inline or stacked children, optional separators, and control seams.
- All three reuse sanctioned spacing tokens and theme breakpoints instead of introducing new shell contracts, raw layout constants, or app-specific wrappers.
- Shell framing, route-aware structure, and page composition stay in `@ww/page-templates`; these utilities must not grow into app-shell replacements.
- Public-surface governance for the family is mandatory in the same change: exports, manifests, Storybook, themed proofs, playground harness coverage, docs, tests, and release metadata.

## Consequences

- Consumers get explicit, documented layout utilities for real composition work inside existing reusable surfaces.
- The core layer gains smaller-scale layout helpers without weakening the boundary that keeps shell framing in `@ww/page-templates`.
- Future needs such as affix, scroll regions, or anchor navigation remain separate scope and must justify their own contracts instead of overloading this utility family.

## Alternatives

- Keeping layout utilities as app-local markup would fragment spacing, responsive spans, and compact control seams across stories and consumer code.
- Reusing page-template shell primitives for card-level layout would collapse the boundary between structural shells and local utility composition.
- Adding raw CSS utility classes as the public contract would bypass typed props, Storybook proof, and manifest governance.

## Migration / Rollout

- Export `UiFlex`, `UiGrid`, and `UiSpace` from `@ww/core`.
- Register the family in the public surface manifest and the playground lab manifest.
- Add canonical stories, themed proofs, playground harness usage, docs, tests, and a changeset in the same delivery.
- Keep `@ww/page-templates` shell contracts unchanged; utility layout remains opt-in and scoped to smaller reusable surfaces.

## Related artifacts

- [`packages/core/src/components/layout/UiFlex.vue`](../../packages/core/src/components/layout/UiFlex.vue)
- [`packages/core/src/components/layout/UiGrid.vue`](../../packages/core/src/components/layout/UiGrid.vue)
- [`packages/core/src/components/layout/UiSpace.vue`](../../packages/core/src/components/layout/UiSpace.vue)
- [`packages/core/src/styles/layout.css`](../../packages/core/src/styles/layout.css)
- [`apps/docs/src/stories/Layout.stories.ts`](../../apps/docs/src/stories/Layout.stories.ts)
- [`apps/playground/src/testing/routes/TestingHarnessView.vue`](../../apps/playground/src/testing/routes/TestingHarnessView.vue)
- [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)
- [`tools/governance/catalog/playground-lab-manifest.mjs`](../../tools/governance/catalog/playground-lab-manifest.mjs)
