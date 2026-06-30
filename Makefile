.PHONY: build test lint

build:
	pnpm typecheck

test:
	pnpm test

lint:
	pnpm typecheck
