from __future__ import annotations

from typing import Any, Dict, List, Optional

from nerva import utils
from quart import Response, jsonify, request
from validators import ip_address

from factory import daemon, daemon_legacy

from . import daemon_bp


@daemon_bp.route("/daemon/get_version", methods=["GET"])
async def _daemon_get_version() -> tuple[Response, int]:
    data: Dict[str, Any] = await daemon.get_version()

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_info", methods=["GET"])
async def _daemon_get_info() -> tuple[Response, int]:
    data: Dict[str, Any] = await daemon.get_info()

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/hard_fork_info", methods=["GET"])
async def _daemon_hard_fork_info() -> tuple[Response, int]:
    data: Dict[str, Any] = await daemon.hard_fork_info()

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_block", methods=["GET"])
async def _daemon_get_block() -> tuple[Response, int]:
    block_hash: Optional[str] = request.args.get("hash", None)
    height: Optional[str] = request.args.get("height", None)

    if block_hash and height:
        return (
            jsonify(
                {
                    "status": "error",
                    "error": "You can only provide either a block hash or a block height",
                }
            ),
            400,
        )

    elif not block_hash and not height:
        return (
            jsonify(
                {
                    "status": "error",
                    "error": "You must provide either a block hash or a block height",
                }
            ),
            400,
        )

    data: Dict[str, Any]
    if block_hash:
        data = await daemon.get_block(block_hash=block_hash)

    else:
        try:
            data = await daemon.get_block(height=int(height))  # type: ignore

        except ValueError:
            return jsonify({"status": "error", "error": "Invalid block height"}), 400

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_block_count", methods=["GET"])
async def _daemon_get_block_count() -> tuple[Response, int]:
    data: Dict[str, Any] = await daemon.get_block_count()

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_last_block_header", methods=["GET"])
async def _daemon_get_last_block_header() -> tuple[Response, int]:
    data: Dict[str, Any] = await daemon.get_last_block_header()

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_block_header_by_hash", methods=["GET"])
async def _daemon_get_block_header_by_hash() -> tuple[Response, int]:
    block_hash: Optional[str] = request.args.get("hash", None)

    if not block_hash:
        return (
            jsonify({"status": "error", "error": "You must provide a block hash"}),
            400,
        )

    data: Dict[str, Any] = await daemon.get_block_header_by_hash(
        block_hash=block_hash
    )

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_block_header_by_height", methods=["GET"])
async def _daemon_get_block_header_by_height() -> tuple[Response, int]:
    height: Optional[str] = request.args.get("height", None)

    if not height:
        return (
            jsonify({"status": "error", "error": "You must provide a block height"}),
            400,
        )

    try:
        data: Dict[str, Any] = await daemon.get_block_header_by_height(
            height=int(height)
        )  # type: ignore

    except (TypeError, ValueError):
        return jsonify({"status": "error", "error": "Invalid block height"}), 400

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_block_headers_range", methods=["GET"])
async def _daemon_get_block_headers_range() -> tuple[Response, int]:
    start_height: Optional[str] = request.args.get("start_height", None)
    end_height: Optional[str] = request.args.get("end_height", None)

    if not start_height or not end_height:
        return (
            jsonify(
                {
                    "status": "error",
                    "error": "You must provide both a start height and an end height",
                }
            ),
            400,
        )

    try:
        data: Dict[str, Any] = await daemon.get_block_headers_range(
            start_height=int(start_height),  # type: ignore
            end_height=int(end_height),  # type: ignore
        )

    except (TypeError, ValueError):
        return jsonify({"status": "error", "error": "Invalid block height"}), 400

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_block_template", methods=["GET"])
async def _daemon_get_block_template() -> tuple[Response, int]:
    address: Optional[str] = request.args.get("address", None)
    reserve: Optional[str] = request.args.get("reserve", None)

    try:
        data: Dict[str, Any] = await daemon.get_block_template(
            wallet_address=address,
            reserve_size=int(reserve),  # type: ignore
        )

    except (TypeError, ValueError):
        return jsonify({"status": "error", "error": "Invalid reserve size"}), 400

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_connections", methods=["GET"])
async def _daemon_get_connections() -> tuple[Response, int]:
    data: Dict[str, Any] = await daemon.get_connections()

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_fee_estimate", methods=["GET"])
async def _daemon_get_fee_estimate() -> tuple[Response, int]:
    grace_blocks: Optional[str] = request.args.get("grace_blocks", None)

    data: Dict[str, Any]
    if not grace_blocks:
        data = await daemon.get_fee_estimate()

    else:
        try:
            data = await daemon.get_fee_estimate(grace_blocks=int(grace_blocks))  # type: ignore

        except (TypeError, ValueError):
            return jsonify({"status": "error", "error": "Invalid grace blocks"}), 400

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_generated_coins", methods=["GET"])
async def _daemon_get_generated_coins() -> tuple[Response, int]:
    checkpoint_block_number: int = 3100000
    checkpoint_total_coins: float = 18869659.7794
    reward_per_block: float = 0.3

    current_block_number: int = (await daemon.get_block_count())["result"]["count"]

    block_diff: int = current_block_number - checkpoint_block_number
    generated_coins: float = checkpoint_total_coins + (block_diff * reward_per_block)

    return jsonify({"status": "success", "result": {"coins": generated_coins}}), 200


