# ADR-0005 Versioning And Release

## Context

The monorepo needs a release-ready baseline without implementing CI/CD yet.

## Decision

Use SemVer with Changesets. Internal dependency bumps follow patch updates automatically, and release notes are recorded per change.

## Consequences

- Package versioning remains explicit.
- Multi-package releases can be coordinated safely.
- Contributors need to add a changeset for public-impacting changes.

## Alternatives

- Manual versioning would not scale across package boundaries.
- Independent ad hoc tagging would make dependency updates error-prone.

## Migration

Add `.changeset` entries for any future public API, styling contract, or behavior changes that affect consumers.
