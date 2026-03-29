---
id: ai-always-visual-runtime-contracts
title: Keep visual tokens, theme axes, motion, overlays, and z-index inside sanctioned contracts
apply: always
summary: Keep palette, easing, z-index, ThemeName, ThemeType, motion, overlays, and subtree theming inside sanctioned contracts.
---

Visual and runtime contracts are foundational, not local hacks.

## Do

- Put palette values and easing curves in `@ww/tokens` or `@ww/themes`.
- Keep `ThemeName` and `ThemeType` synchronized through `@ww/themes`.
- Respect theme-aware portal, overlay, motion, and subtree theme contracts.
- Use sanctioned layer contracts instead of ad hoc stacking fixes.

## Do not

- Do not hardcode raw palette values outside tokens or themes.
- Do not hardcode easing curves outside tokens or themes.
- Do not introduce random z-index hacks outside sanctioned local stacking or tokenized layers.
- Do not invent a second theme axis alongside `ThemeName` and `ThemeType`.

## Related repo sources of truth

- `docs/architecture/golden-path.md`
- `docs/architecture/layer-governance.md`
- `packages/themes`
- `packages/primitives`
