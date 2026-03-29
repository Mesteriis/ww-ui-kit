# ADR-0001 Monorepo

## Context

The UI kit foundation spans shared tokens, themes, behavior primitives, styled components, and consumer-facing validation apps.

## Decision

Use a pnpm workspace monorepo with separate packages for each layer and shared config packages for TypeScript and ESLint.

## Consequences

- Cross-package boundaries stay explicit.
- Tooling and release management can be centralized.
- Build and typecheck order must respect the dependency graph.

## Alternatives

- A single package with folders would reduce setup but blur package contracts.
- Multiple repositories would isolate concerns but slow down coordinated changes.

## Migration

Not applicable for the initial foundation.
