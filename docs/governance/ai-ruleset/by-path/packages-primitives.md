---
id: ai-path-packages-primitives
title: packages/primitives path rules
apply: by file patterns
patterns: packages/primitives/**/*
---

Use this rule when editing low-level runtime behavior.

## Do

- Keep primitives focused on low-level behavior such as portals, overlays, focus, motion, and composition helpers.
- Protect theme-aware portal and layer stack behavior.
- Keep id helpers instance-aware and SSR-safe; prefer Vue-native primitives such as `useId()` over repo-local mutable counters.
- Add unit coverage for runtime edge cases and accessibility baselines.

## Do not

- Do not add styled business UI or higher-level product semantics here.
- Do not bypass overlay or motion contracts with ad hoc DOM hacks.
- Do not introduce global mutable id sequences that can drift across SSR and hydration.
- Do not leak app-level assumptions into primitive behavior.

## Update together with

- `packages/primitives/README.md`
- `docs/architecture/layer-governance.md`
