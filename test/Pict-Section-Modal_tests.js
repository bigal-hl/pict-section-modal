/**
 * Unit tests for Pict-Section-Modal
 */
const libBrowserEnv = require('browser-env');
// `url` keeps the jsdom origin non-opaque so localStorage is reachable
// for the Shell tests (which run in the same suite). Without it a
// SecurityError fires on every localStorage access.
libBrowserEnv({ url: 'http://localhost/' });

const Chai = require('chai');
const Expect = Chai.expect;

const libPict = require('pict');

const libPictSectionModal = require('../source/Pict-Section-Modal.js');

function cleanupDOM()
{
	let tmpSelectors = ['.pict-modal-overlay', '.pict-modal-dialog', '.pict-modal-toast-container', '.pict-modal-toast', '.pict-modal-tooltip'];
	for (let i = 0; i < tmpSelectors.length; i++)
	{
		let tmpElements = document.querySelectorAll(tmpSelectors[i]);
		for (let j = 0; j < tmpElements.length; j++)
		{
			if (tmpElements[j].parentNode)
			{
				tmpElements[j].parentNode.removeChild(tmpElements[j]);
			}
		}
	}
}

suite
(
	'Pict-Section-Modal',
	() =>
	{
		teardown(() => { cleanupDOM(); });

		suite
		(
			'Module Exports',
			() =>
			{
				test
				(
					'Module exports a class',
					(fDone) =>
					{
						Expect(typeof libPictSectionModal).to.equal('function');
						fDone();
					}
				);
				test
				(
					'Module exports default_configuration',
					(fDone) =>
					{
						Expect(libPictSectionModal.default_configuration).to.be.an('object');
						Expect(libPictSectionModal.default_configuration.ViewIdentifier).to.equal('Pict-Section-Modal');
						Expect(libPictSectionModal.default_configuration.CSS).to.be.a('string');
						Expect(libPictSectionModal.default_configuration.DefaultConfirmOptions).to.be.an('object');
						Expect(libPictSectionModal.default_configuration.DefaultDoubleConfirmOptions).to.be.an('object');
						Expect(libPictSectionModal.default_configuration.DefaultModalOptions).to.be.an('object');
						Expect(libPictSectionModal.default_configuration.DefaultTooltipOptions).to.be.an('object');
						Expect(libPictSectionModal.default_configuration.DefaultToastOptions).to.be.an('object');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Initialization',
			() =>
			{
				test
				(
					'Can create an instance with default options',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						Expect(tmpModal).to.be.an('object');
						Expect(tmpModal._activeModals).to.be.an('array').that.is.empty;
						Expect(tmpModal._activeTooltips).to.be.an('array').that.is.empty;
						Expect(tmpModal._activeToasts).to.be.an('array').that.is.empty;
						Expect(tmpModal._idCounter).to.equal(0);
						fDone();
					}
				);
				test
				(
					'ID counter increments',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpId1 = tmpModal._nextId();
						let tmpId2 = tmpModal._nextId();
						Expect(tmpId1).to.equal(1);
						Expect(tmpId2).to.equal(2);
						fDone();
					}
				);
			}
		);

		suite
		(
			'Public API',
			() =>
			{
				test
				(
					'All public methods exist',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						Expect(typeof tmpModal.confirm).to.equal('function');
						Expect(typeof tmpModal.doubleConfirm).to.equal('function');
						Expect(typeof tmpModal.show).to.equal('function');
						Expect(typeof tmpModal.tooltip).to.equal('function');
						Expect(typeof tmpModal.richTooltip).to.equal('function');
						Expect(typeof tmpModal.toast).to.equal('function');
						Expect(typeof tmpModal.dismissAll).to.equal('function');
						Expect(typeof tmpModal.dismissModals).to.equal('function');
						Expect(typeof tmpModal.dismissTooltips).to.equal('function');
						Expect(typeof tmpModal.dismissToasts).to.equal('function');
						Expect(typeof tmpModal.destroy).to.equal('function');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Confirm Dialogs',
			() =>
			{
				test
				(
					'confirm() returns a Promise',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpResult = tmpModal.confirm('Are you sure?');
						Expect(tmpResult).to.be.an.instanceOf(Promise);

						tmpModal.dismissModals();
						tmpResult.then(() => { fDone(); });
					}
				);
				test
				(
					'confirm() creates a dialog element in the DOM',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.confirm('Test message');

						let tmpDialogEl = tmpModal._activeModals[0].element;
						Expect(tmpDialogEl).to.not.be.null;

						let tmpBody = tmpDialogEl.querySelector('.pict-modal-dialog-body');
						Expect(tmpBody.textContent).to.contain('Test message');

						tmpModal.dismissModals();
						fDone();
					}
				);
				test
				(
					'confirm() resolves true when confirm button is clicked',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.confirm('Confirm this?').then((pResult) =>
						{
							Expect(pResult).to.equal(true);
							fDone();
						});

						let tmpDialogEl = tmpModal._activeModals[0].element;
						tmpDialogEl.querySelector('[data-action="confirm"]').click();
					}
				);
				test
				(
					'confirm() resolves false when cancel button is clicked',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.confirm('Cancel this?').then((pResult) =>
						{
							Expect(pResult).to.equal(false);
							fDone();
						});

						let tmpDialogEl = tmpModal._activeModals[0].element;
						tmpDialogEl.querySelector('[data-action="cancel"]').click();
					}
				);
				test
				(
					'confirm() resolves false when close button is clicked',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.confirm('Close this?').then((pResult) =>
						{
							Expect(pResult).to.equal(false);
							fDone();
						});

						let tmpDialogEl = tmpModal._activeModals[0].element;
						tmpDialogEl.querySelector('.pict-modal-dialog-close').click();
					}
				);
				test
				(
					'confirm() with dangerous option uses danger button style',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.confirm('Delete everything?', { dangerous: true });

						let tmpDialogEl = tmpModal._activeModals[0].element;
						let tmpConfirmBtn = tmpDialogEl.querySelector('[data-action="confirm"]');
						Expect(tmpConfirmBtn.classList.contains('pict-modal-btn--danger')).to.equal(true);

						tmpModal.dismissModals();
						fDone();
					}
				);
				test
				(
					'confirm() with custom labels',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.confirm('Custom?', { confirmLabel: 'Yes', cancelLabel: 'No' });

						let tmpDialogEl = tmpModal._activeModals[0].element;
						Expect(tmpDialogEl.querySelector('[data-action="confirm"]').textContent).to.equal('Yes');
						Expect(tmpDialogEl.querySelector('[data-action="cancel"]').textContent).to.equal('No');

						tmpModal.dismissModals();
						fDone();
					}
				);
			}
		);

		suite
		(
			'Double Confirm Dialogs',
			() =>
			{
				test
				(
					'doubleConfirm() returns a Promise',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpResult = tmpModal.doubleConfirm('Really?');
						Expect(tmpResult).to.be.an.instanceOf(Promise);

						tmpModal.dismissModals();
						tmpResult.then(() => { fDone(); });
					}
				);
				test
				(
					'doubleConfirm() with phrase starts with confirm button disabled',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.doubleConfirm('Delete?', { confirmPhrase: 'DELETE' });

						let tmpDialogEl = tmpModal._activeModals[0].element;
						let tmpConfirmBtn = tmpDialogEl.querySelector('[data-action="confirm"]');
						Expect(tmpConfirmBtn.disabled).to.equal(true);

						tmpModal.dismissModals();
						fDone();
					}
				);
				test
				(
					'doubleConfirm() with phrase enables button after correct input',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.doubleConfirm('Delete?', { confirmPhrase: 'DELETE' });

						let tmpDialogEl = tmpModal._activeModals[0].element;
						let tmpInput = tmpDialogEl.querySelector('.pict-modal-confirm-input');
						let tmpConfirmBtn = tmpDialogEl.querySelector('[data-action="confirm"]');

						// Use document.createEvent for jsdom compatibility
						tmpInput.value = 'WRONG';
						let tmpEvent1 = document.createEvent('Event');
						tmpEvent1.initEvent('input', true, true);
						tmpInput.dispatchEvent(tmpEvent1);
						Expect(tmpConfirmBtn.disabled).to.equal(true);

						tmpInput.value = 'DELETE';
						let tmpEvent2 = document.createEvent('Event');
						tmpEvent2.initEvent('input', true, true);
						tmpInput.dispatchEvent(tmpEvent2);
						Expect(tmpConfirmBtn.disabled).to.equal(false);

						tmpModal.dismissModals();
						fDone();
					}
				);
				test
				(
					'doubleConfirm() without phrase uses two-click pattern',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.doubleConfirm('Really delete?').then((pResult) =>
						{
							Expect(pResult).to.equal(true);
							fDone();
						});

						let tmpDialogEl = tmpModal._activeModals[0].element;
						let tmpConfirmBtn = tmpDialogEl.querySelector('[data-action="confirm"]');
						Expect(tmpConfirmBtn.disabled).to.equal(false);

						tmpConfirmBtn.click();
						Expect(tmpConfirmBtn.textContent).to.equal('Click again to confirm');

						tmpConfirmBtn.click();
					}
				);
			}
		);

		suite
		(
			'Modal Windows',
			() =>
			{
				test
				(
					'show() returns a Promise',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpResult = tmpModal.show({ title: 'Test' });
						Expect(tmpResult).to.be.an.instanceOf(Promise);

						tmpModal.dismissModals();
						tmpResult.then(() => { fDone(); });
					}
				);
				test
				(
					'show() renders custom content and buttons',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.show(
						{
							title: 'Choose',
							content: '<p>Pick one</p>',
							buttons:
							[
								{ Hash: 'save', Label: 'Save', Style: 'primary' },
								{ Hash: 'discard', Label: 'Discard', Style: 'danger' }
							]
						});

						let tmpDialogEl = tmpModal._activeModals[0].element;
						Expect(tmpDialogEl.querySelector('.pict-modal-dialog-title').textContent).to.equal('Choose');
						Expect(tmpDialogEl.querySelector('.pict-modal-dialog-body').innerHTML).to.contain('Pick one');

						let tmpButtons = tmpDialogEl.querySelectorAll('[data-hash]');
						Expect(tmpButtons.length).to.equal(2);
						Expect(tmpButtons[0].getAttribute('data-hash')).to.equal('save');
						Expect(tmpButtons[1].getAttribute('data-hash')).to.equal('discard');

						tmpModal.dismissModals();
						fDone();
					}
				);
				test
				(
					'show() resolves with button Hash when clicked',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.show(
						{
							title: 'Test',
							buttons: [{ Hash: 'ok', Label: 'OK', Style: 'primary' }]
						}).then((pResult) =>
						{
							Expect(pResult).to.equal('ok');
							fDone();
						});

						let tmpDialogEl = tmpModal._activeModals[0].element;
						tmpDialogEl.querySelector('[data-hash="ok"]').click();
					}
				);
				test
				(
					'show() resolves null when close button is clicked',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.show({ title: 'Closeable', closeable: true }).then((pResult) =>
						{
							Expect(pResult).to.equal(null);
							fDone();
						});

						let tmpDialogEl = tmpModal._activeModals[0].element;
						tmpDialogEl.querySelector('.pict-modal-dialog-close').click();
					}
				);
				test
				(
					'show() calls onOpen callback',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);
						let tmpOpenCalled = false;

						tmpModal.show(
						{
							title: 'Open Test',
							onOpen: (pDialog) =>
							{
								tmpOpenCalled = true;
								Expect(pDialog).to.be.an.instanceOf(HTMLElement);
							}
						});

						Expect(tmpOpenCalled).to.equal(true);
						tmpModal.dismissModals();
						fDone();
					}
				);
			}
		);

		suite
		(
			'Toast Notifications',
			() =>
			{
				test
				(
					'toast() creates a toast element',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpHandle = tmpModal.toast('Hello!', { duration: 0 });
						Expect(tmpHandle).to.be.an('object');
						Expect(typeof tmpHandle.dismiss).to.equal('function');

						let tmpToastEl = tmpModal._activeToasts[0].element;
						Expect(tmpToastEl.textContent).to.contain('Hello!');

						tmpHandle.dismiss();
						fDone();
					}
				);
				test
				(
					'toast() applies type class',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.toast('Success!', { type: 'success', duration: 0 });

						let tmpToastEl = tmpModal._activeToasts[0].element;
						Expect(tmpToastEl.classList.contains('pict-modal-toast--success')).to.equal(true);

						tmpModal.dismissToasts();
						fDone();
					}
				);
				test
				(
					'toast() dismiss removes element from tracking',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpHandle = tmpModal.toast('Bye!', { duration: 0 });
						Expect(tmpModal._activeToasts.length).to.equal(1);

						tmpHandle.dismiss();
						Expect(tmpModal._activeToasts.length).to.equal(0);

						fDone();
					}
				);
				test
				(
					'toast() with dismissible shows dismiss button',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.toast('Dismissible', { duration: 0, dismissible: true });

						let tmpToastEl = tmpModal._activeToasts[0].element;
						let tmpDismissBtn = tmpToastEl.querySelector('.pict-modal-toast-dismiss');
						Expect(tmpDismissBtn).to.not.be.null;

						tmpModal.dismissToasts();
						fDone();
					}
				);
				test
				(
					'toast() auto-dismisses after duration',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.toast('Auto', { duration: 50 });
						Expect(tmpModal._activeToasts.length).to.equal(1);

						setTimeout(() =>
						{
							Expect(tmpModal._activeToasts.length).to.equal(0);
							fDone();
						}, 300);
					}
				);
				test
				(
					'toast() stacks multiple toasts',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.toast('First', { duration: 0 });
						tmpModal.toast('Second', { duration: 0 });
						tmpModal.toast('Third', { duration: 0 });

						Expect(tmpModal._activeToasts.length).to.equal(3);

						tmpModal.dismissToasts();
						Expect(tmpModal._activeToasts.length).to.equal(0);
						fDone();
					}
				);
			}
		);

		suite
		(
			'Tooltips',
			() =>
			{
				test
				(
					'tooltip() returns a handle with destroy',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('button');
						tmpTarget.textContent = 'Hover me';
						document.body.appendChild(tmpTarget);

						let tmpHandle = tmpModal.tooltip(tmpTarget, 'Tooltip text');
						Expect(tmpHandle).to.be.an('object');
						Expect(typeof tmpHandle.destroy).to.equal('function');

						tmpHandle.destroy();
						document.body.removeChild(tmpTarget);
						fDone();
					}
				);
				test
				(
					'richTooltip() returns a handle with destroy',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('button');
						tmpTarget.textContent = 'Hover me';
						document.body.appendChild(tmpTarget);

						let tmpHandle = tmpModal.richTooltip(tmpTarget, '<strong>Rich</strong>');
						Expect(tmpHandle).to.be.an('object');
						Expect(typeof tmpHandle.destroy).to.equal('function');

						tmpHandle.destroy();
						document.body.removeChild(tmpTarget);
						fDone();
					}
				);
				test
				(
					'tooltip destroy cleans up',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('button');
						document.body.appendChild(tmpTarget);

						let tmpHandle = tmpModal.tooltip(tmpTarget, 'Test');

						// Simulate showing via mouseenter using document.createEvent for jsdom compat
						let tmpMouseEnter = document.createEvent('Event');
						tmpMouseEnter.initEvent('mouseenter', true, true);
						tmpTarget.dispatchEvent(tmpMouseEnter);

						tmpHandle.destroy();
						Expect(tmpModal._activeTooltips.length).to.equal(0);

						document.body.removeChild(tmpTarget);
						fDone();
					}
				);
			}
		);

		suite
		(
			'Overlay',
			() =>
			{
				test
				(
					'Overlay is created when modal opens',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.confirm('Test overlay');

						let tmpOverlay = document.querySelector('.pict-modal-overlay');
						Expect(tmpOverlay).to.not.be.null;

						tmpModal.dismissModals();
						fDone();
					}
				);
				test
				(
					'Overlay reference counting works',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						Expect(tmpModal._overlay._refCount).to.equal(0);

						tmpModal.confirm('Modal 1');
						Expect(tmpModal._overlay._refCount).to.equal(1);

						tmpModal.confirm('Modal 2');
						Expect(tmpModal._overlay._refCount).to.equal(2);

						let tmpTopModal = tmpModal._activeModals[tmpModal._activeModals.length - 1];
						tmpTopModal.dismiss(false);
						Expect(tmpModal._overlay._refCount).to.equal(1);

						tmpModal.dismissModals();
						fDone();
					}
				);
			}
		);

		suite
		(
			'Dismiss All',
			() =>
			{
				test
				(
					'dismissAll() cleans up modals and toasts',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.confirm('Modal 1');
						tmpModal.toast('Toast 1', { duration: 0 });

						Expect(tmpModal._activeModals.length).to.equal(1);
						Expect(tmpModal._activeToasts.length).to.equal(1);

						tmpModal.dismissAll();

						Expect(tmpModal._activeModals.length).to.equal(0);
						Expect(tmpModal._activeToasts.length).to.equal(0);

						fDone();
					}
				);
			}
		);

		suite
		(
			'Configuration Override',
			() =>
			{
				test
				(
					'Custom options override defaults',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal',
						{
							DefaultConfirmOptions:
							{
								title: 'Custom Confirm',
								confirmLabel: 'Yes!',
								cancelLabel: 'Nope',
								dangerous: false
							}
						}, libPictSectionModal);

						Expect(tmpModal.options.DefaultConfirmOptions.title).to.equal('Custom Confirm');
						Expect(tmpModal.options.DefaultConfirmOptions.confirmLabel).to.equal('Yes!');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Panel',
			() =>
			{
				test
				(
					'panel() returns a handle with expected methods',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('div');
						tmpTarget.id = 'test-panel-1';
						document.body.appendChild(tmpTarget);

						let tmpHandle = tmpModal.panel('#test-panel-1', { position: 'right', width: 300 });

						Expect(tmpHandle).to.have.property('collapse').that.is.a('function');
						Expect(tmpHandle).to.have.property('expand').that.is.a('function');
						Expect(tmpHandle).to.have.property('toggle').that.is.a('function');
						Expect(tmpHandle).to.have.property('setWidth').that.is.a('function');
						Expect(tmpHandle).to.have.property('destroy').that.is.a('function');

						tmpHandle.destroy();
						tmpTarget.remove();
						fDone();
					}
				);

				test
				(
					'panel() adds CSS classes and edge element to target',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('div');
						tmpTarget.id = 'test-panel-2';
						document.body.appendChild(tmpTarget);

						let tmpHandle = tmpModal.panel('#test-panel-2', { position: 'right', width: 350 });

						Expect(tmpTarget.classList.contains('pict-panel')).to.be.true;
						Expect(tmpTarget.classList.contains('pict-panel-right')).to.be.true;
						Expect(tmpTarget.style.width).to.equal('350px');

						let tmpEdge = tmpTarget.querySelector('.pict-panel-edge');
						Expect(tmpEdge).to.not.be.null;
						Expect(tmpEdge.querySelector('.pict-panel-resize')).to.not.be.null;
						Expect(tmpEdge.querySelector('.pict-panel-tab')).to.not.be.null;

						tmpHandle.destroy();
						tmpTarget.remove();
						fDone();
					}
				);

				test
				(
					'collapse() and expand() toggle the collapsed class',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('div');
						tmpTarget.id = 'test-panel-3';
						document.body.appendChild(tmpTarget);

						let tmpHandle = tmpModal.panel('#test-panel-3', { width: 300 });

						Expect(tmpTarget.classList.contains('pict-panel-collapsed')).to.be.false;

						tmpHandle.collapse();
						Expect(tmpTarget.classList.contains('pict-panel-collapsed')).to.be.true;

						tmpHandle.expand();
						Expect(tmpTarget.classList.contains('pict-panel-collapsed')).to.be.false;
						Expect(tmpTarget.style.width).to.equal('300px');

						tmpHandle.destroy();
						tmpTarget.remove();
						fDone();
					}
				);

				test
				(
					'toggle() alternates collapsed state',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('div');
						tmpTarget.id = 'test-panel-4';
						document.body.appendChild(tmpTarget);

						let tmpHandle = tmpModal.panel('#test-panel-4', { width: 300 });

						tmpHandle.toggle();
						Expect(tmpTarget.classList.contains('pict-panel-collapsed')).to.be.true;

						tmpHandle.toggle();
						Expect(tmpTarget.classList.contains('pict-panel-collapsed')).to.be.false;

						tmpHandle.destroy();
						tmpTarget.remove();
						fDone();
					}
				);

				test
				(
					'setWidth() clamps to min/max',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('div');
						tmpTarget.id = 'test-panel-5';
						document.body.appendChild(tmpTarget);

						let tmpHandle = tmpModal.panel('#test-panel-5', { width: 300, minWidth: 200, maxWidth: 500 });

						tmpHandle.setWidth(100);
						Expect(tmpTarget.style.width).to.equal('200px');

						tmpHandle.setWidth(800);
						Expect(tmpTarget.style.width).to.equal('500px');

						tmpHandle.setWidth(400);
						Expect(tmpTarget.style.width).to.equal('400px');

						tmpHandle.destroy();
						tmpTarget.remove();
						fDone();
					}
				);

				test
				(
					'starts collapsed when options.collapsed is true',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('div');
						tmpTarget.id = 'test-panel-6';
						document.body.appendChild(tmpTarget);

						let tmpHandle = tmpModal.panel('#test-panel-6', { width: 300, collapsed: true });

						Expect(tmpTarget.classList.contains('pict-panel-collapsed')).to.be.true;

						tmpHandle.destroy();
						tmpTarget.remove();
						fDone();
					}
				);

				test
				(
					'left panel uses correct CSS class',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('div');
						tmpTarget.id = 'test-panel-7';
						document.body.appendChild(tmpTarget);

						let tmpHandle = tmpModal.panel('#test-panel-7', { position: 'left', width: 250 });

						Expect(tmpTarget.classList.contains('pict-panel-left')).to.be.true;

						let tmpEdge = tmpTarget.querySelector('.pict-panel-edge-left');
						Expect(tmpEdge).to.not.be.null;

						tmpHandle.destroy();
						tmpTarget.remove();
						fDone();
					}
				);

				test
				(
					'destroy() removes classes and edge element',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('div');
						tmpTarget.id = 'test-panel-8';
						document.body.appendChild(tmpTarget);

						let tmpHandle = tmpModal.panel('#test-panel-8', { width: 300 });

						Expect(tmpTarget.querySelector('.pict-panel-edge')).to.not.be.null;

						tmpHandle.destroy();

						Expect(tmpTarget.classList.contains('pict-panel')).to.be.false;
						Expect(tmpTarget.querySelector('.pict-panel-edge')).to.be.null;

						tmpTarget.remove();
						fDone();
					}
				);

				test
				(
					'onToggle callback fires on collapse/expand',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpTarget = document.createElement('div');
						tmpTarget.id = 'test-panel-9';
						document.body.appendChild(tmpTarget);

						let tmpCallbacks = [];
						let tmpHandle = tmpModal.panel('#test-panel-9',
							{
								width: 300,
								onToggle: (pCollapsed) => { tmpCallbacks.push(pCollapsed); }
							});

						tmpHandle.collapse();
						tmpHandle.expand();

						Expect(tmpCallbacks).to.deep.equal([true, false]);

						tmpHandle.destroy();
						tmpTarget.remove();
						fDone();
					}
				);

				test
				(
					'panel() returns null handle for missing element',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						let tmpHandle = tmpModal.panel('#does-not-exist', { width: 300 });

						Expect(tmpHandle).to.have.property('toggle').that.is.a('function');
						Expect(tmpHandle).to.have.property('destroy').that.is.a('function');
						tmpHandle.toggle();
						tmpHandle.destroy();
						fDone();
					}
				);
			}
		);

		suite
		(
			'Destroy',
			() =>
			{
				test
				(
					'destroy() cleans up everything',
					(fDone) =>
					{
						let tmpPict = new libPict({ LogStreams: [{ loggertype: 'console', streamtype: 'console', level: 'error' }] });
						let tmpModal = tmpPict.addView('TestModal', {}, libPictSectionModal);

						tmpModal.confirm('Modal');
						tmpModal.toast('Toast', { duration: 0 });

						tmpModal.destroy();

						Expect(tmpModal._activeModals.length).to.equal(0);
						Expect(tmpModal._activeToasts.length).to.equal(0);
						fDone();
					}
				);
			}
		);
	}
);
