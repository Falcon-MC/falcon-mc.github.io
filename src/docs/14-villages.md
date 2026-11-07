title: Villages and raids
section: Administration
---
## Villages

The code lives in `Falcon.Server/src/World/Village/`. `VillageManager` tracks villages per level, built from points of interest (`PoiBlueprint`, `PoiInstance`, `PoiScanner`). Villagers are dwellers: they scan for and claim beds, meeting areas and job sites. A claim is released when the point of interest stops being valid, and a dweller is removed from the village when it dies.

Villages tick near players, within `tick-distance`.

## Raids

A player with Bad Omen gains Raid Omen, shown with the on-screen animation, for 30 seconds. It then starts a raid at the village. The raid runs in waves with a boss bar, a horn sound (`raid.horn`) and raiders that spawn at the village edge.

The first wave groups are:

| Group | Raiders |
|---|---|
| 1 | 4 pillagers |
| 2 | 3 pillagers, 2 vindicators |
| 3 | 3 pillagers, 1 ravager |
| 4 | 3 witches, 3 pillagers |
| 5 | 4 vindicators, 1 evoker, 1 ravager, 1 ravager ridden by a pillager |

Winning gives each hero the Hero of the Village effect for 48000 ticks. Raiders have their own goals, can ride, and patrols recruit.

Later groups are larger.
