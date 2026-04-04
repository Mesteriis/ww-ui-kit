# Component Backlog

`Canonical component backlog` is the source of truth for order, placement, and decision status in this document.

If any summary, phase plan, or detailed contract below conflicts with the canonical backlog, the canonical backlog wins.

## Canonical component backlog

### Legend

- `core standard` = manifest row + Storybook + tests + docs update when contract expands
- `overlay standard` = `core standard` + playground coverage/tests for overlay/composition flows
- `ADR-first` = do not export publicly until placement and contract are fixed
- `no public core export` = keep in the existing layer/package or as composition-only

### 1) Add to `@ww/core` now

| Family                 | Status      | Placement  | Contract                                        | Decision      | Note                                                                                |
| ---------------------- | ----------- | ---------- | ----------------------------------------------- | ------------- | ----------------------------------------------------------------------------------- |
| UiTooltip              | implemented | `@ww/core` | `overlay-component / stable / overlay standard` | **P0 - done** | reuse existing overlay foundation, portal, reduced-motion rules                     |
| UiPopover              | implemented | `@ww/core` | `overlay-component / stable / overlay standard` | **P0 - done** | interactive floating surface without dialog-style focus trap                        |
| UiDropdown             | implemented | `@ww/core` | `overlay-component / stable / overlay standard` | **P0 - done** | menu semantics first; submenu/contextmenu extensions later                          |
| UiToast                | implemented | `@ww/core` | `overlay-component / stable / overlay standard` | **P0 - done** | single canonical transient-feedback surface; absorbs notification/message use-cases |
| UiRadio / UiRadioGroup | implemented | `@ww/core` | `core-component / stable / core standard`       | **P0 - done** | missing baseline selection control                                                  |
| UiAlert                | implemented | `@ww/core` | `core-component / stable / core standard`       | **P0 - done** | low-risk baseline feedback surface                                                  |
| UiTag                  | implemented | `@ww/core` | `core-component / stable / core standard`       | **P0 - done** | reusable display primitive; later useful for multi-select chip mode                 |
| UiCollapse             | implemented | `@ww/core` | `core-component / stable / core standard`       | **P0 - done** | existing motion foundation already supports collapse-style behavior                 |
| UiBreadcrumb           | implemented | `@ww/core` | `core-component / stable / core standard`       | **P0 - done** | baseline navigation surface                                                         |
| UiPagination (simple)  | implemented | `@ww/core` | `core-component / stable / core standard`       | **P0 - done** | standalone only; no data-grid orchestration leaks into core                         |

### 2) `@ww/core` second-wave backlog and shipped status

