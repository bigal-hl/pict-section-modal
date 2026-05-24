module.exports = (
{
	"AutoInitialize": true,
	"AutoRender": false,
	"AutoSolveWithApp": false,

	"ViewIdentifier": "Pict-Section-Modal",

	"OverlayClickDismisses": true,

	"DefaultConfirmOptions":
	{
		"title": "Confirm",
		"confirmLabel": "OK",
		"cancelLabel": "Cancel",
		"dangerous": false,
		"unbounded": false
	},

	"DefaultDoubleConfirmOptions":
	{
		"title": "Are you sure?",
		"confirmLabel": "Confirm",
		"cancelLabel": "Cancel",
		"phrasePrompt": "Type \"{phrase}\" to confirm:",
		"confirmPhrase": "",
		"unbounded": false
	},

	"DefaultModalOptions":
	{
		"title": "",
		"content": "",
		"buttons": [],
		"closeable": true,
		"width": "480px",
		"unbounded": false
	},

	"DefaultTooltipOptions":
	{
		"position": "top",
		"delay": 200,
		"maxWidth": "300px",
		"interactive": false
	},

	"DefaultToastOptions":
	{
		"type": "info",
		"duration": 3000,
		"position": "top-right",
		"dismissible": true
	},

	"DefaultPanelOptions":
	{
		"position": "right",
		"width": 340,
		"minWidth": 200,
		"maxWidth": 600,
		"collapsible": true,
		"collapsed": false,
		"persist": false,
		"persistKey": ""
	},

	"Templates": [],
	"Renderables": [],

	"CSS": /*css*/`
/* pict-section-modal */
.pict-modal-root
{
	/* Defaults are routed through pict-provider-theme tokens so apps
	   using the theme provider get themed modals automatically.  Each
	   var() carries its original hex as the fallback so apps that don't
	   install pict-provider-theme look exactly as before.  Apps may
	   still override any --pict-modal-* var directly to layer over the
	   theme-driven defaults. */

	/* Overlay */
	--pict-modal-overlay-bg: rgba(0, 0, 0, 0.5);

	/* Dialog */
	--pict-modal-bg:                  var(--theme-color-background-panel,  #ffffff);
	--pict-modal-fg:                  var(--theme-color-text-primary,      #1a1a1a);
	--pict-modal-border:              var(--theme-color-border-default,    #e0e0e0);
	--pict-modal-border-radius:       8px;
	--pict-modal-shadow:              0 4px 24px rgba(0, 0, 0, 0.15);
	--pict-modal-header-bg:           var(--theme-color-background-secondary, #f5f5f5);
	--pict-modal-header-fg:           var(--theme-color-text-primary,      #1a1a1a);
	--pict-modal-header-border:       var(--theme-color-border-default,    #e0e0e0);

	/* Buttons */
	--pict-modal-btn-bg:              var(--theme-color-background-secondary, #e0e0e0);
	--pict-modal-btn-fg:              var(--theme-color-text-primary,      #1a1a1a);
	--pict-modal-btn-hover-bg:        var(--theme-color-background-hover,  #d0d0d0);
	--pict-modal-btn-primary-bg:      var(--theme-color-brand-primary,     #2563eb);
	--pict-modal-btn-primary-fg:      var(--theme-color-text-on-brand,     #ffffff);
	--pict-modal-btn-primary-hover-bg:var(--theme-color-brand-primary-hover,#1d4ed8);
	--pict-modal-btn-danger-bg:       var(--theme-color-status-error,      #dc2626);
	--pict-modal-btn-danger-fg:       var(--theme-color-text-on-brand,     #ffffff);
	--pict-modal-btn-danger-hover-bg: var(--theme-color-status-error,      #b91c1c);
	--pict-modal-btn-border-radius:   4px;

	/* Toast */
	--pict-modal-toast-bg:            var(--theme-color-background-panel,  #333333);
	--pict-modal-toast-fg:            var(--theme-color-text-primary,      #ffffff);
	--pict-modal-toast-success-bg:    var(--theme-color-status-success,    #16a34a);
	--pict-modal-toast-warning-bg:    var(--theme-color-status-warning,    #d97706);
	--pict-modal-toast-error-bg:      var(--theme-color-status-error,      #dc2626);
	--pict-modal-toast-info-bg:       var(--theme-color-status-info,       #2563eb);
	--pict-modal-toast-border-radius: 6px;
	--pict-modal-toast-shadow:        0 2px 12px rgba(0, 0, 0, 0.15);

	/* Tooltip */
	--pict-modal-tooltip-bg:          var(--theme-color-background-tertiary,#1a1a1a);
	--pict-modal-tooltip-fg:          var(--theme-color-text-primary,      #ffffff);
	--pict-modal-tooltip-border-radius:4px;
	--pict-modal-tooltip-shadow:      0 2px 8px rgba(0, 0, 0, 0.15);

	/* Dropdown */
	--pict-modal-dropdown-bg:                 var(--theme-color-background-panel,  #ffffff);
	--pict-modal-dropdown-fg:                 var(--theme-color-text-primary,      #1a1a1a);
	--pict-modal-dropdown-border:             var(--theme-color-border-default,    #e0e0e0);
	--pict-modal-dropdown-border-radius:      6px;
	--pict-modal-dropdown-shadow:             0 6px 18px rgba(0, 0, 0, 0.18);
	--pict-modal-dropdown-item-hover-bg:      var(--theme-color-background-hover,  rgba(37, 99, 235, 0.10));
	--pict-modal-dropdown-item-hover-fg:      var(--theme-color-text-primary,      #1a1a1a);
	--pict-modal-dropdown-item-disabled-fg:   var(--theme-color-text-muted,        #9aa0a6);
	--pict-modal-dropdown-separator:          var(--theme-color-border-light,      #e8e8e8);
	--pict-modal-dropdown-header-fg:          var(--theme-color-text-secondary,    #6b7280);
	--pict-modal-dropdown-danger-fg:          var(--theme-color-status-error,      #dc2626);
	--pict-modal-dropdown-primary-fg:         var(--theme-color-brand-primary,     #2563eb);

	/* Typography */
	--pict-modal-font-family:         var(--theme-typography-family-sans,  system-ui, -apple-system, sans-serif);
	--pict-modal-font-size:           14px;
	--pict-modal-title-font-size:     16px;

	/* Animation */
	--pict-modal-transition-duration: 200ms;
}

/* Overlay */
.pict-modal-overlay
{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
	background: var(--pict-modal-overlay-bg);
	opacity: 0;
	transition: opacity var(--pict-modal-transition-duration) ease;
}

.pict-modal-overlay.pict-modal-visible
{
	opacity: 1;
}

/* Dialog */
.pict-modal-dialog
{
	position: fixed;
	z-index: 1010;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) translateY(-20px);
	opacity: 0;
	transition: opacity var(--pict-modal-transition-duration) ease,
	            transform var(--pict-modal-transition-duration) ease;

	max-width: 90vw;
	max-height: 90vh;
	display: flex;
	flex-direction: column;

	background: var(--pict-modal-bg);
	color: var(--pict-modal-fg);
	border: 1px solid var(--pict-modal-border);
	border-radius: var(--pict-modal-border-radius);
	box-shadow: var(--pict-modal-shadow);
	font-family: var(--pict-modal-font-family);
	font-size: var(--pict-modal-font-size);
}

.pict-modal-dialog.pict-modal-visible
{
	opacity: 1;
	transform: translate(-50%, -50%) translateY(0);
}

/* Unbounded modifier — lets callers opt out of the 90vh/90vw viewport cap.
   Use with caution: content taller than the viewport will push buttons
   below the fold. */
.pict-modal-dialog.pict-modal-dialog--unbounded
{
	max-height: none;
	max-width: none;
}

.pict-modal-dialog-header
{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	background: var(--pict-modal-header-bg);
	color: var(--pict-modal-header-fg);
	border-bottom: 1px solid var(--pict-modal-header-border);
	border-radius: var(--pict-modal-border-radius) var(--pict-modal-border-radius) 0 0;
}

.pict-modal-dialog-title
{
	font-size: var(--pict-modal-title-font-size);
	font-weight: 600;
}

.pict-modal-dialog-close
{
	background: none;
	border: none;
	font-size: 20px;
	cursor: pointer;
	color: var(--pict-modal-fg);
	padding: 0 4px;
	line-height: 1;
	opacity: 0.6;
}

.pict-modal-dialog-close:hover
{
	opacity: 1;
}

.pict-modal-dialog-body
{
	padding: 16px;
	overflow-y: auto;
	flex: 1;
}

.pict-modal-dialog-footer
{
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	padding: 12px 16px;
	border-top: 1px solid var(--pict-modal-border);
}

/* Buttons */
.pict-modal-btn
{
	padding: 8px 16px;
	border: none;
	border-radius: var(--pict-modal-btn-border-radius);
	font-family: var(--pict-modal-font-family);
	font-size: var(--pict-modal-font-size);
	cursor: pointer;
	background: var(--pict-modal-btn-bg);
	color: var(--pict-modal-btn-fg);
	transition: background var(--pict-modal-transition-duration) ease;
}

.pict-modal-btn:hover
{
	background: var(--pict-modal-btn-hover-bg);
}

.pict-modal-btn:disabled
{
	opacity: 0.5;
	cursor: not-allowed;
}

.pict-modal-btn--primary
{
	background: var(--pict-modal-btn-primary-bg);
	color: var(--pict-modal-btn-primary-fg);
}

.pict-modal-btn--primary:hover
{
	background: var(--pict-modal-btn-primary-hover-bg);
}

.pict-modal-btn--danger
{
	background: var(--pict-modal-btn-danger-bg);
	color: var(--pict-modal-btn-danger-fg);
}

.pict-modal-btn--danger:hover
{
	background: var(--pict-modal-btn-danger-hover-bg);
}

/* Double confirm input */
.pict-modal-confirm-input
{
	width: 100%;
	padding: 8px 12px;
	margin-top: 12px;
	border: 1px solid var(--pict-modal-border);
	border-radius: var(--pict-modal-btn-border-radius);
	font-family: var(--pict-modal-font-family);
	font-size: var(--pict-modal-font-size);
	box-sizing: border-box;
}

.pict-modal-confirm-input:focus
{
	outline: 2px solid var(--pict-modal-btn-primary-bg);
	outline-offset: -1px;
}

.pict-modal-confirm-prompt
{
	margin-top: 12px;
	font-size: 13px;
	color: var(--pict-modal-fg);
	opacity: 0.7;
}

/* Toast container */
.pict-modal-toast-container
{
	position: fixed;
	z-index: 1030;
	display: flex;
	flex-direction: column;
	gap: 8px;
	pointer-events: none;
	max-width: 400px;
}

.pict-modal-toast-container--top-right
{
	top: 16px;
	right: 16px;
}

.pict-modal-toast-container--top-left
{
	top: 16px;
	left: 16px;
}

.pict-modal-toast-container--bottom-right
{
	bottom: 16px;
	right: 16px;
}

.pict-modal-toast-container--bottom-left
{
	bottom: 16px;
	left: 16px;
}

.pict-modal-toast-container--top-center
{
	top: 16px;
	left: 50%;
	transform: translateX(-50%);
}

.pict-modal-toast-container--bottom-center
{
	bottom: 16px;
	left: 50%;
	transform: translateX(-50%);
}

/* Toast */
.pict-modal-toast
{
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 16px;
	border-radius: var(--pict-modal-toast-border-radius);
	box-shadow: var(--pict-modal-toast-shadow);
	font-family: var(--pict-modal-font-family);
	font-size: var(--pict-modal-font-size);
	background: var(--pict-modal-toast-bg);
	color: var(--pict-modal-toast-fg);
	pointer-events: auto;
	opacity: 0;
	transform: translateX(100%);
	transition: opacity var(--pict-modal-transition-duration) ease,
	            transform var(--pict-modal-transition-duration) ease;
}

.pict-modal-toast.pict-modal-visible
{
	opacity: 1;
	transform: translateX(0);
}

.pict-modal-toast.pict-modal-toast-exit
{
	opacity: 0;
	transform: translateX(100%);
}

.pict-modal-toast--info
{
	background: var(--pict-modal-toast-info-bg);
}

.pict-modal-toast--success
{
	background: var(--pict-modal-toast-success-bg);
}

.pict-modal-toast--warning
{
	background: var(--pict-modal-toast-warning-bg);
}

.pict-modal-toast--error
{
	background: var(--pict-modal-toast-error-bg);
}

.pict-modal-toast-message
{
	flex: 1;
}

.pict-modal-toast-dismiss
{
	background: none;
	border: none;
	color: inherit;
	font-size: 18px;
	cursor: pointer;
	padding: 0 2px;
	line-height: 1;
	opacity: 0.7;
}

.pict-modal-toast-dismiss:hover
{
	opacity: 1;
}

/* Tooltip */
.pict-modal-tooltip
{
	position: fixed;
	z-index: 1020;
	padding: 6px 10px;
	border-radius: var(--pict-modal-tooltip-border-radius);
	box-shadow: var(--pict-modal-tooltip-shadow);
	background: var(--pict-modal-tooltip-bg);
	color: var(--pict-modal-tooltip-fg);
	font-family: var(--pict-modal-font-family);
	font-size: 13px;
	pointer-events: none;
	opacity: 0;
	transition: opacity var(--pict-modal-transition-duration) ease;
	white-space: normal;
	word-wrap: break-word;
}

.pict-modal-tooltip.pict-modal-tooltip-interactive
{
	pointer-events: auto;
}

.pict-modal-tooltip.pict-modal-visible
{
	opacity: 1;
}

.pict-modal-tooltip-arrow
{
	position: absolute;
	width: 8px;
	height: 8px;
	background: var(--pict-modal-tooltip-bg);
	transform: rotate(45deg);
}

.pict-modal-tooltip--top .pict-modal-tooltip-arrow
{
	bottom: -4px;
	left: 50%;
	margin-left: -4px;
}

.pict-modal-tooltip--bottom .pict-modal-tooltip-arrow
{
	top: -4px;
	left: 50%;
	margin-left: -4px;
}

.pict-modal-tooltip--left .pict-modal-tooltip-arrow
{
	right: -4px;
	top: 50%;
	margin-top: -4px;
}

.pict-modal-tooltip--right .pict-modal-tooltip-arrow
{
	left: -4px;
	top: 50%;
	margin-top: -4px;
}

/* ── Dropdown ─────────────────────────────────────────────────────────
   Anchor-positioned menu (no overlay). Used for nav menus and
   "split button" addenda — see Pict-Modal-Dropdown.js.
*/
.pict-modal-dropdown
{
	position: fixed;
	z-index: 1025;
	min-width: 160px;
	max-width: 360px;
	max-height: 60vh;
	overflow-y: auto;
	background: var(--pict-modal-dropdown-bg);
	color: var(--pict-modal-dropdown-fg);
	border: 1px solid var(--pict-modal-dropdown-border);
	border-radius: var(--pict-modal-dropdown-border-radius);
	box-shadow: var(--pict-modal-dropdown-shadow);
	font-family: var(--pict-modal-font-family);
	font-size: var(--pict-modal-font-size);
	padding: 4px 0;
	opacity: 0;
	transform: translateY(-4px);
	transition: opacity var(--pict-modal-transition-duration) ease,
	            transform var(--pict-modal-transition-duration) ease;
}

.pict-modal-dropdown.pict-modal-dropdown--above { transform: translateY(4px); }

.pict-modal-dropdown.pict-modal-visible
{
	opacity: 1;
	transform: translateY(0);
}

.pict-modal-dropdown-item
{
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 7px 14px;
	cursor: pointer;
	user-select: none;
	color: inherit;
	outline: none;
}

.pict-modal-dropdown-item:hover,
.pict-modal-dropdown-item:focus
{
	background: var(--pict-modal-dropdown-item-hover-bg);
	color: var(--pict-modal-dropdown-item-hover-fg);
}

.pict-modal-dropdown-item--disabled
{
	cursor: not-allowed;
	color: var(--pict-modal-dropdown-item-disabled-fg);
}

.pict-modal-dropdown-item--disabled:hover,
.pict-modal-dropdown-item--disabled:focus
{
	background: transparent;
	color: var(--pict-modal-dropdown-item-disabled-fg);
}

.pict-modal-dropdown-item--primary { color: var(--pict-modal-dropdown-primary-fg); }
.pict-modal-dropdown-item--danger  { color: var(--pict-modal-dropdown-danger-fg); }

.pict-modal-dropdown-item-icon
{
	flex: 0 0 auto;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
}

.pict-modal-dropdown-item-icon svg { width: 100%; height: 100%; display: block; }

.pict-modal-dropdown-item-label { flex: 1 1 auto; min-width: 0; }

.pict-modal-dropdown-item-hint
{
	flex: 0 0 auto;
	font-size: 11px;
	opacity: 0.6;
	margin-left: 12px;
}

.pict-modal-dropdown-separator
{
	height: 1px;
	background: var(--pict-modal-dropdown-separator);
	margin: 4px 0;
}

.pict-modal-dropdown-header
{
	padding: 6px 14px 2px;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: var(--pict-modal-dropdown-header-fg);
}

/* ── Resizable / Collapsible Panels ──────────────── */
.pict-panel
{
	position: relative;
	transition: width 0.2s ease;
	flex-shrink: 0;
	overflow: visible;
}
.pict-panel-collapsed
{
	width: 0 !important;
	min-width: 0 !important;
	overflow: visible;
}
.pict-panel-collapsed > *:not(.pict-panel-edge)
{
	display: none;
}

/* Edge container — zero-width flex sibling of the panel.
   Sits next to the panel in the flex layout; children
   use absolute positioning to overlap the panel boundary. */
.pict-panel-edge
{
	position: relative;
	width: 0;
	flex-shrink: 0;
	z-index: 50;
	overflow: visible;
}

/* Resize handle — thin strip on the panel boundary */
.pict-panel-resize
{
	position: absolute;
	top: 0;
	bottom: 0;
	width: 4px;
	cursor: col-resize;
	background: transparent;
	transition: background 0.15s, width 0.15s;
}
.pict-panel-edge-right .pict-panel-resize
{
	right: 0;
	border-right: 1px solid var(--pict-panel-border, #DDD6CA);
}
.pict-panel-edge-left .pict-panel-resize
{
	left: 0;
	border-left: 1px solid var(--pict-panel-border, #DDD6CA);
}
.pict-panel-resize:hover,
.pict-panel-edge:hover .pict-panel-resize
{
	width: 5px;
	background: var(--pict-panel-accent, #2E7D74);
	opacity: 0.5;
}
.pict-panel-resize.dragging
{
	width: 5px;
	background: var(--pict-panel-accent, #2E7D74);
	opacity: 1;
	transition: none;
}
.pict-panel-edge-collapsed .pict-panel-resize
{
	display: none;
}

/* Collapse tab — tucked sliver at rest, slides out on hover */
.pict-panel-tab
{
	position: absolute;
	top: 8px;
	width: 8px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background: var(--pict-panel-border, #DDD6CA);
	border: 1px solid var(--pict-panel-border, #DDD6CA);
	cursor: pointer;
	color: var(--pict-panel-fg, #8A7F72);
	font-size: 10px;
	line-height: 1;
	opacity: 0.5;
	transition: opacity 0.25s, width 0.2s ease, height 0.2s ease, left 0.2s ease, right 0.2s ease, background 0.2s;
	z-index: 51;
}
.pict-panel-edge:hover .pict-panel-tab,
.pict-panel-tab:hover
{
	width: 20px;
	height: 32px;
	opacity: 1;
	overflow: visible;
	background: var(--pict-panel-bg, #FAF8F4);
}
/* Right panel: tab to the left of the edge */
.pict-panel-edge-right .pict-panel-tab
{
	right: 0;
	border-right: none;
	border-radius: 4px 0 0 4px;
}
.pict-panel-edge-right:hover .pict-panel-tab,
.pict-panel-edge-right .pict-panel-tab:hover
{
	right: 0;
}
/* Left panel: tab to the right of the edge */
.pict-panel-edge-left .pict-panel-tab
{
	left: 0;
	border-left: none;
	border-radius: 0 4px 4px 0;
}
.pict-panel-edge-left:hover .pict-panel-tab,
.pict-panel-edge-left .pict-panel-tab:hover
{
	left: 0;
}
/* When collapsed — more visible */
.pict-panel-edge-collapsed .pict-panel-tab
{
	width: 10px;
	height: 28px;
	opacity: 0.6;
}
.pict-panel-edge-collapsed .pict-panel-tab:hover,
.pict-panel-edge-collapsed:hover .pict-panel-tab
{
	width: 20px;
	height: 32px;
	opacity: 1;
	overflow: visible;
	background: var(--pict-panel-bg, #FAF8F4);
}

/* ───────────────────────────────────────────────────────────────────
 *  Pict-Modal-Shell — viewport-managing layout for top / right /
 *  bottom / left panels around a center.
 * ───────────────────────────────────────────────────────────────── */

.pict-modal-shell-host { display: block; height: 100%; min-height: 0; }
.pict-modal-shell
{
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	min-height: 0;
	position: relative;
	color: var(--pict-modal-fg, var(--theme-color-text-primary, #1a1a1a));
	background: var(--theme-color-background-primary, transparent);
}
.pict-modal-shell-row { display: flex; min-width: 0; min-height: 0; }
/* "First added = at the edge" convention is held by reversing the
   flex-direction on the bottom row + right side. That way, for ALL
   four sides, calling addPanel() N times stacks panel #1 against
   the viewport edge, panel #2 just inside it, panel #3 further in,
   and so on. Without these reverses, top + left worked that way but
   bottom + right inverted (first-added at content side, last-added
   at edge), which surprised callers. */
.pict-modal-shell-row-top    { flex: 0 0 auto; flex-direction: column; }
.pict-modal-shell-row-bottom { flex: 0 0 auto; flex-direction: column-reverse; }
.pict-modal-shell-row-middle
{
	flex: 1 1 0;
	flex-direction: row;
	min-height: 0;
	position: relative;
}
.pict-modal-shell-side
{
	display: flex;
	flex: 0 0 auto;
	min-height: 0;
}
.pict-modal-shell-side-left  { flex-direction: row; }
.pict-modal-shell-side-right { flex-direction: row-reverse; }
.pict-modal-shell-center
{
	flex: 1 1 0;
	min-width: 0;
	min-height: 0;
	overflow: auto;
	position: relative;
}
.pict-modal-shell-center-content
{
	min-height: 100%;
}
/* Center column gains this class when at least one Scope:'center'
   panel is added.  The center stops scrolling internally — that job
   moves to the content destination — and switches to a vertical flex
   so the destination and any inner panels stack cleanly. */
.pict-modal-shell-center.pict-modal-shell-center-with-inner-panel
{
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.pict-modal-shell-center.pict-modal-shell-center-with-inner-panel > .pict-modal-shell-center-content
{
	flex: 1 1 0;
	min-height: 0;
	overflow: auto;
}
.pict-modal-shell-center.pict-modal-shell-center-with-inner-panel > .pict-modal-shell-panel
{
	flex: 0 0 auto;
	width: 100%;
}

/* Panels — base */
.pict-modal-shell-panel
{
	/* How far the collapse-tab's panel-bg "merge bar" extends INTO
	   the panel past the tab's geometric edge. Painted via box-shadow
	   on the tab (no DOM impact), it masks any 1px theme border on an
	   inner element, content padding offset, or resize-handle hover
	   bleed in the strip between the tab's panel-facing edge and the
	   first real pixel of panel content. Consumers can bump this for
	   themes with thicker (2+px) inner borders. */
	--pict-modal-collapse-tab-merge: 2px;
	position: relative;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	background: var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff));
	color: inherit;
	min-width: 0;
	min-height: 0;
	transition: width 140ms ease, height 140ms ease;
}
.pict-modal-shell-panel-content
{
	flex: 1 1 auto;
	min-width: 0;
	min-height: 0;
	overflow: auto;
}
/* Fixed-mode panels are pure chrome (topbars, status rows). Their
   content should fit the configured Size exactly — never scroll. The
   1px border that .pict-modal-shell-panel-mode-fixed adds on the
   inner edge shaves 1px off the content's available height, which
   then triggers a sliver-scrollbar on any inner widget with
   min-height matching the panel Size. overflow:hidden here suppresses
   that without affecting resizable/collapsible panels (sidebars,
   drawers) where scrollable content is the whole point. */
.pict-modal-shell-panel-mode-fixed > .pict-modal-shell-panel-content
{
	overflow: hidden;
}
.pict-modal-shell-panel-content-inner
{
	min-height: 100%;
}
/* Panel boundary — fixed-mode panels get a hairline border for explicit
   demarcation. Collapsible / resizable panels DROP the boundary border
   (background contrast separates them from the center anyway) so the
   collapse tab can pull out cleanly without a hairline cutting across
   it. The host stylesheet still gets full control via the panel's own
   background. */
.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-top    { border-bottom: 1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }
.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-bottom { border-top:    1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }
.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-left   { border-right:  1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }
.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-right  { border-left:   1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }

/* Resize handle — absolute on the inner edge of each panel. */
.pict-modal-shell-panel-resize-handle
{
	position: absolute;
	background: transparent;
	z-index: 5;
	transition: background-color 120ms ease;
}
/* Resize handle hover — use the active brand's mode-aware primary
   color (set by pict-section-theme's Brand provider as
   --brand-color-primary-mode) so the resize affordance picks up the
   app's wordmark color. Falls back to the theme's brand-primary
   token if no brand is registered. */
.pict-modal-shell-panel-resize-handle:hover
{
	background: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	opacity: 0.4;
}
.pict-modal-shell-panel-left   .pict-modal-shell-panel-resize-handle { right: -3px; top: 0; bottom: 0; width: 6px; cursor: col-resize; }
.pict-modal-shell-panel-right  .pict-modal-shell-panel-resize-handle { left:  -3px; top: 0; bottom: 0; width: 6px; cursor: col-resize; }
.pict-modal-shell-panel-top    .pict-modal-shell-panel-resize-handle { bottom:-3px; left: 0; right: 0; height: 6px; cursor: row-resize; }
.pict-modal-shell-panel-bottom .pict-modal-shell-panel-resize-handle { top:   -3px; left: 0; right: 0; height: 6px; cursor: row-resize; }

/* Collapse tab — slim sliver flush on the panel's OUTER boundary
   (where the resize handle sits), modelled on retold-content-system's
   sidebar tab. At rest it's a 6×28 px sliver; hover expands to
   18×36 px without overlapping the panel's own content. The tab is
   positioned with its center on the boundary so half pokes into the
   adjacent area — the only place we can safely take over without
   stepping on app UI inside the panel. Title text only renders in the
   collapsed state where there's room for it. */
.pict-modal-shell-panel-collapse-tab
{
	position: absolute;
	display: flex;            /* not inline-flex — avoids baseline alignment quirks */
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border: 1px solid var(--pict-modal-border, var(--theme-color-border-default, #d0d7de));
	background: var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff));
	color: var(--theme-color-text-muted, #6b7280);
	font: inherit;
	font-size: 10px;
	letter-spacing: 0.4px;
	text-transform: uppercase;
	cursor: pointer;
	z-index: 50;
	opacity: 0.55;
	padding: 0;
	box-sizing: border-box;
	line-height: 0;          /* keep child boxes from inflating around the rotated chevron */
	/* Geometry (width/height/right/left) is intentionally NOT animated.
	   Sliding the tab's outer edge inward on hover-out makes it look like
	   the tab is "sliding into" the panel content — weird visual.
	   Snapping the size change instead, and animating only the appearance
	   (opacity/color/shadow), gives a clean fade-in/out with no boundary
	   weirdness. */
	transition: opacity 160ms ease,
	            background-color 160ms ease, color 160ms ease,
	            border-color 160ms ease, box-shadow 160ms ease;
}
/* Hover state pulls accent color from the active brand (mode-aware,
   so it's legible in both light + dark) with theme brand-primary as
   fallback. The whole point of brand colors is that they show up
   across the app's chrome. */
.pict-modal-shell-panel-collapse-tab:hover,
.pict-modal-shell-panel:hover > .pict-modal-shell-panel-collapse-tab
{
	opacity: 1;
	color:        var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	border-color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
}
/* Drop shadow casts AWAY from the panel so the tab feels pulled out
   (extension of the panel) rather than floating across the boundary.
   The tab itself is now positioned fully OUTSIDE the panel boundary
   (see the per-side rules below), so we don't need a merge-bar shadow
   to mask any in-panel overlap — only the drop shadow remains. */
.pict-modal-shell-panel-left:hover    > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-left    > .pict-modal-shell-panel-collapse-tab:hover
{
	box-shadow: 3px 0 6px -2px rgba(0, 0, 0, 0.18);
}
.pict-modal-shell-panel-right:hover   > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-right   > .pict-modal-shell-panel-collapse-tab:hover
{
	box-shadow: -3px 0 6px -2px rgba(0, 0, 0, 0.18);
}
.pict-modal-shell-panel-top:hover     > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-top     > .pict-modal-shell-panel-collapse-tab:hover
{
	box-shadow: 0 3px 6px -2px rgba(0, 0, 0, 0.18);
}
.pict-modal-shell-panel-bottom:hover  > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-bottom  > .pict-modal-shell-panel-collapse-tab:hover
{
	box-shadow: 0 -3px 6px -2px rgba(0, 0, 0, 0.18);
}

/* Per-side base positioning — the tab lives entirely OUTSIDE the
   panel's outer boundary.  Its panel-facing edge touches the boundary
   (offset = -tabThickness) and the rest of the tab pokes out into the
   adjacent area (center / sibling panel).  Border on the panel-facing
   edge is dropped so the tab looks attached to the panel rather than
   floating beside it.
   Why fully-outside?  Earlier iterations had the tab straddling the
   boundary (1px inside + 4px outside) with a panel-bg-colored merge-bar
   masking the in-panel half — that worked geometrically but visually
   read as "tab pinned into the panel," and any rendering inside the
   panel (especially custom borders or hover bleeds) could clip against
   the in-panel half.  Fully-external positioning eliminates the overlap
   class of bugs and lets the tab live entirely in the adjacent area
   where there's no app content to step on. */
.pict-modal-shell-panel-left  > .pict-modal-shell-panel-collapse-tab
{
	right: -6px; top: 14px; width: 6px; height: 28px;
	border-radius: 0 4px 4px 0;
	border-left: 0;
}
.pict-modal-shell-panel-right > .pict-modal-shell-panel-collapse-tab
{
	left:  -6px; top: 14px; width: 6px; height: 28px;
	border-radius: 4px 0 0 4px;
	border-right: 0;
}
.pict-modal-shell-panel-top    > .pict-modal-shell-panel-collapse-tab
{
	bottom: -6px; right: 14px; width: 28px; height: 6px;
	border-radius: 0 0 4px 4px;
	border-top: 0;
}
.pict-modal-shell-panel-bottom > .pict-modal-shell-panel-collapse-tab
{
	top:    -6px; right: 14px; width: 28px; height: 6px;
	border-radius: 4px 4px 0 0;
	border-bottom: 0;
}

/* Hover: tab grows OUTWARD into the adjacent area.  The panel-facing
   edge stays glued to the boundary (offset = -tabThickness), so the
   tab still looks attached on hover — only its outer dimension grows.
   For side panels the height also grows (28 → 36) downward; for top
   /bottom panels the width grows (28 → 36) — see the next block for
   the perpendicular-axis offsets. */
.pict-modal-shell-panel-left:hover  > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-left  > .pict-modal-shell-panel-collapse-tab:hover
{
	width: 18px; height: 36px; right: -18px;
}
.pict-modal-shell-panel-right:hover > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-right > .pict-modal-shell-panel-collapse-tab:hover
{
	width: 18px; height: 36px; left: -18px;
}
.pict-modal-shell-panel-top:hover    > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-top    > .pict-modal-shell-panel-collapse-tab:hover
{
	width: 36px; height: 18px; bottom: -18px;
}
.pict-modal-shell-panel-bottom:hover > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-bottom > .pict-modal-shell-panel-collapse-tab:hover
{
	width: 36px; height: 18px; top: -18px;
}

.pict-modal-shell-panel-collapse-tab-title { display: none; white-space: nowrap; }

/* Auto-generated chevron glyph inside the tab — only visible once the
   tab is wide / tall enough to show it (i.e. hover state, or when the
   panel is collapsed). Direction follows side + state.
   Sized 5×5 (down from 6) so even with rotation the visual stays
   well clear of the tab's overflow:hidden bounds at 18×36 hover and
   the 24px collapsed tab strip width. flex-shrink:0 ensures the
   pseudo never collapses to zero in tight tab dimensions. */
.pict-modal-shell-panel-collapse-tab::before
{
	content: '';
	display: block;
	width: 5px; height: 5px;
	flex-shrink: 0;
	opacity: 0;
	border-right: 1.5px solid currentColor;
	border-bottom: 1.5px solid currentColor;
	transform: rotate(135deg);
	transform-origin: center center;
	transition: opacity 160ms ease, transform 160ms ease;
}
.pict-modal-shell-panel:hover > .pict-modal-shell-panel-collapse-tab::before,
.pict-modal-shell-panel-collapse-tab:hover::before,
.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab::before
{
	opacity: 1;
}
.pict-modal-shell-panel-right                                       > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-45deg); }
.pict-modal-shell-panel-top                                         > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-135deg); }
.pict-modal-shell-panel-bottom                                      > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(45deg); }
.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed       > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-45deg); }
.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed      > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(135deg); }
.pict-modal-shell-panel-top.pict-modal-shell-panel-collapsed        > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(45deg); }
.pict-modal-shell-panel-bottom.pict-modal-shell-panel-collapsed     > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-135deg); }

/* Collapsed state — content disappears, only the collapse tab remains. */
.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-content
{
	display: none;
}
.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-resize-handle
{
	display: none;
}
.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed,
.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed
{
	/* When collapsed, side panels rotate the title for vertical reading. */
	overflow: hidden;
}
/* When collapsed: the entire panel becomes the tab strip — full width
   for sides, full height for top/bottom — with the title visible
   vertically (sides) or horizontally (top/bottom). The little sliver
   tab on the boundary disappears (we don't need it anymore — clicking
   anywhere on the panel toggles it back open). */
.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed,
.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed,
.pict-modal-shell-panel-top.pict-modal-shell-panel-collapsed,
.pict-modal-shell-panel-bottom.pict-modal-shell-panel-collapsed
{
	overflow: hidden;
}
.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab
{
	/* Promote the tab to FILL the collapsed panel (not just hug its
	   content) so the centered chevron + title group sits in the middle
	   of the panel. Without explicit width/height: 100%, the position:
	   absolute element shrinks to its natural content size and the
	   group ends up flush at the top of the panel — where the chevron
	   gets clipped by the topbar. */
	position: absolute !important;
	top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important;
	width: 100% !important;
	height: 100% !important;
	border: 0;
	border-radius: 0;
	background: transparent;
	opacity: 0.85;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 12px 4px;        /* keeps chevron + title clear of edges */
	box-shadow: none;
	color: var(--theme-color-text-muted, #6b7280);
	box-sizing: border-box;
	overflow: hidden;
}
.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab:hover
{
	background: var(--theme-color-background-hover, var(--pict-modal-bg, #fff));
	color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	box-shadow: none;
}
/* Side panels (collapsed): rotate the title for vertical reading. */
.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed   > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed  > .pict-modal-shell-panel-collapse-tab
{
	writing-mode: vertical-rl;
	text-orientation: mixed;
}
.pict-modal-shell-panel-collapsed .pict-modal-shell-panel-collapse-tab-title
{
	display: inline;
}

/* Hidden panels — when Hidden:true is passed to addPanel, the collapsed
   state has zero footprint: no collapse tab (the tab is never built),
   the panel root is display:none, and the resize handle vanishes. The
   only path to the open state is a programmatic expand()/toggle() from
   somewhere else in the app (e.g. a topbar gear button). When expanded,
   the panel renders normally — so resize/drag handles continue to work
   while the panel is open. */
.pict-modal-shell-panel-hidden.pict-modal-shell-panel-collapsed
{
	display: none !important;
}

/* Overlay panels — float over the middle row instead of taking layout
   space. The overlay layer is positioned absolutely inside the middle
   row; individual overlay panels stack with positive z-index. */
.pict-modal-shell-overlay-layer
{
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 10;
}
.pict-modal-shell-overlay-layer .pict-modal-shell-panel
{
	pointer-events: auto;
	position: absolute;
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
}
.pict-modal-shell-overlay-layer .pict-modal-shell-panel-left   { left:   0; top: 0; bottom: 0; }
.pict-modal-shell-overlay-layer .pict-modal-shell-panel-right  { right:  0; top: 0; bottom: 0; }
.pict-modal-shell-overlay-layer .pict-modal-shell-panel-top    { top:    0; left: 0; right: 0; }
.pict-modal-shell-overlay-layer .pict-modal-shell-panel-bottom { bottom: 0; left: 0; right: 0; }

/* ─────────────────────────────────────────────────────────────────
   Responsive drawer mode — .pict-modal-shell-drawer-active toggles
   onto the middle row when any panel with ResponsiveDrawer crosses
   below its breakpoint. Flips the row's flex-direction from row to
   column, stacking side panels above the center and stretching them
   to full width. Each opted-in panel itself gets the
   .pict-modal-shell-panel-drawer class so per-panel rules below
   target only the drawer-mode panels (right + non-drawer panels in
   the same row are unaffected). The drawer height is read from a
   per-panel --pict-modal-drawer-height CSS variable (default
   33vh, set in JS from the DrawerHeight option).
   ───────────────────────────────────────────────────────────────── */
.pict-modal-shell-row-middle.pict-modal-shell-drawer-active
{
	flex-direction: column;
	/* The drawer tab lives outside the drawer's bottom edge — ancestor
	   chain MUST allow it to escape clip. */
	overflow: visible;
}
.pict-modal-shell-row-middle.pict-modal-shell-drawer-active .pict-modal-shell-side
{
	/* Side stacks stretch full-width and lay out their panels as a
	   horizontal row of stacked drawers (so two drawers from the same
	   side don't end up overlapping). overflow: visible so the
	   per-panel tab can extend below the side stack into the workspace. */
	width: 100% !important;
	flex-direction: column;
	overflow: visible;
}
/* The drawer-tagged panel itself: kill the inline width set by
   _applySize (we override with !important since the inline style has
   higher specificity than a class selector), then size by height
   from the CSS variable. Resize handle is hidden in drawer mode
   because horizontal dragging doesn't translate to vertical sizing
   and the user already has the collapse tab to dismiss / restore.

   padding-bottom reserves an 18px strip at the bottom of the panel
   for the tab. The tab sits INSIDE the drawer's footprint — never
   below it — so the workspace header below the drawer is never in
   the same vertical band as the tab. (Previously the tab hung
   below the drawer's bottom edge into the workspace's top padding;
   that made the tab visually compete with the workspace header,
   even when the tab box-model bounds technically cleared the
   header.) box-sizing: border-box so the padding eats from the
   33vh, not adding to it. */
.pict-modal-shell-panel-drawer
{
	width: 100% !important;
	max-width: 100% !important;
	height: var(--pict-modal-drawer-height, 33vh);
	transition: height 140ms ease;
	padding-bottom: 18px;
	box-sizing: border-box;
	overflow: visible !important;
	/* Clip the panel bg to its CONTENT area only — the 18px
	   padding-bottom reserve (where the tab lives) becomes
	   transparent, so the middle row's primary background shows
	   through. Without this the reserve would render with the
	   panel's chrome bg, creating a visible "strip" between the
	   drawer content above and the workspace below — the tab would
	   look like it's sitting on its own miscoloured band rather
	   than at the seam between drawer and workspace. */
	background-clip: content-box;
}
.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed
{
	/* Collapsed = "just the tab strip is visible". 18px matches the
	   panel's tab reserve so the height is consistent across states.
	   When this is 0 the tab would have nowhere to render and the
	   user couldn't reopen the drawer. */
	height: 18px !important;
	padding-bottom: 0 !important;
	/* Drop the panel's bg in collapsed state — without this the 18px
	   strip shows the --pict-modal-bg (panel chrome) which doesn't
	   match the workspace --theme-color-background-primary below it,
	   creating a visible "drawer band" around the tab that breaks the
	   illusion of the tab belonging to the workspace area. With
	   transparent bg the middle row's primary background shows
	   through, the strip blends with the workspace, and the tab pill
	   reads as a free-floating handle. */
	background: transparent !important;
}
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-resize-handle
{
	display: none;
}
/* The drawer's collapse tab is a horizontal pill protruding from the
   bottom of the drawer (rather than the inner edge of a side panel).
   Override the side-panel positioning rules from above so the tab
   always sits at the drawer's bottom-center seam, in both expanded
   and collapsed states. The expand-from-zero affordance: when
   collapsed (height: 0), the tab still hangs below "where the
   drawer would be" — a small handle the user can click to pull
   the drawer back down. */
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab
{
	position: absolute !important;
	/* Anchored to the panel's BOTTOM edge — the tab lives INSIDE the
	   drawer's footprint (in the 18px reserve at the bottom), never
	   below it into the workspace. This means the workspace below
	   the drawer is never sharing a vertical band with the tab, so
	   the workspace header doesn't optically compete with it.
	   bottom: 4px aligns the tab's top edge exactly with the panel's
	   CONTENT-AREA bottom (panel.height − padding-bottom 18px). With
	   border-top: 0 on the tab, the seam between the drawer content
	   above and the tab body is invisible — they share --pict-modal-bg
	   and merge into one shape, the tab reading as a labelled
	   extension of the drawer hanging downward. Collapsed state
	   keeps the smaller offset (overridden below) because its panel
	   has no padding-bottom, so the math doesn't apply. */
	top: auto !important;
	bottom: 4px !important;
	left: 50% !important;
	right: auto !important;
	transform: translate(-50%, 0) !important;
	width: 64px !important;
	height: 14px !important;
	/* CRITICAL: border-box + padding: 0 — the collapsed-state base
	   rule inherits "padding: 12px 4px" (so the chevron clears the
	   edges of a tab that fills a 24px-wide side strip). In drawer
	   mode the tab is a 14px tall pill, NOT a strip-fill, so that
	   12px vertical padding would balloon the tab's outer height to
	   ~38px and crash into the workspace header text. The chevron
	   is centered via flex anyway. */
	box-sizing: border-box !important;
	padding: 0 !important;
	/* Rounded BOTTOM corners + no top border — the tab looks like a
	   traditional drawer-handle/tab hanging from above. Its rounded
	   bottom curves face the workspace (the "open downward" affordance
	   for a top drawer). border-top: 0 lets the tab visually merge
	   with whatever's directly above it inside the panel (sidebar
	   content when expanded, the panel background when collapsed). */
	border-radius: 0 0 8px 8px;
	border: 1px solid var(--pict-modal-border, var(--theme-color-border-default, #cfd5dd));
	border-top: 0;
	background: var(--pict-modal-bg, var(--theme-color-background-panel, #fff));
	opacity: 0.95;
	z-index: 20;
	/* The default side-panel hover-grow values would yank the tab off
	   to the wrong spot in drawer mode — neutralise. */
	display: flex;
	align-items: center;
	justify-content: center;
}
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab:hover,
.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab:hover
{
	opacity: 1;
	width: 96px !important;
	/* height stays at 14px — the tab is anchored with bottom, so any
	   height growth would push the tab's TOP edge UPWARD past the
	   space available above it. In EXPANDED state that crashes into
	   the drawer content above; in COLLAPSED state it crashes into
	   the topbar's brand stripes. Width-only growth (64 to 96, +50%)
	   still gives the "tab is reaching toward me" affordance without
	   the encroachment. */
	color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	border-color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	box-shadow: 0 3px 6px -2px rgba(0, 0, 0, 0.18);
}
/* Collapsed-state bottom-offset override. Expanded panels have an
   18px padding-bottom reserve, and "bottom: 4px" anchors the tab's
   top edge exactly at the content-area boundary (so it merges
   visually with the drawer above). Collapsed panels have
   padding-bottom: 0 and a total height of 18px — "bottom: 4px"
   there would put the tab's top at the panel's actual top edge,
   crashing the (border-top: 0) tab into the topbar. The smaller
   "bottom: 2px" keeps the 14px tab vertically centered in the 18px
   strip with 2px margins on either side. */
.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab
{
	bottom: 2px !important;
}
/* Chevron inside the tab: point UP when expanded (the drawer
   collapses UP / out of view, so the arrow indicates "click me to
   send the drawer up"), DOWN when collapsed (the drawer expands DOWN
   into view). Rotations come from the existing top-panel chevron
   table: rotate(-135deg) → UP arrow, rotate(45deg) → DOWN arrow. */
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab::before
{
	transform: rotate(-135deg) !important;
}
.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab::before
{
	transform: rotate(45deg) !important;
}
/* The collapse tab's existing title-text span is hidden when reduced
   to a pill — there's no horizontal room. The chevron alone reads
   correctly. */
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab .pict-modal-shell-panel-collapse-tab-title,
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab .pict-modal-shell-panel-collapse-tab-icon
{
	display: none;
}

/* Drag-active state — disable text selection + change cursor globally
   so resize feels solid even when the cursor briefly leaves the handle. */
.pict-modal-shell-dragging-x, .pict-modal-shell-dragging-y { user-select: none; }
.pict-modal-shell-dragging-x * { cursor: col-resize !important; }
.pict-modal-shell-dragging-y * { cursor: row-resize !important; }

/* Per-panel resize-active state — kills the panel's collapse/expand
   width/height transition for the duration of a drag. Without this,
   every pointermove starts a fresh 140 ms transition and the resize
   visibly lags behind the cursor ("choppy"). With it disabled the
   panel snaps to the new size on the same frame as the pointer, which
   feels native. */
.pict-modal-shell-panel-resizing { transition: none !important; }
.pict-modal-shell-panel-resizing > .pict-modal-shell-panel-resize-handle
{
	background: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	opacity: 0.5;
}

/* Panel popup-attention flash — fires when popup() is called on an
   already-open panel. Brief brand-colored inset glow so the user sees
   that their click landed even though the panel didn't change shape.
   Class is added by the shell, auto-removed after ~700 ms. */
@keyframes pict-modal-shell-panel-flash
{
	0%   { box-shadow: inset 0 0 0 0 transparent; }
	30%  { box-shadow: inset 0 0 0 3px var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb)); }
	100% { box-shadow: inset 0 0 0 0 transparent; }
}
.pict-modal-shell-panel-flash
{
	animation: pict-modal-shell-panel-flash 600ms ease-out;
}
`
});
