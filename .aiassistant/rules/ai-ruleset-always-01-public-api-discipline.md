---
id: ai-always-public-api-discipline
title: Treat export maps and the public surface manifest as governed API
apply: always
summary: Treat export maps and the public surface manifest as the only supported public API.
---

Public API is explicit and machine-checked.

## Do

- Treat package export maps and `tools/governance/catalog/public-surface-manifest.mjs` as the public contract.
- Update the public surface manifest when adding or changing public exports.
- Record lab eligibility for public visual surfaces in `tools/governance/catalog/playground-lab-manifest.mjs`.
- Keep style entrypoints explicit when a package needs them.
- Use package entrypoints, not source file paths, from apps and other packages.

## Do not

- Do not deep import `@ww/*/src/**` or non-exported package subpaths.
- Do not leave hidden public entrypoints that bypass export maps.
- Do not expose vendor internals as canonical public API.
- Do not change public exports without docs, tests, and manifest updates.
- Do not maintain duplicate hand-curated component lists across playground lab runtime, tests, and docs.

## Update together with

- `tools/governance/catalog/public-surface-manifest.mjs`
- `tools/governance/catalog/playground-lab-manifest.mjs` for public visual surfaces
- package `package.json` export maps
- Storybook/docs/playground artifacts required by the manifest
