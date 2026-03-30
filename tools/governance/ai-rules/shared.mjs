import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { AI_RULE_APPLY_MODES, AI_RULE_MANIFEST } from './rule-manifest.mjs';
import { readText, resolveFromRoot, walkFiles } from '../shared/workspace.mjs';

export const AI_RULESET_ROOT = 'docs/governance/ai-ruleset';
export const AI_RULESET_INDEX_PATH = `${AI_RULESET_ROOT}/index.md`;
export const AI_RULESET_README_PATH = `${AI_RULESET_ROOT}/README.md`;
export const AI_RULESET_SCHEMA_PATH = `${AI_RULESET_ROOT}/_schema.md`;
export const AI_RULE_OVERVIEW_PATH = 'docs/governance/ai-rules.md';
export const AIASSISTANT_RULES_PATH = '.aiassistant/rules';
export const AI_RULE_MIRROR_PATHS = Object.freeze([
  AI_RULE_OVERVIEW_PATH,
  'AGENTS.md',
  '.github/copilot-instructions.md',
]);
export const AI_RULE_INDEX_SKIP = new Set([
  AI_RULESET_README_PATH,
  AI_RULESET_INDEX_PATH,
  AI_RULESET_SCHEMA_PATH,
]);
export const AI_RULE_UNSUPPORTED_GLOB_CHARACTERS = Object.freeze(['{', '}', '[', ']', '!']);

export function parseRuleFrontmatter(markdown) {
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

    throw new Error(`Unsupported AI rule frontmatter line: ${rawLine}`);
  }

  return {
    attributes,
    body: markdown.slice(match[0].length),
  };
}

export function listRuleFiles() {
  return walkFiles(AI_RULESET_ROOT, (relativePath) => {
    if (!relativePath.endsWith('.md')) {
      return false;
    }

    return !AI_RULE_INDEX_SKIP.has(relativePath);
  });
}

export function parseRuleFile(relativePath) {
  const markdown = readText(relativePath);
  const { attributes, body } = parseRuleFrontmatter(markdown);
  if (!attributes) {
    throw new Error(`${relativePath} is missing AI rule frontmatter.`);
  }

  return {
    relativePath,
    markdown,
    body,
    attributes,
  };
}

export function normalizeToArray(value) {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function globToRegExp(pattern) {
  if (typeof pattern !== 'string' || pattern.trim().length === 0) {
    throw new Error('Pattern must be a non-empty string.');
  }

  const unsupportedCharacters = [...new Set(pattern.split(''))].filter((character) =>
    AI_RULE_UNSUPPORTED_GLOB_CHARACTERS.includes(character)
  );
  if (unsupportedCharacters.length > 0) {
    throw new Error(
      `Unsupported AI rule glob syntax in pattern "${pattern}": ${unsupportedCharacters.join(
        ', '
      )}. Use simple "*", "**", and "?" tokens only.`
    );
  }

  let source = '^';
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    const nextCharacter = pattern[index + 1];
    const nextNextCharacter = pattern[index + 2];

    if (character === '*') {
      if (nextCharacter === '*') {
        if (nextNextCharacter === '/') {
          source += '(?:[^/]+/)*';
          index += 2;
        } else {
          source += '.*';
          index += 1;
        }
      } else {
        source += '[^/]*';
      }
      continue;
    }

    if (character === '?') {
      source += '[^/]';
      continue;
    }

    if ('\\^$+?.()|{}[]'.includes(character)) {
      source += `\\${character}`;
      continue;
    }

    source += character;
  }

  source += '$';
  return new RegExp(source);
}

export function getRuleContext() {
  const parsedRules = AI_RULE_MANIFEST.map((entry) => ({
    manifestEntry: entry,
    file: parseRuleFile(entry.relativePath),
  }));

  return {
    parsedRules,
    parsedRuleMap: new Map(parsedRules.map((entry) => [entry.manifestEntry.id, entry])),
    mirroredRules: parsedRules.filter((entry) => entry.manifestEntry.mirroredInSummary),
  };
}

export function renderAlwaysSummaryLines() {
  const { mirroredRules } = getRuleContext();
  return mirroredRules.map(({ file }) => `- ${file.attributes.summary ?? file.attributes.title}`);
}

