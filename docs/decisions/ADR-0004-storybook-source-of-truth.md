# ADR-0004 Storybook Source Of Truth

## Context

The foundation needs a practical way to document states, accessibility expectations, and usage examples without building a custom docs framework.

## Decision

Use Storybook as the primary source of truth for documented states and examples. Each core component must have stories that cover key variants and interactive behavior.

## Consequences

- Design and engineering review share the same examples.
- Regression triage gets faster because stories describe expected states.
- Story maintenance becomes part of component work.

## Alternatives

- Custom documentation pages would add unnecessary framework work.
- README-only examples would not exercise interactive states well enough.

## Migration

Move canonical examples from ad hoc docs into stories when components evolve.
