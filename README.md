# Atwaira

Source of https://armageddonas.github.io/. GitHub Pages serves this repo's `main` branch as-is; there's no build step here.

## Layout

- `index.html`, `assets/hub.css`: the main page. To add a system or world, copy a `<article class="feature">` card in `index.html`. The page is neutral and follows the visitor's light/dark setting; a world card can carry its own palette with a `theme-<world>` class defined in `hub.css` (see `.theme-duskworld`).
- `404.html`: shown by GitHub Pages for any missing path.
- `darktale/`: the Darktale rules wiki. **Generated, don't edit by hand.** It's built from the private sources in `C:\Creativity Programs\Darktale System` with `npm run publish` there, which replaces this whole folder.
- `.nojekyll`: tells GitHub Pages to serve the files without running Jekyll.

## History

The previous version of the site (Lore Wiki, Realm of Ashes, generators, Kedorithian calendar) is on the `legacy` branch. Sections move here one at a time as they're migrated.
