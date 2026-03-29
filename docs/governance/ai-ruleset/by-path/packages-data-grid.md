---
id: ai-path-packages-data-grid
title: packages/data-grid path rules
apply: by file patterns
patterns: packages/data-grid/**/*
---
Use this rule when editing the dense admin table system package.

## Do

- Keep `@ww/data-grid` as a controlled system package.
- Keep query, selection, sorting, filters, and pagination models serializable and consumer-controlled.
- Keep docs, stories, and playground proofs aligned with the public grid contract.

## Do not

- Do not add backend fetching, routing, or domain-specific tables here.
- Do not leak vendor internals as the canonical API.
- Do not duplicate the data-grid engine in widgets or apps.

## Update together with

- `packages/data-grid/README.md`
- `tools/governance/catalog/public-surface-manifest.mjs`
