title: Performance
section: Administration
---
## Status

`/status` prints server performance and player figures.

## Profiler

```
profiler on
profiler status
profiler off
```

`/profiler off` writes `profiler/profile-<timestamp>.html`, a self-contained report of the ticks recorded. If no tick was recorded, it reports an error.

## Settings that matter

| Key | Why |
|---|---|
| `view-distance` | Default 32. Sets how many chunks are generated and sent |
| `tick-distance` | Default 4. Sets how many chunks tick around each player |
| `max-threads` | Default 8. Worker threads |
| `compression-threshold` | Default 1 |

## Threads

Game state belongs to the main thread. Chunk workers and the network thread only exchange data through queues. Plugin code that uses `Scheduler::async` must not touch game objects from the worker: do that in the `done` callback.
