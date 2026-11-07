title: Commands
section: Administration
---
Players type a leading slash, the console does not. The **Level** column is the permission the command requires: see [Permissions](permissions.html). `Op` means operator level (`GameDirectors`), `Any` means every player, and `Console` means a level above operator, which no player has.

## Server

| Command | Level | Use |
|---|---|---|
| `/about` (`/version`, `/ver`) | Any | Shows the server version and commit |
| `/status` | Op | Shows server performance and players |
| `/profiler <on\|off\|status>` | Op | Records a report to `profiler/` |
| `/list` | Op | Lists online players |
| `/say <message>` | Op | Broadcasts a message |
| `/stop` | Console | Stops the server |
| `/save [hold\|resume\|query]` | Console | Saves or holds saving |
| `/save-on`, `/save-off` | Console | Turns saving on or off |
| `/setmaxplayers <maxPlayers>` | Console | Changes the player limit |
| `/transfer <player> <address> [port]` (`/transferserver`) | Console | Sends a player to another server |
| `/world <list\|create\|load\|unload\|tp> ...` | Console | See [Worlds](worlds.html) |

## Moderation

| Command | Level | Use |
|---|---|---|
| `/op <player>` | Op | Grants operator |
| `/deop <player>` | Op | Removes operator |
| `/kick <player> [reason]` | Op | Disconnects a player |
| `/ban <player> [reason]` | Op | Bans a player |
| `/pardon <player>` (`/unban`) | Op | Removes a ban |
| `/ban-ip <address\|player> [reason]` | Console | Bans an address |
| `/pardon-ip <address>` (`/unban-ip`) | Console | Removes an address ban |
| `/banlist [ips\|players]` | Op | Lists bans |
| `/allowlist <on\|off\|list\|reload>` (`/whitelist`) | Op | Manages the allow list |
| `/allowlist <add\|remove> <player>` | Op | Edits the allow list |

## Players

| Command | Level | Use |
|---|---|---|
| `/gamemode <mode> [player]` (`/gm`) | Op | Changes a game mode |
| `/defaultgamemode <mode>` | Op | Changes the default mode |
| `/give <player> <item> [amount] [data]` | Op | Gives an item |
| `/clear [player] [itemName] [data] [maxCount]` | Op | Removes items |
| `/enchant <player> <enchantment> [level]` | Op | Enchants the held item |
| `/effect <player> <effect> [seconds] [amplifier] [hideParticles]` | Op | Applies an effect |
| `/xp <amount>[L] [player]` | Op | Adds experience or levels |
| `/spawnpoint [player] [x y z]` | Op | Sets a spawn point |
| `/clearspawnpoint [player]` | Op | Clears a spawn point |
| `/tag <targets> <add\|remove\|list> [name]` | Op | Manages tags |
| `/me <action>` | Any | Sends an action message |
| `/tell <target> <message>` (`/msg`, `/w`) | Any | Sends a private message |

## World

| Command | Level | Use |
|---|---|---|
| `/time <add\|set\|query\|start\|stop> ...` | Op | Reads or changes the time |
| `/weather <clear\|rain\|thunder> [duration]` | Op | Changes the weather |
| `/daylock [lock]` (`/alwaysday`) | Op | Locks the day cycle |
| `/difficulty <peaceful\|easy\|normal\|hard>` | Op | Changes difficulty |
| `/gamerule <rule> [value]` | Op | Reads or sets a rule, listed below |
| `/seed` | Op | Shows the seed |
| `/setworldspawn [x y z]` | Op | Sets the world spawn |
| `/locate biome <biomeName> [teleport]` | Op | Finds a biome. Players only |
| `/tickingarea <add\|remove\|remove_all\|list\|preload> ...` | Op | Manages ticking areas |

## Blocks

| Command | Level | Use |
|---|---|---|
| `/setblock <x> <y> <z> <block> [replace\|destroy\|keep]` | Op | Places a block |
| `/fill <x1> <y1> <z1> <x2> <y2> <z2> <block> [replace\|destroy\|keep\|hollow\|outline]` | Op | Fills a volume |
| `/testforblock <position> <tileName>` | Op | Tests a block |
| `/testforblocks <begin> <end> <destination> [masked\|all]` | Op | Compares two volumes |

## Entities

| Command | Level | Use |
|---|---|---|
| `/tp [victim] <destination\|x y z>` (`/teleport`) | Op | Teleports |
| `/summon <entityType> [x y z] [nameTag]` | Op | Spawns an entity |
| `/kill [player]` | Op | Kills a target |
| `/damage <target> <amount> [cause]` | Op | Applies damage |
| `/testfor <victim>` | Op | Tests for a target |

## Display and logic

| Command | Level | Use |
|---|---|---|
| `/execute <subcommand> ... run <command>` | Op | Runs a command in a context |
| `/title <player> <clear\|reset\|title\|subtitle\|actionbar\|times> [text\|fadeIn stay fadeOut]` | Op | Shows a title |
| `/titleraw <player> <clear\|reset\|title\|subtitle\|actionbar\|times> [json]` | Op | Shows a raw JSON title |
| `/tellraw <target> <raw json message>` | Op | Sends raw JSON text |
| `/camera <target> <clear\|fade\|set> ...` | Op | Controls a camera |
| `/particle <effect> [position]` | Op | Spawns a particle |
| `/playsound <sound> [player] [position] [volume] [pitch] [minimumVolume]` | Op | Plays a sound |
| `/stopsound <player> [sound]` | Op | Stops a sound |

## Game rules

Rule names are lowercase. Defaults are in parentheses.

- Cycles: `dodaylightcycle` (true), `doweathercycle` (true), `doinsomnia` (true), `randomtickspeed` (1)
- Damage: `drowningdamage`, `falldamage`, `firedamage`, `freezedamage`, `pvp` (all true)
- Drops: `doentitydrops`, `domobloot`, `dotiledrops` (all true), `keepinventory` (false)
- Mobs and world: `domobspawning`, `mobgriefing`, `dofiretick`, `tntexplodes`, `tntexplosiondropdecay`, `projectilescanbreakblocks`, `respawnblocksexplode` (all true)
- Players: `naturalregeneration` (true), `doimmediaterespawn` (false), `spawnradius` (5), `playerssleepingpercentage` (100), `dolimitedcrafting` (false), `recipesunlock` (false)
- Display: `showcoordinates`, `showdeathmessages`, `showtags`, `showbordereffect`, `showrecipemessages`, `locatorbar` (all true), `showdaysplayed` (false), `playerwaypoints` (1)
- Commands: `commandblocksenabled`, `commandblockoutput`, `sendcommandfeedback` (all true), `functioncommandlimit` (10000), `maxcommandchainlength` (65535)
- Other: `experimentalgameplay` (true)
