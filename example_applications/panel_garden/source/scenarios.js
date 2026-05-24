/**
 * Scenario catalog.  Each entry describes one panel-geometry config to
 * test.  The scenario view uses these to build a fresh shell on every
 * navigation, so the geometry under test is always clean.
 *
 * Schema:
 *   Id        — short slug used by the router + active highlighting
 *   Group     — toolbar-group label (e.g. "Side panels", "Stacked")
 *   Label     — short pill label
 *   Title     — H1 + status-line text describing what's being tested
 *   Notes     — markdown-ish bullets describing the geometry, shown
 *               beside the panel(s) so a viewer knows what to look at
 *   Panels    — array of addPanel() option objects.  Each panel uses
 *               Mode: 'resizable' so collapse + drag work; a Title
 *               drives the collapsed-state strip label.
 *   ExtraCSS  — optional per-scenario CSS injected into the shell
 *               wrapper.  Used for the "middle-anchored" + "thick" /
 *               "thin" variants — the stock per-side rules anchor the
 *               tab at right/top 14px from the corner; ExtraCSS pulls
 *               it to the center or grows/shrinks the size.
 */
'use strict';

// Re-used selector — every per-scenario override scopes its CSS to the
// scenario shell so we don't accidentally restyle some other shell on
// the page.  Children of .panel-garden-shell select the active scenario.
const _Scope = '.panel-garden-shell';

// Stock cosmetic — sets a 100×18 middle-centered tab on a bottom panel.
// Re-used in three scenarios with different content lengths.
function middleBottomCSS(pWidth)
{
	let tmpWidth = pWidth || 120;
	let tmpHalf  = Math.floor(tmpWidth / 2);
	return ''
		+ _Scope + ' .pict-modal-shell-panel-bottom > .pict-modal-shell-panel-collapse-tab {'
		+   ' width: ' + tmpWidth + 'px; height: 18px;'
		+   ' top: -18px; left: 50%; right: auto; margin-left: -' + tmpHalf + 'px;'
		+   ' padding: 0 10px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em;'
		+   ' text-transform: uppercase; line-height: 16px;'
		+ ' }\n'
		+ _Scope + ' .pict-modal-shell-panel-bottom > .pict-modal-shell-panel-collapse-tab .pict-modal-shell-panel-collapse-tab-title {'
		+   ' display: inline;'
		+ ' }\n'
		+ _Scope + ' .pict-modal-shell-panel-bottom > .pict-modal-shell-panel-collapse-tab::before { display: none; }\n'
		+ _Scope + ' .pict-modal-shell-panel-bottom:hover > .pict-modal-shell-panel-collapse-tab,'
		+ _Scope + ' .pict-modal-shell-panel-bottom > .pict-modal-shell-panel-collapse-tab:hover {'
		+   ' width: ' + tmpWidth + 'px; height: 18px; top: -18px; margin-left: -' + tmpHalf + 'px;'
		+ ' }\n';
}

function middleTopCSS(pWidth)
{
	let tmpWidth = pWidth || 120;
	let tmpHalf  = Math.floor(tmpWidth / 2);
	return ''
		+ _Scope + ' .pict-modal-shell-panel-top > .pict-modal-shell-panel-collapse-tab {'
		+   ' width: ' + tmpWidth + 'px; height: 18px;'
		+   ' bottom: -18px; left: 50%; right: auto; margin-left: -' + tmpHalf + 'px;'
		+   ' padding: 0 10px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em;'
		+   ' text-transform: uppercase; line-height: 16px;'
		+ ' }\n'
		+ _Scope + ' .pict-modal-shell-panel-top > .pict-modal-shell-panel-collapse-tab .pict-modal-shell-panel-collapse-tab-title { display: inline; }\n'
		+ _Scope + ' .pict-modal-shell-panel-top > .pict-modal-shell-panel-collapse-tab::before { display: none; }\n'
		+ _Scope + ' .pict-modal-shell-panel-top:hover > .pict-modal-shell-panel-collapse-tab,'
		+ _Scope + ' .pict-modal-shell-panel-top > .pict-modal-shell-panel-collapse-tab:hover {'
		+   ' width: ' + tmpWidth + 'px; height: 18px; bottom: -18px; margin-left: -' + tmpHalf + 'px;'
		+ ' }\n';
}

