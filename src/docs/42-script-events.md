title: Script events
section: Packs and scripting
---
Subscribe with `world.afterEvents.<name>.subscribe(callback)`, and remove with `unsubscribe`.

## afterEvents

| Group | Events |
|---|---|
| Players | `playerSpawn`, `playerJoin`, `playerLeave`, `playerHotbarSelectedSlotChange`, `playerInventoryItemChange` |
| Blocks | `playerBreakBlock`, `playerPlaceBlock`, `playerInteractWithBlock` |
| Entities | `entitySpawn`, `entityRemove`, `entityLoad`, `entityHurt`, `entityDie`, `entityHitBlock`, `entityHitEntity`, `entityItemDrop` |
| Projectiles | `projectileHitBlock`, `projectileHitEntity` |
| Other | `chatSend`, `itemUse`, `worldLoad` |

## beforeEvents

Set `event.cancel = true` to stop the action.

| Event | Use |
|---|---|
| `playerBreakBlock` | Before a block breaks |
| `chatSend` | Before a chat message |
| `playerInteractWithBlock`, `playerInteractWithEntity` | Before an interaction |
| `itemUse`, `itemUseOn` | Before an item is used |
| `entityHurt` | Before damage |
| `effectAdd` | Before an effect |
| `worldInitialize` | Gives `itemComponentRegistry` and `blockComponentRegistry` |

```js
import { world } from "@minecraft/server";

world.beforeEvents.chatSend.subscribe((event) => {
  if (event.message.includes("badword")) event.cancel = true;
});
```