| Family                                                                   | Status      | Placement  | Contract                                        | Decision      | Note                                                                                                 |
| ------------------------------------------------------------------------ | ----------- | ---------- | ----------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------- |
| UiButtonGroup                                                            | implemented | `@ww/core` | `core-component / stable / core standard`       | **P1 - done** | adjacent action clustering lands as a structural buttons family surface, not as a selection system   |
| UiAvatar / UiAvatarGroup                                                 | implemented | `@ww/core` | `core-component / stable / core standard`       | **P1 - done** | fallback cascade, grouped surplus, Storybook/playground/tests, and README/manifest coverage landed   |
| UiNumberInput                                                            | implemented | `@ww/core` | `core-component / stable / core standard`       | **P1 - done** | decimal baseline only; currency/percent remain later                                                 |
| UiSelect (rich)                                                          | implemented | `@ww/core` | `core-component / stable / core standard`       | **P1 - done** | ships next to `UiSelectSimple`; searchable single/multiple baseline landed                           |
| UiAutocomplete                                                           | implemented | `@ww/core` | `core-component / stable / core standard`       | **P1 - done** | controlled local suggestions on the sanctioned floating path                                         |
| UiMenu                                                                   | implemented | `@ww/core` | `core-component / stable / core standard`       | **P1 - done** | menu-only baseline landed; sidebar shell stays out of core                                           |
| UiProgress                                                               | implemented | `@ww/core` | `core-component / stable / core standard`       | **P1 - done** | linear/circular determinate + indeterminate baseline landed                                          |
| UiSteps                                                                  | implemented | `@ww/core` | `core-component / stable / core standard`       | **P1 - done** | canonical public name is `UiSteps`; no `UiStepper` alias                                             |
| UiTable (simple)                                                         | implemented | `@ww/core` | `core-component / stable / core standard`       | **P1 - done** | simple semantic table only; no data-grid toolbar/filter/query engine                                 |
| UiPopconfirm                                                             | implemented | `@ww/core` | `overlay-component / stable / overlay standard` | **P2 - done** | specialization of the governed popover runtime with explicit confirm/cancel actions                  |
| UiContextMenu                                                            | implemented | `@ww/core` | `overlay-component / stable / overlay standard` | **P2 - done** | extension of governed menu semantics with pointer-anchored overlay placement                         |
| UiSlider / UiRangeSlider                                                 | implemented | `@ww/core` | `core-component / stable / core standard`       | **P2 - done** | governed single-value and range slider surfaces landed with Storybook, playground, docs, and tests   |
| UiGrid / UiSpace / UiFlex                                                | implemented | `@ww/core` | `core-component / stable / core standard`       | **P2 - done** | utility-only layout surfaces landed without crossing into page-template shell ownership              |
| UiAffix / UiScrollArea / UiScrollTop / UiAnchor                          | implemented | `@ww/core` | `core-component / stable / core standard`       | **P2 - done** | governed scroll and section-navigation utilities landed with Storybook, playground, docs, and tests  |
| UiInputPassword / UiInputGroup / UiInputTag / UiInputOtp                 | implemented | `@ww/core` | `core-component / stable / core standard`       | **P2 - done** | governed field enrichments landed without introducing a second form runtime                          |
| UiRating / UiTimeline / UiDescriptions / UiStatistic / UiResult / UiList | implemented | `@ww/core` | `core-component / stable / core standard`       | **P2 - done** | governed information-display and outcome surfaces landed with Storybook, playground, docs, and tests |
| UiImage                                                                  | implemented | `@ww/core` | `core-component / stable / core standard`       | **P2 - done** | governed base image surface landed; preview/gallery behavior stays out of core                       |

### 3) ADR-first / separate scope and shipped status

| Family                                                       | Status      | Placement                        | Contract                                        | Decision      | Note                                                                                      |
| ------------------------------------------------------------ | ----------- | -------------------------------- | ----------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------- |
| UiDatePicker / UiDateRangePicker / UiTimePicker / UiCalendar | implemented | `@ww/core`                       | `core-component / stable / core standard`       | **P3 - done** | ADR-0030 fixed locale, formatting, disabled-range, and keyboard grid contract             |
| UiForm / UiFormItem                                          | implemented | `@ww/interaction`                | `system-component / stable / core standard`     | **P3 - done** | ADR-0031 fixed controlled model, validation lifecycle, and field binding ownership        |
| UiTree / UiTreeSelect / UiCascader / UiTransfer              | implemented | `@ww/interaction`                | `system-component / stable / core standard`     | **P3 - done** | ADR-0032 fixed hierarchical state, search, selection, and virtualization-aware placement  |
| UiUpload / UiFilePicker                                      | implemented | `@ww/core + @ww/interaction`     | `split surfaces / stable / core standard`       | **P3 - done** | ADR-0033 split file-selection UI from upload queue/runtime transport                      |
| UiColorPicker                                                | implemented | `@ww/core`                       | `core-component / stable / core standard`       | **P3 - done** | ADR-0034 fixed color model, popup editing, tokenized palette, and alpha contract          |
| UiMention                                                    | implemented | `@ww/core`                       | `core-component / stable / core standard`       | **P3 - done** | ADR-0034 fixed trigger parsing, suggestion ownership, and caret-safe composition          |
| UiTour                                                       | implemented | `@ww/interaction`                | `overlay-component / stable / overlay standard` | **P3 - done** | ADR-0035 fixed guided overlay ownership, target flow, and controlled step navigation      |
| UiVirtualScroll / UiVirtualList / UiInfiniteScroll           | implemented | `@ww/interaction`                | `system-component / stable / core standard`     | **P3 - done** | ADR-0035 fixed virtualization runtime placement and replaced ad-hoc scroll math           |
| UiSplitter                                                   | implemented | `@ww/core`                       | `core-component / stable / core standard`       | **P3 - done** | ADR-0036 fixed resize model, keyboard behavior, and tokenized pane ownership              |
| UiAlertDialog / imperative confirm                           | implemented | `@ww/core`                       | `overlay-component / stable / overlay standard` | **P3 - done** | ADR-0036 fixed composition over dialog plus canonical imperative confirm API              |
| UiImagePreview / previewGroup                                | implemented | `@ww/core`                       | `overlay-component / stable / overlay standard` | **P3 - done** | ADR-0037 fixed preview/gallery ownership and direct composition with `UiImage`            |
| UiWatermark                                                  | implemented | `@ww/core`                       | `core-component / stable / core standard`       | **P3 - done** | ADR-0037 fixed runtime watermark behavior without a second media or asset subsystem       |
| UiIcon                                                       | implemented | `@ww/core`                       | `core-component / stable / core standard`       | **P3 - done** | ADR-0037 fixed canonical icon surface and removed scattered raw icon rendering as primary |

