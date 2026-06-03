import asyncio

from quart import Quart

from backend.factory import create_app

try:
    # noinspection PyUnresolvedReferences
    import uvloop

except ImportError:
    pass

else:
    asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

app: Quart = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080)
