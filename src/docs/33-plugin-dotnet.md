title: Guide - C#
section: Plugin runtimes
---
A C# plugin is a `net8.0` class library.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <EnableDynamicLoading>true</EnableDynamicLoading>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Falcon.PluginAPI" Version="1.0.5" />
  </ItemGroup>
</Project>
```

```csharp
using Falcon;

namespace MyPlugin
{
    public sealed class Main : Plugin
    {
        public override bool OnEnable()
        {
            Events.On<PlayerJoinEvent>(joinEvent =>
            {
                joinEvent.Player.SendMessage("Welcome!");
            });
            return true;
        }
    }
}
```

Copy the output of `dotnet publish` to `plugins/<name>/`, with this manifest:

```json
{
  "name": "MyPlugin",
  "version": "1.0.0",
  "main": "MyPlugin.Main",
  "runtime": "dotnet",
  "assembly": "MyPlugin.dll"
}
```

## Runtime

The server needs the .NET 8 runtime or newer, found through `DOTNET_ROOT`, then the default install folders. All C# plugins share one runtime and one `Falcon.PluginAPI`, loaded from `plugins/.dotnet/`, or from the first C# plugin's folder when that does not exist. Each plugin gets its own `AssemblyLoadContext`.
