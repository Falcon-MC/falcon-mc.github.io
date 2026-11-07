# falcon-mc.github.io

Source of the Falcon website, published at https://falcon-mc.github.io.

The pages are generated from `src/` by `build.py`, which only needs Python 3: edit `src/home.html` or a
page under `src/docs/`, run `python3 build.py`, commit the generated HTML with its source and push to `main`.
GitHub Pages redeploys it.

To preview locally:

```
python -m http.server 8000
```

then open http://localhost:8000.

The site code is released under the MIT license. The Minecraft font in `assets/fonts` is by
Idrees Hassan and licensed under the SIL Open Font License 1.1.
