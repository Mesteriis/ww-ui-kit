import { ARCHITECTURE_SENSITIVE_PATH_PATTERNS } from '../catalog/layer-rules.mjs';
import {
  ADR_REQUIRED_SECTIONS,
  ADR_STATUSES,
  listAdrFiles,
  parseAdrFile,
  readAdrIndex,
} from '../shared/adr.mjs';
import { execSync } from 'node:child_process';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getChangedFiles() {
  try {
    if (process.env.GITHUB_BASE_REF) {
      const baseRef = `origin/${process.env.GITHUB_BASE_REF}`;
      const mergeBase = execSync(`git merge-base HEAD ${baseRef}`, { encoding: 'utf8' }).trim();
      return execSync(`git diff --name-only ${mergeBase} HEAD`, { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(Boolean);
    }
  } catch {
    // Fall through to local diff mode.
  }

  try {
    return execSync('git diff --name-only HEAD', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

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

const changedFiles = getChangedFiles();
const architectureSensitiveChange = changedFiles.some((relativePath) =>
  ARCHITECTURE_SENSITIVE_PATH_PATTERNS.some((pattern) => pattern.test(relativePath))
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
