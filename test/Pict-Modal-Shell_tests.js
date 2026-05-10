/**
 * Pict-Modal-Shell — Unit Tests
 *
 * Verifies:
 *   - shell(viewport) is idempotent for the same viewport element.
 *   - addPanel creates DOM in the correct stack (top/bottom rows, left/right stacks).
 *   - Side panels apply width; top/bottom apply height.
 *   - Multiple panels per side stack in registration order.
 *   - center({ ContentDestinationId }) creates the inner destination div.
 *   - collapse/expand toggles class + visible size; persists when enabled.
 *   - Resize handle present only for Mode='resizable'; collapse tab for collapsible/resizable.
 *   - Persistence round-trips collapsed + size across shell instances.
 *   - Overlay-position panels mount on the overlay layer, not in the side stacks.
 *   - setSize clamps to MinSize / MaxSize.
 */

const libBrowserEnv = require('browser-env');
// `url` opt is needed so jsdom doesn't run in opaque-origin mode where
// localStorage throws on access — the shell + persistence tests need
// real storage to round-trip.
libBrowserEnv({ url: 'http://localhost/' });

const Chai = require('chai');
const Expect = Chai.expect;

const libPict = require('pict');
const libPictSectionModal = require('../source/Pict-Section-Modal.js');

function cleanupDOM()
{
	document.body.innerHTML = '';
	try
	{
		if (typeof window !== 'undefined' && window.localStorage)
		{
			window.localStorage.clear();
		}
	}
	catch (pErr) { /* opaque-origin or other — non-fatal for setup */ }
}

function makeShell(pPictAlt)
{
	let tmpHost = document.createElement('div');
	tmpHost.id = 'shell-host';
	tmpHost.style.width = '1200px';
	tmpHost.style.height = '800px';
	document.body.appendChild(tmpHost);

	let tmpPict = pPictAlt || new libPict();
	let tmpModal = tmpPict.addView('Pict-Section-Modal',
		libPictSectionModal.default_configuration, libPictSectionModal);
	return { Pict: tmpPict, Modal: tmpModal, Host: tmpHost };
}

