title: Resource packs
section: Packs and scripting
---
Put packs in `resource_packs/`. The folder is created at startup.

## Formats

- A folder with a `manifest.json`
- A `.zip` or `.mcpack` archive
- A `.mcaddon` archive, which can hold several packs

The server reads the name, UUID and version from the manifest `header`. The version defaults to 1.0.0 and the name to the file name. It hashes each pack with SHA-256. A pack depending on a missing pack is dropped.

Add-ons in `behavior_packs/` can bundle resource packs, and a plugin can bundle one in `resource_pack/`.

## Forcing packs

```
texturepack-required=true
```

Clients must then accept the packs.

## Encrypted packs

Put the content key next to the archive, with the same name and the `.key` extension:

```
resource_packs/MyPack.zip
resource_packs/MyPack.key
```

The log says `Resource pack MyPack is encrypted (loaded content key)`.

## CDN

`cdn_config.json`, in the server folder, tells clients where to download packs:

```json
{
  "resource_packs": [
    {
      "pack_id": "<pack uuid>",
      "version": "1.0.0",
      "url": "https://example.com/MyPack.zip"
    }
  ]
}
```

`version` is optional. An entry that matches no loaded pack logs `Mismatch detected between CDN config and required resource packs`.
