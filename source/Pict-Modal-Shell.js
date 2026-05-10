/**
 * Pict-Modal-Shell — viewport-managing layout system for top / right /
 * bottom / left panels around a center.
 *
 * # What this is for
 *
 * Most apps grow a chrome of stacked bars: a topbar, sometimes a
 * sub-nav, sometimes a bottom status bar, often a left sidebar, maybe
 * a right inspector. Each one has its own collapse / resize / persist
 * concerns, and apps end up reinventing the layout glue + the chrome
 * controls per-app.
 *
 * The Shell solves this once. The host calls `modal.shell(viewport)`,
 * adds panels in the order they should stack from each edge, and the
 * Shell manages:
 *
 *   - DOM structure (a flex tree wrapping the viewport)
 *   - Layout placement (multiple panels per side, each in registration order)
 *   - Collapse / expand chrome (a thin tab strip when collapsed)
 *   - Resize chrome (drag handle on the inner edge)
 *   - Pinned (in-flow) vs overlay (absolutely-positioned) panels
 *   - Persistence (per-panel collapsed + size, scoped by host or custom key)
 *   - Center destination (the workspace area between all panels)
 *
 * # Usage
 *
 *   let tmpShell = modal.shell('#App-Container', { PersistenceKey: 'my-app' });
 *
 *   tmpShell.addPanel({
 *       Hash: 'topbar', Side: 'top', Mode: 'fixed', Size: 60,
 *       ContentDestinationId: 'App-TopBar'
 *   });
 *   tmpShell.addPanel({
 *       Hash: 'statusbar', Side: 'bottom', Mode: 'fixed', Size: 28,
 *       ContentDestinationId: 'App-StatusBar'
 *   });
 *   tmpShell.addPanel({
 *       Hash: 'sidebar', Side: 'left', Mode: 'resizable', Size: 280,
 *       MinSize: 180, MaxSize: 480, Title: 'Modules',
 *       ContentDestinationId: 'App-Sidebar'
 *   });
 *
 *   let tmpCenter = tmpShell.center({ ContentDestinationId: 'App-Workspace' });
 *
 *   // Render into the destinations the same way as any other Pict view.
 *   pict.ContentAssignment.assignContent('#App-Sidebar', tmpHTML);
 *
 * # Panel options
 *
 *   Hash:                 unique id within the shell (auto-generated if omitted).
 *                         Used as the localStorage key suffix and for getPanel().
 *   Side:                 'top' | 'right' | 'bottom' | 'left'.
 *   Mode:                 'fixed' (no chrome), 'collapsible' (collapse tab),
 *                         'resizable' (collapse tab + drag handle).
 *   Position:             'pinned' (default; takes layout space) or 'overlay'
 *                         (absolutely positioned over the center / siblings).
 *   Size:                 initial px (height for top/bottom, width for left/right).
 *                         Default: 200 for sides, 60 for top/bottom.
 *   MinSize, MaxSize:     drag clamp for resizable panels.
 *   Collapsed:            initial state. Persisted state overrides this.
 *   CollapsedSize:        px the panel becomes when collapsed (default 24).
 *   Title:                shown in the collapse tab.
 *   Icon:                 optional inline SVG / HTML for the collapse tab.
 *   ContentDestinationId: id given to the inner content div so the host can
 *                         reach it via #ContentDestinationId selectors.
 *   ContentView:          ViewIdentifier (string) of a registered Pict view
 *                         that owns this panel's content. When set, the
 *                         shell auto-renders the view once at panel creation
 *                         (so the destination is filled before the user
 *                         opens the panel) AND again on every expand
 *                         transition (so freshly-streamed state shows up).
 *                         Centralises the "I created a panel — now I have
 *                         to remember to render the view into it" boilerplate.
 *   Persist:              default true; pass false to skip save/load for this
 *                         panel even when the shell has persistence enabled.
 *   OnExpand, OnCollapse: callbacks that fire ONLY on transitions
 *                         (collapsed→expanded or expanded→collapsed).
 *                         Cleaner than OnToggle which fires for both
 *                         directions and forces callers to inspect the
 *                         bool. OnToggle is kept for back-compat.
 *
 * # Persistence
 *
 *   Storage key:  'pict-modal-shell:' + <PersistenceKey or hostname or 'default'>
 *   Value shape:  { Version: 1, Panels: { <hash>: { Collapsed: bool, Size: number } } }
 */

