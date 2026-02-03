import asyncio
from datetime import timedelta
from logging.config import dictConfig

import aiohttp
import schedule
import motor.motor_asyncio
from quart import Quart, Response, jsonify
from nerva.daemon import Daemon, DaemonLegacy
from quart_rate_limiter import limit_blueprint

daemon: Daemon
daemon_legacy: DaemonLegacy

db: motor.motor_asyncio.AsyncIOMotorDatabase


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
    async with aiohttp.ClientSession() as session:
        async with session.delete("http://localhost:5000/analytics/prune"):
            pass


def setup_schedule() -> None:
    schedule.every().day.at("00:00").do(
        lambda: asyncio.create_task(prune_analytics())
    )


def create_app() -> Quart:
    app: Quart = Quart(__name__, static_url_path="/assets", static_folder="assets")
    app.config.from_pyfile("config.py")

    global daemon, daemon_legacy
    daemon = Daemon(
        host=app.config["DAEMON_RPC_HOST"],
        port=app.config["DAEMON_RPC_PORT"],
        ssl=app.config["DAEMON_RPC_SSL"],
    )
    daemon_legacy = DaemonLegacy(
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

    from blueprints.index import index_bp
    from blueprints.daemon import daemon_bp
    from blueprints.market import market_bp
    from blueprints.analytics import analytics_bp

    limit_blueprint(analytics_bp, 60, timedelta(seconds=60))
    limit_blueprint(daemon_bp, 60, timedelta(seconds=60))
    limit_blueprint(index_bp, 60, timedelta(seconds=60))
    limit_blueprint(market_bp, 60, timedelta(seconds=60))

    app.register_blueprint(analytics_bp)
    app.register_blueprint(daemon_bp)
    app.register_blueprint(index_bp)
    app.register_blueprint(market_bp)

    return app
