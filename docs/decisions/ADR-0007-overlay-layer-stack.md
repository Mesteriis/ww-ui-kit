# ADR-0007 Overlay Layer Stack

## Context

Dialogs, drawers, and future floating surfaces need deterministic stacking, topmost dismiss ownership, scroll locking, and correct theme inheritance when themes are scoped to subtree containers.

## Decision

Centralize overlays in a shared primitive layer:

- z-index values are derived from semantic `--ui-z-*` tokens
- overlay registrations go through a single stack manager
- focus containment and topmost-only dismiss logic are enforced centrally
- portal root resolution is theme-aware
- `UiDialog` and `UiDrawer` consume `useOverlaySurface()` instead of local ad hoc escape, outside-click, and scroll-lock logic

Portal mounting rules:

- nearest themed subtree container wins when present
- otherwise use the global body portal root
- explicit `portalTarget` remains available for advanced composition

## Consequences

- Nested overlays behave predictably.
- Scoped themes continue to work with teleported surfaces.
- Future floating, tooltip, and toast layers can reuse the same stack and slot model.

## Alternatives

- Component-local z-index and dismiss logic would drift over time.
- A single global body-only portal would break scoped theme inheritance.
- Multiple overlay managers would create conflicting escape and outside-click behavior.

## Migration

Existing overlays should move to the shared stack and portal layer instead of extending legacy local helpers. New overlay-like components must use the centralized layer system.
