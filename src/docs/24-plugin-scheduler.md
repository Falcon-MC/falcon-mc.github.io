title: Scheduler and config
section: Plugins
---
## Scheduler

| Method | Effect |
|---|---|
| `delay(ticks, task)` | Runs once after a delay |
| `repeat(periodTicks, task)` | Runs repeatedly |
| `async(work, done)` | Runs `work` off the main thread, then `done` |
| `cancel(task)` | Cancels by the returned ID |

```cpp
scheduler().repeat(1200, [] {
    falcon::Server::broadcast("This server runs Falcon");
});

scheduler().async([] {
    // Slow work. Do not touch game objects here.
}, [] {
    falcon::Server::broadcast("Finished");
});
```

The server cancels a plugin's tasks when it is disabled. Keep game access out of `work`: game state belongs to the main thread.

## Config

`config()` reads `config.yml` in the data folder. It is a flat list of `key: value` lines, and lines starting with `#` are comments.

```cpp
falcon::Config &config = plugin.config();
config.setDefault("announcement.message", std::string("This server runs Falcon"));
config.setDefault("announcement.period-ticks", (int64_t) 6000);
plugin.saveConfig();

const std::string message = config.getString("announcement.message");
const int64_t period = config.getInt("announcement.period-ticks", 6000);
```

## Logger

`logger().info(text)`, `warning(text)` and `error(text)` write to the server log under the plugin's name.
