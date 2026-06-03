import asyncio

from quart import Quart

from backend.factory import create_app, schedule_task, setup_schedule

try:
    # noinspection PyUnresolvedReferences
    import uvloop

except ImportError:
    pass

else:
    asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

app: Quart = create_app()


if __name__ == "__main__":
    setup_schedule()

    loop: asyncio.AbstractEventLoop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    loop.create_task(schedule_task())

    app.run(host="127.0.0.1", port=8080, loop=loop)
