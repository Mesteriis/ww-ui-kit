import {
  AI_RULE_OVERVIEW_PATH,
  AI_RULESET_INDEX_PATH,
  renderAgentsMirror,
  renderAiRuleOverview,
  renderCopilotInstructions,
  renderRuleIndex,
  writeGeneratedFile,
} from './shared.mjs';

writeGeneratedFile(AI_RULE_OVERVIEW_PATH, renderAiRuleOverview());
writeGeneratedFile('AGENTS.md', renderAgentsMirror());
writeGeneratedFile('.github/copilot-instructions.md', renderCopilotInstructions());
writeGeneratedFile(AI_RULESET_INDEX_PATH, renderRuleIndex());

console.log('AI rules overview, mirrors, and index refreshed.');
