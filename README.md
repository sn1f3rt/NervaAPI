# NervaAPI

[![Lint](https://github.com/Sn1F3rt/NervaAPI/actions/workflows/lint.yml/badge.svg)](https://github.com/Sn1F3rt/NervaAPI/actions/workflows/lint.yml)
[![Type Check](https://github.com/Sn1F3rt/NervaAPI/actions/workflows/typecheck.yml/badge.svg)](https://github.com/Sn1F3rt/NervaAPI/actions/workflows/typecheck.yml)
[![Build](https://github.com/Sn1F3rt/NervaAPI/actions/workflows/build.yml/badge.svg)](https://github.com/Sn1F3rt/NervaAPI/actions/workflows/build.yml)

## Table of Contents

- [About](#about)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running](#running)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [License](#license)

## About

NervaAPI is a RESTful API server for the Nerva blockchain. It provides a simple interface to interact with the Nerva blockchain using HTTP requests.

The repository is a monorepo: the Quart API lives in [`src/backend`](src/backend), and the documentation site — a Vue 3 + Tailwind CSS app built with Vite — lives in [`src/frontend`](src/frontend).

## Prerequisites

- Git
- Python >= 3.10
- MongoDB database
- [`uv` package manager](https://docs.astral.sh/uv/getting-started/installation/)
- Node.js >= 22 (for the documentation frontend)
- [make](https://www.gnu.org/software/make/) (optional)

## Installation

1. Clone the repository

   ```shell
    git clone https://github.com/Sn1F3rt/NervaAPI.git
   ```
   
2. Switch to the project directory

   ```shell
    cd NervaAPI
   ```
   
3. Create a virtual environment

   ```shell
   uv venv
   ```
   
4. Install dependencies

   ```shell
    uv sync --all-extras --no-dev # or make install
   ```

## Configuration

Copy the [`config.example.py`](src/backend/config.example.py) file to `src/backend/config.py` and update the variables.

## Running

### Development

```shell
uv run python -m backend.launcher # or make run
```

The API server will be running at `http://localhost:8080`.

### Production

```shell
uv run hypercorn --bind 0.0.0.0:17568 backend.launcher:app # or make run-prod
```

or if you want to enable SSL support

```shell
uv run hypercorn --certfile cert.pem --keyfile key.pem --bind 0.0.0.0:17568 backend.launcher:app # or make run-prod-ssl
```

The API server will be running at `http://localhost:17568`. The certificate and key files are required for SSL support.

## Documentation

The documentation site is a Vue 3 + Tailwind CSS app located in [`src/frontend`](src/frontend). It is a static API reference. The API is served under `/v1` on the same origin, so the docs derive their base URL from the browser — there is nothing to configure. The JS tooling (`package.json`, Vite and TypeScript configs) lives at the repository root, alongside `pyproject.toml`.

1. Install the Node dependencies

   ```shell
   npm install # or make frontend-install
   ```

2. Start the dev server — runs on `http://127.0.0.1:3000` and proxies `/v1` to the backend on `:8080`

   ```shell
   npm run dev # or make frontend-dev
   ```

   To bring up the whole stack at once — the backend on `:8080` and the docs on `:3000` — run:

   ```shell
   npm run serve
   ```

3. Build the static site for production (outputs to `dist/`)

   ```shell
   npm run build # or make frontend-build
   ```

In production, nginx serves the built `dist/` and reverse-proxies `/v1` to the API — see [Deployment](#deployment).

## Deployment

The repository ships a Docker Compose stack that builds the documentation, serves it, and runs the API behind a single port. It is meant to sit behind an existing reverse proxy (e.g. HestiaCP) that terminates TLS for your domain. Two services:

- **web** — nginx serving the built docs and reverse-proxying everything under `/v1` to the API. Published on `127.0.0.1:17568`.
- **api** — the Quart app run with Hypercorn (internal only).

MongoDB (Atlas) and the Nerva daemon are external, so they are configured, not containerised.

1. Create the backend config (kept out of the image and mounted at runtime):

   ```shell
   cp src/backend/config.example.py src/backend/config.py
   ```

   Set `MONGODB_URI` (your Atlas URI), `DAEMON_RPC_HOST`/`DAEMON_RPC_PORT` (your remote daemon), `CORS_ALLOW_ORIGIN` and `DOCS_URL`.

2. Build and start (detached):

   ```shell
   docker compose up -d --build
   ```

   `restart: unless-stopped` keeps the stack running across reboots — ensure the Docker service itself starts on boot (`systemctl enable docker`).

The site is then reachable at `http://127.0.0.1:17568`: the docs at `/`, the API at `/v1/...`.

### Behind HestiaCP

Point the domain's proxy at the stack over plain HTTP (TLS stays at HestiaCP's edge — no certificates are needed inside the stack). Using a custom web template, set:

```nginx
location / {
    proxy_pass http://127.0.0.1:17568;
}
```

## License

[![License](https://img.shields.io/github/license/sn1f3rt/NervaAPI)](LICENSE)

Copyright &copy; 2024-present [Sayan "sn1f3rt" Bhattacharyya](https://sn1f3rt.dev), [The Nerva Project](https://nerva.one)
