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

| Family                      | Status        | Placement  | Contract                                        | Decision           | Note                                                                                |
| --------------------------- | ------------- | ---------- | ----------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| UiTooltip                   | confirmed gap | `@ww/core` | `overlay-component / stable / overlay standard` | **P0 - build now** | reuse existing overlay foundation, portal, reduced-motion rules                     |
| UiPopover                   | confirmed gap | `@ww/core` | `overlay-component / stable / overlay standard` | **P0 - build now** | interactive floating surface without dialog-style focus trap                        |
| UiDropdown / UiDropdownMenu | confirmed gap | `@ww/core` | `overlay-component / stable / overlay standard` | **P0 - build now** | menu semantics first; submenu/contextmenu extensions later                          |
| UiToast                     | confirmed gap | `@ww/core` | `overlay-component / stable / overlay standard` | **P0 - build now** | single canonical transient-feedback surface; absorbs notification/message use-cases |
| UiRadio / UiRadioGroup      | confirmed gap | `@ww/core` | `core-component / stable / core standard`       | **P0 - build now** | missing baseline selection control                                                  |
| UiAlert                     | confirmed gap | `@ww/core` | `core-component / stable / core standard`       | **P0 - build now** | low-risk baseline feedback surface                                                  |
| UiTag / UiChip              | confirmed gap | `@ww/core` | `core-component / stable / core standard`       | **P0 - build now** | reusable display primitive; later useful for multi-select chip mode                 |
| UiCollapse / UiAccordion    | confirmed gap | `@ww/core` | `core-component / stable / core standard`       | **P0 - build now** | existing motion foundation already supports collapse-style behavior                 |
| UiBreadcrumb                | confirmed gap | `@ww/core` | `core-component / stable / core standard`       | **P0 - build now** | baseline navigation surface                                                         |
| UiPagination (simple)       | confirmed gap | `@ww/core` | `core-component / stable / core standard`       | **P0 - build now** | standalone only; no data-grid orchestration leaks into core                         |

### 2) Add to `@ww/core` later

| Family                                                                   | Status    | Placement  | Contract                                        | Decision | Note                                                               |
| ------------------------------------------------------------------------ | --------- | ---------- | ----------------------------------------------- | -------- | ------------------------------------------------------------------ |
| UiAvatar / UiAvatarGroup                                                 | hardening | `@ww/core` | `core-component / stable / core standard`       | **P1**   | broad utility, but weaker ROI than current floating/selection gaps |
| UiNumberInput                                                            | hardening | `@ww/core` | `core-component / stable / core standard`       | **P1**   | baseline field extension after radio/overlay pass                  |
| UiSelect (rich)                                                          | hardening | `@ww/core` | `core-component / stable / core standard`       | **P1**   | ship next to `UiSelectSimple`; no blind replacement                |
| UiAutocomplete                                                           | hardening | `@ww/core` | `core-component / stable / core standard`       | **P1**   | after listbox/overlay behavior settles                             |
| UiMenu                                                                   | hardening | `@ww/core` | `core-component / stable / core standard`       | **P1**   | menu only; sidebar shell stays out of core                         |
| UiProgress                                                               | hardening | `@ww/core` | `core-component / stable / core standard`       | **P1**   | useful, but not blocking current core story                        |
| UiSteps / UiStepper                                                      | hardening | `@ww/core` | `core-component / stable / core standard`       | **P1**   | navigation pattern, not first-wave infrastructure                  |
| UiTable (simple)                                                         | hardening | `@ww/core` | `core-component / stable / core standard`       | **P1**   | deliberately simple table; no toolbar/filter/query engine          |
| UiPopconfirm                                                             | hardening | `@ww/core` | `overlay-component / stable / overlay standard` | **P2**   | only after popover contract is stable                              |
| UiContextMenu                                                            | hardening | `@ww/core` | `overlay-component / stable / overlay standard` | **P2**   | extension of dropdown/menu semantics                               |
| UiSlider / UiRangeSlider                                                 | hardening | `@ww/core` | `core-component / stable / core standard`       | **P2**   | baseline input, but lower ROI than current gaps                    |
| UiGrid / UiSpace / UiFlex                                                | hardening | `@ww/core` | `core-component / stable / core standard`       | **P2**   | utility layout only, never app-shell replacement                   |
| UiAffix / UiScrollArea / UiScrollTop / UiAnchor                          | hardening | `@ww/core` | `core-component / stable / core standard`       | **P2**   | utility surfaces after baseline controls are closed                |
| UiInputPassword / UiInputGroup / UiInputTag / UiInputOtp                 | hardening | `@ww/core` | `core-component / stable / core standard`       | **P2**   | shallow field enrichments after base form/input backlog            |
| UiRating / UiTimeline / UiDescriptions / UiStatistic / UiResult / UiList | hardening | `@ww/core` | `core-component / stable / core standard`       | **P2**   | useful display utilities, but not current platform blockers        |
| UiImage                                                                  | hardening | `@ww/core` | `core-component / stable / core standard`       | **P2**   | keep preview/gallery behavior out until separate scope is cut      |

