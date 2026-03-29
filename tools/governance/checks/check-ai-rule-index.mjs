import {
  renderRuleIndex,
  AI_RULESET_INDEX_PATH,
  isDirectExecution,
  readGeneratedFile,
} from '../ai-rules/shared.mjs';

export function checkAiRuleIndex() {
  const expected = renderRuleIndex().trimEnd();
  const actual = readGeneratedFile(AI_RULESET_INDEX_PATH);
  if (actual !== expected) {
    throw new Error(
      `${AI_RULESET_INDEX_PATH} is out of sync with the AI rule manifest. Run "pnpm build:ai-rules".`
    );
  }

  console.log('AI rule index sync OK.');
}

if (isDirectExecution(import.meta.url)) {
  checkAiRuleIndex();
}
