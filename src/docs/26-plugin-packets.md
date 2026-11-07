title: Packets
section: Plugins
---
Plugins see and send raw packets. Payloads are the bytes of the packet, so your code must know the format.

## Hooking

`DataPacketReceiveEvent` fires for packets from a client, and `DataPacketSendEvent` for packets to one.

```cpp
events().on<falcon::DataPacketReceiveEvent>([this](falcon::DataPacketReceiveEvent &event) {
    logger().info(event.player().name() + " sent packet " + std::to_string(event.packetId()));
});
```

| Accessor | Use |
|---|---|
| `player()` | The player |
| `packetId()` | The packet ID |
| `dataView()` | Payload without a copy |
| `data()` | Payload as `vector<uint8_t>` |
| `setData(...)` | Replaces the payload |
| `cancel()` | Inherited from `Event` |

## Sending

```cpp
player.sendPacket(packetId, payload);
```

`sendPacket` takes a pointer and length, a `vector<uint8_t>`, or a `string_view`, and returns `bool`.

## Connection hooks

`ConnectionOpenEvent` has `address`, `transport`, `clientGuid` and `mtuSize`, before any game packet. `PlayerPreLoginEvent` adds client data such as `gameVersion`, `deviceModel` and `deviceOS`, and `setKickMessage`.

Packet IDs and formats are in the [Protocol repository](https://github.com/Falcon-MC/Protocol).

> These events run on hot paths. Keep handlers short.
