title: First start
section: Start
---
## The setup wizard

Run `FalconServer` in a terminal. When `server.properties` is needed, the wizard:

1. Asks for a language.
2. Shows the LGPL-3.0 notice and asks you to accept it. Refusing stops the server.
3. Asks whether to configure now. Answering no writes the defaults.
4. Goes through four steps, then prints a summary.

| Step | Asks for |
|---|---|
| Server | `server-name`, `gamemode`, `difficulty`, `max-players` |
| Network | `server-port`, `server-portv6`, `online-mode`, `enable-lan-visibility` |
| World | `level-name`, `level-seed`, `view-distance` |
| Players | Operators, `allow-list` and the allowed players |

The wizard only runs when both input and output are a terminal, so it stays out of the way under a service manager or in a container.

## Command-line options

| Option | Effect |
|---|---|
| `--no-wizard` | Skips the wizard |
| `--accept-license` | Skips the license question |
| `--language=fr_FR` | Sets the wizard language |

The server ships with 29 language files.

## Joining

Add the server in the client's server list with the machine's address and `server-port` (19132 by default). With `enable-lan-visibility=true` it also appears on the LAN.

Falcon's transport is NetherNet, and it logs at startup that its signaling endpoint uses plain HTTP. RakNet is no longer accepted: see [Troubleshooting](troubleshooting.html#raknet-is-no-longer-supported).

## Files and folders

| Path | Content |
|---|---|
| `server.properties` | [Configuration](configuration.html) |
| `allowlist.json` | Entries with `name`, `xuid` and `ignoresPlayerLimit` |
| `ops.txt` | One operator name per line |
| `banned-players.json`, `banned-ips.json` | Bans, with `name`, `creationDate`, `source`, `expireDate` and `reason` |
| `worlds/<name>/` | Worlds, with their LevelDB in `db/` |
| `players/` | Player data |
| `plugins/` | [Plugins](plugins.html) |
| `resource_packs/` | [Resource packs](resource-packs.html) |
| `behavior_packs/` | [Behavior packs](behavior-packs.html) |
| `profiler/` | Reports from `/profiler` |
| `cdn_config.json` | Optional, [pack CDN URLs](resource-packs.html#cdn) |

## Using the console

The console takes the same commands as players, without the slash. It holds more permission than any player: see [Permissions](permissions.html).

```
op Steve
allowlist add Alex
stop
```

## Updating

Stop the server and replace the executable. Worlds use the Bedrock format, and an internal plugin must be rebuilt for each server build: see [Internal plugins](plugin-internal.html).
