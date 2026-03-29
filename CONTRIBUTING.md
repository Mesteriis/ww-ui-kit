# Contributing

## Local setup

1. Install dependencies:

```bash
pnpm install
```

2. Use the main dev entrypoints:

```bash
pnpm dev:docs
pnpm dev:playground
```

## Required checks

Before pushing a branch, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm build
pnpm build:pages
```

`pnpm test:coverage` is strict and fails unless the monorepo stays at `100/100/100/100`.

## GitHub automation

- `CI` runs on `push` to `main`, on pull requests, and on manual dispatch.
- `Release PR` runs on `main`, keeps the Changesets release pull request up to date, and creates canonical package tags after a version PR merge.
- Publishing is intentionally not automated yet; the workflow is safe by default and does not assume `NPM_TOKEN`.
- `GitHub Pages` publishes a landing page at the site root, Storybook under `/docs/`, and the integration playground under `/playground/`.
- Dependabot tracks both npm dependencies and GitHub Actions.
- Issue templates distinguish bug reports from feature requests.

## Layer rules

- `@ww/core` contains only base reusable components.
- Optional systems such as charts and signal graph stay outside `core`.
- `@ww/widgets` is for black-box composed UI blocks.
- `@ww/page-templates` is for reusable page shells, not route pages.
- `apps/*` is where route-level and product-level logic belongs.

## Theme and style rules

- Use semantic and component CSS variables.
- Do not hardcode palette values inside component packages.
- Keep `ThemeName` and `ThemeType` consistent through `@ww/themes`.
- Preserve subtree theming and theme-aware overlay behavior.

## Testing rules

- Add behavior tests, not snapshot-only coverage padding.
- Cover focus, motion, z-index, overlay, and theme interactions when touching those areas.
- Keep reduced-motion and SSR-safe paths tested when they exist.

## Git hygiene

- Keep generated artifacts out of commits.
- Do not commit local IDE files, caches, logs, or coverage output.
- Prefer small, coherent commits with clear scope.
- Do not create ad hoc release tags manually; package tags are derived from Changesets version commits.