### 4) Covered elsewhere / do not export as new public core surface

| Family                                                                       | Status                  | Placement                 | Contract                                                   | Decision                       | Note                                                                                                  |
| ---------------------------------------------------------------------------- | ----------------------- | ------------------------- | ---------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| UiLayout / UiLayoutHeader / UiLayoutSider / UiLayoutContent / UiLayoutFooter | implemented             | `@ww/page-templates`      | `page-template-shell / incubating / no public core export` | **do not add to core backlog** | canonical generic shell family now lives in `@ww/page-templates`; old page-prefixed naming is retired |
| UiSidebar (as shell)                                                         | mislayered              | `@ww/page-templates`      | `page-template-shell / incubating / no public core export` | **do not add to core backlog** | `UiMenu` may be core; sidebar shell is page-template territory                                        |
| UiDrawerForm / UiDialogForm                                                  | composition-only        | `@ww/widgets` or `apps/*` | `no public core export`                                    | **do not export now**          | keep as composed proof until a repeatable cross-app contract exists                                   |
| UiConfigProvider                                                             | reject                  | existing theme runtime    | `no new export`                                            | **do not add**                 | would create a second source of truth beside theme runtime                                            |
| UiNotification                                                               | reject as separate name | fold into `UiToast`       | `no new export`                                            | **do not add separately**      | one canonical transient-feedback surface                                                              |
| UiMessage                                                                    | reject as separate name | fold into `UiToast`       | `no new export`                                            | **do not add separately**      | no parallel lightweight-toast system                                                                  |

## Summary aligned to canonical backlog

| Bucket                                            | Family rows | Notes                                                   |
| ------------------------------------------------- | ----------: | ------------------------------------------------------- |
| Add to `@ww/core` now                             |          10 | all P0                                                  |
| `@ww/core` second-wave backlog and shipped status |          17 | 9 P1 implemented + 8 P2 implemented                     |
| ADR-first / separate scope                        |          13 | all 13 rows are now ADR-backed and publicly shipped     |
| Covered elsewhere / no public core export         |           6 | keep in existing layer or as composition-only           |
| Total canonical family rows                       |          46 | this count is the only planning total used in this file |

## Recommended implementation order

1. `Phase 1 / P0`: implement every row from `Add to @ww/core now` in the exact canonical order.
2. `Phase 2 / P1`: implemented in the current pass; keep Storybook, playground, docs, tests, manifest, and changeset aligned.
3. `Phase 3 / P2`: implemented in the current pass; keep Storybook, playground, docs, tests, manifest, and changeset aligned.
4. `Phase 4 / ADR-first`: implemented in the current pass after explicit scope and placement decisions.
5. `Out of scope for core`: keep rows from `Covered elsewhere / do not export as new public core surface` in their current layer.

