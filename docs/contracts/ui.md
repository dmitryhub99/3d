# UI contracts: icons, primitives, shared workspace bands

Owner: **ui**. Files: `src/components/icons/**`, `src/components/primitives/**`, `src/components/workspace/**`.
Code against this page; you should not need to read the source. Spec references are to `docs/design-spec.md`.

Conventions for everything below:

- Every component is a named export from the file of the same name (`import { Kbd } from '../components/primitives/Kbd'`).
- Styles are CSS Modules using tokens only. Pass `className` to position a component; never restyle its colors.
- Focus: controls rely on the global `:focus-visible` rule (1px `line-2`, offset 1). Never orange.
- Nothing animates on first paint: every `motion` element in these files mounts with `initial={false}` except
  things that only appear after an interaction (menus, popovers, flags, the action strip).
- Overlays (Flag, Menu, Popover, ClausePopover) portal into `getOverlayRoot()` (`#strivo-overlays`, falling back to
  `document.body`) and position themselves in overlay-root coordinates, correcting for the stage scale.
- `keys` props everywhere accept `string[]` (one entry per cap: `['⌘','K']`), a space-separated string (`'G P'`),
  or combined strings (`['⌘S']` becomes `⌘` `S`). Symbols `⌘ ⌥ ⇧ ↵ ⌫ ↑ ↓ ← →` are drawn as SVG; never type them as text elsewhere.

---

## Icons (`components/icons`)

### `Icon`

```ts
import { Icon, type IconName, type IconSize, ICON_NAMES } from '../components/icons/Icon'
<Icon name="people" size={16} />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `IconName` | required | see list below |
| `size` | `10 \| 12 \| 14 \| 16` | `16` | stroke 1.2 / 1.25 / 1.4 / 1.5 px (non-scaling). 14 is the query-line search glyph |
| `filled` | `boolean` | `false` | filled variant for `saved`/`save` (saved state) and `panel-right` (inspector open: right third filled) |
| `className`, `style` | | | color comes from `currentColor`: set `color` on the parent |
| `label` | `string` | | accessible name; without it the SVG is `aria-hidden` |

Renders `<svg data-icon={name}>` (display block, no flex shrink). Colors per §8.6: `text-3` at rest, `text-1` on hover/selected. Never `accent`.

`IconName` (every §8.6 glyph, plus two helpers):
`mark home people companies jobs projects applications hiring saved save save-filled activity settings
chevron-left chevron-right chevron-up chevron-down arrow-right arrow-left arrow-up-right close search bell
panel-right view-table view-compact view-gallery view-board display plus more follow following message check
share export worked-with view calendar clock link reply repost keyboard
kbd-cmd kbd-opt kbd-shift kbd-return kbd-backspace kbd-up kbd-down kbd-left kbd-right`

- `save` is an alias of `saved` (row hover / inspector Save action). `save-filled` = the filled path.
- `arrow-left` is the mirror of `arrow-right` (history flags "← People › All people").
- `kbd-*` are 10-grid glyphs; render them at `size={10}` (Kbd does this for you).
- `ICONS` (raw glyph table) and `ICON_NAMES` are exported too.

---

## Primitives (`components/primitives`)

### `Kbd`
Key-cap sequence. 16 tall, min 16 wide, `sunken`, 1px `line-2`, radius 2, `text-3`; letters and words (`esc`, `Space`)
in mono 10/12 500; symbol caps are 16 × 16 with the 10px glyph. Caps are 2px apart. Inline, `vertical-align: middle`.

| Prop | Type | Notes |
|---|---|---|
| `keys` | `readonly string[] \| string` | `['⌘','K']`, `'G P'`, `['↵']`, `['esc']`, `['⌘S']` |
| `className` | `string` | |

Also exported: `splitKeys(keys): string[]`.

### `Monogram`
Square initials tile (D15). Sizes 20/24/28/56/64 (initials 9/10/11/20/22, 600). Radius 4, `--hue-n` fill,
initials `text-2` below 56, `text-1` at 56+ with a 1px `line-2` inner edge.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `initials` | `string` | required | |
| `hue` | `0–5` (`number` ok, taken mod 6) | required | |
| `size` | `20 \| 24 \| 28 \| 56 \| 64` | `28` | |
| `badge` | `string` | | acting-as org letter: 12 × 12 `--hue-3` tile, 8/8 600 `text-1`, radius 2, 2px `frame` ring, offset 4px past the bottom-right corner (exactly §3 for a 28 monogram at x 14–42) |
| `tone` | `'text-1' \| 'text-2'` | by size | the rail account passes `'text-1'` (§3: `RK` 11/12 600 `text-1`) |
| `label` | `string` | | accessible name; decorative (`aria-hidden`) without it |
| `className` | `string` | | |

### `CompanyGlyph`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | required | shows the first letter, uppercased |
| `hue` | `number` | required | taken mod 6 (ignored at 14) |
| `size` | `14 \| 20 \| 24 \| 28 \| 32 \| 56` | `14` | 14: outline only (1px `line-2`, radius 2, 9/10 600 `text-3`, rows). 20–32: hue fill, radius 4, `text-2` (32: 13px, tiles). 56: hue fill + `line-2` inner edge, 20/24 600 `text-1` (company Peek) |
| `label`, `className` | | | |

### `Button`
Extends `ButtonHTMLAttributes<HTMLButtonElement>` (so `onClick`, `disabled`, `aria-*`, `ref` all pass through; `type` defaults to `button`).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary'` | `'secondary'` | primary = the one accent fill per screen (hover `accent-hover`, press `accent-press`, text `accent-ink`) |
| `size` | `24 \| 32` | `32` | 32: 13/18 500, primary padding 0 12, secondary padding 0 10. 24: 12/16 500, padding 0 8, secondary label `text-2` |
| `icon` | `IconName` | | leading icon, 16 (12 at size 24), 6px gap. Secondary icons are `text-3` → `text-1` on hover |
| `iconFilled` | `boolean` | | |
| `tone` | `'default' \| 'muted'` | | `muted` = `text-2` label ("Following") |
| `flag` | `ReactNode` | | hover flag (e.g. the intro path on the primary) |
| `flagKeys` | `keys` | | caps in that flag (e.g. `['M']`) |
| `flagSide` | `'right' \| 'bottom' \| 'top'` | `'bottom'` | |
| `children` | `ReactNode` | | omit for an icon-only square button |

