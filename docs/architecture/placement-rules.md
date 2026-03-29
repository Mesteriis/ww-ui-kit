# Placement Rules

Use these rules before creating a new file or package.

## Put it in `@ww/core` when

- it is a baseline reusable component
- it depends only on tokens, themes, and primitives
- it does not encode product-specific composition

## Put it in a systems package when

- it is a larger reusable subsystem
- it may depend on `@ww/core`
- it owns its own runtime model
- dense business/admin table orchestration belongs here as `@ww/data-grid`

## Put it in `@ww/widgets` when

- it is a black-box composed UI block
- it may assemble core and systems packages
- it should stay reusable across multiple apps or routes
- it must not own routing or backend orchestration
- table widgets such as `DataTableWidget` compose over `@ww/data-grid`; they do not reimplement the grid engine

## Put it in `@ww/page-templates` when

- it is a reusable layout or page shell
- it composes widgets and core without becoming a route page
- it should not fetch data or know product routing

## Put it in `apps/*` when

- it is a real route page
- it wires product state, routing, APIs, or backend orchestration
- it proves real multi-package composition in docs or playground
