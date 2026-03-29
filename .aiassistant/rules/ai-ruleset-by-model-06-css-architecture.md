---
id: ai-model-css-architecture
title: Apply CSS architecture and token discipline
apply: by model decision
instructions: use when editing tokens, theme stylesheets, component CSS, motion styles, overlay layers, or other design-system styling contracts.
---

Use this rule when the change affects how styling contracts are authored rather than only which component uses them.

## Do

- Keep design-system custom properties under the `--ui-` namespace and component classes under the `ui-` namespace.
- Use sanctioned tokens, theme mappings, and existing stylesheet entrypoints instead of scattering raw constants through component CSS.
- Keep z-index and overlay layering aligned with sanctioned token or slot contracts.
- Keep design-system-owned styling in tokens, themes, or governed stylesheets instead of ad hoc inline styles.
- Use `!important` only for tightly scoped contract enforcement such as reduced-motion overrides that must win locally.

## Do not

- Do not invent parallel naming schemes for CSS variables or classes.
- Do not hardcode new palette, spacing, easing, or z-index constants in component CSS when the contract belongs in tokens or themes.
- Do not bypass sanctioned CSS layers or styling entrypoints with one-off stylesheet wiring.
- Do not move design-system concerns into inline runtime styles when the contract belongs in shared CSS.

## Related repo sources of truth

- `packages/tokens`
- `packages/themes`
- `packages/core`
- `docs/architecture/golden-path.md`
