from typing import Any

from datetime import datetime

import aiohttp
from quart import Response, jsonify, request, current_app

from backend.factory import db

from . import analytics_bp


@analytics_bp.route("/analytics/fetch", methods=["GET"])
async def _analytics_fetch() -> tuple[Response, int]:
    if not current_app.config["ANALYTICS_ENABLED"]:
        return jsonify({"status": "error", "message": "Analytics is disabled"}), 400

    try:
        collection = db.get_collection("analytics")

        data: dict[str, Any] = {"status": "success", "result": []}

        async for document in collection.find():
            data["result"].append(document)

        return jsonify(data), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400


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
                {"$set": {"version": version, "last_updated": datetime.now()}},
            )

            return jsonify({"status": "success"}), 200

        else:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"https://tools.keycdn.com/geo.json?host={ip}",
                    headers={"User-Agent": "keycdn-tools:https://map.nerva.one"},
                ) as res:
                    if res.status != 200:
                        return (
                            jsonify(
                                {
                                    "status": "error",
                                    "message": "Failed to fetch IP data",
                                }
                            ),
                            400,
                        )

                    data = (await res.json())["data"]["geo"]

                    if data["ip"] != ip:
                        return (
                            jsonify({"status": "error", "message": "Invalid IP"}),
                            400,
                        )

                    await collection.insert_one(
                        {
                            "ip": ip,
                            "version": version,
                            "last_updated": datetime.now(),
                            "latitude": data["latitude"],
                            "longitude": data["longitude"],
                            "country": data["country_code"],
                            "continent": data["continent_code"],
                        }
                    )

                    return jsonify({"status": "success"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400


async def prune_stale_analytics() -> None:
    collection = db.get_collection("analytics")

    async for document in collection.find():
        if (datetime.now() - document["last_updated"]).days > 7:
            await collection.delete_one({"ip": document["ip"]})


@analytics_bp.route("/analytics/prune", methods=["DELETE"])
async def _analytics_prune() -> tuple[Response, int]:
    if not current_app.config["ANALYTICS_ENABLED"]:
        return jsonify({"status": "error", "message": "Analytics is disabled"}), 400

    try:
        await prune_stale_analytics()
        return jsonify({"status": "success"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