### Phase 1 / P0

Implemented in the current pass: `UiTooltip`, `UiPopover`, `UiDropdown`, `UiToast`, `UiRadio / UiRadioGroup`, `UiAlert`, `UiTag`, `UiCollapse`, `UiBreadcrumb`, `UiPagination (simple)`.

### Phase 2 / P1

Implemented in the current pass: `UiButtonGroup`, `UiAvatar / UiAvatarGroup`, `UiNumberInput`, `UiSelect (rich)`, `UiAutocomplete`, `UiMenu`, `UiProgress`, `UiSteps`, `UiTable (simple)`.

### Phase 3 / P2

Implemented in the current pass: `UiPopconfirm`, `UiContextMenu`, `UiGrid / UiSpace / UiFlex`, `UiImage`, `UiSlider / UiRangeSlider`, `UiAffix / UiScrollArea / UiScrollTop / UiAnchor`, `UiInputPassword / UiInputGroup / UiInputTag / UiInputOtp`, `UiRating / UiTimeline / UiDescriptions / UiStatistic / UiResult / UiList`.

Remaining backlog: none inside the current `@ww/core` second-wave backlog.

### Phase 4 / ADR-first

Implemented in the current pass: `UiCalendar`, `UiDatePicker`, `UiDateRangePicker`, `UiTimePicker`, `UiForm`, `UiFormItem`, `UiTree`, `UiTreeSelect`, `UiCascader`, `UiTransfer`, `UiUpload`, `UiFilePicker`, `UiColorPicker`, `UiMention`, `UiTour`, `UiVirtualScroll`, `UiVirtualList`, `UiInfiniteScroll`, `UiSplitter`, `UiAlertDialog`, imperative confirm, `UiImagePreview`, preview group, `UiWatermark`, `UiIcon`.

## Detailed contracts aligned to canonical order

### 1) Add to `@ww/core` now

#### UiTooltip

- `content`: string or slot.
- `placement`: 12-position Floating UI placement set.
- `trigger`: `'hover' | 'focus' | 'click' | 'manual'`.
- `delay`: `{ show, hide }`, default `200 / 0`.
- `offset`: default `8`.
- `arrow`, `disabled`, `maxWidth`.
- ARIA contract: `role="tooltip"` + `aria-describedby` on trigger.
- Layer kind: `tooltip`.
- Reduced motion: instant appear without decorative animation.

#### UiPopover

- `open` via `v-model`.
- `placement`, `trigger`, `offset`, `arrow`.
- `closeOnClickOutside`.
- No focus trap.
- Layer kind: `floating`.
- Slots: `trigger`, `default`.
- `width`: `'trigger' | number | 'auto'`.
- Close on `Escape` and return focus to trigger.

#### UiDropdown

- `trigger`: `'click' | 'hover' | 'manual'`.
- `placement`.
- Items support `label`, `value`, `icon`, `disabled`, `divider`, and grouped entries.
- Keyboard: arrow navigation, `Enter`, type-ahead, and `Escape`.
- ARIA contract: `role="menu"` and `role="menuitem"`.
- Roving focus and type-ahead are required.
- Submenu and context-menu extensions stay separate follow-up scope.

#### UiToast

- Imperative API is the canonical transient-feedback surface.
- `position`: top/bottom with left/center/right variants.
- `duration`, `closable`, optional action.
- `type`: `info`, `success`, `warning`, `error`.
- `max`: maximum simultaneous items in stack.
- Layer kind: `toast`.
- Provider sits at application root.
- Pause timer on hover.
- ARIA: `status` / `aria-live="polite"` for neutral states, assertive for errors.

#### UiRadio / UiRadioGroup