### `IconButton`
Extends button attributes. Ghost 24 × 24 (default), bordered 32 × 32, or 16 × 16 (strip `+`/`⋯`, header `⋯`). Radius 4.
Rest: `text-3` icon. Hover: `hover` fill + `text-1`. `pressed` or `aria-expanded="true"`: `active` fill + `text-1`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `IconName` | required | |
| `label` | `string` | required | `aria-label`, and the flag text unless `flag` overrides |
| `keys` | `keys` | | caps shown in the flag (`['F']`, `['⌘','[']`) |
| `size` | `16 \| 24 \| 32` | `24` | |
| `bordered` | `boolean` | `false` | 1px `line-2` |
| `pressed` | `boolean` | | sets `aria-pressed` |
| `filled` | `boolean` | | icon's filled variant (saved / inspector open) |
| `iconSize` | `10 \| 12 \| 14 \| 16` | 12 in a 16 button, else 16 | history chevrons pass 12 |
| `flag` | `ReactNode \| false` | `label` | `false` = no flag |
| `flagSide` | `'right' \| 'bottom' \| 'top'` | `'bottom'` | |
| `tone` | `'text-3' \| 'text-2' \| 'text-1'` | `'text-3'` | icon color at rest (e.g. `text-1` for a saved state) |

### `TextButton`
Extends button attributes. 24h, padding 0 8, radius 4; hover `hover` fill and `text-1`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | required | |
| `variant` | `'default' \| 'quiet' \| 'strong' \| 'foot'` | `'default'` | default 12/16 500 `text-2` (Share, Export, Display, action strip) · quiet 12/16 400 `text-3` (Revert) · strong 12/16 500 `text-1` (Save segment) · foot 11/16 400 `text-3` (inspector foot "Full profile") |
| `keys` | `keys` | | caps 6px from the label |
| `keysPosition` | `'start' \| 'end'` | `'end'` | `'start'` for "↵ Full profile", "esc clear" |
| `icon` | `IconName` | | leading 16px icon in `text-3` (Display), 6px gap |
| `flag`, `flagKeys`, `flagSide` | | | optional hover flag |

