/**
 * Acme Widgets — example application bootstrap.
 *
 * This is a fully-branded multi-page Pict app that demonstrates the
 * patterns this example is meant to document:
 *
 *   1. CUSTOM BRAND
 *      Acme-Brand.js exports a brand block (name, tagline, inline SVG
 *      icon, light/dark favicons, primary/secondary colors). It's
 *      handed to pict-section-theme as the `Brand` option.
 *
 *   2. CUSTOM THEME, REGISTERED + DEFAULTED
 *      themes/acme-default.json is registered with the theme catalog
 *      before the section is added, then passed as `ApplyDefault` so
 *      it boots up active on first load. Out of the box you get every
 *      bundled theme too (pict-default, twilight, synthwave, …) —
 *      they show up in the picker alongside Acme's own.
 *
 *   3. RESPONSIVE SHELL CHROME
 *      pict-section-theme provides Theme-TopBar (brand mark / nav /
 *      user area / gear button) and Theme-BottomBar (status / info /
 *      actions). Both mount into pict-section-modal's shell() panels.
 *      The host fills slots via per-app views (TopBar-Nav, StatusBar).
 *
 *   4. GEAR-WITH-PICKER
 *      The theme picker + mode toggle + scale select pop out of the
 *      Theme-Button auto-mounted at the right edge of the topbar.
 *      One click → modal with all theme controls.
 *
 *   5. PER-ROUTE SIDEBAR
 *      The product filter sidebar is a docked left panel — but it's
 *      only relevant on the /Store route. The layout adds the panel
 *      lazily (on first /Store navigation) and the router callback
 *      toggles its display: '' / 'none' based on the active route.
 *      This pattern is reusable for any "panel that's only meaningful
 *      in some contexts" use case.
 *
 *   6. RESPONSIVE DRAWER ON THE SIDEBAR
 *      The sidebar panel is registered with ResponsiveDrawer: 900 so
 *      at narrow viewports it flips from a docked column into a top
 *      drawer with the handle tab. Try resizing the window narrow
 *      while on /Store.
 */

const libPictApplication  = require('pict-application');
const libPictRouter       = require('pict-router');
const libPictSectionModal = require('pict-section-modal');
const libPictSectionTheme = require('pict-section-theme');

const libAcmeBrand        = require('./Acme-Brand.js');
const libAcmeDefaultTheme = require('./themes/acme-default.json');

// Views
const libViewLayout       = require('./views/PictView-Acme-Layout.js');
const libViewTopBarNav    = require('./views/PictView-Acme-TopBar-Nav.js');
const libViewStatusBar    = require('./views/PictView-Acme-StatusBar.js');
const libViewSidebar      = require('./views/PictView-Acme-Sidebar.js');
const libViewAbout        = require('./views/PictView-Acme-About.js');
const libViewLegal        = require('./views/PictView-Acme-Legal.js');
const libViewStore        = require('./views/PictView-Acme-Store.js');

class AcmeApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// Layout drives router resolution itself, after the DOM is built.
		this.pict.settings.RouterSkipRouteResolveOnAdd = true;

		// ─── Router ──────────────────────────────────────────────────
		this.pict.addProvider('PictRouter',
			require('./providers/PictRouter-Acme-Configuration.json'),
			libPictRouter);

		// ─── Modal section (provides shell() + popups) ───────────────
		this.pict.addView('Pict-Section-Modal', {}, libPictSectionModal);

		// ─── Theme section ───────────────────────────────────────────
		// Before we add the Theme-Section provider, push the custom
		// Acme theme into the catalog so the section picks it up. The
		// catalog is a singleton; anything registered before
		// addProvider() runs gets included in the picker automatically.
		libPictSectionTheme.Catalog.register(
		{
			Hash:      'acme-default',
			Bundle:    libAcmeDefaultTheme,
			Category:  'Acme',
			IsDefault: true
		});

		// One call does it all: registers the theme runtime, pushes
		// every catalog entry, wires the views, applies the default
		// theme + brand, and saves user picks to localStorage.
		this.pict.addProvider('Theme-Section',
		{
			ApplyDefault:    'acme-default',
			DefaultMode:     'system',
			DefaultScale:    1.0,
			Brand:           libAcmeBrand,
			PersistenceKey:  'acme-widgets',

			// Picker / ModeToggle / ScaleSelect drive the gear menu
			// popup. Button is the gear trigger in the topbar.
			// BrandMark is the inline icon+name in the topbar's left
			// slot. TopBar / BottomBar are the shared chrome rows.
			Views: ['Picker', 'ModeToggle', 'ScaleSelect', 'Button', 'BrandMark', 'TopBar', 'BottomBar'],
			ViewOptions:
			{
				TopBar:
				{
					NavView:    'Acme-TopBar-Nav',
					// UserView omitted — no user-area widgets in this
					// example, just the gear at the far right
					Height:     56,
					// Below 900px the topbar's nav slot collapses to a
					// burger menu (handled internally by Theme-TopBar)
					CompactBreakpoint: 900
				},
				BottomBar:
				{
					StatusView: 'Acme-StatusBar',
					Height:     32
				}
			}
		}, libPictSectionTheme);

		// ─── Application views ───────────────────────────────────────
		this.pict.addView('Acme-Layout',       libViewLayout.default_configuration,    libViewLayout);
		this.pict.addView('Acme-TopBar-Nav',   libViewTopBarNav.default_configuration, libViewTopBarNav);
		this.pict.addView('Acme-StatusBar',    libViewStatusBar.default_configuration, libViewStatusBar);
		this.pict.addView('Acme-Sidebar',      libViewSidebar.default_configuration,   libViewSidebar);
		this.pict.addView('Acme-About',        libViewAbout.default_configuration,     libViewAbout);
		this.pict.addView('Acme-Legal',        libViewLegal.default_configuration,     libViewLegal);
		this.pict.addView('Acme-Store',        libViewStore.default_configuration,     libViewStore);
	}

	onAfterInitializeAsync(fCallback)
	{
		// Seed application state — a tiny in-memory product catalog
		// the Store page filters over.
		this.pict.AppData.Acme =
		{
			Status:        'Ready',
			CurrentRoute:  'About',
			Filter:        { Query: '', Category: 'all' },
			Products:
			[
				{ ID: 1, Name: 'Spring Loaded Boxing Glove', Category: 'gadgets',  Price: 24.99, InStock: true },
				{ ID: 2, Name: 'Portable Hole',              Category: 'mystery',  Price: 99.95, InStock: true },
				{ ID: 3, Name: 'Earthquake Pills',           Category: 'chemicals', Price: 12.50, InStock: false },
				{ ID: 4, Name: 'Rocket-Powered Roller Skates', Category: 'transport', Price: 199.00, InStock: true },
				{ ID: 5, Name: 'Anvil (Standard 200lb)',     Category: 'metalwork', Price: 89.00, InStock: true },
				{ ID: 6, Name: 'Giant Magnet',               Category: 'gadgets',  Price: 145.00, InStock: false },
				{ ID: 7, Name: 'Dehydrated Boulders',        Category: 'chemicals', Price: 8.75,  InStock: true },
				{ ID: 8, Name: 'Tornado Seeds',              Category: 'chemicals', Price: 22.00, InStock: true },
				{ ID: 9, Name: 'Instant Tunnel Paint',       Category: 'mystery',   Price: 36.00, InStock: true }
			]
		};

		// Render the layout shell. Layout builds the panels and then
		// resolves the router so the current hash route is honored on
		// first load (including deep links to /Store or /Legal).
		this.pict.views['Acme-Layout'].render();

		return super.onAfterInitializeAsync(fCallback);
	}

	// ─── Navigation helpers — referenced from templates + buttons ────

	navigateTo(pPath)
	{
		this.pict.providers.PictRouter.navigate(pPath);
	}

	/**
	 * Called by the router when each route fires. Re-renders the
	 * matching content view into the workspace center and tells the
	 * layout to show or hide the sidebar based on the active route.
	 */
	showView(pViewIdentifier, pRouteLabel)
	{
		this.pict.AppData.Acme.CurrentRoute = pRouteLabel;

		// Re-render the topbar nav so the active-route highlight tracks.
		if (this.pict.views['Acme-TopBar-Nav'])
		{
			this.pict.views['Acme-TopBar-Nav'].render();
		}

		// Show/hide the sidebar — only visible on /Store.
		this.pict.views['Acme-Layout'].setSidebarVisible(pRouteLabel === 'Store');

		// Update the status bar message.
		this.setStatus(this._statusMessageFor(pRouteLabel));

		// Render the route's content view into the workspace.
		let tmpView = this.pict.views[pViewIdentifier];
		if (tmpView) { tmpView.render(); }
		else
		{
			this.pict.log.warn('View [' + pViewIdentifier + '] not found; falling back to About.');
			this.pict.views['Acme-About'].render();
		}
	}

	setStatus(pMessage)
	{
		this.pict.AppData.Acme.Status = pMessage;
		if (this.pict.views['Acme-StatusBar']) { this.pict.views['Acme-StatusBar'].render(); }
	}

	// ─── Sidebar filter handlers — called from sidebar template ──────

	setFilterQuery(pQuery)
	{
		this.pict.AppData.Acme.Filter.Query = pQuery || '';
		// Re-render the Store view so the filtered product list updates.
		if (this.pict.views['Acme-Store']) { this.pict.views['Acme-Store'].render(); }
	}

	setFilterCategory(pCategory)
	{
		this.pict.AppData.Acme.Filter.Category = pCategory || 'all';
		if (this.pict.views['Acme-Store']) { this.pict.views['Acme-Store'].render(); }
	}

	_statusMessageFor(pRoute)
	{
		switch (pRoute)
		{
			case 'About': return 'Welcome to Acme Widgets';
			case 'Legal': return 'Terms, conditions, and fine print';
			case 'Store': return this.pict.AppData.Acme.Products.length + ' products in catalog';
			default:      return 'Ready';
		}
	}
}

module.exports = AcmeApplication;
module.exports.default_configuration = require('./Pict-Application-Acme-Configuration.json');
