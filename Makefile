.PHONY: docs dev lab playground aiassistant-rules

docs:
	pnpm dev:docs

dev:
	pnpm dev:playground

lab:
	pnpm dev:playground

playground:
	pnpm dev:playground

aiassistant-rules:
	pnpm build:ai-rules
