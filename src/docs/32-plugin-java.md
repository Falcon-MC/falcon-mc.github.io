title: Guide - Java
section: Plugin runtimes
---
A Java plugin is a Java 22 jar. The bindings use the Foreign Function & Memory API, and the loader runs in a virtual machine embedded in the server.

## Dependency

```xml
<dependency>
    <groupId>io.github.falcon-mc</groupId>
    <artifactId>falcon-plugin-api</artifactId>
    <version>1.0.5</version>
    <scope>provided</scope>
</dependency>
```

## Code

```java
package myplugin;

import falcon.api.Plugin;
import falcon.api.event.PlayerJoinEvent;

public final class MyPlugin extends Plugin {
    @Override
    public boolean onEnable() {
        events().on(PlayerJoinEvent.class, event -> {
            event.player().sendMessage("Welcome!");
        });
        return true;
    }
}
```

## Manifest

Put the jar next to `plugin.json` in `plugins/<name>/`:

```json
{
  "name": "MyPlugin",
  "version": "1.0.0",
  "api-version": "1.0.5",
  "main": "myplugin.MyPlugin",
  "runtime": "java",
  "jar": "MyPlugin.jar"
}
```

## Runtime

The server needs Java 22 or newer. It looks in `FALCON_JAVA_HOME`, then `JAVA_HOME`, and passes `FALCON_JAVA_OPTIONS` (for example `-Xmx1G`) to the virtual machine.

All Java plugins share one virtual machine and one `falcon-plugin-api-<version>.jar`, loaded from `plugins/.java/`. Keep it at least as new as the one the plugins were built against. Each plugin has its own class loader, and objects that own native memory, such as a created `Item`, are `AutoCloseable`.

A plugin can compile against another plugin's jar with `provided` scope and call its classes directly, as long as it lists that plugin in `depend` or `softdepend`.
