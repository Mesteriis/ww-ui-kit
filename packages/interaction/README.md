# @ww/interaction

`@ww/interaction` is the systems-layer home for coordinated interaction runtimes above `@ww/core`.

It owns:

- form registration and validation runtime
- virtualization and infinite scroll
- hierarchical collection systems such as tree, tree-select, cascader, and transfer
- upload queue orchestration above the core file-picker surface
- guided tour overlays
- composition that deliberately reuses `@ww/core` and `@ww/primitives` instead of forking them

It does not own:

- backend transport clients
- route or product orchestration
- replacement baseline controls that belong in `@ww/core`
- schema generators, form builders, or product onboarding policy

Import styles explicitly:

```ts
import '@ww/interaction/styles.css';
```

## Public API

- `UiVirtualScroll`
- `UiVirtualList`
- `UiInfiniteScroll`
- `UiForm`
- `UiFormItem`
- `UiTree`
- `UiTreeSelect`
- `UiCascader`
- `UiTransfer`
- `UiUpload`
- `UiTour`

## Placement

`@ww/interaction` is a systems package. It may compose `@ww/core`, `@ww/primitives`,
`@ww/themes`, and `@ww/tokens`, but it must not move reusable baseline controls or transport policy
down into `@ww/core`.

## Controlled model

- `UiForm` and `UiFormItem` are controlled-first through `v-model`
- `UiTree`, `UiTreeSelect`, `UiCascader`, and `UiTransfer` expose key-based selection state
- `UiUpload` accepts an explicit transport adapter and keeps queue state consumer-visible
- `UiTour` exposes controlled `open` and step index while falling back to internal refs

## Explicit v1 out of scope

- backend clients, auth, and retry policy beyond the injected upload adapter
- schema-driven form generation
- route-aware or analytics-aware tour orchestration
- arbitrary virtualized grids or canvas renderers
