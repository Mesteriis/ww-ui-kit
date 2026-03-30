import {
  AI_RULE_OVERVIEW_PATH,
  AI_RULESET_INDEX_PATH,
  renderAgentsMirror,
  renderAiRuleOverview,
  renderCopilotInstructions,
  renderRuleIndex,
  writeAiAssistantMirror,
  writeGeneratedFile,
} from './shared.mjs';

writeGeneratedFile(AI_RULE_OVERVIEW_PATH, renderAiRuleOverview());
writeGeneratedFile('AGENTS.md', renderAgentsMirror());
writeGeneratedFile('.github/copilot-instructions.md', renderCopilotInstructions());
writeGeneratedFile(AI_RULESET_INDEX_PATH, renderRuleIndex());
writeAiAssistantMirror();

console.log('AI rules overview, mirrors, local .aiassistant pack, and index refreshed.');
