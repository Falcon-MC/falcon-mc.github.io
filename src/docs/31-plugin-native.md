title: Guide - Native C++
section: Plugin runtimes
---
The API is a header-only CMake target, `Falcon::PluginAPI`. It needs CMake 3.16 and a C++17 compiler. A plugin built with any compiler runs on any Falcon build of the same API major version.

## Project

```cmake
include(FetchContent)

FetchContent_Declare(
    falcon_plugin_api
    GIT_REPOSITORY https://github.com/Falcon-MC/PluginAPI.git
    GIT_TAG main
    GIT_SHALLOW TRUE
)
FetchContent_MakeAvailable(falcon_plugin_api)

falcon_add_plugin(MyPlugin MyPlugin.cpp)
```

## Code

```cpp
#include <falcon/Falcon.hpp>

class MyPlugin : public falcon::Plugin {
public:
    bool onEnable() override {
        events().on<falcon::PlayerJoinEvent>([](falcon::PlayerJoinEvent &event) {
            event.player().sendMessage("Welcome!");
        });
        return true;
    }
};

FALCON_PLUGIN(MyPlugin)
```

## Install

Put the library and this manifest in `plugins/MyPlugin/`:

```json
{
  "name": "MyPlugin",
  "version": "1.0.0",
  "api-version": "1.0",
  "main": "MyPlugin"
}
```

`main` is the library name without its platform prefix or extension.

## A complete example

`examples/native/HelloPlugin` has listeners, two commands, a custom item, storage and a repeating task.
