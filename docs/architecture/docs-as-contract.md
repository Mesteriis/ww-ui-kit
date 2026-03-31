# Docs As Contract

Docs in this repository are part of the engineering contract.

## Required documentation layers

- package README files for public packages
- architecture docs for layer rules and placement
- ADRs for architecture-sensitive changes
- Storybook stories for public UI surfaces
- playground testing routes for real composed proofs
- playground lab manifest and schemas for lab-eligible visual surfaces

## Rules

- README must not promise behavior the repository does not prove.
- Storybook is the source of truth for public UI states and variants.
- Public visual surfaces must opt into Storybook coverage explicitly; missing Storybook decisions fail governance checks.
- Storybook coverage is manifest-driven down to invariant ids; required behavioral and structural proofs must be declared and mapped to specific stories.
- Playground keeps two explicit roles:
  - `/testing/*` is the proof harness for real multi-package composition.
  - `/lab/*` is the maintainer-facing styling workbench and constructor.
- Browser-level accessibility checks are a curated safety net on top of Storybook and playground proofs.
- Public visual surfaces must record lab eligibility in the governed playground lab manifest.
- Architecture docs must point to machine-checked source files when possible.

## Enforcement

CI checks:

- `check:docs`
- `check:stories`
- `check:playground-coverage`
- `check:playground-lab`
- `check:adr`
- `format:check`
