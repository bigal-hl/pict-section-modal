# Modal Garden - The Full Feature Catalog

<!-- docuserve:example-launch:start -->
> **[Launch the live app](examples/modal%5Fgarden/index.html)** - runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

Modal Garden is the **interactive feature catalog** for
`pict-section-modal` - every public API, every option, every variant, on
one page. Click a button, see the modal; the code snippet that produced
it is displayed beneath each card via `pict-section-code` read-only
editors. Where [Bookstore](../bookstore/README.md) shows the patterns in
context, Modal Garden lets you compare the variants side by side.

It also hosts the **shell + panels playground**: live demos of every
panel mode, hook, and persistence option, so the docs for the shell API
are not just prose.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| `confirm()` - promise-based single confirmation | "Confirmation" card |
| `confirm({ dangerous: true })` - danger styling | "Dangerous confirm" card |
| `doubleConfirm()` with `confirmPhrase` | "Double-confirm with typed phrase" card |
| `doubleConfirm()` with two-click confirmation | "Double-confirm with two clicks" card |
| `show()` - custom modal with HTML + buttons | "Custom modal" card |
| `toast()` - four types: success / error / warning / info | "Toast types" card |
| Toast `position` - six anchored positions | "Toast positions" card |
| Toast `duration: 0` (sticky) + `dismissible: false` (auto-only) | "Toast options" card |
| `tooltip()` - simple text tooltip on hover | "Tooltips" card |
| `richTooltip()` - interactive HTML tooltip | "Rich tooltips" card |
| `dropdown()` - anchor-positioned menu under any element | "Dropdown nav" card |
| `dropdown({ align: 'right' })` + headers / separators / disabled items | "Dropdown split" card |
| `shell()` - full layout API with topbar / sidebar / center | "Shell anatomy" card |
| Panel `Mode: 'fixed' \| 'collapsible' \| 'resizable'` | "Shell modes" card |
| `ContentView` + `ContentDestinationId` - auto-render binding | "ContentView binding" card |
| `OnExpand` / `OnCollapse` / `OnToggle` lifecycle hooks | "Shell hooks" card |
| `PersistenceKey` + per-panel `Persist: false` | "Shell persistence" card |
| `Position: 'overlay'` panel rendering | "Overlay panel" card |
| `ResponsiveDrawer` - narrow-viewport drawer flip | "Responsive drawer" card |

## Key files

- `source/Pict-Application-ModalGarden.js` - bootstrap. Registers
  `PictSectionModal` (the modal API), `ModalGardenLayout` (the page
  scaffold), and ~20 `pict-section-code` read-only views - one per
  demo card.
- `source/views/PictView-ModalGarden-Layout.js` - the page; renders the
  card grid and wires each "Show" button to a modal API call.
- `_CodeSnippets` array - every card's verbatim source snippet, declared
  once and registered as read-only `pict-section-code` views; what you
  see on screen is exactly what runs.

---

## Feature 1 - Confirmation flow

The simplest modal primitive returns a promise:

```js
let tmpModal = this.pict.views.PictSectionModal;

let tmpResult = await tmpModal.confirm('Are you sure you want to proceed?');
// tmpResult === true  (confirmed)
// tmpResult === false (cancelled)
```

For destructive actions, pass `dangerous: true`:

```js
let tmpResult = await tmpModal.confirm(
    'Delete this record? This action cannot be undone.',
    { dangerous: true, title: 'Delete Record' }
);
```

The button restyles to danger; the rest of the API is identical.

## Feature 2 - Double-confirm variants

When a single confirm is too easy, `doubleConfirm` adds friction. Two
flavors:

**Typed-phrase double-confirm.** The user must type the exact phrase
before the button enables:

```js
let tmpResult = await tmpModal.doubleConfirm(
    'This will permanently delete all data in the system.',
    { confirmPhrase: 'DELETE ALL', title: 'Permanent Deletion' }
);
```

**Two-click double-confirm.** No phrase - just an extra click. Useful
for "less catastrophic but still serious" actions:

```js
let tmpResult = await tmpModal.doubleConfirm(
    'Reset all settings to their factory defaults?',
    { title: 'Reset Settings' }
);
```

## Feature 3 - Custom modal with HTML + buttons

When the body content isn't a simple prompt and the buttons aren't
"confirm/cancel", `show()` is the escape hatch. The result is the
clicked button's `Hash` (or `null` if the user dismissed):

