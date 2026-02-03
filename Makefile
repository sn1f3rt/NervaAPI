env:
	uv venv

rmenv:
	rm -rf .venv

install: install-prod

install-dev:
	uv sync --all-extras

install-prod:
	uv sync --all-extras --no-dev

run: run-dev

run-dev:
	uv run launcher.py

run-prod:
	uv run hypercorn --bind 0.0.0.0:13568 launcher:app

run-prod-ssl:
	uv run hypercorn --bind 0.0.0.0:13568 --certfile cert.pem --keyfile key.pem launcher:app

format:
	ruff check --fix .
	ruff format .

clean:
	rm -f logs/*.log

.PHONY: env rmenv install install-dev install-prod run run-dev run-prod run-prod-ssl format clean
.DEFAULT_GOAL := run
