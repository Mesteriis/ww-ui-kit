---
id: ai-manual-rule-pack-maintenance
title: AI rule pack maintenance
apply: manually
---

Use this rule only when evolving the AI rules pack itself.

## Do

- Keep `docs/governance/ai-ruleset/` as the canonical rules source.
- Keep the manifest, generated overview, generated index, and thin mirrors synchronized.
- Keep rules short, operational, and repository-specific.
- Run `pnpm build:ai-rules` and `pnpm check:ai-rules` after editing the pack.

## Do not

- Do not create a second canonical AI rules document beside the pack.
- Do not let mirrors grow into a full duplicate rules source.
- Do not leave orphan rule files outside the manifest.
- Do not invent new apply modes.

## Related repo sources of truth

- `tools/governance/ai-rules/rule-manifest.mjs`
- `tools/governance/checks/check-ai-rules.mjs`
