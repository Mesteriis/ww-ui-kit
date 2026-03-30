---
'@ww/primitives': patch
'@ww/core': patch
'@ww/themes': patch
'@ww/tokens': patch
'@ww/charts-apex': patch
'@ww/signal-graph': patch
'@ww/data-grid': patch
---

Harden motion timing resolution, overlay focus restoration, and theme/z-layer runtime contracts.

Parse second-based collapse durations correctly, cache reduced-motion preference changes, remove duplicate overlay focus-restore paths, keep `color-scheme` owned by `data-ui-theme-type`, derive public z-layer aliases from the overlay slot scale, and expand `@ww/themes` with DOM-backed density, motion-profile, personality, responsive, and capability-matrix contracts.
