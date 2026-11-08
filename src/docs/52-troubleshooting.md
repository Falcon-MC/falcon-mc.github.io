title: Troubleshooting
section: Project
---
## The client version is not supported

By default only the newest version joins, 1.26.60 (protocol 2225). `any-version=true` also accepts 1.26.52, 1.26.45 and 1.26.40. The log shows `uses protocol N, which the server does not support`. Update the client, or set `any-version=true`.

## Cannot join from the same Windows PC

Windows blocks packaged (UWP) apps from reaching the loopback address. If your client is a UWP package, exempt it from an administrator prompt:

```
CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"
```

This is a Windows rule, not a Falcon setting.

## RakNet is no longer supported

The server logs this for `transport=raknet` and falls back to NetherNet. Set `transport=nethernet`.

## A setting is ignored

The log prints `Invalid value in server.properties` and the default is used. Some keys are also [reserved](configuration.html#reserved-keys) and have no effect.

## The allow list keeps everyone out

With `allow-list=true` and an empty list, the server warns at startup. Type `allowlist add <playername>` or `allowlist off`.

## Xbox Live authentication fails

With `online-mode=true`, the log shows `failed Xbox Live authentication`. Check that the player is signed in.

## A command says you lack permission

Commands at `Admin` or `Owner` level cannot be run by players, even operators. Run them in the console. See [Permissions](permissions.html).

## A plugin does not load

| Log message | Cause |
|---|---|
| `it needs API X, the server provides Y` | Built for another API version |
| `missing dependency` | A `depend` plugin is not installed |
| `circular dependency` | Plugins depend on each other |
| `another plugin has the same name` | Two folders declare one `name` |
| `falcon_plugin_entry is not exported` | Not a Falcon plugin |
| `the X runtime is not supported yet` | Unknown `runtime` |
| `is not a valid Wasm module` | Bad `.wasm` file |
| `The Wasm plugin trapped` | The plugin trapped or ran out of fuel. Raise `wasm-plugin-fuel` if the work is legitimate |

## Java or C# plugins fail to start

Java plugins need Java 22 in `FALCON_JAVA_HOME` or `JAVA_HOME`, and the API jar in `plugins/.java/`. C# plugins need .NET 8 in `DOTNET_ROOT` or a default install folder.

## A behavior pack is skipped

The log says why: `invalid manifest.json`, `duplicate behavior pack`, or `missing dependency pack`.

## Script errors

Enable `content-log-console-output-enabled=true`. Check that the API you call is listed in [Script API](scripting.html).