const STORAGE_PREFIX = 'pict-modal-shell:';
const SCHEMA_VERSION = 1;
const DEFAULT_COLLAPSED_SIZE = 24;
const DEFAULT_SIZE_SIDE = 240;
const DEFAULT_SIZE_TOPBOTTOM = 60;

class PictModalShell
{
	constructor(pModalSection, pViewportEl, pOptions)
	{
		this._modal = pModalSection;
		this._viewport = pViewportEl;
		this._options = pOptions || {};
		this._panels = [];
		this._panelsByHash = {};
		this._centerDestinationEl = null;
		this._idCounter = 0;
		this._activeDrag = null;
		this._persistenceEnabled = (this._options.Persistence !== false);
		this._persistenceKey = this._persistenceEnabled
			? this._resolvePersistenceKey(this._options.PersistenceKey)
			: null;

		// Build the wrapper DOM inside the viewport.
		this._buildSkeleton();
	}

	// ────────────────────────────────────────────────────────────────
	//  Public API
	// ────────────────────────────────────────────────────────────────

	addPanel(pConfig)
	{
		let tmpPanel = new ShellPanel(this, pConfig || {});
		this._panels.push(tmpPanel);
		this._panelsByHash[tmpPanel.Hash] = tmpPanel;
		this._mountPanel(tmpPanel);
		// Render the bound ContentView once now so the destination has
		// content even before the user opens the panel. This is the
		// "create" half of the unified create-and-popup pattern — hosts
		// no longer need to chase down each panel and call view.render()
		// manually after addPanel().
		tmpPanel._renderContentView();
		return tmpPanel;
	}

	getPanel(pHash) { return this._panelsByHash[pHash] || null; }

	getPanels() { return this._panels.slice(); }

	/**
	 * Convenience for cross-view popup triggers. Equivalent to
	 * `shell.getPanel(hash).popup()`. Silently no-ops when the hash
	 * doesn't match a registered panel (so callers don't have to
	 * null-check during boot races).
	 */
	openPanel(pHash)
	{
		let tmpPanel = this._panelsByHash[pHash];
		if (tmpPanel) { tmpPanel.popup(); }
		return tmpPanel || null;
	}

	/**
	 * Configure the center area. Optional; if never called, the center
	 * still exists but has no host-supplied destination id (host can
	 * still reach it via .pict-modal-shell-center).
	 */
	center(pOptions)
	{
		pOptions = pOptions || {};
		if (pOptions.ContentDestinationId)
		{
			let tmpInner = document.createElement('div');
			tmpInner.id = pOptions.ContentDestinationId;
			tmpInner.className = 'pict-modal-shell-center-content';
			this._centerEl.innerHTML = '';
			this._centerEl.appendChild(tmpInner);
			this._centerDestinationEl = tmpInner;
		}
		return this._centerEl;
	}

	getCenterEl() { return this._centerEl; }

	destroy()
	{
		for (let i = 0; i < this._panels.length; i++) { this._panels[i].destroy(true); }
		this._panels = [];
		this._panelsByHash = {};
		if (this._wrapperEl && this._wrapperEl.parentNode)
		{
			this._wrapperEl.parentNode.removeChild(this._wrapperEl);
		}
		this._detachDragHandlers();
	}

	// ────────────────────────────────────────────────────────────────
	//  Persistence
	// ────────────────────────────────────────────────────────────────

	_resolvePersistenceKey(pUserKey)
	{
		if (typeof pUserKey === 'string' && pUserKey.length > 0) return STORAGE_PREFIX + pUserKey;
		try
		{
			if (typeof window !== 'undefined' && window.location && window.location.hostname)
			{
				return STORAGE_PREFIX + window.location.hostname;
			}
		}
		catch (pErr) { /* fall through */ }
		return STORAGE_PREFIX + 'default';
	}

