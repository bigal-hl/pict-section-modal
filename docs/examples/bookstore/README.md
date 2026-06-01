# Bookstore - Modal Patterns in a Real Data-Driven App

<!-- docuserve:example-launch:start -->
> **[Launch the live app](examples/bookstore/index.html)** - runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

A bookstore inventory application that demonstrates **practical**
`pict-section-modal` usage - every dialog primitive is wired to a real
action against actual application data. Where the [Modal Garden](../modal_garden/README.md)
example is a feature catalog, Bookstore is the end-to-end story: confirm
on delete, double-confirm on bulk delete, custom modal for record
details, toasts for action feedback.

The app uses `pict-router` for routing between a book list and an about
page, holds a small in-memory book catalog as `AppData`, and drives every
modal from instance methods on the application class.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| Promise-based `confirm()` for destructive single-item actions | `application.deleteBook(pBookID)` |
| `doubleConfirm()` with a typed phrase for catastrophic actions | `application.deleteAllBooks()` |
| Custom `show()` modal with formatted HTML content + buttons | `application.viewBookDetails(pBookID)` |
| Toast notifications keyed by action outcome | success / error / warning toasts after deletes |
| Routing + view dispatch | `PictRouter` provider + `application.showView(viewId)` |
| Layout-driven view rendering | `PictView-Bookstore-Layout` shell with top bar + content slot |
| Reactive list re-rendering after data mutation | `BookList.refreshList()` after the modal resolves |

## Key files

- `source/Pict-Application-Bookstore.js` - application class. Holds the
  `Books` array in `AppData.Bookstore` and exposes
  `viewBookDetails`/`deleteBook`/`deleteAllBooks` as instance methods.
- `source/views/PictView-Bookstore-Layout.js` - shell-style layout with a
  top bar slot and a content slot.
- `source/views/PictView-Bookstore-BookList.js` - table view that
  renders the books and calls back into the application methods.
- `source/views/PictView-Bookstore-About.js` - alternate route content.
- `source/providers/PictRouter-Bookstore-Configuration.json` - route map.

## The data model

```js
this.pict.AppData.Bookstore =
{
    Books:
    [
        { ID: 1, Title: "One Hundred Years of Solitude", Author: "Gabriel Garcia Marquez",
          Year: 1967, Genre: "Magical Realism", InStock: true },
        // 10 books total - mix of fiction, genre, year, in-stock state
    ],
    NextID: 11
};
```

Plain JavaScript object on `AppData`. No service layer - the example is
about modal patterns, not data access.

---

## Feature 1 - `confirm()` returns a promise

The simplest modal primitive. Returns `true` on confirm, `false` on
cancel; resolves regardless of how the user closes it. The book-list's
delete button calls it before doing anything destructive:

```js
this.pict.views.PictSectionModal.confirm(
    'Are you sure you want to remove "' + tmpBook.Title + '" from the inventory?',
    {
        title:        'Delete Book',
        confirmLabel: 'Delete',
        cancelLabel:  'Keep',
        dangerous:    true
    }
).then((pConfirmed) =>
{
    if (pConfirmed)
    {
        this.pict.AppData.Bookstore.Books = this.pict.AppData.Bookstore.Books
            .filter((pEntry) => pEntry.ID !== pBookID);

        this.pict.views.PictSectionModal.toast(
            '"' + tmpBook.Title + '" has been removed.',
            { type: 'success' }
        );

        this.pict.views['Bookstore-BookList'].refreshList();
    }
});
```

`dangerous: true` styles the confirm button as a danger action (red).
Without it, the button uses the neutral primary style.

## Feature 2 - `doubleConfirm()` for irreversible actions

When the action wipes a lot of data, a single confirm is too easy to
fat-finger. `doubleConfirm` requires the user to type a confirmation
phrase exactly before the button enables:

```js
this.pict.views.PictSectionModal.doubleConfirm(
    'This will permanently remove all ' + tmpBookCount + ' books from the inventory. This action cannot be undone.',
    {
        title:         'Clear All Books',
        confirmPhrase: 'DELETE ALL',
        phrasePrompt:  'Type "{phrase}" to confirm:',
        confirmLabel:  'Delete All',
        cancelLabel:   'Cancel'
    }
).then((pConfirmed) => { /* same as confirm */ });
```

