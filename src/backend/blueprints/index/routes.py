from quart import Response, jsonify, current_app
from quart_rate_limiter import rate_exempt

from . import index_bp


@index_bp.route("/")
@rate_exempt
async def _index() -> tuple[Response, int]:
    return jsonify(
        {
            "name": "NervaAPI",
            "version": "1.0.0",
            "status": "ok",
            "docs": current_app.config["DOCS_URL"],
        }
    ), 200