	_loadState()
	{
		if (!this._persistenceKey) return null;
		try
		{
			let tmpStore = (typeof window !== 'undefined') ? window.localStorage : null;
			if (!tmpStore) return null;
			let tmpRaw = tmpStore.getItem(this._persistenceKey);
			if (!tmpRaw) return null;
			let tmpParsed = JSON.parse(tmpRaw);
			if (!tmpParsed || tmpParsed.Version !== SCHEMA_VERSION) return null;
			return (tmpParsed.Panels && typeof tmpParsed.Panels === 'object') ? tmpParsed.Panels : {};
		}
		catch (pErr) { return null; }
	}

	_loadPanelState(pHash)
	{
		let tmpAll = this._loadState();
		if (!tmpAll) return null;
		return tmpAll[pHash] || null;
	}

	_savePanelState(pHash, pState)
	{
		if (!this._persistenceKey) return;
		try
		{
			let tmpStore = (typeof window !== 'undefined') ? window.localStorage : null;
			if (!tmpStore) return;
			let tmpAll = this._loadState() || {};
			tmpAll[pHash] = pState;
			tmpStore.setItem(this._persistenceKey, JSON.stringify(
			{
				Version: SCHEMA_VERSION,
				Panels: tmpAll,
				SavedAt: new Date().toISOString()
			}));
		}
		catch (pErr) { /* swallow */ }
	}

	// ────────────────────────────────────────────────────────────────
	//  DOM scaffolding
	// ────────────────────────────────────────────────────────────────

	_buildSkeleton()
	{
		// Wipe whatever was inside the viewport — the host opted into
		// the shell taking ownership of layout.
		this._viewport.innerHTML = '';
		this._viewport.classList.add('pict-modal-shell-host');

		this._wrapperEl = document.createElement('div');
		this._wrapperEl.className = 'pict-modal-shell';

		this._topRow = document.createElement('div');
		this._topRow.className = 'pict-modal-shell-row pict-modal-shell-row-top';
		this._wrapperEl.appendChild(this._topRow);

		this._middleRow = document.createElement('div');
		this._middleRow.className = 'pict-modal-shell-row pict-modal-shell-row-middle';
		this._wrapperEl.appendChild(this._middleRow);

		this._leftStack = document.createElement('div');
		this._leftStack.className = 'pict-modal-shell-side pict-modal-shell-side-left';
		this._middleRow.appendChild(this._leftStack);

		this._centerEl = document.createElement('div');
		this._centerEl.className = 'pict-modal-shell-center';
		this._middleRow.appendChild(this._centerEl);

		this._rightStack = document.createElement('div');
		this._rightStack.className = 'pict-modal-shell-side pict-modal-shell-side-right';
		this._middleRow.appendChild(this._rightStack);

		this._bottomRow = document.createElement('div');
		this._bottomRow.className = 'pict-modal-shell-row pict-modal-shell-row-bottom';
		this._wrapperEl.appendChild(this._bottomRow);

		// Overlay layer for overlay-position panels (absolute over middle row)
		this._overlayLayer = document.createElement('div');
		this._overlayLayer.className = 'pict-modal-shell-overlay-layer';
		this._middleRow.appendChild(this._overlayLayer);

		this._viewport.appendChild(this._wrapperEl);
	}

	_mountPanel(pPanel)
	{
		let tmpHost;
		if (pPanel.Position === 'overlay')
		{
			tmpHost = this._overlayLayer;
		}
		else if (pPanel.Side === 'top')    tmpHost = this._topRow;
		else if (pPanel.Side === 'bottom') tmpHost = this._bottomRow;
		else if (pPanel.Side === 'left')   tmpHost = this._leftStack;
		else if (pPanel.Side === 'right')  tmpHost = this._rightStack;
		else                               tmpHost = this._wrapperEl;
		tmpHost.appendChild(pPanel.El);
	}

	// ────────────────────────────────────────────────────────────────
	//  Drag (resize) machinery — shared across all resizable panels.
	// ────────────────────────────────────────────────────────────────

