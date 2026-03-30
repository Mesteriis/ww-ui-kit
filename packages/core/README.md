# @ww/core

`@ww/core` is the baseline reusable component layer.

It owns:

- buttons
- fields
- numeric, listbox, and autocomplete field surfaces:
  `UiNumberInput`, `UiSelect`, `UiAutocomplete`
- selection controls:
  `UiCheckbox`, `UiSwitch`, `UiRadio`, `UiRadioGroup`
- display components:
  `UiAvatar`, `UiAvatarGroup`, `UiBadge`, `UiCard`, `UiDivider`, `UiProgress`, `UiSkeleton`, `UiSpinner`, `UiTable`, `UiTag`
- feedback and disclosure components:
  `UiEmptyState`, `UiAlert`, `UiCollapse`, `UiCollapsePanel`
- navigation components:
  `UiTabsRoot`, `UiTabsList`, `UiTabsTrigger`, `UiTabsPanel`, `UiBreadcrumb`, `UiMenu`, `UiPagination`, `UiSteps`
- overlay surfaces:
  `UiDialog`, `UiDrawer`, `UiTooltip`, `UiPopover`, `UiDropdown`, `UiToast`
- tokenized styles that consume semantic and component CSS variables
- shared style entrypoints such as `styles.css` and `motion.css`

It does not own:

- vendor-backed adapters
- feature-first systems packages
- widgets
- page templates
- route pages or backend orchestration

Public surface proof stays synchronized through:

- package exports from `packages/core/src/index.ts`
- Storybook canonical story groups in `apps/docs/src/stories/`
- playground testing routes in `apps/playground/src/testing/routes/TestingHarnessView.vue`
- playground lab entries in `tools/governance/catalog/playground-lab-manifest.mjs`
- unit and browser-level tests

`@ww/core` may depend on `@ww/primitives`, `@ww/themes`, and `@ww/tokens`. It must not import systems, widgets, page templates, or apps.
