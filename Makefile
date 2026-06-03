install: install-prod

install-dev:
	uv sync --all-extras

install-prod:
	uv sync --all-extras --no-dev

run: run-dev

run-dev:
	uv run hypercorn --reload --bind 127.0.0.1:8080 backend.launcher:app

run-prod:
	uv run hypercorn --bind 0.0.0.0:17568 backend.launcher:app

run-prod-ssl:
	uv run hypercorn --bind 0.0.0.0:17568 --certfile cert.pem --keyfile key.pem backend.launcher:app

lint:
	uv run ruff check --fix .
	uv run ruff format .

typecheck:
	uv run mypy src/backend

frontend-install:
	npm ci

frontend-dev:
	npm run dev

frontend-build:
	npm run build

frontend-typecheck:
	npm run typecheck:frontend

clean:
	rm -f logs/*.log

.PHONY: install install-dev install-prod run run-dev run-prod run-prod-ssl lint typecheck frontend-install frontend-dev frontend-build frontend-typecheck clean
.DEFAULT_GOAL := run
