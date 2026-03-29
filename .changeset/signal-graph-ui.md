---
'@ww/tokens': minor
'@ww/themes': minor
'@ww/signal-graph': minor
'@ww/docs': patch
'@ww/playground': patch
---

Add `@ww/signal-graph` as an optional interactive graph UI package with signal pulses, focus/depth states, subtree theming, and overlay-safe node rendering.

- add graph-specific token and theme mappings for canvas, nodes, edges, pulses, and depth
- add the black-box `UiSignalGraph` API on top of an internal Vue Flow engine
- add Storybook and playground coverage for signal graphs, theming, reduced motion, and overlays in nodes
