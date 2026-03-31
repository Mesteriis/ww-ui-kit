import { ARCHITECTURE_SENSITIVE_PATH_PATTERNS } from '../catalog/layer-rules.mjs';
import {
  ADR_REQUIRED_SECTIONS,
  ADR_STATUSES,
  listAdrFiles,
  parseAdrFile,
  readAdrIndex,
} from '../shared/adr.mjs';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { pathToFileURL } from 'node:url';

export const DEPENDENCY_MANIFEST_FIELDS = Object.freeze([
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function runGit(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function getDiffContext() {
  try {
    if (process.env.GITHUB_BASE_REF) {
      const baseRef = `origin/${process.env.GITHUB_BASE_REF}`;
      const mergeBase = runGit(['merge-base', 'HEAD', baseRef]);
      if (mergeBase) {
        return {
          baseRevision: mergeBase,
          headRevision: 'HEAD',
        };
      }
    }
  } catch {
    // Fall through to local diff mode.
  }

  return {
    baseRevision: 'HEAD',
    headRevision: null,
  };
}

function getChangedFiles(diffContext) {
  const diffArgs =
    diffContext.headRevision === null
      ? ['diff', '--name-only', diffContext.baseRevision]
      : ['diff', '--name-only', diffContext.baseRevision, diffContext.headRevision];

  return (runGit(diffArgs) ?? '')
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean);
}

function isPackageManifestPath(relativePath) {
  return /(^|\/)package\.json$/.test(relativePath);
}

function readJsonAtRevision(diffContext, relativePath, revision) {
  try {
    if (revision === null) {
      return JSON.parse(readFileSync(relativePath, 'utf8'));
    }

    const source = runGit(['show', `${revision}:${relativePath}`]);
    return source ? JSON.parse(source) : null;
  } catch {
    return null;
  }
}

export function isDependencyOnlyPackageManifestChange(previousManifest, nextManifest) {
  if (!previousManifest || !nextManifest) {
    return false;
  }

  const previousStableManifest = { ...previousManifest };
  const nextStableManifest = { ...nextManifest };

  for (const field of DEPENDENCY_MANIFEST_FIELDS) {
    delete previousStableManifest[field];
    delete nextStableManifest[field];
  }

  if (!isDeepStrictEqual(previousStableManifest, nextStableManifest)) {
    return false;
  }

  return DEPENDENCY_MANIFEST_FIELDS.some(
    (field) => !isDeepStrictEqual(previousManifest[field], nextManifest[field])
  );
}

function loadPackageManifestPair(diffContext, relativePath) {
  return {
    previousManifest: readJsonAtRevision(diffContext, relativePath, diffContext.baseRevision),
    nextManifest: readJsonAtRevision(diffContext, relativePath, diffContext.headRevision),
  };
}

export function isArchitectureSensitiveFileChange(relativePath, options = {}) {
  const sensitive = ARCHITECTURE_SENSITIVE_PATH_PATTERNS.some((pattern) =>
    pattern.test(relativePath)
  );

  if (!sensitive) {
    return false;
  }

  if (isPackageManifestPath(relativePath) && options.loadPackageManifestPair) {
    const { previousManifest, nextManifest } = options.loadPackageManifestPair(relativePath);
    if (isDependencyOnlyPackageManifestChange(previousManifest, nextManifest)) {
      return false;
    }
  }

  return true;
}

export function runAdrCheck() {
  const diffContext = getDiffContext();
  const adrFiles = listAdrFiles();
  const parsedAdrs = adrFiles.map(parseAdrFile);
  const adrIndex = readAdrIndex();

  for (const adr of parsedAdrs) {
    const { attributes, headings, relativePath } = adr;

    for (const field of ['id', 'title', 'status', 'date', 'owners', 'tags', 'relatedPackages']) {
      if (!(field in attributes)) {
        throw new Error(`${relativePath} is missing ADR frontmatter field "${field}".`);
      }
    }

    if (!ADR_STATUSES.includes(attributes.status)) {
      throw new Error(`${relativePath} has invalid ADR status "${attributes.status}".`);
    }

    for (const section of ADR_REQUIRED_SECTIONS) {
      if (!headings.includes(section)) {
        throw new Error(`${relativePath} is missing required ADR section "## ${section}".`);
      }
    }

    const indexRowPattern = new RegExp(
      `^\\|?\\s*${escapeRegExp(attributes.id)}\\s*\\|\\s*${escapeRegExp(attributes.status)}\\s*\\|\\s*${escapeRegExp(attributes.title)}\\s*\\|`,
      'm'
    );

    if (!indexRowPattern.test(adrIndex)) {
      throw new Error(
        `${relativePath} is missing from docs/decisions/index.md or has mismatched summary row.`
      );
    }

    for (const field of ['supersedes', 'supersededBy']) {
      const values = Array.isArray(attributes[field]) ? attributes[field] : [];
      for (const adrId of values) {
        if (!parsedAdrs.some((candidate) => candidate.attributes.id === adrId)) {
          throw new Error(`${relativePath} references unknown ADR "${adrId}" in "${field}".`);
        }
      }
    }
  }

  const changedFiles = getChangedFiles(diffContext);
  const architectureSensitiveChange = changedFiles.some((relativePath) =>
    isArchitectureSensitiveFileChange(relativePath, {
      loadPackageManifestPair: (path) => loadPackageManifestPair(diffContext, path),
    })
  );
  const touchedAdr = changedFiles.some((relativePath) =>
    /^docs\/decisions\/ADR-\d{4}-.+\.md$/.test(relativePath)
  );

  if (architectureSensitiveChange && !touchedAdr) {
    throw new Error(
      'Architecture-sensitive changes detected without an ADR update. Add a new ADR or update an existing one under docs/decisions/.'
    );
  }

  console.log(`ADR governance OK: ${parsedAdrs.length} ADRs validated.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runAdrCheck();
}
