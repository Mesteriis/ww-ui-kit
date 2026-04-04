# Changelog

All notable repository-level changes are documented in this file.

This changelog tracks monorepo-wide milestones, tooling shifts, OSS automation, and architecture expansions.
Package-specific version history continues to live in each package `CHANGELOG.md` and in Changesets release pull requests.

## [Unreleased]

### Added

- Added governed core field-enrichment surfaces for password entry, grouped inputs, tag inputs, and one-time passcode flows.
- Added governed core information and result surfaces covering rating, timeline, descriptions, statistic, list, and result patterns.

### Changed

- Added a canonical repository-level changelog alongside existing package changelogs.
- Clarified the difference between monorepo release history and package-level Changesets history in the root documentation.
- Expanded Storybook, playground proofs, ADR coverage, catalogs, and regression suites for the new public core surfaces.

## [2026-03-29]

### Added

- Established the Belovodye UiKit pnpm workspace monorepo with `tokens`, `themes`, `primitives`, `core`, `docs`, and `playground`.
- Added motion foundation, overlay/layer foundation, ThemeType-aware theming, and the `belovodye` theme.
- Added optional feature packages for ApexCharts integration, interactive signal-graph UI, widget shells, and page-template shells.
- Added Storybook, playground, test infrastructure, Changesets workflow, GitHub Pages publishing, CI, OSS documentation, and repository hygiene defaults.

### Changed

- Moved the toolchain baseline to Node.js `24.x`, Vite `6`, and Vitest `3`.
- Upgraded repository automation to GitHub Actions `v6` runtime actions where appropriate.
- Switched Vitest from the deprecated workspace entry to a root `projects` configuration.

### Quality

- Enforced strict global test coverage at `100/100/100/100`.
- Verified build, lint, typecheck, tests, docs build, playground build, and Pages artifact generation across the monorepo.
