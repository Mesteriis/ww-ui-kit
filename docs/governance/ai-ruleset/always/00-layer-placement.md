---
id: ai-always-layer-placement
title: Preserve canonical layer order and placement discipline
apply: always
summary: Preserve the canonical layer order and choose placement from governance sources before adding code.
---

Placement is governed, not ad hoc.

## Do

- Follow `tokens -> themes -> primitives -> core -> systems -> widgets -> page-templates -> apps`.
- Choose placement from `tools/governance/catalog/package-classification.mjs` and `docs/architecture/placement-rules.md` before adding code.
- Keep systems as feature-first packages, widgets above systems, and page templates above widgets or systems.
- Keep real route pages and backend orchestration in `apps/*`.

## Do not

- Do not invent a new layer name or package family without governance updates.
- Do not move product logic down into reusable packages.
- Do not put widgets, page templates, or apps inside `@ww/core`.
- Do not treat page templates as route pages.

## Update together with

- `tools/governance/catalog/package-classification.mjs`
- `docs/architecture/layer-governance.md`
- `docs/architecture/placement-rules.md`
