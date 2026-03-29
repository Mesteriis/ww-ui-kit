# @ww/core

`@ww/core` is the baseline reusable component layer.

It owns:

- buttons, fields, selection controls, display components, feedback components, and overlay surfaces
- tokenized styles that consume semantic and component CSS variables
- shared style entrypoints such as `styles.css` and `motion.css`

It does not own:

- vendor-backed adapters
- feature-first systems packages
- widgets
- page templates
- route pages or backend orchestration

`@ww/core` may depend on `@ww/primitives`, `@ww/themes`, and `@ww/tokens`. It must not import systems, widgets, page templates, or apps.