export function renderAiRuleOverview() {
  const summaryLines = renderAlwaysSummaryLines().join('\n');
  return `# AI Rules

Canonical human-readable overview for the repository AI rules pack.

Canonical source of truth: [\`docs/governance/ai-ruleset/\`](./ai-ruleset/README.md)

## Apply modes

- \`always\`  
  apply on every task in this repository
- \`by model decision\`  
  apply when the task type matches the rule instructions
- \`by file patterns\`  
  apply when touched files match the declared patterns
- \`manually\`  
  apply only when a maintainer or an explicit task calls for it

## Always baseline

<!-- AI_RULES_SYNC:START -->
${summaryLines}
<!-- AI_RULES_SYNC:END -->

## Mirrors

- [\`AGENTS.md\`](../../AGENTS.md)
- [\`.github/copilot-instructions.md\`](../../.github/copilot-instructions.md)

Those files stay thin on purpose. They mirror the always baseline and point back to the canonical rules pack.

## Rule pack entrypoints

- [README](./ai-ruleset/README.md)
- [Index](./ai-ruleset/index.md)
- [Schema](./ai-ruleset/_schema.md)

## Pattern syntax

- \`patterns\` may be a single string or an array of strings.
- Supported glob tokens are \`*\`, \`**\`, and \`?\`.
- Unsupported syntax such as \`{}\`, \`[]\`, and \`!\` fails \`pnpm check:ai-rules\`.

## Commands

- \`pnpm build:ai-rules\` refreshes the overview, mirrors, and generated index
- \`pnpm check:ai-rules\` validates frontmatter, manifest coverage, generated files, and mirror sync
`;
}

function renderThinMirror(title) {
  const summaryLines = renderAlwaysSummaryLines().join('\n');
  return `# ${title}

Thin mirror of the canonical repository AI rules pack.

Canonical source of truth: \`docs/governance/ai-ruleset/\`
Human overview: \`docs/governance/ai-rules.md\`

<!-- AI_RULES_SYNC:START -->
${summaryLines}
<!-- AI_RULES_SYNC:END -->
`;
}

export function renderAgentsMirror() {
  return renderThinMirror('Repository AI Rules');
}

export function renderCopilotInstructions() {
  return renderThinMirror('Copilot Instructions');
}

export function writeAiAssistantMirror() {
  const outputDirectory = resolveFromRoot(AIASSISTANT_RULES_PATH);
  fs.rmSync(outputDirectory, { force: true, recursive: true });
  fs.mkdirSync(outputDirectory, { recursive: true });

  fs.copyFileSync(
    resolveFromRoot(AI_RULE_OVERVIEW_PATH),
    resolveFromRoot(AIASSISTANT_RULES_PATH, 'ai-rules-overview.md')
  );

  for (const relativePath of walkFiles(AI_RULESET_ROOT, (candidatePath) =>
    candidatePath.endsWith('.md')
  )) {
    const rulesetRelativePath = relativePath.replace(`${AI_RULESET_ROOT}/`, '');
    const targetName = `ai-ruleset-${rulesetRelativePath.replaceAll('/', '-')}`;
    fs.copyFileSync(
      resolveFromRoot(relativePath),
      resolveFromRoot(AIASSISTANT_RULES_PATH, targetName)
    );
  }
}

function renderIndexSection(title, applyMode, rows) {
  if (rows.length === 0) {
    return `## ${title}\n\n_No rules._`;
  }

  const tableRows = rows
    .map(
      (entry) =>
        `| ${entry.id} | ${entry.title} | [${entry.relativePath.replace(`${AI_RULESET_ROOT}/`, '')}](./${entry.relativePath.replace(`${AI_RULESET_ROOT}/`, '')}) |`
    )
    .join('\n');

  return `## ${title}\n\nApply mode: \`${applyMode}\`\n\n| id | title | file |\n| --- | --- | --- |\n${tableRows}`;
}

export function renderRuleIndex() {
  const groupedEntries = AI_RULE_APPLY_MODES.map((applyMode) => ({
    applyMode,
    entries: AI_RULE_MANIFEST.filter((entry) => entry.apply === applyMode),
  }));

  return `# AI Ruleset Index

Canonical machine-oriented index for the repository AI rules pack.

Canonical source of truth: [\`docs/governance/ai-ruleset/\`](./README.md)

Apply modes:

- \`always\`
- \`by model decision\`
- \`by file patterns\`
- \`manually\`

${groupedEntries
  .map(({ applyMode, entries }) => {
    const title =
      applyMode === 'always'
        ? 'Always rules'
        : applyMode === 'by model decision'
          ? 'By-model rules'
          : applyMode === 'by file patterns'
            ? 'By-path rules'
            : 'Manual rules';

    return renderIndexSection(title, applyMode, entries);
  })
  .join('\n\n')}
`;
}

export function writeGeneratedFile(relativePath, content) {
  fs.writeFileSync(resolveFromRoot(relativePath), `${content.trimEnd()}\n`);
}

export function readGeneratedFile(relativePath) {
  return readText(relativePath).replace(/\r\n/g, '\n').trimEnd();
}

export function validateRuleApplyMode(applyMode) {
  if (!AI_RULE_APPLY_MODES.includes(applyMode)) {
    throw new Error(`Unknown AI rule apply mode "${applyMode}".`);
  }
}

export function isDirectExecution(importMetaUrl) {
  return Boolean(process.argv[1]) && importMetaUrl === pathToFileURL(process.argv[1]).href;
}
