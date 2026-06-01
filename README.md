# Pict-Section-Modal

[![npm version](https://badge.fury.io/js/pict-section-modal.svg)](https://www.npmjs.com/package/pict-section-modal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modal dialog, confirmation, tooltip, toast notification, and **responsive layout shell** section view for the [Pict](https://github.com/fable-retold/pict) application framework. Drop in a single view to get promise-based confirmations, custom floating windows, auto-dismissing toasts, hover tooltips, and a panel-based application shell with built-in responsive behaviour -- all styled through CSS custom properties.

Pict-Section-Modal provides a complete notification and dialog toolkit -- confirm dialogs, double-confirm safety gates, custom modal windows with arbitrary content, toast notifications with stacking, simple or rich interactive tooltips, plus a viewport-filling layout shell with resizable side panels that fold into top drawers at narrow widths -- all composable through the Fable service provider pattern.

## Features

- **Confirm Dialogs** -- Promise-based single-step confirmations with OK/Cancel buttons and optional danger styling
- **Double Confirmations** -- Two-step safety gates: type-to-confirm with a required phrase, or click-twice to proceed
- **Custom Modal Windows** -- Arbitrary HTML content with configurable buttons, closeable header, and lifecycle callbacks
- **Toast Notifications** -- Auto-dismissing stacked notifications in six screen positions with four severity types
- **Tooltips** -- Simple text tooltips and rich HTML tooltips with directional positioning and auto-flip
- **Layout Shell** -- Viewport-filling panel layout (top/bottom/left/right + center) with resizable, collapsible panels that flip to top drawers on narrow viewports
- **CSS Theming** -- 30+ CSS custom properties for full visual customization without touching source code
- **Shared Overlay** -- Reference-counted backdrop shared across stacked modals with click-to-dismiss support
- **Keyboard & Focus** -- Escape key dismissal, focus trapping, and ARIA attributes for accessibility

## Installation

```bash
npm install pict-section-modal
```

## Quick Start

```javascript
const libPictSectionModal = require('pict-section-modal');
const libPict = require('pict');

let _Pict = new libPict({ Product: 'MyApp' });

// Register the modal view
_Pict.addView('Modal', {}, libPictSectionModal);
_Pict.initialize();

let tmpModal = _Pict.views.Modal;

// Show a confirmation
let tmpConfirmed = await tmpModal.confirm('Save changes before closing?');

// Show a toast
tmpModal.toast('File saved successfully.', { type: 'success' });
```

## API

### Confirmations

```javascript
// Simple confirm -- resolves true or false
let tmpResult = await tmpModal.confirm('Delete this record?',
	{
		title: 'Delete Record',
		confirmLabel: 'Delete',
		cancelLabel: 'Keep',
		dangerous: true
	});

// Double confirm with phrase -- user must type the phrase to proceed
let tmpResult = await tmpModal.doubleConfirm('This will permanently delete all data.',
	{
		title: 'Destroy Everything',
		confirmPhrase: 'DELETE ALL',
		phrasePrompt: 'Type "{phrase}" to confirm:',
		confirmLabel: 'Destroy',
		cancelLabel: 'Cancel'
	});

// Double confirm without phrase -- first click changes label, second click confirms
let tmpResult = await tmpModal.doubleConfirm('Reset the entire workspace?',
	{
		title: 'Reset Workspace',
		confirmLabel: 'Reset',
		cancelLabel: 'Cancel'
	});
```

### Modal Windows

```javascript
// Custom modal with buttons -- resolves with the clicked button's Hash
let tmpAction = await tmpModal.show(
	{
		title: 'Export Options',
		content: '<p>Choose an export format:</p>',
		width: '500px',
		closeable: true,
		buttons:
		[
			{ Hash: 'csv', Label: 'CSV', Style: 'primary' },
			{ Hash: 'json', Label: 'JSON' },
			{ Hash: 'xml', Label: 'XML' }
		],
		onOpen: (pDialog) => { console.log('Dialog opened'); },
		onClose: (pResult) => { console.log('Closed with:', pResult); }
	});

if (tmpAction === 'csv')
{
	// Export as CSV
}
```

### Toast Notifications

```javascript
// Basic toast
tmpModal.toast('Operation complete.');

// Typed toasts with options
tmpModal.toast('Record saved.', { type: 'success', duration: 2000 });
tmpModal.toast('Connection lost.', { type: 'error', duration: 0 }); // duration 0 = no auto-dismiss
tmpModal.toast('Low disk space.', { type: 'warning', position: 'bottom-center' });

// Programmatic dismiss
let tmpHandle = tmpModal.toast('Uploading...', { type: 'info', duration: 0 });
// Later...
tmpHandle.dismiss();
```

### Tooltips

```javascript
// Simple text tooltip
let tmpTip = tmpModal.tooltip(document.getElementById('help-icon'), 'Click for help',
	{
		position: 'top',
		delay: 300
	});

// Rich HTML tooltip with interaction
let tmpRichTip = tmpModal.richTooltip(document.getElementById('status'),
	'<strong>Status:</strong> Connected<br><a href="/details">View details</a>',
	{
		position: 'bottom',
		maxWidth: '350px',
		interactive: true
	});

// Remove a tooltip binding
tmpTip.destroy();
```

### Shell (responsive panel layout)

The shell is a viewport-filling layout container with addressable side
panels (top / bottom / left / right) plus a center workspace. Panels
can be **fixed**, **collapsible**, or **resizable**, each with their
own collapse-tab UI, persisted state, and - crucially - **responsive
behaviour**: a side panel can flip to a top drawer at narrow viewports
so the workspace gets full width instead of being pinched to nothing.

A pict-section-modal view exposes the shell via `.shell(viewport, opts)`.

#### Quick start

```javascript
const tmpShell = tmpModal.shell(document.getElementById('App'), {
    PersistenceKey: 'my-app-layout'    // localStorage scope (optional)
});

// Topbar - fixed 56px, never collapses
tmpShell.addPanel({
    Hash: 'topbar',
    Side: 'top',
    Mode: 'fixed',
    Size: 56,
    ContentDestinationId: 'My-TopBar',
    ContentView: 'My-TopBar-View'      // shell auto-renders this Pict view
});

// Sidebar - resizable, responsive drawer at < 900px
tmpShell.addPanel({
    Hash: 'sidebar',
    Side: 'left',
    Mode: 'resizable',
    Size: 280,                         // initial width
    MinSize: 200,
    MaxSize: 480,
    Title: 'Modules',
    ContentDestinationId: 'My-Sidebar',
    ContentView: 'My-Sidebar-View',
    ResponsiveDrawer: 900              // flip to top drawer below 900px
});

// Statusbar - fixed 32px at the bottom
tmpShell.addPanel({
    Hash: 'statusbar',
    Side: 'bottom',
    Mode: 'fixed',
    Size: 32,
    ContentDestinationId: 'My-StatusBar',
    ContentView: 'My-StatusBar-View'
});
```

#### `addPanel(config)` options

| Option | Type | Default | Description |
|---|---|---|---|
| `Hash` | string | auto | Identifier for `getPanel()` / `openPanel()` lookups |
| `Side` | `'top'`/`'right'`/`'bottom'`/`'left'` | `'top'` | Which edge of the shell the panel docks to |
| `Mode` | `'fixed'`/`'collapsible'`/`'resizable'` | `'fixed'` | Whether the user can collapse or resize the panel |
| `Position` | `'pinned'`/`'overlay'` | `'pinned'` | `'overlay'` floats the panel absolutely over the center via the shell's overlay layer |
| `Size` | number (px) | 280 (sides) / 80 (top/bottom) | Initial size along the panel's main axis |
| `MinSize` | number (px) | 40 | Clamp lower bound when resizing |
| `MaxSize` | number (px) | 1200 | Clamp upper bound when resizing |
| `CollapsedSize` | number (px) | 24 | Visible thickness when collapsed (just the tab) |
| `Collapsed` | boolean | `false` | Initial collapsed state |
| `Title` | string | `''` | Shown on the collapse-tab + as the panel's accessible name |
| `Icon` | string | `''` | Optional HTML icon shown on the collapse-tab |
| `Persist` | boolean | `true` | Persist Size/Collapsed to localStorage under the shell's `PersistenceKey` |
| `ContentDestinationId` | string | none | `id` for the inner div hosts render into |
| `ContentView` | string | none | A Pict view identifier the shell auto-renders into the destination at creation + on every expand |
| `ResponsiveDrawer` | number (px) | `0` (off) | Below this viewport width, the panel re-parents into a top-drawer layout - see below |
| `DrawerHeight` | string | `'33vh'` | CSS height of the drawer in responsive mode (CSS units: px / vh / %) |
| `OnExpand` / `OnCollapse` / `OnToggle` | function | none | Lifecycle hooks |

#### Responsive drawer mode (`ResponsiveDrawer`)

The pattern: a side panel pinches the center on desktop, but a narrow
viewport (tablet portrait, docked window, half-screen split) can't
afford that 200-300px sacrifice. Setting `ResponsiveDrawer: 900` (px)
tells the shell to flip the panel into a **top drawer** below that
breakpoint:

- The shell's middle row switches from `flex-direction: row` to
  `column`. The side panel stretches to full width and becomes a top
  drawer above the workspace center; the center reflows to use the
  full row width.
- **Collapsed in drawer mode** = the drawer shrinks to an 18px strip
  (just the collapse-tab is visible). The workspace gets the full
  remaining height.
- **Expanded in drawer mode** = the drawer takes its `DrawerHeight`
  (default `33vh`). The collapse-tab sits flush against the drawer's
  bottom edge as a handle, with its top edge merging into the drawer
  content above so the tab reads as a labelled extension of the
  drawer rather than a detached UI element.
- The drawer's chrome background is `background-clip: content-box`-ed
  so the tab's surrounding strip is transparent - it reads as
  belonging to the workspace, not as a separate drawer band.
- Hover on the tab grows its **width only** (64 -> 96px), so the
  hover affordance is visible but doesn't push into adjacent chrome.
- Above the breakpoint the panel snaps back into the docked side
  stack. User collapse/expand state is preserved across the
  transition.

`ResponsiveDrawer: 0` (the default) disables the behaviour - the panel
stays docked at every viewport width.

The breakpoint is enforced by a `matchMedia` listener with a
`window.resize` fallback (matchMedia change events occasionally miss
fast crossings on some browsers). State transitions are idempotent -
a re-fire of the same target state is a no-op.

#### `Panel` instance API

`shell.addPanel()` returns a panel handle. Useful methods:

| Method | Description |
|---|---|
| `panel.collapse()` / `panel.expand()` / `panel.toggle()` | Set collapsed state |
| `panel.popup()` | Idempotent "show me": expand if collapsed, flash + re-render content if already open |
| `panel.setSize(px)` | Programmatic resize (respects MinSize/MaxSize) |
| `panel.getContentEl()` | The inner content element (host's destination div) |
| `panel.getContentView()` | The bound `ContentView` Pict view instance, or null |
| `panel.destroy()` | Remove the panel, tear down listeners |
| `panel.El` | The root DOM element |
| `panel.Collapsed` / `panel.Size` / `panel.Side` / `panel.Mode` | Current state |

#### `Shell` instance API

`tmpModal.shell()` returns a shell handle. Useful methods:

| Method | Description |
|---|---|
| `shell.addPanel(config)` | Add a panel, returns the panel handle |
| `shell.getPanel(hash)` | Look up a panel by hash, or null |
| `shell.getPanels()` | Array of all panel handles |
| `shell.openPanel(hash)` | Idempotent "show me" - equivalent to `getPanel(hash).popup()`, null-safe |
| `shell.center(opts)` | Configure the center workspace (optionally with a `ContentDestinationId`) |
| `shell.getCenterEl()` | The center workspace element |

#### CSS class hooks

Hosts can target these classes for additional styling:

| Class | Where |
|---|---|
| `.pict-modal-shell` | Shell wrapper |
| `.pict-modal-shell-row` `-top` / `-middle` / `-bottom` | The three row containers |
| `.pict-modal-shell-side` `-left` / `-right` | The two side stacks inside the middle row |
| `.pict-modal-shell-center` | The center workspace inside the middle row |
| `.pict-modal-shell-panel` `-top` / `-right` / `-bottom` / `-left` | Each panel's root, with side modifier |
| `.pict-modal-shell-panel-mode-fixed` / `-collapsible` / `-resizable` | Mode modifier |
| `.pict-modal-shell-panel-overlay` | Set when `Position: 'overlay'` |
| `.pict-modal-shell-panel-drawer` | Set on the panel when responsive drawer mode is active |
| `.pict-modal-shell-drawer-active` | Set on the middle row when at least one panel is in drawer mode |
| `.pict-modal-shell-panel-collapsed` | Set on a panel when collapsed |
| `.pict-modal-shell-panel-content-inner` | The host's content destination div |

---

### Cleanup

```javascript
// Dismiss all modals (confirms and windows)
tmpModal.dismissModals();

// Dismiss all tooltips
tmpModal.dismissTooltips();

// Dismiss all toasts
tmpModal.dismissToasts();

// Dismiss everything
tmpModal.dismissAll();

// Full cleanup -- removes all DOM elements and event listeners
tmpModal.destroy();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ViewIdentifier` | string | `'Pict-Section-Modal'` | Unique view identifier |
| `AutoInitialize` | boolean | `true` | Automatically initialize on registration |
| `AutoRender` | boolean | `false` | Automatically render on initialization |
| `OverlayClickDismisses` | boolean | `true` | Whether clicking the backdrop dismisses the topmost modal |
| `DefaultConfirmOptions.title` | string | `'Confirm'` | Default confirm dialog title |
| `DefaultConfirmOptions.confirmLabel` | string | `'OK'` | Default confirm button text |
| `DefaultConfirmOptions.cancelLabel` | string | `'Cancel'` | Default cancel button text |
| `DefaultConfirmOptions.dangerous` | boolean | `false` | Use danger styling for the confirm button |
| `DefaultDoubleConfirmOptions.title` | string | `'Are you sure?'` | Default double-confirm title |
| `DefaultDoubleConfirmOptions.confirmPhrase` | string | `''` | Phrase the user must type (empty = two-click mode) |
| `DefaultDoubleConfirmOptions.phrasePrompt` | string | `'Type "{phrase}" to confirm:'` | Prompt shown above the input |
| `DefaultModalOptions.title` | string | `''` | Default modal window title |
| `DefaultModalOptions.content` | string | `''` | Default modal body HTML |
| `DefaultModalOptions.closeable` | boolean | `true` | Whether the modal has a close button |
| `DefaultModalOptions.width` | string | `'480px'` | Default modal width |
| `DefaultTooltipOptions.position` | string | `'top'` | Tooltip position (`top`, `bottom`, `left`, `right`) |
| `DefaultTooltipOptions.delay` | number | `200` | Milliseconds before showing tooltip |
| `DefaultTooltipOptions.maxWidth` | string | `'300px'` | Maximum tooltip width |
| `DefaultTooltipOptions.interactive` | boolean | `false` | Allow hovering over the tooltip itself |
| `DefaultToastOptions.type` | string | `'info'` | Toast type (`info`, `success`, `warning`, `error`) |
| `DefaultToastOptions.duration` | number | `3000` | Auto-dismiss delay in milliseconds (0 = manual only) |
| `DefaultToastOptions.position` | string | `'top-right'` | Screen position for the toast container |
| `DefaultToastOptions.dismissible` | boolean | `true` | Show a dismiss button on the toast |

## CSS Theming

Override any `--pict-modal-*` custom property on `.pict-modal-root` to customize the look:

```css
.pict-modal-root
{
	/* Dark theme example */
	--pict-modal-bg: #2d2d2d;
	--pict-modal-fg: #e0e0e0;
	--pict-modal-border: #444444;
	--pict-modal-header-bg: #383838;
	--pict-modal-header-fg: #ffffff;
	--pict-modal-overlay-bg: rgba(0, 0, 0, 0.7);

	--pict-modal-btn-primary-bg: #4a9eff;
	--pict-modal-btn-primary-hover-bg: #3a8eef;

	--pict-modal-toast-bg: #444444;
	--pict-modal-tooltip-bg: #555555;
}
```

## Documentation

Full documentation is available at [https://fable-retold.github.io/pict-section-modal/](https://fable-retold.github.io/pict-section-modal/)

- [Getting Started](https://fable-retold.github.io/pict-section-modal/#/Quick_Start) -- First modal dialog in five minutes
- [Architecture](https://fable-retold.github.io/pict-section-modal/#/Architecture) -- Helper class design and overlay management
- [Implementation Reference](https://fable-retold.github.io/pict-section-modal/#/Implementation_Reference) -- Complete API surface

## API Reference (Function Docs)

Detailed per-function documentation with code snippets:

| Function | Description |
|----------|-------------|
| [confirm](docs/api/confirm.md) | Show a single-step confirmation dialog |
| [doubleConfirm](docs/api/doubleConfirm.md) | Show a two-step confirmation dialog |
| [show](docs/api/show.md) | Show a custom modal window |
| [toast](docs/api/toast.md) | Show a toast notification |
| [tooltip](docs/api/tooltip.md) | Attach a simple text tooltip |
| [richTooltip](docs/api/richTooltip.md) | Attach a rich HTML tooltip |
| [dismissAll](docs/api/dismissAll.md) | Dismiss all modals, tooltips, and toasts |
| [dismissModals](docs/api/dismissModals.md) | Dismiss all open modals |
| [dismissTooltips](docs/api/dismissTooltips.md) | Dismiss all active tooltips |
| [dismissToasts](docs/api/dismissToasts.md) | Dismiss all active toasts |
| [destroy](docs/api/destroy.md) | Full cleanup of all DOM elements |

## Related Packages

- [pict](https://github.com/fable-retold/pict) -- MVC application framework
- [pict-view](https://github.com/fable-retold/pict-view) -- View base class
- [pict-section-form](https://github.com/fable-retold/pict-section-form) -- Form sections
- [fable](https://github.com/fable-retold/fable) -- Service infrastructure and dependency injection

## License

MIT

## Contributing

Pull requests are welcome. For details on our code of conduct, contribution process, and testing requirements, see the [Retold Contributing Guide](https://github.com/stevenvelozo/retold/blob/main/docs/contributing.md).
