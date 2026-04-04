# @ww/core

`@ww/core` is the baseline reusable component layer.

It owns:

- buttons:
  `UiButton`, `UiButtonGroup`, `UiIconButton`
- layout utilities:
  `UiFlex`, `UiGrid`, `UiSpace`, `UiAffix`, `UiScrollArea`, `UiScrollTop`
- fields
- numeric, slider, listbox, and autocomplete field surfaces:
  `UiNumberInput`, `UiSlider`, `UiRangeSlider`, `UiSelect`, `UiAutocomplete`
- selection controls:
  `UiCheckbox`, `UiSwitch`, `UiRadio`, `UiRadioGroup`
- display components:
  `UiAvatar`, `UiAvatarGroup`, `UiBadge`, `UiCard`, `UiDivider`, `UiImage`, `UiProgress`, `UiSkeleton`, `UiSpinner`, `UiTable`, `UiTag`
- feedback and disclosure components:
  `UiEmptyState`, `UiAlert`, `UiCollapse`, `UiCollapsePanel`
- navigation components:
  `UiTabsRoot`, `UiTabsList`, `UiTabsTrigger`, `UiTabsPanel`, `UiBreadcrumb`, `UiAnchor`, `UiMenu`, `UiPagination`, `UiSteps`
- overlay surfaces:
  `UiDialog`, `UiDrawer`, `UiTooltip`, `UiPopover`, `UiPopconfirm`, `UiDropdown`, `UiContextMenu`, `UiToast`
- tokenized styles that consume semantic and component CSS variables
- shared style entrypoints such as `styles.css` and `motion.css`

## UiButtonGroup

`UiButtonGroup` clusters adjacent `UiButton` and `UiIconButton` surfaces without creating a second
selection runtime.

Use it for:

- attached action seams
- loose or wrapped secondary action clusters
- full-width grouped actions

Out of scope:

- segmented selection state ownership
- toolbar roving-focus orchestration
- product-specific action bars

## UiPopconfirm

`UiPopconfirm` is the confirmation specialization of the shared floating overlay runtime.

Use it for:

- destructive or approval gating beside a trigger
- short confirmation copy with explicit confirm and cancel actions
- lightweight confirmation that does not justify a modal dialog

Out of scope:

- async mutation orchestration
- multi-step workflows
- product-specific confirm copy systems

## UiContextMenu

`UiContextMenu` extends the governed menu contract with pointer-anchored placement.

Use it for:

- contextual actions opened by right click
- keyboard invocation through the Context Menu key or `Shift+F10`
- menu-driven secondary actions that reuse `UiMenu` semantics

Out of scope:

- tree/file-browser orchestration
- submenu systems beyond the current single-level contract
- app-shell navigation ownership

## UiFlex / UiGrid / UiSpace

`UiFlex`, `UiGrid`, and `UiSpace` are utility-only layout surfaces inside `@ww/core`.

Use them for:

- token-driven inline and stacked spacing
- responsive card and metadata groupings inside reusable surfaces
- compact control rows without escalating into page-template shells

`UiGrid` owns responsive spans through its governed `items` model; `UiFlex` and `UiSpace` stay slot-first utility wrappers.

Out of scope:

- app-shell framing
- route-aware structural layout
- replacing `@ww/page-templates` shell contracts

## UiImage

`UiImage` is the governed base image surface inside `@ww/core`.

Use it for:

- themed image framing with caption and fallback support
- explicit `fit` and aspect-ratio control inside reusable cards and content blocks
- display-only media without promoting preview or gallery runtime into core

Out of scope:

- zoom, rotate, lightbox, or preview groups
- upload, transport, or async media orchestration
- media galleries that deserve separate overlay scope

## UiSlider / UiRangeSlider

`UiSlider` and `UiRangeSlider` are governed field surfaces for single-value and two-thumb range input.

Use them for:

- numeric adjustment where direct dragging and keyboard stepping are both first-class
- bounded ranges that need `min`, `max`, `step`, `minRange`, and optional marks
- field-aware input where optional numeric editing should stay inside the same sanctioned surface family

Out of scope:

- chart brushing, timeline orchestration, or canvas-heavy interactions
- date or time picking semantics
- analytics-specific labeling or business-rule validation beyond the numeric bounds contract

## UiAffix / UiScrollArea / UiScrollTop / UiAnchor

`UiAffix`, `UiScrollArea`, `UiScrollTop`, and `UiAnchor` are the governed scroll and section-navigation utilities inside `@ww/core`.

Use them for:

- sticky utility content inside sanctioned scroll containers
- explicit scroll regions with tokenized scrollbar styling and imperative viewport control
- opt-in return-to-top affordances scoped to a known target
- section navigation that keeps active-link tracking and smooth scrolling inside the reusable layer

Out of scope:

- shell-level route scroll orchestration
- virtualized or infinite scrolling systems
- document viewer, knowledge-base, or product-specific content navigation runtimes

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
