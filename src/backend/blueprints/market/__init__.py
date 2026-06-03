from quart import Blueprint

market_bp: Blueprint = Blueprint("market", __name__)

from . import routes