	_attachDragStart(pPanel, pEvent)
	{
		pEvent.preventDefault();
		let tmpAxis = (pPanel.Side === 'top' || pPanel.Side === 'bottom') ? 'y' : 'x';
		this._activeDrag =
		{
			Panel:       pPanel,
			Axis:        tmpAxis,
			StartCoord:  (tmpAxis === 'x') ? pEvent.clientX : pEvent.clientY,
			StartSize:   pPanel.Size,
			Direction:   (pPanel.Side === 'left' || pPanel.Side === 'top') ? 1 : -1,
			PendingSize: null,
			RAFId:       0
		};
		document.body.classList.add(tmpAxis === 'x' ? 'pict-modal-shell-dragging-x' : 'pict-modal-shell-dragging-y');
		// Suppress the panel's collapse/expand width/height transition for
		// the duration of the drag — without this, every pointermove kicks
		// off a fresh 140ms transition that stacks up and renders the
		// resize as visibly laggy ("choppy"). With the transition off the
		// panel snaps to each new size in the same frame as the pointer.
		pPanel.El.classList.add('pict-modal-shell-panel-resizing');
		// Capture the pointer so dragging works even when the cursor leaves
		// the resize handle (otherwise the user has to keep the cursor
		// exactly on the 6 px strip — feels twitchy).
		try { pEvent.target.setPointerCapture && pEvent.target.setPointerCapture(pEvent.pointerId); }
		catch (pErr) { /* not supported in old browsers — fine */ }
		document.addEventListener('pointermove', this._onDragMove);
		document.addEventListener('pointerup',   this._onDragEnd);
	}

	// Pointer events fire at the device's input rate (often 240 Hz+ on
	// modern trackpads / mice) but we only paint at the display's refresh
	// rate (60–120 Hz). Coalesce multiple pointermoves per frame into a
	// single setSize() call via requestAnimationFrame — this drops the
	// per-frame work to one DOM mutation regardless of pointer rate.
	_onDragMove = (pEvent) =>
	{
		if (!this._activeDrag) return;
		let tmpD = this._activeDrag;
		let tmpCoord = (tmpD.Axis === 'x') ? pEvent.clientX : pEvent.clientY;
		let tmpDelta = (tmpCoord - tmpD.StartCoord) * tmpD.Direction;
		tmpD.PendingSize = tmpD.StartSize + tmpDelta;
		if (!tmpD.RAFId)
		{
			let tmpSelf = this;
			tmpD.RAFId = (typeof window !== 'undefined' && window.requestAnimationFrame)
				? window.requestAnimationFrame(function () { tmpSelf._flushDrag(); })
				: setTimeout(function () { tmpSelf._flushDrag(); }, 16);
		}
	};

	_flushDrag()
	{
		let tmpD = this._activeDrag;
		if (!tmpD) return;
		tmpD.RAFId = 0;
		if (tmpD.PendingSize !== null)
		{
			tmpD.Panel.setSize(tmpD.PendingSize);
			tmpD.PendingSize = null;
		}
	}

	_onDragEnd = () =>
	{
		if (!this._activeDrag) return;
		let tmpD = this._activeDrag;
		// Flush any pending pointermove that hadn't painted yet so the
		// final size matches the actual cursor position, not the last
		// rAF-aligned value.
		if (tmpD.PendingSize !== null) { this._flushDrag(); }
		if (tmpD.RAFId && typeof window !== 'undefined' && window.cancelAnimationFrame)
		{
			window.cancelAnimationFrame(tmpD.RAFId);
		}
		document.body.classList.remove('pict-modal-shell-dragging-x');
		document.body.classList.remove('pict-modal-shell-dragging-y');
		tmpD.Panel.El.classList.remove('pict-modal-shell-panel-resizing');
		document.removeEventListener('pointermove', this._onDragMove);
		document.removeEventListener('pointerup',   this._onDragEnd);
		// Persist final size.
		tmpD.Panel._persist();
		this._activeDrag = null;
	};

	_detachDragHandlers()
	{
		document.removeEventListener('pointermove', this._onDragMove);
		document.removeEventListener('pointerup',   this._onDragEnd);
	}
}

