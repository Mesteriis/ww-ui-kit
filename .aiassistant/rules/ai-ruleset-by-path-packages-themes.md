---
id: ai-path-packages-themes
title: packages/themes path rules
apply: by file patterns
patterns: packages/themes/**/*
---

Use this rule when editing theme runtime or concrete theme mappings.

## Do

- Keep `ThemeName` and derived `ThemeType` as the source of truth here.
- Keep subtree theme and `color-scheme` behavior aligned with the current theme system.
- Keep `color-scheme` owned by the shared `data-ui-theme-type` CSS contract instead of duplicating inline runtime styles.
- Map semantic tokens here instead of inventing theme conditionals inside components.

## Do not

- Do not put component business logic here.
- Do not create a second theme axis outside `ThemeName` and `ThemeType`.
- Do not branch on theme names inside unrelated packages when a theme contract can express the difference.

## Update together with

- `packages/themes/README.md`
- `packages/tokens/README.md`
- `docs/architecture/golden-path.md`
