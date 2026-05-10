const libPictViewClass = require('pict-view');

const libPictModalOverlay = require('./Pict-Modal-Overlay.js');
const libPictModalConfirm = require('./Pict-Modal-Confirm.js');
const libPictModalWindow = require('./Pict-Modal-Window.js');
const libPictModalToast = require('./Pict-Modal-Toast.js');
const libPictModalTooltip = require('./Pict-Modal-Tooltip.js');
const libPictModalPanel = require('./Pict-Modal-Panel.js');
const libPictModalDropdown = require('./Pict-Modal-Dropdown.js');
const libPictModalShell = require('./Pict-Modal-Shell.js');

const _DefaultConfiguration = require('./Pict-Section-Modal-DefaultConfiguration.js');

class PictSectionModal extends libPictViewClass
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DefaultConfiguration, pOptions);

		super(pFable, tmpOptions, pServiceHash);

		this._activeModals = [];
		this._activeTooltips = [];
		this._activeToasts = [];
		this._idCounter = 0;

		this._overlay = new libPictModalOverlay(this);
		this._confirm = new libPictModalConfirm(this);
		this._window = new libPictModalWindow(this);
		this._toast = new libPictModalToast(this);
		this._tooltip = new libPictModalTooltip(this);
		this._panel = new libPictModalPanel(this);
		this._dropdown = new libPictModalDropdown(this);
		this._shell = new libPictModalShell(this);
	}

	onBeforeInitialize()
	{
		super.onBeforeInitialize();

		// Ensure the root class is on the body for CSS variable scoping
		if (typeof document !== 'undefined' && document.body)
		{
			if (!document.body.classList.contains('pict-modal-root'))
			{
				document.body.classList.add('pict-modal-root');
			}
		}

		return super.onBeforeInitialize();
	}

	/**
	 * Generate a unique ID for DOM elements.
	 *
	 * @returns {number}
	 */
	_nextId()
	{
		this._idCounter++;
		return this._idCounter;
	}

	// -- Confirm API --

	/**
	 * Show a confirmation dialog.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options { title, confirmLabel, cancelLabel, dangerous }
	 * @returns {Promise<boolean>}
	 */
	confirm(pMessage, pOptions)
	{
		return this._confirm.confirm(pMessage, pOptions);
	}

	/**
	 * Show a two-step confirmation dialog.
	 *
	 * If confirmPhrase is set, the user must type it to enable the confirm button.
	 * If no confirmPhrase, the first click changes the button text and the second click confirms.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options { title, confirmPhrase, phrasePrompt, confirmLabel, cancelLabel }
	 * @returns {Promise<boolean>}
	 */
	doubleConfirm(pMessage, pOptions)
	{
		return this._confirm.doubleConfirm(pMessage, pOptions);
	}

	// -- Modal Window API --

	/**
	 * Show a custom modal window.
	 *
	 * @param {object} [pOptions] - Options { title, content, buttons, closeable, width, onOpen, onClose }
	 * @returns {Promise<string|null>} Resolves with the clicked button Hash, or null on close
	 */
	show(pOptions)
	{
		return this._window.show(pOptions);
	}

	// -- Tooltip API --

	/**
	 * Attach a simple text tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pText - Tooltip text
	 * @param {object} [pOptions] - Options { position, delay, maxWidth }
	 * @returns {{ destroy: function }}
	 */
	tooltip(pElement, pText, pOptions)
	{
		return this._tooltip.tooltip(pElement, pText, pOptions);
	}

	/**
	 * Attach a rich HTML tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pHTMLContent - HTML content
	 * @param {object} [pOptions] - Options { position, delay, maxWidth, interactive }
	 * @returns {{ destroy: function }}
	 */
	richTooltip(pElement, pHTMLContent, pOptions)
	{
		return this._tooltip.richTooltip(pElement, pHTMLContent, pOptions);
	}

	// -- Toast API --

	/**
	 * Show a toast notification.
	 *
	 * @param {string} pMessage - Toast message
	 * @param {object} [pOptions] - Options { type, duration, position, dismissible }
	 * @returns {{ dismiss: function }}
	 */
	toast(pMessage, pOptions)
	{
		return this._toast.toast(pMessage, pOptions);
	}

	// -- Dropdown API --

	/**
	 * Open an anchor-positioned dropdown menu (no backdrop, click-outside
	 * dismisses). Useful for nav menus and split-button addenda.
	 *
	 * @param {HTMLElement|string|object} pAnchor - Element, CSS selector, or
	 *   { left, top, width, height } rect for context-menu style anchoring.
	 * @param {object} pOptions - { items, align, position, minWidth, maxHeight,
	 *   className, closeOnSelect, onSelect, onClose }
	 * @returns {Promise<{Hash, Item}|null>} Selection or null on dismiss.
	 */
	dropdown(pAnchor, pOptions)
	{
		return this._dropdown.dropdown(pAnchor, pOptions);
	}

	/**
	 * Dismiss any open dropdown.
	 */
	dismissDropdowns()
	{
		this._dropdown.dismissAll();
	}

	// -- Panel API --

	/**
	 * Attach resizable/collapsible panel behavior to a DOM element.
	 *
	 * @param {string} pTargetSelector - CSS selector for the panel element
	 * @param {object} [pOptions] - Options { position, width, minWidth, maxWidth, collapsible, collapsed, persist, persistKey, onResize, onToggle }
	 * @returns {{ collapse, expand, toggle, setWidth, destroy }} Panel handle
	 */
	panel(pTargetSelector, pOptions)
	{
		return this._panel.create(pTargetSelector, pOptions);
	}

	// -- Shell API --

	/**
	 * Get (or create) a layout shell for a viewport. Idempotent.
	 *
	 * The shell takes ownership of the viewport's contents and manages
	 * top / right / bottom / left panel placement plus a center area.
	 * See Pict-Modal-Shell.js for full panel-config semantics.
	 *
	 * @param {string|HTMLElement} pViewport - selector or element of the
	 *   container the shell should fill (commonly the app's root div).
	 * @param {object} [pOptions]
	 * @param {boolean} [pOptions.Persistence=true]   - autosave panel state to localStorage
	 * @param {string}  [pOptions.PersistenceKey=null]- override scope (default: hostname)
	 * @returns {PictModalShell}
	 */
	shell(pViewport, pOptions)
	{
		return this._shell.shell(pViewport, pOptions);
	}

	// -- Cleanup API --

	/**
	 * Dismiss all open modals.
	 */
	dismissModals()
	{
		let tmpModals = this._activeModals.slice();
		for (let i = tmpModals.length - 1; i >= 0; i--)
		{
			tmpModals[i].dismiss(null);
		}
	}

	/**
	 * Dismiss all active tooltips.
	 */
	dismissTooltips()
	{
		this._tooltip.dismissAll();
	}

	/**
	 * Dismiss all active toasts.
	 */
	dismissToasts()
	{
		this._toast.dismissAll();
	}

	/**
	 * Dismiss everything: modals, tooltips, and toasts.
	 */
	dismissAll()
	{
		this.dismissModals();
		this.dismissTooltips();
		this.dismissToasts();
		this.dismissDropdowns();
	}

	/**
	 * Clean up all DOM elements when the view is destroyed.
	 */
	/**
	 * Destroy all active panels.
	 */
	destroyPanels()
	{
		this._panel.destroyAll();
	}

	destroy()
	{
		this.dismissAll();
		this.destroyPanels();
		this._overlay.destroy();
		this._toast.destroy();
		if (typeof super.destroy === 'function') { return super.destroy(); }
	}
}

module.exports = PictSectionModal;

module.exports.default_configuration = _DefaultConfiguration;
