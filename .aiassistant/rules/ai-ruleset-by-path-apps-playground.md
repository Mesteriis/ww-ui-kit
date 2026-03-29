---
id: ai-path-apps-playground
title: apps/playground path rules
apply: by file patterns
patterns: apps/playground/**/*
---

Use this rule when editing playground testing routes or the maintainer lab.

## Do

- Keep playground as the real integration harness for consumer-proof flows.
- Keep `/testing/*` stable for browser tests and manifest-required scenarios.
- Keep `/lab/*` curated, schema-driven, and backed by the governed lab manifest.
- Add stable sections or scenarios that prove multi-package composition.
- Keep harness selectors stable enough for browser tests without polluting public APIs.

## Do not

- Do not treat playground as a story clone with no added integration value.
- Do not add random demo pages or hardcoded component lists outside the manifest-driven lab runtime.
- Do not hide broken contracts behind local mocks that bypass package APIs.
- Do not put product routing or backend logic here.

## Update together with

- `tools/governance/catalog/playground-requirements.mjs`
- `tools/governance/catalog/playground-lab-manifest.mjs`
- `tools/governance/playground-lab/**/*`
- `tests/playground/**/*`
