title: Contributing
section: Project
---
[CONTRIBUTING.md](https://github.com/Falcon-MC/Falcon/blob/main/CONTRIBUTING.md) is the authoritative document. This page gives the essentials.

## Reporting a bug

Search the [issues](https://github.com/Falcon-MC/Falcon/issues) first, then include:

- The Falcon version and commit, from `/about`
- Your operating system and the Bedrock client version
- Exact steps to reproduce
- Expected and actual behavior, compared with a vanilla world for gameplay bugs
- The server log, with the full crash output if there is one

Reproduce on a fresh world without behavior packs if you can. Report vulnerabilities privately, as [SECURITY.md](https://github.com/Falcon-MC/Falcon/blob/main/SECURITY.md) describes.

## Making a change

1. Fork and clone.
2. Install the [toolchain](index.html).
3. Branch off `dev` and open the pull request against it. Work for an upcoming protocol goes on the branch named after that version.
4. Build with `./build.sh` or `build.bat`.
5. Test on a running server, in game.

## Rules for code

- C++17 only. Match the style of the file you edit.
- One logical change per pull request, with no unrelated churn.
- Vanilla is the reference. Say how you checked it.
- Reuse existing helpers before writing new ones.
- No dead code and no leftover debug logging.
- New dependencies need an issue first.
- Performance claims need `/profiler` numbers.
- Commits follow Conventional Commits, such as `fix: stop coral from dying underwater`.

## Pull requests

Link the issue, allow maintainer edits, and use a draft if the work is not finished. CI must pass on Linux, Windows and macOS. Describe exactly what you tested.

Pull requests are closed without review for code that does not compile, untested changes, calls to things that do not exist, repository-wide reformats, undisclosed AI use, or duplicates.

## AI tools

AI tools are allowed. Name the model and version and which part of the work it did. Write pull request text in your own words, read every line you submit, and reproduce bugs on a real server before reporting them. Coding agents should read [AGENTS.md](https://github.com/Falcon-MC/Falcon/blob/main/AGENTS.md).

## License

Contributions are licensed under the LGPL-3.0.