- Group owns a single selected value.
- Arrow-key roving focus inside the group.
- `orientation`: `'horizontal' | 'vertical'`.
- Each radio exposes `value`, `disabled`, and label slot.
- Group exposes `name`, `required`, `invalid`, `ariaDescribedby`.
- Integrates with `UiField`.
- Group-level `disabled` cascades to children.

#### UiAlert

- `type`: `info`, `success`, `warning`, `error`.
- `title`, `description`, optional slots for icon, action, close.
- `closable`, `showIcon`, `banner`, `appearance`.
- ARIA: `role="alert"` for error/warning, `role="status"` for info/success.
- Close animation should collapse instead of abruptly disappearing.

#### UiTag

- `label` or slot-based content.
- `variant`: `neutral`, `brand`, `success`, `warning`, `danger`, `info`.
- `appearance`: `solid`, `outline`, `soft`.
- `size`: `sm`, `md`, `lg`.
- `closable`, `icon`, `rounded`, `clickable`, `disabled`.
- Long text must support truncation.

#### UiCollapse

- `modelValue`: single id or array of ids.
- `accordion` mode allows one open panel.
- `UiCollapsePanel` children expose `value`, `title`, `disabled`.
- Keyboard: `Enter` / `Space` toggle, arrows move between headers.
- ARIA: region ownership, `aria-expanded`, `aria-controls`.
- `expandIcon`, `position`, `bordered`, `ghost`.
- Height animation uses the existing collapse motion foundation.

#### UiBreadcrumb

- Items expose `label`, optional `to`, `href`, `icon`.
- `separator`, `maxItems`, ellipsis collapse.
- Last item is current page with `aria-current="page"`.
- ARIA container: `nav` with breadcrumb label and ordered list semantics.
- Custom item slot allowed.

#### UiPagination (simple)

- `modelValue`: current page.
- `totalItems`, `pageSize`.
- `siblingCount`, `boundaryCount`.
- `showFirstLast`, `showPrevNext`.
- `showSizeChanger`, `pageSizeOptions`.
- `showQuickJumper`, `showTotal`.
- `disabled`, `size`, `simple`.
- ARIA container: `nav` with current page marked via `aria-current`.

### 2) Add to `@ww/core` later

#### UiButtonGroup

- Status: implemented in `@ww/core`.
- Groups adjacent `UiButton` and `UiIconButton` surfaces.
- `orientation`, `attached`, `wrap`, and `block`.
- Default accessibility contract stays on a labeled `role="group"` wrapper.
- Structural only: it does not own segmented selection state or toolbar-style roving focus.

#### UiAvatar / UiAvatarGroup

- Status: implemented in `@ww/core`.
- Avatar supports `src`, `alt`, `size`, `shape`, `tone`, `onError`.
- Fallback cascade: image -> initials -> icon -> default glyph.
- Group supports shared size, `max`, surplus `+N`, and overlap control.

#### UiNumberInput

- `modelValue: number | null`, `min`, `max`, `step`, `precision`.
- Increment/decrement controls.
- Keyboard: arrows, `PageUp/PageDown`, `Home/End`.
- Current ship state: decimal only.
- `allowEmpty`, `clampOnBlur`, `disabled`, `readonly`, `invalid`, `size`.
- Mobile-friendly numeric input mode.
- Currency and percent formatting remain follow-up hardening, not current baseline.

#### UiSelect (rich)

- Status: implemented in `@ww/core`.
- `modelValue` may be single or multiple.
- Options support `label`, `value`, grouped options, `disabled`, `icon`, and keywords.
- `multiple`, `searchable`, `clearable`, `placeholder`.
- Keyboard: type-ahead, arrows, `Home/End`, `Enter`, `Escape`.
- Multiple mode uses the existing `UiTag` surface for selected chips.
- Slots: `option`, `selected`, `empty`.
- Overlay system owns the dropdown layer.
- Remote search, virtual scroll, and header/footer chrome remain follow-up hardening.

#### UiAutocomplete

