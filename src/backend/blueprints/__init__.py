from quart import Blueprint

from .index import index_bp
from .daemon import daemon_bp
from .market import market_bp
from .analytics import analytics_bp

__all__ = ["api_bp", "analytics_bp", "daemon_bp", "index_bp", "market_bp"]

api_bp: Blueprint = Blueprint("api", __name__, url_prefix="/v1")

api_bp.register_blueprint(index_bp)
api_bp.register_blueprint(daemon_bp)
api_bp.register_blueprint(market_bp)
api_bp.register_blueprint(analytics_bp)
