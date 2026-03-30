.PHONY: docs playground aiassistant-rules

docs:
	pnpm dev:docs

dev:
	pnpm dev:playground

aiassistant-rules:
	pnpm build:ai-rules
