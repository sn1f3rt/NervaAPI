from typing import Any

import asyncio
from datetime import timedelta
from logging.config import dictConfig

import schedule
import motor.motor_asyncio
from nerva import DaemonRPC, DaemonHTTP
from quart import Quart, Response, jsonify, request
from quart_cors import cors
from quart_rate_limiter import RateLimiter, limit_blueprint

daemon: DaemonRPC
daemon_legacy: DaemonHTTP

db: motor.motor_asyncio.AsyncIOMotorDatabase[dict[str, Any]]

analytics_enabled: bool = False


dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s | %(module)s >>> %(message)s",
                "datefmt": "%B %d, %Y %H:%M:%S %Z",
            }
        },
        "handlers": {
            "time-rotate": {
                "class": "logging.handlers.TimedRotatingFileHandler",
                "formatter": "default",
                "filename": "logs/app.log",
                "when": "midnight",
                "interval": 1,
                "backupCount": 7,
                "encoding": "utf-8",
            },
        },
        "root": {"level": "INFO", "handlers": ["time-rotate"]},
    }
)


async def schedule_task() -> None:
    while True:
        schedule.run_pending()
        await asyncio.sleep(1)


async def prune_analytics() -> None:
    if not analytics_enabled:
        return

    from backend.blueprints.analytics.routes import prune_stale_analytics

    await prune_stale_analytics()


def setup_schedule() -> None:
    schedule.every().day.at("00:00").do(
        lambda: asyncio.create_task(prune_analytics())
    )


async def _rate_limit_key() -> str:
    return request.headers.get("CF-Connecting-IP") or request.access_route[0]


def create_app() -> Quart:
    app: Quart = Quart(__name__, static_folder=None)
    app.config.from_pyfile("config.py")

    app = cors(app, allow_origin=app.config["CORS_ALLOW_ORIGIN"])

    RateLimiter(app, key_function=_rate_limit_key)

    global analytics_enabled
    analytics_enabled = app.config["ANALYTICS_ENABLED"]

    global daemon, daemon_legacy
    daemon = DaemonRPC(
        host=app.config["DAEMON_RPC_HOST"],
        port=app.config["DAEMON_RPC_PORT"],
        ssl=app.config["DAEMON_RPC_SSL"],
    )
    daemon_legacy = DaemonHTTP(
        host=app.config["DAEMON_RPC_HOST"],
        port=app.config["DAEMON_RPC_PORT"],
        ssl=app.config["DAEMON_RPC_SSL"],
    )

    global db
    db = motor.motor_asyncio.AsyncIOMotorClient(app.config["MONGODB_URI"])[
        app.config["MONGODB_DB"]
    ]

    @app.errorhandler(400)
    async def _handle_bad_request(_: Exception) -> tuple[Response, int]:
        return jsonify({"error": "Bad request"}), 400

    @app.errorhandler(404)
    async def _handle_not_found(_: Exception) -> tuple[Response, int]:
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(405)
    async def _handle_method_not_allowed(_: Exception) -> tuple[Response, int]:
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(429)
    async def _handle_too_many_requests(_: Exception) -> tuple[Response, int]:
        return jsonify({"error": "Too many requests"}), 429

    @app.errorhandler(500)
    async def _handle_server_error(_: Exception) -> tuple[Response, int]:
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(asyncio.TimeoutError)
    async def _handle_timeout_error(_: Exception) -> tuple[Response, int]:
        return jsonify({"error": "Request to daemon timed out"}), 504

    @app.errorhandler(Exception)
    async def _handle_exception(e: Exception) -> tuple[Response, int]:
        app.logger.error(e)
        return jsonify({"error": "An unexpected error occurred"}), 500

    from backend.blueprints import (
        api_bp,
        index_bp,
        daemon_bp,
        market_bp,
        analytics_bp,
    )

    count: int = app.config["RATE_LIMIT_COUNT"]
    period: timedelta = timedelta(seconds=app.config["RATE_LIMIT_PERIOD"])

    limit_blueprint(analytics_bp, count, period)
    limit_blueprint(daemon_bp, count, period)
    limit_blueprint(index_bp, count, period)
    limit_blueprint(market_bp, count, period)

    app.register_blueprint(api_bp)

    return app
