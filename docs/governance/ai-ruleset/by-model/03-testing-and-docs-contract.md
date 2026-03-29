---
id: ai-model-testing-and-docs-contract
title: Apply docs-as-contract and test contour discipline
apply: by model decision
instructions: use when changing Storybook coverage, playground harnesses, test contours, docs-as-contract rules, or consumer-proof flows.
---
Use this rule when the proof model changes.

## Do

- Decide which of `test:unit`, `test:e2e`, and `test:playground` must change.
- Keep Storybook as the public state source of truth and playground as the consumer-proof harness.
- Update the manifest-driven coverage checks when a public surface gains or loses required artifacts.
- Keep docs and tests proving the real contract instead of duplicating screenshots or snapshots.

## Do not

- Do not move public proof out of Storybook into ad hoc docs prose.
- Do not use playground as a clone of stories without composition value.
- Do not add a public UI surface without declaring its proof requirements.
- Do not weaken one test contour to compensate for another.

## Related repo sources of truth

- `docs/architecture/testing-architecture.md`
- `docs/architecture/docs-as-contract.md`
- `tools/governance/catalog/`
