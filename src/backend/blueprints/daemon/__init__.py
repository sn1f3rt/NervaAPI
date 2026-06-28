from quart import Blueprint

daemon_bp: Blueprint = Blueprint("daemon", __name__)

from . import routes  # noqa: E402, F401
