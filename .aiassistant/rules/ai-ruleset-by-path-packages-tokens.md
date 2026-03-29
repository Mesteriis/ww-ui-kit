---
id: ai-path-packages-tokens
title: packages/tokens path rules
apply: by file patterns
patterns: packages/tokens/**/*
---
Use this rule when editing token contracts.

## Do

- Keep raw palette values, spacing primitives, motion tokens, and layer tokens here when they are foundational.
- Keep contracts generic and reusable across themes and components.
- Update token docs and downstream theme mappings when new token families are introduced.

## Do not

- Do not add app-specific semantics or backend concepts here.
- Do not put component logic or runtime branching here.
- Do not bypass token contracts by hardcoding new raw values elsewhere.

## Update together with

- `packages/themes/**/*`
- `packages/tokens/README.md`
