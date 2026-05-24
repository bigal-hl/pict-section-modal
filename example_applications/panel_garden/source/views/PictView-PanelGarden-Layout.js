/**
 * Panel Garden — Layout.  A trivial top-bar + center split.  Each
 * scenario page mounts its OWN pict-section-modal shell into the
 * center to exercise the per-side tab geometry; this outer layout
 * just hosts the chrome.
 */
const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:            'PanelGarden-Layout',
	DefaultRenderable:         'PanelGarden-Layout-Renderable',
	DefaultDestinationAddress: '#PanelGarden-Application-Container',
	AutoRender:                false,

	CSS: /*css*/`
		.panel-garden-app
		{
			height: 100%;
			display: flex;
			flex-direction: column;
			background: var(--theme-color-background-primary, #FDFBF7);
			color:      var(--theme-color-text-primary,       #2A241E);
		}
		.panel-garden-topbar
		{
			flex: 0 0 auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 8px 16px;
			background: var(--theme-color-background-panel, #FFFFFF);
			border-bottom: 1px solid var(--theme-color-border-default, #DDD6CA);
		}
		.panel-garden-brand
		{
			font-weight: 700;
			font-size: 14px;
			color: var(--theme-color-text-primary, #2A241E);
			display: flex;
			align-items: center;
			gap: 8px;
		}
		.panel-garden-brand small
		{
			font-weight: 400;
			font-size: 11px;
			color: var(--theme-color-text-muted, #8A7F72);
			letter-spacing: 0.04em;
			text-transform: uppercase;
		}
		.panel-garden-center
		{
			flex: 1 1 0;
			min-height: 0;
			display: flex;
			flex-direction: column;
			position: relative;
		}
	`,

	Templates:
	[
		{
			Hash: 'PanelGarden-Layout-Template',
			Template: /*html*/`
<div class="panel-garden-app">
	<div class="panel-garden-topbar" id="PanelGarden-Topbar"></div>
	<div class="panel-garden-center" id="PanelGarden-Center"></div>
</div>`
		}
	],

	Renderables:
	[
		{
			RenderableHash:            'PanelGarden-Layout-Renderable',
			TemplateHash:              'PanelGarden-Layout-Template',
			ContentDestinationAddress: '#PanelGarden-Application-Container',
			RenderMethod:              'replace'
		}
	]
};

class PanelGardenLayoutView extends libPictView
{
	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		this.pict.CSSMap.injectCSS();

		// Mount the toolbar.  The scenario view mounts later (when the
		// application picks the first scenario).
		let tmpToolbar = this.pict.views['PanelGarden-Toolbar'];
		if (tmpToolbar) { tmpToolbar.render(); }

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}
}

module.exports = PanelGardenLayoutView;
module.exports.default_configuration = _ViewConfiguration;
