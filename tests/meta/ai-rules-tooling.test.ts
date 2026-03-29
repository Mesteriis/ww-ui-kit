import { describe, expect, it } from 'vitest';

import {
  AI_RULE_APPLY_MODES,
  AI_RULE_AREA_TAGS,
  AI_RULE_LAYER_TAGS,
  AI_RULE_MANIFEST,
  AI_RULE_PACKAGE_TAGS,
} from '../../tools/governance/ai-rules/rule-manifest.mjs';
import {
  globToRegExp,
  normalizeToArray,
  parseRuleFrontmatter,
  renderAgentsMirror,
  renderCopilotInstructions,
  renderRuleIndex,
} from '../../tools/governance/ai-rules/shared.mjs';

describe('ai rule tooling', () => {
  it('parses frontmatter with scalar and array attributes', () => {
    const markdown = `---
id: ai-path-example
title: Example path rule
apply: by file patterns
patterns:
  - package.json
  - *.config.*
summary: Example summary
---

Rule body.`;

    const parsed = parseRuleFrontmatter(markdown);

    expect(parsed.attributes).toEqual({
      id: 'ai-path-example',
      title: 'Example path rule',
      apply: 'by file patterns',
      patterns: ['package.json', '*.config.*'],
      summary: 'Example summary',
    });
    expect(parsed.body.trim()).toBe('Rule body.');
  });

  it('normalizes undefined, scalars, and arrays into arrays', () => {
    expect(normalizeToArray(undefined)).toEqual([]);
    expect(normalizeToArray('package.json')).toEqual(['package.json']);
    expect(normalizeToArray(['package.json', 'pnpm-workspace.yaml'])).toEqual([
      'package.json',
      'pnpm-workspace.yaml',
    ]);
  });

  it('converts supported glob syntax into a matcher', () => {
    const rootConfigMatcher = globToRegExp('*.config.*');
    const workspaceMatcher = globToRegExp('packages/**/README.md');

    expect(rootConfigMatcher.test('eslint.config.mjs')).toBe(true);
    expect(rootConfigMatcher.test('packages/core/vite.config.ts')).toBe(false);
    expect(workspaceMatcher.test('packages/core/README.md')).toBe(true);
    expect(workspaceMatcher.test('README.md')).toBe(false);
  });

  it('rejects unsupported glob syntax explicitly', () => {
    expect(() => globToRegExp('packages/{core,themes}/**/*')).toThrow(
      /Unsupported AI rule glob syntax/
    );
    expect(() => globToRegExp('packages/[a-z]*/**/*')).toThrow(/Unsupported AI rule glob syntax/);
    expect(() => globToRegExp('!packages/core/**/*')).toThrow(/Unsupported AI rule glob syntax/);
  });

  it('renders thin mirrors from the same always baseline summary', () => {
    const agentsMirror = renderAgentsMirror();
    const copilotMirror = renderCopilotInstructions();
    const syncBlockPattern = /<!-- AI_RULES_SYNC:START -->[\s\S]+<!-- AI_RULES_SYNC:END -->/;

    expect(agentsMirror.match(syncBlockPattern)?.[0]).toBe(
      copilotMirror.match(syncBlockPattern)?.[0]
    );
    expect(agentsMirror).toContain(
      'Treat ARIA, keyboard flow, focus handling, overlays, and reduced-motion behavior as structural contracts.'
    );
  });

  it('renders the generated index from the manifest inventory', () => {
    const renderedIndex = renderRuleIndex();

    for (const applyMode of AI_RULE_APPLY_MODES) {
      expect(renderedIndex).toContain(`Apply mode: \`${applyMode}\``);
    }

    for (const entry of AI_RULE_MANIFEST) {
      expect(renderedIndex).toContain(entry.id);
      expect(renderedIndex).toContain(entry.title);
    }
  });

  it('keeps manifest metadata tags within declared allow-lists', () => {
    const layerTags = new Set(AI_RULE_LAYER_TAGS);
    const areaTags = new Set(AI_RULE_AREA_TAGS);
    const packageTags = new Set(AI_RULE_PACKAGE_TAGS);

    for (const entry of AI_RULE_MANIFEST) {
      for (const tag of entry.layerTags ?? []) {
        expect(layerTags.has(tag)).toBe(true);
      }

      for (const tag of entry.areaTags ?? []) {
        expect(areaTags.has(tag)).toBe(true);
      }

      for (const tag of entry.packageTags ?? []) {
        expect(packageTags.has(tag)).toBe(true);
      }
    }
  });
});
