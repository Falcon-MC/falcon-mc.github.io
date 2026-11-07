title: Guide - Internal
section: Plugin runtimes
---
An internal plugin uses the server's own headers and classes, so it can do anything a fork can. It subclasses `Block`, `Item`, `MobActor`, `Goal` or `Command`, and registers classes with `FALCON_REGISTER_BLOCK`, `FALCON_REGISTER_ITEM` and `FALCON_REGISTER_ACTOR`. A lower priority number overrides a vanilla class.

The server refuses a plugin built against another commit, build number or compiler, and logs why. Rebuild it for every server update, and keep its classes in a namespace.

## Build

```cmake
falcon_add_internal_plugin(MyPlugin MyPlugin.cpp)
```

Each release publishes the matching SDK, `FalconSDK-<platform>.tar.gz`. Point `FALCON_SDK_DIR` at it, with the compiler named in its `README.txt`. For a server built from source with `FALCON_EXPORT_SYMBOLS` (on by default), point `FALCON_BUILD_DIR` at its build folder instead.

## Code

```cpp
#include "Block/BlockClassRegistry.h"
#include "Block/Blocks/SaplingBlock.h"

#include <falcon/internal/InternalPlugin.hpp>

namespace myplugin {
    class CustomSaplingBlock : public SaplingBlock {
    public:
        using SaplingBlock::SaplingBlock;

        static bool matches(const std::string &identifier) {
            return SaplingBlock::matches(identifier);
        }
    };

    FALCON_REGISTER_BLOCK(CustomSaplingBlock, 10);

    class MyPlugin : public falcon::internal::Plugin {
    public:
        bool onEnable() override {
            subscribe(getServer().getEventBus().after().mPlayerJoin, [](PlayerJoinAfterEvent &event) {
                event.mPlayer.sendMessage("Welcome!");
            });
            return true;
        }
    };
}

FALCON_INTERNAL_PLUGIN(myplugin::MyPlugin)
```

## Manifest

```json
{
  "name": "MyPlugin",
  "version": "1.0.0",
  "main": "MyPlugin",
  "runtime": "internal"
}
```

Register classes with the macros or in `onLoad`. The server applies them after every plugin has loaded and removes them when the plugin is disabled. The library stays loaded until the server exits.

On Windows the plugin imports symbols from `FalconServer.exe`, so the executable must keep that name.
