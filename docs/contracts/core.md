# Core contracts

The public API every other owner builds on. Source of truth is the code; this page lists what you may rely on.
Spec references are to `docs/design-spec.md`.

## Files owned by core

`package.json`, `src/main.tsx`, `src/App.tsx`, `src/styles/**`, `src/lib/**`, `src/state/**`,
`src/shell/{types.ts, sections.tsx, scroll.tsx}`, the temporary `src/shell/AppShell.tsx` (the shell owner replaces it),
the placeholder `src/workspaces/<id>/section.tsx` files (each section owner replaces its own), and the contract stubs
listed at the end.

## Styles

- `src/styles/tokens.css`: §8.1 and §8.8 verbatim, plus a small "core additions" block:
  `--ls-20` (−0.01em), `--ls-28` (−0.015em), `--rail-w`, `--cap-h`, `--foot-h`, `--strip-h`, `--query-h`,
  `--colhead-h`, `--row-h`, `--row-h-compact`, `--channel-w`, `--global-zone-w`, `--ease-out`, `--ease-in`,
  `--hover-out` (`120ms linear`, row hover fade-out), `--reveal` (`80ms linear`, hover actions and checkbox).
- `src/styles/base.css`: reset, `html/body/#root` 100%, body `frame` background with `text-2` 13/18 sans,
  hidden scrollbars everywhere, `::selection`, `:focus-visible` (1px `line-2`, offset 1; rows `[role=row]` inset),
  utility classes `.num` (tabular figures), `.mono` (mono + tabular), `.sr-only`.
- Type shorthands: `font: var(--t-13); font-weight: 500;` (set the weight after the shorthand when it differs).
  `--t-20` / `--t-28` need `letter-spacing: var(--ls-20)` / `var(--ls-28)`.
- Fonts are imported in `main.tsx`: `@fontsource-variable/instrument-sans/wght.css`, `@fontsource/ibm-plex-mono/400.css`, `500.css`.

## Stage and overlays

`App.tsx` renders `<StoreProvider initial={readBoot()}><MotionConfig reducedMotion="user"><Stage><ScrollContainerProvider><AppShell/>`.

- At `innerWidth >= 1200` the stage is the viewport (fixed, inset 0). Below 1200 it is a 1440 × 1024 box scaled by
  `innerWidth / 1440` from the top left (vertical scroll only if the scaled height exceeds the viewport).
- `lib/stage.ts`
  - `useStage(): { width, height, scale, scaled }` (live; width is the design width to lay out against).
  - `getStage()`, `subscribeStage(cb)`.
  - `toStagePoint(clientX, clientY)` and `toStageRect(domRect)`: convert pointer and `getBoundingClientRect()` values
    to stage coordinates. **Always convert before positioning an overlay**, or it lands wrong when scaled.
- `lib/overlay.ts`: `getOverlayRoot(): HTMLElement` (the `#strivo-overlays` element), `OVERLAY_ROOT_ID`.
  The root is a zero-size box at the stage's top left, inside the scaled stage, with no z-index.
  Portal into it and position with `position: absolute` (or `fixed`) using stage coordinates; use `--z-flag`,
  `--z-menu`, `--z-palette`, `--z-sheet` directly.

  ```tsx
  createPortal(<div className={s.menu} style={{ left: r.left, top: r.bottom + 8 }} />, getOverlayRoot())
  ```

## Store (`src/state/store.tsx`)

| Export | Use |
|---|---|
| `StoreProvider({ initial: BootParams })` | Already mounted in `App.tsx`. |
| `useApp(selector, isEqual = Object.is)` | Subscribe to a slice. Inline selectors are fine and may close over props. Re-renders only when the selected value changes. Return primitives (e.g. `s => s.selection.people === id`) or pass `shallowEqual` for arrays/objects. |
| `useDispatch()` | `(action: Action) => void` |
| `useStore()` | `{ getState, dispatch, subscribe }` for imperative reads in handlers without subscribing. |
| `useSection()` / `useSectionDef()` | Current `SectionId` / its `SectionDef`. |
| `shallowEqual(a, b)` | One-level equality helper. |

`window.__strivo` is the store (debugging and scripted checks).

Row pattern (22 rows, only the two rows whose flag flips re-render):

```tsx
const selected = useApp((s) => s.selection.people === person.id)
const checked = useApp((s) => s.checked.people.includes(person.id))
const anyChecked = useApp((s) => s.checked.people.length > 0)
```

### State (`src/state/types.ts`)

