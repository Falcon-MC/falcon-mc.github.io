title: Lifecycle
section: Plugins
---
## Order of operations

1. The server scans `plugins/` and reads each `plugin.json`, rejecting bad manifests, duplicate names and unsupported API versions.
2. It sorts plugins by `depend`, `softdepend` and `loadbefore`. A circular dependency is an error.
3. It loads each one. A plugin whose dependency failed is skipped.
4. It loads the plugins' resource packs.
5. It calls `onLoad` on each plugin.
6. It calls `onEnable` on each plugin in order. A plugin whose dependency is not enabled is skipped.
7. At shutdown it calls `onDisable` in reverse order and cancels the plugin's scheduled tasks.

## The three callbacks

```cpp
class MyPlugin : public falcon::Plugin {
public:
    void onLoad() override {
        // Register custom content here.
    }

    bool onEnable() override {
        logger().info("enabled");
        return true;
    }

    void onDisable() override {
        logger().info("disabled");
    }
};

FALCON_PLUGIN(MyPlugin)
```

Returning `false` from `onEnable`, or throwing, leaves the plugin disabled and logs an error. The C++ wrapper catches exceptions from every callback, handler and task.

Register custom content in `onLoad`, as the HelloPlugin example does with its Thunder Wand, and listeners, commands and tasks in `onEnable`.

## Native entry point

`FALCON_PLUGIN(Type)` exports `falcon_plugin_entry`. The server calls it with the API table, the plugin handle and the callback struct. It returns 0 if the API major version differs or the table is too small.