// ════════════════════════════════════════════════════════════════════
//  ShellPanel — one panel within a Shell
// ════════════════════════════════════════════════════════════════════

class ShellPanel
{
	constructor(pShell, pConfig)
	{
		this._shell = pShell;
		this._config = pConfig;

		this.Hash = pConfig.Hash || ('panel-' + ++pShell._idCounter);
		this.Side = (pConfig.Side === 'right' || pConfig.Side === 'bottom' || pConfig.Side === 'left') ? pConfig.Side : 'top';
		this.Mode = (pConfig.Mode === 'collapsible' || pConfig.Mode === 'resizable') ? pConfig.Mode : 'fixed';
		this.Position = (pConfig.Position === 'overlay') ? 'overlay' : 'pinned';
		this.Title = pConfig.Title || '';
		this.Icon  = pConfig.Icon  || '';
		this.MinSize = (typeof pConfig.MinSize === 'number') ? pConfig.MinSize : 40;
		this.MaxSize = (typeof pConfig.MaxSize === 'number') ? pConfig.MaxSize : 1200;
		this.CollapsedSize = (typeof pConfig.CollapsedSize === 'number') ? pConfig.CollapsedSize : DEFAULT_COLLAPSED_SIZE;
		this.PersistEnabled = pShell._persistenceEnabled && (pConfig.Persist !== false);

		let tmpDefaultSize = (this.Side === 'left' || this.Side === 'right') ? DEFAULT_SIZE_SIDE : DEFAULT_SIZE_TOPBOTTOM;
		this.Size = (typeof pConfig.Size === 'number') ? pConfig.Size : tmpDefaultSize;
		this.Collapsed = !!pConfig.Collapsed;

		// Persisted state overrides initial Size/Collapsed.
		if (this.PersistEnabled)
		{
			let tmpSaved = pShell._loadPanelState(this.Hash);
			if (tmpSaved)
			{
				if (typeof tmpSaved.Size === 'number') this.Size = tmpSaved.Size;
				if (typeof tmpSaved.Collapsed === 'boolean') this.Collapsed = tmpSaved.Collapsed;
			}
		}
		this._clampSize();

		// Build the panel DOM.
		this._buildEl(pConfig);
		this._applySize();
		this._applyCollapsedClass();
	}

	// ───────────── public ─────────────

	getContentEl() { return this._contentEl; }

	/**
	 * Returns the currently-bound ContentView Pict view instance, or
	 * null if no ContentView is configured / the view isn't registered
	 * yet.
	 */
	getContentView()
	{
		if (!this._config.ContentView) return null;
		let tmpPict = this._shell._modal && this._shell._modal.pict;
		if (!tmpPict || !tmpPict.views) return null;
		return tmpPict.views[this._config.ContentView] || null;
	}

	collapse() { this._setCollapsed(true);  }
	expand()   { this._setCollapsed(false); }
	toggle()   { this._setCollapsed(!this.Collapsed); }

	/**
	 * Unified "show this panel" affordance — this is the shared
	 * codepath every popup trigger should funnel through. Behavior:
	 *
	 *   - If collapsed → expand (which fires OnExpand + re-renders the
	 *     ContentView via the shared transition machinery).
	 *   - If already open → re-render the ContentView (so any newly-
	 *     streamed state is visible) AND briefly flash the panel
	 *     border so the user notices that the existing panel just
	 *     received attention. Avoids the "I clicked a button but
	 *     nothing happened" feeling when the panel was already open.
	 *
	 * Idempotent — safe to call from any number of triggers without
	 * stacking effects.
	 */
	popup()
	{
		if (this.Collapsed)
		{
			this._setCollapsed(false);
		}
		else
		{
			// Already open — refresh content + flash for attention.
			this._renderContentView();
			this._flash();
		}
	}

	setSize(pSize)
	{
		if (typeof pSize !== 'number' || !isFinite(pSize)) return;
		this.Size = pSize;
		this._clampSize();
		this._applySize();
	}