`AppState` is §12.3 verbatim plus:
- `channelForced: Record<SectionId, boolean>`: the user opened a channel the yield order had folded (`[` in Hiring); layout keeps it.
- `chord: 'g' | null`: a G-chord is pending (the rail shows chord hints while set; cleared after 1200ms or on the next key).
- `HistoryEntry.kind: 'section' | 'segment' | 'object' | 'inspector'` (the history menu glyph).

`BootParams = { section, inspectorOpen: boolean | null, palette: boolean, person: string | null }`.

### Actions

All §12.3 actions, same shapes, plus the extensions marked *.

| Action | Behavior |
|---|---|
| `{ type: 'navigate', section }` | Switch section; closes palette, drop and keyboard sheet. Pushes history. No-op (except closing overlays) for the current section. |
| `{ type: 'setSegment', section, segmentId, record? }` | Set the segment / collection / requisition / outline item; clears that section's checks. Pushes history unless `record: false` (use for scroll-spy). |
| `{ type: 'select', section, id, via }` | `click`: select and open the inspector (sections with one); a click on the already-selected object while the inspector is open closes it (§7.3). `key`: select, inspector unchanged. `peek`: select and open, no history. History: a selection within 800ms of the previous one in the same section replaces the top entry. |
| `{ type: 'step', delta }` | J/K along `sections[current].objectOrder(state)` (clamped, no wrap; from nothing: first/last). Same as `select via 'key'`. |
| `{ type: 'toggleInspector', open?, via?: 'peek' }` | Open/close the current section's inspector (no-op for `inspector: 'none'`). Opening with no selection selects the first object. `via: 'peek'` (Space) writes no history. |
| `{ type: 'setInspectorWidth', section, width }` | Clamped to 360–640, rounded. Remembered per section. Caller snaps (`snapWidth`) and caps by `layout.inspectorMax`. |
| `{ type: 'toggleChannel', folded? }` | Toggle the current section's channel (only `localNav: 'channel'`). Pass `folded: layout.channelFolded` so opening a folded channel forces it visible. |
| `{ type: 'toggleCheck', id, extend? }` | Toggle a check in the current section; `extend: true` only adds. |
| `{ type: 'clearChecks' }` | Clear the current section's checks. |
| `{ type: 'setView', view }` | Current section's view (`table`, `compact`, `gallery`, `board`, `stream`, `sheet`). |
| `{ type: 'openPalette' }` / `{ type: 'closePalette' }` | Open (empty query, highlight 0, closes the drop) / close (resets). |
| `{ type: 'paletteQuery', query }` | Sets the query; highlight back to 0. |
| `{ type: 'paletteMove', delta, count? }` | Move the highlight; with `count` it wraps, without it clamps at 0. |
| `{ type: 'openDrop', drop }` / `{ type: 'closeDrop' }` | `'notifications' \| 'account' \| 'history'`. Opening closes the palette. |
| `{ type: 'back' }` / `{ type: 'forward' }` | Restore the entry's section, segment, subject and inspectorOpen; closes palette/drop. |
| `{ type: 'resize', value }` | `{ from, to }` while dragging (the cap shows `from → to`), `null` on release. |
| `{ type: 'openObject', section, id }` * | Switch section if needed, select `id`, open that section's inspector. One history entry, never merged. Use for notifications, palette results, "Full profile" (`openObject('profile', personId)`), Saved delegation. |
| `{ type: 'extendCheck', delta }` * | ⇧J/⇧K: check the current object, step, check the new one. |
| `{ type: 'setChecks', ids }` * | Replace the current section's checks. |
| `{ type: 'paletteHighlight', index }` * | Pointer hover in the palette list. |
| `{ type: 'toggleKeyboardSheet', open? }` * | `?` sheet. |
| `{ type: 'escape' }` * | Esc ladder: palette → drop → keyboard sheet → pending chord → inspector (pushes history) → checks. |
| `{ type: 'chord', value }` * | Used by the hotkey layer. |
| `{ type: 'goto', index }` * | Jump to a history index (history menu). |

### History (`src/state/history.ts`)

`record`, `restore`, `entryOf`, `sameEntry`, `canGoBack(h)`, `canGoForward(h)`, `backTarget(h)`, `forwardTarget(h)`, `HISTORY_CAP = 50`.
Identical consecutive entries are never pushed. The boot state is entry 0.
Labels for the history menu / back flag: `sections[e.section].label`, `sections[e.section].segmentLabel?.(e.segmentId)`,
`sections[e.section].objectLabel(e.subjectId)`.

## Keyboard (`src/state/useHotkeys.ts`)