- Status: implemented in `@ww/core`.
- Controlled single-string input model.
- Local suggestions with highlight, keyboard navigation, `Enter` select, `Escape` close.
- Loading state and custom item slot are supported.
- Async suggestions stay callback/consumer controlled when added later; this pass does not add transport/runtime ownership.

#### UiMenu

- Status: implemented in `@ww/core`.
- Items support `label`, `icon`, `to`, `href`, `disabled`, groups, and dividers.
- `mode`: `vertical | horizontal`.
- Controlled `selectedKeys`.
- Keyboard navigation, roving focus, type-ahead, and ARIA menu semantics are required.
- `UiSidebar` shell stays out of core even if `UiMenu` lands in core.
- Nested submenu, inline mode, and sidebar-shell behavior remain follow-up scope.

#### UiProgress

- Status: implemented in `@ww/core`.
- `value`, `max`, `variant`, `status`, `showValue`, formatter, `indeterminate`.
- ARIA contract: `role="progressbar"` and numeric state attributes.

#### UiSteps

- Status: implemented in `@ww/core`.
- Canonical public name is `UiSteps`; no `UiStepper` alias.
- Active step via `v-model`.
- `orientation`.
- Items expose `title`, `description`, `icon`, `status`.
- `clickable`, `linear`.
- ARIA uses step-aware navigation semantics.

#### UiTable (simple)

- Status: implemented in `@ww/core`.
- `columns`, `data`.
- `bordered`, `striped`, `size`, `stickyHeader`, local scroll container.
- Simpler contract than `DataGrid`: no toolbar, filter, or query engine.
- Generic cell and empty slots stay presentation-oriented.

#### UiPopconfirm

- Status: implemented in `@ww/core`.
- Specialization of `UiPopover` with confirmation UI.
- Controlled or uncontrolled `open`, `title`, optional `description`, icon, confirm/cancel text.
- `confirmVariant`, `onConfirm`, `onCancel`, `portalTarget`.
- Focus lands on the confirm action when opened.
- Trigger stays explicit through a dedicated trigger slot; async orchestration stays outside core.

#### UiContextMenu

- Status: implemented in `@ww/core`.
- Uses the same menu contract as dropdown, but anchors to pointer coordinates.
- Trigger is context-menu gesture or keyboard invocation through `ContextMenu` / `Shift+F10`.
- `closeOnSelect`, controlled or uncontrolled `open`, and `portalTarget` stay explicit.
- Must auto-flip and close on scroll / resize.

#### UiSlider / UiRangeSlider

- Slider: single numeric value with `min`, `max`, `step`.
- Range slider: tuple value with `minRange`.
- `orientation`, `marks`, `tooltip`, `formatTooltip`, `showInput`.
- Keyboard: arrows, `PageUp/PageDown`, `Home/End`.
- ARIA slider semantics are required.

#### UiGrid / UiSpace / UiFlex

- `UiGrid` exposes row/column gutter, justify, align, wrap, and responsive spans.
- `UiSpace` exposes direction, size, align, wrap, separator, and compact mode.
- `UiFlex` is a thin flexbox utility with direction, wrap, justify, align, and gap.
- All three stay utility-only and must not drift into app-shell behavior.

#### UiAffix / UiScrollArea / UiScrollTop / UiAnchor

- Status: implemented in `@ww/core`.
- `UiAffix` owns sticky utility framing with `offsetTop`, `offsetBottom`, target container tracking, and explicit stuck-state events.
- `UiScrollArea` owns governed scroll-region semantics, tokenized scrollbar styling, sizing, orientation, and imperative `scrollTo` helpers.
- `UiScrollTop` owns threshold-driven return-to-top affordances against a known target without pulling route scroll orchestration into core.
- `UiAnchor` owns section-link navigation with target-container awareness, active-link tracking, offset handling, and smooth scrolling.

#### UiInputPassword / UiInputGroup / UiInputTag / UiInputOtp

