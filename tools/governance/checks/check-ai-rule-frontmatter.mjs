import {
  AI_RULE_APPLY_MODES,
  AI_RULE_AREA_TAGS,
  AI_RULE_LAYER_TAGS,
  AI_RULE_MANIFEST,
  AI_RULE_PACKAGE_TAGS,
} from '../ai-rules/rule-manifest.mjs';
import {
  AI_RULESET_README_PATH,
  AI_RULESET_SCHEMA_PATH,
  globToRegExp,
  isDirectExecution,
  listRuleFiles,
  normalizeToArray,
  parseRuleFile,
  validateRuleApplyMode,
} from '../ai-rules/shared.mjs';
import { fileExists, readText, walkFiles } from '../shared/workspace.mjs';

function validateOptionalStringArray(relativePath, key, value) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    if (value.trim().length === 0) {
      throw new Error(`${relativePath} must not declare an empty "${key}" value.`);
    }
    return value.trim();
  }

  if (Array.isArray(value)) {
    if (value.some((item) => typeof item !== 'string' || item.trim().length === 0)) {
      throw new Error(`${relativePath} must declare "${key}" as a string or array of strings.`);
    }
    return value.map((item) => item.trim());
  }

  throw new Error(`${relativePath} must declare "${key}" as a string or array of strings.`);
}

function validateManifestTagCollection(relativePath, key, values, allowedValues) {
  if (values === undefined) {
    return;
  }

  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(`${relativePath} manifest field "${key}" must be a non-empty array.`);
  }

  const allowedSet = new Set(allowedValues);
  const invalidValues = values.filter((value) => !allowedSet.has(value));
  if (invalidValues.length > 0) {
    throw new Error(
      `${relativePath} manifest field "${key}" contains unsupported values: ${invalidValues.join(
        ', '
      )}.`
    );
  }
}

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

    if (typeof entry.mirroredInSummary !== 'boolean') {
      throw new Error(
        `${entry.relativePath} manifest field "mirroredInSummary" must be a boolean.`
      );
    }

    validateManifestTagCollection(
      entry.relativePath,
      'layerTags',
      entry.layerTags,
      AI_RULE_LAYER_TAGS
    );
    validateManifestTagCollection(
      entry.relativePath,
      'areaTags',
      entry.areaTags,
      AI_RULE_AREA_TAGS
    );
    validateManifestTagCollection(
      entry.relativePath,
      'packageTags',
      entry.packageTags,
      AI_RULE_PACKAGE_TAGS
    );

    if (entry.relatedDocs !== undefined) {
      if (
        !Array.isArray(entry.relatedDocs) ||
        entry.relatedDocs.length === 0 ||
        entry.relatedDocs.some((path) => typeof path !== 'string' || path.trim().length === 0)
      ) {
        throw new Error(
          `${entry.relativePath} manifest field "relatedDocs" must be a non-empty array of paths.`
        );
      }

      const missingRelatedDocs = entry.relatedDocs.filter((path) => !fileExists(path));
      if (missingRelatedDocs.length > 0) {
        throw new Error(
          `${entry.relativePath} manifest field "relatedDocs" references missing files: ${missingRelatedDocs.join(
            ', '
          )}.`
        );
      }
    }
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
      throw new Error(
        `${entry.relativePath} has id "${attributes.id}" but manifest expects "${entry.id}".`
      );
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

    const patterns = normalizeToArray(
      validateOptionalStringArray(entry.relativePath, 'patterns', attributes.patterns)
    );
    if (attributes.apply === 'by model decision') {
      if (
        typeof attributes.instructions !== 'string' ||
        attributes.instructions.trim().length === 0
      ) {
        throw new Error(`${entry.relativePath} must declare frontmatter "instructions".`);
      }

      if (patterns.length > 0) {
        throw new Error(
          `${entry.relativePath} must not declare file patterns for "by model decision".`
        );
      }
    }

    if (attributes.apply === 'by file patterns') {
      if (patterns.length === 0) {
        throw new Error(`${entry.relativePath} must declare frontmatter "patterns".`);
      }

      for (const pattern of patterns) {
        if (!pattern.includes('*') && !pattern.includes('?')) {
          if (!fileExists(pattern)) {
            throw new Error(
              `${entry.relativePath} declares pattern "${pattern}" that matches no files.`
            );
          }
          continue;
        }

        const matcher = globToRegExp(pattern);
        if (!allFiles.some((candidate) => matcher.test(candidate))) {
          throw new Error(
            `${entry.relativePath} declares pattern "${pattern}" that matches no files.`
          );
        }
      }

      if ('instructions' in attributes) {
        throw new Error(
          `${entry.relativePath} must not declare "instructions" for a path-based rule.`
        );
      }
    }

    if (attributes.apply === 'always' || attributes.apply === 'manually') {
      if (patterns.length > 0) {
        throw new Error(
          `${entry.relativePath} must not declare file patterns for "${attributes.apply}".`
        );
      }
    }

    if (
      entry.mirroredInSummary &&
      (typeof attributes.summary !== 'string' || attributes.summary.trim().length === 0)
    ) {
      throw new Error(
        `${entry.relativePath} must declare frontmatter "summary" because it is mirrored.`
      );
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
