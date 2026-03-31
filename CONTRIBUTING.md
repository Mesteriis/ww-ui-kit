# Contributing

## Local setup

Toolchain baseline:

- Node.js `24.x`
- pnpm `10.32.1+`

CI validates Node `24.x` from `.node-version`. Do not widen support claims unless CI also validates them.
Root pnpm workflows and `pnpm install` now fail fast when the local runtime does not match `.node-version`.

Root `build`, `typecheck`, `dev:docs`, and `dev:playground` commands now rely on workspace-aware pnpm orchestration. Keep package manifests accurate instead of editing manual root package chains.

```bash
pnpm check:node-version
pnpm install
pnpm dev:docs
pnpm dev:playground
pnpm format
```

## What to do

- choose the correct layer before adding code
- update the public surface manifest when adding or changing public API
- keep every named runtime export from a public package root entrypoint covered by `exportName` or `coveredExports` in the public surface manifest
- keep every public visual surface on an explicit Storybook contract in the public surface manifest
- map any extra Storybook invariants for that surface to concrete story artifacts in the public surface manifest
- decide whether each public visual surface is lab-eligible and update `tools/governance/catalog/playground-lab-manifest.mjs`
- add or update Storybook coverage for public UI surfaces
- add or update docs coverage for public packages and architecture rules
- add or update playground testing routes when composition behavior changes
- add or update playground lab schemas, preview runtime, usage data, and copy serializers when a lab-eligible surface changes
- add or update tests in the correct contour:
  - `test:unit`
  - `test:e2e`
  - `test:playground`
- add or update curated browser-level accessibility checks when load-bearing Storybook or playground flows change
- add or update an ADR when architecture-sensitive areas change
- add a changeset when public package behavior or exports change
- update the AI rules pack when repository-specific agent behavior changes

## What is forbidden

- deep importing `@ww/*/src/**`
- putting systems, widgets, page templates, or apps inside `@ww/core`
- putting routing or backend orchestration inside widgets or page templates
- leaking vendor APIs through `@ww/core`
- hardcoding raw palette values outside tokens/themes
- hardcoding raw easing curves outside tokens/themes
- adding public exports without catalog/docs/tests updates
- adding a named root runtime export without extending manifest coverage for it
- leaving a public visual surface without Storybook coverage or an explicit manifest decision
- declaring Storybook invariants in the manifest without mapping them to real story artifacts
- changing architecture-sensitive areas without ADR updates
- editing generated AI rule mirrors by hand instead of updating the canonical rules pack

## Required checks

Run before pushing:

```bash
pnpm format:check
pnpm check:catalog
pnpm check:stories
pnpm check:docs
pnpm check:playground-coverage
pnpm build:playground-lab
pnpm check:playground-lab
pnpm check:adr
pnpm build:ai-rules
pnpm check:ai-rules
pnpm check:architecture
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm build
pnpm build:pages
```

`pnpm test:coverage` is strict and must stay at `100/100/100/100`.

## Playground contract

- `/testing/*` is the stable consumer-proof harness. Keep its routes, scenario ids, and browser intent stable.
- `/lab/*` is the maintainer workbench. Keep it schema-driven through the governed lab manifest.
- Do not add ad hoc playground demos outside those two contracts.
- Do not duplicate component lists in `App.vue`, tests, or docs. Use the governed manifest.

## Adding a lab-eligible surface

1. Add or update the public surface in `tools/governance/catalog/public-surface-manifest.mjs`.
2. Record lab eligibility and runtime files in `tools/governance/catalog/playground-lab-manifest.mjs`.
3. Add the schema under `apps/playground/src/lab/schemas/`.
4. Reuse or add the preview runtime component under `apps/playground/src/lab/components/`.
5. Regenerate usage data with `pnpm build:playground-lab`.
6. Run `pnpm check:playground-lab` and `pnpm test:playground`.

Skip the lab only when the surface has low standalone visual tuning value and the manifest records the exemption rationale.

## Release and changesets

Add a changeset when:

- a publishable package gains or changes public exports
- public runtime behavior changes
- theme, motion, overlay, or styling contracts change

Do not add a changeset for docs-only or internal-only repo hygiene.

`@ww/primitives/useId()` is public behavior. SSR or hydration-sensitive fixes to that helper require a changeset.

## ADR discipline

Use [`docs/decisions/_template.md`](./docs/decisions/_template.md) for new ADRs.

You need an ADR when changing:

- package topology
- layer rules
- public API governance
- testing architecture
- AI rules or governance model
- workflows that change repository operational behavior

## AI rules pack

Canonical source of truth:

- [`docs/governance/ai-ruleset/README.md`](./docs/governance/ai-ruleset/README.md)

Generated overview and thin mirrors:

- [`docs/governance/ai-rules.md`](./docs/governance/ai-rules.md)
- [`AGENTS.md`](./AGENTS.md)
- [`.github/copilot-instructions.md`](./.github/copilot-instructions.md)

Apply modes:

- `always`
- `by model decision`
- `by file patterns`
- `manually`

Use `always` for repository-wide guardrails, `by model decision` for task-type rules, `by file patterns` for governed paths, and `manually` for maintainer workflows.

`patterns` may be a string or an array of strings. Only `*`, `**`, and `?` are supported; unsupported glob syntax such as `{}`, `[]`, and `!` is rejected by `pnpm check:ai-rules`.

Run `pnpm build:ai-rules` after editing the canonical rules pack. `pnpm check:ai-rules` validates frontmatter, manifest metadata, generated views, and mirror sync.

## Formatting and troubleshooting

- Prettier is the repository formatter. Run `pnpm format` locally and `pnpm format:check` in automation.
- Use [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) for governance checks, Playwright setup, formatting failures, and pages build issues.

## Browser test debugging

- Storybook and playground Playwright configs use `retries=0` locally and CI retries with `trace: on-first-retry`.
- Install browsers locally with `pnpm exec playwright install --with-deps chromium`.
- Keep axe checks curated. Add them to load-bearing stories and harness flows, not every story in the repo.

## PR hygiene

- keep PRs coherent
- label with one `kind:*`
- add one or more `area:*`
- add `priority:*` only when it adds ordering value
- keep release-note labels honest
- do not create ad hoc release tags manually
