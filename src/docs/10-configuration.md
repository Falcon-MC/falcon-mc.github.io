title: Configuration
section: Administration
---
`server.properties` holds one `key=value` per line. There are 64 keys. Each value is validated when the file is read: a bad value is reported in the log and the default is used.

Booleans accept `true`, `false`, `1` and `0`, except `simulation`, `server-authoritative-block-breaking` and `disable-client-vibrant-visuals`, which accept only `true` and `false`.

## Identity and rules

| Key | Default | Effect |
|---|---|---|
| `server-name` | `Falcon Server` | Name shown to clients |
| `language` | `en_US` | Server language |
| `gamemode` | `survival` | `survival`, `creative`, `adventure` or `spectator`. Numbers 1, 2 and 6 also map to the last three |
| `difficulty` | `easy` | `peaceful`, `easy`, `normal` or `hard` |
| `allow-cheats` | `true` | Sets the commands-enabled flag sent to clients |
| `max-players` | `10` | 1 or more |
| `default-player-permission-level` | `member` | `visitor`, `member` or `operator` |
| `spawn-protection` | `16` | Radius around spawn where non-operators cannot change blocks |
| `disable-player-interaction` | `false` | Sent to clients in the start-game data |

## Network

| Key | Default | Effect |
|---|---|---|
| `server-port` | `19132` | IPv4 port, 1 to 65535 |
| `server-portv6` | `19133` | IPv6 port, 1 to 65535 |
| `transport` | `nethernet` | The only accepted value |
| `online-mode` | `true` | Checks Xbox Live authentication at login |
| `network-encryption` | `true` | Encrypts the connection |
| `enable-lan-visibility` | `true` | Announces the server on the LAN |
| `allow-list` | `false` | Only `allowlist.json` entries can join. An empty list logs a warning |
| `any-version` | `false` | Lets every supported protocol join, not only the newest |
| `compression-threshold` | `1` | 0 to 65535, sent to clients in the network settings |
| `compression-algorithm` | `zlib` | `zlib` or `snappy` |

With `any-version` on, older clients still receive the blocks, items and recipes of the newest version, and the server logs a warning.

## Worlds and performance

| Key | Default | Effect |
|---|---|---|
| `level-name` | `Bedrock level` | Main world, under `worlds/` |
| `level-seed` | empty | Seed of a new world |
| `worlds-autoload` | empty | Other worlds to load at startup, comma-separated |
| `view-distance` | `32` | 4 to 96 chunks |
| `tick-distance` | `4` | 4 to 12 chunks. Chunks ticked around each player |
| `max-threads` | `8` | 0 to 256. Worker threads |
| `autosave-interval` | `6000` | Ticks between autosaves. 0 turns autosave off |
| `auto-compaction-interval` | `360` | Seconds between world database compactions. 0 turns it off |
| `client-side-chunk-generation-enabled` | `false` | Sent to clients in the start-game data |
| `block-network-ids-are-hashes` | `true` | Sends block network IDs as hashes |
| `simulation` | `true` | Runs the server movement simulation for players. `false` skips it |

## Packs, skins and logs

| Key | Default | Effect |
|---|---|---|
| `texturepack-required` | `false` | Forces clients to accept the packs |
| `disable-custom-skins` | `false` | Sent to clients in the start-game data |
| `skin-change-cooldown` | `30` | Minimum seconds between skin changes |
| `disable-client-vibrant-visuals` | `true` | Forces Vibrant Visuals off on clients |
| `content-log-console-output-enabled` | `false` | Prints content logs to the console |

## Movement and block breaking

| Key | Default | Effect |
|---|---|---|
| `server-authoritative-movement-strict` | `false` | Strict movement validation |
| `server-authoritative-block-breaking` | `false` | The server checks break progress |
| `server-authoritative-block-breaking-range-scalar` | `1.5` | Must be above 1. Scales the allowed reach. Also read as `server-authoritative-block-breaking-pick-range-scalar` |
| `player-position-acceptance-threshold` | `0.5` | Squared distance, in blocks, between the reported and simulated position above which movement is corrected |
| `player-movement-action-direction-threshold` | `0.85` | How directly a player must face a target to act on it, as a cosine from 0 to 1 |
| `player-tick-throttled-input-batch-size` | `-1` | -1 or more. Input batching limit |
| `player-tick-throttled-max-tick-credits` | `-1` | -1 or more. Input tick credit limit |

## Rate limits

| Key | Default |
|---|---|
| `max-inbound-packets-per-second` | `2500` |
| `max-commands-per-second` | `10` |
| `max-chat-messages-per-second` | `2` |
| `max-form-responses-per-second` | `20` |
| `max-movement-packets-per-second` | `40` |
| `max-chat-message-length` | `512` |
| `chat-restriction` | `None`. Also `Dropped` or `Disabled` |

## Wasm plugins

| Key | Default | Effect |
|---|---|---|
| `wasm-plugin-memory-mb` | `64` | 1 to 4096. Memory limit per plugin |
| `wasm-plugin-fuel` | `10000000` | 1 or more. Fuel per server call |

## Reserved keys

The server accepts and validates these keys, but they have no effect in the current version:

| Key | Default |
|---|---|
| `force-gamemode` | `false` |
| `player-idle-timeout` | `30` |
| `content-log-file-enabled` | `false` |
| `content-log-level` | `info` |
| `server-authoritative-dismount-strict` | `false` |
| `server-authoritative-entity-interactions-strict` | `false` |
| `server-build-radius-ratio` | `Disabled` |
| `allow-inbound-script-debugging` | `false` |
| `allow-outbound-script-debugging` | `false` |
| `script-debugger-auto-attach` | `disabled` |
| `disable-persona` | `false` |
| `fluid-budget-ms` | `20` |
