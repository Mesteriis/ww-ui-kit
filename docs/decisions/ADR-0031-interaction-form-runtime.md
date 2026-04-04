---
id: ADR-0031
title: Interaction Form Runtime
status: accepted
date: 2026-04-04
owners:
  - platform
tags:
  - systems
  - forms
relatedPackages:
  - @ww/interaction
  - @ww/core
supersedes: []
supersededBy: []
---

# ADR-0031 Interaction Form Runtime

## Context

`UiField` already solves label, hint, error, and described-by wiring for single controls, but there
is no canonical form-level registration, validation, submit coordination, or scroll-to-error model.
Putting a form engine in `@ww/core` would move coordinated interaction state above the baseline
component layer.

## Decision

`UiForm` and `UiFormItem` live in a new systems package: `@ww/interaction`.

The public contract is minimal and controlled-first:

- `UiForm` owns registration, validation dispatch, touched/dirty tracking, and submit lifecycle
- `UiFormItem` binds a field name to label/help/error/layout chrome without replacing `UiField`
- model state is an object passed through `v-model`
- validation rules are explicit arrays of sync or async functions supplied by consumers
- imperative methods are limited to `validate`, `validateField`, `reset`, `resetField`,
  `scrollToField`, and `focusField`

The package does not become a schema form generator, route sync layer, or backend mutation engine.

Accessibility and keyboard rules are structural:

- forms preserve native submit semantics
- `UiFormItem` forwards `aria-invalid`, help text ids, and error ids into the bound control
- scroll-to-error must preserve focus visibility and respect reduced motion

Controlled vs uncontrolled behavior is explicit:

- `v-model` drives canonical form values when provided
- missing `modelValue` enables internal state seeded from `initialValues`
- validation results are always emitted and exposed through the form handle instead of hidden in a
  second global store

## Consequences

- The repo gains one governed form runtime above the core field family.
- Core fields stay reusable without inheriting cross-field orchestration or async validation policy.
- Consumers can keep custom rule logic while sharing one registration and error lifecycle.

## Alternatives

- Expanding `UiField` into a form engine would overload the core layer and create hidden registry
  behavior in baseline components.
- Shipping only loose composition recipes would keep validation, reset, and scroll-to-error
  semantics duplicated in apps.
- Adopting a schema-first engine now would overreach the current repo scope and create a heavier
  public contract than needed.

## Migration / Rollout

- Add `@ww/interaction` as a systems package.
- Keep `UiFormItem` thin by reusing `UiField` semantics wherever possible.
- Existing apps can adopt the new runtime incrementally because field controls keep their current
  value contracts.

## Related artifacts

- [`docs/architecture/layer-governance.md`](../architecture/layer-governance.md)
- [`docs/architecture/placement-rules.md`](../architecture/placement-rules.md)
- [`docs/todo-components.md`](../todo-components.md)
