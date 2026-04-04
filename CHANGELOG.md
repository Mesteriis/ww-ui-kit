# Changelog

All notable repository-level changes are documented in this file.

This changelog tracks monorepo-wide milestones, tooling shifts, OSS automation, and architecture expansions.
Package-specific version history continues to live in each package `CHANGELOG.md` and in Changesets release pull requests.

## [Unreleased]

_No unreleased repository-level changes documented._

## [2026-04-04]

### Added

- Expanded governed `@ww/core` surfaces with `UiButtonGroup`, `UiSlider`, `UiRangeSlider`, `UiAffix`, `UiScrollArea`, `UiScrollTop`, `UiAnchor`, `UiPopconfirm`, `UiContextMenu`, `UiGrid`, `UiSpace`, `UiFlex`, `UiImage`, `UiInputPassword`, `UiInputGroup`, `UiInputTag`, `UiInputOtp`, `UiRating`, `UiTimeline`, `UiDescriptions`, `UiStatistic`, `UiResult`, and `UiList`.
- Added ADR and Changesets coverage for button groups, overlay specializations, slider surfaces, scroll utilities, layout utilities, image display, field enrichments, and information/result surfaces.

### Changed

- Expanded Storybook stories, playground proofs, generated lab usage metadata, public surface manifests, and docs coverage for the new governed core surfaces.
- Updated governed performance budgets to keep the larger playground testing harness inside the perf gate.

### Quality

- Added unit, Storybook e2e, and playground e2e regression coverage across the new core waves.
- Added manifest follow-up commits to keep public catalog and playground-lab registry aligned with the new surfaces.

## [2026-04-02]

### Added

- Added governed performance regression gates with budget manifests, Playwright perf scenarios, runtime measurement helpers, and CI integration.
- Added branded docs and playground assets, a richer playground home, dashboard layout stories/labs, flow layout shells, and the `@ww/tsparticles` package with `UiTsParticlesBackdrop`.

### Changed

- Expanded page-template surfaces with `UiDashboardLayout`, `UiHorizontalLayout`, and `UiVerticalLayout`, and refreshed docs/playground structure around them.
- Extended themed showcase coverage, particle demos, and layout workbench flows across Storybook and the consumer playground.

### Quality

- Brought perf checks into repository verification and widened browser-level coverage for the new playground surfaces.

## [2026-03-31]

### Fixed

- Hardened `@ww/core` field, menu, and overlay regressions after the second-wave merge, including autocomplete, select, and floating-surface behavior.
- Stabilized post-merge CI, package build contracts, and test verification with dedicated build `tsconfig` files and route-level playground checks.

### Changed

- Relaxed ADR governance so dependency-only changes no longer require architectural ADR evidence when repository structure stays intact.

### Governance

- Added and refined the AI rule that separates theme responsibilities from component responsibilities.

## [2026-03-30]

### Added

- Expanded theme runtime contracts with capability matrices, DOM-backed theme tooling, browser diagnostics support, and stronger theme test coverage.
- Added generated AI rules mirrors from the canonical governance rules pack.
- Shipped the first canonical `@ww/core` wave with disclosure, feedback, navigation, overlay, and selection surfaces including `UiAlert`, `UiTag`, `UiCollapse`, `UiBreadcrumb`, `UiPagination`, `UiDropdown`, `UiPopover`, `UiToast`, `UiTooltip`, `UiRadio`, and `UiRadioGroup`.
- Shipped the second `@ww/core` wave with richer fields and information/navigation surfaces including `UiAvatar`, `UiAvatarGroup`, `UiProgress`, `UiTable`, `UiAutocomplete`, `UiNumberInput`, `UiSelect`, `UiMenu`, and `UiSteps`.

### Changed

- Reframed `@ww/page-templates` around the `UiLayout` shell API and aligned stories, playground labs, fixtures, and manifests to the new naming.
- Expanded the governed todo inventory, public-surface manifests, and consumer harness coverage for the staged component backlog.

### Fixed

- Closed verify, lint, typecheck, and Storybook CI gaps introduced during rapid surface expansion.

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
