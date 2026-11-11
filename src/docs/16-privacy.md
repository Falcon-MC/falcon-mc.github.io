title: Client checks and telemetry
section: Administration
---
A Falcon server talks to one outside service, `api.falcon-mc.workers.dev`. This page lists everything it sends.

## Client checks

On by default. They remove clients that don't behave as the game's own client: modified clients, proxies and bots.

1. **Offer.** When a player connects over NetherNet, the server looks at the client's connection offer and refuses one the game would never send.
2. **Identity.** The offer must carry the identity assertion the game signs with the player's account. An offer without one is refused, except in a LAN game, see below.
3. **Attestation.** Once connected, the server sends the service what it saw of the connection being set up: the handshake of the secure session, the offer, and the headers of the join request. It removes the account token, the player's identity and every address, its own included. The service answers whether the client behaves as the game does, and the server removes it if not. If the service doesn't answer, the player stays.

No player name, identifier or address is sent. The service keeps nothing.

`allow-unofficial-clients=true` turns all three checks off. It is also the only way to let older versions join with `any-version`, because the checks only know the newest version.

## LAN games

In a LAN game the client sends its offer without an identity assertion, so these players are refused by default. `allow-lan-without-identity=true` lets them in, but only when the offer comes through LAN discovery from a loopback or private address: `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, link local, or IPv6 unique local. The other checks still apply.

Keep it off on a public server. The LAN port answers anyone who can reach it, and without an identity nothing ties the connection to an account.

## Telemetry

Off by default. With `emit-server-telemetry=true` the server sends a report at start, every half hour and at stop, with:

- its version, system, architecture and transport;
- player count, player limit and uptime;
- how long ticks took;
- how often each client check fired, and the platform a removed client claimed;
- why connections failed.

Nothing in a report names the server, its world or a player. The service keeps no address and deletes reports after 180 days.