suite('Pict-Modal-Shell', () =>
{
	setup(() => { cleanupDOM(); });

	suite('shell()', () =>
	{
		test('is idempotent for the same viewport', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShellA = Modal.shell(Host);
			let tmpShellB = Modal.shell(Host);
			Expect(tmpShellA).to.equal(tmpShellB);
		});

		test('accepts a CSS selector and resolves it', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell('#shell-host');
			Expect(tmpShell).to.exist;
			Expect(tmpShell.getCenterEl()).to.exist;
		});

		test('throws when viewport selector matches nothing', () =>
		{
			let { Modal } = makeShell();
			Expect(() => Modal.shell('#missing-selector')).to.throw(/viewport not found/);
		});

		test('builds the row + center skeleton inside the viewport', () =>
		{
			let { Modal, Host } = makeShell();
			Modal.shell(Host);
			Expect(Host.querySelector('.pict-modal-shell')).to.exist;
			Expect(Host.querySelector('.pict-modal-shell-row-top')).to.exist;
			Expect(Host.querySelector('.pict-modal-shell-row-middle')).to.exist;
			Expect(Host.querySelector('.pict-modal-shell-row-bottom')).to.exist;
			Expect(Host.querySelector('.pict-modal-shell-side-left')).to.exist;
			Expect(Host.querySelector('.pict-modal-shell-side-right')).to.exist;
			Expect(Host.querySelector('.pict-modal-shell-center')).to.exist;
		});
	});

	suite('addPanel()', () =>
	{
		test('top panel mounts in the top row, applies height', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({
				Hash: 'topbar', Side: 'top', Mode: 'fixed', Size: 60,
				ContentDestinationId: 'TopDest'
			});
			Expect(Host.querySelector('.pict-modal-shell-row-top .pict-modal-shell-panel')).to.exist;
			Expect(tmpPanel.El.style.height).to.equal('60px');
			Expect(Host.querySelector('#TopDest')).to.exist;
		});

		test('left panel mounts in the left stack, applies width', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({
				Hash: 'sidebar', Side: 'left', Mode: 'fixed', Size: 280,
				ContentDestinationId: 'LeftDest'
			});
			Expect(Host.querySelector('.pict-modal-shell-side-left .pict-modal-shell-panel')).to.exist;
			Expect(tmpPanel.El.style.width).to.equal('280px');
		});

		test('multiple top panels stack in registration order', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			tmpShell.addPanel({ Hash: 'topA', Side: 'top', Size: 40 });
			tmpShell.addPanel({ Hash: 'topB', Side: 'top', Size: 40 });
			let tmpPanels = Host.querySelectorAll('.pict-modal-shell-row-top .pict-modal-shell-panel');
			Expect(tmpPanels.length).to.equal(2);
			Expect(tmpPanels[0].getAttribute('data-shell-panel-hash')).to.equal('topA');
			Expect(tmpPanels[1].getAttribute('data-shell-panel-hash')).to.equal('topB');
		});

		test('multiple left panels stack side-by-side in registration order', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			tmpShell.addPanel({ Hash: 'leftA', Side: 'left', Size: 60 });
			tmpShell.addPanel({ Hash: 'leftB', Side: 'left', Size: 200 });
			let tmpPanels = Host.querySelectorAll('.pict-modal-shell-side-left .pict-modal-shell-panel');
			Expect(tmpPanels.length).to.equal(2);
			Expect(tmpPanels[0].getAttribute('data-shell-panel-hash')).to.equal('leftA');
			Expect(tmpPanels[1].getAttribute('data-shell-panel-hash')).to.equal('leftB');
		});

		test('overlay-position panels mount on the overlay layer, not the side stack', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			tmpShell.addPanel({ Hash: 'over', Side: 'left', Position: 'overlay', Size: 200 });
			Expect(Host.querySelector('.pict-modal-shell-side-left .pict-modal-shell-panel')).to.equal(null);
			Expect(Host.querySelector('.pict-modal-shell-overlay-layer .pict-modal-shell-panel')).to.exist;
		});

		test('fixed mode has no resize handle and no collapse tab', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({ Hash: 'p', Side: 'top', Mode: 'fixed', Size: 60 });
			Expect(tmpPanel.El.querySelector('.pict-modal-shell-panel-resize-handle')).to.equal(null);
			Expect(tmpPanel.El.querySelector('.pict-modal-shell-panel-collapse-tab')).to.equal(null);
		});

		test('collapsible mode has collapse tab but no resize handle', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({ Hash: 'p', Side: 'left', Mode: 'collapsible', Size: 200, Title: 'Nav' });
			Expect(tmpPanel.El.querySelector('.pict-modal-shell-panel-collapse-tab')).to.exist;
			Expect(tmpPanel.El.querySelector('.pict-modal-shell-panel-resize-handle')).to.equal(null);
		});

		test('resizable mode has both collapse tab and resize handle', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({ Hash: 'p', Side: 'left', Mode: 'resizable', Size: 200, Title: 'Nav' });
			Expect(tmpPanel.El.querySelector('.pict-modal-shell-panel-collapse-tab')).to.exist;
			Expect(tmpPanel.El.querySelector('.pict-modal-shell-panel-resize-handle')).to.exist;
		});

		test('content destination is reachable via #id selector', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			tmpShell.addPanel({ Hash: 'p', Side: 'left', Size: 200, ContentDestinationId: 'My-Sidebar-Dest' });
			let tmpDest = document.getElementById('My-Sidebar-Dest');
			Expect(tmpDest).to.exist;
			Expect(tmpDest.classList.contains('pict-modal-shell-panel-content-inner')).to.equal(true);
		});

		test('center({ ContentDestinationId }) creates the inner destination', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			tmpShell.center({ ContentDestinationId: 'Workspace-Dest' });
			let tmpDest = document.getElementById('Workspace-Dest');
			Expect(tmpDest).to.exist;
		});
	});

	suite('collapse / expand', () =>
	{
		test('toggle flips state, applies the collapsed-class, and shrinks visible size', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({
				Hash: 'p', Side: 'left', Mode: 'collapsible', Size: 280,
				CollapsedSize: 24
			});
			Expect(tmpPanel.El.style.width).to.equal('280px');
			Expect(tmpPanel.Collapsed).to.equal(false);

			tmpPanel.toggle();
			Expect(tmpPanel.Collapsed).to.equal(true);
			Expect(tmpPanel.El.classList.contains('pict-modal-shell-panel-collapsed')).to.equal(true);
			Expect(tmpPanel.El.style.width).to.equal('24px');

			tmpPanel.toggle();
			Expect(tmpPanel.Collapsed).to.equal(false);
			Expect(tmpPanel.El.style.width).to.equal('280px');
		});

		test('OnToggle callback fires on collapse/expand', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			let tmpHistory = [];
			let tmpPanel = tmpShell.addPanel({
				Hash: 'p', Side: 'left', Mode: 'collapsible', Size: 200,
				OnToggle: (pCollapsed) => { tmpHistory.push(pCollapsed); }
			});
			tmpPanel.collapse();
			tmpPanel.expand();
			Expect(tmpHistory).to.deep.equal([true, false]);
		});
	});

	suite('setSize()', () =>
	{
		test('clamps to MinSize and MaxSize', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({
				Hash: 'p', Side: 'left', Mode: 'resizable',
				Size: 200, MinSize: 100, MaxSize: 400
			});
			tmpPanel.setSize(50);
			Expect(tmpPanel.Size).to.equal(100);
			Expect(tmpPanel.El.style.width).to.equal('100px');

			tmpPanel.setSize(9999);
			Expect(tmpPanel.Size).to.equal(400);
			Expect(tmpPanel.El.style.width).to.equal('400px');

			tmpPanel.setSize(250);
			Expect(tmpPanel.Size).to.equal(250);
		});

		test('ignores non-finite input', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({
				Hash: 'p', Side: 'left', Mode: 'resizable', Size: 200
			});
			tmpPanel.setSize(NaN);
			Expect(tmpPanel.Size).to.equal(200);
			tmpPanel.setSize('not a number');
			Expect(tmpPanel.Size).to.equal(200);
		});
	});

	suite('persistence', () =>
	{
		test('collapsed state persists across shell instances at the same scope', () =>
		{
			// Round 1: create shell, collapse the panel.
			let r1 = makeShell();
			let tmpShellA = r1.Modal.shell(r1.Host, { PersistenceKey: 'app-1' });
			let tmpPanelA = tmpShellA.addPanel({
				Hash: 'sidebar', Side: 'left', Mode: 'collapsible', Size: 280
			});
			tmpPanelA.collapse();
			Expect(tmpPanelA.Collapsed).to.equal(true);

			// Round 2: tear down and recreate. New shell should restore collapsed=true.
			document.body.innerHTML = '';
			let r2 = makeShell();
			let tmpShellB = r2.Modal.shell(r2.Host, { PersistenceKey: 'app-1' });
			let tmpPanelB = tmpShellB.addPanel({
				Hash: 'sidebar', Side: 'left', Mode: 'collapsible', Size: 280
			});
			Expect(tmpPanelB.Collapsed).to.equal(true);
		});

		test('resized size persists across shell instances', () =>
		{
			let r1 = makeShell();
			let tmpShellA = r1.Modal.shell(r1.Host, { PersistenceKey: 'app-2' });
			let tmpPanelA = tmpShellA.addPanel({
				Hash: 'sidebar', Side: 'left', Mode: 'resizable',
				Size: 280, MinSize: 100, MaxSize: 600
			});
			tmpPanelA.setSize(420);
			tmpPanelA._persist();   // simulate end-of-drag

			document.body.innerHTML = '';
			let r2 = makeShell();
			let tmpShellB = r2.Modal.shell(r2.Host, { PersistenceKey: 'app-2' });
			let tmpPanelB = tmpShellB.addPanel({
				Hash: 'sidebar', Side: 'left', Mode: 'resizable',
				Size: 280, MinSize: 100, MaxSize: 600
			});
			Expect(tmpPanelB.Size).to.equal(420);
		});

		test('Persistence: false on shell skips both load and save', () =>
		{
			let r1 = makeShell();
			let tmpShellA = r1.Modal.shell(r1.Host, { Persistence: false, PersistenceKey: 'app-3' });
			let tmpPanelA = tmpShellA.addPanel({
				Hash: 'sidebar', Side: 'left', Mode: 'collapsible', Size: 280
			});
			tmpPanelA.collapse();

			Expect(window.localStorage.getItem('pict-modal-shell:app-3')).to.equal(null);
		});

		test('different scopes do not see each other\'s state', () =>
		{
			let r1 = makeShell();
			let tmpShellA = r1.Modal.shell(r1.Host, { PersistenceKey: 'app-A' });
			tmpShellA.addPanel({ Hash: 'x', Side: 'left', Mode: 'collapsible', Size: 200 }).collapse();

			document.body.innerHTML = '';
			let r2 = makeShell();
			let tmpShellB = r2.Modal.shell(r2.Host, { PersistenceKey: 'app-B' });
			let tmpPanel = tmpShellB.addPanel({ Hash: 'x', Side: 'left', Mode: 'collapsible', Size: 200 });
			Expect(tmpPanel.Collapsed).to.equal(false);
		});
	});

	suite('ContentView binding + popup() unified codepath', () =>
	{
		// Helper: register a fake view on a pict instance that records
		// every render() call into an array. Mimics enough of pict-view
		// for shell.addPanel({ ContentView: ... }) lookups.
		function registerSpyView(pPict, pHash)
		{
			let tmpRenders = [];
			let tmpView = { render: function () { tmpRenders.push(Date.now()); } };
			pPict.views = pPict.views || {};
			pPict.views[pHash] = tmpView;
			return { view: tmpView, renders: tmpRenders };
		}

		test('addPanel auto-renders the bound ContentView once on creation', () =>
		{
			let { Pict, Modal, Host } = makeShell();
			let spy = registerSpyView(Pict, 'My-Content-View');

			let tmpShell = Modal.shell(Host);
			tmpShell.addPanel({
				Hash: 'cv', Side: 'left', Mode: 'collapsible', Size: 220,
				ContentDestinationId: 'CV-Dest',
				ContentView: 'My-Content-View'
			});

			Expect(spy.renders.length).to.equal(1);
		});

		test('expanding a panel re-renders the ContentView (transition-only, not on collapse)', () =>
		{
			let { Pict, Modal, Host } = makeShell();
			let spy = registerSpyView(Pict, 'X');

			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({
				Hash: 'p', Side: 'left', Mode: 'collapsible', Size: 220,
				ContentView: 'X', Collapsed: true
			});
			Expect(spy.renders.length).to.equal(1);  // creation render

			tmpPanel.expand();
			Expect(spy.renders.length).to.equal(2);  // expand render

			tmpPanel.collapse();
			Expect(spy.renders.length).to.equal(2);  // no render on collapse

			tmpPanel.expand();
			Expect(spy.renders.length).to.equal(3);  // expand render again
		});

		test('popup() expands a collapsed panel + renders the view', () =>
		{
			let { Pict, Modal, Host } = makeShell();
			let spy = registerSpyView(Pict, 'X');

			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({
				Hash: 'p', Side: 'left', Mode: 'collapsible', Size: 220,
				ContentView: 'X', Collapsed: true
			});
			let tmpRendersAtStart = spy.renders.length;

			tmpPanel.popup();
			Expect(tmpPanel.Collapsed).to.equal(false);
			Expect(spy.renders.length).to.equal(tmpRendersAtStart + 1);
		});

		test('popup() on an already-open panel re-renders + adds the flash class', () =>
		{
			let { Pict, Modal, Host } = makeShell();
			let spy = registerSpyView(Pict, 'X');

			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({
				Hash: 'p', Side: 'left', Mode: 'collapsible', Size: 220,
				ContentView: 'X', Collapsed: false
			});
			let tmpStartRenders = spy.renders.length;

			tmpPanel.popup();
			Expect(tmpPanel.Collapsed).to.equal(false);
			Expect(spy.renders.length).to.equal(tmpStartRenders + 1);
			Expect(tmpPanel.El.classList.contains('pict-modal-shell-panel-flash')).to.equal(true);
		});

		test('OnExpand fires only on collapsed→expanded; OnCollapse fires only on expanded→collapsed', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpExpands = 0, tmpCollapses = 0;
			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({
				Hash: 'p', Side: 'left', Mode: 'collapsible', Size: 220,
				Collapsed: true,
				OnExpand:   function () { tmpExpands++; },
				OnCollapse: function () { tmpCollapses++; }
			});

			tmpPanel.expand();   Expect([tmpExpands, tmpCollapses]).to.deep.equal([1, 0]);
			tmpPanel.expand();   Expect([tmpExpands, tmpCollapses]).to.deep.equal([1, 0]);  // no-op
			tmpPanel.collapse(); Expect([tmpExpands, tmpCollapses]).to.deep.equal([1, 1]);
			tmpPanel.collapse(); Expect([tmpExpands, tmpCollapses]).to.deep.equal([1, 1]);  // no-op
			tmpPanel.expand();   Expect([tmpExpands, tmpCollapses]).to.deep.equal([2, 1]);
		});

		test('OnToggle still fires on every transition for back-compat', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpHistory = [];
			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({
				Hash: 'p', Side: 'left', Mode: 'collapsible', Size: 220,
				Collapsed: false,
				OnToggle: function (pCollapsed) { tmpHistory.push(pCollapsed); }
			});
			tmpPanel.collapse();
			tmpPanel.expand();
			Expect(tmpHistory).to.deep.equal([true, false]);
		});

		test('shell.openPanel(hash) is a shortcut for getPanel(hash).popup()', () =>
		{
			let { Pict, Modal, Host } = makeShell();
			let spy = registerSpyView(Pict, 'X');

			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({
				Hash: 'logbar', Side: 'bottom', Mode: 'collapsible', Size: 100,
				ContentView: 'X', Collapsed: true
			});

			let tmpResult = tmpShell.openPanel('logbar');
			Expect(tmpResult).to.equal(tmpPanel);
			Expect(tmpPanel.Collapsed).to.equal(false);
		});

		test('shell.openPanel(unknown-hash) returns null + does not throw', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host);
			let tmpResult = tmpShell.openPanel('nope');
			Expect(tmpResult).to.equal(null);
		});

		test('getContentView returns the bound view instance, or null if missing', () =>
		{
			let { Pict, Modal, Host } = makeShell();
			let spy = registerSpyView(Pict, 'My-View');

			let tmpShell = Modal.shell(Host);
			let tmpPanel = tmpShell.addPanel({ Hash: 'a', Side: 'left', Size: 200, ContentView: 'My-View' });
			Expect(tmpPanel.getContentView()).to.equal(spy.view);

			let tmpPanel2 = tmpShell.addPanel({ Hash: 'b', Side: 'right', Size: 200 });
			Expect(tmpPanel2.getContentView()).to.equal(null);

			let tmpPanel3 = tmpShell.addPanel({ Hash: 'c', Side: 'right', Size: 200, ContentView: 'Not-Registered' });
			Expect(tmpPanel3.getContentView()).to.equal(null);
		});
	});

	suite('integration', () =>
	{
		test('full retold-manager-shaped layout: top + bottom + left, with center', () =>
		{
			let { Modal, Host } = makeShell();
			let tmpShell = Modal.shell(Host, { PersistenceKey: 'integration-test' });
			tmpShell.addPanel({ Hash: 'top', Side: 'top', Size: 60, ContentDestinationId: 'I-Top' });
			tmpShell.addPanel({ Hash: 'bot', Side: 'bottom', Size: 28, ContentDestinationId: 'I-Bot' });
			tmpShell.addPanel({ Hash: 'lhs', Side: 'left', Mode: 'resizable', Size: 280, ContentDestinationId: 'I-Lhs' });
			tmpShell.center({ ContentDestinationId: 'I-Center' });

			Expect(document.getElementById('I-Top')).to.exist;
			Expect(document.getElementById('I-Bot')).to.exist;
			Expect(document.getElementById('I-Lhs')).to.exist;
			Expect(document.getElementById('I-Center')).to.exist;
			Expect(tmpShell.getPanel('lhs').Mode).to.equal('resizable');
			Expect(tmpShell.getPanels().length).to.equal(3);
		});
	});
});
