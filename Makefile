.PHONY: docs playground aiassistant-rules

docs:
	pnpm dev:docs

dev:
	pnpm dev:playground

aiassistant-rules:
	rm -rf .aiassistant/rules
	mkdir -p .aiassistant/rules
	cp docs/governance/ai-rules.md .aiassistant/rules/ai-rules-overview.md
	find docs/governance/ai-ruleset -type f -name '*.md' | sort | while IFS= read -r source; do \
		relative_path="$${source#docs/governance/ai-ruleset/}"; \
		target_name="ai-ruleset-$$(printf '%s' "$$relative_path" | sed 's#/#-#g')"; \
		cp "$$source" ".aiassistant/rules/$$target_name"; \
	done