### 3) ADR-first / separate scope

| Family                                                       | Status        | Placement        | Contract          | Decision                 | Note                                                                      |
| ------------------------------------------------------------ | ------------- | ---------------- | ----------------- | ------------------------ | ------------------------------------------------------------------------- |
| UiDatePicker / UiDateRangePicker / UiTimePicker / UiCalendar | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | locale, parsing, calendar engine, formatting, min/max, keyboard grid      |
| UiForm / UiFormItem                                          | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | validation model and imperative methods become long-lived contract        |
| UiTree / UiTreeSelect / UiCascader / UiTransfer              | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | hierarchical state, lazy loading, search, check model, virtualized scale  |
| UiUpload / UiFilePicker                                      | not confirmed | `split required` | `TBD / ADR-first` | **explicit scope first** | file-picker UI may be core; transport/orchestration must stay out of core |
| UiColorPicker                                                | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | color model + popup + alpha/presets are not current baseline              |
| UiMention                                                    | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | caret-positioning and trigger parsing are specialized runtime behavior    |
| UiTour                                                       | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | onboarding/workflow system, not baseline control                          |
| UiVirtualScroll / UiVirtualList / UiInfiniteScroll           | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | more likely primitive/helper or system capability than core surface       |
| UiSplitter                                                   | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | resize state + keyboard semantics are non-trivial                         |
| UiAlertDialog / imperative confirm                           | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | first prove composition over dialog before public imperative API          |
| UiImagePreview / previewGroup                                | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | gallery/zoom/rotate overlay is a separate surface family                  |
| UiWatermark                                                  | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | niche utility with canvas/runtime concerns                                |
| UiIcon                                                       | not confirmed | `TBD`            | `TBD / ADR-first` | **explicit scope first** | icon asset pipeline and naming contract must exist before wrapper export  |

### 4) Covered elsewhere / do not export as new public core surface

| Family                                                                       | Status                  | Placement                 | Contract                                                   | Decision                       | Note                                                                                |
| ---------------------------------------------------------------------------- | ----------------------- | ------------------------- | ---------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| UiLayout / UiLayoutHeader / UiLayoutSider / UiLayoutContent / UiLayoutFooter | mislayered              | `@ww/page-templates`      | `page-template-shell / incubating / no public core export` | **do not add to core backlog** | extend page-template shell family only if existing shell contracts are insufficient |
| UiSidebar (as shell)                                                         | mislayered              | `@ww/page-templates`      | `page-template-shell / incubating / no public core export` | **do not add to core backlog** | `UiMenu` may be core; sidebar shell is page-template territory                      |
| UiDrawerForm / UiDialogForm                                                  | composition-only        | `@ww/widgets` or `apps/*` | `no public core export`                                    | **do not export now**          | keep as composed proof until a repeatable cross-app contract exists                 |
| UiConfigProvider                                                             | reject                  | existing theme runtime    | `no new export`                                            | **do not add**                 | would create a second source of truth beside theme runtime                          |
| UiNotification                                                               | reject as separate name | fold into `UiToast`       | `no new export`                                            | **do not add separately**      | one canonical transient-feedback surface                                            |
| UiMessage                                                                    | reject as separate name | fold into `UiToast`       | `no new export`                                            | **do not add separately**      | no parallel lightweight-toast system                                                |

## Summary aligned to canonical backlog

| Bucket                                    | Family rows | Notes                                                   |
| ----------------------------------------- | ----------: | ------------------------------------------------------- |
| Add to `@ww/core` now                     |          10 | all P0                                                  |
| Add to `@ww/core` later                   |          16 | 8 P1 + 8 P2                                             |
| ADR-first / separate scope                |          13 | no public export before scope/placement decision        |
| Covered elsewhere / no public core export |           6 | keep in existing layer or as composition-only           |
| Total canonical family rows               |          45 | this count is the only planning total used in this file |

## Recommended implementation order

1. `Phase 1 / P0`: implement every row from `Add to @ww/core now` in the exact canonical order.
2. `Phase 2 / P1`: continue with the first eight rows from `Add to @ww/core later`.
3. `Phase 3 / P2`: continue with the remaining eight rows from `Add to @ww/core later`.
4. `Phase 4 / ADR-first`: cut explicit scope first, then promote rows from `ADR-first / separate scope`.
5. `Out of scope for core`: keep rows from `Covered elsewhere / do not export as new public core surface` in their current layer.