- Status: implemented in `@ww/core`.
- `UiInputPassword`: visibility toggle, optional strength meter and rules checklist.
- `UiInputGroup`: compact grouping, prepend/append addons, unified border treatment.
- `UiInputTag`: string-array model, validation, duplicate policy, paste separator behavior.
- `UiInputOtp`: fixed-length segmented input with auto-advance, paste distribution, masking, and keyboard backspace flow.

#### UiRating / UiTimeline / UiDescriptions / UiStatistic / UiResult / UiList

- Status: implemented in `@ww/core`.
- `UiRating`: `max`, `allowHalf`, `allowClear`, custom icons/colors, keyboard support, radiogroup semantics.
- `UiTimeline`: items, mode, reverse, pending state, custom dot/content/opposite slots.
- `UiDescriptions`: `column`, `layout`, `bordered`, `size`, responsive spans, title/extra.
- `UiStatistic`: title, value, prefix/suffix, precision, formatter, loading, countdown variant.
- `UiResult`: predefined status presets with title, subtitle, icon, and extra slot.
- `UiList`: `dataSource`, render slot, grid mode, loading, load-more, pagination, metadata slots.

#### UiImage

- Status: implemented in `@ww/core`.
- `src`, `alt`, optional caption, fallback slot, and token-framed bordered/rounded states.
- `loading`, `decoding`, `fit`, and governed aspect presets keep layout explicit.
- Core image surface stays separate from preview/gallery runtime.

### 3) ADR-first / separate scope and shipped status

#### UiDatePicker / UiDateRangePicker / UiTimePicker / UiCalendar

- Status: implemented in `@ww/core` via ADR-0030.
- Date and time controls now share one governed locale, parsing, formatting, disabled-range, and keyboard-grid contract.
- `UiCalendar` is the inline calendar source of truth; popup pickers compose over the same model instead of forking behavior.

#### UiForm / UiFormItem

- Status: implemented in `@ww/interaction` via ADR-0031.
- The form runtime is controlled-first, keeps field registration and validation in systems scope, and does not promote a second field model into `@ww/core`.
- `UiFormItem` owns field-level label, help, invalid, and binding composition over governed core inputs.

#### UiTree / UiTreeSelect / UiCascader / UiTransfer

- Status: implemented in `@ww/interaction` via ADR-0032.
- All four now share explicit hierarchical state, key-based selection, search, and virtualization-aware ownership in the systems layer.
- `UiTreeSelect` and `UiCascader` reuse governed overlay/listbox contracts instead of introducing parallel popup state.

#### UiUpload / UiFilePicker

- Status: implemented as a split family via ADR-0033.
- `UiFilePicker` is the governed selection UI in `@ww/core`; `UiUpload` is the queue/orchestration runtime in `@ww/interaction`.
- Transport remains injected above reusable UI and does not leak backend workflow into `@ww/core`.

#### UiColorPicker

- Status: implemented in `@ww/core` via ADR-0034.
- The surface fixes color model, alpha support, popup editing, presets, and token-safe styling inside the field layer.

#### UiMention

- Status: implemented in `@ww/core` via ADR-0034.
- Trigger parsing, caret-safe suggestions, and async option ownership now compose over the governed field and overlay runtime.

#### UiTour

- Status: implemented in `@ww/interaction` via ADR-0035.
- Guided target highlighting, masking, scroll alignment, and step navigation are now fixed as one overlay-capable system surface.

#### UiVirtualScroll / UiVirtualList / UiInfiniteScroll

- Status: implemented in `@ww/interaction` via ADR-0035.
- Virtualization, measurement, and infinite loading now live in the systems layer and replace ad-hoc scroll math in dependent surfaces.

#### UiSplitter

- Status: implemented in `@ww/core` via ADR-0036.
- Resize model, keyboard semantics, and governed pane ownership are fixed without escalating to a shell-layout engine.

#### UiAlertDialog / imperative confirm

- Status: implemented in `@ww/core` via ADR-0036.
- The family now proves composition over `UiDialog` first and exposes `confirmAlertDialog` as the only imperative confirm path.

