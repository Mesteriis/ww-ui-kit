# AI Rules

Canonical source of truth for repository-specific AI agent behavior.

<!-- AI_RULES_SYNC:START -->
- Follow the canonical layer order: `tokens -> themes -> primitives -> core -> systems -> widgets -> page-templates -> apps`.
- Choose placement from `tools/governance/catalog/package-classification.mjs` and `docs/architecture/placement-rules.md` before adding code.
- Do not add new public exports without updating `tools/governance/catalog/public-surface-manifest.mjs`.
- Do not deep import `@ww/*/src/**` or non-exported package subpaths.
- Do not put raw palette values outside `@ww/tokens` and `@ww/themes`.
- Do not put raw easing curves outside `@ww/tokens` and `@ww/themes`.
- Do not introduce raw z-index hacks outside sanctioned local stacking or tokenized layer contracts.
- Keep `ThemeName` and `ThemeType` synchronized through `@ww/themes`; never invent a second theme axis.
- Respect theme-aware portal, overlay, motion, and subtree theme contracts.
- Add or update Storybook stories when touching any public UI surface listed in the manifest.
- Add or update docs when touching any public package or architecture rule covered by the manifest.
- Add or update playground scenarios when a public surface requires real composition proof.
- Add unit tests for helpers, adapters, runtime logic, and jsdom component contracts.
- Add e2e tests for public docs/stories and playground tests for real consumer-proof flows.
- Update or add an ADR when changing architecture-sensitive files or rules.
- Add a changeset when public behavior, public exports, or publishable packages change.
- Keep vendor-backed adapters out of `@ww/core`.
- Put dense business/admin table orchestration in `@ww/data-grid` as a system package, not in `@ww/core`.
- Keep `@ww/data-grid` free of backend fetching, routing, and product-specific table semantics.
- Build future table widgets above `@ww/data-grid`; do not duplicate grid engine logic in widgets or apps.
- Keep widgets free of routing, backend orchestration, and app-only state.
- Keep page templates free of route-page behavior and backend orchestration.
- Keep product or domain logic in apps, not in packages meant for reuse.
- Update README, CONTRIBUTING, and governance docs when changing the golden path or public discipline.
<!-- AI_RULES_SYNC:END -->

Use `pnpm check:ai-rules` to verify that mirrors stay synchronized.
