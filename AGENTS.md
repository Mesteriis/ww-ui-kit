# Repository AI Rules

Thin mirror of the canonical repository AI rules pack.

Canonical source of truth: `docs/governance/ai-ruleset/`
Human overview: `docs/governance/ai-rules.md`

<!-- AI_RULES_SYNC:START -->
- Preserve the canonical layer order and choose placement from governance sources before adding code.
- Treat export maps and the public surface manifest as the only supported public API.
- Keep palette, easing, z-index, ThemeName, ThemeType, motion, overlays, and subtree theming inside sanctioned contracts.
- Update stories, docs, playground proofs, tests, ADRs, and changesets when public or architectural behavior changes.
- Keep reusable packages free of route, backend, and product orchestration; keep vendor-backed adapters out of core.
- Treat ARIA, keyboard flow, focus handling, overlays, and reduced-motion behavior as structural contracts.
<!-- AI_RULES_SYNC:END -->