### `SkillToken`
A skill as text, never a pill.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | required | |
| `matched` | `boolean` | `false` | `text-1` plus a 4 × 4 `text-1` square prefix (6px gap) |
| `years` | `number \| string` | | mono 11 `text-3`; numbers render as `6y` |
| `size` | `12 \| 13` | `13` | 13/18 or 12/16 |
| `mark` | `boolean` | `= matched` | rows pass `false` (match shown by color only, §6.5) |
| `tone` | `'text-1' \| 'text-2' \| 'text-3'` | matched ? text-1 : text-2 | row line 2 uses `text-3` |
| `block` | `boolean` | `false` | full width, years right-aligned (inspector skill columns) |

### `StatusGlyph`
| Prop | Type | Notes |
|---|---|---|
| `status` | `'open' \| 'exploring' \| 'not-looking' \| 'freelance' \| 'synced' \| 'offline'` | 7 × 7: ● `ok`, ◐ `warn` (1px ring + left half), ○ 1px `text-3` ring, ■ `ok`. Sync dot 6 × 6: ● `ok` / ○ 1px `text-3` ring |
| `label` | `string \| true` | accessible name (`true` = "Open", "Synced"…); omit when a text label follows |
| `className` | `string` | |

Renders `<svg data-status>`, display block.

### `Segmented<T extends string>`
View switcher: one 1px `line-1` outline (radius 4) over 24 × 24 cells with 1px `line-1` dividers; total 72 × 24 for three cells.
Selected cell `active` fill + `text-1`. Each cell has a flag (label + key). `role="radiogroup"`; arrow keys change the value.

| Prop | Type | Default |
|---|---|---|
| `options` | `{ id: T; icon: IconName; label: string; key?: string }[]` | required |
| `value` | `T` | required |
| `onChange` | `(id: T) => void` | required |
| `label` | `string` (group name) | `'View'` |
| `flagSide` | flag side | `'bottom'` |

### `Flag`
Tooltip. 24h, padding 0 8, `overlay`, 1px `line-2`, radius 6, label 12/16 500 `text-1`, then 8px, then `Kbd`s.
Delay 400ms, **0ms while another flag is visible** (module-level state; moving between anchors within 150ms counts).
Placed `offset` px from the anchor, clamped inside the stage. Hides on pointer-down, any key, scroll, blur, and while a Menu/Popover is open.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `ReactNode` | required | may hold an `Icon` (e.g. `arrow-left`) + text |
| `keys` | `keys` | | |
| `side` | `'right' \| 'bottom' \| 'top'` | `'bottom'` | right: vertically centered on the anchor |
| `offset` | `number` | `6` | rail flags: pass the gap from the hit target's right edge to x=57 (hit x 8–48 → `offset={9}`) |
| `variant` | `'default' \| 'rail'` | | rail: no left border, radius 0 4 4 0 |
| `delay` | `number` | `400` | |
| `disabled` | `boolean` | | |
| `open` | `boolean` | | controlled; hover/focus ignored when set |
| `children` | one element | required | the anchor; wrapped in a `display: contents` span, so layout is untouched |

Also exported: `hideFlags()`, `FLAG_DELAY`. Entrance: opacity 0 → 1 over `fadeIn(100)` (right-side flags also x −4 → 0); a swapped flag appears settled.

### `Popover`, `Menu`, `MenuTrigger` (all in `Menu.tsx`)

Shared behavior: portal into the overlay root; `overlay` fill, 1px `line-2`, radius 6, no shadow; open `opacity 0 → 1, y −2 → 0`
over `fadeIn(120)`, close over `fadeOut(80)`; close on outside pointer-down and on `Esc` (only the topmost overlay closes;
Esc is caught at window capture and does not reach other key handlers); focus moves in on open and returns on close;
repositions on resize/content change; flips/clamps inside the stage. Clicks, key presses and pointer events inside the
overlay do **not** bubble to React ancestors (so a menu opened from a row never selects the row).

`OverlayAnchor = Element | { x: number; y: number; width?: number; height?: number }` (client/viewport coordinates, e.g. `{ x: e.clientX, y: e.clientY }` for a right-click).

