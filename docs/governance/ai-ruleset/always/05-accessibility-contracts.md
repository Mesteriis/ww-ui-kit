---
id: ai-always-accessibility-contracts
title: Treat accessibility contracts as structural UI behavior
apply: always
summary: Treat ARIA, keyboard flow, focus handling, overlays, and reduced-motion behavior as structural contracts.
---

Accessibility is part of the supported runtime contract, not decorative polish.

## Do

- Preserve ARIA semantics, keyboard navigation, tab order, and focus-visible behavior for interactive surfaces.
- Treat overlays, dialogs, menus, popovers, and similar surfaces as structural accessibility boundaries with correct focus trap and focus restore behavior.
- Keep reduced-motion behavior aligned with the existing motion contract instead of creating one-off animation bypasses.
- Add or update focused tests when a change can affect keyboard flow, focus ownership, or browser-level accessibility.

## Do not

- Do not treat a11y regressions as acceptable tradeoffs for visual polish or animation.
- Do not hide broken semantics behind `role` or `aria-*` cargo-culting that does not match behavior.
- Do not break tab order, focus restore, or escape/close interaction in overlays and other interactive layers.
- Do not add motion or inline interaction effects that ignore `prefers-reduced-motion`.

## Related repo sources of truth

- `docs/architecture/testing-architecture.md`
- `docs/architecture/golden-path.md`
- `packages/primitives`
- `packages/core`
