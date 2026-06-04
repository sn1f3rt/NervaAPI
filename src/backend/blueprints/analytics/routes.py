from typing import Any

from datetime import datetime

import aiohttp
from quart import Response, jsonify, request, current_app

from backend.factory import db

from . import analytics_bp


def _mask_ip(ip: str) -> str:
    parts = ip.split(".")
    if len(parts) == 4:
        return f"{parts[0]}.*.*.{parts[3]}"
    return "*"


@analytics_bp.route("/analytics/fetch", methods=["GET"])
async def _analytics_fetch() -> tuple[Response, int]:
    if not current_app.config["ANALYTICS_ENABLED"]:
        return jsonify({"status": "error", "message": "Analytics is disabled"}), 400

    try:
        collection = db.get_collection("analytics")

        result: list[dict[str, Any]] = []
        async for document in collection.find():
            time = document.get("time")
            result.append(
                {
                    "version": document.get("version"),
                    "time": time.strftime("%Y-%m-%d %H:%M:%S")
                    if isinstance(time, datetime)
                    else time,
                    "ip": _mask_ip(document.get("ip", "")),
                    "lat": document.get("lat"),
                    "long": document.get("long"),
                    "cn": document.get("cn"),
                    "cc": document.get("cc"),
                }
            )

        return jsonify({"status": "success", "result": result}), 200

    except Exception:
        return jsonify(
            {"status": "error", "message": "Failed to fetch analytics"}
        ), 400


@analytics_bp.route("/analytics/submit", methods=["POST"])
async def _analytics_submit() -> tuple[Response, int]:
    if not current_app.config["ANALYTICS_ENABLED"]:
        return jsonify({"status": "error", "message": "Analytics is disabled"}), 400

    try:
        collection = db.get_collection("analytics")

        ip: str | None = request.headers.get("CF-Connecting-IP", None)
        if not ip:
            ip = request.headers.get("X-Forwarded-For", request.remote_addr)

        async with aiohttp.ClientSession() as session:
            async with session.get(f"https://ipinfo.io/{ip}/json") as res:
                if res.status != 200:
                    return (
                        jsonify(
                            {"status": "error", "message": "Failed to fetch IP data"}
                        ),
                        400,
                    )

                data: dict[str, Any] = await res.json()

                if "bogon" in data:
                    return jsonify({"status": "error", "message": "Invalid IP"}), 400

        ua: str | None = request.headers.get("User-Agent", None)
        if not ua or not ua[0:9] == "nerva-cli":
            return jsonify({"status": "error", "message": "Invalid User-Agent"}), 400

        version: str = ua[10:]

        if await collection.find_one({"ip": ip}) is not None:
            await collection.update_one(
                {"ip": ip},
                {"$set": {"version": version, "time": datetime.now()}},
            )

            return jsonify({"status": "success"}), 200

        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"https://tools.keycdn.com/geo.json?host={ip}",
                headers={"User-Agent": "keycdn-tools:https://map.nerva.one"},
            ) as res:
                if res.status != 200:
                    return (
                        jsonify(
                            {"status": "error", "message": "Failed to fetch IP data"}
                        ),
                        400,
                    )

                geo: dict[str, Any] = (await res.json())["data"]["geo"]

        if geo["ip"] != ip:
            return jsonify({"status": "error", "message": "Invalid IP"}), 400

        await collection.insert_one(
            {
                "version": version,
                "time": datetime.now(),
                "ip": ip,
                "lat": geo["latitude"],
                "long": geo["longitude"],
                "cn": geo["continent_code"],
                "cc": geo["country_code"],
            }
        )

        return jsonify({"status": "success"}), 200

    except Exception:
        return jsonify(
            {"status": "error", "message": "Failed to submit analytics"}
        ), 400


async def prune_stale_analytics() -> None:
    collection = db.get_collection("analytics")

    async for document in collection.find():
        if (datetime.now() - document["time"]).days > 7:
            await collection.delete_one({"ip": document["ip"]})
