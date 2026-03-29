# Docs As Contract

Docs in this repository are part of the engineering contract.

## Required documentation layers

- package README files for public packages
- architecture docs for layer rules and placement
- ADRs for architecture-sensitive changes
- Storybook stories for public UI surfaces
- playground scenarios for real composed proofs

## Rules

- README must not promise behavior the repository does not prove.
- Storybook is the source of truth for public UI states and variants.
- Playground is the proof harness for real multi-package composition.
- Architecture docs must point to machine-checked source files when possible.

## Enforcement

CI checks:

- `check:docs`
- `check:stories`
- `check:playground-coverage`
- `check:adr`

