title: Services
section: Plugins
---
Plugins talk to each other through the server, whatever their language. A service takes a text request, usually JSON, and returns text.

```cpp
services().provide("economy:balance", [](const std::string &request) {
    return std::string("{\"balance\":250}");
});

std::optional<std::string> balance = services().call("economy:balance", "{\"player\":\"Steve\"}");
```

A service belongs to the plugin that provided it and disappears when that plugin is disabled.

## Custom events

Custom events have priorities and cancellation, like server events.

```cpp
services().on("quests:completed", [](falcon::CustomEvent &event) {
    event.setData(event.data() + " rewarded");
});

falcon::CustomEventResult result = services().fire("quests:completed", "{\"quest\":\"miner\"}", true);
```

Call services and fire custom events from the main thread.
