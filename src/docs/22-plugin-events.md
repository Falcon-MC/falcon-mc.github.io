title: Events
section: Plugins
---
## Subscribing

```cpp
uint64_t id = events().on<falcon::BlockBreakEvent>([](falcon::BlockBreakEvent &event) {
    if (event.blockName() == "minecraft:diamond_ore")
        event.cancel();
}, falcon::EventPriority::High, true);

events().off(id);
```

`on<T>(handler, priority, ignoreCancelled)` returns a subscription ID. Priority defaults to `Normal` and `ignoreCancelled` to `false`. With `true`, the handler skips events that are already cancelled.

Priorities are `Lowest`, `Low`, `Normal`, `High`, `Highest` and `Monitor`.

Every event inherits `isCancelled()`, `setCancelled(bool)` and `cancel()`. The effect of cancelling depends on the event. The tables below list each event's own accessors. Methods named `set...` change the outcome.

`ConnectionOpenEvent` fires before the client sends any game packet, and cancelling it closes the connection.

## Core

| Event | Accessors |
|---|---|
| `PlayerJoinEvent` | `player` |
| `PlayerQuitEvent` | `player` |
| `PlayerChatEvent` | `player`, `message`, `setMessage` |

## Player

| Event | Accessors |
|---|---|
| `PlayerDeathEvent` | `player`, `message`, `setMessage` |
| `PlayerRespawnEvent` | `player`, `position`, `setPosition` |
| `PlayerMoveEvent` | `player`, `from`, `to`, `setTo` |
| `PlayerDropItemEvent` | `player`, `item` |
| `PlayerCommandEvent` | `player`, `command`, `setCommand` |
| `PlayerGameModeChangeEvent` | `player`, `gameMode`, `previousGameMode` |
| `PlayerChangeWorldEvent` | `player`, `world`, `previousWorld`, `level`, `from`, `to`, `setTo` |
| `PlayerChangeDimensionEvent` | `player`, `dimension`, `previousDimension`, `from`, `to`, `setTo` |
| `PlayerPickupItemEvent` | `player`, `item` |
| `PlayerPreLoginEvent` | `player`, `kickMessage`, `setKickMessage`, `clientData`, `clientDataField`, `serverAddress`, `gameVersion`, `deviceModel`, `deviceOS`, `thirdPartyName` |
| `ConnectionOpenEvent` | `address`, `transport`, `clientGuid`, `mtuSize` |
| `PlayerFormResponseEvent` | `player`, `formId`, `response`, `closed` |
| `PlayerToggleSneakEvent` | `player`, `isSneaking` |
| `PlayerToggleSprintEvent` | `player`, `isSprinting` |
| `PlayerToggleFlightEvent` | `player`, `isFlying` |
| `PlayerItemHeldEvent` | `player`, `previousSlot`, `newSlot`, `item` |
| `PlayerItemConsumeEvent` | `player`, `item` |
| `PlayerBedEnterEvent` | `player`, `bed` |
| `PlayerBedLeaveEvent` | `player`, `bed` |
| `PlayerJumpEvent` | `player` |
| `PlayerFoodChangeEvent` | `player`, `food`, `setFood`, `previousFood` |
| `PlayerExperienceChangeEvent` | `player`, `amount`, `setAmount` |

## Blocks

| Event | Accessors |
|---|---|
| `BlockBreakEvent` | `player`, `position`, `blockName` |
| `BlockPlaceEvent` | `player`, `position`, `blockName` |
| `PlayerInteractBlockEvent` | `player`, `position`, `face` |
| `SignChangeEvent` | `player`, `position`, `isFrontSide`, `text`, `setText` |

## Entities

| Event | Accessors |
|---|---|
| `PlayerInteractEntityEvent` | `player`, `entity` |
| `EntityDamageEvent` | `entity`, `attacker`, `amount`, `setAmount`, `cause` |
| `EntityDeathEvent` | `entity` |
| `EntitySpawnEvent` | `entity`, `level`, `position` |
| `EntityTransformEvent` | `entity`, `result` |
| `EntityTargetEvent` | `entity`, `target` |

## Inventory and crafting

| Event | Accessors |
|---|---|
| `InventoryOpenEvent` | `player`, `level`, `position`, `blockName` |
| `InventoryCloseEvent` | `player`, `level`, `position`, `blockName` |
| `InventoryTransactionEvent` | `player`, `action`, `item`, `count`, `sourceContainer`, `sourceSlot`, `destinationContainer`, `destinationSlot` |
| `CraftItemEvent` | `player`, `result`, `times` |
| `FurnaceSmeltEvent` | `level`, `position`, `source`, `result`, `setResult` |
| `FurnaceBurnEvent` | `level`, `position`, `fuel`, `burnTime`, `setBurnTime` |
| `ItemEnchantEvent` | `player`, `item`, `levelCost` |
| `ItemDamageEvent` | `player`, `item`, `damage`, `setDamage` |
| `ItemBreakEvent` | `player`, `item` |

## World

| Event | Accessors |
|---|---|
| `ProjectileHitEvent` | `projectile`, `shooter`, `target`, `hitBlock`, `blockPosition`, `blockName`, `position`, `level` |
| `ExplosionEvent` | `source`, `level`, `position`, `power`, `setPower`, `blocks`, `setBlocks` |
| `FireSpreadEvent` | `level`, `position`, `source` |
| `BlockBurnEvent` | `level`, `position`, `blockName`, `source` |
| `ProjectileLaunchEvent` | `projectile`, `shooter` |
| `BlockGrowEvent` | `level`, `position`, `blockName`, `previousBlockName` |
| `BlockSpreadEvent` | `source`, `level`, `position`, `blockName`, `previousBlockName` |
| `BlockFormEvent` | `level`, `position`, `blockName`, `previousBlockName` |
| `BlockFadeEvent` | `level`, `position`, `blockName`, `previousBlockName` |
| `LeavesDecayEvent` | `level`, `position`, `blockName`, `previousBlockName` |
| `LiquidFlowEvent` | `level`, `position`, `source`, `liquid` |
| `PistonExtendEvent` | `level`, `position`, `face`, `blocks` |
| `PistonRetractEvent` | `level`, `position`, `face`, `blocks` |
| `RedstoneChangeEvent` | `level`, `position`, `power`, `setPower`, `previousPower` |
| `WeatherChangeEvent` | `level`, `isRaining` |
| `ThunderChangeEvent` | `level`, `isThundering` |
| `ChunkLoadEvent` | `level`, `chunkX`, `chunkZ`, `isNewChunk` |
| `ChunkUnloadEvent` | `level`, `chunkX`, `chunkZ` |
| `WorldLoadEvent` | `world` |
| `WorldUnloadEvent` | `world` |

## Server

| Event | Accessors |
|---|---|
| `ServerTickEvent` | `tick` |
| `ServerCommandEvent` | `command`, `setCommand` |

## Packets

| Event | Accessors |
|---|---|
| `DataPacketReceiveEvent` | `player`, `packetId`, `dataView`, `data`, `setData` |
| `DataPacketSendEvent` | `player`, `packetId`, `dataView`, `data`, `setData` |
