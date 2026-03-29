---
id: ai-path-packages-page-templates
title: packages/page-templates path rules
apply: by file patterns
patterns: packages/page-templates/**/*
---

Use this rule when editing reusable page or layout shells.

## Do

- Keep page templates as reusable layout and page-shell composition.
- Compose widgets, systems, and core surfaces without owning backend logic.
- Keep template slot contracts reusable across apps.

## Do not

- Do not treat page templates as route pages.
- Do not add backend orchestration or product workflows here.
- Do not hide app-specific state machines inside template helpers.

## Update together with

- `packages/page-templates/README.md`
- `docs/architecture/placement-rules.md`
