import { AI_RULE_APPLY_MODES, AI_RULE_MANIFEST } from '../ai-rules/rule-manifest.mjs';
import {
  AI_RULESET_README_PATH,
  AI_RULESET_SCHEMA_PATH,
  globToRegExp,
  isDirectExecution,
  listRuleFiles,
  normalizeToArray,
  parseRuleFile,
  validateRuleApplyMode
} from '../ai-rules/shared.mjs';
import { readText, walkFiles } from '../shared/workspace.mjs';

export function checkAiRuleFrontmatter() {
  const manifestIds = new Set();
  const manifestPaths = new Set();
  const allFiles = walkFiles('.', () => true);

  for (const entry of AI_RULE_MANIFEST) {
    if (manifestIds.has(entry.id)) {
      throw new Error(`Duplicate AI rule id in manifest: "${entry.id}".`);
    }
    manifestIds.add(entry.id);

    if (manifestPaths.has(entry.relativePath)) {
      throw new Error(`Duplicate AI rule path in manifest: "${entry.relativePath}".`);
    }
    manifestPaths.add(entry.relativePath);

    validateRuleApplyMode(entry.apply);
  }

  const ruleFiles = listRuleFiles();
  const fileIds = new Set();
  const orphanFiles = ruleFiles.filter((relativePath) => !manifestPaths.has(relativePath));
  if (orphanFiles.length > 0) {
    throw new Error(`Found AI rule files not listed in the manifest: ${orphanFiles.join(', ')}`);
  }

  for (const entry of AI_RULE_MANIFEST) {
    const file = parseRuleFile(entry.relativePath);
    const { attributes, body } = file;

    if (fileIds.has(attributes.id)) {
      throw new Error(`Duplicate AI rule id in files: "${attributes.id}".`);
    }
    fileIds.add(attributes.id);

    if (attributes.id !== entry.id) {
      throw new Error(`${entry.relativePath} has id "${attributes.id}" but manifest expects "${entry.id}".`);
    }

    if (attributes.title !== entry.title) {
      throw new Error(
        `${entry.relativePath} has title "${attributes.title}" but manifest expects "${entry.title}".`
      );
    }

    validateRuleApplyMode(attributes.apply);
    if (attributes.apply !== entry.apply) {
      throw new Error(
        `${entry.relativePath} has apply mode "${attributes.apply}" but manifest expects "${entry.apply}".`
      );
    }

    if (!body.trim()) {
      throw new Error(`${entry.relativePath} has an empty body.`);
    }

    if (!body.includes('## Do') || !body.includes('## Do not')) {
      throw new Error(`${entry.relativePath} must include "## Do" and "## Do not" sections.`);
    }

    const patterns = normalizeToArray(attributes.patterns);
    if (attributes.apply === 'by model decision') {
      if (typeof attributes.instructions !== 'string' || attributes.instructions.trim().length === 0) {
        throw new Error(`${entry.relativePath} must declare frontmatter "instructions".`);
      }

      if (patterns.length > 0) {
        throw new Error(`${entry.relativePath} must not declare file patterns for "by model decision".`);
      }
    }

    if (attributes.apply === 'by file patterns') {
      if (patterns.length === 0) {
        throw new Error(`${entry.relativePath} must declare frontmatter "patterns".`);
      }

      for (const pattern of patterns) {
        const matcher = globToRegExp(pattern);
        if (!allFiles.some((candidate) => matcher.test(candidate))) {
          throw new Error(`${entry.relativePath} declares pattern "${pattern}" that matches no files.`);
        }
      }

      if ('instructions' in attributes) {
        throw new Error(`${entry.relativePath} must not declare "instructions" for a path-based rule.`);
      }
    }

    if (attributes.apply === 'always' || attributes.apply === 'manually') {
      if (patterns.length > 0) {
        throw new Error(`${entry.relativePath} must not declare file patterns for "${attributes.apply}".`);
      }
    }

    if (entry.mirroredInSummary && (typeof attributes.summary !== 'string' || attributes.summary.trim().length === 0)) {
      throw new Error(`${entry.relativePath} must declare frontmatter "summary" because it is mirrored.`);
    }
  }

  const rulesReadme = readText(AI_RULESET_README_PATH);
  const rulesSchema = readText(AI_RULESET_SCHEMA_PATH);
  for (const applyMode of AI_RULE_APPLY_MODES) {
    if (!rulesReadme.includes(`\`${applyMode}\``)) {
      throw new Error(`${AI_RULESET_README_PATH} must mention apply mode "${applyMode}".`);
    }
    if (!rulesSchema.includes(`\`${applyMode}\``)) {
      throw new Error(`${AI_RULESET_SCHEMA_PATH} must mention apply mode "${applyMode}".`);
    }
  }

  console.log(`AI rule frontmatter OK: ${AI_RULE_MANIFEST.length} manifest entries validated.`);
}

if (isDirectExecution(import.meta.url)) {
  checkAiRuleFrontmatter();
}
