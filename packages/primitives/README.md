# @ww/primitives

`@ww/primitives` is the low-level behavior layer above tokens and themes.

It owns:

- focus, ids, outside-click, controllable-state, roving-focus, and scroll-lock composables
- motion preset registry and runtime helpers
- overlay stack, layer slots, portal resolution, and theme-aware subtree mounting
- low-level primitive components such as `PrimitivePortal`, `PrimitiveFocusTrap`, and `PrimitiveVisuallyHidden`

It does not own:

- branded component styling
- product-specific UI composition
- vendor-backed feature packages

Import from `@ww/primitives` only through the package root. Internal folders like `motion/*` and `overlay/*` are implementation details, not public subpath exports.

