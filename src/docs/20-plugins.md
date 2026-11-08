title: Plugin overview
section: Plugins
---
The server loads each folder of `plugins/` that has a `plugin.json`. The API lives in the [PluginAPI repository](https://github.com/Falcon-MC/PluginAPI), at version 1.0.5, with examples for each runtime in `examples/`.

## Choosing a runtime

| `runtime` | Use it for | Guide |
|---|---|---|
| `wasm` | New plugins. Sandboxed, any language with WIT bindings for core modules | [Wasm](plugin-wasm.html) |
| `native` (default) | Raw performance, through the C API | [Native C++](plugin-native.html) |
| `java` | Java 22 plugins | [Java](plugin-java.html) |
| `internal` | Full access to server classes, tied to one build | [Internal](plugin-internal.html) |
| `dotnet` | Deprecated: existing C# plugins only | [C#](plugin-dotnet.html) |

All of them sit on one C ABI, `falcon_api.h`, so a feature exists once for every language. A native plugin runs on any server with the same API major version.

## plugin.json

```json
{
  "name": "HelloPlugin",
  "version": "1.0.0",
  "api-version": "1.0",
  "main": "HelloPlugin",
  "runtime": "native",
  "authors": ["Falcon-MC"],
  "description": "Greets players",
  "depend": [],
  "softdepend": [],
  "loadbefore": []
}
```

| Field | Rules |
|---|---|
| `name` | Required. Up to 64 letters, digits, `_` or `-`. Must be unique |
| `version` | Required |
| `main` | Required. Library name (`native`, `internal`), `.wasm` file (`wasm`), or full class name (`java`, `dotnet`) |
| `runtime` | Defaults to `native` |
| `api-version` | Required for `native` and `java`. Must have the server's major version and be no newer than the server's API |
| `jar` | `java` only, defaults to `<name>.jar` |
| `assembly` | `dotnet` only, defaults to `<name>.dll` |
| `depend` | Plugins that must load first. A missing one stops this plugin |
| `softdepend` | Load first when present |
| `loadbefore` | Plugins this one loads before |
| `authors`, `description` | Optional |

## Plugin folders

```
plugins/
  HelloPlugin/
    plugin.json
    libHelloPlugin.so
    data/
    resource_pack/
```

The server creates `data/`, returned by `dataFolder()`. A `resource_pack/` folder with a `manifest.json` is loaded as a resource pack under the plugin's name.

## What a plugin gets

| Accessor | Page |
|---|---|
| `events()` | [Events](plugin-events.html) |
| `commands()`, `permissions()` | [Commands and permissions](plugin-commands.html) |
| `scheduler()`, `config()`, `logger()` | [Scheduler and config](plugin-scheduler.html) |
| `content()` | [Custom content](plugin-content.html) |
| `services()` | [Services](plugin-services.html) |
| `Player::sendPacket`, packet events | [Packets](plugin-packets.html) |
| `Server`, `Player`, `Entity`, `Level`, `Item` | [Game objects](plugin-objects.html) |
