title: Worlds and dimensions
section: Administration
---
## Multiple worlds

A world lives in `worlds/<name>/`, with its LevelDB in `db/`. The world in `level-name` is the main one. Names can be up to 64 characters and cannot contain `/ \ : * ? " < > |` or control characters.

All `/world` forms need the console:

| Form | Effect |
|---|---|
| `world list` | Lists loaded worlds, then those only on disk |
| `world create <name> [seed]` | Creates and loads a world. Without a seed, one is chosen at random |
| `world load <name>` | Loads a world from disk |
| `world unload <name>` | Unloads a world |
| `world tp <name> [player]` | Moves a player to a world |

To load worlds at startup:

```
worlds-autoload=creative,minigames
```

Plugins can do the same with `Server::worlds()`, `Server::loadWorld(name, create, seed)` and `Server::unloadWorld(name)`.

## Dimensions

Each world has an Overworld, a Nether and an End, each with its own generator: `OverworldGenerator`, `NetherGenerator` and `TheEndGenerator`.

Nether portals and End portals are implemented, including the End obsidian platform and the End podium. `PlayerChangeDimensionEvent` lets a plugin change or cancel a crossing.

## Flat worlds

The generator type comes from the world's `level.dat`: `Generator` set to 2 selects `FlatWorldGenerator`, with `FlatWorldLayers` for the layers. No `server.properties` key selects it, so a flat world is one created elsewhere and copied in.

## Moving worlds

Worlds use the Bedrock format. Copy a world folder into `worlds/` and load it, or copy one out to use it in the game. Old block states are upgraded when read.

## Worlds from before 0.9

Worlds saved before 0.9 keep their terrain in `chunks.dat` and their entities in `entities.dat`. Put such a world in `worlds/` and open it: the first time, Falcon writes it into the current format.

- Blocks keep their variants: red wool stays red, spruce planks stay spruce.
- Chests, signs, furnaces and their items are kept. Item numbers become item names.
- Mobs and dropped items are kept. An entity type the game no longer knows is left out.
- The old files are not changed, and the import does not run again once the world has a `db/` folder.

## Generation accuracy

`Falcon.Server/tools/WorldGenParity.cpp` compares generated chunks against Bedrock Dedicated Server. Over 32×32 chunks it measures 99.6% block match on a test seed and 98.1% on seed 42. Structures are in progress.

## Ticking areas

`/tickingarea` keeps areas loaded. Chunks are otherwise ticked within `tick-distance` of a player.
