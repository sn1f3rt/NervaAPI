export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
export type ParamLoc = "query" | "body" | "header"

export interface Param {
  name: string
  in: ParamLoc
  type: string
  required: boolean
  desc: string
}

export interface EndpointError {
  code: number
  reason: string
}

export interface Endpoint {
  id: string
  method: Method
  path: string
  summary: string
  description: string
  auth?: string
  params: Param[]
  sample: Record<string, unknown>
  headers?: Record<string, string>
  response: unknown
  responseNote?: string
  errors?: EndpointError[]
}

export interface Section {
  id: string
  name: string
  summary: string
  endpoints: Endpoint[]
}

export interface ApiSpec {
  meta: { name: string; version: string; tagline: string }
  sections: Section[]
}

export const API_SPEC: ApiSpec = {
  meta: {
    name: "NervaAPI",
    version: __APP_VERSION__,
    tagline: "REST interface for the Nerva (XNV) blockchain",
  },

  sections: [
    /* ----------------------------------------------------------------- */
    {
      id: "daemon",
      name: "Daemon",
      summary:
        "Read-only access to the Nerva daemon: chain state, blocks, transactions, the mempool and peer management.",
      endpoints: [
        {
          id: "daemon-get_version",
          method: "GET",
          path: "/daemon/get_version",
          summary: "Daemon RPC version.",
          description: "Returns the running daemon's RPC version number.",
          params: [],
          sample: {},
          response: {
            status: "success",
            result: { status: "OK", version: 196613, release: true, untrusted: false },
          },
        },
        {
          id: "daemon-get_info",
          method: "GET",
          path: "/daemon/get_info",
          summary: "General blockchain & node information.",
          description:
            "Returns a snapshot of the daemon's view of the network — height, difficulty, connection counts, mempool size and more.",
          params: [],
          sample: {},
          response: {
            status: "success",
            result: {
              height: 3215467,
              target_height: 3215467,
              difficulty: 184756291,
              tx_count: 1894233,
              tx_pool_size: 4,
              alt_blocks_count: 1,
              outgoing_connections_count: 8,
              incoming_connections_count: 21,
              white_peerlist_size: 320,
              grey_peerlist_size: 4096,
              mainnet: true,
              nettype: "mainnet",
              top_block_hash:
                "e22d5f1c4b9a0f6d7e8c3b2a1908f7e6d5c4b3a2918273645f6a7b8c9d0e1f2a",
              cumulative_difficulty: 421889273645182,
              block_size_limit: 600000,
              block_size_median: 300000,
              status: "OK",
              untrusted: false,
            },
          },
        },
        {
          id: "daemon-hard_fork_info",
          method: "GET",
          path: "/daemon/hard_fork_info",
          summary: "Current hard fork status.",
          description:
            "Returns information about the active hard fork: the enabled version, the voting window and the activation threshold.",
          params: [],
          sample: {},
          response: {
            status: "success",
            result: {
              version: 18,
              enabled: true,
              window: 10080,
              votes: 10080,
              threshold: 0,
              voting: 18,
              state: 0,
              earliest_height: 3000000,
              status: "OK",
            },
          },
        },
        {
          id: "daemon-get_block",
          method: "GET",
          path: "/daemon/get_block",
          summary: "Full block by hash or height.",
          description:
            "Returns a full block. Provide <strong>either</strong> a <code>hash</code> or a <code>height</code> — supplying both, or neither, is rejected.",
          params: [
            { name: "hash", in: "query", type: "string", required: false, desc: "Block hash. Mutually exclusive with <code>height</code>." },
            { name: "height", in: "query", type: "integer", required: false, desc: "Block height. Mutually exclusive with <code>hash</code>." },
          ],
          sample: { height: 3200000 },
          response: {
            status: "success",
            result: {
              blob: "0e0ec…a3f1",
              block_header: {
                hash: "9f3b1c2d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00",
                height: 3200000,
                timestamp: 1748600400,
                major_version: 18,
                minor_version: 18,
                nonce: 2748593021,
                prev_hash:
                  "8e2a0b1c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff",
                difficulty: 182947382,
                reward: 300000000000,
                num_txes: 2,
                orphan_status: false,
              },
              tx_hashes: [
                "a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00",
                "b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff0011",
              ],
              status: "OK",
            },
          },
          errors: [
            { code: 400, reason: "Neither <code>hash</code> nor <code>height</code> supplied, or both supplied." },
            { code: 400, reason: "<code>height</code> is not a valid integer." },
          ],
        },
        {
          id: "daemon-get_block_count",
          method: "GET",
          path: "/daemon/get_block_count",
          summary: "Current block height.",
          description: "Returns the number of blocks in the longest chain known to the daemon.",
          params: [],
          sample: {},
          response: { status: "success", result: { count: 3215467, status: "OK" } },
        },
        {
          id: "daemon-get_last_block_header",
          method: "GET",
          path: "/daemon/get_last_block_header",
          summary: "Header of the most recent block.",
          description: "Returns the block header of the last block in the chain.",
          params: [],
          sample: {},
          response: {
            status: "success",
            result: {
              block_header: {
                hash: "e22d5f1c4b9a0f6d7e8c3b2a1908f7e6d5c4b3a2918273645f6a7b8c9d0e1f2a",
                height: 3215467,
                timestamp: 1748684832,
                major_version: 18,
                minor_version: 18,
                nonce: 1029384756,
                prev_hash:
                  "d11c4e0b3a2918273645f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f7a8b",
                difficulty: 184756291,
                reward: 300000000000,
                num_txes: 1,
                orphan_status: false,
              },
              status: "OK",
            },
          },
        },
        {
          id: "daemon-get_block_header_by_hash",
          method: "GET",
          path: "/daemon/get_block_header_by_hash",
          summary: "Block header by hash.",
          description: "Returns the header of the block identified by its <code>hash</code>.",
          params: [
            { name: "hash", in: "query", type: "string", required: true, desc: "Hash of the block to look up." },
          ],
          sample: { hash: "e22d5f1c4b9a0f6d7e8c3b2a1908f7e6d5c4b3a2918273645f6a7b8c9d0e1f2a" },
          response: {
            status: "success",
            result: {
              block_header: {
                hash: "e22d5f1c4b9a0f6d7e8c3b2a1908f7e6d5c4b3a2918273645f6a7b8c9d0e1f2a",
                height: 3215467,
                timestamp: 1748684832,
                difficulty: 184756291,
                reward: 300000000000,
                num_txes: 1,
                orphan_status: false,
              },
              status: "OK",
            },
          },
          errors: [{ code: 400, reason: "<code>hash</code> not supplied." }],
        },
        {
          id: "daemon-get_block_header_by_height",
          method: "GET",
          path: "/daemon/get_block_header_by_height",
          summary: "Block header by height.",
          description: "Returns the header of the block at the given <code>height</code>.",
          params: [
            { name: "height", in: "query", type: "integer", required: true, desc: "Height of the block to look up." },
          ],
          sample: { height: 3200000 },
          response: {
            status: "success",
            result: {
              block_header: {
                hash: "9f3b1c2d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00",
                height: 3200000,
                timestamp: 1748600400,
                difficulty: 182947382,
                reward: 300000000000,
                num_txes: 2,
                orphan_status: false,
              },
              status: "OK",
            },
          },
          errors: [
            { code: 400, reason: "<code>height</code> not supplied." },
            { code: 400, reason: "<code>height</code> is not a valid integer." },
          ],
        },
        {
          id: "daemon-get_block_headers_range",
          method: "GET",
          path: "/daemon/get_block_headers_range",
          summary: "Headers for a range of blocks.",
          description: "Returns the block headers for every block from <code>start_height</code> to <code>end_height</code>, inclusive.",
          params: [
            { name: "start_height", in: "query", type: "integer", required: true, desc: "First block height in the range." },
            { name: "end_height", in: "query", type: "integer", required: true, desc: "Last block height in the range." },
          ],
          sample: { start_height: 3200000, end_height: 3200002 },
          response: {
            status: "success",
            result: {
              headers: [
                { hash: "9f3b…ff00", height: 3200000, timestamp: 1748600400, num_txes: 2 },
                { hash: "a04c…1122", height: 3200001, timestamp: 1748600460, num_txes: 0 },
                { hash: "b15d…3344", height: 3200002, timestamp: 1748600521, num_txes: 1 },
              ],
              status: "OK",
            },
          },
          errors: [
            { code: 400, reason: "<code>start_height</code> or <code>end_height</code> missing." },
            { code: 400, reason: "A height is not a valid integer." },
          ],
        },
        {
          id: "daemon-get_block_template",
          method: "GET",
          path: "/daemon/get_block_template",
          summary: "Block template for mining.",
          description: "Returns a block template that a miner can use to begin hashing, reserving space for the given wallet address.",
          params: [
            { name: "address", in: "query", type: "string", required: true, desc: "Wallet address that will receive the block reward." },
            { name: "reserve", in: "query", type: "integer", required: true, desc: "Number of reserved bytes for the miner (extra nonce)." },
          ],
          sample: { address: "NV1abcXNVexampleWalletAddress0000000000000000000000000000000000000000", reserve: 8 },
          response: {
            status: "success",
            result: {
              blocktemplate_blob: "0e0ec…",
              blockhashing_blob: "0e0ec…",
              difficulty: 184756291,
              expected_reward: 300000000000,
              height: 3215468,
              prev_hash: "e22d5f1c4b9a0f6d7e8c3b2a1908f7e6d5c4b3a2918273645f6a7b8c9d0e1f2a",
              reserved_offset: 130,
              status: "OK",
            },
          },
          errors: [{ code: 400, reason: "<code>reserve</code> is not a valid integer." }],
        },
        {
          id: "daemon-get_connections",
          method: "GET",
          path: "/daemon/get_connections",
          summary: "Active peer connections.",
          description: "Returns the list of peers the daemon is currently connected to.",
          params: [],
          sample: {},
          response: {
            status: "success",
            result: {
              connections: [
                {
                  address: "203.0.113.10:17565",
                  host: "203.0.113.10",
                  ip: "203.0.113.10",
                  port: "17565",
                  incoming: false,
                  state: "normal",
                  height: 3215467,
                  live_time: 5821,
                  recv_count: 1048576,
                  send_count: 524288,
                },
              ],
              status: "OK",
            },
          },
        },
        {
          id: "daemon-get_fee_estimate",
          method: "GET",
          path: "/daemon/get_fee_estimate",
          summary: "Estimated transaction fee.",
          description: "Returns the daemon's estimated per-byte fee. Optionally factor in a number of <code>grace_blocks</code>.",
          params: [
            { name: "grace_blocks", in: "query", type: "integer", required: false, desc: "Number of grace blocks to account for. Optional." },
          ],
          sample: { grace_blocks: 10 },
          response: {
            status: "success",
            result: { fee: 1000, quantization_mask: 10000, status: "OK" },
          },
          errors: [{ code: 400, reason: "<code>grace_blocks</code> is not a valid integer." }],
        },
        {
          id: "daemon-get_generated_coins",
          method: "GET",
          path: "/daemon/get_generated_coins",
          summary: "Total XNV in circulation.",
          description:
            "Returns the total number of coins generated so far, computed from a known checkpoint plus the per-block reward. <strong>Note:</strong> the result contains only a <code>coins</code> field — there is no <code>status</code> key.",
          params: [],
          sample: {},
          response: { status: "success", result: { coins: 18904459.7794 } },
        },
        {
          id: "daemon-get_bans",
          method: "GET",
          path: "/daemon/get_bans",
          summary: "Currently banned hosts.",
          description: "Returns the list of hosts the daemon has banned, with the remaining ban time for each.",
          params: [],
          sample: {},
          response: {
            status: "success",
            result: {
              bans: [{ host: "198.51.100.7", ip: 117440710, seconds: 3221 }],
              status: "OK",
            },
          },
        },
        {
          id: "daemon-get_transaction_pool",
          method: "GET",
          path: "/daemon/get_transaction_pool",
          summary: "Full mempool contents.",
          description: "Returns the transactions currently in the daemon's memory pool, along with spent key images.",
          params: [],
          sample: {},
          response: {
            status: "success",
            result: {
              credits: 0,
              spent_key_images: [
                {
                  id_hash: "c4d5e6f7…a8b9",
                  txs_hashes: ["a1b2c3d4…ff00"],
                },
              ],
              transactions: [
                {
                  id_hash: "a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00",
                  fee: 30000,
                  blob_size: 1536,
                  receive_time: 1748684790,
                },
              ],
            },
          },
        },
        {
          id: "daemon-get_transaction_pool_stats",
          method: "GET",
          path: "/daemon/get_transaction_pool_stats",
          summary: "Aggregate mempool statistics.",
          description: "Returns summary statistics about the memory pool rather than the individual transactions.",
          params: [],
          sample: {},
          response: {
            status: "success",
            result: {
              pool_stats: {
                bytes_total: 6144,
                bytes_min: 1408,
                bytes_max: 2176,
                bytes_med: 1536,
                fee_total: 120000,
                txs_total: 4,
                num_failing: 0,
                num_not_relayed: 0,
                oldest: 1748684201,
                histo_98pc: 0,
              },
            },
          },
        },
        {
          id: "daemon-get_transactions",
          method: "GET",
          path: "/daemon/get_transactions",
          summary: "Look up transactions by hash.",
          description:
            "Fetches one or more transactions by hash. The <code>hashes</code> parameter is repeatable — pass it once per transaction.",
          params: [
            { name: "hashes", in: "query", type: "string[]", required: true, desc: "Transaction hash. Repeat the parameter for multiple hashes." },
            { name: "decode_as_json", in: "query", type: "boolean", required: false, desc: 'Set to <code>true</code> to include a decoded JSON form of each transaction.' },
            { name: "prune", in: "query", type: "boolean", required: false, desc: "Set to <code>true</code> to return the pruned representation." },
            { name: "split", in: "query", type: "boolean", required: false, desc: "Set to <code>true</code> to return pruned and prunable parts separately." },
          ],
          sample: {
            hashes: [
              "a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00",
              "b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff0011",
            ],
            decode_as_json: "true",
          },
          response: {
            status: "success",
            result: {
              missed_tx: [],
              top_hash: "",
              txs: [
                {
                  tx_hash: "a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00",
                  block_height: 3214901,
                  block_timestamp: 1748650122,
                  in_pool: false,
                  double_spend_seen: false,
                  confirmations: 566,
                },
              ],
            },
          },
          errors: [{ code: 400, reason: "No <code>hashes</code> supplied." }],
        },
        {
          id: "daemon-decode_outputs",
          method: "POST",
          path: "/daemon/decode_outputs",
          summary: "Decode outputs addressed to you.",
          description:
            "Given a list of transaction hashes plus the receiver's public address and private view key, decodes which outputs belong to that address. The request body is JSON.",
          auth:
            "This endpoint requires your <strong>private view key</strong>. The view key is enough to detect incoming funds but cannot spend them. Only send it to an instance you trust.",
          params: [
            { name: "hashes", in: "body", type: "string[]", required: true, desc: "Transaction hashes to scan." },
            { name: "address", in: "body", type: "string", required: true, desc: "Public address of the receiver." },
            { name: "view_key", in: "body", type: "string", required: true, desc: "Private view key of the receiver." },
          ],
          sample: {
            hashes: ["a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00"],
            address: "NV1abcXNVexampleWalletAddress0000000000000000000000000000000000000000",
            view_key: "8f3a1c0b2d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddee01",
          },
          response: {
            status: "success",
            result: {
              outputs: [
                {
                  tx_hash: "a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00",
                  output_index: 1,
                  amount: 1250000000000,
                  stealth_address:
                    "d6f2a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9001122334",
                },
              ],
            },
          },
          errors: [
            { code: 400, reason: "Missing <code>hashes</code>, <code>address</code> or <code>view_key</code>." },
            { code: 400, reason: "A field has the wrong type." },
          ],
        },
        {
          id: "daemon-get_transaction_pubkey",
          method: "GET",
          path: "/daemon/get_transaction_pubkey",
          summary: "Extract the tx public key from extra.",
          description: "Parses a transaction's <code>extra</code> field (hex) and returns the embedded transaction public key.",
          params: [
            { name: "extra", in: "query", type: "string", required: true, desc: "Hex-encoded transaction <code>extra</code> field." },
          ],
          sample: { extra: "01d6f2a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9001122334" },
          response: {
            status: "success",
            result: {
              pub_key: "d6f2a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9001122334",
            },
          },
          errors: [{ code: 400, reason: "No <code>extra</code> supplied." }],
        },
      ],
    },

    /* ----------------------------------------------------------------- */
    {
      id: "market",
      name: "Market",
      summary:
        "Aggregated XNV ticker data from supported exchanges. Each endpoint reports the trading pairs configured server-side; pairs not listed on an exchange come back with an error object.",
      endpoints: [
        {
          id: "market-nonkyc",
          method: "GET",
          path: "/market/nonkyc",
          summary: "Ticker data from NonKYC.",
          description:
            "Returns last price, bid/ask, 24h high/low, volume and last-trade time for each configured pair on <a href=\"https://nonkyc.io\" target=\"_blank\" rel=\"noopener\">NonKYC</a>. Prices are formatted by quote currency — <code>sat</code> for BTC pairs, <code>$</code> for USDT/USDC pairs, native units otherwise.",
          params: [],
          sample: {},
          response: {
            status: "success",
            exchange: "NonKYC",
            pairs: ["XNV-USDT", "XNV-XMR"],
            result: {
              "XNV-USDT": {
                last_price: "$0.0123",
                bid: "$0.0121",
                ask: "$0.0125",
                volume: "$8421.55",
                high: "$0.0131",
                low: "$0.0118",
                last_trade: "2026-05-30T11:02:33",
              },
              "XNV-XMR": {
                last_price: "0.00004821 XMR",
                bid: "0.00004810 XMR",
                ask: "0.00004835 XMR",
                volume: "12.84 XMR",
                high: "0.00004902 XMR",
                low: "0.00004700 XMR",
                last_trade: "2026-05-30T09:47:10",
              },
            },
          },
          responseNote:
            "If a configured pair is not active on the exchange, its value is <code>{ \"error\": \"pair not found\" }</code> instead of a ticker object.",
        },
        {
          id: "market-cexswap",
          method: "GET",
          path: "/market/cexswap",
          summary: "Ticker data from CexSwap.",
          description:
            "Returns last price, 24h high/low, volume and 24h change for each configured pair on <a href=\"https://cexswap.cc\" target=\"_blank\" rel=\"noopener\">CexSwap</a>.",
          params: [],
          sample: {},
          response: {
            status: "success",
            exchange: "CexSwap",
            pairs: ["XNV-BTC", "XNV-XMR"],
            result: {
              "XNV-BTC": {
                last_price: "12 sat",
                volume: "0.0421 BTC",
                high: "13 sat",
                low: "11 sat",
                change_24h_pct: "2.41%",
              },
              "XNV-XMR": {
                last_price: "0.00004821 XMR",
                volume: "9.12 XMR",
                high: "0.00004905 XMR",
                low: "0.00004688 XMR",
                change_24h_pct: "-1.05%",
              },
            },
          },
        },
        {
          id: "market-noirtrade",
          method: "GET",
          path: "/market/noirtrade",
          summary: "Ticker data from NoirTrade.",
          description:
            "Returns last price, bid/ask, 24h high/low and volume for each configured pair on <a href=\"https://noirtrade.com\" target=\"_blank\" rel=\"noopener\">NoirTrade</a>. NoirTrade pairs use an underscore separator (e.g. <code>XNV_USDT0</code>).",
          params: [],
          sample: {},
          response: {
            status: "success",
            exchange: "NoirTrade",
            pairs: ["XNV_USDT0"],
            result: {
              XNV_USDT0: {
                last_price: "$0.0122",
                bid: "$0.0120",
                ask: "$0.0124",
                volume: "$3120.40",
                high: "$0.0129",
                low: "$0.0117",
              },
            },
          },
        },
        {
          id: "market-klingex",
          method: "GET",
          path: "/market/klingex",
          summary: "Ticker data from KlingEx.",
          description:
            "Returns last price, volume and 24h change for each configured pair on <a href=\"https://klingex.io\" target=\"_blank\" rel=\"noopener\">KlingEx</a>.",
          params: [],
          sample: {},
          response: {
            status: "success",
            exchange: "KlingEx",
            pairs: ["XNV-USDT"],
            result: {
              "XNV-USDT": {
                last_price: "$0.0123",
                volume: "15.2K XNV",
                change_24h_pct: "1.87%",
              },
            },
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- */
    {
      id: "analytics",
      name: "Analytics",
      summary:
        "Anonymous node telemetry collection. These endpoints are primarily used by the Nerva CLI and are only available when analytics is enabled server-side; otherwise every call returns a 400.",
      endpoints: [
        {
          id: "analytics-fetch",
          method: "GET",
          path: "/analytics/fetch",
          summary: "All collected node records.",
          description:
            "Returns every stored node-telemetry record — one document per unique node IP, including version and approximate geolocation.",
          params: [],
          sample: {},
          response: {
            status: "success",
            result: [
              {
                _id: "66b9f0a2c4e5d6f708192a3b",
                ip: "203.0.113.10",
                version: "0.2.2.0",
                last_updated: "2026-05-30T18:24:11.000Z",
                latitude: "50.1109",
                longitude: "8.6821",
                country: "DE",
                continent: "EU",
              },
            ],
          },
          errors: [{ code: 400, reason: "Analytics is disabled (<code>{ \"status\": \"error\", \"message\": \"Analytics is disabled\" }</code>)." }],
        },
        {
          id: "analytics-submit",
          method: "POST",
          path: "/analytics/submit",
          summary: "Report node telemetry.",
          description:
            "Records the calling node's version and geolocation. Intended for the Nerva CLI — the request must carry a <code>nerva-cli/&lt;version&gt;</code> User-Agent, and the client IP is read from the <code>CF-Connecting-IP</code> or <code>X-Forwarded-For</code> header. No request body is required.",
          auth:
            "Requires a <code>User-Agent</code> header of the form <code>nerva-cli/&lt;version&gt;</code>. Requests from other clients are rejected.",
          params: [
            { name: "User-Agent", in: "header", type: "string", required: true, desc: "Must be <code>nerva-cli/&lt;version&gt;</code>, e.g. <code>nerva-cli/0.2.2.0</code>." },
          ],
          sample: {},
          headers: { "User-Agent": "nerva-cli/0.2.2.0" },
          response: { status: "success" },
          errors: [
            { code: 400, reason: "Analytics disabled, invalid/zero User-Agent, invalid IP, or upstream geo lookup failed." },
          ],
        },
        {
          id: "analytics-prune",
          method: "DELETE",
          path: "/analytics/prune",
          summary: "Drop stale node records.",
          description:
            "Deletes node records that have not been updated in the last 7 days. This runs automatically every day at 00:00, but can also be triggered manually.",
          params: [],
          sample: {},
          response: { status: "success" },
          errors: [{ code: 400, reason: "Analytics is disabled." }],
        },
      ],
    },
  ],
};