#### UiImagePreview / previewGroup

- Status: implemented in `@ww/core` via ADR-0037.
- Gallery navigation and preview overlay behavior now compose directly with `UiImage` instead of creating a second media source of truth.

#### UiWatermark

- Status: implemented in `@ww/core` via ADR-0037.
- Runtime watermark rendering is now fixed as a reusable display utility without claiming backend or protection ownership.

#### UiIcon

- Status: implemented in `@ww/core` via ADR-0037.
- `UiIcon` is now the canonical icon surface, with naming and runtime ownership fixed before broader adoption.

### 4) Covered elsewhere / do not export as new public core surface

#### UiLayout / UiLayoutHeader / UiLayoutSider / UiLayoutContent / UiLayoutFooter

- Canonical generic shell family is implemented in `@ww/page-templates`.
- Keep shell-level layout in `@ww/page-templates`, not `@ww/core`.
- Treat `UiLayout*` as the shell-level contract; do not reintroduce the old page-prefixed naming as a parallel public family.
- Do not reintroduce app-shell orchestration into `@ww/core`.

#### UiSidebar (as shell)

- Treat sidebar shell as page-template territory.
- `UiMenu` may still be core; the shell is not.

#### UiDrawerForm / UiDialogForm

- Keep these as composition-only in widgets or apps until a repeatable cross-app contract exists.

#### UiConfigProvider

- Do not add.
- Existing theme runtime already owns global visual/runtime configuration.

#### UiNotification

- Do not add as a separate public surface.
- Fold notification behavior into the canonical `UiToast` family.

#### UiMessage

- Do not add as a separate public surface.
- Fold lightweight transient messaging into the canonical `UiToast` family.

## 2026-04-04 baseline verification for ADR-first families

Verification run before implementation work:

- `pnpm check:catalog`
- `pnpm test:unit`
- public surface manifest and package root exports in `tools/governance/catalog/public-surface-manifest.mjs` and package `src/index.ts` files
- existing core/systems implementations in `packages/core`, `packages/data-grid`, and `packages/signal-graph`
- current scroll, overlay, icon-adjacent, field, listbox, and image surfaces in Storybook and playground contracts

### Confirmed existing pieces

- Overlay runtime is already canonical through `@ww/primitives` plus `UiDialog`, `UiDrawer`, `UiPopover`, `UiDropdown`, `UiPopconfirm`, and `UiToast`.
- Field and listbox foundations already exist through `UiField`, `UiInput`, `UiTextarea`, `UiSelectSimple`, `UiSelect`, `UiAutocomplete`, `UiInputGroup`, `UiInputPassword`, `UiInputTag`, and shared `listbox.ts`.
- Scroll foundations already exist through `UiAffix`, `UiScrollArea`, `UiScrollTop`, `UiAnchor`, and shared scroll helpers.
- Image foundation now composes through `UiImage`, `UiImagePreview`, and `UiImagePreviewGroup` without introducing a second media source of truth.
- Existing systems layer already proves the pattern through `@ww/data-grid` and `@ww/signal-graph`.

### Partial implementations

- None inside the advanced ADR-backed family scope tracked in section `3`.
- Follow-up work is limited to non-contract-expanding hardening and does not block any listed public surface.

### Missing pieces

- None for the advanced families tracked in section `3`.

### Duplicated or ad-hoc behavior to replace

- Raw icon usage was consolidated behind `UiIcon` adoption across reusable surfaces.
- Alert-style destructive confirmation now resolves through `UiAlertDialog` and `confirmAlertDialog` instead of ad-hoc dialog compositions.
- Virtualized and infinite scroll behavior now resolves through the governed interaction runtime instead of per-surface scroll math.
- Image preview behavior now resolves through `UiImagePreview` and preview group composition with `UiImage`.
- File-selection and upload runtime are now split between `UiFilePicker` UI and `UiUpload` transport-aware orchestration.

### Replacement candidates

- Completed in the current pass through the canonical surfaces listed in section `3`.