- `useHotkeys()`: mount once in the shell (the temporary AppShell does).
- Order of handling for each keydown: escape layers → pending G-chord → section keys → global map.
  Ignored while a text input has focus, except `escape` and `mod+k`. Events already `defaultPrevented` are ignored.
- Combo strings (`comboOf(e)`): modifiers in the order `mod+` (⌘ or Ctrl), `alt+`, `shift+`, then the key.
  Letters and digits come from `e.code` (`'alt+1'`, `'shift+j'`); other printable characters use `e.key` with no
  `shift+` (`'?'`, `'/'`, `'.'`, `'['`, `']'`); named keys are lower-case (`'enter'`, `'escape'`, `'space'`,
  `'arrowdown'`, `'backspace'`).
- **Section keys:** `useSectionKeys(map: Record<string, (e) => void | boolean>, enabled = true)`. The most recently
  mounted map wins; return `false` to decline so the key falls through. Handled keys get `preventDefault()`.
  People registers e.g. `'/'`, `'enter'`, `'f'`, `'s'`, `'m'`, `'p'`, `'.'`, `'1'`–`'3'`, `'mod+s'`, `'alt+1'`–`'alt+5'`, `'backspace'`.
- **Escape layers:** `useEscapeLayer(open, onEscape, { exclusive = true })` for menus, popovers, the clause popover
  and similar local overlays. While open, Esc calls the topmost layer's `onEscape`; an exclusive layer also blocks all
  other global/section keys (the menu owns arrows and letters). `hasOpenLayer()` tells whether any is open.
- **Global map (defaults):** `mod+k` palette toggle · `mod+[` / `mod+]` back/forward · `g` then a section's `chord`
  letter (1200ms) · `[` channel · `]` inspector · `?` keyboard sheet · `escape` Esc ladder · `j`/`k`/`arrowdown`/`arrowup`
  step (declined when `objectOrder` is empty, so arrows scroll) · `shift+j`/`shift+k` (and shift+arrows) extend checks ·
  `space` peek toggle (no history) · `x` check the selected object. Sections override any of these with `useSectionKeys`.
- Chord letters: H home, P people, C companies, J jobs, R projects, A applications, I hiring, S saved, N activity, M profile.

## URL (`src/lib/boot.ts`, `src/state/urlSync.ts`)

- `readBoot()`: `?section=` (wins) → `#hash` → `people`. `?inspector=0` closes the boot section's inspector and keeps
  its selection; `?inspector=1` opens it. `?palette=1` opens the palette. `?p=<id>` overrides the People selection.
- `useUrlSync()` (mounted by the shell): writes `?section=<id>` plus `&p=<id>` in People with `history.replaceState`;
  a later `hashchange` to a section id dispatches `navigate`.
- `SECTION_IDS`, `isSectionId(v)` are exported from `lib/boot.ts`.

## Layout (`src/lib/layout.ts`, `src/state/useLayout.ts`)

