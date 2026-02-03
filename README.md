# NervaAPI

[![Ruff](https://github.com/Sn1F3rt/NervaAPI/actions/workflows/ruff.yml/badge.svg)](https://github.com/Sn1F3rt/NervaAPI/actions/workflows/ruff.yml)

## Table of Contents

- [About](#about)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running](#running)
- [License](#license)

## About

NervaAPI is a RESTful API server for the Nerva blockchain. It provides a simple interface to interact with the Nerva blockchain using HTTP requests.

## Prerequisites

- Git
- Python >= 3.10
- MongoDB database- [`uv` package manager](https://docs.astral.sh/uv/getting-started/installation/)
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
   uv venv # or make env
   ```
   
4. Install dependencies

   ```shell
    uv sync --all-extras --no-dev # or make install
   ```

## Configuration

Copy the [`config.example.py`](config.example.py) file to `config.py` and update the variables.

## Running

### Development

```shell
uv run launcher.py # or make run
```

The API server will be running at `http://localhost:5000`.

### Production

```shell
uv run hypercorn --bind 0.0.0.0:13568 launcher:app # or make run-prod
```

or if you want to enable SSL support

```shell
uv run hypercorn --certfile cert.pem --keyfile key.pem --bind 0.0.0.0:13568 launcher:app # or make run-prod-ssl
```

The API server will be running at `http://localhost:13568`. The certificate and key files are required for SSL support.

## License

[![License](https://img.shields.io/github/license/sn1f3rt/NervaAPI)](LICENSE)

Copyright &copy; 2024-present [Sayan "sn1f3rt" Bhattacharyya](https://sn1f3rt.dev), [The Nerva Project](https://nerva.one)
