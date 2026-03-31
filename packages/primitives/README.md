# @ww/primitives

`@ww/primitives` is the low-level behavior layer above tokens and themes.

It owns:

- focus, SSR-safe ids, outside-click, controllable-state, roving-focus, and scroll-lock composables
- motion preset registry and runtime helpers
- overlay stack, layer slots, portal resolution, and theme-aware subtree mounting
- low-level primitive components such as `PrimitivePortal`, `PrimitiveFocusTrap`, and `PrimitiveVisuallyHidden`

It does not own:

- branded component styling
- product-specific UI composition
- vendor-backed feature packages

## Public API

- `PrimitivePortal`
- `PrimitiveFocusTrap`
- `PrimitiveVisuallyHidden`
- behavior composables such as `useControllable`, `useEscapeKey`, `useId`, `useOutsideClick`, `useRovingFocus`, and `useScrollLock`
- motion foundation exports
- overlay foundation exports

Import from `@ww/primitives` only through the package root. Internal folders like `motion/*` and `overlay/*` are implementation details, not public subpath exports.

`useId()` delegates to Vue 3.5's instance-aware ids when a component context exists and falls back to non-counter ids for standalone composables, while keeping optional prefix support through the existing `ComputedRef<string>` return shape.
