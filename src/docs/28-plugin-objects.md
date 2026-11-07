title: Game objects
section: Plugins
---
## Server

| Method | Use |
|---|---|
| `version()` | Server version |
| `onlinePlayers()` | All players |
| `findPlayer(name)` | `optional<Player>` |
| `broadcast(message)` | Message to everyone |
| `level(dimension)` | Level in the default world |
| `level(world, dimension)` | Level in a named world |
| `worlds()`, `defaultWorld()` | World names |
| `loadWorld(name, create, seed)`, `unloadWorld(name)` | World control |

`Dimension` is `Overworld`, `Nether` or `TheEnd`.

## Player

`name`, `xuid`, `uuid`, `address`, `isOperator`, `setOperator`, `sendMessage`, `sendTitle`, `sendActionBar`, `kick`, `transfer(address, port)`, `gameMode`, `setGameMode`, `food`, `setFood`, `setXpLevel`, `inventory`, `entity`, `hasPermission`, `setPermission`, `unsetPermission`, `sendPacket`.

`GameMode` is `Survival`, `Creative`, `Adventure` or `Spectator`.

## PlayerInventory

`item(slot)`, `setItem(slot, item)`, `give(item)`, `heldItem`, `setSelectedSlot`, `armor(slot)`, `setArmor(slot, item)`, `offhand`, `setOffhand`, `clear`.

## Entity

`type`, `level`, `teleport(position)`, `teleport(position, level)`, `setMotion`, `health`, `maxHealth`, `setHealth`, `isAlive`, `damage(amount, cause)`, `damage(amount, cause, attacker)`, `kill`, `remove`, `nameTag`, `setNameTag`, `isOnFire`, `setOnFire(ticks)`, `extinguish`, `isInvisible`, `setInvisible`, `asPlayer`.

## Level

`name`, `dimension`, `getBlock`, `blockName`, `blockStates`, `setBlock(position, name, statesJson)`, `breakBlock(position, dropItems)`, `isChunkLoaded`, `setTime`, `isRaining`, `setRaining`, `isThundering`, `setThundering`, `spawnEntity`, `dropItem`, `strikeLightning`, `createExplosion(position, power, breakBlocks)`, `entities`.

## Item

Create one with `Item::create(identifier, count)`. Then: `identifier`, `isEmpty`, `setCount`, `setDamage`, `customName`, `setCustomName`, `lore`, `setLore`, `setEnchantmentLevel`.

The headers in `native/include/falcon/` have the full signatures.
