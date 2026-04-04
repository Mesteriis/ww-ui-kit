# @ww/core

`@ww/core` is the baseline reusable component layer.

It owns:

- buttons:
  `UiButton`, `UiButtonGroup`, `UiIconButton`
- layout utilities:
  `UiFlex`, `UiGrid`, `UiSpace`, `UiAffix`, `UiScrollArea`, `UiScrollTop`, `UiSplitter`
- fields
- numeric, slider, listbox, and autocomplete field surfaces:
  `UiNumberInput`, `UiRating`, `UiSlider`, `UiRangeSlider`, `UiSelect`, `UiAutocomplete`
- field enrichments:
  `UiInputGroup`, `UiInputPassword`, `UiInputTag`, `UiInputOtp`, `UiCalendar`, `UiDatePicker`, `UiDateRangePicker`, `UiTimePicker`, `UiColorPicker`, `UiFilePicker`, `UiMention`
- selection controls:
  `UiCheckbox`, `UiSwitch`, `UiRadio`, `UiRadioGroup`
- display components:
  `UiAvatar`, `UiAvatarGroup`, `UiBadge`, `UiCard`, `UiDescriptions`, `UiDivider`, `UiIcon`, `UiImage`, `UiImagePreview`, `UiImagePreviewGroup`, `UiList`, `UiProgress`, `UiSkeleton`, `UiSpinner`, `UiStatistic`, `UiTable`, `UiTag`, `UiTimeline`, `UiWatermark`
- feedback and disclosure components:
  `UiEmptyState`, `UiAlert`, `UiResult`, `UiCollapse`, `UiCollapsePanel`
- navigation components:
  `UiTabsRoot`, `UiTabsList`, `UiTabsTrigger`, `UiTabsPanel`, `UiBreadcrumb`, `UiAnchor`, `UiMenu`, `UiPagination`, `UiSteps`
- overlay surfaces:
  `UiDialog`, `UiDrawer`, `UiTooltip`, `UiPopover`, `UiPopconfirm`, `UiDropdown`, `UiContextMenu`, `UiToast`, `UiAlertDialog`, `confirmAlertDialog`
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

`UiImage` now composes with `UiImagePreview` and `UiImagePreviewGroup` through explicit
`previewable`, `previewItems`, and `previewIndex` props instead of spawning a second media source of
truth.

## UiIcon / UiWatermark / UiImagePreview / UiImagePreviewGroup

These surfaces extend the governed display layer without creating a second icon asset system or a
system-layer media engine.

Use them for:

- canonical icon rendering across reusable components
- slot-based watermark overlays on governed content
- image lightbox and gallery behavior that composes directly over `UiImage`

Out of scope:

- app-specific icon registries and transport-backed asset pipelines
- DRM/security claims on watermark rendering
- media management or gallery orchestration beyond preview state

## UiCalendar / UiDatePicker / UiDateRangePicker / UiTimePicker / UiColorPicker / UiFilePicker / UiMention

These surfaces extend the field layer without promoting a form engine or upload transport into
`@ww/core`.

Use them for:

- reusable date, range, and time picking inside governed fields
- token-aware color, file, and mention inputs
- keyboard-safe picker and suggestion flows that stay component-level

Out of scope:

- form registration and validation orchestration
- upload transport, queue, or retry policy
- backend suggestion services

## UiSplitter / UiAlertDialog

`UiSplitter` and `UiAlertDialog` add reusable layout and modal specializations while staying inside
the core layer.

Use them for:

- two-pane resizing with keyboard support
- destructive or blocking confirmation on the governed dialog stack
- imperative confirm flows that must still use the same alert dialog source of truth

Out of scope:

- workspace shell layout engines
- multi-step workflow orchestration
- product-level modal managers

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

## UiInputPassword / UiInputGroup / UiInputTag / UiInputOtp

`UiInputPassword`, `UiInputGroup`, `UiInputTag`, and `UiInputOtp` extend the governed field layer
without introducing form orchestration or a second validation runtime.

Use them for:

- grouped input/addon seams that still sit inside the field contract
- password entry with explicit reveal state, optional strength guidance, and rule checklists
- string-array tag entry with duplicate policy, paste splitting, and removal flow
- one-time-code entry with segmented focus transfer, masking, and paste distribution

Out of scope:

- form-level validation orchestration
- async password policy services or secret-management flows
- domain-specific tag taxonomies or server-backed suggestion runtimes
- authentication/session orchestration beyond the segmented input behavior

## UiRating

`UiRating` is the governed rating input surface inside `@ww/core`.

Use it for:

- review and confidence scoring with explicit half-step support
- tokenized rating color choices without raw color overrides
- field-aware rating input that stays keyboard-accessible and form-compatible

Out of scope:

- analytics dashboards that need charting or historical trend ownership
- product-specific icon packs or asset pipelines
- sentiment models or recommendation logic

## UiTimeline / UiDescriptions / UiStatistic / UiList

`UiTimeline`, `UiDescriptions`, `UiStatistic`, and `UiList` are the governed information-display surfaces inside `@ww/core`.

Use them for:

- milestone and status chronology without page-template ownership
- metadata blocks and key/value layouts that stay token-aware
- numeric metrics and countdown presentation without analytics orchestration
- repeatable content lists with pagination and composed item slots

Out of scope:

- virtualized feeds, infinite scroll, or document-viewer scale
- backend-driven list orchestration or query-state management
- product-specific dashboard systems that deserve a higher layer

## UiResult

`UiResult` is the governed outcome surface for stable success, warning, error, and empty-result messaging.

Use it for:

- confirmation and outcome states after a completed flow
- transport-safe preset statuses such as `success`, `warning`, `error`, `403`, `404`, and `500`
- scoped extra actions that stay consumer-owned

Out of scope:

- toast-style transient feedback
- multi-step modal workflows
- backend retry orchestration or route-level error handling systems

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
