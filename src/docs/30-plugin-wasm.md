title: Guide - Wasm
section: Plugin runtimes
---
A Wasm plugin runs in Wasmtime with no file system or network access. It has at most `wasm-plugin-memory-mb` of memory (default 64) and `wasm-plugin-fuel` units of fuel per server call (default 10000000). A plugin that runs out of fuel or traps logs `The Wasm plugin trapped and will not be called again` and stays stopped.

## The API

The API is defined in `wasm/falcon.wit`, package `falcon:plugin@1.3.3`, and mirrors the C API. Its interfaces are `types`, `server`, `players`, `entities`, `levels`, `items`, `events`, `event`, `commands`, `scheduler`, `permissions`, `services` and `content`.

The plugin exports `on-load`, `on-enable`, `on-disable`, `on-event`, `on-command`, `on-task`, `on-service`, and callbacks for custom items, blocks and entities.

The server instantiates the core module `wit-bindgen` targets, not a component, so skip `wasm-tools component new`.

## Manifest

```json
{
  "name": "HelloWasm",
  "version": "1.0.0",
  "runtime": "wasm",
  "main": "HelloWasm.wasm",
  "description": "Greets players and answers /hellowasm from WebAssembly",
  "authors": ["Falcon"]
}
```

## A plugin in C

`wasm/c/falcon_wasm.h` is a small helper over the generated bindings.

```c
#include "falcon_wasm.h"

static void welcome(void) {
    falcon_player player;
    if (falcon_event_player(&player))
        falcon_send(player, "Welcome! This message comes from WebAssembly.");
}

static bool hello(int argc, const char *const *argv) {
    falcon_reply("Hello from WebAssembly!");
    return true;
}

bool falcon_enable(void) {
    falcon_on(FALCON_EVENT_PLAYER_JOIN, welcome);
    falcon_command("hellowasm", "Answers from a WebAssembly plugin", hello);
    falcon_log("HelloWasm is enabled");
    return true;
}
```

The helper also has `falcon_disable`, `falcon_warn`, `falcon_error`, `falcon_broadcast`, `falcon_schedule(delay, period, handler)`, `falcon_sender_player` and `falcon_player_name`.

## Building

You need `wit-bindgen` and a clang with the wasm32 target and a WASI sysroot. wasi-sdk has both.

```
wit-bindgen c wasm --out-dir build
clang --target=wasm32-wasip1 --sysroot="$WASI_SYSROOT" -mexec-model=reactor -O2 \
    -Ibuild -Iwasm/c -o build/HelloWasm.wasm HelloWasm.c wasm/c/falcon_wasm.c \
    build/falcon_plugin.c build/falcon_plugin_component_type.o
```

`examples/wasm/HelloWasm/build.sh` does this. Put the `.wasm` file next to `plugin.json` in `plugins/HelloWasm/`.