@daemon_bp.route("/daemon/get_bans", methods=["GET"])
async def _daemon_get_bans() -> tuple[Response, int]:
    data: Dict[str, Any] = await daemon.get_bans()

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/set_bans", methods=["POST"])
async def _daemon_set_bans() -> tuple[Response, int]:
    data: Dict[str, Any] = await request.get_json()

    if not data:
        return (
            jsonify(
                {
                    "status": "error",
                    "error": "You must provide a host, ban status and time",
                }
            ),
            400,
        )

    host: Optional[str] = data.get("host")
    ban: Optional[str] = data.get("ban")
    time: Optional[str] = data.get("time")

    if not all([host, ban, time]):
        return (
            jsonify(
                {
                    "status": "error",
                    "error": "You must provide a host, ban status and time",
                }
            ),
            400,
        )

    if not all([isinstance(host, str), isinstance(ban, str), isinstance(time, str)]):
        return jsonify({"status": "error", "error": "Invalid data type"}), 400

    if not ip_address.ipv4(host):
        return jsonify({"status": "error", "error": "Invalid host"}), 400

    if ban.lower() not in ["true", "false"]:
        return jsonify({"status": "error", "error": "Invalid ban status"}), 400

    if utils.calculate_seconds_from_time_string(time) == 0:
        return jsonify({"status": "error", "error": "Invalid time"}), 400

    ban_status: bool = True if ban == "true" else False
    seconds: int = utils.calculate_seconds_from_time_string(time)

    data = await daemon.set_bans(
        [{"host": host, "ban": ban_status, "seconds": seconds}]
    )

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200


@daemon_bp.route("/daemon/get_transaction_pool", methods=["GET"])
async def _daemon_get_transaction_pool() -> tuple[Response, int]:
    data: Dict[str, Any] = await daemon_legacy.get_transaction_pool()

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return (
        jsonify(
            {
                "status": "success",
                "result": {
                    "credits": data.get("credits", 0),
                    "spent_key_images": data.get("spent_key_images", []),
                    "transactions": data.get("transactions", []),
                },
            }
        ),
        200,
    )


@daemon_bp.route("/daemon/get_transaction_pool_stats", methods=["GET"])
async def _daemon_get_transaction_pool_stats() -> tuple[Response, int]:
    data: Dict[str, Any] = await daemon_legacy.get_transaction_pool_stats()

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return (
        jsonify(
            {
                "status": "success",
                "result": {"pool_stats": data.get("pool_stats", {})},
            }
        ),
        200,
    )


@daemon_bp.route("/daemon/get_transactions", methods=["GET"])
async def _daemon_get_transactions() -> tuple[Response, int]:
    hashes: List[str] = request.args.getlist("hashes")
    decode_as_json: bool = request.args.get("decode_as_json", False) == "true"
    prune: bool = request.args.get("prune", False) == "true"
    split: bool = request.args.get("split", False) == "true"

    if not hashes:
        return (
            jsonify(
                {
                    "status": "error",
                    "error": "You must provide a list of transaction hashes",
                }
            ),
            400,
        )

    data: Dict[str, Any] = await daemon_legacy.get_transactions(
        txs_hashes=hashes, decode_as_json=decode_as_json, prune=prune, split=split
    )

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return (
        jsonify(
            {
                "status": "success",
                "result": {
                    "missed_tx": data.get("missed_tx", []),
                    "top_hash": data.get("top_hash", ""),
                    "txs": data.get("txs", []),
                },
            }
        ),
        200,
    )


@daemon_bp.route("/daemon/decode_outputs", methods=["POST"])
async def _daemon_decode_outputs() -> tuple[Response, int]:
    data: Dict[str, Any] = await request.get_json()

    if not data:
        return (
            jsonify(
                {
                    "status": "error",
                    "error": "You must provide a list of transaction hashes, "
                    "the public address of the receiver and "
                    "the private view key of the receiver",
                }
            ),
            400,
        )

    hashes: Optional[List[str]] = data.get("hashes")
    address: Optional[str] = data.get("address")
    view_key: Optional[str] = data.get("view_key")

    if not all([hashes, address, view_key]):
        return (
            jsonify(
                {
                    "status": "error",
                    "error": "You must provide a list of transaction hashes, "
                    "the public address of the receiver and "
                    "the private view key of the receiver",
                }
            ),
            400,
        )

    if not all(
        [
            isinstance(hashes, list),
            isinstance(address, str),
            isinstance(view_key, str),
        ]
    ):
        return jsonify({"status": "error", "error": "Invalid data type"}), 400

    result_data: Dict[str, Any] = await daemon.decode_outputs(
        tx_hashes=hashes, address=address, sec_view_key=view_key
    )

    if "error" in result_data:
        return jsonify({"status": "error", "error": result_data["error"]}), 400

    return jsonify({"status": "success", "result": result_data["result"]}), 200


@daemon_bp.route("/daemon/get_transaction_pubkey", methods=["GET"])
async def _daemon_get_transaction_pubkey() -> tuple[Response, int]:
    extra: Optional[str] = request.args.get("extra")

    if not extra:
        return (
            jsonify({"status": "error", "error": "You must provide an extra field"}),
            400,
        )

    data: Dict[str, Any] = await daemon.get_tx_pubkey(extra=extra)

    if "error" in data:
        return jsonify({"status": "error", "error": data["error"]}), 400

    return jsonify({"status": "success", "result": data["result"]}), 200
