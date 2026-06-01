# Acme Widgets - Branded Multi-Page App on the Shell

<!-- docuserve:example-launch:start -->
> **[Launch the live app](examples/acme/index.html)** - runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

A fully-branded multi-page Pict application that demonstrates the full
`pict-section-modal` shell + `pict-section-theme` chrome integration in
one place - custom brand, custom theme, dynamic per-route sidebar that
responsively flips into a top drawer at narrow viewports, gear menu with
theme picker / mode toggle / scale select, and a bottom status bar.

It is the reference example for adopting both libraries together: every
piece of chrome you would otherwise reimplement (topbar, brand mark,
theme picker, responsive drawer, status row) comes from the libraries.
The application's own code stays focused on its routes and page views.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| Custom brand block | `source/Acme-Brand.js` - inline SVG logo + favicons + primary/secondary colors |
| Custom theme registered before bootstrap | `source/themes/acme-default.json` + `libCatalog.register(...)` before `addProvider` |
| Shell-based layout with three panels + center | `source/views/PictView-Acme-Layout.js` calling `tmpModal.shell()` + `addPanel()` x3 |
| Theme-TopBar with host nav slot | bootstrap passes `NavView: 'Acme-TopBar-Nav'` via `ViewOptions.TopBar` |
| Theme-BottomBar with status slot | bootstrap passes `StatusView: 'Acme-StatusBar'` via `ViewOptions.BottomBar` |
| Auto-mounted gear menu (picker + mode + scale) | bootstrap `Views: ['Picker', 'ModeToggle', 'ScaleSelect', 'Button', ...]` - zero per-app code |
| Multi-page routing | `pict-router` with About / Legal / Store routes; `application.showView()` is the router callback |
| Active-route highlight via `aria-current="page"` | `PictView-Acme-TopBar-Nav.js` sets the attribute; chrome CSS picks it up |
| Per-route panel visibility | layout's `setSidebarVisible(true|false)` toggled by `application.showView()` |
| Responsive drawer below 900px | `ResponsiveDrawer: 900` on the sidebar's `addPanel()` |
| Two-way reactive filter | sidebar inputs -> `AppData.Acme.Filter` -> Store view re-renders |
| Persisted layout + theme state | shell's `PersistenceKey: 'acme-widgets'` saves panel sizes; theme persists separately |

## Key files

- `source/Pict-Application-Acme.js` - the wiring. Read top-to-bottom; every
  pattern from the table above is registered in the constructor in roughly
  the same order this writeup lists them.
- `source/views/PictView-Acme-Layout.js` - single `tmpModal.shell()` call,
  then three `addPanel({})` calls (topbar, statusbar, sidebar) + a
  `center()`. The sidebar carries `ResponsiveDrawer: 900` for the drawer-flip
  behaviour.
- `source/Acme-Brand.js` - the brand block: name, primary/secondary colors,
  inline SVG logo, light/dark favicons.
- `source/themes/acme-default.json` - custom theme bundle. References
  `--brand-color-*-mode` so it stays brand-aware regardless of which mode
  is active.
- `source/providers/PictRouter-Acme-Configuration.json` - route map.
- `source/views/PictView-Acme-Sidebar.js` - host-supplied slot view bound
  via `ContentView` on `addPanel`. Renders into the `ContentDestinationId`
  the layout passed; the shell auto-renders it on creation + every expand.

---

## Feature 1 - Brand block + custom theme

The application registers its theme bundle with the catalog **before** it
adds the `Theme-Section` provider. That way `RegisterCatalog: true` (the
default) picks it up when the provider bootstraps:

```js
const libCatalog = require('pict-section-theme').Catalog;
libCatalog.register({
    Hash: 'acme-default',
    Bundle: require('./themes/acme-default.json'),
    Category: 'App',
    IsDefault: false
});

this.pict.addProvider('Theme-Section',
{
    ApplyDefault: 'acme-default',
    DefaultMode:  'system',
    DefaultScale: 1.0,
    Brand:        libAcmeBrand,
    Views:        ['Picker', 'ModeToggle', 'ScaleSelect', 'Button',
                   'BrandMark', 'TopBar', 'BottomBar'],
    ViewOptions:
    {
        TopBar:    { NavView:    'Acme-TopBar-Nav',  Height: 56 },
        BottomBar: { StatusView: 'Acme-StatusBar',   Height: 28 }
    }
}, libPictSectionTheme);
```

The `Brand` block is the per-app identity (name, colors, SVG); the theme
is the per-color-scheme palette. They compose - the theme's tokens
reference `--brand-color-*-mode` custom properties the brand block emits,
so the theme stays brand-aware regardless of which one is active.

## Feature 2 - Shell-based layout, three panels + center

The layout view calls `tmpModal.shell()` once and then registers three
panels. The shell owns the DOM; the application just provides slot views.

