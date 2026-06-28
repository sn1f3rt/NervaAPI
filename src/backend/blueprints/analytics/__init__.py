from quart import Blueprint

analytics_bp: Blueprint = Blueprint("analytics", __name__)

from . import routes  # noqa: E402, F401
