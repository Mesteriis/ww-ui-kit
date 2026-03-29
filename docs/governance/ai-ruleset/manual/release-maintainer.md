---
id: ai-manual-release-maintainer
title: Release maintainer workflow
apply: manually
---

Use this rule only for release maintainer tasks.

## Do

- Keep Changesets as the source of truth for publishable package versioning.
- Use repository release automation instead of ad hoc manual tagging.
- Keep release notes honest about public impact and stability.

## Do not

- Do not handcraft release tags that bypass the normal workflow.
- Do not publish packages whose docs, manifest, or changesets are out of sync.
- Do not treat docs-only or internal-only repo hygiene as release-worthy package changes.

## Related repo sources of truth

- `.changeset/`
- `.github/workflows/release.yml`
- `.github/release.yml`
