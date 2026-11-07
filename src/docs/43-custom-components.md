title: Custom components
section: Packs and scripting
---
A custom item lists component IDs in `minecraft:custom_components`, and a script registers handlers for them.

```json
{
  "format_version": "1.20.0",
  "minecraft:item": {
    "description": { "identifier": "demo:wand" },
    "components": {
      "minecraft:custom_components": ["demo:zap"]
    }
  }
}
```

```js
import { world } from "@minecraft/server";

world.beforeEvents.worldInitialize.subscribe((event) => {
  event.itemComponentRegistry.registerCustomComponent("demo:zap", {
    onUseOn(e) {
      console.log("used on a block");
    },
    onMineBlock(e) {
      console.log("mined a block");
    }
  });
});
```

## Item hooks

The server fires two hooks on the held item: `onUseOn` and `onMineBlock`. An exception in a handler is logged as a warning and the other components still run.

## Block components

A custom block lists component IDs in `minecraft:custom_components`, and `blockComponentRegistry.registerCustomComponent` registers its handlers. The server fires `onPlace`, `onPlayerInteract`, `onPlayerBreak` (also available as `onPlayerDestroy`), `onStepOn`, `onStepOff` and, for blocks with a `minecraft:tick` component, `onTick`. Every event carries `block` and `dimension`.
