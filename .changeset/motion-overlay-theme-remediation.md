---
'@ww/primitives': patch
'@ww/core': patch
'@ww/themes': patch
'@ww/tokens': patch
---

Harden motion timing resolution, overlay focus restoration, and theme/z-layer runtime contracts.

Parse second-based collapse durations correctly, guard reduced-motion preset recursion, remove duplicate overlay focus-restore paths, keep `color-scheme` owned by `data-ui-theme-type`, and derive public z-layer aliases from the overlay slot scale.