```js
let tmpShell = tmpModal.shell(this._mount, { PersistenceKey: 'acme-widgets' });

tmpShell.addPanel({
    Hash: 'topbar', Side: 'top', Mode: 'fixed', Size: 56,
    ContentDestinationId: 'Theme-TopBar',
    ContentView:          'Theme-TopBar'
});

tmpShell.addPanel({
    Hash: 'statusbar', Side: 'bottom', Mode: 'fixed', Size: 28,
    ContentDestinationId: 'Theme-BottomBar',
    ContentView:          'Theme-BottomBar'
});

tmpShell.addPanel({
    Hash: 'sidebar', Side: 'left', Mode: 'resizable',
    Size: 280, MinSize: 200, MaxSize: 500,
    Title: 'Product Filter',
    ContentDestinationId: 'Acme-Sidebar-Container',
    ContentView:          'Acme-Sidebar',
    ResponsiveDrawer:     900
});

tmpShell.center({ ContentDestinationId: 'Acme-Content-Container' });
```

`PersistenceKey: 'acme-widgets'` scopes the panel-size memory to this app
in `localStorage`. Drag the sidebar's inner edge, reload - the sidebar
reopens at the dragged width. Theme persistence is independent (handled
by `pict-section-theme`).

## Feature 3 - Per-route panel visibility

The sidebar is added at boot but only visible on `/Store`. The
application's router callback (`showView`) calls the layout's
`setSidebarVisible(true|false)`:

```js
showView(pViewIdentifier)
{
    if (pViewIdentifier in this.pict.views)
    {
        this.pict.views[pViewIdentifier].render();
    }

    let tmpLayout = this.pict.views['Acme-Layout'];
    if (tmpLayout && typeof tmpLayout.setSidebarVisible === 'function')
    {
        tmpLayout.setSidebarVisible(pViewIdentifier === 'Acme-Store');
    }
}
```

`setSidebarVisible(false)` collapses the panel programmatically (the
collapse tab still works); `true` re-expands it. Because the sidebar's
state is persisted, the user's choice when on `/Store` carries across
visits.

## Feature 4 - Responsive drawer at narrow viewports

`ResponsiveDrawer: 900` on the sidebar's `addPanel()` is the entire
implementation. Below 900px viewport width, the side panel flips into a
top drawer; the workspace gets the full width; the user toggles the
drawer via the handle pill that hangs from its bottom edge. No CSS
breakpoints in app code - the library handles it.

The topbar's burger menu kicks in at the same breakpoint via the same
mechanism (the `Theme-TopBar` view has a default `CompactBreakpoint:
900`), so nav + sidebar collapse together.

## Feature 5 - Two-way reactive filter

The sidebar inputs are bound to `AppData.Acme.Filter` keys. When the user
types in the search box or picks a category, the Store view re-renders
filtered by those values:

```js
setFilterQuery(pQuery)
{
    this.pict.AppData.Acme.Filter.Query = pQuery;
    if (this.pict.views['Acme-Store'])
    {
        this.pict.views['Acme-Store'].render();
    }
}
```

Filter state lives in `AppData` rather than a private view field, so the
sidebar and the Store view are decoupled - either could be re-implemented
independently as long as it reads/writes the same address.

## Running the example

```bash
cd example_applications/acme
npm install
npm run build
# then open dist/index.html in a browser
# (or `cd dist && python3 -m http.server 8000` and visit localhost:8000)
```

## Things to try in the running app

- **Switch themes** - click the gear in the top-right and pick a different
  theme. Every page updates instantly; the Acme primary/secondary colors
  remain (they're brand-level, not theme-level).
- **Toggle mode** - Light / Dark / System in the gear menu; chrome and
  pages reflow.
- **Scale** - 75% / 100% / 125% / 150%. The entire UI rescales (CSS `zoom`
  on `<html>`).
- **Navigate to Store** - the sidebar appears on the left. Filter by
  category or search; the product grid updates live.
- **Resize narrow** - drag the window to under 900px on `/Store`. The
  sidebar flips into a top drawer; the topbar nav collapses into a burger.
- **Deep-link** - visit `index.html#/Legal` directly. The layout resolves
  the route and lands on the right page.
- **Reload** - theme + mode + scale + sidebar size persist via
  localStorage (scoped to `acme-widgets`).

## Takeaways

1. **The chrome comes from the libraries.** Topbar, statusbar, brand mark,
   theme picker, responsive drawer - all from `pict-section-modal` +
   `pict-section-theme`. The application code adds its routes and page
   views; nothing else.
2. **Brand and theme compose.** The brand carries identity (logo, colors,
   icons); the theme carries the palette. Themes reference brand custom
   properties so theme switches respect brand identity.
3. **`ResponsiveDrawer` replaces a media-query rewrite.** A single option
   on `addPanel()` gives you the drawer-flip behaviour.
4. **State lives in `AppData`.** Filter values, current route, panel sizes
   - none of these are private to a single view. That's what makes the
   sidebar and Store view trivially independent.
5. **`PersistenceKey` is the user-experience polish.** Without it, every
   reload resets the sidebar width. With it, your app remembers.

## Related documentation

- [Architecture](../../Architecture.md) - the shell + panel model
- [Quick Start](../../Quick_Start.md) - minimum-viable shell setup
- [Implementation Reference](../../Implementation_Reference.md) - full API
- [Theming](../../api/theming.md) - theme tokens the shell respects
