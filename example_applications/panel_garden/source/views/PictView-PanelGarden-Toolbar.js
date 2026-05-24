/**
 * Panel Garden — Toolbar.  Lays out the brand label, scenario picker
 * (grouped pills), and theme picker side-by-side.  The scenario picker
 * uses `{~TS:...~}` to iterate scenarios from AppData; clicking a pill
 * navigates via the application's selectScenario(id) method.
 */
const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:            'PanelGarden-Toolbar',
	DefaultRenderable:         'PanelGarden-Toolbar-Renderable',
	DefaultDestinationAddress: '#PanelGarden-Topbar',
	AutoRender:                false,

	CSS: /*css*/`
		.panel-garden-scenario-groups
		{
			display: flex;
			align-items: center;
			gap: 14px;
			flex-wrap: wrap;
			flex: 1 1 auto;
			min-width: 0;
		}
		.panel-garden-scenario-group
		{
			display: flex;
			align-items: center;
			gap: 4px;
		}
		.panel-garden-scenario-group-label
		{
			font-size: 10px;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.06em;
			color: var(--theme-color-text-muted, #8A7F72);
			margin-right: 4px;
		}
		.panel-garden-scenario-pill
		{
			display: inline-flex;
			align-items: center;
			padding: 4px 10px;
			background: transparent;
			color: var(--theme-color-text-secondary, #5E5549);
			border: 1px solid var(--theme-color-border-default, #DDD6CA);
			border-radius: 4px;
			font-size: 11px;
			cursor: pointer;
			transition: color 120ms, background-color 120ms, border-color 120ms;
		}
		.panel-garden-scenario-pill:hover
		{
			color:        var(--theme-color-brand-primary,   #2E7D74);
			border-color: var(--theme-color-brand-primary,   #2E7D74);
			background:   var(--theme-color-background-hover, #EAE3D8);
		}
		.panel-garden-scenario-pill.active
		{
			color:      var(--theme-color-background-panel,   #FFFFFF);
			background: var(--theme-color-brand-primary,      #2E7D74);
			border-color: var(--theme-color-brand-primary,    #2E7D74);
			font-weight: 600;
		}
		.panel-garden-theme-controls
		{
			display: flex;
			align-items: center;
			gap: 6px;
			flex: 0 0 auto;
		}
	`,

	Templates:
	[
		{
			Hash: 'PanelGarden-Toolbar-Template',
			Template: /*html*/`
<div class="panel-garden-brand">
	Panel Garden
	<small>pict-section-modal test-bed</small>
</div>
<div class="panel-garden-scenario-groups">
	{~TS:PanelGarden-Toolbar-Group-Template:AppData.PanelGarden.Groups~}
</div>
<div class="panel-garden-theme-controls">
	<div id="Theme-Picker"></div>
	<div id="Theme-ModeToggle"></div>
</div>`
		},
		{
			Hash: 'PanelGarden-Toolbar-Group-Template',
			Template: /*html*/`<div class="panel-garden-scenario-group">
	<div class="panel-garden-scenario-group-label">{~D:Record.Name~}</div>
	{~TS:PanelGarden-Toolbar-Pill-Template:Record.Scenarios~}
</div>`
		},
		{
			Hash: 'PanelGarden-Toolbar-Pill-Template',
			Template: /*html*/`<button type="button" class="panel-garden-scenario-pill{~D:Record.ActiveClass~}"
	title="{~D:Record.Title~}"
	onclick="{~P~}.PictApplication.selectScenario('{~D:Record.Id~}')"
>{~D:Record.Label~}</button>`
		}
	],

	Renderables:
	[
		{
			RenderableHash:            'PanelGarden-Toolbar-Renderable',
			TemplateHash:              'PanelGarden-Toolbar-Template',
			ContentDestinationAddress: '#PanelGarden-Topbar',
			RenderMethod:              'replace'
		}
	]
};

class PanelGardenToolbarView extends libPictView
{
	onBeforeRender(pRenderable)
	{
		// Group scenarios by their Group label so the toolbar can
		// render them as labelled clusters.
		let tmpScenarios = (this.pict.AppData.PanelGarden && this.pict.AppData.PanelGarden.Scenarios) || [];
		let tmpCurrentId = (this.pict.AppData.PanelGarden && this.pict.AppData.PanelGarden.CurrentScenarioId) || '';

		let tmpGroupMap = {};
		let tmpGroupOrder = [];
		for (let i = 0; i < tmpScenarios.length; i++)
		{
			let tmpScenario = tmpScenarios[i];
			if (!tmpGroupMap[tmpScenario.Group])
			{
				tmpGroupMap[tmpScenario.Group] = { Name: tmpScenario.Group, Scenarios: [] };
				tmpGroupOrder.push(tmpScenario.Group);
			}
			tmpGroupMap[tmpScenario.Group].Scenarios.push(
			{
				Id:          tmpScenario.Id,
				Label:       tmpScenario.Label,
				Title:       tmpScenario.Title,
				ActiveClass: (tmpScenario.Id === tmpCurrentId) ? ' active' : ''
			});
		}

		let tmpGroups = [];
		for (let g = 0; g < tmpGroupOrder.length; g++)
		{
			tmpGroups.push(tmpGroupMap[tmpGroupOrder[g]]);
		}
		this.pict.AppData.PanelGarden.Groups = tmpGroups;

		return super.onBeforeRender(pRenderable);
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		this.pict.CSSMap.injectCSS();

		// Mount theme controls into their slots.
		if (this.pict.views['Theme-Picker'])      { this.pict.views['Theme-Picker'].render(); }
		if (this.pict.views['Theme-ModeToggle'])  { this.pict.views['Theme-ModeToggle'].render(); }

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}
}

module.exports = PanelGardenToolbarView;
module.exports.default_configuration = _ViewConfiguration;
