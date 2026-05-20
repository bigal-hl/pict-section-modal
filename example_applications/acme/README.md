# Acme Widgets — pict-section-modal + pict-section-theme example

A fully-branded multi-page Pict application. This is the reference
example for adopting both `pict-section-modal`'s `shell()` API and
`pict-section-theme`'s chrome (Theme-TopBar + Theme-BottomBar) at the
same time.

## Run it

```bash
npm install
npm run build
# then open dist/index.html in any modern browser
# (or `cd dist && python3 -m http.server 8000` and visit localhost:8000)
```

## What this example demonstrates

| # | Pattern | File(s) |
|---|---|---|
| 1 | **Custom brand block** — inline SVG logo + light/dark favicons + primary/secondary colors | `source/Acme-Brand.js` |
| 2 | **Custom theme**, registered with the catalog *before* `addProvider`, then set as the default via `ApplyDefault` | `source/themes/acme-default.json`, application bootstrap |
| 3 | **Shell-based layout** with three panels (topbar / statusbar / dynamic sidebar) + a workspace center | `source/views/PictView-Acme-Layout.js` |
| 4 | **Theme-TopBar + Theme-BottomBar** with host-supplied slot views (`NavView`, `StatusView`) | application bootstrap + the Acme-TopBar-Nav / Acme-StatusBar views |
| 5 | **Gear menu with theme picker, mode toggle, scale select** (auto-mounted by `pict-section-theme` — zero per-app code) | application bootstrap (Views: ['Picker', 'ModeToggle', 'ScaleSelect', 'Button', ...]) |
| 6 | **Multi-page routing** via `pict-router` with About / Legal / Store routes | `source/providers/PictRouter-Acme-Configuration.json`, page views |
| 7 | **Active-route highlight** in the nav using the W3C-standard `aria-current="page"` (chrome's CSS picks it up) | `source/views/PictView-Acme-TopBar-Nav.js` |
| 8 | **Per-route panel visibility** — the product-filter sidebar is added at boot but only displayed on `/Store` | `source/views/PictView-Acme-Layout.js` (`setSidebarVisible`), application's `showView` |
| 9 | **Responsive drawer** — the sidebar panel flips into a top drawer below 900px viewport via `ResponsiveDrawer: 900` | `source/views/PictView-Acme-Layout.js` |
| 10 | **Two-way reactive filter** — sidebar inputs update `AppData.Acme.Filter`, the Store view re-renders | sidebar + store views, app's `setFilterQuery` / `setFilterCategory` |

## File tour

```
acme/
├── package.json          ← dependencies, build/copy config
├── html/
│   └── index.html        ← single root container + bundle script tag
├── css/
│   └── acme.css          ← page-level chrome (everything else is in views)
└── source/
    ├── Pict-Application-Acme.js              ← application bootstrap
    ├── Pict-Application-Acme-Configuration.json
    ├── Acme-Brand.js                         ← brand block (inline logo+favicons+colors)
    ├── themes/
    │   └── acme-default.json                 ← custom theme bundle
    ├── providers/
    │   └── PictRouter-Acme-Configuration.json
    └── views/
        ├── PictView-Acme-Layout.js           ← shell() + addPanel() x3
        ├── PictView-Acme-TopBar-Nav.js       ← About / Legal / Store nav buttons
        ├── PictView-Acme-StatusBar.js        ← bottom status text
        ├── PictView-Acme-Sidebar.js          ← product filter (only shown on /Store)
        ├── PictView-Acme-About.js            ← /About page content
        ├── PictView-Acme-Legal.js            ← /Legal page content
        └── PictView-Acme-Store.js            ← /Store page content (filtered product grid)
```

## The 90-second tour

1. **`Pict-Application-Acme.js`** is where the wiring lives. Read it
   top-to-bottom; every meaningful pattern is registered in the
   constructor in roughly the same order this README lists them.

2. **`PictView-Acme-Layout.js`** calls `tmpModal.shell()` once and
   then registers three panels via `addPanel({})`. The sidebar
   illustrates `ResponsiveDrawer: 900` — the option that gives you
   the drawer-flip-at-narrow-widths behaviour for free.

3. **`PictView-Acme-Sidebar.js`** shows the host-supplied slot view
   pattern. Its renderable's `DestinationAddress` is the same
   `ContentDestinationId` the layout passed to `addPanel`, and the
   shell auto-renders it for you on creation + every expand.

4. **`Acme-Brand.js`** + **`themes/acme-default.json`** are the brand
   + theme story. The brand is the per-app identity (name, colors,
   icons); the theme is the per-color-scheme palette. They compose —
   the theme references `--brand-color-*-mode` so it stays
   brand-aware regardless of which theme is active.

## Things to try in the running app

- **Switch themes**: click the gear in the top-right and pick a
  different theme. Every page updates. The Acme primary + secondary
  colors stay (they're brand-level, not theme-level).
- **Switch modes**: in the gear menu, toggle between Light / Dark /
  System. The chrome plus all page content reflows.
- **Scale**: in the gear menu, try 75% / 100% / 125% / 150%. The
  entire UI rescales (via CSS `zoom` on `<html>`).
- **Try the sidebar**: navigate to Store. The sidebar appears on the
  left. Filter by category or search; the product grid updates.
- **Test responsiveness**: shrink the browser window narrower than
  900px while on /Store. The sidebar flips into a top drawer. Toggle
  it by clicking the handle pill that hangs from the drawer's bottom.
  The topbar nav also collapses into a burger menu at the same
  breakpoint.
- **Deep-link**: visit `index.html#/Legal` directly. The layout
  resolves the route and lands you on the right page.
- **Reload**: your theme + mode + scale picks persist across reloads
  via localStorage (scoped to `acme-widgets`).

## Adapting this to your app

The fastest path:

1. Copy this directory.
2. Edit `Acme-Brand.js` with your brand's name / colors / SVG /
   favicons. (For real apps, precompute via the
   `pict-section-theme-brand` CLI instead — that writes into
   `package.json` under `retold.brand`, see
   `pict-section-theme/README.md`.)
3. Edit `themes/acme-default.json` with your theme tokens, or delete
   it entirely and pass `ApplyDefault: 'pict-default'` (or any
   other bundled theme hash) to start.
4. Rename the routes + page views.
5. Decide what your sidebar (if any) contains; or drop it entirely.

The chrome (topbar, statusbar, theme picker, brand mark, responsive
drawer logic) is all in `pict-section-theme` / `pict-section-modal` —
you don't reimplement any of it.
