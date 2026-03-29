import { checkAiRuleFrontmatter } from './check-ai-rule-frontmatter.mjs';
import { checkAiRuleIndex } from './check-ai-rule-index.mjs';
import { checkAiRuleSync } from './check-ai-rule-sync.mjs';

checkAiRuleFrontmatter();
checkAiRuleIndex();
checkAiRuleSync();

console.log('AI rules pack OK.');
