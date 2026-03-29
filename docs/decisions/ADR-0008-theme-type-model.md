---
id: ADR-0008
title: Theme Type Model
status: accepted
date: 2026-03-22
owners:
  - platform
tags:
  - themes
  - theming
relatedPackages:
  - @ww/themes
  - @ww/primitives
  - @ww/core
supersedes: []
supersededBy: []
---

# ADR-0008 Theme Type Model

## Context

The repository contains multiple concrete themes such as `light`, `dark`, and `belovodye`. Docs, playground, browser `color-scheme`, and theme-aware overlays need a canonical way to understand both the concrete theme name and whether that theme belongs to the light or dark family.

## Decision

Theme metadata is centralized in `@ww/themes`.

- `ThemeName` identifies a concrete theme.
- `ThemeType` is limited to `light | dark`.
- Every theme has exactly one canonical `ThemeType`.
- `ThemeType` is metadata on a theme, not a free second axis that can be combined independently.
- `setTheme(themeName, target?)` derives type from the registry and applies both `data-ui-theme` and `data-ui-theme-type`.
- Browser `color-scheme` is owned by CSS selectors keyed off `data-ui-theme-type`, not duplicated through inline runtime styles.
- Scoped theme and overlay portal behavior preserve both attributes together.

## Consequences

- Invalid combinations such as `data-ui-theme="belovodye"` with `data-ui-theme-type="dark"` are no longer part of the supported model.
- Storybook and playground can show both the current theme name and type from one source of truth.
- New themes must declare their `type` when added to the registry.
- Browser-native UI behavior can align with the canonical theme family through the shared `data-ui-theme-type` selectors.

## Alternatives

- Treating `ThemeType` as a separate selector axis would allow invalid combinations and duplicate state.
- Keeping type knowledge only in docs or app-level controls would drift from runtime behavior.
- Relying only on `data-ui-theme` would make browser `color-scheme` and scoped overlay propagation less explicit.

## Migration / Rollout

- Existing theme selection continues to use `ThemeName`.
- Theme helpers and DOM targets now also receive `data-ui-theme-type`.
- Subtree theming and theme-aware portal roots should use `setTheme()` or set both attributes together when authored in raw markup.

## Related artifacts

- [`packages/themes/src/theme-maps.ts`](../../packages/themes/src/theme-maps.ts)
- [`docs/architecture/golden-path.md`](../architecture/golden-path.md)
- [`docs/governance/ai-rules.md`](../governance/ai-rules.md)