**`Popover` props:** `open`, `anchor: OverlayAnchor | null`, `onClose(reason: 'escape'|'outside'|'select'|'tab'|'trigger')`,
`side?: 'bottom'|'top'|'right'|'left'` (default bottom), `align?: 'start'|'center'|'end'` (default start; for side right, `end` = bottom edges flush),
`offset?` (default 4), `width?`, `padded?` (padding 4, default true), `role?: 'menu'|'dialog'|'listbox'`, `ariaLabel?`, `id?`, `className?`,
`ignore?: (Element|null)[]` (presses there are not "outside", e.g. the trigger), `initialFocus?: 'container'|'auto'|'none'`
(`auto` = first `[data-autofocus]` or `input`), `restoreFocus?` (default true), `onKeyDown?`, `activeDescendant?`, `containerRef?`, `children`.

**`Menu` props:**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | required | |
| `anchor` | `OverlayAnchor \| null` | required | |
| `items` | `MenuItem[]` | required | see below |
| `onClose` | `(reason) => void` | required | also called after a choice (`'select'`) |
| `onSelect` | `(id: string) => void` | | after the item's own `onSelect` |
| `side` / `align` / `offset` | | `'bottom'` / `'start'` / `4` | account menu: `side="right" align="end"` anchored to the monogram, `offset` = distance to x=57 |
| `width` | `number` | `240` | |
| `label` | `string` | | aria-label |
| `initialHighlight` | `number` | `-1` | `0` = highlight first item (keyboard open) |
| `ignore` | `(Element\|null)[]` | | |

Style: padding 4; items 28h, padding 0 8, radius 4, 13/18 `text-1`; highlight `active`; separators 1px `line-1` spanning the menu with 4px margins; group labels 11/16 600 `text-3`, 24h.
Keyboard: `↑ ↓ Home End` move, `↵`/`Space` choose, `Esc` close, `Tab` close, letters jump to the next item starting with that letter.

```ts
type MenuItem =
  | { kind?: 'item'; id: string; label: ReactNode; textValue?: string
      secondary?: ReactNode          // 12/16 text-3, 8px after the label
      icon?: IconName; iconSize?: 12 | 16   // leading icon, text-3 (history entries: 12)
      keys?: keys                    // right-aligned Kbd
      hint?: ReactNode               // right-aligned mono 11 text-3 (counts)
      selected?: boolean             // radio: trailing text-1 check (Group by, sort)
      checked?: boolean              // checkbox: leading 14px Checkbox, menu stays open
      active?: boolean               // context switch: true → text-1 + 2 × 16 accent notch on the menu's left edge; false → text-2
      disabled?: boolean; keepOpen?: boolean; onSelect?: () => void }
  | { kind: 'separator'; id?: string }
  | { kind: 'group'; id?: string; label: string }
```

