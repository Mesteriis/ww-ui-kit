---
id: ai-path-packages-signal-graph
title: packages/signal-graph path rules
apply: by file patterns
patterns: packages/signal-graph/**/*
---
Use this rule when editing the signal-graph system package.

## Do

- Keep `@ww/signal-graph` feature-first and system-layered.
- Keep node/component, focus/depth, and signal contracts honest and public-vendor-neutral.
- Keep playground and Storybook coverage proving real graph behavior.

## Do not

- Do not expose Vue Flow internals as the primary consumer contract.
- Do not move signal-graph into `packages/third-party` unless the public boundary actually becomes vendor-backed.
- Do not add product-specific graph semantics here.

## Update together with

- `packages/signal-graph/README.md`
- `docs/decisions/ADR-0009-interactive-signal-graph-ui.md`