```js
let tmpButtonHash = await tmpModal.show({
    title:   'Edit Record',
    content: '<p>You have unsaved changes.</p>',
    width:   '500px',
    buttons:
    [
        { Hash: 'cancel', Label: 'Cancel',        Style: ''        },
        { Hash: 'delete', Label: 'Delete',        Style: 'danger'  },
        { Hash: 'save',   Label: 'Save Changes',  Style: 'primary' }
    ]
});
// tmpButtonHash === 'save' | 'delete' | 'cancel' | null
```

Three button styles: `''` (neutral), `'primary'` (theme accent), and
`'danger'` (red, for destructive).

## Feature 4 - Toasts: types, positions, durations

Toasts are non-blocking. Four types pick up matching theme tokens:

```js
tmpModal.toast('Operation completed.',  { type: 'success' });
tmpModal.toast('Something went wrong.', { type: 'error'   });
tmpModal.toast('Please check your input.', { type: 'warning' });
tmpModal.toast('New version available.',   { type: 'info'    });
```

Position: top/bottom × left/center/right - six combinations:

```js
tmpModal.toast('Message here', { position: 'top-right'     });
tmpModal.toast('Message here', { position: 'bottom-center' });
```

Duration controls dismissal:

```js
// Persistent - no auto-dismiss
tmpModal.toast('Stays until dismissed.', { duration: 0 });

// No dismiss button (auto-closes in 3s)
tmpModal.toast('Auto-close only.', { dismissible: false });

// Programmatic cleanup
tmpModal.dismissToasts();
```

## Feature 5 - Tooltips and rich tooltips

`tooltip()` is text on hover; `richTooltip()` accepts HTML and can be
interactive:

```js
let tmpHandle = tmpModal.tooltip(elementEl, 'Tooltip text', {
    position: 'top'   // 'top' | 'bottom' | 'left' | 'right'
});
// tmpHandle.destroy() removes it

let tmpRich = tmpModal.richTooltip(
    elementEl,
    '<strong>User Profile</strong><p>Jane Doe</p>',
    { position: 'bottom', maxWidth: '280px', interactive: true }
);
```

`interactive: true` keeps the tooltip open while the cursor is over its
content - useful for tooltips that contain links.

## Feature 6 - Dropdowns

`dropdown()` anchors a menu under any element. The promise resolves with
the chosen item, or `null` if the user dismissed:

```js
tmpModal.dropdown(navLinkEl,
{
    items:
    [
        { Hash: 'app',       Label: 'Application Suite' },
        { Hash: 'tools',     Label: 'Developer Tools'   },
        { Separator: true },
        { Hash: 'whats-new', Label: "What's new", Hint: '5 new' }
    ]
}).then((pChoice) => { if (pChoice) console.log(pChoice.Hash); });
```

Items support `Header`, `Separator`, `Hint`, `Disabled`, and `Tooltip`.
Alignment can be `'left'`, `'right'`, or `'center'`:

```js
tmpModal.dropdown(arrowBtnEl,
{
    align: 'right',
    items:
    [
        { Header: 'Export format' },
        { Hash: 'csv',     Label: 'CSV',  Hint: 'default' },
        { Hash: 'json',    Label: 'JSON' },
        { Hash: 'xlsx',    Label: 'Excel (XLSX)' },
        { Separator: true },
        { Hash: 'parquet', Label: 'Apache Parquet',
          Disabled: true, Tooltip: 'Pro plan only' }
    ]
});
```

## Feature 7 - Shell anatomy

The shell is the application chrome - a viewport with optional docked
panels and a center. Set it up once, then add panels:

```js
let tmpShell = tmpModal.shell(viewportEl, { PersistenceKey: 'my-app' });

tmpShell.addPanel({ Hash: 'top',    Side: 'top',    Mode: 'fixed', Size: 36  });
tmpShell.addPanel({ Hash: 'bottom', Side: 'bottom', Mode: 'fixed', Size: 32  });
tmpShell.addPanel({ Hash: 'left',   Side: 'left',   Mode: 'fixed', Size: 100 });
tmpShell.addPanel({ Hash: 'right',  Side: 'right',  Mode: 'fixed', Size: 80  });

tmpShell.getCenterEl().innerHTML = '<p>Workspace</p>';
```

Three panel modes:

| Mode | Behaviour |
|------|-----------|
| `fixed` | No user interaction - chrome you can't toggle (topbar, statusbar) |
| `collapsible` | Inner-edge tab toggles between collapsed + expanded |
| `resizable` | Inner-edge tab toggles AND user can drag the edge to resize |

## Feature 8 - `ContentView` auto-render binding

Bind a Pict view to a panel and the shell handles its render lifecycle
automatically - at panel creation **and** on every expand transition:

