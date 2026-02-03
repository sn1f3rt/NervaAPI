from __future__ import annotations

from typing import Any, Dict, Union

from datetime import datetime

import aiohttp
from quart import Response, jsonify, current_app

from . import market_bp

MarketData = Dict[str, Union[str, Dict[str, Any]]]


def _fmt_btc(value: float) -> str:
    return f"{round(value * 100_000_000)} sat"


def _fmt_usd(value: float, precision: int = 4) -> str:
    return f"${round(value, precision)}"


def _fmt_native(value: float, symbol: str, precision: int = 8) -> str:
    return f"{round(value, precision)} {symbol}"


async def _fetch_nonkyc() -> Dict[str, Any]:
    async with aiohttp.ClientSession() as session:
        async with session.get("https://api.nonkyc.io/api/v2/market/getlist") as res:
            data = await res.json()

    return {
        m["symbol"].replace("/", "-"): m
        for m in data
        if m.get("isActive") and not m.get("apiExcluded")
    }


@market_bp.route("/market/nonkyc")
async def _market_nonkyc() -> tuple[Response, int]:
    pairs = current_app.config.get("NONKYC_MARKET_PAIRS", [])
    markets = await _fetch_nonkyc()

    result: Dict[str, Any] = {}

    for pair in pairs:
        data = markets.get(pair)
        if not data:
            result[pair] = {"error": "pair not found"}
            continue

        quote = pair.split("-")[1]
        last_trade = datetime.fromtimestamp(data["lastTradeAt"] // 1000).isoformat()

        if quote == "BTC":
            result[pair] = {
                "last_price": _fmt_btc(float(data["lastPrice"])),
                "bid": _fmt_btc(float(data["bestBid"])),
                "ask": _fmt_btc(float(data["bestAsk"])),
                "volume": f"{float(data['volumeSecondary'])} BTC",
                "high": _fmt_btc(float(data["highPrice"])),
                "low": _fmt_btc(float(data["lowPrice"])),
                "last_trade": last_trade,
            }

        elif quote in {"USDT", "USDC"}:
            result[pair] = {
                "last_price": _fmt_usd(float(data["lastPrice"])),
                "bid": _fmt_usd(float(data["bestBid"])),
                "ask": _fmt_usd(float(data["bestAsk"])),
                "volume": _fmt_usd(float(data["volumeSecondary"]), 2),
                "high": _fmt_usd(float(data["highPrice"])),
                "low": _fmt_usd(float(data["lowPrice"])),
                "last_trade": last_trade,
            }

        else:
            result[pair] = {
                "last_price": _fmt_native(float(data["lastPrice"]), quote),
                "bid": _fmt_native(float(data["bestBid"]), quote),
                "ask": _fmt_native(float(data["bestAsk"]), quote),
                "volume": f"{float(data['volumeSecondary'])} {quote}",
                "high": _fmt_native(float(data["highPrice"]), quote),
                "low": _fmt_native(float(data["lowPrice"]), quote),
                "last_trade": last_trade,
            }

    return jsonify(
        {
            "status": "success",
            "exchange": "NonKYC",
            "pairs": pairs,
            "result": result,
        }
    ), 200


async def _fetch_cexswap() -> Dict[str, Any]:
    async with aiohttp.ClientSession() as session:
        async with session.get(
            "https://cexswap.cc/api/public/markets/summary"
        ) as res:
            payload = await res.json()

    return {m["pair"]: m for m in payload.get("items", [])}


@market_bp.route("/market/cexswap")
async def _market_cexswap() -> tuple[Response, int]:
    pairs = current_app.config.get("CEXSWAP_MARKET_PAIRS", [])
    markets = await _fetch_cexswap()

    result: Dict[str, Any] = {}

    for pair in pairs:
        data = markets.get(pair)
        if not data:
            result[pair] = {"error": "pair not found"}
            continue

        quote = data["quote"]

        if quote == "BTC":
            result[pair] = {
                "last_price": _fmt_btc(float(data["last"])),
                "volume": f"{float(data['volume24h'])} BTC",
                "high": _fmt_btc(float(data["high24h"])),
                "low": _fmt_btc(float(data["low24h"])),
                "change_24h_pct": f"{round(float(data['change24h_pct']), 2)}%",
            }

        elif quote in {"USDT", "USDC"}:
            result[pair] = {
                "last_price": _fmt_usd(float(data["last"])),
                "volume": _fmt_usd(float(data["volume24h_usd"]), 2),
                "high": _fmt_usd(float(data["high24h"])),
                "low": _fmt_usd(float(data["low24h"])),
                "change_24h_pct": f"{round(float(data['change24h_pct']), 2)}%",
            }

        else:
            result[pair] = {
                "last_price": _fmt_native(float(data["last"]), quote),
                "volume": f"{float(data['volume24h'])} {quote}",
                "high": _fmt_native(float(data["high24h"]), quote),
                "low": _fmt_native(float(data["low24h"]), quote),
                "change_24h_pct": f"{round(float(data['change24h_pct']), 2)}%",
            }

    return jsonify(
        {
            "status": "success",
            "exchange": "CexSwap",
            "pairs": pairs,
            "result": result,
        }
    ), 200
