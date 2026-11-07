title: Commands and permissions
section: Plugins
---
## Adding a command

```cpp
commands().add("joins", "Shows how many times a player joined", "/joins [player]",
    [this](falcon::CommandContext &context) {
        const auto &arguments = context.arguments();
        const std::string name = arguments.empty() ? context.senderName() : arguments[0];
        context.reply(name + " joined");
        return true;
    }, falcon::CommandPermission::Any);
```

`add(name, description, usage, handler, permission)` returns `false` when it fails. Permission is `Any`, or `Operator` by default. The handler returns whether the command succeeded.

| `CommandContext` | Use |
|---|---|
| `senderName()` | Name of the sender |
| `player()` | `optional<Player>`, empty for the console |
| `arguments()` | Arguments as strings |
| `hasPermission(node)` | Tests a permission node |
| `reply(message)` | Answers the sender |

## Permission nodes

```cpp
permissions().add("myplugin.fly", falcon::PermissionDefault::Operator);

if (player.hasPermission("myplugin.fly"))
    player.sendMessage("You can fly");

player.setPermission("myplugin.fly", true);
player.unsetPermission("myplugin.fly");
```

`PermissionDefault` is `False`, `True` or `Operator`, and defaults to `Operator`.
