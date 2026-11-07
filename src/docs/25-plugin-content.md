title: Custom content
section: Plugins
---
Register content in `onLoad`, through `content()`. Each call returns `false` when it fails. Put the matching textures in a `resource_pack/` folder next to `plugin.json`.

## Items

| `CustomItem` field | Default |
|---|---|
| `identifier`, `displayName`, `icon`, `creativeCategory` | Empty |
| `maxStackSize` | 64 |
| `maxDurability` | 0 |
| `handEquipped` | `false` |
| `onUse(Player &, Item &)` | Optional |
| `onUseOnBlock(Player &, Item &, const BlockPos &, uint32_t face)` | Optional |

```cpp
falcon::CustomItem wand;
wand.identifier = "hello:thunder_wand";
wand.displayName = "Thunder Wand";
wand.icon = "thunder_wand";
wand.creativeCategory = "equipment";
wand.maxStackSize = 1;
wand.handEquipped = true;
wand.onUseOnBlock = [](falcon::Player &player, falcon::Item &, const falcon::BlockPos &position, uint32_t) {
    player.entity().level().strikeLightning(position.center());
    return true;
};

if (!content().item(std::move(wand)))
    logger().warning("Could not register the thunder wand");
```

## Blocks

| `CustomBlock` field | Default |
|---|---|
| `identifier`, `displayName`, `texture`, `creativeCategory`, `drop` | Empty |
| `destroyTime` | 1.0 |
| `explosionResistance` | 1.0 |
| `lightEmission` | 0 |
| `friction` | 0.6 |
| `onInteract(Player &, const BlockPos &, uint32_t face)` | Optional, returns `bool` |
| `onBreak(Player &, const BlockPos &)` | Optional |

## Entities

| `CustomEntity` field | Default |
|---|---|
| `identifier` | Empty |
| `width`, `height` | 0.6, 1.8 |
| `maxHealth` | 20 |
| `summonable` | `true` |
| `onTick(Entity &)` | Optional |
| `onInteract(Entity &, Player &)` | Optional, returns `bool` |

## Deeper changes

To subclass `Block`, `Item`, `MobActor` or `Goal`, use an [internal plugin](plugin-internal.html). For content defined in JSON, see [Behavior packs](behavior-packs.html).
