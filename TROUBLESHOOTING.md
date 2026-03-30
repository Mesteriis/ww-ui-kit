# Troubleshooting

Use this file for recurring contributor failures. Keep it operational and repository-specific.

## Toolchain baseline mismatch

Symptom:

- `Unsupported engine` warnings from pnpm
- unexpected install or script failures on Node `25.x` or older runtimes

Likely cause:

- the repo only validates Node `24.x` in CI and `.node-version`
- root pnpm workflows now stop immediately when the runtime drifts from that baseline

Run:

```bash
pnpm check:node-version
cat .node-version
node -v
pnpm -v
```

Then switch to Node `24.x` with your version manager and reinstall:

```bash
pnpm install
```

## Formatting check fails

Symptom:

- `pnpm format:check` reports unformatted files

Likely cause:

- local edits drifted from the shared Prettier config

Run:

```bash
pnpm format
pnpm format:check
```

## Governance catalog or proof checks fail

Symptom:

- `pnpm check:catalog`
- `pnpm check:stories`
- `pnpm check:docs`
- `pnpm check:playground-coverage`
- `pnpm check:playground-lab`

Likely cause:

- a public surface changed without matching Storybook, docs, playground harness, or lab manifest updates

Run:

```bash
pnpm check:catalog
pnpm check:stories
pnpm check:docs
pnpm build:playground-lab
pnpm check:playground-coverage
pnpm check:playground-lab
```

Then update the governed manifests under `tools/governance/catalog/` and the missing proof artifacts.

## ADR or AI rules checks fail

Symptom:

- `pnpm check:adr`
- `pnpm check:ai-rules`

Likely cause:

- architecture-sensitive changes landed without ADR coverage
- canonical AI rules changed without rebuilding generated views and mirrors

Run:

```bash
pnpm build:ai-rules
pnpm check:adr
pnpm check:ai-rules
```

Then update `docs/decisions/` or `docs/governance/ai-ruleset/` instead of editing mirrors by hand.

## Architecture checks fail

Symptom:

- `pnpm check:architecture`
- `pnpm check:boundaries`
- `pnpm check:public-imports`
- `pnpm check:topology`

Likely cause:

- a file crossed layer boundaries or used deep imports such as `@ww/*/src/**`

Run:

```bash
pnpm check:architecture
```

Then inspect:

- `tools/governance/catalog/layer-rules.mjs`
- `tools/governance/catalog/package-classification.mjs`
- `tools/governance/catalog/public-surface-manifest.mjs`

## Playwright browsers or trace debugging

Symptom:

- `pnpm test:e2e` or `pnpm test:playground` fails before the browser starts
- CI failure includes only retry traces

Likely cause:

- Playwright browsers are missing locally
- the failure happened on a first attempt and the trace was captured on retry only

Run:

```bash
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
pnpm test:playground
```

Local runs use `retries=0`; CI uses retries and `trace: on-first-retry`.

## Coverage failures

Symptom:

- `pnpm test:coverage` fails

Likely cause:

- strict `100/100/100/100` thresholds were not preserved

Run:

```bash
pnpm test:coverage
```

Then add missing unit coverage instead of lowering thresholds.

## Changeset or release hygiene problems

Symptom:

- release PR is missing expected package updates
- a public package behavior change has no changeset

Likely cause:

- a publishable package changed without a changeset entry

Run:

```bash
pnpm changeset
pnpm version-packages
```

Add a changeset only for publishable public behavior or export changes.

## Pages build problems

Symptom:

- `pnpm build:pages` fails
- GitHub Pages deploy contains stale docs or playground routes

Likely cause:

- Storybook or playground build failed
- `scripts/build-pages.mjs` inputs are stale

Run:

```bash
pnpm build
pnpm build:pages
```

Then inspect `site-dist/`, `apps/docs/storybook-static`, and `apps/playground/dist`.
