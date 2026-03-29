import { readText } from '../shared/workspace.mjs';

const CANONICAL_PATH = 'docs/governance/ai-rules.md';
const MIRROR_PATHS = ['AGENTS.md', '.github/copilot-instructions.md'];
const START_MARKER = '<!-- AI_RULES_SYNC:START -->';
const END_MARKER = '<!-- AI_RULES_SYNC:END -->';

function extractSyncBlock(relativePath) {
  const text = readText(relativePath);
  const match = text.match(
    new RegExp(`${START_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n([\\s\\S]+?)\\n${END_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
  );

  if (!match) {
    throw new Error(`${relativePath} is missing AI rules sync markers.`);
  }

  return match[1].trim();
}

const canonicalBlock = extractSyncBlock(CANONICAL_PATH);

for (const mirrorPath of MIRROR_PATHS) {
  const mirrorBlock = extractSyncBlock(mirrorPath);
  if (mirrorBlock !== canonicalBlock) {
    throw new Error(`${mirrorPath} is out of sync with ${CANONICAL_PATH}.`);
  }
}

console.log('AI rules sync OK.');

