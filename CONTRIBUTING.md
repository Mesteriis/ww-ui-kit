# Contributing

## Local setup

Toolchain baseline:

- Node.js `24.x`
- pnpm `10.32.1+`

```bash
pnpm install
pnpm dev:docs
pnpm dev:playground
```

## What to do

- choose the correct layer before adding code
- update the public surface manifest when adding or changing public API
- add or update Storybook coverage for public UI surfaces
- add or update docs coverage for public packages and architecture rules
- add or update playground proof scenarios when composition behavior changes
- add or update tests in the correct contour:
  - `test:unit`
  - `test:e2e`
  - `test:playground`
- add or update an ADR when architecture-sensitive areas change
- add a changeset when public package behavior or exports change

## What is forbidden

- deep importing `@ww/*/src/**`
- putting systems, widgets, page templates, or apps inside `@ww/core`
- putting routing or backend orchestration inside widgets or page templates
- leaking vendor APIs through `@ww/core`
- hardcoding raw palette values outside tokens/themes
- hardcoding raw easing curves outside tokens/themes
- adding public exports without catalog/docs/tests updates
- changing architecture-sensitive areas without ADR updates

## Required checks

Run before pushing:

```bash
pnpm check:catalog
pnpm check:stories
pnpm check:docs
pnpm check:playground-coverage
pnpm check:adr
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

## Release and changesets

Add a changeset when:

- a publishable package gains or changes public exports
- public runtime behavior changes
- theme, motion, overlay, or styling contracts change

Do not add a changeset for docs-only or internal-only repo hygiene.

## ADR discipline

Use [`docs/decisions/_template.md`](./docs/decisions/_template.md) for new ADRs.

You need an ADR when changing:

- package topology
- layer rules
- public API governance
- testing architecture
- AI rules or governance model
- workflows that change repository operational behavior

## PR hygiene

- keep PRs coherent
- label with one `kind:*`
- add one or more `area:*`
- add `priority:*` only when it adds ordering value
- keep release-note labels honest
- do not create ad hoc release tags manually