```js
// 1. Register the view normally
pict.addView('MyApp-Sidebar', MyAppSidebarView.default_configuration, MyAppSidebarView);

// 2. Bind it via ContentView when adding the panel
tmpShell.addPanel({
    Hash: 'sidebar', Side: 'left', Mode: 'collapsible',
    Size: 240, Title: 'Modules',
    ContentDestinationId: 'MyApp-Sidebar-Slot',   // becomes <div id=...>
    ContentView:          'MyApp-Sidebar'         // view auto-rendered
});
```

No manual `render()` bookkeeping. The "ContentView Binding" card in the
running app uses this on a counter view - click to expand the panel and
watch the tick number increment.

## Feature 9 - Lifecycle hooks

`OnExpand` / `OnCollapse` / `OnToggle` fire at the transition boundaries:

```js
tmpShell.addPanel({
    Hash: 'sidebar', Side: 'left', Mode: 'collapsible',
    Size: 140, Title: 'Hook me',

    OnExpand:   (pPanel)     => fetchLatestData(),
    OnCollapse: (pPanel)     => saveDirtyState(),
    OnToggle:   (pCollapsed) => updateAriaLive(pCollapsed)
});
```

Use `OnExpand` for lazy data fetching, `OnCollapse` for "save before
losing context", and `OnToggle` for accessibility (announce state).

## Feature 10 - Persistence

Panel sizes + collapsed states persist to `localStorage` when the shell
has a `PersistenceKey`. Opt individual panels out with `Persist: false`:

```js
let tmpShell = tmpModal.shell(viewportEl, { PersistenceKey: 'my-app:layout' });

tmpShell.addPanel({
    Hash:    'sidebar',
    Side:    'left',
    Mode:    'resizable',
    Size:    160,    // initial size - overridden by saved state on load
    Persist: true    // (default; set false to skip)
});
```

## Feature 11 - Overlay panels

`Position: 'overlay'` renders the panel as a floating overlay rather
than docking it in the side stack. The center never gets pinched:

```js
tmpShell.addPanel({
    Hash:     'sidebar',
    Side:     'left',          // which edge the overlay attaches to
    Mode:     'collapsible',
    Position: 'overlay',
    Size:     160,
    Title:    'Overlay'
});
```

## Feature 12 - Responsive drawer

`ResponsiveDrawer: <pixels>` flips a side panel into a top drawer when
the viewport gets narrower than the threshold. Workspace gets the full
width; the user pulls the drawer down from the top via a handle pill:

```js
tmpShell.addPanel({
    Hash:             'sidebar',
    Side:             'left',
    Mode:             'resizable',
    Size:             170,
    Title:            'Filter',
    ResponsiveDrawer: 1100,    // breakpoint (px); 0 disables
    DrawerHeight:     '33%'    // height in drawer mode (default '33vh')
});
```

## Running the example

```bash
cd example_applications/modal_garden
npm install
npm run build
# then open dist/index.html in a browser
```

## Things to try in the running app

- **Cycle every modal type** - top of the page, one card per primitive.
- **Compare double-confirm variants** - type the phrase vs. click twice.
- **Stack toasts** - fire several quickly; they queue and dismiss in
  order.
- **Drop down into a nav menu** - the dropdown card mimics a real nav
  bar.
- **Resize and toggle the live shell** - the shell-playground cards drive
  real panel transitions. Watch the `ContentView` counter tick.

## Takeaways

1. **One view, many primitives.** `PictSectionModal` exposes a flat API
   surface - `confirm`, `doubleConfirm`, `show`, `toast`, `tooltip`,
   `richTooltip`, `dropdown`, `shell`. Each card here is a single API
   call.
2. **Code shown = code run.** Every demo card's snippet is registered as
   a read-only `pict-section-code` view bound to the same expression
   that fires on click. There's no documentation drift.
3. **Promises everywhere.** Every modal/dropdown returns a promise that
   resolves with the user's choice (`true`/`false`/button hash/menu
   item/`null`). Linear control flow even for multi-step confirmations.
4. **The shell is a separate layer of API.** Where the modal primitives
   are transient (open, resolve, close), the shell is persistent
   chrome - panels stay until you remove them. They share theming and
   lifecycle conventions but their use cases are distinct.

## Related documentation

- [confirm](../../api/confirm.md), [doubleConfirm](../../api/doubleConfirm.md)
- [show](../../api/show.md), [toast](../../api/toast.md)
- [tooltip](../../api/tooltip.md), [richTooltip](../../api/richTooltip.md)
- [Architecture](../../Architecture.md) - modal + shell design
- [Implementation Reference](../../Implementation_Reference.md) - full API
- [Theming](../../api/theming.md) - theme tokens