function middleLeftCSS(pHeight)
{
	let tmpHeight = pHeight || 120;
	let tmpHalf   = Math.floor(tmpHeight / 2);
	return ''
		+ _Scope + ' .pict-modal-shell-panel-left > .pict-modal-shell-panel-collapse-tab {'
		+   ' width: 18px; height: ' + tmpHeight + 'px;'
		+   ' right: -18px; top: 50%; margin-top: -' + tmpHalf + 'px;'
		+   ' writing-mode: vertical-rl; padding: 10px 0;'
		+   ' font-size: 10px; font-weight: 600; letter-spacing: 0.08em;'
		+   ' text-transform: uppercase;'
		+ ' }\n'
		+ _Scope + ' .pict-modal-shell-panel-left > .pict-modal-shell-panel-collapse-tab .pict-modal-shell-panel-collapse-tab-title { display: inline; }\n'
		+ _Scope + ' .pict-modal-shell-panel-left > .pict-modal-shell-panel-collapse-tab::before { display: none; }\n'
		+ _Scope + ' .pict-modal-shell-panel-left:hover > .pict-modal-shell-panel-collapse-tab,'
		+ _Scope + ' .pict-modal-shell-panel-left > .pict-modal-shell-panel-collapse-tab:hover {'
		+   ' width: 18px; height: ' + tmpHeight + 'px; right: -18px; margin-top: -' + tmpHalf + 'px;'
		+ ' }\n';
}

function middleRightCSS(pHeight)
{
	let tmpHeight = pHeight || 120;
	let tmpHalf   = Math.floor(tmpHeight / 2);
	return ''
		+ _Scope + ' .pict-modal-shell-panel-right > .pict-modal-shell-panel-collapse-tab {'
		+   ' width: 18px; height: ' + tmpHeight + 'px;'
		+   ' left: -18px; top: 50%; margin-top: -' + tmpHalf + 'px;'
		+   ' writing-mode: vertical-rl; padding: 10px 0;'
		+   ' font-size: 10px; font-weight: 600; letter-spacing: 0.08em;'
		+   ' text-transform: uppercase;'
		+ ' }\n'
		+ _Scope + ' .pict-modal-shell-panel-right > .pict-modal-shell-panel-collapse-tab .pict-modal-shell-panel-collapse-tab-title { display: inline; }\n'
		+ _Scope + ' .pict-modal-shell-panel-right > .pict-modal-shell-panel-collapse-tab::before { display: none; }\n'
		+ _Scope + ' .pict-modal-shell-panel-right:hover > .pict-modal-shell-panel-collapse-tab,'
		+ _Scope + ' .pict-modal-shell-panel-right > .pict-modal-shell-panel-collapse-tab:hover {'
		+   ' width: 18px; height: ' + tmpHeight + 'px; left: -18px; margin-top: -' + tmpHalf + 'px;'
		+ ' }\n';
}

// Thicker stock tab (12px wide instead of 6) — exercises the "what if
// I want a fatter affordance" case.
function thickStockCSS(pSide)
{
	let tmpSelector = _Scope + ' .pict-modal-shell-panel-' + pSide + ' > .pict-modal-shell-panel-collapse-tab';
	let tmpHover    = _Scope + ' .pict-modal-shell-panel-' + pSide + ':hover > .pict-modal-shell-panel-collapse-tab, '
				    + _Scope + ' .pict-modal-shell-panel-' + pSide + ' > .pict-modal-shell-panel-collapse-tab:hover';
	switch (pSide)
	{
	case 'left':   return tmpSelector + ' { width: 12px; right: -12px; height: 56px; }\n'
			    + tmpHover     + ' { width: 24px; right: -24px; height: 72px; }\n';
	case 'right':  return tmpSelector + ' { width: 12px; left:  -12px; height: 56px; }\n'
			    + tmpHover     + ' { width: 24px; left:  -24px; height: 72px; }\n';
	case 'top':    return tmpSelector + ' { height: 12px; bottom: -12px; width: 56px; }\n'
			    + tmpHover     + ' { height: 24px; bottom: -24px; width: 72px; }\n';
	case 'bottom': return tmpSelector + ' { height: 12px; top:    -12px; width: 56px; }\n'
			    + tmpHover     + ' { height: 24px; top:    -24px; width: 72px; }\n';
	}
	return '';
}

