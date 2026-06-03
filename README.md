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

The documentation site is a Vue 3 + Tailwind CSS app located in [`src/frontend`](src/frontend). It is a static API reference and is deployed separately from the backend. The JS tooling (`package.json`, Vite and TypeScript configs) lives at the repository root, alongside `pyproject.toml`.

1. Install the Node dependencies

   ```shell
   npm install # or make frontend-install
   ```

2. Point it at your API by copying [`.env.example`](.env.example) to `.env` and setting `VITE_API_BASE_URL`.

3. Start the dev server (runs on `http://localhost:3000`)

   ```shell
   npm run dev # or make frontend-dev
   ```

   To bring up the whole stack at once — the backend on `:8080` and the docs on `:3000` — run:

   ```shell
   npm run serve
   ```

4. Build the static site for production (outputs to `dist/`)

   ```shell
   npm run build # or make frontend-build
   ```

Deploy the contents of `dist/` to any static host (CDN, nginx, GitHub Pages). Since the frontend and backend are deployed to different origins, set `CORS_ALLOW_ORIGIN` in the backend config to the docs origin.

## License

[![License](https://img.shields.io/github/license/sn1f3rt/NervaAPI)](LICENSE)

Copyright &copy; 2024-present [Sayan "sn1f3rt" Bhattacharyya](https://sn1f3rt.dev), [The Nerva Project](https://nerva.one)
