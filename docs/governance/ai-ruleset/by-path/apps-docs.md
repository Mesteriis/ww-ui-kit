---
id: ai-path-apps-docs
title: apps/docs path rules
apply: by file patterns
patterns: apps/docs/**/*
---
Use this rule when editing the Storybook docs app.

## Do

- Keep Storybook as the source of truth for public UI states and variants.
- Keep stories aligned with manifest-required coverage.
- Keep docs app content reusable and package-oriented rather than product-specific.

## Do not

- Do not move public UI proof out of Storybook into prose-only docs.
- Do not use docs stories as a substitute for playground composition proof.
- Do not add product routing or backend logic here.

## Update together with

- `tools/governance/catalog/storybook-requirements.mjs`
- `tools/governance/catalog/public-surface-manifest.mjs`
