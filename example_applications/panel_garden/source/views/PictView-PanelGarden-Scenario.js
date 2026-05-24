/**
 * Panel Garden — Scenario view.  Each scenario gets a fresh
 * pict-section-modal shell with the scenario's Panels[] config
 * applied; the center area renders the scenario title + notes so the
 * tester knows what to look for.
 *
 * The shell is torn down and rebuilt on every scenario change so each
 * scenario starts clean (no leaked panel state from the previous
 * scenario, no inherited persistence, no stale CSS).
 */
const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:            'PanelGarden-Scenario',
	DefaultRenderable:         'PanelGarden-Scenario-Renderable',
	DefaultDestinationAddress: '#PanelGarden-Center',
	AutoRender:                false,

	CSS: /*css*/`
		.panel-garden-shell-host
		{
			position: absolute;
			top: 0; right: 0; bottom: 0; left: 0;
		}
		.panel-garden-shell { height: 100%; }
		.panel-garden-shell .pict-modal-shell-panel
		{
			background: var(--theme-color-background-panel, #FFFFFF);
		}
		.panel-garden-shell .pict-modal-shell-center
		{
			background: var(--theme-color-background-primary, #FDFBF7);
		}

		.panel-garden-center-content
		{
			padding: 28px 32px;
			max-width: 720px;
			line-height: 1.55;
		}
		.panel-garden-scenario-title
		{
			font-size: 18px;
			font-weight: 700;
			margin: 0 0 4px;
			color: var(--theme-color-text-primary, #2A241E);
		}
		.panel-garden-scenario-id
		{
			font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
			font-size: 11px;
			color: var(--theme-color-text-muted, #8A7F72);
			margin-bottom: 16px;
		}
		.panel-garden-scenario-notes
		{
			color: var(--theme-color-text-secondary, #5E5549);
			font-size: 13px;
			margin-bottom: 14px;
		}
		.panel-garden-scenario-notes ul { padding-left: 1.4em; margin: 0.6em 0; }
		.panel-garden-scenario-notes li { margin-bottom: 0.5em; }
		.panel-garden-scenario-notes strong { color: var(--theme-color-text-primary, #2A241E); }

		.panel-garden-panel-body
		{
			padding: 16px 18px;
			color: var(--theme-color-text-secondary, #5E5549);
			font-size: 12px;
			line-height: 1.5;
		}
		.panel-garden-panel-title
		{
			font-size: 11px;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.06em;
			color: var(--theme-color-text-muted, #8A7F72);
			margin-bottom: 4px;
		}
		.panel-garden-panel-meta
		{
			font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
			font-size: 11px;
			color: var(--theme-color-text-muted, #8A7F72);
		}
	`,

	Templates:
	[
		{
			Hash: 'PanelGarden-Scenario-Template',
			Template: /*html*/`<div class="panel-garden-shell-host" id="PanelGarden-Scenario-Shell"></div>`
		}
	],

	Renderables:
	[
		{
			RenderableHash:            'PanelGarden-Scenario-Renderable',
			TemplateHash:              'PanelGarden-Scenario-Template',
			ContentDestinationAddress: '#PanelGarden-Center',
			RenderMethod:              'replace'
		}
	]
};

