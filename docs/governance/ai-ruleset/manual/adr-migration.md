---
id: ai-manual-adr-migration
title: ADR migration and historical normalization
apply: manually
---
Use this rule only for explicit ADR cleanup or migration work.

## Do

- Preserve historical intent while normalizing format, metadata, or links.
- Mark superseded ADRs honestly instead of deleting them.
- Keep the ADR index synchronized after migrations.

## Do not

- Do not renumber ADRs casually.
- Do not erase historical decisions because the current architecture evolved.
- Do not migrate ADRs without updating schema or checks when the format changes.

## Related repo sources of truth

- `docs/decisions/_template.md`
- `docs/decisions/adr.schema.md`