	destroy(pSkipFromShell)
	{
		if (this.El && this.El.parentNode) this.El.parentNode.removeChild(this.El);
		if (!pSkipFromShell)
		{
			let tmpIdx = this._shell._panels.indexOf(this);
			if (tmpIdx >= 0) this._shell._panels.splice(tmpIdx, 1);
			delete this._shell._panelsByHash[this.Hash];
		}
	}

	// ───────────── internals ─────────────

	_clampSize()
	{
		if (this.Size < this.MinSize) this.Size = this.MinSize;
		if (this.Size > this.MaxSize) this.Size = this.MaxSize;
	}

	_buildEl(pConfig)
	{
		let tmpRoot = document.createElement('div');
		tmpRoot.className = 'pict-modal-shell-panel pict-modal-shell-panel-' + this.Side
			+ ' pict-modal-shell-panel-mode-' + this.Mode
			+ (this.Position === 'overlay' ? ' pict-modal-shell-panel-overlay' : '');
		tmpRoot.setAttribute('data-shell-panel-hash', this.Hash);
		tmpRoot.setAttribute('data-shell-panel-side', this.Side);
		tmpRoot.setAttribute('data-shell-panel-mode', this.Mode);

		// Content area — hosts render their stuff into the inner #id div.
		let tmpContentWrap = document.createElement('div');
		tmpContentWrap.className = 'pict-modal-shell-panel-content';
		this._contentEl = document.createElement('div');
		if (pConfig.ContentDestinationId)
		{
			this._contentEl.id = pConfig.ContentDestinationId;
		}
		this._contentEl.className = 'pict-modal-shell-panel-content-inner';
		tmpContentWrap.appendChild(this._contentEl);
		tmpRoot.appendChild(tmpContentWrap);

		// Collapse tab — shown when collapsible / resizable. Lives at the
		// inner edge so it's always reachable when the panel is collapsed.
		if (this.Mode === 'collapsible' || this.Mode === 'resizable')
		{
			this._collapseTab = document.createElement('button');
			this._collapseTab.type = 'button';
			this._collapseTab.className = 'pict-modal-shell-panel-collapse-tab';
			this._collapseTab.setAttribute('aria-label',
				(this.Title ? 'Toggle ' + this.Title : 'Toggle panel'));
			this._collapseTab.title = this.Title || 'Toggle';
			this._collapseTab.innerHTML = ''
				+ (this.Icon ? '<span class="pict-modal-shell-panel-collapse-tab-icon">' + this.Icon + '</span>' : '')
				+ (this.Title ? '<span class="pict-modal-shell-panel-collapse-tab-title">' + this._escape(this.Title) + '</span>' : '');
			let tmpSelf = this;
			this._collapseTab.addEventListener('click', function () { tmpSelf.toggle(); });
			tmpRoot.appendChild(this._collapseTab);
		}

		// Resize handle — only when resizable. Positioned via CSS based
		// on side.
		if (this.Mode === 'resizable')
		{
			this._resizeHandle = document.createElement('div');
			this._resizeHandle.className = 'pict-modal-shell-panel-resize-handle';
			this._resizeHandle.setAttribute('aria-hidden', 'true');
			let tmpSelf = this;
			this._resizeHandle.addEventListener('pointerdown', function (pEvent)
			{
				if (tmpSelf.Collapsed) return;
				tmpSelf._shell._attachDragStart(tmpSelf, pEvent);
			});
			tmpRoot.appendChild(this._resizeHandle);
		}

		this.El = tmpRoot;
	}

	_applySize()
	{
		let tmpEffective = this.Collapsed ? this.CollapsedSize : this.Size;
		if (this.Side === 'left' || this.Side === 'right')
		{
			this.El.style.width = tmpEffective + 'px';
			this.El.style.height = '';
		}
		else
		{
			this.El.style.height = tmpEffective + 'px';
			this.El.style.width = '';
		}
	}

	_applyCollapsedClass()
	{
		if (this.Collapsed) this.El.classList.add('pict-modal-shell-panel-collapsed');
		else this.El.classList.remove('pict-modal-shell-panel-collapsed');
	}

