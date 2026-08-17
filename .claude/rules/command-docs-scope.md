---
globs: src/app/guides/list-of-commands/page.mdx
---

# Only document commands a plugin author can actually bind

`list-of-commands` is a **public API reference for the main window**, not an inventory of every
`commands.add()` call in the desktop app. A command earns a heading only if a plugin, the init
file, or a user keymap could usefully invoke it. Everything else is app-internal wiring that
happens to travel over the same command bus.

When sweeping the desktop source for undocumented commands, expect to reject **more than half**
of what you find. Adding them all is the mistake this rule exists to prevent.

## Exclude

- **Preferences-window commands.** The page covers the main window. A command is Preferences-only
  when its component sits in the `'preferences:modal'` slot of
  `src/browser/reducers/layouts.ts`, or lives in `PreferencesLayout` / a `preferences-view-*.tsx`.
  → `core:preferences-set-view`, `core:preferences-open-plugin`,
  `core:preferences-content-view-scroll-to-top`, `core:add-openai-compatible-provider`,
  `core:show-local-server-logs`.
- **Anything the app dispatches at itself.** Main→renderer notifications and cross-window sync
  are events wearing a command's clothes. Check for a `/** @internal */` marker on the type entry
  in `src/browser/commands/environment.ts` or `src/browser/utils/window-util.ts`, and for a
  dispatch site that is app code rather than a keymap or menu.
  → `core:update-available`, `core:update-downloaded`, `core:update-error`,
  `core:reload-package-updates`, `window:context-menu`, `application:display-access-key`,
  `github:oauth-complete`, `github:oauth-error`, `core:show-update-notification`.
- **Commands whose only selector is a specific widget.** A binding scoped to `.ui.dropdown`, a
  particular `input`, or a single component's textarea is internal keyboard plumbing for that
  widget. Public commands are registered on `body`, or on `.mde-cm-wrapper` for editor commands —
  **those two selectors only**.
  → `core:submit`, `core:cancel`, `core:toggle-menu`, `core:select-next-item`,
  `core:focus-item-list`, `core:submit-preset-selection`.
- **Commands with no registered handler.** A declaration in a `*Commands` type is not proof the
  command exists — grep for the handler too.
  → `core:preview-render` (declared, never registered, nothing dispatches it).
- **Diagnostics and support-only affordances**, even when they are menu-bound and main-window.
  → `core:run-network-diagnosis`.

## `hiddenInCommandPalette` is not the test

It is tempting to treat that flag as the public/private boundary. It isn't.
`core:show-image-viewer` sets it and **is** documented, because it takes explicit `src` / `alt`
arguments and works from anywhere; `core:change-notebook-icon` sets it and is **not** documented,
because it takes no payload and only reads `bookList.bookForContextMenu`, which nothing but the
app's own context menu ever populates.

That contrast is the sharpest single question to ask:

> Could a plugin invoke this and get a defined result — because it takes arguments, or acts on
> state a plugin can see? Or does it only complete an interaction the app already started?

## When it is borderline, ask

Several of these commands are genuinely ambiguous from the source alone, and guessing wrong means
publishing an API that was never meant to be public — which is far more expensive to retract than
to omit. List the candidates you are unsure about and ask, rather than deciding silently.

## Verify by diffing, not by reading

Extract the documented headings and the registered commands and compare the two sets, so nothing
is missed and nothing stale survives:

```sh
rg -o '^### ([a-z0-9-]+:[a-z0-9-]+)' -r '$1' src/app/guides/list-of-commands/page.mdx | sort -u
```

Check the result for duplicate headings, and confirm every removal is deliberate — a rename
upstream (`export-as-html:export` → `export-as-html:selections`) looks identical to a deletion in
the diff. Cross-check against `@inkdropapp/types`' `commands.d.ts`, but do not trust it as the
source of truth: it lags the app in both directions and drops the `@internal` markers.

## Formatting

The page is **not** Prettier-formatted, and there is no `format` script in `package.json`. Do not
run Prettier over it — it reflows every existing `<Property>` description and buries the real
change. Match the surrounding style by hand: one sentence per line, `{{ selector: 'body' }}` on
the heading, arguments in a `<Properties sub title="Arguments">` block.
