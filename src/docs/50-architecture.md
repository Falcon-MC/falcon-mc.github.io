title: Architecture
section: Project
---
## Repositories

| Repository | Content |
|---|---|
| [Falcon](https://github.com/Falcon-MC/Falcon) | The server |
| [Protocol](https://github.com/Falcon-MC/Protocol) | Packets and network types |
| [Network](https://github.com/Falcon-MC/Network) | Transport |
| [NBT](https://github.com/Falcon-MC/NBT) | NBT tags and binary streams |
| [BedrockData](https://github.com/Falcon-MC/BedrockData) | Game data files, versioned by protocol |
| [BlockStateUpdater](https://github.com/Falcon-MC/BlockStateUpdater) | Block state upgrade schemas |
| [leveldb](https://github.com/Falcon-MC/leveldb) | LevelDB with Bedrock's zlib compression |
| [PluginAPI](https://github.com/Falcon-MC/PluginAPI) | Plugin API |

## Source layout

```
Falcon.Server/
  include/            Headers, mirroring src/
  src/
    Core/             Shared utilities
    Network/          Session, login, movement, inventory and gameplay handlers
    Server/           Lifecycle, configuration, commands
    World/Actor/      Players, mobs, projectiles, AI, movement
    World/Level/      Worlds, chunks, storage, generation, blocks
    World/Item/       Items
    World/Inventory/  Inventories, crafting, item stack requests
    World/Containers/ Container manager models
    World/Village/    Villages and raids
    Resources/        Resource packs
    Scripting/        JavaScript API
    Falcon/           Embedding and plugins
  structure/          Layout evidence and relocation inventory
  tests/              Test programs
  tools/              WorldGenParity and other tools
```

## Classes, not string checks

Blocks, items and actors with behavior are classes registered with `FALCON_REGISTER_BLOCK`, `FALCON_REGISTER_ITEM` or `FALCON_REGISTER_ACTOR`. The type is decided once, in the class `matches()`. Systems call virtual methods and never compare identifiers to find out what something is.

## Damage

All player damage goes through `ServerNetworkHandler::hurt` with a `DamageSource`. It handles gamerules, the invulnerability window, shields, armor, effects and the totem.

## Threads

Game state belongs to the main thread. Chunk workers and the network thread exchange data through queues, and never touch `Level` chunks or players.

## Blocks

`Level::setBlock(position, state, true)` updates the block and its neighbours. Player placement does not run the placed block's own update, so a block overrides `onPlaced` to react. Waterlogging is block layer 1. `Level::peekBlockPtr` returns `nullptr` for unloaded chunks, which means unknown, not air.

## Embedding

`Falcon/EmbeddedServer.h` runs a server inside another program, on its own thread, for one player on the same machine. It listens on loopback on a system-chosen port, skips the Xbox login and encryption, and loads no plugins.
