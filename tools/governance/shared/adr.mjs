import { readText, walkFiles } from './workspace.mjs';

export const ADR_STATUSES = ['proposed', 'accepted', 'superseded', 'rejected', 'deprecated'];
export const ADR_REQUIRED_SECTIONS = [
  'Context',
  'Decision',
  'Consequences',
  'Alternatives',
  'Migration / Rollout',
  'Related artifacts'
];

export function listAdrFiles() {
  return walkFiles('docs/decisions', (relativePath) => /^docs\/decisions\/ADR-\d{4}-.+\.md$/.test(relativePath));
}

export function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]+?)\n---\n/);
  if (!match) {
    return { attributes: null, body: markdown };
  }

  const lines = match[1].split('\n');
  const attributes = {};
  let currentKey = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line) {
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (keyMatch) {
      const [, key, value] = keyMatch;
      currentKey = key;
      if (value === '[]') {
        attributes[key] = [];
      } else if (value === '') {
        attributes[key] = [];
      } else {
        attributes[key] = value;
      }
      continue;
    }

    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(attributes[currentKey])) {
        attributes[currentKey] = [];
      }
      attributes[currentKey].push(listMatch[1]);
      continue;
    }

    throw new Error(`Unsupported ADR frontmatter line: ${rawLine}`);
  }

  return {
    attributes,
    body: markdown.slice(match[0].length)
  };
}

export function parseAdrFile(relativePath) {
  const markdown = readText(relativePath);
  const { attributes, body } = parseFrontmatter(markdown);
  if (!attributes) {
    throw new Error(`${relativePath} is missing ADR frontmatter.`);
  }

  const headings = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1].trim());

  return {
    relativePath,
    attributes,
    headings,
    markdown,
    body
  };
}

export function readAdrIndex() {
  return readText('docs/decisions/index.md');
}
