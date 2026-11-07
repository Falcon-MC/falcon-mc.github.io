title: Installation
section: Start
---
Falcon supports Minecraft: Bedrock Edition 1.26.60, protocol 2225. It runs on Windows, Linux and macOS.

## Download a release

Each [release](https://github.com/Falcon-MC/Falcon/releases) has builds for Windows, Linux and macOS, each with a `.sha256` file. Check the download against it, put the executable in an empty folder and run it. The server creates everything it needs in the folder it runs from.

## Build on Linux

Install `g++` with C++17 support, `cmake` 3.16 or newer, `ninja`, and the OpenSSL and zlib development headers. Then:

```
git clone https://github.com/Falcon-MC/Falcon.git
cd Falcon
./build.sh
```

## Build on macOS

Install the Xcode command line tools, then `cmake`, `ninja` and `openssl@3`. Run `./build.sh`. The script checks that `cmake`, `g++` and `ninja` are in `PATH`.

## Build on Windows

The reference toolchain is [MSYS2](https://www.msys2.org) UCRT64, with `gcc`, `cmake`, `ninja`, `openssl` and `zlib`. Run `build.bat`.

## What the build does

The first configure downloads the dependencies with CMake `FetchContent` (leveldb, QuickJS, libdatachannel and the Falcon-MC libraries), so it needs network access and takes a while. It also downloads a prebuilt Wasmtime 50.0.1 C API.

The log goes to `build.txt` and the executable to `build/Falcon.Server/FalconServer`. For an incremental rebuild:

```
cmake --build build
```

Without the scripts:

```
cmake -B build -G Ninja
cmake --build build
```

## Next step

Go to [First start](first-start.html).
