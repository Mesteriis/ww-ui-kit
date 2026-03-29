---
id: ADR-0010
title: Widgets And Page Templates Layer
status: accepted
date: 2026-03-24
owners:
  - platform
tags:
  - widgets
  - page-templates
relatedPackages:
  - @ww/widgets
  - @ww/page-templates
  - @ww/core
supersedes: []
supersededBy: []
---

# ADR-0010 Widgets And Page Templates Layer

## Context

The repository already separates foundational layers such as tokens, themes, primitives, core components, and optional systems packages. The next reusable abstractions are larger composed UI blocks and reusable page shells. Without a dedicated place for them, future work would either bloat `@ww/core` or leak reusable scaffolds into apps.

## Decision

Two new top-level layers are added:

- `@ww/widgets`
  Black-box reusable UI blocks above core and systems.
- `@ww/page-templates`
  Reusable page-shell and layout compositions above widgets, systems, and core.

These layers start as scaffold packages with real shell components:

- `UiWidgetShell`, `UiWidgetHeader`, `UiWidgetBody`, `UiWidgetFooter`
- `UiPageTemplate`, `UiPageHeader`, `UiPageBody`, `UiPageSidebar`, `UiPageSection`, `UiPageToolbar`

Reserved namespaces document where future `LoginWindow`, `DataTableWidget`, `AuthPageTemplate`, `WorkspacePageTemplate`, and similar entities should live.

## Consequences

- `@ww/core` stays limited to baseline reusable components instead of absorbing composed widget-like surfaces.
- Apps keep ownership of route pages, backend integration, and domain orchestration.
- Future systems packages can be composed by widgets without leaking vendor or engine concerns into apps.
- Page templates stay distinct from route pages and remain reusable across multiple apps or product areas.

## Alternatives

- Putting widgets into `@ww/core` would blur the boundary between baseline controls and composed feature surfaces.
- Putting reusable page shells directly into apps would duplicate layout logic and make cross-app reuse harder.
- Creating fake runtime components for future widgets or pages would add noise without real value.

## Migration / Rollout

- The change is additive.
- Existing packages keep their current roles.
- Future composed blocks should be added to `@ww/widgets` or `@ww/page-templates` instead of `@ww/core` or `apps/*` when they are intended to be reusable across products or routes.

## Related artifacts

- [`packages/widgets`](../../packages/widgets)
- [`packages/page-templates`](../../packages/page-templates)
- [`docs/architecture/placement-rules.md`](../architecture/placement-rules.md)

