---
id: ai-always-reuse-boundaries
title: Keep reusable packages free of route, backend, and product orchestration
apply: always
summary: Keep reusable packages free of route, backend, and product orchestration; keep vendor-backed adapters out of core.
---
Reusable layers stay reusable only when orchestration stays above them.

## Do

- Keep vendor-backed adapters out of `@ww/core`.
- Keep `@ww/data-grid` as the dense business table system package and `DataTableWidget` above it.
- Keep widgets free of routing, backend orchestration, and app-only state.
- Keep page templates free of route-page behavior and backend orchestration.
- Keep product or domain logic in apps or product features.

## Do not

- Do not fetch backend data inside reusable packages unless the package is explicitly a data client.
- Do not duplicate system engine logic inside widgets or apps.
- Do not make route pages or backend-aware flows masquerade as reusable packages.
- Do not leak vendor-specific behavior through core.

## Related repo sources of truth

- `docs/architecture/golden-path.md`
- `docs/architecture/placement-rules.md`
- `packages/data-grid/README.md`
- `packages/widgets/README.md`
