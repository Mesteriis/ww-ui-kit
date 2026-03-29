import {
  AI_RULE_OVERVIEW_PATH,
  isDirectExecution,
  readGeneratedFile,
  renderAgentsMirror,
  renderAiRuleOverview,
  renderCopilotInstructions,
} from '../ai-rules/shared.mjs';

export function checkAiRuleSync() {
  const generatedFiles = [
    [AI_RULE_OVERVIEW_PATH, renderAiRuleOverview().trimEnd()],
    ['AGENTS.md', renderAgentsMirror().trimEnd()],
    ['.github/copilot-instructions.md', renderCopilotInstructions().trimEnd()],
  ];

  for (const [relativePath, expected] of generatedFiles) {
    const actual = readGeneratedFile(relativePath);
    if (actual !== expected) {
      throw new Error(
        `${relativePath} is out of sync with the canonical AI rules pack. Run "pnpm build:ai-rules".`
      );
    }
  }

  console.log('AI rule mirrors sync OK.');
}

if (isDirectExecution(import.meta.url)) {
  checkAiRuleSync();
}
