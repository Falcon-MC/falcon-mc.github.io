title: Script API
section: Packs and scripting
---
Falcon embeds QuickJS and provides two modules, `@minecraft/server` and `@minecraft/server-ui`. They implement a subset of the game's API, listed on this page.

## Enabling scripts

```json
{
  "format_version": 2,
  "header": {
    "name": "Hello",
    "uuid": "<pack uuid>",
    "version": [1, 0, 0]
  },
  "modules": [
    {
      "type": "script",
      "uuid": "<module uuid>",
      "version": [1, 0, 0],
      "entry": "scripts/main.js"
    }
  ],
  "dependencies": [
    { "module_name": "@minecraft/server", "version": "1.0.0" }
  ]
}
```

```js
import { world, system } from "@minecraft/server";

world.afterEvents.playerSpawn.subscribe((event) => {
  event.player.sendMessage("Welcome!");
});

system.runInterval(() => {
  world.sendMessage(`Tick ${system.currentTick}`);
}, 1200);
```

`console.log`, `console.warn` and `console.error` write to the server log.

## Module exports

`@minecraft/server`: `world`, `system`, `ItemStack`, `BlockPermutation`, `BlockStates`, `BlockTypes`, `ItemTypes`, `EquipmentSlot`, `GameMode`, `Player`, `InputPermissionCategory`, `Direction`, `BlockVolume`, `EntityWaypoint`, `PlayerInventoryType`, `TickingAreaManager`.

`@minecraft/server-ui`: `ActionFormData`, `MessageFormData`, `ModalFormData`.

## system

`run(callback)`, `runTimeout(callback, ticks)`, `runInterval(callback, ticks)`, `clearRun(id)`, `currentTick`.

## world

`sendMessage`, `getAllPlayers`, `getDimension`, `getEntity`, `getDynamicProperty`, `setDynamicProperty`, `getDynamicPropertyIds`, `clearDynamicProperties`, `afterEvents`, `beforeEvents`, `scoreboard`, `tickingAreaManager`.

## Dimension

`id`, `getBlock`, `getEntities`, `getPlayers`, `setBlockType`, `spawnEntity`, `spawnItem`, `spawnParticle`, `playSound`, `runCommand`.

## Entity

`addEffect`, `removeEffect`, `getEffect`, `addTag`, `removeTag`, `hasTag`, `getTags`, `applyDamage`, `applyImpulse`, `applyKnockback`, `clearVelocity`, `getVelocity`, `getRotation`, `setRotation`, `teleport`, `kill`, `remove`, `matches`, `playAnimation`, `runCommand`, `setOnFire`, `extinguishFire`, `getComponent`, `getComponents`, `hasComponent`, `getProperty`, `setProperty`, and dynamic properties.

Components: `minecraft:health`, `minecraft:type_family`, `minecraft:projectile`.

## Player

Everything in Entity, plus `sendMessage`, `kick`, `getGameMode`, `setGameMode`, `addExperience`, `addLevels`, `resetLevel`, `getHeadLocation`, `getViewDirection`, `getItemCooldown`, `startItemCooldown`, `playSound`, `spawnParticle`, `onScreenDisplay`, `camera`, `inputPermissions`.

Components: `minecraft:inventory`, `minecraft:equippable`, `minecraft:cursor_inventory`.

`minecraft:inventory` gives a container with `addItem`, `getItem`, `setItem`, `emptySlotsCount` and `size`. `minecraft:equippable` has `getEquipment`, `setEquipment` and `getEquipmentSlot`.

`onScreenDisplay` has `setActionBar` and `setTitle`.

## Block

`above`, `below`, `north`, `south`, `east`, `west`, `center`, `matches`, `setType`, `setPermutation`, `permutation`, `typeId`, `isAir`.

## ItemStack

`new ItemStack(typeId, amount)`, then `getComponent`, `getTags`, `hasTag`, and dynamic properties. Components: `minecraft:durability` (`getDamageChance`, `maxDurability`), `minecraft:enchantable` (`getEnchantment`), `minecraft:cooldown` (`cooldownCategory`, `cooldownTicks`).

## Methods that do nothing

These exist so packs load, but have no effect: `onScreenDisplay.updateSubtitle`, `onScreenDisplay.hideAllForms`, `inputPermissions.setPermissionCategory`, `camera.setCamera`, `camera.fade`, `locatorBar.addWaypoint`, `removeWaypoint` and `removeAllWaypoints`.
