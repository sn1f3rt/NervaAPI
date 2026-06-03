from importlib.metadata import (
    PackageNotFoundError,
    version as pkg_version,
)

from quart import Response, jsonify, current_app
from quart_rate_limiter import rate_exempt

from . import index_bp

try:
    API_VERSION = pkg_version("NervaAPI")
except PackageNotFoundError:  # the package is always installed in practice
    API_VERSION = "0.0.0"


@index_bp.route("/")
@rate_exempt
async def _index() -> tuple[Response, int]:
    return jsonify(
        {
            "name": "NervaAPI",
            "version": API_VERSION,
            "status": "ok",
            "docs": current_app.config["DOCS_URL"],
        }
    ), 200