	_setCollapsed(pBool)
	{
		if (this.Collapsed === !!pBool) return;
		let tmpWasCollapsed = this.Collapsed;
		this.Collapsed = !!pBool;
		this._applyCollapsedClass();
		this._applySize();
		this._persist();

		// Transition-specific hooks fire BEFORE OnToggle so OnExpand
		// callers can mutate state (e.g. set focus, re-fetch data) and
		// have it reflected by any OnToggle observer that runs after.
		if (tmpWasCollapsed && !this.Collapsed)
		{
			// collapsed → expanded. Render the bound ContentView so
			// freshly-streamed state shows up the moment the panel
			// becomes visible (replaces the manual view.render() dance
			// hosts used to do in their own runAction-style helpers).
			this._renderContentView();
			this._fireHook('OnExpand');
		}
		else if (!tmpWasCollapsed && this.Collapsed)
		{
			this._fireHook('OnCollapse');
		}

		// Back-compat: OnToggle still fires for both directions.
		this._fireHook('OnToggle', this.Collapsed);
	}

	_fireHook(pName, pArg)
	{
		let tmpFn = this._config[pName];
		if (typeof tmpFn !== 'function') return;
		try
		{
			if (typeof pArg !== 'undefined') { tmpFn(pArg, this); }
			else                             { tmpFn(this); }
		}
		catch (pErr) { /* host hook failure must not break the panel */ }
	}

	/**
	 * Render the bound ContentView (if any) into this panel's
	 * destination. Called by the shell on panel creation + on every
	 * collapsed→expanded transition + by popup() when re-flashing an
	 * already-open panel. Silently no-ops when no ContentView is
	 * configured or the view isn't registered yet (boot races).
	 */
	_renderContentView()
	{
		let tmpView = this.getContentView();
		if (tmpView && typeof tmpView.render === 'function')
		{
			try { tmpView.render(); }
			catch (pErr) { /* view render failure shouldn't break the panel chrome */ }
		}
	}

	/**
	 * Briefly highlight the panel — used by popup() when called on an
	 * already-open panel so the user sees that their click landed.
	 * The class is removed after the CSS animation completes; safe to
	 * re-trigger (timeouts overlap, last one wins on the trailing edge).
	 */
	_flash()
	{
		if (!this.El) return;
		this.El.classList.add('pict-modal-shell-panel-flash');
		let tmpSelf = this;
		clearTimeout(this._flashTimer);
		this._flashTimer = setTimeout(function ()
		{
			if (tmpSelf.El) tmpSelf.El.classList.remove('pict-modal-shell-panel-flash');
		}, 700);
	}

	_persist()
	{
		if (!this.PersistEnabled) return;
		this._shell._savePanelState(this.Hash,
		{
			Collapsed: this.Collapsed,
			Size: this.Size
		});
	}

	_escape(pStr)
	{
		return String(pStr || '')
			.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	}
}

// ════════════════════════════════════════════════════════════════════
//  Module exports — used internally by Pict-Section-Modal.shell()
// ════════════════════════════════════════════════════════════════════

class PictModalShellManager
{
	constructor(pModalSection)
	{
		this._modal = pModalSection;
		this._shellsByViewport = new WeakMap();
	}

	/**
	 * Idempotent — calling shell() twice with the same viewport returns
	 * the same instance.
	 */
	shell(pViewportSelectorOrEl, pOptions)
	{
		let tmpEl = (typeof pViewportSelectorOrEl === 'string')
			? document.querySelector(pViewportSelectorOrEl)
			: pViewportSelectorOrEl;
		if (!tmpEl)
		{
			throw new Error('Pict-Modal-Shell.shell: viewport not found for ' + pViewportSelectorOrEl);
		}
		let tmpExisting = this._shellsByViewport.get(tmpEl);
		if (tmpExisting) return tmpExisting;
		let tmpShell = new PictModalShell(this._modal, tmpEl, pOptions);
		this._shellsByViewport.set(tmpEl, tmpShell);
		return tmpShell;
	}
}

module.exports = PictModalShellManager;
module.exports.PictModalShell = PictModalShell;
module.exports.ShellPanel = ShellPanel;
module.exports.STORAGE_PREFIX = STORAGE_PREFIX;
module.exports.SCHEMA_VERSION = SCHEMA_VERSION;
