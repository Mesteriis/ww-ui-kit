# @ww/tokens

`@ww/tokens` is the canonical source of truth for raw token contracts.

It owns:

- base palette, spacing, radius, typography, motion, shadow, and z-index scales
- semantic token names
- component token names
- typed CSS variable helpers

It does not own:

- theme remapping
- runtime theming
- component styling
- motion runtime behavior

Use `@ww/tokens` when a new reusable contract must become part of the design-system foundation. Do not place product semantics or theme-specific values here.
