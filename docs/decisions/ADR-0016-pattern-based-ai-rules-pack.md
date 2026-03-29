---
id: ADR-0016
title: Pattern Based AI Rules Pack
status: accepted
date: 2026-03-29
owners:
  - platform
tags:
  - ai
  - governance
  - automation
relatedPackages:
  - @ww/docs
  - @ww/playground
supersedes:
  - ADR-0013
supersededBy: []
---

# ADR-0016 Pattern Based AI Rules Pack

## Context

The repository already had one canonical AI rules file and thin mirrors. That prevented obvious drift, but it kept all repository-specific rules in one monolithic document. As the repository gained systems, widgets, page templates, topology governance, and path-specific automation, the single-file model stopped matching how agents actually choose rules.

## Decision

Adopt a pattern-based AI rules pack under `docs/governance/ai-ruleset/`.

The rules pack uses four canonical apply modes:

- `always`
- `by model decision`
- `by file patterns`
- `manually`

Supporting decisions:

- `docs/governance/ai-ruleset/` becomes the canonical machine-oriented source of truth.
- `docs/governance/ai-rules.md` becomes the human-readable overview.
- `AGENTS.md` and `.github/copilot-instructions.md` remain thin generated mirrors of the always baseline.
- `tools/governance/ai-rules/rule-manifest.mjs` becomes the machine-readable inventory of the pack.
- `check:ai-rules` validates rule frontmatter, apply-mode contracts, manifest coverage, generated index, and mirror sync.
- Accessibility contracts such as ARIA, keyboard flow, focus ownership, overlay focus handling, and reduced-motion behavior belong in the always baseline rather than ad hoc path rules.
- Root config files get explicit path-based AI rules because toolchain drift changes repository behavior even when package code does not move.
- Path patterns stay intentionally small and explicit: `patterns` may be a string or array of strings, and unsupported glob syntax such as `{}`, `[]`, and `!` fails validation instead of being interpreted loosely.
- Manifest metadata stays honest through validated `layerTags`, `areaTags`, and `packageTags` allow-lists instead of half-dead future-facing fields.

## Consequences

- AI rules now map to real repository usage patterns instead of living in one flat list.
- Path-specific rules can point agents at the right source-of-truth files without bloating the always baseline.
- Thin mirrors stay practical for tools that only need the always baseline and a pointer to the canonical pack.
- Governance automation becomes stricter because orphan rules, invalid frontmatter, and stale generated views fail CI.
- Agents now get accessibility and root-config guidance from the canonical pack without creating a second rules system.
- The rules pack keeps a deliberately small glob model, which is less expressive than full minimatch syntax but safer for deterministic CI validation.

## Alternatives

- Keeping one monolithic `ai-rules.md` would remain readable but would not express path-specific or decision-specific application cleanly.
- Letting `AGENTS.md` or Copilot instructions become independent sources would reintroduce drift.
- Adding ad hoc guidance files without a manifest would create rule sprawl and unclear ownership.

## Migration / Rollout

- Move repository-specific rules from the monolithic file into apply-mode rule files.
- Generate the human overview and thin mirrors from the rules pack.
- Update README, CONTRIBUTING, CI, and architecture docs to point at the new canonical source.
- Mark ADR-0013 as superseded rather than deleting it.

## Related artifacts

- [`docs/governance/ai-ruleset/README.md`](../governance/ai-ruleset/README.md)
- [`docs/governance/ai-rules.md`](../governance/ai-rules.md)
- [`tools/governance/ai-rules/rule-manifest.mjs`](../../tools/governance/ai-rules/rule-manifest.mjs)
- [`tools/governance/checks/check-ai-rules.mjs`](../../tools/governance/checks/check-ai-rules.mjs)