`computeLayout(viewportW, def, state)` → `{ railW, channelW, workspaceW, inspectorW, channelFolded, channelVisible,
inspectorVisible, modeMin, inspectorMax, workspaceLeft, workspaceRight, globalZoneX }`.
It applies yield steps 1 (channel folds) and 3 (inspector narrows toward 360). Step 2 (the mode's own parts) is the
workspace's job, driven by `workspaceW`. `useLayout(sectionId?)` returns it for the live stage width.
Boot results at 1440: People 56 + 984 + 400; Jobs 56 + 824 + 560; Hiring channel folded, 56 + 984 + 400;
Saved 56 + 200 + 1184; Profile 56 + 200 + 1184.

## Scroll container (`src/shell/scroll.tsx`)

- `useRegisterScrollContainer(): (node) => void`: a callback ref for the active workspace's scrolling container
  (People rows, Jobs rows, the Companies lattice…). Only clears on unmount if nobody else registered meanwhile.
- `useScrollContainer(): HTMLElement | null` (for TetherNotch). Rows/tiles/slabs inside must carry `data-object-id`.

## Section registry (`src/shell/types.ts`, `src/shell/sections.tsx`)

`SectionDef` is §12.2 exactly, with `icon: SectionIcon` (the nine rail icon names, a subset of `IconName`), and these
optional wiring fields:

| Field | Meaning |
|---|---|
| `modeMinWidth?: number` | Overrides `MODE_MIN[mode]`. |
| `railCount?: number` | Mono rail count: Applications `2`, Hiring `14`. |
| `requiresEmployerSeat?: boolean` | Hiring (D18). |
| `segmentLabel?(id): string` | Label for a segment/collection/requisition/outline id. |
| `capActionsFor?(state): CapAction[]` | State-dependent cap actions (People: `Export` → `Compare (n)` at 2–4 checks). Fallback `capActions`. |
| `onCapAction?(id, dispatch, state)` | Cap action click. |

`sections: Record<SectionId, SectionDef>`, `RAIL_GROUPS` (rail order by group), `getSection(id)`.

Static values set in every `section.tsx` (keep them when you replace the file): label, icon, railGroup, railSection
(profile → people), chord, mode, localNav, channelTitle (Hiring "Requisitions", Saved "Collections", Profile "Outline"),
inspector class (Jobs `reader`, Profile `none`, others `peek`), boot values (§5.4/§12.3), crumbs, capActions, railCount.
Placeholder parts to replace: `Workspace`, `WorkspaceFoot`, `Channel`, `InspectorBody`, `InspectorFoot`,
`objectOrder` (People already returns the 22 ids in §13.4 order), `objectLabel` (currently title-cases the id).

Import cycle note: `store.tsx` imports the registry, which imports every section module. Never read `sections` or
call store functions at module top level; only inside components, hooks and handlers.

## lib

- `geometry.ts`: `CANVAS_W/H`, `RAIL_W 56`, `CAP_H 40`, `FOOT_H 28`, `STRIP_H 36`, `QUERY_H 40`, `QUERY_H_WRAPPED 64`,
  `COLHEAD_H 28`, `ROW_H 44`, `ROW_H_COMPACT 32`, `GROUP_H 28`, `CHANNEL_W 200`, `PEEK_W 400`, `READER_W 560`,
  `INSPECTOR_MIN 360`, `INSPECTOR_MAX 640`, `SNAP_POINTS`, `SNAP_ZONE 6`, `GLOBAL_ZONE_W 112`, `MODE_MIN`, `Mode`,
  `SIDE_PAD 16`, `INSPECTOR_PAD 20`, `READER_PAD 24`, `SECTION_GAP 20`, `NOTCH 2`, `TETHER_H 20`, `TETHER_STUB_H 8`,
  rail metrics, `ROWS_TOP 144`, `BODY_BOTTOM 996`, `rowTop(i, h)`, `clamp`, `snapWidth(w, max)`, `inspectorDefault(cls)`.
- `motion.ts`: `snap`, `panel`, `easeOut`, `easeIn`, `fadeIn(ms, delay)`, `fadeOut(ms)` (§9 verbatim), plus
  `LIST_STAGGER_MS 12`, `LIST_STAGGER_ROWS 12`, `SWAP_OUT_MS 70`, `SWAP_IN_MS 120`, `SWAP_MAX_PER_SEC 8`,
  `FLAG_DELAY_MS 400`, `CHORD_WINDOW_MS 1200`, `HISTORY_MERGE_MS 800`, `LONG_PRESS_MS 400`, `dropMotion`, `flagMotion`.
  Mount motion elements with `initial={false}` at boot (§9); `AnimatePresence initial={false}`.
- `time.ts`: `NOW` (2026-09-28T12:32Z), `NOW_YM '2026-09'`, `parseOffset`, `formatOffset`, `localTime(offset)`,
  `relative(date)`, `formatDay` ('Mon 28 Sep'), `formatDate` ('11 Jan 2027'), `parseYM`, `formatYM`, `ymIndex`,
  `monthsBetween(from, to|null)`, `addMonths`, `formatDuration(months)` ('3y 1m'), `yearsRange(from, to)` ('2020–23',
  '2023–'), `formatMonthYear('2027-01')`.
- `cx.ts`: `cx(...classValues)`.

## Contract stubs (owners replace the bodies; signatures are fixed)

```ts
// src/workspaces/people/PersonInspector.tsx
export function PersonInspector(props: { id: string; afterFit?: React.ReactNode }): JSX.Element
export function PersonInspectorFoot(props: { id: string }): JSX.Element
// src/workspaces/people/WorkThumb.tsx
export function WorkThumb(props: { kind: string; width: number; height: number }): JSX.Element
// src/workspaces/people/CareerStrip.tsx   (dates 'YYYY-MM')
export function CareerStrip(props: { entries: { from: string; to?: string; current?: boolean }[]; width?: number }): JSX.Element
// src/workspaces/jobs/JobReader.tsx
export function JobReader(props: { id: string }): JSX.Element
export function JobReaderFoot(props: { id: string }): JSX.Element
```
