title: Permissions
section: Administration
---
## Command levels

Each command has a required level. A sender can run it when their level is at least that high. The levels, lowest to highest, are `Any`, `GameDirectors`, `Admin`, `Host`, `Owner` and `Internal`.

| Sender | Level |
|---|---|
| Player | `Any` |
| Operator | `GameDirectors` |
| Console | `Internal` |
| Command block | `Internal` |

Players stop at `GameDirectors`, so commands at `Admin` or `Owner` are out of reach in game: `/world`, `/stop`, `/save`, `/save-on`, `/save-off`, `/setmaxplayers`, `/transfer`, `/ban-ip` and `/pardon-ip`.

## Operators

Add a name to `ops.txt`, or use `/op`. Names are compared in lowercase. Operators are also exempt from `spawn-protection`.

## Allow list

```
allowlist on
allowlist add Steve
allowlist remove Steve
allowlist list
allowlist reload
```

Setting `allow-list=true` in `server.properties` does the same at startup. An entry in `allowlist.json` can set `ignoresPlayerLimit` to let the player past `max-players`.

## Bans

`/ban` writes to `banned-players.json` and `/ban-ip` to `banned-ips.json`. `/ban-ip` accepts an address or an online player.

## Plugin permissions

Plugins have their own named nodes: see [Commands and permissions](plugin-commands.html).
