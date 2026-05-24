/**
 * Panel Garden — visual test-bed for pict-section-modal's
 * shell()/addPanel() collapse-tab geometry.
 *
 * Why this exists:
 *   The collapse tab USED to straddle the panel boundary (about 1px
 *   inside the panel, 5px outside) with a panel-bg-colored merge-bar
 *   masking the in-panel half.  That worked geometrically but looked
 *   like the tab was pinned INTO the panel rather than attached TO it,
 *   and any per-app rendering inside the panel could clip against the
 *   in-panel sliver.  This app exercises every variant of the new
 *   "fully-outside" geometry so regressions are obvious at a glance.
 *
 * What it covers:
 *   * All four sides: left / right / top / bottom.
 *   * Multiple tab thicknesses: default (6×28) and oversized custom.
 *   * Tab anchoring: stock (offset from corner) AND middle-centered
 *     custom variants.
 *   * Resizable + collapsible modes (so the tab also has to work in
 *     the collapsed state where it fills the strip).
 *   * Theme switching (pict-section-theme): every Retold theme should
 *     repaint the tab without breaking the geometry.
 *
 * Each scenario is a separate page route.  Use the scenario picker in
 * the topbar to jump between them; the theme picker sits next to it.
 */

const libPictApplication  = require('pict-application');
const libPictSectionModal  = require('pict-section-modal');
const libPictSectionTheme  = require('pict-section-theme');

const libViewLayout    = require('./views/PictView-PanelGarden-Layout.js');
const libViewScenario  = require('./views/PictView-PanelGarden-Scenario.js');
const libViewToolbar   = require('./views/PictView-PanelGarden-Toolbar.js');

const _Scenarios = require('./scenarios.js');

class PanelGardenApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// The modal view drives the shell() + addPanel() machinery.
		this.pict.addView('Pict-Section-Modal', libPictSectionModal.default_configuration, libPictSectionModal);

		// Theme provider — mounts the picker in the topbar slot via
		// ViewOptions.TopBar.NavView.  We DON'T use Theme-TopBar here
		// because Panel Garden has a custom topbar (scenario picker +
		// theme picker side by side); we mount the picker directly.
		this.pict.addProvider('Theme-Section',
		{
			ApplyDefault: 'pict-default',
			DefaultMode:  'system',
			DefaultScale: 1.0,
			Views: ['Picker', 'ModeToggle', 'ScaleSelect', 'Button']
		}, libPictSectionTheme);

		this.pict.addView('PanelGarden-Layout',   libViewLayout.default_configuration,   libViewLayout);
		this.pict.addView('PanelGarden-Toolbar',  libViewToolbar.default_configuration,  libViewToolbar);
		this.pict.addView('PanelGarden-Scenario', libViewScenario.default_configuration, libViewScenario);
	}

	onAfterInitializeAsync(fCallback)
	{
		this.pict.AppData.PanelGarden =
		{
			Scenarios:        _Scenarios,
			CurrentScenarioId: _Scenarios[0].Id,
			CurrentScenario:   _Scenarios[0]
		};

		this.pict.views['PanelGarden-Layout'].render();

		// First scenario lands on next tick once the layout shell is
		// in the DOM and the scenario view has its mount point.
		setTimeout(() => { this.selectScenario(_Scenarios[0].Id); }, 0);

		return super.onAfterInitializeAsync(fCallback);
	}

	/**
	 * Pick a scenario by ID.  Re-renders the toolbar (so the active
	 * pill highlights) and rebuilds the scenario view (which tears
	 * down its inner shell and rebuilds it with the new panel spec).
	 *
	 * @param {string} pId - Scenario identifier from scenarios.js
	 */
	selectScenario(pId)
	{
		let tmpScenario = _Scenarios.find((s) => { return s.Id === pId; });
		if (!tmpScenario) { return; }

		this.pict.AppData.PanelGarden.CurrentScenarioId = pId;
		this.pict.AppData.PanelGarden.CurrentScenario   = tmpScenario;

		let tmpToolbar = this.pict.views['PanelGarden-Toolbar'];
		if (tmpToolbar && typeof tmpToolbar.render === 'function') { tmpToolbar.render(); }

		let tmpScenarioView = this.pict.views['PanelGarden-Scenario'];
		if (tmpScenarioView && typeof tmpScenarioView.showScenario === 'function')
		{
			tmpScenarioView.showScenario(tmpScenario);
		}
	}
}

module.exports = PanelGardenApplication;

module.exports.default_configuration =
{
	Name: 'PanelGardenExample',
	Hash: 'PanelGardenExample'
};
