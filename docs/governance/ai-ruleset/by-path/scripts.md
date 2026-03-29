---
id: ai-path-scripts
title: scripts path rules
apply: by file patterns
patterns: scripts/**/*
---
Use this rule when editing repository utility scripts outside governance tooling.

## Do

- Keep scripts repository-scoped and reproducible.
- Document scripts that are part of the golden path or CI pipeline.
- Keep outputs compatible with the Pages/docs/playground build flow when relevant.

## Do not

- Do not add undocumented scripts that alter repository behavior silently.
- Do not fork governance behavior into standalone scripts that bypass checks.
- Do not introduce environment assumptions that CI cannot satisfy.

## Update together with

- `README.md`
- related workflow files when CI or Pages behavior changes