`{phrase}` in `phrasePrompt` is substituted with `confirmPhrase` at render
time - change the phrase in one place and the prompt label follows.

## Feature 3 - Custom `show()` with HTML content + buttons

For displaying record details or arbitrary content. The modal body is
plain HTML, buttons are an array; the call resolves with the clicked
button's `Hash`:

```js
let tmpContent = '<table class="bookstore-detail-table">'
    + '<tr><td class="bookstore-detail-label">Title</td><td>' + tmpBook.Title + '</td></tr>'
    + '<tr><td class="bookstore-detail-label">Author</td><td>' + tmpBook.Author + '</td></tr>'
    + '<tr><td class="bookstore-detail-label">Availability</td><td>' + tmpStockLabel + '</td></tr>'
    + '</table>';

this.pict.views.PictSectionModal.show(
{
    title:     tmpBook.Title,
    content:   tmpContent,
    closeable: true,
    width:     '480px',
    buttons:
    [
        { Hash: 'close', Label: 'Close', Style: 'primary' }
    ]
});
```

The `tmpStockLabel` is built with CSS custom properties referencing the
active theme's success/error tokens, so the modal stays theme-aware:

```js
let tmpStockLabel = tmpBook.InStock
    ? '<span style="color:var(--theme-color-status-success, #16a34a);font-weight:600;">In Stock</span>'
    : '<span style="color:var(--theme-color-status-error, #dc2626);font-weight:600;">Out of Stock</span>';
```

## Feature 4 - Toast notifications signal outcomes

Toasts are non-blocking feedback. The application emits one after every
mutation so the user knows the action succeeded:

```js
this.pict.views.PictSectionModal.toast(
    '"' + tmpBook.Title + '" has been removed.',
    { type: 'success' }
);
```

Four built-in types - `success`, `error`, `warning`, `info`. Each picks
up the matching theme token. Toasts stack and auto-dismiss; the user can
also dismiss them with the close button.

## Feature 5 - Reactive list refresh

The book list view exposes a `refreshList()` method the application
calls after every mutation. The view re-renders from `AppData` - same
data, new DOM:

```js
if (this.pict.views['Bookstore-BookList'])
{
    this.pict.views['Bookstore-BookList'].refreshList();
}
```

The view does **not** subscribe to `AppData` changes - the application
explicitly drives renders. That keeps the render flow obvious: data
mutates first, then the application says "render". No magic.

## Running the example

```bash
cd example_applications/bookstore
npm install
npm run build
# then open dist/index.html in a browser
```

## Things to try in the running app

- **View a book's details** - click the "View" button on any row; the
  custom modal opens with the formatted detail table.
- **Delete a single book** - click "Delete"; a danger-styled confirm
  prompts; on confirm a success toast appears and the row vanishes.
- **Delete all books** - click "Delete All"; the double-confirm requires
  typing `DELETE ALL` before the button enables.
- **Navigate** - top bar has Home / About links; routing is handled by
  `pict-router`.
- **Trigger errors** - close all browser tabs of the example, then
  delete a book; toasts respect dark mode and brand colors automatically.

## Takeaways

1. **One modal API, four use cases.** Confirm for reversible, doubleConfirm
   for catastrophic, custom show for details, toast for outcomes - all
   from the same `PictSectionModal` view.
2. **Promises make modal flow linear.** No event listeners, no state
   machine - just `await modal.confirm(...)` (or `.then()`) and branch on
   the result.
3. **Style hooks are theme tokens.** `--theme-color-status-success`,
   `dangerous: true`, `Style: 'primary'` - none of these are hard-coded
   colors. The modal looks correct in every theme automatically.
4. **Render after mutate.** Reactivity here is one explicit
   `refreshList()` call after each data change, not subscription magic.

## Related documentation

- [confirm](../../api/confirm.md) - single confirmation prompt
- [doubleConfirm](../../api/doubleConfirm.md) - phrase + click double-check
- [show](../../api/show.md) - custom modal with content + buttons
- [toast](../../api/toast.md) - non-blocking notification
- [Architecture](../../Architecture.md) - overall design
