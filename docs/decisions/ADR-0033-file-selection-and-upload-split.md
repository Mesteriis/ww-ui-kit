---
id: ADR-0033
title: File Selection And Upload Split
status: accepted
date: 2026-04-04
owners:
  - platform
tags:
  - core
  - systems
  - upload
relatedPackages:
  - @ww/core
  - @ww/interaction
supersedes: []
supersededBy: []
---

# ADR-0033 File Selection And Upload Split

## Context

The repo needs reusable file picking and upload flows, but the UI layer and transport/orchestration
must not collapse into one public contract. A single upload component that also owns network policy,
retry logic, or backend endpoints would blur the core/systems boundary.

## Decision

The family is split:

- `UiFilePicker` lives in `@ww/core`
- `UiUpload` lives in `@ww/interaction`

`UiFilePicker` is a display and input surface:

- wraps the native file input contract
- supports drag/drop, multiple files, accept filters, previews, and remove actions
- exposes selected `File[]` values without transport behavior

`UiUpload` is the orchestration layer:

- composes `UiFilePicker`
- owns queue state, progress state, retry/cancel lifecycle, and status presentation
- accepts an explicit transport adapter function from the consumer
- never owns backend urls, auth, or product workflow semantics

Controlled vs uncontrolled rules are explicit:

- `UiFilePicker` and `UiUpload` both support controlled file lists with internal fallback
- upload status records are serializable and emitted through `update:items`

Accessibility and keyboard rules are structural:

- picker trigger and dropzone remain keyboard reachable
- file lists expose remove/retry/cancel actions through regular buttons
- upload progress uses proper `progressbar` semantics

## Consequences

- Core stays honest as the reusable file-selection layer.
- Upload orchestration has one system-layer home without forcing all consumers into transport code.
- Image/media previews can reuse file-picker UI without inheriting queue state.

## Alternatives

- Putting transport logic in `@ww/core` would leak backend orchestration into the foundation layer.
- Shipping only `UiUpload` would make lightweight file selection harder and couple every consumer to
  queue semantics.
- Leaving file picking to ad-hoc app code would duplicate drag/drop, removal, and accessibility
  behavior.

## Migration / Rollout

- Build `UiFilePicker` first and let `UiUpload` compose over it.
- Keep transport adapters consumer-owned and test them through injected functions rather than
  package-specific network clients.
- Reuse the same media preview row UI between the picker and upload queue where possible.

## Related artifacts

- [`docs/architecture/placement-rules.md`](../architecture/placement-rules.md)
- [`docs/todo-components.md`](../todo-components.md)