### Phase 1 / P0

`UiTooltip`, `UiPopover`, `UiDropdown / UiDropdownMenu`, `UiToast`, `UiRadio / UiRadioGroup`, `UiAlert`, `UiTag / UiChip`, `UiCollapse / UiAccordion`, `UiBreadcrumb`, `UiPagination (simple)`.

### Phase 2 / P1

`UiAvatar / UiAvatarGroup`, `UiNumberInput`, `UiSelect (rich)`, `UiAutocomplete`, `UiMenu`, `UiProgress`, `UiSteps / UiStepper`, `UiTable (simple)`.

### Phase 3 / P2

`UiPopconfirm`, `UiContextMenu`, `UiSlider / UiRangeSlider`, `UiGrid / UiSpace / UiFlex`, `UiAffix / UiScrollArea / UiScrollTop / UiAnchor`, `UiInputPassword / UiInputGroup / UiInputTag / UiInputOtp`, `UiRating / UiTimeline / UiDescriptions / UiStatistic / UiResult / UiList`, `UiImage`.

### Phase 4 / ADR-first

Everything under `ADR-first / separate scope`, in canonical row order only after scope and placement are explicitly fixed.

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

#### UiDropdown / UiDropdownMenu

- `trigger`: `'click' | 'hover' | 'contextmenu'`.
- `placement`.
- Items support `label`, `value`, `icon`, `disabled`, `divider`, `children`.
- Keyboard: arrow navigation, `Enter`, submenu open/close, `Escape`.
- ARIA contract: `role="menu"` and `role="menuitem"`.
- Roving focus and type-ahead are required.
- Submenu support follows the same menu semantics.

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

#### UiTag / UiChip

- `label` or slot-based content.
- `variant`: `neutral`, `brand`, `success`, `warning`, `danger`, `info`.
- `appearance`: `solid`, `outline`, `soft`.
- `size`: `sm`, `md`, `lg`.
- `closable`, `icon`, `rounded`, `clickable`, `disabled`.
- Long text must support truncation.

#### UiCollapse / UiAccordion

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

#### UiAvatar / UiAvatarGroup

- Avatar supports `src`, `alt`, fallback, `size`, `shape`, `color`, `onError`.
- Fallback cascade: image -> initials -> icon -> default icon.
- Group supports `max`, `size`, surplus `+N`, and spacing/overlap variants.

#### UiNumberInput

- `modelValue: number | null`, `min`, `max`, `step`, `precision`.
- Increment/decrement controls with icon slots.
- Keyboard: arrows, `PageUp/PageDown`, `Home/End`.
- Locale-aware format modes: decimal, currency, percent.
- `allowEmpty`, `clampOnBlur`, `disabled`, `readonly`, `invalid`, `size`.
- Mobile-friendly numeric input mode.

#### UiSelect (rich)

- `modelValue` may be single or multiple.
- Options support `label`, `value`, `group`, `disabled`, `icon`.
- `multiple`, `searchable`, `clearable`, `groupBy`, `placeholder`.
- `maxSelection`, `virtualScroll`, `remote`, `onSearch`.
- Keyboard: type-ahead, arrows, `Space` / `Enter`.
- Chip mode for multiple selection.
- Slots: `option`, `selected`, `header`, `footer`, `empty`.
- Overlay system owns the dropdown layer.

#### UiAutocomplete

- Single or multiple string model.
- Suggestions may be sync array or async fetcher.
- `field`, `minLength`, `delay`, `multiple`, `maxSuggestions`.
- Keyboard navigation and async loading state are required.
- Supports custom item slot and `completeOnFocus`.

#### UiMenu

- Items support `label`, `icon`, `to`, `href`, `children`, `disabled`, `badge`.
- `mode`: `vertical`, `horizontal`, `inline`.
- `openKeys`, `selectedKeys`, `accordion`.
- Keyboard navigation, submenu open/close, and ARIA menu semantics are required.
- `UiSidebar` shell stays out of core even if `UiMenu` lands in core.

#### UiProgress

- `value`, `max`, `type`, `size`, `strokeWidth`.
- `status`, `showValue`, formatter, custom color, `indeterminate`.
- ARIA contract: `role="progressbar"` and numeric state attributes.

#### UiSteps / UiStepper

- `activeStep` via `v-model`.
- `orientation`.
- Items expose `title`, `description`, `icon`, `status`.
- `clickable`, `linear`, `size`.
- Connector line supports progress fill animation.
- ARIA uses step-aware navigation semantics.

#### UiTable (simple)