module.exports =
[
	// ── Side panels, stock 6×28 tab geometry ─────────────────────
	{
		Id:      'side-left-stock',
		Group:   'Side panels — stock',
		Label:   'Left',
		Title:   'Left panel, stock 6×28 tab anchored at top:14px',
		Notes:
		[
			'**Boundary check**: the tab\'s panel-facing edge should sit flush against the panel\'s right border.  No part of the tab should appear inside the panel.',
			'**Hover**: tab grows from 6×28 to 18×36, still flush against the boundary, expanding only outward.',
			'**Collapse**: click the tab — the panel collapses to a thin strip, the tab fills the strip vertically, the title "Filters" rotates to read vertically.'
		],
		Panels:
		[
			{ Hash: 'side', Side: 'left', Mode: 'resizable', Size: 220, MinSize: 120, MaxSize: 480, Title: 'Filters' }
		]
	},
	{
		Id:      'side-right-stock',
		Group:   'Side panels — stock',
		Label:   'Right',
		Title:   'Right panel, stock 6×28 tab anchored at top:14px',
		Notes:
		[
			'Mirror of the left scenario — tab on the inner (left) edge of the panel, growing leftward on hover.',
			'**Boundary check**: nothing should poke into the panel; the tab lives entirely in the center area.'
		],
		Panels:
		[
			{ Hash: 'side', Side: 'right', Mode: 'resizable', Size: 220, MinSize: 120, MaxSize: 480, Title: 'Inspector' }
		]
	},
	{
		Id:      'side-top-stock',
		Group:   'Stacked — stock',
		Label:   'Top',
		Title:   'Top panel, stock 28×6 tab anchored at right:14px',
		Notes:
		[
			'**Boundary check**: tab sits fully BELOW the panel, against the bottom edge.',
			'Common pitfall before the fix: the tab\'s bottom edge would slip into the center area while its top edge stayed inside the panel — the merge-bar shadow hid it but custom panel borders could clip it.'
		],
		Panels:
		[
			{ Hash: 'stack', Side: 'top', Mode: 'resizable', Size: 160, MinSize: 80, MaxSize: 360, Title: 'Header' }
		]
	},
	{
		Id:      'side-bottom-stock',
		Group:   'Stacked — stock',
		Label:   'Bottom',
		Title:   'Bottom panel, stock 28×6 tab anchored at right:14px',
		Notes:
		[
			'**Boundary check**: tab sits fully ABOVE the panel, against the top edge.',
			'**Resize**: drag the panel\'s top edge — the tab moves WITH the panel since its position is panel-relative.'
		],
		Panels:
		[
			{ Hash: 'stack', Side: 'bottom', Mode: 'resizable', Size: 200, MinSize: 80, MaxSize: 480, Title: 'Console' }
		]
	},

	// ── Middle-anchored variants ─────────────────────────────────
	{
		Id:      'bottom-middle-wide',
		Group:   'Middle-anchored',
		Label:   'Bottom · wide',
		Title:   'Bottom panel, 160px-wide labelled tab centered horizontally',
		Notes:
		[
			'The Sandbox tab pattern from the docuserve section playground.',
			'**Boundary check**: the wider tab still sits fully OUTSIDE the panel (top: -18px matches its height).',
			'**Collapsed state**: the inline title text reads "SANDBOX" while the panel is collapsed (the stock collapse-state CSS fills the strip; the inline title stays inside the tab).'
		],
		ExtraCSS: middleBottomCSS(160),
		Panels:
		[
			{ Hash: 'sandbox', Side: 'bottom', Mode: 'resizable', Size: 260, MinSize: 100, MaxSize: 520, Title: 'Sandbox' }
		]
	},
	{
		Id:      'top-middle-wide',
		Group:   'Middle-anchored',
		Label:   'Top · wide',
		Title:   'Top panel, 160px-wide labelled tab centered horizontally',
		Notes:
		[
			'Inverse of the bottom variant — tab BELOW the panel, label "TOOLBAR".',
			'**Resize**: drag the panel\'s bottom edge to grow/shrink the panel; the tab stays centered.'
		],
		ExtraCSS: middleTopCSS(160).replace(/SANDBOX/g, 'TOOLBAR'),
		Panels:
		[
			{ Hash: 'toolbar', Side: 'top', Mode: 'resizable', Size: 180, MinSize: 80, MaxSize: 360, Title: 'Toolbar' }
		]
	},
	{
		Id:      'left-middle-vertical',
		Group:   'Middle-anchored',
		Label:   'Left · vertical',
		Title:   'Left panel, vertical 120px tab centered on the panel height',
		Notes:
		[
			'Vertical title text reading "MODULES" — writing-mode: vertical-rl rotates the text 90° clockwise.',
			'**Boundary check**: the tab\'s left edge (the panel-facing edge) sits flush against the panel\'s right border.',
			'**Tab position**: vertically centered on the panel (not top-anchored).  As the parent center area grows/shrinks (window resize), the tab stays centered.'
		],
		ExtraCSS: middleLeftCSS(140),
		Panels:
		[
			{ Hash: 'modules', Side: 'left', Mode: 'resizable', Size: 220, MinSize: 120, MaxSize: 480, Title: 'Modules' }
		]
	},
	{
		Id:      'right-middle-vertical',
		Group:   'Middle-anchored',
		Label:   'Right · vertical',
		Title:   'Right panel, vertical 120px tab centered on the panel height',
		Notes:
		[
			'Mirror of left-middle-vertical.',
			'**Boundary check**: tab\'s right edge sits flush against the panel\'s left border, label "INSPECTOR" reads vertically.'
		],
		ExtraCSS: middleRightCSS(140),
		Panels:
		[
			{ Hash: 'inspector', Side: 'right', Mode: 'resizable', Size: 220, MinSize: 120, MaxSize: 480, Title: 'Inspector' }
		]
	},

	// ── Thicker stock tabs ──────────────────────────────────────
	{
		Id:      'side-left-thick',
		Group:   'Thicker tab',
		Label:   'Left · thick',
		Title:   'Left panel, 12×56 tab (twice the thickness of the default)',
		Notes:
		[
			'**Geometry check**: a thicker tab should still sit fully outside the panel.  Default 6px → -6px offset; here 12px → -12px offset.',
			'**Hover**: grows to 24×72, still flush against the boundary.',
			'Useful for layouts where the tab needs to be much more visible at rest (e.g. discoverability for first-time users).'
		],
		ExtraCSS: thickStockCSS('left'),
		Panels:
		[
			{ Hash: 'thick', Side: 'left', Mode: 'resizable', Size: 220, MinSize: 120, MaxSize: 480, Title: 'Filters' }
		]
	},
	{
		Id:      'side-bottom-thick',
		Group:   'Thicker tab',
		Label:   'Bottom · thick',
		Title:   'Bottom panel, 56×12 tab (twice the thickness of the default)',
		Notes:
		[
			'Same as the left variant but on the bottom edge.',
			'**Verify**: nothing pokes inside the panel\'s content area; the panel\'s top border (if any) is clean.'
		],
		ExtraCSS: thickStockCSS('bottom'),
		Panels:
		[
			{ Hash: 'thick', Side: 'bottom', Mode: 'resizable', Size: 220, MinSize: 80, MaxSize: 480, Title: 'Output' }
		]
	},

	// ── Multi-panel layouts ─────────────────────────────────────
	{
		Id:      'three-panels',
		Group:   'Multi-panel',
		Label:   'Three sides',
		Title:   'Left + right + bottom panels, all resizable',
		Notes:
		[
			'**Cross-side check**: three tabs simultaneously, each on a different boundary.  All must sit entirely outside their respective panels.',
			'**Resize independence**: each panel\'s drag handle resizes only that panel; collapses are independent.',
			'**Layout**: center area is what\'s left after the three panels reserve their space.'
		],
		Panels:
		[
			{ Hash: 'l', Side: 'left',   Mode: 'resizable', Size: 200, MinSize: 100, MaxSize: 400, Title: 'Files' },
			{ Hash: 'r', Side: 'right',  Mode: 'resizable', Size: 200, MinSize: 100, MaxSize: 400, Title: 'Info' },
			{ Hash: 'b', Side: 'bottom', Mode: 'resizable', Size: 180, MinSize: 80,  MaxSize: 400, Title: 'Output' }
		]
	},
	{
		Id:      'four-panels',
		Group:   'Multi-panel',
		Label:   'All four',
		Title:   'Left + right + top + bottom — the kitchen sink',
		Notes:
		[
			'**The full grid**: all four sides docked, center is what\'s left.',
			'**Corner check**: where the side panels meet the top/bottom panels, no tab should overlap another panel\'s tab.  The stock corner-anchored tabs (top:14px, right:14px) keep them at different corners; if you build your own middle-anchored variants, watch for overlap in the corners.'
		],
		Panels:
		[
			{ Hash: 'l', Side: 'left',   Mode: 'resizable', Size: 180, MinSize: 100, MaxSize: 380, Title: 'Files' },
			{ Hash: 'r', Side: 'right',  Mode: 'resizable', Size: 180, MinSize: 100, MaxSize: 380, Title: 'Info' },
			{ Hash: 't', Side: 'top',    Mode: 'resizable', Size: 80,  MinSize: 40,  MaxSize: 200, Title: 'Header' },
			{ Hash: 'b', Side: 'bottom', Mode: 'resizable', Size: 160, MinSize: 60,  MaxSize: 400, Title: 'Output' }
		]
	}
];