**`MenuTrigger` props:** everything in `MenuProps` except `open`, `anchor`, `onClose`, `initialHighlight`, `ignore`, plus:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | one element, or `(api: MenuTriggerApi) => ReactNode` | required | the element is cloned with `ref`, `onClick`, `onKeyDown`, `onContextMenu`, `onPointerDown/Up/Leave`, `aria-haspopup="menu"`, `aria-expanded` (its own handlers still run). Works with `Button`, `IconButton`, `TextButton`, `motion.button`, plain elements |
| `open` / `onOpenChange` | `boolean` / `(open) => void` | | controlled mode |
| `openOn` | `('click' \| 'contextmenu' \| 'longpress')[]` | `['click']` | history buttons: `['longpress','contextmenu']` (400ms long-press; the click that ends a long-press is swallowed, a normal click still runs the button's own `onClick`) |
| `disabled` | `boolean` | | |

A click-opened trigger stops the click from bubbling (row-safe). Keyboard: `↓` on the trigger opens with the first item highlighted;
Enter/Space (a keyboard click) also highlights the first item.
`MenuTriggerApi = { open, openMenu(keyboard?), close(), toggle(), triggerProps }`.

Also exported from `Menu.tsx`: `isOverlayOpen()` (true while any Menu/Popover/ClausePopover is open; the hotkey layer can
use it so Esc closes the overlay before the inspector), types `CloseReason`, `OverlayAnchor`, `OverlaySide`, `OverlayAlign`,
`MenuActionItem`, `MenuSeparator`, `MenuGroupLabel`.

### `Checkbox`
14 × 14, radius 2, 1px `line-2` (hover `text-4`). Checked: `text-1` fill with a `check` in `frame`.
Renders `<button role="checkbox" aria-checked>`; **its click does not propagate**.

| Prop | Type | Notes |
|---|---|---|
| `checked` | `boolean` | required |
| `onChange` | `(next: boolean, event) => void` | |
| `label` | `string` | aria-label ("Select Maren Aaltonen") |
| `disabled`, `tabIndex`, `className`, `ref` | | rows usually pass `tabIndex={-1}` (X key handles it) |
| `presentational` | `boolean` | non-interactive `<span>` for option rows that own the click |

### `Notch`
2px `accent` bar, absolutely positioned (`pointer-events: none`), `initial={false}`, moves only via `layoutId` with `snap`.

| Prop | Type | Notes |
|---|---|---|
| `orientation` | `'v' \| 'h'` | v: 2 × length; h: length × 2 |
| `length` | `number \| string` | 20 on separators, `'100%'` to span a parent |
| `layoutId` | `string` | `rail-notch`, `segment-notch`, `channel-notch` |
| `style` | `CSSProperties` | position only (`left`, `top`, `right`, `bottom`) |
| `className` | `string` | |

### `FitTicks`
8 × 10 ticks, 2px gap (5 ticks = 48 wide, 10 tall). Satisfied: `text-2` fill (`text-1` when `full`). Unmet: 1px `text-4` outline.
Non-highlighted ticks drop to 40% (100ms).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `values` | `boolean[]` | required | one per clause / stage |
| `full` | `boolean` | `false` | pass `true` on 5/5 rows |
| `highlight` | `number \| null` | from context | 0-based tick to keep; `null` disables. When omitted and `linked`, follows `QueryHoverContext.hovered` |
| `onHoverTick` | `(i: number \| null) => void` | | |
| `tickFlag` | `(i: number) => ReactNode` | | flag above the hovered tick, e.g. `5 available within 3 months · from 11 Jan 2027 — not met` |
| `linked` | `boolean` | `true` | reads and publishes `QueryHoverContext` (tick hover underlines clause *i* and dims other ticks everywhere). Stage tracks pass `false` |
| `label` | `string` | `"n of m met"` | `role="img"` aria-label |

### `SectionHeading`
Label 11/16 600 `text-3`, a 1px `line-1` leader rule with 8px on each side, mono 11/16 `text-3` readout at the right edge. 16 tall, full width.
Props: `label: ReactNode`, `readout?: ReactNode`, `as?: 'h2'|'h3'|'h4'` (default `h3`), `id?`, `className?`.

### `Readout` and `Fig`
`Readout`: sans 11/16 `text-3`, tabular figures, nowrap + ellipsis. Props: `children`, `mono?` (whole readout in mono 11/16),
`tone?: 'text-1'|'text-2'|'text-3'`, `className?`.
`Fig`: a mono 11px figure inside a sans run (D7). Props: `children`, `tone?`, `className?`.
Example: `<Readout>Updated <Fig>6d</Fig> ago · <Fig>2</Fig> of <Fig>4</Fig> roles verified</Readout>`.

---

## Workspace bands (`components/workspace`)

Positions below are for People (workspace x 56–1040, side padding 16). Each band is full workspace width; put them in a column flex.

### `SegmentStrip`
36px band, `line-1` hairline painted in its last pixel row. Tabs from the content edge (x=72), 20px apart: label 13/18 500
(`text-3`, hover `text-2`, selected `text-1`), count mono 11/16 `text-3` 6px later, baseline at strip top + 23 (y=63).
The selected tab's 2px accent notch covers the hairline pixel and the first pixel below (y 75–76), spanning label + count,
`layoutId` default `"segment-notch"` (slides with `snap`). Wrap the strip in `<LayoutGroup>` only if two strips can mount at once.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `segments` | `{ id; label; count?: number \| string; delta?: number; subscribed?: boolean }[]` | required | data `Segment[]` passes as-is; numbers render as `1,284`; `delta` → mono `+3` in `text-2` after the count |
| `value` | `string` | required | selected id |
| `onChange` | `(id) => void` | required | |
| `right` | `ReactNode` | | right slot, right-aligned to x=1024, 8px gaps (Segmented, Display…) |
| `onAdd` | `() => void` | | shows the 16 × 16 `+` (flag `addLabel` + `addKeys`) |
| `addLabel` / `addKeys` | `string` / `keys` | `'New segment'` / `['⌘','S']` | |
| `onSegmentAction` | `(action: 'rename'\|'duplicate'\|'share'\|'subscribe'\|'delete', id, value?) => void` | | enables the selected tab's hover `⋯` (16 × 16, 4px after the count): Rename, Duplicate, Share with team, Subscribe to changes, Delete. **Rename is edited inline** (also on double-click) and reported as `('rename', id, newLabel)` |
| `hint` | `ReactNode` | | after the tabs, 12/16 `text-3` ("no segment yet": `<>Refine the query and press <Kbd keys={['⌘','S']}/> to keep it.</>`) |
| `notchLayoutId` | `string` | `'segment-notch'` | |
| `label` | `string` | `'Segments'` | tablist name |

Overflowing tabs collapse into `⋯ n more` (a menu); the selected tab always stays visible. Arrow keys move focus across tabs, Enter/Space activates.
Also exported: `useSegmentHotkeys(segments, onChange, enabled?)` (⌥1–⌥9) — use only if the global hotkey layer does not handle ⌥n.

### `QueryLine`
40px band (grows by 24 per wrapped line with `panel`). Search glyph 14 × 14 at x=72 centered on y=96; sentence from x=96,
baseline y=100, clauses 16px apart: mono 10/12 500 `text-3` index raised 4px, 2px gap; lead 400 `text-3`; value 500 `text-1`.
Then `— by fit` (sort facet, menu) and `+ Clause`. Hover (or focus, or tick hover) draws a 1px dotted `text-3` underline 3px under the value.
Clicking a clause opens `ClausePopover` 8px below it; `+ Clause` / `/` opens the composer. Clauses move with `layout="position"` + `snap`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `query` | `QueryShape` (= data `Query`) | required | |
| `onChange` | `(query) => void` | required | edits, additions, removals (reindexed 1..n), sort changes (sort value stored lowercased: `'fit'`, `'recently active'`…) |
| `dirty` | `boolean` | `false` | shows `Revert` (quiet) and `Save segment` (strong, `⌘` `S`) right-aligned to x=1024 |
| `onRevert` / `onSave` | `() => void` | | |
| `sortOptions` | `string[]` | `PEOPLE_SORT_OPTIONS` (Fit, Recently active, Degree, Tenure in matched skill) | Companies: `['Open roles', …]`, Projects `['Newest', …]` |
| `clauseTypes` | `ClauseType[]` | `PEOPLE_CLAUSE_TYPES` | composer list |
| `getOptions` | `(key, clause?) => ClauseOption[]` | `DEFAULT_CLAUSE_OPTIONS[key]` | option rows (value + mono count) |
| `hotkeys` | `boolean` | `true` | window listeners: `/` opens the composer (ignored in inputs or while an overlay is open); `⌘S`/`Ctrl+S` calls `onSave` while `dirty`. **The global hotkey layer should not also bind `/`.** Pass `false` on inactive sections |

**Hover linking.** Wrap the workspace (strip, query, rows) — ideally the whole shell so the inspector's Fit block joins in — in
`<QueryHoverProvider>`. Exports (from `QueryLine.tsx` and `queryHover.tsx`):
`QueryHoverProvider`, `QueryHoverContext`, `useQueryHover(): { hovered: number | null; source: 'clause'|'tick'|'fit'|null; setHovered(index | null, source?) }`.
`hovered` is the **0-based clause position** (= tick index). Row `FitTicks` react automatically. The inspector Fit block should call
`setHovered(i, 'fit')` on line hover and dim/underline from `hovered`.

Types (from `queryTypes.ts`, re-exported by `QueryLine.tsx`): `ClauseKey` (the 16 §13.1 keys), `QueryClause { index; key; lead?; value }`,
`QueryShape { clauses; sort: { lead: '— by'; value } }`, `ClauseOption { value; count? }`,
`ClauseType { key; label; lead?; noun?; single? }`. Constants: `PEOPLE_CLAUSE_TYPES`, `EXTRA_CLAUSE_TYPES`, `DEFAULT_CLAUSE_OPTIONS`, `clauseTypeFor(key)`.

### `ClausePopover`
Used by QueryLine; exported for reuse. 280 wide, 8px below its anchor. A sunken 28h typeahead (1px `line-2`, radius 4, 12px search glyph),
28px option rows (14px checkbox, 13/18 `text-1` label, right mono 11 `text-3` count), then a separator and `Remove clause ⌫`.
Composer mode lists the clause types; typing filters them; the last row is always `Keyword: "…"` (adds `{ key: 'keyword', lead: 'mentioning' }`).
No free-text parsing. `↑ ↓` move, `↵` choose/toggle, `⌫` in an empty input removes the clause (composer: the last clause), `Esc` closes.
Checking options commits live; single-choice types (`single`) behave as radios; several values join as "a, b or c".
Closing an existing clause with nothing checked removes it.

Props: `open`, `anchor`, `clause?: QueryClause` (omit = composer), `nextIndex: number`, `getOptions?`, `clauseTypes?`,
`onCommit(clause)` (same index = replace, `nextIndex` = append), `onRemove(clause)`, `onRemoveLast?()`, `onClose()`, `ignore?`.

### `ColumnHeader`
28px band with its hairline on the bottom edge (`line-1`, or `line-2` when `scrolled`). Labels 11/16 500 `text-3`, sentence case,
baseline 18px below the top (y=134). Sorted column: label `text-2` + 4px + mono `↓` (`↑` for asc). Hover: `line-2` hairlines on the
column's left and right edges and a 16px `⋯` at its right edge (menu: Sort by …, Hide, Move left, Move right). `role="row"` / `columnheader`.

| Prop | Type | Notes |
|---|---|---|
| `columns` | `{ id; label; x; width; align?: 'start'\|'end'; sortable?; hidden?; minWidth? }[]` | `x` = left edge in px **from the header's left edge** (People: Person 16/248, Company 264/144, Fit 408/232, Skills 640/160, Availability 800/96, Relation 896/72) |
| `sort` | `{ id; dir?: 'asc'\|'desc' } \| string \| null` | string = id, descending |
| `onSort` | `(id) => void` | label click + menu item; omit for static labels |
| `onHide` | `(id) => void` | |
| `onMove` | `(id, dir: -1 \| 1) => void` | |
| `onResize` | `(id, width) => void` | drag the right hairline (6px hit zone, `col-resize`), live widths, stage-scale aware |
| `scrolled` | `boolean` | scroll-state line (§2.3) |
| `menu` | `boolean` | default true |

### `FootReadout`
Foot content (fills the 28h foot slot): readout left in 11/16 `text-3` with tabular figures, parts joined by ` · `; optional right slot.
Props: `items?: ReactNode[]` or `children?`, `right?: ReactNode` (12px gaps), `inset?: 16 | 20 | 24` (side padding; workspace 16, Peek 20, Reader 24), `className?`.
Inspector foot: `<FootReadout inset={20} items={[<>Updated <Fig>6d</Fig> ago</>, …]} right={<TextButton variant="foot" keys={['↵']} keysPosition="start">Full profile</TextButton>} />`.

### `KeyHints`
`Kbd` + 11/16 `text-3` label, 4px key→label, 12px between pairs. Props: `hints: { keys; label }[]`, `className?`.
`PEOPLE_KEY_HINTS` = `J K move · ↵ open · X select · F follow · S save`.

### `ActionStrip`
Multi-select foot (§6.8): `3 selected · Add to pipeline P · Save to list · Message M · Compare · esc clear`. Count mono `text-1`,
"selected" 12/16 500 `text-2`, actions are default TextButtons with Kbd hints, dots in `text-4`. Fades in over 120ms. `role="toolbar"`.
Props: `count: number`, `actions: { id; label; keys?; icon?; disabled?; onSelect }[]`, `onClear()`, `inset?` (16), `className?`.
`PEOPLE_STRIP_ACTIONS` gives the four People actions without handlers.

---

## Notes for other owners

- Row hover actions: `IconButton icon="follow" | "save" | "more"` at size 24 with `keys={['F']}` / `['S']` / `['.']`.
- Row monogram → checkbox: `<Checkbox tabIndex={-1} …>` centered in the 28 × 28 box.
- Right-click context menu on a row: `<Menu open anchor={{ x: e.clientX, y: e.clientY }} items={…} onClose={…} />`.
- Rail flags: `<Flag variant="rail" side="right" offset={9} label="People" keys={['G','P']}>`.
- History long-press menu: `<MenuTrigger openOn={['longpress','contextmenu']} items={…}>` around the Back button (its `onClick` still goes back).
- Primary action flag: `<Button variant="primary" flag="Jonas Petersen (your 1°) worked with Maren at Ledgerline, 2020–22" flagKeys={['M']}>`.
