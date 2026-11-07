title: Behavior packs
section: Packs and scripting
---
Put packs in `behavior_packs/`, as folders with a `manifest.json` or as `.mcpack`, `.mcaddon` or `.zip` archives. Archives are extracted to `behavior_packs/.cache/`, which is rebuilt at each start. Add-ons in `resource_packs/` are scanned too. A duplicate UUID is skipped, and so is a pack with a missing dependency.

## Custom items

A pack with an `items/` folder adds items. The server reads these components:

`minecraft:display_name`, `minecraft:icon`, `minecraft:max_stack_size`, `minecraft:durability`, `minecraft:food`, `minecraft:digger`, `minecraft:cooldown`, `minecraft:projectile`, `minecraft:custom_components`.

## Custom blocks

A pack with a `blocks/` folder adds blocks. The server reads these components:

`minecraft:collision_box`, `minecraft:selection_box`, `minecraft:destructible_by_mining`, `minecraft:destructible_by_explosion`, `minecraft:friction`, `minecraft:geometry`, `minecraft:light_dampening`, `minecraft:light_emission`, `minecraft:map_color`, `minecraft:material_instances`.

## Recipes and entities

`CustomContentRegistry` also reads `minecraft:recipe_shaped`, `minecraft:recipe_shapeless` and `minecraft:entity` definitions with `is_spawnable` and `is_summonable`.
