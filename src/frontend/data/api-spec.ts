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
        "Read-only access to the Nerva daemon: chain state, blocks, transactions, the mempool and peer connections.",
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
              height: 4252243,
              target_height: 4252236,
              difficulty: 29772971,
              target: 60,
              tx_count: 57732,
              tx_pool_size: 0,
              alt_blocks_count: 0,
              outgoing_connections_count: 0,
              incoming_connections_count: 0,
              rpc_connections_count: 0,
              white_peerlist_size: 0,
              grey_peerlist_size: 0,
              mainnet: true,
              testnet: false,
              stagenet: false,
              nettype: "mainnet",
              top_block_hash:
                "d101e616f33d61d24431fab2b6e55d5d9b7807a42da4768ea4d733095b04e581",
              cumulative_difficulty: 115630919072534,
              cumulative_difficulty_top64: 0,
              block_size_limit: 600000,
              block_size_median: 300000,
              block_weight_limit: 600000,
              block_weight_median: 300000,
              start_time: 1748600000,
              free_space: 18446744073709551615,
              offline: false,
              bootstrap_daemon_address: "",
              height_without_bootstrap: 0,
              was_bootstrap_ever_used: false,
              database_size: 5368709120,
              update_available: false,
              version: "0.1.8.0",
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
              version: 12,
              enabled: true,
              window: 10080,
              votes: 10080,
              threshold: 0,
              voting: 12,
              earliest_height: 930000,
              status: "OK",
              untrusted: false,
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
                major_version: 12,
                minor_version: 12,
                nonce: 2748593021,
                prev_hash:
                  "8e2a0b1c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff",
                miner_tx_hash:
                  "1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091",
                difficulty: 182947382,
                cumulative_difficulty: 398472910283746,
                cumulative_difficulty_top64: 0,
                reward: 300000000000,
                block_size: 142,
                block_weight: 142,
                long_term_weight: 142,
                depth: 52243,
                num_txes: 2,
                orphan_status: false,
              },
              json: "{ … decoded block as a JSON string … }",
              miner_tx_hash:
                "1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091",
              tx_hashes: [
                "a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00",
                "b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff0011",
              ],
              status: "OK",
              untrusted: false,
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
          response: { status: "success", result: { count: 4252243, status: "OK", untrusted: false } },
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
                hash: "d101e616f33d61d24431fab2b6e55d5d9b7807a42da4768ea4d733095b04e581",
                height: 4252243,
                timestamp: 1780579378,
                major_version: 12,
                minor_version: 12,
                nonce: 1029384756,
                prev_hash:
                  "c4b3a2918273645f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e",
                miner_tx_hash:
                  "4c4b1aa7b5c167d3359569cee384d2074b447b68111ae811257979337cbf7a84",
                difficulty: 29772971,
                cumulative_difficulty: 115630919072534,
                cumulative_difficulty_top64: 0,
                reward: 300000000000,
                block_size: 87,
                block_weight: 87,
                long_term_weight: 87,
                depth: 0,
                num_txes: 0,
                orphan_status: false,
              },
              status: "OK",
              untrusted: false,
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
                major_version: 12,
                minor_version: 12,
                nonce: 1029384756,
                prev_hash:
                  "d11c4e0b3a2918273645f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f7a8b",
                miner_tx_hash:
                  "5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabb",
                difficulty: 184756291,
                cumulative_difficulty: 421889273645182,
                cumulative_difficulty_top64: 0,
                reward: 300000000000,
                block_size: 91,
                block_weight: 91,
                long_term_weight: 91,
                depth: 12,
                num_txes: 1,
                orphan_status: false,
              },
              status: "OK",
              untrusted: false,
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
                major_version: 12,
                minor_version: 12,
                nonce: 2748593021,
                prev_hash:
                  "8e2a0b1c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff",
                miner_tx_hash:
                  "1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091",
                difficulty: 182947382,
                cumulative_difficulty: 398472910283746,
                cumulative_difficulty_top64: 0,
                reward: 300000000000,
                block_size: 142,
                block_weight: 142,
                long_term_weight: 142,
                depth: 52243,
                num_txes: 2,
                orphan_status: false,
              },
              status: "OK",
              untrusted: false,
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
                {
                  hash: "9f3b1c2d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00",
                  height: 3200000,
                  timestamp: 1748600400,
                  major_version: 12,
                  minor_version: 12,
                  nonce: 2748593021,
                  prev_hash:
                    "8e2a0b1c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff",
                  miner_tx_hash:
                    "1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091",
                  difficulty: 182947382,
                  cumulative_difficulty: 398472910283746,
                  cumulative_difficulty_top64: 0,
                  reward: 300000000000,
                  block_size: 142,
                  block_weight: 142,
                  long_term_weight: 142,
                  depth: 52243,
                  num_txes: 2,
                  orphan_status: false,
                },
              ],
              status: "OK",
              untrusted: false,
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
              blocktemplate_blob: "0c0cd3eb…",
              blockhashing_blob: "0c0cd3eb…",
              difficulty: 30090881,
              expected_reward: 300000000000,
              height: 4252256,
              prev_hash: "f080c3eb1ec80926fde373f8efea7afd1ec80926fde373f8efea7afd0c3eb1ec8",
              reserved_offset: 130,
              status: "OK",
              untrusted: false,
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
                  address_type: 1,
                  peer_id: "9f3b1c2d4e5f6071",
                  connection_id: "a1b2c3d4e5f60718293a4b5c6d7e8f90",
                  incoming: false,
                  localhost: false,
                  local_ip: false,
                  state: "normal",
                  height: 4252268,
                  live_time: 93,
                  avg_download: 0,
                  current_download: 0,
                  avg_upload: 0,
                  current_upload: 3,
                  recv_count: 8248,
                  recv_idle_time: 24,
                  send_count: 491,
                  send_idle_time: 24,
                  pruning_seed: 0,
                  rpc_port: 0,
                  support_flags: 1,
                },
              ],
              status: "OK",
              untrusted: false,
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
            result: { fee: 12000000, status: "OK", untrusted: false },
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
          description:
            "Returns the list of hosts the daemon has banned, with the remaining ban time and reason for each. When no hosts are banned, the <code>bans</code> array is omitted.",
          params: [],
          sample: {},
          response: {
            status: "success",
            result: {
              bans: [
                {
                  host: "203.0.113.7",
                  ip: 124846283,
                  seconds: 300,
                  reason: "Banned by operator",
                },
              ],
              status: "OK",
              untrusted: false,
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
                num_10m: 0,
                num_not_relayed: 0,
                num_failing: 0,
                num_double_spends: 0,
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
                  tx_hash: "4c4b1aa7b5c167d3359569cee384d2074b447b68111ae811257979337cbf7a84",
                  block_height: 4252008,
                  block_timestamp: 1780579378,
                  in_pool: false,
                  double_spend_seen: false,
                  output_indices: [4367526, 4367527],
                  as_hex: "020008020005b3a58602b590…",
                  pruned_as_hex: "020008020005b3a58602b590…",
                  prunable_as_hex: "8b21f0a3…",
                  prunable_hash:
                    "545d561d2c6c07dc83b9896ee76e196fc127ec6b9c03982901e42b4652145fc2",
                  as_json: "{ … decoded transaction as a JSON string … }",
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
              pubkey: "d6f2a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9001122334",
              status: "OK",
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
                volume: "1689.2521",
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
            "Returns every stored node-telemetry record — one record per unique node, including version and approximate geolocation. IP addresses are masked in the response.",
          params: [],
          sample: {},
          response: {
            status: "success",
            result: [
              {
                version: "0.2.2.0",
                time: "2026-05-30 18:24:11",
                ip: "203.*.*.10",
                lat: 50.1109,
                long: 8.6821,
                cn: "EU",
                cc: "DE",
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
      ],
    },
  ],
};
