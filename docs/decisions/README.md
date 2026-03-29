# ADR System

Architectural decisions in this repository are managed under `docs/decisions/`.

Rules:

- use the frontmatter and section shape from [`_template.md`](./_template.md)
- keep [`index.md`](./index.md) synchronized
- use statuses from [`adr.schema.md`](./adr.schema.md)
- add or update an ADR when architecture-sensitive areas change

Automation:

- `pnpm check:adr` validates naming, metadata, sections, index entries, and reference integrity
- `pnpm verify` runs ADR checks together with the rest of the governance gates
