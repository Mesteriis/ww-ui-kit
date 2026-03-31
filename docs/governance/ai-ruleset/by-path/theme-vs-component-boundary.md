---
id: ai-path-theme-vs-component-boundary
title: Theme vs component boundary path rules
apply: by file patterns
patterns:
  - packages/themes/**/*
  - packages/core/**/*
  - packages/data-grid/**/*
  - packages/signal-graph/**/*
  - packages/widgets/**/*
  - packages/page-templates/**/*
  - packages/third-party/**/*
---

Use this rule when a visual change could land in a theme file, a reusable component package, or the token contract that feeds both.

## Do

- Classify the request as a theme change, component change, or token-contract change before editing.
- Keep `packages/themes` limited to sanctioned remapping of existing semantic color, surface, border, text, shadow, overlay, motion-intensity, density, contrast, and brand-mood tokens.
- Keep component character, size, radius, spacing rhythm, slot or layout structure, icon alignment, state behavior, keyboard flow, ARIA semantics, DOM structure, and public props or variants in the owning component package.
- Move the change to `packages/tokens` first when the current contract cannot express a system-wide scale, elevation tier, focus-ring token, or other new sanctioned visual parameter; update consuming themes and components after that contract change.
- Default to the component package when the defect is visible in one component, one variant, or one small family instead of across the themed system.
- Use the identity check: after a theme switch, the component should still read as the same kit component; if not, the change is not a theme remap.
- Update stories and docs when a public surface contract or visible baseline changes.

## Do not

- Do not use `packages/themes` to mask a component-specific spacing, layout, focus, loading, disabled, hover, active, or accessibility defect.
- Do not push a new component shape, structure, visual weight, or brand language through theme overrides.
- Do not change component contracts when the task is only a global remap of already-sanctioned theme tokens.
- Do not introduce raw palette, shadow, z-index, easing, or spacing values outside the sanctioned token and theme contracts.
- Do not create a second visual source of truth beside tokens, theme mappings, and component contracts.

## Related repo sources of truth

- `docs/decisions/ADR-0002-token-theme-split.md`
- `docs/decisions/ADR-0019-theme-capability-matrix-and-dom-backed-runtime.md`
- `docs/architecture/layer-governance.md`
- `docs/architecture/docs-as-contract.md`
- `docs/architecture/golden-path.md`
