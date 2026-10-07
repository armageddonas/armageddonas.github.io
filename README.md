# Atwaira

Source of https://armageddonas.github.io/. GitHub Pages serves this repo's `main` branch as-is; there's no build step here.

## Layout

- `index.html`, `assets/hub.css`: the main page. To add a system or world, copy a `<article class="feature">` card in `index.html`. The page is neutral and follows the visitor's light/dark setting; a world card can carry its own palette with a `theme-<world>` class defined in `hub.css` (see `.theme-duskworld`).
- `assets/search.js`: the site-wide search on the main page. It loads each section's own search index (listed in `SOURCES` at the top) and searches them together in the browser. To make a new section searchable, have its build write an index in the same format and add one line to `SOURCES`.
- `404.html`: shown by GitHub Pages for any missing path.
- `darktale/`: the Darktale rules wiki. **Generated, don't edit by hand.** It's built from the private sources in `C:\Creativity Programs\Darktale System` with `npm run publish` there, which replaces this whole folder.
- `package.json`, `tools/build.mjs`: `npm run build` in this folder rebuilds every generated section (for now, Darktale) by running each section's own publish script. `npm run build -- darktale` rebuilds just one. To add a section, add a line to `SECTIONS` in `tools/build.mjs`.
- `tools/serve.mjs`: `npm run serve` previews the whole site at http://localhost:4400/, served the way GitHub Pages serves it.
- `.nojekyll`: tells GitHub Pages to serve the files without running Jekyll.

## History

The previous version of the site (Lore Wiki, Realm of Ashes, generators, Kedorithian calendar) is on the `legacy` branch. Sections move here one at a time as they're migrated.