class PanelGardenScenarioView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this._shell = null;
		this._extraStyleEl = null;
	}

	/**
	 * Tear down any prior shell + extra style, then build a fresh
	 * shell for the new scenario.
	 *
	 * @param {object} pScenario - scenario record from scenarios.js
	 */
	showScenario(pScenario)
	{
		this.render();

		this._teardown();

		let tmpHostEl = document.getElementById('PanelGarden-Scenario-Shell');
		if (!tmpHostEl) { return; }

		// Add the scoping class our per-scenario ExtraCSS keys off.
		tmpHostEl.classList.add('panel-garden-shell');

		let tmpModal = this.pict.views['Pict-Section-Modal'];
		if (!tmpModal || typeof tmpModal.shell !== 'function')
		{
			tmpHostEl.innerHTML = '<div style="padding:24px;color:#900;">pict-section-modal is not registered.</div>';
			return;
		}

		// Build the shell.  No PersistenceKey — each navigation should
		// reset the panel sizes to the scenario\'s declared defaults
		// rather than picking up the previous scenario\'s drag state.
		this._shell = tmpModal.shell(tmpHostEl, { PersistenceKey: null });

		// Add each panel from the scenario spec.  We tag the panel
		// body with the scenario notes for top/bottom/side panels so
		// the tester sees something inside the panel content area.
		for (let i = 0; i < pScenario.Panels.length; i++)
		{
			let tmpPanelSpec = pScenario.Panels[i];
			let tmpDestId = 'PanelGarden-PanelBody-' + tmpPanelSpec.Hash;
			let tmpFull = Object.assign({}, tmpPanelSpec, { ContentDestinationId: tmpDestId });
			this._shell.addPanel(tmpFull);
		}

		// Center destination — scenario description goes here.
		this._shell.center({ ContentDestinationId: 'PanelGarden-CenterContent' });

		// Per-scenario ExtraCSS for middle-anchored / thick variants.
		if (pScenario.ExtraCSS)
		{
			this._extraStyleEl = document.createElement('style');
			this._extraStyleEl.id = 'PanelGarden-Scenario-ExtraCSS';
			this._extraStyleEl.textContent = pScenario.ExtraCSS;
			document.head.appendChild(this._extraStyleEl);
		}

		// Fill the panel bodies + center after the shell has built
		// the destinations.
		setTimeout(() => { this._fillContent(pScenario); }, 0);
	}

	_fillContent(pScenario)
	{
		// Each panel gets a small label + meta block so the tester can
		// see what's inside.  This also helps visualize whether any
		// part of the collapse tab is bleeding INTO the panel content.
		for (let i = 0; i < pScenario.Panels.length; i++)
		{
			let tmpPanelSpec = pScenario.Panels[i];
			let tmpDestId = 'PanelGarden-PanelBody-' + tmpPanelSpec.Hash;
			let tmpEl = document.getElementById(tmpDestId);
			if (!tmpEl) { continue; }
			let tmpMeta = 'Side: ' + tmpPanelSpec.Side
				+ ' · Mode: ' + tmpPanelSpec.Mode
				+ ' · Size: ' + tmpPanelSpec.Size + 'px';
			tmpEl.innerHTML = ''
				+ '<div class="panel-garden-panel-body">'
				+   '<div class="panel-garden-panel-title">' + this._escape(tmpPanelSpec.Title || tmpPanelSpec.Hash) + '</div>'
				+   '<div class="panel-garden-panel-meta">' + this._escape(tmpMeta) + '</div>'
				+ '</div>';
		}

		// Center — scenario title, ID, notes.
		let tmpCenterEl = document.getElementById('PanelGarden-CenterContent');
		if (tmpCenterEl)
		{
			let tmpNotesHTML = '';
			if (pScenario.Notes && pScenario.Notes.length)
			{
				tmpNotesHTML = '<ul>';
				for (let j = 0; j < pScenario.Notes.length; j++)
				{
					tmpNotesHTML += '<li>' + this._renderInlineBold(pScenario.Notes[j]) + '</li>';
				}
				tmpNotesHTML += '</ul>';
			}
			tmpCenterEl.innerHTML = ''
				+ '<div class="panel-garden-center-content">'
				+   '<h1 class="panel-garden-scenario-title">' + this._escape(pScenario.Title) + '</h1>'
				+   '<div class="panel-garden-scenario-id">scenario: ' + this._escape(pScenario.Id) + '</div>'
				+   '<div class="panel-garden-scenario-notes">' + tmpNotesHTML + '</div>'
				+ '</div>';
		}
	}

	_teardown()
	{
		if (this._extraStyleEl && this._extraStyleEl.parentNode)
		{
			this._extraStyleEl.parentNode.removeChild(this._extraStyleEl);
		}
		this._extraStyleEl = null;
		// Wipe the shell mount; shell() will rebuild on next call.
		let tmpHostEl = document.getElementById('PanelGarden-Scenario-Shell');
		if (tmpHostEl) { tmpHostEl.innerHTML = ''; }
		this._shell = null;
	}

	_escape(pText)
	{
		return String(pText || '').replace(/[&<>"']/g, function (pChar)
		{
			return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[pChar];
		});
	}

	// Tiny markdown-ish bold pass: **text** → <strong>text</strong>.
	// Notes are author-authored so we don't need a full parser here.
	_renderInlineBold(pText)
	{
		let tmpEscaped = this._escape(pText);
		return tmpEscaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}
}

module.exports = PanelGardenScenarioView;
module.exports.default_configuration = _ViewConfiguration;