- `columns`, `data`.
- `bordered`, `striped`, `size`, `stickyHeader`, `scroll`.
- Simpler contract than `DataGrid`: no toolbar, filter, or query engine.
- `rowClassName`, `cellClassName`, and render hooks stay presentation-oriented.

#### UiPopconfirm

- Specialization of `UiPopover` with confirmation UI.
- `title`, optional `description`, icon, confirm/cancel text.
- `confirmVariant`, `onConfirm`, `onCancel`.
- Focus lands on the confirm action when opened.

#### UiContextMenu

- Uses the same menu contract as dropdown, but anchors to pointer coordinates.
- Trigger is context-menu gesture.
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

- `UiAffix`: `offsetTop`, `offsetBottom`, target container, sticky state event.
- `UiScrollArea`: custom scrollbars, visibility mode, orientation, sizing, `scrollTo`.
- `UiScrollTop`: target, visibility threshold, behavior, position, custom trigger slot.
- `UiAnchor`: section items, offset, affix, target container, active link tracking, smooth scroll.

#### UiInputPassword / UiInputGroup / UiInputTag / UiInputOtp

- `UiInputPassword`: visibility toggle, optional strength meter and rules checklist.
- `UiInputGroup`: compact grouping, prepend/append addons, unified border treatment.
- `UiInputTag`: string-array model, validation, duplicate policy, paste separator behavior.
- `UiInputOtp`: fixed-length segmented input with auto-advance, paste distribution, masking, and keyboard backspace flow.

#### UiRating / UiTimeline / UiDescriptions / UiStatistic / UiResult / UiList

- `UiRating`: `max`, `allowHalf`, `allowClear`, custom icons/colors, keyboard support, radiogroup semantics.
- `UiTimeline`: items, mode, reverse, pending state, custom dot/content/opposite slots.
- `UiDescriptions`: `column`, `layout`, `bordered`, `size`, responsive spans, title/extra.
- `UiStatistic`: title, value, prefix/suffix, precision, formatter, loading, countdown variant.
- `UiResult`: predefined status presets with title, subtitle, icon, and extra slot.
- `UiList`: `dataSource`, render slot, grid mode, loading, load-more, pagination, metadata slots.

#### UiImage

- `src`, `alt`, fallback, placeholder.
- `lazy` loading support.
- `fit` variants.
- Core image surface stays separate from preview/gallery runtime.

### 3) ADR-first / separate scope

#### UiDatePicker / UiDateRangePicker / UiTimePicker / UiCalendar

- Date and time controls require explicit decisions on locale, parsing, formatting, disabled ranges, and keyboard navigation.
- Popup versus inline behavior must be fixed with overlay ownership before export.
- `UiCalendar` belongs to the same scope because it shares calendar-engine and locale contracts.

#### UiForm / UiFormItem

- Form scope must define validation lifecycle, rule model, imperative methods, and cross-field behavior.
- Group-level disabled propagation, layout, and scroll-to-error behavior need explicit contract ownership.

#### UiTree / UiTreeSelect / UiCascader / UiTransfer

- All four require explicit decisions on hierarchical state, lazy loading, search, virtualization, and keyboard semantics.
- `UiTreeSelect` and `UiCascader` also depend on overlay/listbox contracts.

#### UiUpload / UiFilePicker

- File picker UI and transport/orchestration must be split before placement is fixed.
- Upload transport cannot leak backend workflow into core.

#### UiColorPicker

- Requires explicit decision on color model, alpha support, presets, popup behavior, and inline editing.

#### UiMention

- Requires explicit decision on trigger parsing, caret positioning, and async suggestion lifecycle.

#### UiTour

- Requires explicit decision on onboarding/runtime ownership, target highlighting, masking, and step navigation.

#### UiVirtualScroll / UiVirtualList / UiInfiniteScroll

- Requires explicit decision on whether this is a primitive/helper capability or a public core surface.
- Windowing, measurement, and infinite loading contracts must be isolated first.

#### UiSplitter

- Requires explicit decision on resize model, keyboard semantics, persistence, and collapse behavior.

#### UiAlertDialog / imperative confirm

- Requires explicit decision on whether composition over `UiDialog` is sufficient before exposing imperative API.

#### UiImagePreview / previewGroup

- Requires explicit decision on gallery, zoom, rotate, navigation, and overlay ownership separate from base `UiImage`.

#### UiWatermark

- Requires explicit decision on canvas/runtime behavior, protection model, and whether it belongs in reusable core at all.

#### UiIcon

- Requires explicit decision on icon asset pipeline, naming, and bundle/runtime ownership before any wrapper export.

### 4) Covered elsewhere / do not export as new public core surface

#### UiLayout / UiLayoutHeader / UiLayoutSider / UiLayoutContent / UiLayoutFooter

- Keep shell-level layout in `@ww/page-templates`.
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
