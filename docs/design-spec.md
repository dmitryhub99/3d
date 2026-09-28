# STRIVO: final design spec for the desktop shell

Status: **final and binding.** This is the only document implementation agents follow. Every value is final. Where it says "is", "does" or "must", build exactly that. Nothing is optional, and there are no alternatives.

Canvas: 1440 × 1024 at 1x. Dark only. Every coordinate in this document is on that canvas, unless a section says it is relative.

Lineage: the base is **Concept A (Instrument)**, which all three judges ranked first. Its frame, density, notch grammar and color discipline are kept. Grafted onto it:

- From **Concept C (Seam)**: numbered query clauses and the per-clause Fit block; the seam (the selected row takes on the inspector's fill); crumbs anchored to panels; quiet selection; the inspector width classes and yield order; hover actions that replace a column instead of covering it; merging rapid J/K moves into one history entry.
- From **Concept B (Editorial)**: the row evidence phrase; the primary action's target line; the acting-as org badge; the foot that turns into an action strip on multi-select; "by fit" as the last facet of the query.

Every "mustAvoid" item from the three judges is honored. §11.2 maps each one to its resolution.

---

## 0. Decisions that resolve conflicts between the judges

Read this first. Each line settles a point where the concepts or the judges disagreed.

| # | Question | Decision |
|---|---|---|
| D1 | Separate SPLIT pane for Jobs (A) or inspector Reader (C)? | **Reader.** There is one way to show detail: the inspector slot, in width class **Peek 400** or **Reader 560**. SPLIT does not exist. There are five modes: INDEX, STREAM, MATRIX, BOARD, SHEET. |
| D2 | Should the bell open in the inspector slot (C) or as a drop (A)? | **Drop.** Rule: *objects* always open in the inspector slot. *Transient lists* (menus, the command palette, the notification drop) float and never replace the inspector's subject. Choosing a notification opens its object in the inspector. |
| D3 | Should every section have a local column, or only some? | **Local navigation lives in exactly one of two places.** Flat view lists of 7 or fewer go in the **segment strip** (Home, People, Jobs, Companies, Projects, Applications, Activity). Long or hierarchical lists go in the **channel column**, 200px wide (Hiring requisitions, Saved collections, Profile outline). People never has a channel. |
| D4 | Filter chips (A) or a query sentence (B/C)? | **A structured query sentence with numbered clauses.** Each clause is a button with a dotted underline on hover that opens a popover. **There is no free-text parser.** Typed text becomes an explicit keyword clause. Sort is the unnumbered last facet ("— by fit"). Grouping lives in the Display menu, and its default is None. |
| D5 | Index column `001` (A)? | **Removed.** On row hover, the monogram becomes a checkbox. Once any row is checked, every row shows a checkbox. |
| D6 | Registration-mark crosses (A)? | **Removed.** Nothing is ornamental. |
| D7 | How much mono? | **Mono is only for figures:** counts, degrees (`2°`), dates and years, durations and tenure, UTC offsets and local times, fit fractions (`4/5`), position readouts (`4/22`), width readouts, clause indices and key caps. Column headers, section labels, object labels, readout sentences and group titles are **sans, sentence case**. |
| D8 | Should the inspector cap hold the bell? | **No.** A **global zone** at x 1328–1440 belongs to no panel. It holds the visible `⌘K` trigger and the bell, and its x never changes. |
| D9 | How is the command palette reached? | Two ways, both visible at rest: the **address line** (click to edit in place) and the **`⌘K` trigger** in the global zone. Both open the same palette, which hangs from the address line. |
| D10 | What marks the row the inspector is reading? | **Seam and notch.** The selected row takes the inspector's fill (`raised`). The x=1040 separator is absent across that row's height. A 2 × 20 orange **tether notch** sits centered in that gap. |
| D11 | What happens to the selection when the inspector closes? | **Quiet selection.** The row keeps its `raised` fill. The notch retracts. No mark is parked anywhere, and there is no stub at x=1439. |
| D12 | Where do batch actions go on multi-select? | In the **workspace foot**, which becomes an action strip. The cap's `Export` becomes `Compare (n)`. The inspector keeps its current subject. |
| D13 | Should the rail have a labeled mode? | **No.** The rail is always 56px, and it is the one invariant. Labels appear as hover flags. `[` toggles the channel column in the sections that have one. |
| D14 | Which status hues? | `ok` (sage) and `warn` (ochre), plus neutral grays. `err` is used only for real errors. There is no blue, violet or steel. Shape carries the meaning (● ◐ ○ ■). |
| D15 | Circle or square avatars? | **Square monograms**, radius 4, on six muted hue tiles, with initials in `text-2` (and `text-1` at 56px and above). There are no photos and no circles. |
| D16 | Surface values? | Frame `#121212` → workspace `#161514` → inspector and selection `#1C1B19`. The raised value sits 3 steps above the brief's "around #191817", so the selected-row seam reads against the workspace. `#191817` itself is the row-hover fill. |
| D17 | How is Activity unread shown? | The **bell** carries the one unread mark, a 5 × 5 orange square. The Activity rail item has no orange. |
| D18 | Is Hiring always visible? | The Hiring rail item exists only when the viewer holds an employer seat. The mock viewer holds one (Tandem), so it is shown. |

---

## 1. Thesis

**STRIVO is a lattice of columns, and focus is drawn on the lines between them.** There is no top bar and no sidebar. The screen is a row of full-height columns: rail, optional channel, workspace and optional inspector. Every column has the same three bands: a 40px **cap** that says where you are, a **body** where the work happens, and a 28px **foot** that reads out state. The cap line at y=40 and the foot line at y=996 run the full width. The separators run the full height. No horizontal bar ever crosses a separator.

Selection is drawn **on the separators themselves**:

- The current section is a 2px orange **notch** on the rail separator.
- The current segment is a notch on the segment hairline.
- The object the inspector is reading is the **tether notch** on the inspector separator, where the separator **opens** so the selected row runs straight into the inspector (the **seam**).

The **crumbs follow the lattice**: the last `›` of the location path sits exactly on the separator of the panel it names. **Relevance is the user's own query answered row by row**: numbered clauses, one tick per clause, and a per-clause evidence line in the inspector. Remove the logo and what remains is still unmistakable: a lattice of hairlines, orange notches sliding along them, a seam where the chosen person meets their dossier, and a query written as a sentence whose clauses reappear as ticks.

---

## 2. Frame geometry (People state)

### 2.1 Pixel convention
- A range `x 56–1040` means the half-open interval [56, 1040).
- A hairline "on x=1040" is painted in the **last pixel column of the region to its left** (x=1039) with `box-shadow: inset -1px 0 0 var(--line-1)`.
- A hairline "on y=40" is painted in pixel row 39 by the cap (`inset 0 -1px 0`). The foot line "on y=996" is painted in pixel row 996 by the foot (`inset 0 1px 0`).
- **Notches** are 2px thick. They cover the hairline pixel plus the first pixel of the region that follows it:
  - rail notch: x 55–56
  - tether notch: x 1039–1040
  - segment notch: y 75–76
- A region draws its right-edge hairline only when another column follows it. The rightmost column never draws a line at x=1439.

### 2.2 Regions

| Region | x | y | w × h | Surface | Edges |
|---|---|---|---|---|---|
| Rail cap | 0–56 | 0–40 | 56 × 40 | `frame` #121212 | right, bottom |
| Rail body | 0–56 | 40–996 | 56 × 956 | `frame` | right |
| Rail foot | 0–56 | 996–1024 | 56 × 28 | `frame` | right, top |
| Workspace cap | 56–1040 | 0–40 | 984 × 40 | `frame` | right, bottom |
| Workspace body | 56–1040 | 40–996 | 984 × 956 | `surface` #161514 | right. The seam opens here |
| Workspace foot | 56–1040 | 996–1024 | 984 × 28 | `frame` | right, top |
| Inspector cap | 1040–1328 | 0–40 | 288 × 40 | `frame` | bottom. The crumb joint sits on its left edge |
| **Global zone** | 1328–1440 | 0–40 | 112 × 40 | `frame` | bottom. It belongs to no panel. A 1 × 16 `line-1` tick sits at x=1328, y 12–28 |
| Inspector body | 1040–1440 | 40–996 | 400 × 956 | `raised` #1C1B19 | none |
| Inspector foot | 1040–1440 | 996–1024 | 400 × 28 | `frame` | top |

- The **frame** (the rail, every cap, every foot) is one continuous #121212 setting.
- The **bodies** are the plates set into it. The workspace plate is #161514. The inspector plate is #1C1B19. Brightness steps up once in each direction: frame → work → context.
- **Borders exist only on lattice lines.** Those are x=56, x=1040, y=40 and y=996, plus the two workspace sub-band hairlines at y=76 and y=144.
- No panel has a border box, a shadow or a radius.

### 2.3 Workspace body sub-bands (People)

| Band | y | h | Scrolls? | Bottom edge |
|---|---|---|---|---|
| Segment strip | 40–76 | 36 | no | hairline `line-1` on y=76 (pixel row 75). The segment notch sits on it |
| Query line | 76–116 | 40 | no | none. It is separated from the header by space only |
| Column header | 116–144 | 28 | no | hairline `line-1` on y=144 (pixel row 143) |
| Rows | 144–996 | 852 | **yes** (the only scroll container) | none |

- Rows are 44px. Row *i* (0-based) spans y 144+44i to 188+44i.
- **19 full rows are visible** (rows 0–18 end at y=980). Row 19 shows its top 16px.
- **Scroll-state line:** when the rows container is scrolled more than 0px, the column-header hairline switches from `line-1` to `line-2`. No shadow is ever used.
- Native scrollbars are hidden on every body: `scrollbar-width: none` and `::-webkit-scrollbar { display: none }`.

### 2.4 ASCII wireframe, 1440 × 1024

Scale: 1 char ≈ 14.4px horizontally, rows not to scale. `▐` is the rail notch on x=56. `▀▀▀` is the segment notch on y=76. `┃` is the tether notch on x=1040. `▒` is the selected row with the seam open. `╎` is the global-zone tick.

```
x 0   56                                                                    1040                 1328      1440
  ┌───┬─────────────────────────────────────────────────────────────────────┬────────────────────╎─────────┐ y0
  │ S │ ‹ › │ People › Design leads · EMEA            Share  Export  ◨ │›  Maren Aaltonen   4/22 ˄ ˅ × ╎ ⌕ ⌘K  ◻• │
  ├───┼─────────────────────────────────────────────────────────────────────┼──────────────────────────────────────┤ y40
  │ ⌂ │ All people 1,284  Design leads · EMEA 22  Following 212  Warm in…  +  [▤▥▦] Display │ [MA]  Maren Aaltonen          │
  │▐◉ │                   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀                            │       Senior Product Designer —│ y76
  │ ▦ │ ⌕ 1Product designers  2senior or above  3in EMEA, UTC−1 to +3         │       design systems, editor… │
  │   │   4with design systems  5available within 3 months  — by fit  + Clause│ Plinth · Berlin, Germany · 14:32│
  │ ▭ │ Person            Company        Fit ↓            Skills       Availability  Relation │ ● Open to roles from 11 Jan 2027│ y116
  │ ◫ ├─────────────────────────────────────────────────────────────────────┤   Full-time or contract · …   │ y144
  │   │ [AD] Aurélien Duclos  ▫ Oriel 6y   ■■■■■ 5/5  Design systems  ● Open    2°       │ [Request intro via Jonas][Follow][▯][⋯]│
  │ ⇅ │      Principal Des…   Paris · UTC+2 Built Oriel's token… Design tokens +2 Nov 2026 5 mutual│ → for Staff Designer, Canvas · Tandem│
  │ ▽ │ [TL] Tove Lindqvist   ▫ Northdesk 3y ■■■■■ 5/5  Design systems  ◐ Exploring 1°  │                                 │
  │   │      Staff Product…   Stockholm · … Leads Northdesk's… Accessibility +2 Dec 2026 Follows you│ Fit · Design leads · EMEA ── 4/5│
  │ ▯ │ [KA] Kwame Asante     ▫ Halden 2y   ■■■■■ 5/5  Design systems  ● Open    2°       │ ■ 1 Product designer   Senior PD │
  │ ∿ │      Senior Product…  Amsterdam · … Rebuilt Halden's…  React +2   Oct 2026  In pipeline │ ■ 2 Senior or above   11 yrs · …│
  │   │▒[MA] Maren Aaltonen   ▫ Plinth 3y   ■■■■□ 4/5  Design systems  ● Open    2°      ▒┃ ■ 3 EMEA, UTC−1 to +3  Berlin · …│ y276
  │   │▒     Senior Product…  Berlin · UTC+2 Leads Plinth's d…  Editor / canvas UX +2 Jan 2027 3 mutual▒┃ □ 5 Available within… from 11 Jan│ y320
  │   │ [WK] Wanjiru Kamau    ▫ Mawimbi 4y  ■■■■□ 4/5  Design systems  ◐ Exploring 2°   │                                 │
  │   │ …  (19 full rows visible)                                          │ Eleven years designing tools for│
  │   │                                                                    │ designers. Leads Plinth's …     │
  │   │                                                                    │ Experience ───────────── 11y    │
  │   │                                                                    │ ▬▬▬ ▬▬▬▬▬▬ ▬▬▬▬▬▬▬ ▬▬▬▬▬▬▬       │
  │   │                                                                    │ 2023–  Senior Product Designer  │
  │   │                                                                    │ …                               │
  │   │                                                                    │ Selected work ────────────── 2  │
  │ ⚙ │                                                                    │ [thumb 170×96] [thumb 170×96]   │
  │RK │                                                                    │ Skills ─────────── 1 of 8 match │
  ├───┼─────────────────────────────────────────────────────────────────────┼──────────────────────────────────────┤ y996
  │ • │ 22 results · 3 match all 5 · 1 selected · by fit …   J K move ↵ open X select F follow S save │ Updated 6d ago · 2 of 4 roles verified   ↵ Full profile │
  └───┴─────────────────────────────────────────────────────────────────────┴──────────────────────────────────────┘ y1024
```

---

## 3. Global navigation (the rail)

**Rule:** the vertical axis is global, and the caps are local. Things that belong to the whole product live in the rail or in the global zone. Nothing global sits inside a workspace or inspector cap.

- **Width:** always 56. It never collapses, expands or overlays.
- **Items:** icon only.
  - Hit target: 40 × 32 at x 8–48.
  - Selected/hover square: 32 × 32 at x 12–44, radius 4.
  - Icon: 16 × 16, centered on x=28.
- **Cap (y 0–40):** the STRIVO mark (§8.6), 16 × 16 at (20, 12), in `text-2`, `text-1` on hover. A click goes Home.
- **Groups:** there are no visible group titles. Groups are separated by a 12px gap. A 1px tall, 8px wide `line-2` tick sits centered in each gap (x 24–32).

| Group | Item | y (hit) | Icon (§8.6) | Chord |
|---|---|---|---|---|
| Network | Home | 48–80 | `home` | G H |
| | People | 80–112 | `people` | G P |
| | Companies | 112–144 | `companies` | G C |
| (tick y=150) | | | | |
| Work | Jobs | 156–188 | `jobs` | G J |
| | Projects | 188–220 | `projects` | G R |
| (tick y=226) | | | | |
| Pipeline | Applications | 232–264 | `applications` | G A |
| | Hiring | 264–296 | `hiring` (shown only with an employer seat) | G I |
| (tick y=302) | | | | |
| You | Saved | 308–340 | `saved` | G S |
| | Activity | 340–372 | `activity` | G N |
| Bottom | Settings | 916–948 | `settings` | — |
| Bottom | Account | 956–984 | monogram (below) | G M = own profile |

**States:**
- **Rest:** icon `text-3`, no fill.
- **Hover:** icon `text-1`, and the 32 × 32 square fills with `hover` #191817.
- **Label flag:** after 400ms of hover a flag appears.
  - Placement: flush at x=57, 24px tall, vertically centered on the item.
  - Style: padding 0 8, `overlay` #211F1D, 1px `line-2` border on the top, right and bottom sides only, radius 0 4 4 0.
  - Content: the label in 12/16 500 `text-1`, then 8px, then the chord as two `Kbd` caps (`G` `P`).
  - While any flag is visible, moving to another item swaps the flag with 0ms delay.
- **Selected:** icon `text-1`, square `active` #221F1C, plus the **rail notch**: 2 × 20 `accent`, x 55–56, centered on the item. For People that is y 86–106.
- **Counts:** there are no pills. A count is mono 10/12 500 `text-2`, right-aligned to x=46, baseline at item bottom − 6.
  - Applications shows `2` (status changes).
  - Hiring shows `14` (unreviewed candidates).
  - No other rail item shows a count or a dot.
- **G-chord hints:** after `G` is pressed, every item shows its second key as a `Kbd` at its lower left (x 10, bottom − 2) for 1200ms or until the chord completes.

**Account zone:**
- **Monogram:** 28 × 28 at x 14–42, y 956–984, radius 4, hue tile `--hue-2` #332B27, initials `RK` 11/12 600 `text-1`. The viewer is **Rhea Kovač**, Design Director at Tandem.
- **Acting-as org badge:** 12 × 12 at x 34–46, y 976–988, radius 2, fill `--hue-3` #2B2E33, the letter `T` in 8/8 600 `text-1`, with a 2px `frame` ring (`box-shadow: 0 0 0 2px var(--frame)`). The badge shows only while the viewer is acting as an employer. The flag reads "Rhea Kovač · acting as Tandem".
- **Menu:** a click opens a menu anchored at x=57, bottom-aligned to y=984, 240 wide (§8.7 Menu style). It contains:
  - Context: `Personal`, `Tandem · Hiring` (active: text-1 plus a 2 × 16 `accent` notch on the menu's left edge)
  - Separator
  - `Your profile` G M
  - `Preferences`
  - `Keyboard shortcuts` ?
  - `Sign out`

**Rail foot (y 996–1024):** a 6 × 6 circle centered at (28, 1010). It is filled `ok` when synced and a 1px `text-3` ring when offline. Its flag reads "Synced 12s ago".

---

## 4. Top application context (the caps)

The header is the row of caps, 40 tall. The separators split it at x=56 and x=1040, and it has no background of its own that differs from the rail.

### 4.1 Workspace cap (x 56–1040), left to right
1. **History** (x 68–120): Back at x 68–92 and Forward at x 96–120. Each is 24 × 24 with a 12px chevron in `text-3`, or `text-4` when disabled.
   - Hovering shows a flag with the target, for example "← People › All people".
   - Long-press (400ms) or right-click opens a history menu with the last 12 entries. Each entry shows a 12px glyph for its kind (section, segment or object) and its label, for example "Maren Aaltonen · Design leads · EMEA".
   - Shortcuts: `⌘[` and `⌘]`.
2. **Tick:** 1 × 16 `line-1` at x=132, y 12–28.
3. **Address line** (starts at x=144, max 520 wide): the path in 13/18 500.
   - Ancestors are `text-3`. The leaf is `text-1`. Separators are a 12px `chevron-right` in `text-4` with 6px on each side.
   - People: `People › Design leads · EMEA`.
   - **Rules:** section › segment/collection/requisition is at most 2 crumbs here. The object crumb never appears in the workspace cap: it lives in the inspector cap (§4.2), or in the workspace cap as the leaf only when the section has no inspector (Profile: `People › Maren Aaltonen`). The section name is never repeated as a page title inside the body.
   - **Dirty state:** after the leaf come 8px, a 5 × 5 `accent` square, 6px, and "edited" in 12/16 `text-3`.
   - **Hover:** a 1px `line-2` outline appears around the whole path (padding 4 8, radius 4), and the cursor becomes `text`.
   - **Click, or `⌘K`:** the path becomes the palette input in place (§10.1).
4. **Right cluster**, right-aligned to x=1028 with 8px gaps:
   - Text buttons 24h, 12/16 500 `text-2`, padding 0 8, hover fill `hover`: **Share**, **Export**. When 2–4 rows are checked, Export becomes **Compare (n)**.
   - Tick 1 × 16 `line-1`.
   - **Inspector toggle**: 24 × 24 `panel-right` icon, with its right third filled while the inspector is open. Flag: "Inspector ]".
   - When the inspector is closed, the workspace cap spans x 56–1328, and the right cluster is right-aligned to x=1316.

### 4.2 Inspector cap (x 1040–1328)
- **Crumb joint:** a 12px `chevron-right` in `text-4`, centered on x=1040 at y=20, inside a 14 × 16 box filled with `frame`. The box masks the separator line behind it, so the path visibly crosses the lattice into the panel it names. It is the only place the separator is interrupted in a cap.
- **Object crumb:** "Maren Aaltonen" in 13/18 500 `text-1`, at x=1056, truncated with an ellipsis before the readout.
- **Right group**, right-aligned to x=1316:
  - Position readout `4/22` in mono 11/16 `text-3`, right-aligned to x=1232.
  - Prev `chevron-up` (x 1240–1264, key `K`).
  - Next `chevron-down` (x 1264–1288, key `J`).
  - Close `close` (x 1292–1316, key `Esc`).
  - All are 24 × 24 with `text-3` icons.
- **While resizing,** the position readout is replaced by the live width readout `400 → 452` in mono 11/16 `text-2`.

### 4.3 Global zone (x 1328–1440). Its position is fixed in every state
- Tick: 1 × 16 `line-1` at x=1328, y 12–28.
- **Command trigger:** x 1340–1404, y 8–32 (64 × 24). 1px `line-2` border, radius 4, no fill; hover fill `hover`. It holds a 12px `search` icon in `text-3` at x+8, then a `Kbd` pair `⌘` `K`. The keycap is always visible. A click opens the palette.
- **Bell:** x 1408–1432, y 8–32. It is a 16px `bell` icon in `text-3`. When there are unread notifications, a 5 × 5 `accent` square sits at the icon's top right (x 1423–1428, y 11–16). A click opens the notification drop (§10.2). Key: `G N` goes to Activity. The bell itself has no key.

---

## 5. Layout modes: the spatial grammar

### 5.1 The five modes

| Mode | How the workspace body divides | Inspector class | Mode min width |
|---|---|---|---|
| **INDEX** | Dense sortable rows at full workspace width (44 Table / 32 Compact) | Peek 400 or Reader 560 | 640 |
| **STREAM** | One reading measure of 560, plus a 240 margin column aligned to it | Peek 400, opened on demand | 640 (the margin yields below 848) |
| **MATRIX** | A hairline tile lattice with zero gaps. Tiles are divided by `line-1`, never carded | Peek 400 | 656 |
| **BOARD** | Equal-width stage lanes divided by hairlines. Each lane holds 56px slabs | Peek 400 | 880 |
| **SHEET** | A 680 document measure plus a margin readout column | none (forbidden) | 720 |

**Inspector width classes:**
- **Peek** defaults to 400.
- **Reader** defaults to 560 and uses a 15/24 reading measure.
- Resize range is 360–640. Snap points are 360, 400, 480, 560 and 640, with a 6px snap zone.
- Width is remembered per section. It is capped so the workspace never drops below the mode min width.

**Yield order.** It applies in every mode, whenever `viewport − rail − channel − inspector < mode min`. Steps run in this order:
1. The **channel folds** to 0. Its selection remains in the address line.
2. The **mode yields its low-priority parts**:
   - INDEX hides columns by priority (People: Skills, then Relation, then Company).
   - STREAM hides the margin column.
   - MATRIX drops a tile column.
   - BOARD lanes compress to a minimum of 168, then empty lanes collapse to 40px spines that show their vertical label and count.
   - SHEET hides the margin readouts.
3. The **inspector narrows** toward 360.

Nothing ever overlays the work surface, and nothing scrolls horizontally.

### 5.2 The tether rule (all modes with an inspector)
- The **tether notch** (2 × 20 `accent`, x 1039–1040 on the inspector separator) is always drawn at the vertical center of the selected object's box.
- The **seam** opens only when the selected object's box touches the separator. INDEX rows always touch it. MATRIX tiles in the last column touch it. BOARD slabs never do, because of lane padding. A seam means the object has `raised` fill running to x=1040 and the separator line is absent across its height.
- If the selected object is scrolled out of view, the notch becomes a 2 × 8 stub pinned to the top (y 144–152) or bottom (y 988–996) of the scroll container. Clicking the stub scrolls the object back into view.

### 5.3 What stays constant, and what changes
- **Constant:** the lattice (40 cap, 28 foot, full-height separators); the rail and its notch; the global zone; the cap's left cluster (history and address line); the crumb joint on the inspector separator; the inspector's surface and anatomy order (identity → actions → fit/facts → narrative → evidence → context); selection as a notch on a separator; row metrics (44/32, 16px side padding); the key map (`J/K`, `↵`, `Space`, `Esc`, `]`, `[`, `X`, `F`, `S`, `.`); all type, color and motion.
- **Changes:** the mode, whether local navigation sits in the segment strip or the channel, the inspector class (none, Peek or Reader), and the query clauses.

### 5.4 Section registry and composition sketches

| Section | Mode | Local nav | Inspector at boot | Address line | Cap actions |
|---|---|---|---|---|---|
| Home | STREAM | strip | closed (Peek on demand) | `Home › Following` | New post |
| People | INDEX | strip | **open**, Peek 400, `maren-aaltonen` | `People › Design leads · EMEA` | Share, Export |
| Companies | MATRIX | strip | open, Peek 400, `halden` | `Companies › Hiring now` | Share |
| Jobs | INDEX | strip | open, **Reader 560**, `job-halden-principal` | `Jobs › Recommended` | Share |
| Projects | MATRIX | strip | open, Peek 400, `brief-brisa-audit` | `Projects › Marketplace` | New brief |
| Applications | INDEX, grouped by stage | strip | open, Peek 400, `app-oriel-head` | `Applications › Active` | Export |
| Hiring | BOARD | channel (requisitions), folded by the yield order | open, Peek 400, `cand-kwame-asante` | `Hiring › Staff Designer, Canvas` | Share, Scorecards |
| Saved | INDEX, mixed objects | channel (collections), open | closed | `Saved › All saved` | New collection |
| Activity | STREAM (log) | strip | closed | `Activity › All` | Mark all read |
| Profile | SHEET | channel (outline), open | none | `People › Maren Aaltonen` | Share, Copy link |

The segment strip and the channel are defined in §6.2 and §5.5. Every composition below keeps the lattice from §2.

**Home / Feed (STREAM).**
- **Strip:** `Following` (selected), `Your field`, `Companies`, `Saved searches 3`.
- **Measure:** x 120–680 (560). **Margin column:** x 728–968 (240).
- **Posts** have no cards.
  - Author line: monogram 28, name 13/18 500 `text-1`, then role · company 12/16 `text-3`, with the time in mono 11 `text-3` right-aligned to x=680.
  - Body: 14/22 400 `text-1`.
  - Attachment (only on posts whose data has one): a `sunken` well, 1px `line-1`, radius 2, 560 × 160, drawn in SVG.
  - Action line: `Reply 12 · Repost 4 · Save` in 12/16 `text-3`, with the figures in mono.
  - Posts are separated by 32px of space and a 1px `line-1` rule from x 120 to 680.
- **Margin notes** align to each post's first line, in 12/16 `text-3` with names in `text-2`, for example "Aiko Mori and 2 others you follow replied".
- The top of the margin carries a readout: `3 new since 09:14`, with the figures in mono.
- Clicking an author opens their Person inspector (Peek). The margin yields first when space runs short.

```
[rail][ cap: ‹ › Home › Following ···························· New post ][ global ]
[    ][ Following · Your field · Companies · Saved searches 3                    ]
[    ][        │ post (measure 560) ─────────────── 09:14 │   margin note (240)   ]
[    ][        │ body 14/22 …                             │   "Aiko Mori and 2…"  ]
[    ][        │ [schematic well 560×160]                 │                       ]
```

**People (INDEX + Peek).** Specified in §6 and §7.

**Companies (MATRIX + Peek).**
- **Strip:** `Following 64`, `Hiring now 23` (selected), `Design-led 41`, `Fintech · EMEA 18`.
- **Query line:** clauses [1] `hiring designers` [2] `in` `EMEA` [3] `50–500 people`, then `— by` `open roles`. (In this document, [n] marks the clause index that §6.3 renders.)
- **Tiles:** the MATRIX lattice runs edge to edge across the workspace body (x 56–1040), with no side padding: 3 columns of 328 × 176. Tiles share 1px `line-1` hairlines, and tile content has 16px of inner padding. Last-column tiles touch the inspector separator.
- **Tile content:**
  - Company glyph: 32 × 32, radius 4, hue tile, initial 13/18 600 `text-2`.
  - Name: 13/18 500 `text-1`.
  - Sector · HQ: 12/16 `text-3`.
  - A 3-cell readout row: `Headcount 180 · Open roles 6 · You know 4`. Labels are 11/16 `text-3`; figures are mono 13/18 `text-1`.
  - One-line thesis: 12/16 `text-2`.
- **Selected tile:** `raised` fill. It seams to the inspector when it sits in column 3.
- **Peek:** company identity, facts, open roles as INDEX rows, and people you know as person rows.

**Jobs (INDEX + Reader 560).**
- **Strip:** `Recommended 48` (selected), `Saved searches 3`, `Tracked 6`, `Applied 4`.
- **Workspace:** 824 wide (56–880).
- **Query line:** [1] `principal or staff` [2] `product design` [3] `remote in EMEA` [4] `€120k or more`, then `— by` `fit`.
- **Rows:** 44px, two lines.

  | Column | Width | Line 1 | Line 2 |
  |---|---|---|---|
  | Role | 360 | Title 13/18 500 `text-1` | Company · location 12/16 `text-3` |
  | Comp | 128 | Mono 12/16 `text-2` `€130–150k` | "base + equity" `text-3` |
  | Fit | 120 | 4 ticks + `3/4` | — |
  | Posted | 72 | Mono `2d` | — |
  | Applicants | 96 | Mono `41` | — |

- **Reader (x 880–1440):**
  - 24px padding.
  - Title 20/24 600.
  - Company line 13/18 `text-2`.
  - A fact grid in 2 columns: labels 11/16 `text-3`, values mono or 13 `text-1`.
  - Actions: primary **Apply** (accent), Save, ⋯.
  - Target line: "→ as Rhea Kovač · personal".
  - Body: 15/24 `text-2` at a 512 measure, with section labels 11/16 600 `text-3`.

```
[rail][ cap: ‹ › Jobs › Recommended ········ Share ][ › Principal Product Designer…  2/48 ˄ ˅ × ][ global ]
[    ][ strip · query · header                     ][ title 20/24, facts grid, [Apply] Save ⋯      ]
[    ][ rows 44 (824 wide)                        ▒┃ description 15/24 …                          ]
```

**Projects (MATRIX + Peek).**
- **Strip:** `Marketplace 312` (selected), `My briefs 2`, `Proposals 5`, `Contracts 1`.
- **Query line:** [1] `product design` [2] `€15k or more` [3] `4–12 weeks` [4] `remote`, then `— by` `newest`.
- **Tiles:** an edge-to-edge MATRIX lattice (x 56–1040) of 3 columns, 328 × 200, with 16px inner padding.
  - Brief thumbnail: a CSS scope diagram of 3 horizontal bars at 60/85/40% width, `text-4` on `sunken`, 296 × 64, radius 2.
  - Title 13/18 500.
  - Client 12/16 `text-3`.
  - Mono line `€18–24k · 8 wk · 11 proposals`.
  - Skills 12/16 `text-3`, joined with " · ".
- **Peek:** brief summary, client, budget, timeline, scope list, and primary **Write proposal**.

**Applications (INDEX grouped by stage + Peek).**
- **Strip:** `Active 5` (selected), `Drafts 2`, `Archived 31`.
- **Group headers:** 28px, 11/16 600 `text-3` sentence case, with the count in mono. The order is `Interview 2`, `Screen 1`, `Applied 2`.
- **Rows:** 44px.

  | Column | Width | Content |
  |---|---|---|
  | Role / company | 360 | two lines |
  | Stage track | 136 | 5 ticks (Applied → Screen → Interview → Offer → Closed), 8 × 10 each, filled `text-2` up to the current stage. The same component as FitTicks |
  | Next step | 280 | 13/18 `text-2` "Panel interview", plus mono 11 `text-3` `Thu 1 Oct 14:00` |
  | Updated | 80 | mono `1d` |

- **Peek:** application timeline (dated events in a mono 64px gutter), contacts, and next step.

**Hiring (BOARD + Peek).**
- **Channel:** requisitions, 200 wide. It is folded at boot by the yield order: 56 + 200 + 880 + 400 = 1536 > 1440.
- **Address:** `Hiring › Staff Designer, Canvas`. The leaf opens a requisition menu.
- **Strip:** `Pipeline 22` (selected), `Talent pool 38`, `Archived 11`. View switcher: Board / Table.
- **Lanes:** 5 equal lanes running edge to edge across x 56–1040 (196.8 each), divided by 1px `line-1`. Lane headers sit in the column-header band (y 116–144): stage name 11/16 500 `text-3` plus a mono count.
- **Slabs:** 56px tall, 8px lane padding, 1px `line-1` border, radius 2, `surface` fill. Each holds a monogram 24, the name 13/18 500, and a mono 11 `text-3` line `4/5 · 2d in stage`.
- **Selected slab:** `raised` fill and a `line-2` border. The tether notch sits at its vertical center.
- **Peek:** the Person anatomy (§7) plus a **Pipeline** section after Fit: stage, days in stage, next step, and scorecards `2 of 3 submitted`. The primary action is **Advance to Final**.

```
[rail][ cap: ‹ › Hiring › Staff Designer, Canvas ▾ · Share Scorecards ][ › Kwame Asante 1/5 ˄ ˅ × ][ global ]
[    ][ New 7   │ Screen 6  │ Interview 5 │ Final 3   │ Offer 1     ][ identity · actions · Pipeline · Fit … ]
[    ][ [slab]  │ [slab]    │ ▒[slab]▒    │ [slab]    │ [slab]      ┃                                        ]
```

**Saved (channel + INDEX, mixed objects).**
- **Channel (x 56–256):**
  - Cap: "Collections" in 13/18 500 `text-1`, plus a `plus` icon button.
  - Items: 28px tall, 13/18 `text-2`, counts in mono 11 `text-3` right-aligned at x=244.
    - `All saved 64` (selected)
    - `Shortlist · Canvas 9`
    - `Reading 14`
    - `Companies to watch 11`
    - `Jobs 6`
    - `Projects 4`
  - The selected item has `active` fill (x 64–248, radius 4), `text-1` text, and a 2 × 20 `accent` notch on x=256 (x 255–256).
  - Channel foot: `Kbd [` plus "hide" in 11/16 `text-3`.
- **Workspace:** x 256–1440, INDEX, 44px rows. Columns, from x=272:

  | Column | Width | Content |
  |---|---|---|
  | Type | 96 | 11/16 500 `text-3`: Person, Job, Project, Company, Post |
  | Item | 440 | Monogram or company glyph 28, then title 13/18 500 `text-1` over subtitle 12/16 `text-3` |
  | Collection | 200 | 12/16 `text-2` |
  | Saved | 96 | mono 11 `text-3` date |
  | Note | the rest | 12/16 `text-3` |

  The inspector opens on selection and shows the object's own inspector: Person, Job Reader, brief or company.

**Activity (STREAM, log).**
- **Strip:** `All` (selected), `Mentions 3`, `Profile views 27`, `Applications 2`, `Hiring 14`.
- **Day headers:** 28px tall, 11/16 600 `text-3`, for example "Today · Mon 28 Sep".
- **Time gutter:** 64 wide at x 72–136, with times in mono 11 `text-3`.
- **Rows:** 40px, a one-line sentence in 13/18.
  - Unread rows are `text-1` with a 5 × 5 `text-2` square in the gutter at x 128.
  - Read rows are `text-2`.
  - Object names are 500.
- **Selection** opens the source object in Peek, with the tether notch on x=1040.

**Profile (SHEET, no inspector).**
- **Address:** `People › Maren Aaltonen`. The rail notch stays on People.
- **Channel outline** (x 56–256): `Overview`, `Experience`, `Selected work`, `Writing`, `Skills`, `Recommendations`. The scroll-spy notch sits on x=256.
- **Document measure:** x 304–984 (680).
  - Identity band: monogram 64 × 64, name **28/32 600** (the only size above 20 in the product), headline 15/24 `text-2`, meta 12/16 `text-3`.
  - The actions row is the same as in the inspector.
  - Section headings are 15/24 600 `text-1`. Body text is 15/24 `text-2`.
- **Margin readouts** (x 1032–1392): 11/16 labels, mono 13 figures.
  - `Profile views · 30d 214`
  - `Response time ~1 day`
  - `Last active 3h ago`
  - `Fit · Design leads · EMEA` with 5 ticks and `4/5`

```
[rail][ cap: ‹ › People › Maren Aaltonen ·················· Share  Copy link ][ global ]
[    ][ Outline   ┃ [MA] Maren Aaltonen 28/32               │ Profile views 214     ]
[    ][ Overview  ▐ Senior Product Designer — …             │ Response ~1 day       ]
[    ][ Experience│ [Request intro via Jonas] Follow ▯ ⋯    │ Fit ■■■■□ 4/5         ]
```

### 5.5 Channel column (Hiring, Saved, Profile)
- 200 wide. It has its own cap (40), body (`frame` fill) and foot (28). The right-edge hairline is on x=256.
- `[` toggles it with the `panel` spring.
- Its cap holds the channel title, 13/18 500 `text-1` at x=72.
- Items and the selection notch are as specified for Saved.

---

## 6. People workspace

### 6.1 Band layout
- Bands: segment strip (y 40–76), query line (76–116), column header (116–144), rows (144–996).
- Side padding is 16, so content runs x 72–1024.

### 6.2 Segment strip (saved segments), 36px
- **Tabs** start at x=72 with 20px between tabs.
  - Label: 13/18 500. The count follows 6px later in mono 11/16 `text-3`.
  - Colors: unselected `text-3`, hover `text-2`, selected `text-1`.
  - Text baseline at y=63.
  - Tabs, in order:

    | Tab | Count | Selected |
    |---|---|---|
    | All people | `1,284` | |
    | Design leads · EMEA | `22` | yes |
    | Following | `212` | |
    | Warm intros | `17` | |
    | Open to contract | `96` | |

  - After the tabs: a 16 × 16 `plus` icon button in `text-3` (flag "New segment ⌘S").
  - If the tabs overflow, the extra ones collapse into `⋯ n more`.
- **Segment notch:** 2px `accent` covering y 75–76, spanning exactly from the selected label's left edge to its count's right edge.
- **Selected tab's `⋯` menu:** appears on hover, 16 × 16, 4px after the count. Items: Rename, Duplicate, Share with team, Subscribe to changes, Delete.
- **Right side**, right-aligned to x=1024 with 8px gaps:
  - **View switcher:** 3 buttons of 24 × 24 inside one 1px `line-1` outline (radius 4), with 1px `line-1` dividers between them: `view-table` (selected), `view-compact`, `view-gallery`. The selected button has an `active` fill and a `text-1` icon; the others have `text-3` icons. Keys `1` `2` `3`.
  - **Display:** a text button, 24h, padding 0 8, holding a `display` icon, 6px, and "Display" in 12/16 500 `text-2`. Its menu (240 wide) contains:
    - Group by: None (selected), Fit, Availability, Degree
    - Columns: checkboxes for Company, Skills, Availability, Relation
  - **Grouped rows** (when Group by is not None; the boot state is None):
    - Each group starts with a 28px sticky group header, with its label at x=72 in 11/16 600 `text-3` (`5 of 5 clauses`, `Open`, `2°`), then 6px and a mono 11 `text-3` count.
    - Every group header except the first has a 1px `line-1` hairline on its top edge.
    - Row metrics do not change.

### 6.3 Query line (search, clauses, sort), 40px
- **Structure:** a `search` icon (14 × 14, `text-3`) at x=72, centered at y=96. The sentence starts at x=96.
- **The sentence** is a row of **clauses**, 16px apart, in 13/18, baseline at y=100.
  - Each clause shows its **index** (mono 10/12 500 `text-3`, raised 4px above the baseline, 2px before the clause), an optional **lead** (400 `text-3`), and a **value** (500 `text-1`).
  - Clause indices are ordinary digits positioned with CSS. Never use Unicode superscript characters.
- **The People query, exactly:**

| # | Lead | Value | Key |
|---|---|---|---|
| 1 | — | Product designers | role |
| 2 | — | senior or above | seniority |
| 3 | in | EMEA, UTC−1 to +3 | region |
| 4 | with | design systems | skill |
| 5 | available within | 3 months | availability |
| sort | — by | fit | sort (no index, no tick) |

- It is followed, 16px later, by `+ Clause`: a `plus` icon plus "Clause" in 13/18 `text-3`. Key `/`.
- The rendered sentence reads: `⌕  1Product designers  2senior or above  3in EMEA, UTC−1 to +3  4with design systems  5available within 3 months  — by fit  + Clause`. It fits on one line at 1440.
- **Hover** on a clause: a 1px dotted `text-3` underline appears 3px under the value, and the matching tick in every row brightens (§6.6).
- **Click** on a clause opens a clause popover.
  - Placement and style: 8px below the clause, 280 wide, `overlay`, 1px `line-2`, radius 6. No shadow (§8.5).
  - Content: a typeahead input (sunken, 28h); options as 28px rows with checkboxes and mono counts; then `Remove clause ⌫`.
- **Composer:** `+ Clause` or `/` opens the same popover as a composer. Clause types are listed: Role, Seniority, Region, Skill, Availability, Company, Degree, Keyword. Typing filters the list. The last option is always `Keyword: "…"`, which adds a keyword clause (lead "mentioning").
- Backspace in an empty composer removes the last clause. **There is no free-text parsing.**
- **Sort facet:** clicking "fit" opens a menu: Fit, Recently active, Degree, Tenure in matched skill.
- **Dirty state:** once any clause changes, two things appear right-aligned to x=1024: `Revert` (12/16 `text-3`) and `Save segment` (12/16 500 `text-1`) with `Kbd ⌘ S`.
- If the sentence exceeds the line, it wraps. The band grows to 64 with the `panel` spring, and the bands below it move down.
- **Soft clauses:** a person is a result when they meet at least 3 of the 5 clauses. Fit sorting orders by clauses met (descending). Within an equal count, the order is the one given in `people.ts` (§13.4), which stands for "years in matched skill".

### 6.4 Column header, 28px
- Labels in 11/16 500 `text-3`, **sentence case**. Baseline y=134.
- The sorted column's label is `text-2` and is followed by 4px and a mono `↓`.
- Hovering a header shows `line-2` hairlines at the column's left and right edges (resize) and a 16px `more` button at its right edge (Sort, Hide, Move).

### 6.5 Row anatomy (Table view, 44px)

| Column | x (absolute) | w | Line 1 (18px box, row top +5) | Line 2 (16px box, row top +23) |
|---|---|---|---|---|
| **Person** | 72–320 | 248 | Monogram 28 × 28 at x 72, y row+8. Name at x=112 in 13/18 500 `text-1` | Headline at x=112 in 12/16 400 `text-3` (`text-2` when selected). Max 200, ellipsis |
| **Company** | 320–464 | 144 | Company glyph 14 × 14 (§8.7) at x=320, then 6px, then the name in 13/18 400 `text-2`, then 6px and the tenure in mono 11 `text-3` (`3y`). The name truncates first; the tenure never truncates | City in 12/16 `text-3`, then " · ", then the UTC offset in mono 11 `text-3` (`Berlin · UTC+2`) |
| **Fit** | 464–696 | 232 | FitTicks (5 × 8 × 10, 2px gap, 48 wide), then 8px, then the fraction in mono 11 `text-3` (`4/5`). It is `text-2` on 5/5 rows | **Evidence phrase** in 12/16 `text-3`, max 220, ellipsis |
| **Skills** | 696–856 | 160 | Top skill in 13/18: `text-1` if it matches a clause, else `text-2` | Second skill in 12/16 `text-3`, then " " and a mono 11 `text-3` `+n` when more exist |
| **Availability** | 856–952 | 96 | Status glyph 7 × 7 at x 856, centered on line 1, then the label at x=869 in 13/18 `text-2` | Timing at x=869 in mono 11 `text-3` (`Jan 2027`, `now`, `2 d/wk`, `—`) |
| **Relation** | 952–1024 | 72 | Degree in mono 12/18 500 `text-2` (`1°`, `2°`, `3°`), or `Team` in sans 12/18 500 `text-2` | Context in 12/16 `text-3`: `3 mutual`, `Follows you`, `In pipeline`, `Viewed job`, `Your team`, `Replied` |

- Every cell except Relation reserves 12px of right padding before truncating.
- There are **no row dividers and no zebra striping.** Every line-2 value is `text-3` or brighter. `text-4` never appears in a row.
- **Flexible widths** (§5.1 yield):
  - Let `C = workspace width − 32` and `extra = C − 952`.
  - When `extra > 0`: Person gets `248 + min(extra/2, 112)` and Fit gets the rest.
  - When `C < 952`: hide Skills first. If `C < 792`, also hide Relation. If `C < 720`, also hide Company.
  - Person, Fit and Availability never hide.
- **DOM contract:** every row is `<div role="row" data-row-index={i} data-object-id={person.id}>`, where *i* is 0-based. The screenshot script hovers `[data-row-index="3"]`.

### 6.6 How relevance is shown: FitTicks
- There is one tick per numbered clause, in clause order.
- A tick is 8 × 10, radius 0, with a 2px gap.
  - Satisfied: filled `text-2`. On a 5/5 row, every tick is filled `text-1`.
  - Unsatisfied: a 1px `text-4` outline with no fill.
- There is no percentage, score, bar or ring anywhere in the product.
- **Hovering tick *n*:**
  - Clause *n* in the query line gets its dotted underline.
  - A flag above the tick shows the clause and that row's evidence for it, for example `5 available within 3 months · from 11 Jan 2027 — not met`.
- **Hovering clause *n*:** every row's tick *n* stays as it is, and every other tick drops to 40% opacity.

### 6.7 Availability glyphs
Shape carries the meaning. Color reinforces it.

| Status | Glyph (7 × 7) | Color | Row label |
|---|---|---|---|
| open | filled circle | `ok` #7FA37A | Open |
| exploring | circle with its left half filled, 1px ring | `warn` #C9A55A | Exploring |
| not-looking | 1px ring | `text-3` | Not looking |
| freelance | filled square | `ok` | Freelance |

### 6.8 Selection, hover, focus, multi-select
- **Hover:**
  - The row gets `hover` #191817 fill, painted from x 56 to 1039. It stops 1px short, so the separator stays.
  - The **Relation cell is replaced**, cross-faded over 80ms, by three 24 × 24 icon buttons at x 952–976, 976–1000 and 1000–1024: `follow`, `save` and `more`. They have no gaps. Flags: `F`, `S`, `.`.
  - The **monogram is replaced** by a 14 × 14 checkbox centered in its 28 × 28 box.
  - Nothing covers Availability or any other data.
- **Selected (bound to the inspector):**
  - The row gets `raised` #1C1B19 fill from x 56 to 1040, which covers the separator pixel. **The seam is open.**
  - The name stays `text-1` 500, and the headline lifts to `text-2`. Nothing changes weight or size.
  - The **tether notch** is 2 × 20 `accent` at x 1039–1040, vertically centered on the row. For row 3 (Maren) it spans y 288–308. The row itself spans y 276–320.
- **Quiet selection** (inspector closed): the fill stays `raised`, the seam no longer applies because there is no separator, and no notch is drawn. Selection survives sort, filter and section switches.
- **Keyboard focus without selection:** a 1px `line-2` inset outline on the row. With the inspector open, focus *is* selection.
- **Checked:** the checkbox is filled `text-1` with a `frame` check. The row fill is `hover`. Once one row is checked, every row shows its checkbox in place of its monogram.
- **Multi-select, 2 or more checked:**
  - The workspace foot becomes the action strip: `3 selected · Add to pipeline P · Save to list · Message M · Compare · Esc clear`. The labels are 12/16 500 `text-2` text buttons with `Kbd` hints. The count is in mono.
  - The cap's Export becomes `Compare (3)`.
  - The inspector keeps its subject.

### 6.9 Keyboard (People)
| Key | Action |
|---|---|
| `/` | Clause composer |
| `J` / `K` or `↓` / `↑` | Move the selection |
| `↵` | Full profile (Profile section) |
| `Space` | Peek or toggle the inspector (does not commit history) |
| `Esc` | Close the popover, then the inspector, then clear the checks |
| `X` | Check the row |
| `⇧J` / `⇧K` | Extend the check |
| `F` | Follow |
| `S` | Save |
| `M` | Message or intro (the primary action) |
| `P` | Attach to the target requisition |
| `.` | Context menu |
| `1` / `2` / `3` | Table / Compact / Gallery |
| `⌘S` | Save segment |
| `⌥1`–`⌥5` | Jump to a segment |
| `]` | Toggle the inspector |

Right-clicking a row opens the same context menu as `.`. Its items are:

| Item | Key |
|---|---|
| Open full profile | ↵ |
| Open in inspector | Space |
| Request intro via Jonas | M |
| Attach to Staff Designer, Canvas | P |
| Follow | F |
| Save | S |
| Copy link | ⌘C |
| Hide from results | ⌫ |

### 6.10 Other views
- **Compact (32px):** a single line.
  - Person: name only, plus the headline inline in 12/16 `text-3` after 8px.
  - Company: the name only.
  - Fit: ticks and fraction.
  - Skills: the top skill.
  - Availability: glyph and label.
  - Relation: the degree.
  - The monogram shrinks to 20 × 20.
- **Gallery:** an edge-to-edge MATRIX with 3 tiles of 328 × 232 and 16px inner padding.
  - A 296 × 128 schematic work thumbnail on `sunken` (the person's first work item, drawn as in §7.1 Selected work).
  - Monogram 28 + name + headline.
  - FitTicks.
  - Availability.

### 6.11 Loading, empty, zero
- **Loading:**
  - Rows render as **ledger lines**: 1px `line-2` bars at each text baseline, 40–70% of the column width (deterministic, from the row index), with no shimmer.
  - The foot reads "Querying 1,284 profiles…".
  - Rows appear with the list-entrance motion only if the query takes longer than 600ms.
- **No results** (at x=112, y=200):
  - "No one meets 3 of the 5 clauses." in 13/18 500 `text-1`.
  - Below it, relaxation lines in 12/16 `text-2` with mono counts. Each is a clickable text button: `Drop 5 available within 3 months → 61 people`, `Widen 3 to UTC−3 to +4 → 52 people`.
  - There is no illustration.
- **No segment yet:** the strip shows only `All people`, plus "Refine the query and press ⌘S to keep it." in 12/16 `text-3`.

---

## 7. Person inspector

- **Box:** x 1040–1440, 400 wide, `raised` #1C1B19. It has no border, shadow or radius, and it scrolls independently.
- **Padding:** 20, so content runs x 1060–1420 (360 wide).
- **Headings:** every section heading is 11/16 600 `text-3`, sentence case. It is followed by a 1px `line-1` leader rule that runs from 8px after the heading text to 8px before the right-aligned readout. The readout is mono 11/16 `text-3`, right-aligned to x=1420.
- **Section gap:** 20.

### 7.1 Anatomy with exact positions (Maren Aaltonen, body top y=40)

| Block | y | Content |
|---|---|---|
| Identity | 60–140 | See detail below the table. |
| Availability | 152–184 | Glyph `open` 7 × 7 at x 1060 (centered on line 1). Line 1 at x=1074: "Open to roles from " in 12/16 `text-2`, then `11 Jan 2027` in mono 11 `text-2`. Line 2: "Full-time or contract · hybrid Berlin or remote EMEA" in 12/16 `text-3` |
| Actions | 200–232 | See detail below the table. |
| Target line | 240–256 | 12px `arrow-right` in `text-3` at x 1060, then "for " in `text-3`, "Staff Designer, Canvas" in `text-2`, and " · Tandem" in `text-3`, all 12/16. A click opens a menu of Tandem's open requisitions, plus "No requisition (personal)" |
| Fit | 276–416 | See detail below the table. |
| Bio | 436–496 | 13/20 400 `text-2`, clamped to 3 lines, then " More" in `text-3`: "Eleven years designing tools for designers. Leads Plinth's design system and the editor's selection model; before that, payments tooling at Ledgerline." |
| Experience | 516–718 | See detail below the table. |
| Selected work | 738–896 | See detail below the table. |
| Skills | 916–984 (continues below the fold) | See detail below the table. |
| Shared context (below the fold) | 1004– | See detail below the table. |
| Recommendations (below the fold) | | See detail below the table. |
| Recent activity (below the fold) | | See detail below the table. |

**Identity (y 60–140)**
- Monogram 56 × 56 at (1060, 60), radius 4, `--hue-0` #2C2A33 with a 1px `line-2` inner edge, initials `MA` in 20/24 600 `text-1`.
- At x=1128:
  - **Maren Aaltonen**, 20/24 600 `text-1`, −0.01em (y 60–84).
  - Headline, 13/18 `text-2`, 2 lines (y 86–122): "Senior Product Designer — design systems, editor tooling and multiplayer UX".
  - Meta (y 124–140): "Plinth · Berlin, Germany · " in 12/16 `text-3`, then `14:32 UTC+2` in mono 11 `text-3`.

**Actions (y 200–232)**
All buttons are 32 tall with 8px gaps:
- **Primary:** "Request intro via Jonas". `accent` fill, radius 4, padding 0 12, 13/18 500 `accent-ink`. This is the **only orange fill on the screen**. Key `M`. Hovering it shows a flag: "Jonas Petersen (your 1°) worked with Maren at Ledgerline, 2020–22". For a 1° connection the label becomes "Message".
- **Follow:** 1px `line-2` border, radius 4, padding 0 10, `follow` icon plus "Follow" in 13/18 500 `text-1`. Once following, it reads "Following" in `text-2` with the `following` icon.
- **Save:** a 32 × 32 bordered icon button. When saved, it shows the `save-filled` icon in `text-1`.
- **More:** a 32 × 32 bordered `more` button. Items: Add to list…, Attach to requisition…, Copy link ⌘C, Hide from results, Report.

**Fit (y 276–416)**
- Heading "Fit · Design leads · EMEA", readout `4/5` (y 276–292).
- Five lines of 24 (y 296–416). Each line has:
  - a tick 8 × 10 at x 1060, in the same style as the row ticks
  - the clause index in mono 10/12 `text-3` at x 1076
  - the clause text in 12/16 `text-2` at x 1088
  - the evidence, right-aligned to x=1420, in 12/16 `text-1` when met and `text-3` when not

| # | Clause | Evidence | Met |
|---|---|---|---|
| 1 | Product designer | Senior Product Designer | ✓ |
| 2 | Senior or above | 11 yrs · senior since 2023 | ✓ |
| 3 | EMEA, UTC−1 to +3 | Berlin · UTC+2 | ✓ |
| 4 | Design systems | Leads Plinth's system, 3 yrs | ✓ |
| 5 | Available within 3 months | from 11 Jan 2027 · 15 wks | ✗ |

**Experience (y 516–718)**
- Heading "Experience", readout `11y`.
- **Career strip** (y 542–548): 360 × 6. The axis runs from Jan 2015 to Sep 2026. Segments are placed at their real dates with 2px gaps. Past roles are `text-4` and the current role is `text-2`.
- **Axis labels** (y 552–564): mono 10/12 `text-3` at 2015, 2019, 2023 and 2026.
- **Entries** from y 574, 36px each, four entries ending at y 718.
  - The years sit in a hanging 64px label column (x 1060–1124) in mono 11/16 `text-3`.
  - Role: 13/18 500 `text-1` at x 1124.
  - Company: 12/16 `text-2` below the role.
  - Duration: mono 11 `text-3`, right-aligned to 1420 on line 1.
- Entries:

| Years | Role | Company | Duration |
|---|---|---|---|
| 2023– | Senior Product Designer | Plinth · collaborative canvas | 3y 1m |
| 2020–23 | Product Designer, Console | Ledgerline · payments infrastructure | 3y 2m |
| 2017–20 | Interaction Designer | Forma Studio · Helsinki | 2y 11m |
| 2015–17 | UX Designer | Rautatie Digital · Tampere | 1y 10m |

**Selected work (y 738–896)**
- Heading "Selected work", readout `2`.
- Two thumbnails of 170 × 96 at x 1060 and 1250 (20px gap), y 762–858. Each is `sunken` with 1px `line-1` and radius 2, and drawn in SVG:
  - **Plinth Canvas 3 — selection model** (2025): three overlapping 1px rectangles in `text-4`. One is selected: `text-2` stroke with four 4 × 4 square handles. A marquee is drawn in dashed `line-2`.
  - **Ledgerline Console — disputes flow** (2022): five 8 × 8 squares joined by right-angle 1px `text-4` connectors. The 4th square is filled `text-2`.
- Captions:
  - Title in 12/16 500 `text-1`, 1 line with ellipsis (y 864–880).
  - Meta in mono 11/16 `text-3`: `2025 · case study · 8 min` and `2022 · case study · 6 min` (y 880–896).

**Skills (y 916–984, continues below the fold)**
- Heading "Skills", readout `1 of 8 match`.
- Two columns of 176 with an 8px gap, 24px rows starting at y 936.
- A matched skill has a 4 × 4 `text-1` square prefix (6px gap) and `text-1` text. The others are `text-2` with no prefix.
- Each column's right edge carries mono 11 `text-3` years of use.
- Row 1: ▪ Design systems `6y` | Editor / canvas UX `5y`
- Row 2: Prototyping (code) `7y` | Interaction design `11y`
- Row 3: Multiplayer UX `3y` | Design tokens `4y`
- Row 4: Figma plugin API `3y` | Accessibility `6y`

**Shared context (y 1004–, below the fold)**
- Heading "Shared context", readout `4`.
- Lines are 12/20 `text-2`, with names in `text-1` and a 12px glyph in `text-3` at x 1060:
  - `worked-with` **Jonas Petersen** worked with Maren at Ledgerline, 2020–22 · your 1°
  - `people` 3 mutual: **Jonas Petersen**, **Aiko Mori**, **Tomás Rey**
  - `view` Viewed your job **Staff Designer, Canvas** · mono `2d ago`
  - `saved` Saved by 2 people on your team

**Recommendations (below the fold)**
- Heading "Recommendations", readout `2`.
- Two quotes in 13/20 `text-2`, each with its author line in 12/16 `text-3`:
  - "Maren rewrote our selection model in a week and then spent a month proving it with prototypes. Nothing shipped without her spec." — **Jonas Petersen**, Staff Engineer, Ledgerline, 2022
  - "The calmest person in any critique, and the one who has read the code." — **Aiko Mori**, Staff Designer, Quanta Labs, 2024

**Recent activity (below the fold)**
- Heading "Recent activity", readout `2`.
- Two post lines, each with a mono date:
  - "Selection is a product decision, not a UI detail" `14 Sep`
  - "Notes from rebuilding Plinth's token pipeline" `2 Aug`

**Condensed identity bar.** When the inspector body scrolls past y=240 (below the actions), a 40px bar pins to the top of the body. It holds a monogram 24, the name 13/18 500, the availability glyph, and the primary button in compact form (24 tall, 12/16 500). The bar is `raised` with a 1px `line-1` bottom edge.

**Inspector foot** (y 996–1024):
- Left, at x 1060: "Updated 6d ago · 2 of 4 roles verified" in 11/16 `text-3`, with the figures in mono.
- Right, aligned to x 1420: a text button with `Kbd ↵` plus "Full profile" in 11/16 `text-3`.

### 7.2 Resize handle
- The inspector separator has a 6px hit zone (x 1037–1043) and a `col-resize` cursor.
- After 150ms of hover, the whole line changes from `line-1` to `line-2`. A **grip** appears at the pointer's y: three 2 × 2 `text-3` squares spaced 4px apart vertically, centered on the line.
- **Drag:** the width follows the pointer 1:1. The live readout `400 → 452` replaces the position readout in the inspector cap.
- **Release:** the width snaps to the nearest snap point within 6px using the `snap` spring.
- **Double-click:** resets to the class default (Peek 400, Reader 560).
- **Limits:** min 360. Max 640, or less when the workspace would drop below the mode min.
- The width is remembered per section.

### 7.3 Open and close
- **Opens on:** a click on a row, `Space`, or `↵` when the inspector is already open (`↵` then goes to the full profile). It never opens on hover.
- **Closes on:** `×`, `Esc`, `]`, or a click on the already-selected row.
- **On close:**
  - The workspace column grows to x=1440: its body and foot run to the window edge. Its cap stops at x=1328, because the global zone owns cap x 1328–1440, and the cap's right cluster ends at x=1316.
  - The global zone does not move.
  - Quiet selection applies.
  - The object crumb leaves together with the inspector cap.
- **Reopen:** `]` or `Space` restores the same subject and its scroll position.

---

## 8. Tokens

### 8.1 Color (copy verbatim into `src/styles/tokens.css`)

```css
:root {
  color-scheme: dark;

  /* surfaces: frame → work → context */
  --frame:    #121212;  /* rail, every cap, every foot, channel body. The canvas */
  --surface:  #161514;  /* workspace body */
  --hover:    #191817;  /* row hover, icon-button hover, rail hover square */
  --raised:   #1C1B19;  /* inspector body, selected row/tile/slab (the seam) */
  --active:   #221F1C;  /* selected rail square, selected view button, selected channel item, pressed */
  --overlay:  #211F1D;  /* flags, menus, popovers, palette, notification drop */
  --sunken:   #0F0F0E;  /* work thumbnails, key caps, focused inputs, palette input */

  /* lines */
  --line-1:   #282523;  /* lattice + hairlines (default) */
  --line-2:   #3A3632;  /* control borders, hovered separator, focus outline, overlay borders */

  /* text (contrast on --surface: 14.7 / 9.0 / 5.2 / 3.1) */
  --text-1:   #ECE6DC;  /* names, values, selected labels */
  --text-2:   #BDB5AA;  /* secondary: company, body copy, row line 1 values */
  --text-3:   #8F877D;  /* tertiary: row line 2, labels, icons at rest. Minimum for any data */
  --text-4:   #6A645D;  /* placeholders, disabled, unsatisfied tick outlines, crumb chevrons, past career segments. Never data */

  /* accent: exactly four roles, see §8.1 rules */
  --accent:       #E07A3F;
  --accent-hover: #E8874E;
  --accent-press: #C96A33;
  --accent-ink:   #1A120C;  /* text on accent, 6.2:1 */

  /* status: two hues + error */
  --ok:   #7FA37A;  /* open, freelance, synced */
  --warn: #C9A55A;  /* exploring */
  --err:  #C0675C;  /* errors and failed sync only */

  /* monogram hue tiles (initials text-2; text-1 at >=56px) */
  --hue-0: #2C2A33;
  --hue-1: #2A302C;
  --hue-2: #332B27;
  --hue-3: #2B2E33;
  --hue-4: #31292E;
  --hue-5: #2E2F28;
}
```

**Accent rules.** Orange appears in exactly four roles:
1. **Notches:** the rail, the segment, the tether, and the channel selection or scroll-spy notch.
2. **One primary action fill per screen.**
3. **The unread square on the bell.**
4. **The dirty-state square** after the address leaf.

Orange is never used for text, links, icons, hover, focus rings, chart or thumbnail fills, row backgrounds or borders. On the People screen at boot there are exactly **5 orange marks**: the rail notch, the segment notch, the tether notch, the bell square and the primary button.

**Focus-visible:** a 1px `line-2` outline with a 1px offset on controls. Rows use a 1px `line-2` inset outline. Focus is never orange.

### 8.2 Type families
- **Instrument Sans Variable**. Package: `@fontsource-variable/instrument-sans` (v5.3.0), imported as `@fontsource-variable/instrument-sans/wght.css` (wght axis 400–700; latin and latin-ext subsets). CSS family: `'Instrument Sans Variable'`. Weights used: **400, 500, 600**. This is every piece of UI text.
- **IBM Plex Mono**. Package: `@fontsource/ibm-plex-mono` (v5.3.0), imported as `@fontsource/ibm-plex-mono/400.css` and `@fontsource/ibm-plex-mono/500.css`. CSS family: `'IBM Plex Mono'`. Weights used: **400, 500**. It is used for figures only (D7).
- Stacks:
  - `--font-sans: 'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif`
  - `--font-mono: 'IBM Plex Mono', ui-monospace, Menlo, monospace`
- **Glyph coverage rule:** neither font's latin subset contains `→ ← ↗ ↵ ⌘ ⌥ ⇧ ⌫ ✓ ✕` or the superscripts `⁴ ⁵`. These glyphs are **never typed as text**. They render as SVG glyphs (§8.6 `kbd-*`, `arrow-*`). Characters that are safe to type: `↑ ↓ − (U+2212) · … › ° × — •`, plus Latin-1 and Latin Extended-A letters (`č ł ş ı ó é í ð`).
- **Numerals:** `font-variant-numeric: tabular-nums` on every sans run that contains figures (readouts, counts in sentences). Mono is tabular by default.
- There is no third family. There is no serif anywhere.

### 8.3 Type scale (every size used)

| Token | Size / line height | Family, weight | Tracking | Roles |
|---|---|---|---|---|
| `--t-10m` | 10 / 12 | mono 500 | 0 | rail counts, key caps, clause indices, axis labels |
| `--t-11m` | 11 / 16 | mono 400 | 0 | figures: tenure, UTC offsets, local times, dates, fit fraction, position, width readout, years in skills |
| `--t-11` | 11 / 16 | sans 400 / 500 / 600 | 0 | foot readouts and key-hint labels (400), column headers and lane headers (500), section labels and group headers (600) |
| `--t-12` | 12 / 16 | sans 400 / 500 | 0 | row line 2, meta, availability and target lines, text buttons (500), flags (500) |
| `--t-12m` | 12 / 18 | mono 500 | 0 | the degree in rows (`2°`) |
| `--t-13` | 13 / 18 | sans 400 / 500 / 600 | 0 | base UI: row line 1, names (500), tabs (500), address line (500), clauses (value 500), inspector roles (500), primary and secondary buttons (500) |
| `--t-13r` | 13 / 20 | sans 400 | 0 | inspector bio, recommendations |
| `--t-14r` | 14 / 22 | sans 400 | 0 | stream post body (Home) |
| `--t-15r` | 15 / 24 | sans 400 / 600 | 0 | Reader and Profile long-form (400), Profile section headings (600) |
| `--t-20` | 20 / 24 | sans 600 | −0.01em | inspector name, Reader title, 56px monogram initials |
| `--t-28` | 28 / 32 | sans 600 | −0.015em | Profile name (SHEET only) |

At boot on the People screen, the largest type is 20px (the inspector name).

### 8.4 Spacing
- A 4px base. Scale: **2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64**. Tokens are `--s-2` through `--s-64`.
- Standard gutters: workspace side padding 16, inspector padding 20 (Reader 24), section gap 20 (inspector), rail group gap 12, gap between segment tabs 20, gap between clauses 16.
- Structural constants live in `src/lib/geometry.ts` (§12): `RAIL_W 56`, `CAP_H 40`, `FOOT_H 28`, `STRIP_H 36`, `QUERY_H 40`, `COLHEAD_H 28`, `ROW_H 44`, `ROW_H_COMPACT 32`, `CHANNEL_W 200`, `PEEK_W 400`, `READER_W 560`, `INSPECTOR_MIN 360`, `INSPECTOR_MAX 640`, `SNAP_POINTS [360, 400, 480, 560, 640]`, `GLOBAL_ZONE_W 112`, `MODE_MIN { index: 640, stream: 640, matrix: 656, board: 880, sheet: 720 }`.

### 8.5 Radii, elevation
- **0:** panels, rows, tiles, lanes, the inspector, caps, feet.
- **2:** key caps, checkboxes, work thumbnails, board slabs, the company glyph, the org badge.
- **4:** buttons, inputs, monograms, the rail square, the view-switcher outline, channel items, the ⌘K trigger.
- **6:** menus, popovers, the palette (bottom corners only), the notification drop (bottom-left only), flags on their open side.
- Nothing is round except status dots and the sync dot.
- **Elevation:** there are **no shadows anywhere** (§11.2). Overlays separate from what lies beneath them by the `overlay` fill plus a 1px `line-2` border. There is no scrim, no blur and no gradient.

### 8.6 Icons
All icons are hand-drawn inline SVG with `viewBox="0 0 16 16"`, `fill="none"`, `stroke="currentColor"`, `stroke-linecap="square"`, `stroke-linejoin="miter"` and `vector-effect="non-scaling-stroke"`.
- Stroke is 1.5px at 16px and 1.25px at 12px.
- Shapes are orthogonal. 45° diagonals are allowed only in chevrons, arrows, `close`, `settings`, `check`, `message` and `kbd-*`. There are no arcs, except in `kbd-cmd`.
- "(fill)" marks a filled rect with `stroke="none"`.
- Color is `text-3` at rest and `text-1` on hover or when selected. **Never `accent`.**

| Name | Path data (16 grid) | Used in |
|---|---|---|
| `mark` | `M12.25 2.75H3.75V7.25 M3.75 13.25H12.25V8.75` | rail cap |
| `home` | `M2.75 3.75H13.25 M2.75 8H9.25 M2.75 12.25H13.25` | rail |
| `people` | `rect 2.75 5.75 7.5 7.5` + `M5.75 2.75H13.25V10.25` | rail, shared context |
| `companies` | 2 × 2 (fill) at (2,2) (7,2) (12,2) (2,7) (12,7) (2,12) (7,12) (12,12), and 4 × 4 (fill) at (6,6) | rail |
| `jobs` | `rect 2.75 5.75 10.5 7.5` + `M6 5.75V3.25H10V5.75` | rail |
| `projects` | `M5.25 2.75H2.75V13.25H5.25 M10.75 2.75H13.25V13.25H10.75` + 2 × 2 (fill) at (7,7) | rail |
| `applications` | `M2.75 13.25H13.25 M4.75 10.25V13.25 M8 7.25V13.25 M11.25 4.25V13.25` | rail |
| `hiring` | `M2.75 3.75H13.25 M4.75 8H11.25 M6.75 12.25H9.25` | rail |
| `saved` | `M3.75 2.75H12.25V13.25H9.5V10.75H6.5V13.25H3.75Z` | rail, row hover, inspector |
| `save-filled` | the same path with `fill="currentColor"` | saved state |
| `activity` | `M1.75 8.75H5V4.75H8.5V11.25H11V8.75H14.25` | rail |
| `settings` | `M5.5 2.75H10.5L13.25 5.5V10.5L10.5 13.25H5.5L2.75 10.5V5.5Z` + 2 × 2 (fill) at (7,7) | rail |
| `chevron-left` | `M9.75 4.25L6 8L9.75 11.75` | history |
| `chevron-right` | `M6.25 4.25L10 8L6.25 11.75` | history, crumbs, crumb joint (12px) |
| `chevron-up` | `M4.25 9.75L8 6L11.75 9.75` | inspector prev |
| `chevron-down` | `M4.25 6.25L8 10L11.75 6.25` | inspector next, menus |
| `arrow-right` | `M2.75 8H12.25 M8.75 4.5L12.25 8L8.75 11.5` | target line (12px), relaxations |
| `arrow-up-right` | `M5.75 2.75H13.25V10.25 M12.75 3.25L3.25 12.75` | open in new context |
| `close` | `M3.75 3.75L12.25 12.25 M12.25 3.75L3.75 12.25` | inspector close, clause remove |
| `search` | `rect 2.75 2.75 8 8` + `M10.75 10.75L13.25 13.25` | query line, ⌘K trigger |
| `bell` | `M4.25 11.25V4.75H11.75V11.25 M2.75 11.25H13.25 M6.75 13.75H9.25 M8 2.25V4.75` | global zone |
| `panel-right` | `rect 2.75 2.75 10.5 10.5` + `M9.75 2.75V13.25`. When open, rect 9.75 2.75 3.5 10.5 is filled | inspector toggle |
| `view-table` | `rect 2.75 2.75 10.5 10.5` + `M2.75 6.25H13.25 M2.75 9.75H13.25` | view switcher |
| `view-compact` | `M2.75 3.25H13.25 M2.75 6.25H13.25 M2.75 9.25H13.25 M2.75 12.25H13.25` | view switcher |
| `view-gallery` | rects `2.75 2.75 4 4`, `9.25 2.75 4 4`, `2.75 9.25 4 4`, `9.25 9.25 4 4` | view switcher |
| `view-board` | `M2.75 2.75V13.25 M8 2.75V10.25 M13.25 2.75V7.25` | Hiring view switcher |
| `display` | `M2.75 5H13.25 M2.75 11H13.25` + (fill) `4.75 3.25 2.5 3.5` and `8.75 9.25 2.5 3.5` | Display button |
| `plus` | `M8 3.25V12.75 M3.25 8H12.75` | new segment, + Clause, channel |
| `more` | 2 × 2 (fill) at (3,7) (7,7) (11,7) | ⋯ everywhere |
| `follow` | `rect 2.75 4.75 6.5 6.5` + `M12 5.25V10.25 M9.5 7.75H14.5` | row hover, inspector |
| `following` | `rect 2.75 4.75 6.5 6.5` + `M9.5 8L11.25 9.75L14.25 6.75` | followed state |
| `message` | `M2.75 3.25H13.25V10.75H7.25L4.75 13.25V10.75H2.75Z` | menus, action strip |
| `check` | `M3.5 8.5L6.25 11.25L12.5 5` | checkbox (drawn in `frame`) |
| `share` | `M8 2.75V10.25 M5 5.75L8 2.75L11 5.75 M3.75 8.75V13.25H12.25V8.75` | cap |
| `export` | `M8 2.75V10.25 M5 7.25L8 10.25L11 7.25 M2.75 10.75V13.25H13.25V10.75` | cap |
| `worked-with` | `M2.75 5.75H12.75 M10 3L12.75 5.75L10 8.5 M13.25 10.25H3.25 M6 7.5L3.25 10.25L6 13` | shared context |
| `view` | `rect 2.75 4.75 10.5 6.5` + 2 × 2 (fill) at (7,7) | shared context ("viewed") |
| `calendar` | `rect 2.75 3.75 10.5 9.5` + `M2.75 6.75H13.25 M5.75 2.25V5.25 M10.25 2.25V5.25` | next steps |
| `clock` | `rect 2.75 2.75 10.5 10.5` + `M8 5V8.25H10.75` | days in stage |
| `link` | rects `2.75 5.75 6.5 4.5` and `6.75 5.75 6.5 4.5` | copy link |
| `reply` | `M2.75 7.75H13.25V12.25 M6 4.5L2.75 7.75L6 11` | feed |
| `repost` | `M3.75 7.25V3.75H12.25 M10 1.5L12.25 3.75L10 6 M12.25 8.75V12.25H3.75 M6 10L3.75 12.25L6 14.5` | feed |
| `keyboard` | `rect 1.75 4.25 12.5 7.5` + `M4.75 9.25H11.25` | account menu |
| `kbd-cmd` (10 grid) | `M3.5 3.5h3v3h-3z M3.5 3.5H2a1.5 1.5 0 1 1 1.5-1.5v1.5 M6.5 3.5V2a1.5 1.5 0 1 1 1.5 1.5H6.5 M6.5 6.5H8a1.5 1.5 0 1 1-1.5 1.5V6.5 M3.5 6.5V8a1.5 1.5 0 1 1-1.5-1.5h1.5` | key caps |
| `kbd-opt` (10) | `M1 2.5h3l3 5h2 M6 2.5h3` | key caps |
| `kbd-shift` (10) | `M5 1.5L1.5 5h2v3.5h3V5h2Z` | key caps |
| `kbd-return` (10) | `M8.5 1.5v4h-7 M3.5 3.5l-2 2 2 2` | key caps |
| `kbd-backspace` (10) | `M3.5 2h5v6h-5L1 5Z` | key caps |
| `kbd-up` / `kbd-down` / `kbd-left` / `kbd-right` (10) | `M5 8.5V1.5 M2 4.5l3-3 3 3`, rotated 180 / 270 / 90 | key caps |

Key caps (`Kbd`): 16 tall, min 16 wide, padding 0 4, `sunken` fill, 1px `line-2` border, radius 2, content `text-3`. Letters and `esc` are mono 10/12 500. Symbols are the 10-grid glyphs above, rendered at 10px with a 1.2px stroke.

### 8.7 Component metrics

| Component | Spec |
|---|---|
| Monogram | Square. Sizes 20 / 24 / 28 / 56 / 64. Radius 4. Fill `--hue-n`, plus a 1px `line-2` inset edge at 56 and above. Initials in sans 600: 9 (20), 10 (24), 11 (28), 20 (56), 22 (64). Color `text-2` below 56, `text-1` at 56 and above |
| Company glyph | 14 × 14, radius 2, 1px `line-2` border, no fill, initial 9/10 600 `text-3`. At 32: fill `--hue-n`, radius 4, initial 13 600 `text-2` |
| Checkbox | 14 × 14, radius 2, 1px `line-2`. Checked: `text-1` fill with a `check` in `frame` |
| Primary button | 32h, padding 0 12, radius 4, `accent` fill (hover `accent-hover`, press `accent-press`), 13/18 500 `accent-ink`. Compact variant: 24h, 12/16 500 |
| Secondary button | 32h (inspector) or 24h (toolbar), 1px `line-2`, radius 4, transparent, 13/18 500 `text-1` (24h: 12/16 500 `text-2`). Hover fill `hover` |
| Text button | 24h, padding 0 8, radius 4, 12/16 500 `text-2`. Hover fill `hover` and text `text-1` |
| Icon button | 24 × 24 (ghost) or 32 × 32 (bordered, 1px `line-2`), radius 4, 16px icon `text-3`. Hover `hover` fill and `text-1` icon |
| Segmented control | One 1px `line-1` outline, radius 4. 24 × 24 cells with 1px `line-1` dividers. Selected cell: `active` fill, `text-1` icon |
| Flag (tooltip) | Delay 400ms (0ms while another flag is visible). 24h, padding 0 8, `overlay`, 1px `line-2`, radius 6 (rail flags: 0 4 4 0). Label 12/16 500 `text-1`, then 8px, then `Kbd`s. Placed 6px from its anchor |
| Menu / popover | `overlay`, 1px `line-2`, radius 6, padding 4. Items 28h, padding 0 8, radius 4, 13/18 `text-1`, right-aligned `Kbd` or mono 11 `text-3`. Highlight: `active` fill. Separator: 1px `line-1`, 4px margin. Group label: 11/16 600 `text-3`, 24h |
| Status glyph | 7 × 7 (rows and inspector). Shapes as in §6.7 |
| FitTicks | 8 × 10 per tick, 2px gap. Filled `text-2` (`text-1` on a full match). Unmet: 1px `text-4` outline |
| Notch | 2 × 20 (vertical separators) or 2 × label width (horizontal). `accent` |
| Section heading | 11/16 600 `text-3`, then a 1px `line-1` leader rule, then a mono 11/16 `text-3` readout at the right edge |

### 8.8 Remaining tokens (append to `src/styles/tokens.css`)

```css
:root {
  --font-sans: 'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, Menlo, monospace;

  /* type shorthands (§8.3). Set the weight after the shorthand when it differs */
  --t-10m: 500 10px/12px var(--font-mono);
  --t-11m: 400 11px/16px var(--font-mono);
  --t-11:  400 11px/16px var(--font-sans);
  --t-12:  400 12px/16px var(--font-sans);
  --t-12m: 500 12px/18px var(--font-mono);
  --t-13:  400 13px/18px var(--font-sans);
  --t-13r: 400 13px/20px var(--font-sans);
  --t-14r: 400 14px/22px var(--font-sans);
  --t-15r: 400 15px/24px var(--font-sans);
  --t-20:  600 20px/24px var(--font-sans);   /* letter-spacing: -0.01em */
  --t-28:  600 28px/32px var(--font-sans);   /* letter-spacing: -0.015em */

  /* spacing */
  --s-2: 2px; --s-4: 4px; --s-6: 6px; --s-8: 8px; --s-12: 12px; --s-16: 16px;
  --s-20: 20px; --s-24: 24px; --s-32: 32px; --s-40: 40px; --s-48: 48px; --s-64: 64px;

  /* radii */
  --r-2: 2px; --r-4: 4px; --r-6: 6px;

  /* layers */
  --z-rows: 1;        /* row fills (selected fill covers the separator pixel) */
  --z-cap: 10;        /* caps, crumb joint */
  --z-global: 20;     /* global zone */
  --z-notch: 30;      /* tether notch overlay */
  --z-flag: 40;       /* flags */
  --z-menu: 50;       /* menus, popovers, notification drop */
  --z-palette: 60;    /* command palette */
  --z-sheet: 70;      /* keyboard sheet */
}
```

---

## 9. Motion grammar (motion/react 13)

Import everything from `motion/react`. Wrap the app in `<MotionConfig reducedMotion="user">`.

**Restraint rules:**
- Nothing bounces. Every spring has a damping ratio of 1 or more.
- Nothing scales more than 2%.
- No duration exceeds 240ms.
- Content never travels more than 8px.
- The lattice never animates: lines do not fade or draw. Only notches, panel widths and content move.
- One moving group per interaction.
- **The first paint never animates.** All `motion` elements mount with `initial={false}` at boot, so the `?section`, `?palette=1` and `?inspector=0` states render already settled.
- Under reduced motion, transforms and layout animations become instant, and opacity fades are capped at 80ms.

```ts
// src/lib/motion.ts
export const snap  = { type: 'spring', stiffness: 700, damping: 56, mass: 0.6 } as const // notches, highlights (ζ≈1.37, ~150ms)
export const panel = { type: 'spring', stiffness: 420, damping: 44, mass: 1 } as const   // widths, band heights (ζ≈1.07, ~240ms)
export const easeOut = [0.16, 1, 0.3, 1] as const
export const easeIn  = [0.5, 0, 0.75, 0] as const
export const fadeIn  = (ms: number, delay = 0) => ({ duration: ms / 1000, delay: delay / 1000, ease: easeOut })
export const fadeOut = (ms: number) => ({ duration: ms / 1000, ease: easeIn })
```

| Interaction | Spec |
|---|---|
| **Inspector open** | The inspector's outer `motion.aside` animates `width` 0 → class width with `panel`. The inner content has a fixed width equal to the target width, so it never reflows mid-animation. It fades `opacity 0 → 1, x 8 → 0` with `fadeIn(180, 60)`. The workspace is `flex: 1`, and its columns reflow under the §6.5 flex rule. When the width completes, the tether notch appears with `scaleY 0 → 1` from its center over `fadeIn(120)`, and the seam opens at the same moment (the selected row's fill extends onto x=1039). The inspector cap content fades in with `y 3 → 0` over `fadeIn(140)` |
| **Inspector close** | The notch goes `scaleY → 0` and the seam closes over `fadeOut(60)`. Content fades out over `fadeOut(90)`. Then the width goes to 0 with `panel`. The object crumb leaves with its cap |
| **Selection change** (click, J/K) | The selected-row fill is one `motion.div layoutId="selection-{section}"` with the `snap` transition. The tether notch animates its `y` with `snap`. The inspector content swaps by **opacity only**: out `fadeOut(70)`, in `fadeIn(120)`, under `AnimatePresence mode="wait"` keyed by object id. Nothing slides, so side-by-side comparison stays still. Past 8 changes per second (J auto-repeat), crossfades are skipped and the content updates instantly |
| **Row hover** | CSS only: the background changes instantly on enter and fades over 120ms linear on leave. The hover-action cell (Relation replacement) and the checkbox appear with `opacity 0 → 1` over 80ms, with no movement |
| **Rail selection** | The rail notch is `layoutId="rail-notch"` with `snap` and slides along x=56. The selected square crossfades over 100ms. The flag enters with `opacity 0 → 1, x −4 → 0` over `fadeIn(100)` |
| **Segment change** | The segment notch is `layoutId="segment-notch"` with `snap` and slides along y=76. Rows use the list entrance |
| **Channel change** | The channel notch is `layoutId="channel-notch"` with `snap` and slides along x=256 |
| **Section switch** | The workspace body fades out over `fadeOut(80)`, then the new one fades in with `opacity 0 → 1, y 6 → 0` over `fadeIn(160)`. The channel, inspector widths and the cap zones animate with `panel` at the same time. The address leaf swaps like an odometer: the old one `y 0 → −8, opacity → 0`, the new one `y 8 → 0` over `fadeIn(140)`. The rail and caps do not move |
| **Command palette** | Opens with `opacity 0 → 1, y −4 → 0, scaleY 0.98 → 1` (transform-origin top) over `fadeIn(140)`. Closes over `fadeOut(90)`. The highlight is `layoutId="palette-hl"` with `snap` |
| **Notification drop / menus / popovers** | Open with `opacity 0 → 1, y −2 → 0` over `fadeIn(120)`. Close over `fadeOut(80)` |
| **List entrance** (segment or query change only) | Rows animate `opacity 0 → 1, y 4 → 0` over `fadeIn(120)`, staggered 12ms across the first 12 visible rows. The rest appear at once. A sort-only change moves rows with `layout="position"` and `panel`, only when 30 or fewer rows move |
| **Clause add/remove** | Clauses use `layout` with `snap`. A wrap to 2 lines animates the band height 40 → 64 with `panel` |
| **Resize drag** | The width follows the pointer 1:1, with no animation. On release it animates to the snapped width with `snap` |
| **Condensed identity bar** | `opacity 0 → 1, y −4 → 0` over `fadeIn(120)` when the body scrolls past 240 |

---

## 10. Mature details and where they live

| Detail | Exact location |
|---|---|
| Rail label flags with chords | Flush at x=57 beside the hovered rail item |
| G-chord key hints | A `Kbd` at the lower left of every rail item while `G` is held |
| Address line as command trigger | Workspace cap, from x=144. It gets an outline on hover |
| Visible `⌘K` trigger | Global zone, x 1340–1404 |
| Crumb joint | A 12px chevron masking the separator at (1040, 20) |
| Back/forward with selection history | Workspace cap, x 68–120. A long-press opens the history menu (§10.3) |
| Dirty segment | A 5 × 5 accent square plus "edited" after the address leaf. `Revert` and `Save segment ⌘S` at the right end of the query line |
| Saved segments with counts | Segment strip, x 72+. The selected tab has a `⋯` menu. "Subscribe to changes" adds a mono `+3` in `text-2` after the count |
| View switcher | Segment strip, right: Table / Compact / Gallery, keys `1` `2` `3` |
| Display menu (group, columns) | Segment strip, right, after the switcher |
| Numbered clauses ↔ ticks ↔ Fit block | Query line (y 76–116) ↔ Fit column (x 464–696) ↔ inspector Fit (y 276–416). Hovering any one highlights the other two |
| Evidence phrase | Line 2 of the Fit column |
| Hover actions replace Relation | x 952–1024 on the hovered row |
| Monogram becomes checkbox | x 72–100 on the hovered row, and on every row once any row is checked |
| Seam and tether notch | The separator at x=1040, across the selected row. The notch is 2 × 20, centered |
| Off-screen selection stub | 2 × 8 on x=1040 at y 144 or 988 |
| Quiet selection | The row keeps its `raised` fill while the inspector is closed |
| Persistent selection in the URL | `?section=people&p=maren-aaltonen`, written with `history.replaceState` |
| Resize indication | The separator turns `line-2`, a 3-square grip appears at the pointer's y, the readout `400 → 452` shows in the inspector cap, and widths snap at 360 / 400 / 480 / 560 / 640 |
| Column resize | Header hover reveals `line-2` edge hairlines. Widths are remembered per segment |
| Scroll-state line | The hairline above any scrolled container turns `line-2` |
| Result readout | Workspace foot, left, from x=72: `22 results · 3 match all 5 · 1 selected · by fit, then years in skill · updated 2m ago`, in 11/16 `text-3`, figures tabular |
| Key-hint strip | Workspace foot, right-aligned to x=1024: `J` `K` move · `↵` open · `X` select · `F` follow · `S` save. `Kbd` plus 11/16 `text-3`, 4px from key to label, 12px between pairs. With rows checked it becomes the action strip (§6.8) |
| Target line | Inspector, y 240–256 |
| Acting-as org badge | Account monogram, bottom right, x 34–46 / y 976–988 |
| Provenance | Inspector foot, left |
| Sync status | Rail foot dot at (28, 1010) |
| Unread | A 5 × 5 accent square on the bell only |
| Condensed identity bar | Top of the inspector body after scrolling past 240 |
| Space peek | `Space` toggles the inspector without writing history |
| Empty-state relaxations | Rows area at (112, 200), each with a mono count |
| Ledger-line skeletons | Rows area while loading |
| Keyboard sheet | `?` opens a SHEET-style overlay covering the workspace: channel = key groups, document = a two-column key table |

### 10.1 Command palette
- **Trigger:** a click on the address line, a click on the `⌘K` trigger, `⌘K`, or boot `?palette=1`.
- **Input:** the address line is replaced in place by an input box at x 136–704, y 6–34 (568 × 28): `sunken` fill, 1px `line-2`, radius 4, 13/18 400 `text-1`, placeholder "Search or run a command…" in `text-4`, with a leading 12px `search` icon at x+8. The caret is visible.
- **List:** it hangs from the cap line at x 136–704, from y=40, with a maximum height of 440. Style: `overlay`, 1px `line-2` border on the left, right and bottom, radius 0 0 6 6.
  - Group labels: 24h, 11/16 600 `text-3`, padding 0 12.
  - Rows: 32h, padding 0 12. Each row has a 16px icon in `text-3`, the label in 13/18 `text-1`, an optional secondary label in 12/16 `text-3` after 8px, and a type label in 11/16 `text-3` right-aligned before the `Kbd`s.
  - Highlight: `active` fill.
  - Footer: 28h, 1px `line-1` top edge, holding `↑` `↓` navigate · `↵` run · `⌘` `↵` open in inspector · `esc` close, in 11/16 `text-3`.
- **Default content (empty query, highlight on row 1):**

| Group | Label | Secondary | Type | Keys |
|---|---|---|---|---|
| Suggested | Request intro to Maren Aaltonen | via Jonas Petersen | Action | `M` |
| | Attach Maren Aaltonen to Staff Designer, Canvas | Tandem | Action | `P` |
| | Save segment Design leads · EMEA | | Action | `⌘` `S` |
| Jump to | Home | | Section | `G` `H` |
| | Jobs | | Section | `G` `J` |
| | Hiring · Staff Designer, Canvas | 22 in pipeline | Section | `G` `I` |
| | Activity | | Section | `G` `N` |
| Recent people | Maren Aaltonen | Plinth · Berlin | Person | |
| | Tove Lindqvist | Northdesk · Stockholm | Person | |
| | Kwame Asante | Halden · Amsterdam | Person | |

- **Typing** filters every source with a case-insensitive substring match on the label: actions, sections, the 22 people, segments, jobs and companies. Results are grouped under Actions, Sections, People, Segments, Jobs and Companies, and each group shows at most 5 rows.
- `⌘↵` on a person opens them in the inspector without leaving the current section. `Esc` closes the palette and restores the address line.

### 10.2 Notification drop
- **Placement:** it hangs from y=40, right-aligned to x=1440, 360 wide, with a maximum height of 480.
- **Style:** `overlay`, 1px `line-2` border on the left and bottom, radius 0 0 0 6.
- **Header:** 32h. "Notifications" in 12/16 500 `text-1` at the left, "Mark all read" as a text button at the right.
- **Items:** 48h each. A 20 monogram or company glyph, a sentence in 12/16 `text-2` with names in `text-1`, and a time in mono 11 `text-3` right-aligned. Unread items have a 5 × 5 `text-2` square at x+6.
- **Footer:** 28h, "Open Activity" plus `G` `N`.
- **Choosing an item** closes the drop, switches to the object's section, and opens the object in that section's inspector. The drop never replaces the current inspector subject while it is open.
- **Content:** the 6 unread Activity items of §13.12.

### 10.3 History
- **Entry:** `{ section, segmentId, subjectId, inspectorOpen }`.
- **Pushed on:** a section switch, a segment change, inspector open or close, a selection change, and opening the full profile.
- A selection change within **800ms** of the previous one, in the same section, **replaces** the top entry (merging J/K runs).
- `Space` peeks are not recorded.
- Back and Forward restore all four fields.
- The stack is capped at 50 entries.

### 10.4 Global keyboard map
| Key | Action |
|---|---|
| `⌘K` | Palette |
| `⌘[` / `⌘]` | Back / Forward |
| `G` then a letter | Go to a section (§3) |
| `[` | Toggle the channel |
| `]` | Toggle the inspector |
| `?` | Keyboard sheet |
| `Esc` | Close the innermost overlay, then the inspector |

Keys are ignored while an input has focus, except `Esc` and `⌘K`.

---

## 11. Anti-generic audit

### 11.1 Risks

| Risk | Where it could slip | How this spec prevents it |
|---|---|---|
| **LinkedIn redesign** | Round photos, "Connect", endorsements, banner headers, a card feed | Square muted monograms and no photos. The primary action is contextual ("Request intro via Jonas", with a target line) and is the only orange. Skills show years of use, not endorsements. There are no banners. The feed is a 560 measure with a margin column, not cards. The relation is a mono degree plus a short context |
| **shadcn demo / admin template** | Chip filters, pill badges, 240px text sidebar, boxed tabs, zinc palette, 8px radius everywhere, a checkbox column that is always on, zebra rows | A query sentence with numbered clauses, and no chips. Counts are plain mono. A 56px rail. Tabs are text plus a notch on a hairline. A warm palette. Panels have 0 radius and the maximum radius is 6. The checkbox appears only on intent. There are no dividers and no zebra striping |
| **AI-startup / AI dashboard** | Serif + mono on warm dark, "92% match" bars, sparkles, gradients, glows, KPI tiles | One grotesk plus a mono used only for figures. No serif. Relevance is ticks tied one-to-one to the user's clauses, plus evidence. No percentages, no gradients or glows, no KPI row. Orange has four roles |
| **Linear / Arc silhouette** | An inset rounded sheet, a scope sidebar, folder tabs with fillets | There is no inset sheet: every body is flush with the lattice. People has no scope column. Selection is a 2px notch on a separator, not a tab shape |
| **Generic SaaS shell** | Full-width topbar with a centered search, the account at top right | There is no topbar: caps belong to their columns. The only command affordances are the address line and a 64px trigger. The account lives at the bottom of the rail. The crumb joint sits on the separator |
| **Dribbble dashboard** | Hero type, illustrations, a floating glass inspector | The largest working type is 20px. Thumbnails are schematic SVG in sunken wells. The inspector is a flush column with no shadow or blur |
| **Logo-swap test** | Anything that relies on the mark or the color | What remains without the name: the lattice (cap/body/foot per column, full-length hairlines); notches that slide on separators; the seam where the chosen row meets its inspector; crumbs that cross the lattice at the panel they name; the numbered query sentence mirrored as ticks and a per-clause Fit block; the fixed yield order |

### 11.2 Compliance with every judge "mustAvoid"

| mustAvoid (source) | Resolution in this spec |
|---|---|
| C's always-on 208px scope column in People (J1, J2, J3) | People has no channel (D3). The workspace stays 984 |
| A's bordered filter tokens / chip rows (J1, J2, J3) | The numbered clause sentence (§6.3). No chip of any radius exists |
| B's serif proper nouns and three typefaces (J1, J2, J3) | Two families: Instrument Sans and IBM Plex Mono (§8.2) |
| B's 10px sheet corner, concave-fillet rail tab, radius-6 row selection (J1, J2, J3) | Panels and rows have radius 0. Selection is a notch plus a flat fill |
| B's 272px boxed search in the header (J1) | A 64 × 24 `⌘K` trigger only (§4.3) |
| A's registration marks (J1, J2, J3) | Removed (D6) |
| A's `001` index column and overuse of mono uppercase (J1, J3) | The index is removed (D5). Headers and labels are sentence-case sans (D7) |
| A's hover-only `⌘K` (J1) | The trigger's keycap is always visible (§4.3) |
| A's tether stub parked at x=1439 (J1, J3) | Quiet selection with no parked mark (D11) |
| C's circle avatars with saturated monogram colors (J1, J2, J3) | Square monograms on muted tiles, with `text-2` initials (D15) |
| C's boxed count badge (J1, J2, J3) | Mono counts, and a 5 × 5 square for unread |
| More than two status hues, blue/violet/steel, orange in thumbnails, orange focus rings (J1, J2, J3) | `ok` and `warn` only, with shape encoding. The focus ring is `line-2`. Thumbnails are grayscale (§8.1) |
| Match percentages, progress bars, KPI rows, panel shadows, gradients, glows (J1) | None anywhere (§6.6, §8.5) |
| Canvas darker than #121212, or an oversaturated orange (J1) | Frame #121212. Accent #E07A3F |
| Bell inside the inspector cap (J2) | The global zone belongs to no panel (D8) |
| BOARD that scrolls horizontally (J2) | Lanes are equal-width and fit. The yield order folds the channel and compresses lanes (§5.1) |
| SPLIT for Jobs (J2) | Reader 560 in the inspector slot (D1) |
| text-4 used for row metadata (J2, J3) | Row data is `text-3` or brighter. `text-4` is never used for data (§6.5, §8.1) |
| B's Tab fusion promised as a universal invariant (J2) | The notch is always drawn. The seam appears only when the object touches the separator. Stated as one rule in §5.2 |
| B's 268px dossier column, 128 × 84 plates, and reading JDs in a 520 dossier (J2, J3) | The inspector content is 360 wide with thumbnails of 170 × 96. The Jobs Reader is 560 with a 512 measure at 15/24 and no label column |
| B's free-text parser (J2) | Structured clauses plus an explicit keyword clause (D4) |
| C's bell replacing the inspector subject (J2) | The notification drop floats and never replaces the subject (D2) |
| Overlay drop shadows (J2, J3) | There are no shadows at all. Overlays use a fill plus a 1px border (§8.5) |
| 56px rows with group headers as the default People density (J2) | 44px rows, grouping None by default |
| 16px overlapping mutual monograms in the Relation column (J3) | Relation is text: the degree plus a context word |
| Inspector bio in text-1 (J3) | The bio is `text-2` (§7.1) |

---

## 12. Implementation architecture

**Stack:** the existing scaffold (Vite 8, React 19, TypeScript 5.9 strict, `motion` 13). Add exactly two dependencies:

```sh
npm i @fontsource-variable/instrument-sans@^5.3.0 @fontsource/ibm-plex-mono@^5.3.0
```

**Styling:**
- Global CSS: `src/styles/tokens.css` and `src/styles/base.css`.
- Each component has a co-located `*.module.css` (CSS Modules), and every value in it is a token `var(--…)`.
- There is no CSS framework, no Tailwind and no UI library.
- Inline `style` is allowed only for computed geometry: widths, `top`, and the notch `y`.

**Rendering contract:**
- The shell is `position: fixed; inset: 0` and fills the viewport.
- All geometry in this spec is for a 1440 × 1024 viewport. Widths are computed live by `lib/layout.ts` from `window.innerWidth`.
- `document.fonts.ready` gates nothing. Fonts are imported in `main.tsx` and are inlined in artifact builds.

### 12.1 Directory layout

```
src/
  main.tsx                         font imports, tokens.css, base.css, createRoot(<App/>)
  App.tsx                          <StoreProvider initial={readBoot()}><MotionConfig reducedMotion="user"><AppShell/></MotionConfig></StoreProvider>
  styles/
    tokens.css                     §8.1 colors + --font-*, --t-* (font shorthands), --s-*, --r-*, --z-*
    base.css                       reset; html/body/#root 100%; body{background:var(--frame);color:var(--text-2);font:400 13px/18px var(--font-sans);-webkit-font-smoothing:antialiased}; scrollbar hiding; ::selection{background:var(--active)}; :focus-visible rule; .num{font-variant-numeric:tabular-nums}
  lib/
    geometry.ts                    constants from §8.4
    motion.ts                      §9 springs and eases
    boot.ts                        readBoot(): parses ?section, #hash, ?palette, ?inspector, ?p (§12.4)
    layout.ts                      computeLayout(viewportW, sectionDef, state) → { channelW, workspaceW, inspectorW, channelFolded } (§5.1 yield steps 1 and 3)
    time.ts                        NOW = new Date('2026-09-28T12:32:00Z'); localTime(offset), relative(date), formatDay()
    cx.ts                          className join
  state/
    types.ts                       AppState, Action, HistoryEntry, SectionId, ViewId
    store.tsx                      StoreProvider, useApp(selector), useDispatch()
    reducer.ts                     pure reducer (§12.3)
    history.ts                     push / replace-merge (800ms) / back / forward
    useHotkeys.ts                  global keymap incl. G-chords (1200ms window), ignores inputs except Esc/⌘K
    urlSync.ts                     mirrors section + p to the URL with history.replaceState after boot
  data/
    types.ts                       §13.1
    viewer.ts  people.ts  personDetail.ts  peopleQuery.ts  companies.ts  jobs.ts  projects.ts
    applications.ts  hiring.ts  feed.ts  activity.ts  notifications.ts  saved.ts  palette.ts
  components/
    icons/Icon.tsx  icons/paths.ts
    primitives/Monogram.tsx  CompanyGlyph.tsx  Button.tsx  IconButton.tsx  TextButton.tsx  Kbd.tsx
               SkillToken.tsx  StatusGlyph.tsx  Segmented.tsx  Menu.tsx  Flag.tsx  Checkbox.tsx
               Notch.tsx  FitTicks.tsx  SectionHeading.tsx  Readout.tsx
    workspace/SegmentStrip.tsx  QueryLine.tsx  ClausePopover.tsx  ColumnHeader.tsx  FootReadout.tsx  KeyHints.tsx  ActionStrip.tsx
  shell/
    sections.tsx                   the section registry (§12.2)
    AppShell.tsx  Rail.tsx  RailItem.tsx  AccountButton.tsx  Column.tsx
    WorkspaceCap.tsx  HistoryButtons.tsx  AddressLine.tsx  GlobalZone.tsx
    Channel.tsx  Inspector.tsx  InspectorCap.tsx  ResizeHandle.tsx  TetherNotch.tsx
    CommandPalette.tsx  NotificationDrop.tsx  KeyboardSheet.tsx
  workspaces/
    people/      PeopleWorkspace.tsx  PeopleTable.tsx  PersonRow.tsx  PeopleCompact.tsx  PeopleGallery.tsx
                 PersonInspector.tsx  CareerStrip.tsx  WorkThumb.tsx  columns.ts  PeopleFoot.tsx
    home/        HomeWorkspace.tsx  Post.tsx  PostAttachment.tsx
    jobs/        JobsWorkspace.tsx  JobRow.tsx  JobReader.tsx
    companies/   CompaniesWorkspace.tsx  CompanyTile.tsx  CompanyInspector.tsx
    projects/    ProjectsWorkspace.tsx  BriefTile.tsx  BriefThumb.tsx  BriefInspector.tsx
    applications/ApplicationsWorkspace.tsx  StageTrack.tsx  ApplicationInspector.tsx
    hiring/      HiringWorkspace.tsx  Lane.tsx  CandidateSlab.tsx  CandidateInspector.tsx  RequisitionChannel.tsx
    saved/       SavedWorkspace.tsx  CollectionsChannel.tsx  SavedInspector.tsx
    activity/    ActivityWorkspace.tsx  ActivityRow.tsx
    profile/     ProfileWorkspace.tsx  OutlineChannel.tsx
```

### 12.2 Shell components

In every prop table in §12, `｜` stands for the TypeScript union bar `|`. It is written that way so the markdown tables render.

| Component | Responsibility | Props (high level) |
|---|---|---|
| `AppShell` | Lays out a flex row: `Rail` · `Channel`? · workspace `Column` · `Inspector`? Uses `computeLayout`. Renders `GlobalZone` absolutely at the top right (x 1328–1440, y 0–40, `--z-global`). Renders the overlay layer: `TetherNotch`, `CommandPalette`, `NotificationDrop`, `KeyboardSheet`. Mounts `useHotkeys` and `urlSync` | none (reads the store) |
| `Column` | Generic column with `cap` (40), `body` (flex 1; scrolls only where the child says so) and `foot` (28) slots. It draws the lattice edges with inset box-shadows (§2.1). Prop `edgeRight` controls whether it draws the separator | `cap`, `children`, `foot`, `surface: 'frame'｜'surface'｜'raised'`, `edgeRight: boolean`, `capScrolled: boolean` |
| `Rail` | Cap mark, the 4 groups (Hiring only when `viewer.employerSeat`), counts, the rail notch (`layoutId="rail-notch"`), Settings, `AccountButton`, and the foot sync dot. Shows G-chord hints while `G` is held | none |
| `RailItem` | 40 × 32 hit target, 32 × 32 square, icon, count, Flag with chord | `section`, `selected`, `count?`, `chordHint?` |
| `AccountButton` | Monogram 28 with an org badge, and the account menu | none |
| `WorkspaceCap` | HistoryButtons, tick, AddressLine, the section's cap actions, tick, inspector toggle. Its right padding reserves the global zone when the inspector is closed | `crumbs: string[]`, `actions: CapAction[]`, `inspectorAvailable: boolean` |
| `HistoryButtons` | Back/forward buttons, flags and the long-press history menu | none |
| `AddressLine` | Renders crumbs and the dirty mark. On click it becomes the palette input (while `palette.open`) | `crumbs`, `dirty` |
| `GlobalZone` | Tick, the `⌘K` trigger (opens the palette), and the bell with its unread square (opens NotificationDrop) | none |
| `Channel` | A 200-wide `Column` with a title cap, the section's channel body, and the `[ hide` foot. Its width animates with `panel` | `title`, `children` |
| `Inspector` | `motion.aside` animating width. Holds `InspectorCap`, a raised scroll body with fixed-width inner content, the section's inspector foot, the `ResizeHandle` on its left edge, and the condensed identity bar slot | `width`, `open`, `children`, `foot` |
| `InspectorCap` | The crumb joint (masks the separator), object crumb, position readout or resize readout, prev/next, close | `label`, `position: [n, total]`, `resizeReadout?: string` |
| `ResizeHandle` | 6px hit zone, hover delay 150ms, grip at pointer y, drag 1:1, snap on release, double-click reset | `width`, `min`, `max`, `defaultWidth`, `onChange`, `onCommit` |
| `TetherNotch` | Finds `[data-object-id="{selection}"]` inside the active workspace scroll container (a ref registered through context). Computes its center y relative to the shell and draws the 2 × 20 notch at `left = workspaceRight − 1`, animating `y` with `snap`. Shows the 2 × 8 stub when the object is out of view. Hidden when the inspector is closed. Listens to scroll and resize | none |
| `CommandPalette` | §10.1: input in place of the address line, grouped results, highlight with `layoutId`, keyboard navigation | none |
| `NotificationDrop` | §10.2 | none |
| `KeyboardSheet` | `?` overlay listing §6.9 and §10.4 | none |
| `sections.tsx` | Registry: `Record<SectionId, SectionDef>` (below) | none |

```ts
// shell/sections.tsx
type Mode = 'index' | 'stream' | 'matrix' | 'board' | 'sheet'
type InspectorClass = 'none' | 'peek' | 'reader'
interface CapAction { id: string; label: string; key?: string }
interface SectionDef {
  id: SectionId
  label: string
  icon: IconName
  railGroup: 'network' | 'work' | 'pipeline' | 'you' | null   // profile: null (rail notch stays on People)
  railSection: SectionId                                      // which rail item is selected (profile → 'people')
  chord: string                                               // 'P' for G P
  mode: Mode
  localNav: 'strip' | 'channel'
  channelTitle?: string
  inspector: InspectorClass
  boot: { inspectorOpen: boolean; selection: string | null; segment: string; view: ViewId; channelOpen: boolean }
  crumbs(state: AppState): string[]                           // workspace-cap crumbs, max 2
  objectLabel(id: string): string                             // inspector crumb
  objectOrder(state: AppState): string[]                      // for J/K and "n/total"
  capActions: CapAction[]
  Workspace: React.ComponentType                              // renders the workspace body (bands + scroll container)
  WorkspaceFoot: React.ComponentType                          // readout + key hints, or the action strip
  Channel?: React.ComponentType
  InspectorBody?: React.ComponentType<{ id: string }>
  InspectorFoot?: React.ComponentType<{ id: string }>
}
```

### 12.3 State

```ts
// state/types.ts
export type SectionId = 'home' | 'people' | 'jobs' | 'companies' | 'projects' | 'applications' | 'hiring' | 'saved' | 'activity' | 'profile'
export type ViewId = 'table' | 'compact' | 'gallery' | 'board' | 'stream' | 'sheet'
export interface HistoryEntry { section: SectionId; segmentId: string; subjectId: string | null; inspectorOpen: boolean; at: number }
export interface AppState {
  section: SectionId
  segment: Record<SectionId, string>            // active segment / collection / requisition id
  selection: Record<SectionId, string | null>   // object bound to the inspector (persists when closed)
  checked: Record<SectionId, string[]>          // multi-select
  inspectorOpen: Record<SectionId, boolean>
  inspectorWidth: Record<SectionId, number>     // default 400 (peek) / 560 (reader)
  channelOpen: Record<SectionId, boolean>       // preference; computeLayout folds it when the yield order requires
  view: Record<SectionId, ViewId>
  palette: { open: boolean; query: string; highlight: number }
  drop: null | 'notifications' | 'account' | 'history'
  keyboardSheet: boolean
  resize: null | { from: number; to: number }
  history: { stack: HistoryEntry[]; index: number }
  lastSelectAt: number
}
export type Action =
  | { type: 'navigate'; section: SectionId }                          // pushes history
  | { type: 'setSegment'; section: SectionId; segmentId: string }     // pushes history
  | { type: 'select'; section: SectionId; id: string; via: 'click' | 'key' | 'peek' }  // key: merge within 800ms; peek: no history
  | { type: 'step'; delta: 1 | -1 }                                   // J/K in the current section's objectOrder
  | { type: 'toggleInspector'; open?: boolean }
  | { type: 'setInspectorWidth'; section: SectionId; width: number }
  | { type: 'toggleChannel' }
  | { type: 'toggleCheck'; id: string; extend?: boolean }
  | { type: 'clearChecks' }
  | { type: 'setView'; view: ViewId }
  | { type: 'openPalette' } | { type: 'closePalette' } | { type: 'paletteQuery'; query: string } | { type: 'paletteMove'; delta: 1 | -1 }
  | { type: 'openDrop'; drop: AppState['drop'] } | { type: 'closeDrop' }
  | { type: 'back' } | { type: 'forward' }
  | { type: 'resize'; value: AppState['resize'] }
```

- **Initial state:** built from `sections.tsx` `boot` values, then overridden by `readBoot()`.
- **Boot selections:**

  | Section | Boot selection |
  |---|---|
  | people | `maren-aaltonen` |
  | companies | `halden` |
  | jobs | `job-halden-principal` |
  | projects | `brief-brisa-audit` |
  | applications | `app-oriel-head` |
  | hiring | `cand-kwame-asante` |
  | saved | none |
  | activity | none |
  | home | none |
  | profile | subject `maren-aaltonen` |

- **Boot segments:**

  | Section | Boot segment |
  |---|---|
  | people | `design-leads-emea` |
  | home | `following` |
  | jobs | `recommended` |
  | companies | `hiring-now` |
  | projects | `marketplace` |
  | applications | `active` |
  | hiring | `req-t114` |
  | saved | `all-saved` |
  | activity | `all` |
  | profile | `overview` |

### 12.4 Boot parameters (`lib/boot.ts`)

| Param | Values | Effect |
|---|---|---|
| `?section=` | `home`, `people`, `jobs`, `companies`, `projects`, `applications`, `hiring`, `saved`, `activity`, `profile` | Boot section. It wins over the hash |
| `location.hash` | `#people` etc., same ids | Boot section when `?section` is absent or invalid. A later `hashchange` dispatches `navigate` |
| (none or invalid) | | `people` |
| `?inspector=0` | | The boot section's inspector starts closed. Its selection is kept (quiet selection) |
| `?palette=1` | | The palette starts open with an empty query and the highlight on row 0 |
| `?p=<personId>` | any id from §13.4 | Overrides the People selection |

- After boot, `urlSync` writes `?section=<id>` (plus `&p=<id>` in People) with `history.replaceState`. It never pushes browser history.
- The first render uses `initial={false}` everywhere (§9).

### 12.5 Primitives

| Primitive | Responsibility | Props |
|---|---|---|
| `Icon` | Renders one of the §8.6 glyphs from `paths.ts` | `name: IconName`, `size: 10｜12｜16 = 16`, `filled?: boolean` (for `save`, `panel-right`) |
| `Monogram` | Square initials tile | `initials`, `hue: 0–5`, `size: 20｜24｜28｜56｜64`, `badge?: string` (the org badge letter) |
| `CompanyGlyph` | Company initial tile | `name`, `hue`, `size: 14｜32｜56` |
| `Button` | Primary or secondary button | `variant: 'primary'｜'secondary'`, `size: 24｜32`, `icon?`, `children`, `onClick` |
| `IconButton` | Ghost or bordered icon button with a Flag | `icon`, `label`, `keys?: string[]`, `size: 24｜32`, `bordered?`, `pressed?` |
| `TextButton` | 24h text action | `children`, `keys?`, `onClick` |
| `Kbd` | Key-cap sequence (symbols drawn as SVG) | `keys: string[]`, e.g. `['⌘','K']`, `['G','P']`, `['↵']`, `['esc']` |
| `SkillToken` | A skill as **text**, not a pill: optional 4 × 4 matched square, name, optional mono years | `name`, `matched`, `years?`, `size: 12｜13` |
| `StatusGlyph` | 7 × 7 availability shape, or the sync dot | `status: 'open'｜'exploring'｜'not-looking'｜'freelance'｜'synced'｜'offline'` |
| `Segmented` | View switcher | `options: { id, icon, label, key }[]`, `value`, `onChange` |
| `Menu` / `MenuTrigger` | Overlay list with groups, key hints and separators. The trigger manages open state and anchoring | `items: MenuItem[]`, `anchor`, `align: 'start'｜'end'`, `width` |
| `Flag` | Tooltip, delay 400ms (0ms while another flag is open) | `label`, `keys?`, `side: 'right'｜'bottom'｜'top'`, `children` (anchor) |
| `Checkbox` | 14 × 14 | `checked`, `onChange` |
| `Notch` | 2px `accent` bar, optionally shared through a `layoutId` | `orientation: 'v'｜'h'`, `length`, `layoutId?` |
| `FitTicks` | Clause ticks, used for fit and for stage tracks | `values: boolean[]`, `full?: boolean`, `highlight?: number`, `onHoverTick?(i)` |
| `SectionHeading` | Inspector and sheet heading with leader rule and readout | `label`, `readout?` |
| `Readout` | Sans 11/16 `text-3` sentence with tabular figures, or mono | `children`, `mono?` |

### 12.6 Workspace components (one folder per section)

| Component | Responsibility | Props |
|---|---|---|
| `SegmentStrip` (shared) | Tabs with counts, segment notch (`layoutId="segment-notch"`), `+`, the selected tab's `⋯`, and a right-hand slot for view controls | `segments`, `value`, `onChange`, `right?: ReactNode` |
| `QueryLine` (shared) | Search glyph, numbered clauses, sort facet, `+ Clause`, dirty actions. Publishes the hovered clause index through context so ticks can highlight | `query: Query`, `onChange`, `dirty` |
| `ClausePopover` | Edit or compose a clause. It never parses free text | `clause?`, `onCommit`, `onRemove` |
| `ColumnHeader` (shared) | Sentence-case labels at column x positions, sort arrow, hover edge hairlines and `⋯` | `columns: ColumnDef[]`, `sort` |
| `PeopleWorkspace` | Strip, query, header, and the rows scroll container (registers its ref for `TetherNotch`). Switches between table, compact and gallery | none |
| `PersonRow` | §6.5 anatomy. Hover replaces the Relation cell and the monogram. Selected fill uses `layoutId="selection-people"` | `person`, `index`, `selected`, `seam: boolean`, `checked`, `showCheckbox`, `columns`, `onSelect`, `onCheck` |
| `PersonInspector` | §7.1 anatomy for any person (Maren's detail is hand-written; others are derived per §13.5) | `id` |
| `CareerStrip` | 360 × 6 timeline plus axis | `entries`, `from`, `to` |
| `WorkThumb` | The schematic SVG thumbnails, keyed by `thumb` | `kind`, `width`, `height` |
| `PeopleFoot` | Readout and key hints, or the ActionStrip when 2 or more rows are checked | none |
| `HomeWorkspace` / `Post` | STREAM measure and margin notes | `post` |
| `JobsWorkspace` / `JobRow` / `JobReader` | INDEX rows and the Reader body | `job` |
| `CompaniesWorkspace` / `CompanyTile` / `CompanyInspector` | MATRIX lattice and the company Peek | `company` |
| `ProjectsWorkspace` / `BriefTile` / `BriefThumb` / `BriefInspector` | MATRIX of briefs and the brief Peek | `brief` |
| `ApplicationsWorkspace` / `StageTrack` / `ApplicationInspector` | Grouped INDEX, stage ticks, the timeline Peek | `application` |
| `HiringWorkspace` / `Lane` / `CandidateSlab` / `CandidateInspector` / `RequisitionChannel` | BOARD lanes, slabs, and the candidate Peek (`PersonInspector` plus a Pipeline section) | `candidate` |
| `SavedWorkspace` / `CollectionsChannel` / `SavedInspector` | Mixed INDEX. The inspector delegates by object type | `item` |
| `ActivityWorkspace` / `ActivityRow` | Day-grouped log with a time gutter | `item` |
| `ProfileWorkspace` / `OutlineChannel` | SHEET document, margin readouts, and a scroll-spy that drives the channel notch | none |

---

## 13. Data spec

- All data is static, typed, and exported from `src/data/*.ts`.
- **NOW = Monday 28 September 2026, 12:32 UTC.** Relative times ("2d", "3h") are written literally in the data. They are not computed.
- UTC offsets are the real offsets on that date (EU summer time is still in force): Berlin, Paris, Madrid +2; London, Lisbon, Lagos, Casablanca +1; Helsinki, Athens, Kyiv, Tallinn, Nairobi +3; Reykjavík and Accra +0; Dubai +4; São Paulo −3.
- Local time = 12:32 plus the offset.

### 13.1 Types (`src/data/types.ts`)

```ts
export type HueIndex = 0 | 1 | 2 | 3 | 4 | 5
export type AvailabilityStatus = 'open' | 'exploring' | 'not-looking' | 'freelance'
export type Degree = 1 | 2 | 3 | 'team'
export type FitVector = [boolean, boolean, boolean, boolean, boolean]   // clause 1..5

export interface Clause { index: number; key: 'role' | 'seniority' | 'region' | 'skill' | 'availability' | 'company' | 'degree' | 'keyword' | 'level' | 'discipline' | 'remote' | 'comp' | 'budget' | 'duration' | 'size' | 'hiring'; lead?: string; value: string }
export interface Query { clauses: Clause[]; sort: { lead: '— by'; value: string } }
export interface Segment { id: string; label: string; count: number; delta?: number }

export interface Skill { name: string; matched: boolean; years?: number }
export interface Availability {
  status: AvailabilityStatus
  label: 'Open' | 'Exploring' | 'Not looking' | 'Freelance'
  timing: string                      // row line 2: 'Nov 2026' | 'now' | '2 d/wk' | '—'
}

export interface Person {
  id: string                          // kebab-case of the name, ASCII-folded (e.g. 'sigridur-jonsdottir')
  name: string
  initials: string
  hue: HueIndex
  headline: string                    // role title (row line 2, inspector headline prefix)
  companyId: string
  company: string
  tenure: string                      // '3y'
  city: string
  country: string
  utcOffset: string                   // 'UTC+2' (U+2212 for minus)
  years: number                       // total years of experience
  availability: Availability
  degree: Degree
  relation: string                    // Relation line 2
  introVia?: string                   // viewer's 1° who can introduce (degree 2 only)
  fit: FitVector
  evidence: string                    // ≤ 36 chars; Fit line 2
  skills: Skill[]                     // 3–4, matched first
  prev: { role: string; company: string }   // previous role (for derived detail)
}

export interface ExperienceEntry { role: string; company: string; note: string; start: string; end: string | null; duration: string }   // 'YYYY-MM'
export type ThumbKind = 'selection-model' | 'disputes-flow' | 'token-pipeline' | 'component-grid' | 'map-style' | 'dispatch-table' | 'stepper' | 'phone-flow'
export interface WorkItem { id: string; title: string; year: number; kind: 'case study' | 'essay' | 'talk'; minutes: number; thumb: ThumbKind; summary?: string }
export interface FitLine { index: number; clause: string; evidence: string; met: boolean }
export interface TextRun { text: string; tone?: 'text-1' | 'text-2' | 'text-3'; mono?: boolean; weight?: 500 }
export interface ContextLine { icon: 'worked-with' | 'people' | 'view' | 'saved' | 'follow'; runs: TextRun[] }
export interface Recommendation { quote: string; author: string; authorRole: string; year: number }

export interface PersonDetail extends Person {
  headlineLong: string
  localTime: string                   // '14:32'
  activeAgo: string                   // '3h'
  availabilityLine: TextRun[]
  availabilityTerms: string
  primaryAction: { kind: 'intro' | 'message' | 'open-pipeline'; label: string; flag?: string }
  target: { label: string; org: string } | null
  fitLines: FitLine[]
  bio: string                         // ≤ 160 chars (inspector, 3 lines)
  bioLong: string                     // Profile overview
  experience: ExperienceEntry[]
  totalExperience: string             // '11y'
  careerAxis: { from: string; to: string }
  work: WorkItem[]
  skillsDetail: Skill[]               // 8, with years
  sharedContext: ContextLine[]
  recommendations: Recommendation[]
  recentActivity: { title: string; date: string }[]
  provenance: TextRun[]
}

export interface Company {
  id: string; name: string; hue: HueIndex; sector: string; hq: string; founded: number
  headcount: number; openRoles: number; youKnow: number; thesis: string; following: boolean
}
export interface Job {
  id: string; title: string; companyId: string; company: string; location: string
  comp: string; compNote: string; posted: string; applicants: number; fit: [boolean, boolean, boolean, boolean]
  level?: string; team?: string; reportsTo?: string; process?: string; body?: { heading: string; paragraphs?: string[]; lines?: string[] }[]
}
export interface Project {
  id: string; title: string; clientId: string; client: string; budget: string; duration: string
  proposals: number; remote: boolean; skills: string[]; posted: string
  summary?: string; scope?: string[]; start?: string; clientNote?: string
}
export type AppStage = 'applied' | 'screen' | 'interview' | 'offer' | 'closed'
export interface Application {
  id: string; role: string; companyId: string; company: string; stage: AppStage
  next: { label: string; when: string | null }; updated: string
  timeline?: { date: string; text: string }[]; contacts?: { name: string; role: string }[]
}
export type HiringStage = 'new' | 'screen' | 'interview' | 'final' | 'offer'
export interface Requisition { id: string; title: string; team: string; count: number }
export interface Candidate {
  id: string; personId?: string; name: string; initials: string; hue: HueIndex; headline: string
  stage: HiringStage; daysInStage: number; fit: FitVector; source: 'sourced' | 'referral' | 'applied'
  next?: { label: string; when: string }
  scorecards?: { reviewer: string; verdict: 'Strong yes' | 'Yes' | 'No' | 'Pending' }[]
}
export interface FeedItem {
  id: string; authorKind: 'person' | 'company'; authorId: string; author: string; initials: string; hue: HueIndex
  byline: string; time: string; body: string
  attachment?: { kind: 'bars' | 'diff' | 'job'; caption: string; jobId?: string }
  counts: { replies: number; reposts: number }; marginNote: TextRun[]
}
export interface ActivityItem {
  id: string; day: 'today' | 'yesterday'; time: string
  kind: 'view' | 'pipeline' | 'reply' | 'segment' | 'job' | 'application' | 'mention' | 'profile-views' | 'proposal' | 'share' | 'scorecard'
  runs: TextRun[]; objectRef: { section: SectionId; id: string }; unread: boolean
}
export interface SavedItem {
  id: string; type: 'Person' | 'Job' | 'Project' | 'Company' | 'Post'; refId: string
  title: string; subtitle: string; collection: string; saved: string; note?: string
}
export interface Viewer {
  name: 'Rhea Kovač'; initials: 'RK'; hue: 2; role: 'Design Director'; company: 'Tandem'
  actingAs: { kind: 'employer'; org: 'Tandem'; badge: 'T' }; employerSeat: true
}
```

`SectionId` is imported from `state/types.ts`.

### 13.2 Viewer (`viewer.ts`)
- **Rhea Kovač**, Design Director at **Tandem**, a shared workspace for engineering teams, based in Munich.
- She is acting as **Tandem · Hiring**, so the org badge shows `T`.
- Her 1° connections who appear in the data: Jonas Petersen, Aiko Mori, Tove Lindqvist, Priya Raman, Tomás Rey, Élodie Marchand, Ana Ruiz. Her team member: Felix Braun.
- Open requisition used as the target: **Staff Designer, Canvas** (`req-t114`).

### 13.3 The People query (`peopleQuery.ts`), exactly

```ts
export const peopleSegments: Segment[] = [
  { id: 'all-people', label: 'All people', count: 1284 },
  { id: 'design-leads-emea', label: 'Design leads · EMEA', count: 22 },
  { id: 'following', label: 'Following', count: 212 },
  { id: 'warm-intros', label: 'Warm intros', count: 17 },
  { id: 'open-to-contract', label: 'Open to contract', count: 96 },
]
export const peopleQuery: Query = {
  clauses: [
    { index: 1, key: 'role', value: 'Product designers' },
    { index: 2, key: 'seniority', value: 'senior or above' },
    { index: 3, key: 'region', lead: 'in', value: 'EMEA, UTC−1 to +3' },
    { index: 4, key: 'skill', lead: 'with', value: 'design systems' },
    { index: 5, key: 'availability', lead: 'available within', value: '3 months' },
  ],
  sort: { lead: '— by', value: 'fit' },
}
```

- The segment is saved and not dirty.
- The result set is exactly the 22 people below, in this order. The foot reads `22 results · 3 match all 5 · 1 selected · by fit, then years in skill · updated 2m ago`.

### 13.4 People result set (`people.ts`), in display order

Fit is written as clauses 1–5 (1 = met). "✓" marks the matched skill. The Relation column is the degree followed by line 2. "via" is `introVia`.

| # | id | Name | Ini / hue | Headline | Company · tenure | City, Country · UTC | Yrs | Availability (status · timing) | Relation | Fit | Evidence | Skills | Previous role |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | `aurelien-duclos` | Aurélien Duclos | AD / 2 | Principal Designer, Editor | Oriel · 6y | Paris, France · UTC+2 | 14 | open · Nov 2026 | 2° · 5 mutual (via Élodie Marchand) | 11111 | Built Oriel's token pipeline | Design systems ✓, Design tokens, Editor UX, Prototyping | Senior Designer · Mosaic Health |
| 1 | `tove-lindqvist` | Tove Lindqvist | TL / 3 | Staff Product Designer | Northdesk · 3y | Stockholm, Sweden · UTC+2 | 12 | exploring · Dec 2026 | 1° · Follows you | 11111 | Leads Northdesk's system, 4 teams | Design systems ✓, Accessibility, Design tooling, Figma API | Senior Product Designer · Klarvik |
| 2 | `kwame-asante` | Kwame Asante | KA / 1 | Senior Product Designer, Platform | Halden · 2y | Amsterdam, Netherlands · UTC+2 | 9 | open · Oct 2026 | 2° · In pipeline (via Aiko Mori) | 11111 | Rebuilt Halden's library in code | Design systems ✓, React, Figma API, Motion | Product Designer · Tessera |
| **3** | **`maren-aaltonen`** | **Maren Aaltonen** | **MA / 0** | **Senior Product Designer** | **Plinth · 3y** | **Berlin, Germany · UTC+2** | **11** | **open · Jan 2027** | **2° · 3 mutual (via Jonas Petersen)** | **11110** | **Leads Plinth's design system** | **Design systems ✓, Editor / canvas UX, Prototyping (code), Multiplayer UX** | **Product Designer, Console · Ledgerline** |
| 4 | `wanjiru-kamau` | Wanjiru Kamau | WK / 4 | Lead Product Designer | Mawimbi · 4y | Nairobi, Kenya · UTC+3 | 10 | exploring · Feb 2027 | 2° · 1 mutual (via Tomás Rey) | 11110 | Runs Mawimbi's design system guild | Design systems ✓, Mobile money UX, Research, Facilitation | Senior Designer · Safiri Labs |
| 5 | `mateusz-krol` | Mateusz Król | MK / 5 | Senior UX Engineer | Ledgerline · 2y | Warsaw, Poland · UTC+2 | 8 | freelance · 2 d/wk | 2° · 1 mutual (via Jonas Petersen) | 01111 | Maintains Ledgerline's React kit | Design systems ✓, React, Prototyping, Accessibility | Frontend Engineer · Kanto Studio |
| 6 | `aiko-mori` | Aiko Mori | AM / 2 | Staff Designer, Systems | Quanta Labs · 4y | Berlin, Germany · UTC+2 | 13 | exploring · Mar 2027 | 1° · Replied | 11110 | Co-authored Quanta's token spec | Design systems ✓, Design tokens, Documentation, Figma API | Senior Designer · Tandem |
| 7 | `priya-raman` | Priya Raman | PR / 0 | Lead Designer, Workflows | Sable · 4y | London, United Kingdom · UTC+1 | 12 | not-looking · — | 1° · Follows you | 11110 | Owns Sable's workflow patterns | Design systems ✓, Workflow design, Research, Service design | Senior Product Designer · Brisa |
| 8 | `eleni-papadaki` | Eleni Papadaki | EP / 3 | Principal Designer | Atlas Maps · 5y | Athens, Greece · UTC+3 | 15 | exploring · Jan 2027 | 2° · 2 mutual (via Tove Lindqvist) | 11110 | Built Atlas's map UI system | Design systems ✓, Cartography UI, Data visualisation | Senior Designer · Periptero |
| 9 | `amara-okafor` | Amara Okafor | AO / 3 | Principal Product Designer | Tessera · 5y | Lagos, Nigeria · UTC+1 | 12 | open · Dec 2026 | 3° · Viewed job | 11101 | Took Tessera's merchant app to 2M | Fintech UX, Design leadership, Research, Mobile | Senior Product Designer · Paylane |
| 10 | `lucia-ferrer` | Lucía Ferrer | LF / 1 | Design Lead, Growth | Brisa · 2y | Barcelona, Spain · UTC+2 | 10 | open · now | 2° · 4 mutual (via Priya Raman) | 11101 | Leads growth design, 3 squads | Growth design, Experimentation, Onboarding | Senior Product Designer · Movia |
| 11 | `samir-benali` | Samir Benali | SB / 5 | Senior Product Designer | Orbit Freight · 3y | Casablanca, Morocco · UTC+1 | 9 | open · now | 3° · Replied | 11101 | Designed Orbit's dispatch console | Data-dense UI, Logistics UX, Prototyping | Product Designer · Ferro |
| 12 | `dmytro-shevchenko` | Dmytro Shevchenko | DS / 2 | Senior Product Designer | Pryvit Bank · 3y | Kyiv, Ukraine · UTC+3 | 8 | open · now | 3° · Follows you | 11101 | Designed Pryvit's card controls | Mobile banking, Interaction design, Prototyping | Product Designer · Hromada |
| 13 | `giulia-romano` | Giulia Romano | GR / 4 | Design Manager | Fondo · 3y | Milan, Italy · UTC+2 | 13 | open · Nov 2026 | 2° · 2 mutual (via Ana Ruiz) | 01111 | Runs Fondo's 7-person design team | Design systems ✓, Design leadership, Hiring, Design ops | Design Lead · Brisa |
| 14 | `omar-farouk` | Omar Farouk | OF / 1 | Staff Product Designer | Dunes Cloud · 2y | Dubai, United Arab Emirates · UTC+4 | 11 | open · Nov 2026 | 3° · Viewed job | 11001 | Leads console UX at Dunes Cloud | Developer tools, Data-dense UI, Prototyping | Senior Designer · Qanat Systems |
| 15 | `beatriz-costa` | Beatriz Costa | BC / 0 | Senior Product Designer | Mercado Nuvem · 3y | São Paulo, Brazil · UTC−3 | 9 | open · now | 3° · Follows you | 11001 | Led checkout for 40k merchants | Commerce UX, Research, Prototyping | Product Designer · Lojinha |
| 16 | `sigridur-jonsdottir` | Sigríður Jónsdóttir | SJ / 3 | Lead UX Researcher | Hekla Health · 4y | Reykjavík, Iceland · UTC+0 | 12 | open · Dec 2026 | 2° · 1 mutual (via Tove Lindqvist) | 01101 | Ran Hekla's clinician research | Research, Service design, Workshops | UX Researcher · Kvarnir |
| 17 | `kristjan-tamm` | Kristjan Tamm | KT / 2 | Design Technologist | Veski · 2y | Tallinn, Estonia · UTC+3 | 7 | freelance · 3 d/wk | 2° · 2 mutual (via Jonas Petersen) | 00111 | Ships Veski's token sync to code | Design systems ✓, TypeScript, Design tokens | Frontend Developer · Lumo |
| 18 | `felix-braun` | Felix Braun | FB / 4 | Product Designer II | Tandem · 1y | Munich, Germany · UTC+2 | 4 | not-looking · — | Team · Your team | 10110 | Maintains Tandem's icon set | Design systems ✓, Iconography, Motion | Junior Designer · Wirkung Mobility |
| 19 | `hana-nguyen` | Hana Nguyen | HN / 5 | Senior Interaction Designer | Wirkung Mobility · 4y | Hamburg, Germany · UTC+2 | 10 | not-looking · — | 2° · 1 mutual (via Felix Braun) | 11100 | Designed in-car HMI, 2 models | Automotive HMI, Motion, Prototyping | Interaction Designer · Kreis Studio |
| 20 | `lea-moreau` | Léa Moreau | LM / 3 | Senior Product Designer | Oriel · 1y | Paris, France · UTC+2 | 8 | not-looking · — | 2° · 3 mutual (via Élodie Marchand) | 11100 | Designs Oriel's review flow | Collaboration UX, Interaction design, UX writing | Product Designer · Mosaic Health |
| 21 | `yusuf-adeyemi` | Yusuf Adeyemi | YA / 1 | Product Designer | Tessera · 2y | Accra, Ghana · UTC+0 | 5 | exploring · Feb 2027 | 3° · Follows you | 10110 | Keeps Tessera's Android kit | Design systems ✓, Android, Accessibility | Product Designer · Paylane |

- **Fit counts:** rows 0–2 are 5/5, rows 3–13 are 4/5, and rows 14–21 are 3/5.
- **Row city** is the city only (`Berlin`). The country appears only in the inspector.
- **Company ids** are kebab-case names (`plinth`, `oriel`, `halden`, `northdesk`, `ledgerline`, `sable`, `mawimbi`, `tessera`, `brisa`, `quanta-labs`, `atlas-maps`, `fondo`, `orbit-freight`, `pryvit-bank`, `dunes-cloud`, `mercado-nuvem`, `hekla-health`, `veski`, `tandem`, `wirkung-mobility`).
- **Company hue** is `(index in companies.ts) % 6`. Companies that are not in `companies.ts` use hue 5.

### 13.5 Person detail (`personDetail.ts`)

`getPersonDetail(id)` returns the hand-written record for `maren-aaltonen`. For every other person it returns a record derived by these exact rules:

| Field | Maren (hand-written) | Derived rule for everyone else |
|---|---|---|
| headlineLong | "Senior Product Designer — design systems, editor tooling and multiplayer UX" | `${headline} at ${company}` |
| meta | Plinth · Berlin, Germany · `14:32 UTC+2` | `${company} · ${city}, ${country} · ` + mono `${localTime} ${utcOffset}` |
| availabilityLine / terms | "Open to roles from **11 Jan 2027**" / "Full-time or contract · hybrid Berlin or remote EMEA" | open: "Open to roles from {timing}" ("Open to roles now" when timing is `now`); exploring: "Exploring roles from {timing}"; not-looking: "Not looking"; freelance: "Available for projects · {timing}". Terms: "Full-time · {city} or remote" |
| primaryAction | intro · "Request intro via Jonas" · flag "Jonas Petersen (your 1°) worked with Maren at Ledgerline, 2020–22" | degree 1 or team: "Message". Degree 2: "Request intro via {first name of introVia}". Degree 3: "Request intro". Relation `In pipeline`: "Open in pipeline" |
| target | Staff Designer, Canvas · Tandem | the same for everyone |
| fitLines | §7.1 table | 1: headline · 2: `${years} yrs` · 3: `${city} · ${utcOffset}` · 4: met → evidence, not met → "No design-system work listed" · 5: open/exploring → "from {timing}" (`now` → "available now"); freelance → "{timing}, available now"; not-looking → "Not looking". `met` comes from `fit` |
| bio | §7.1 | `${evidence}. ${years} years in product and interaction design; ${tenure} at ${company}.` |
| experience | §7.1 table (4 entries) | two entries: current (`headline`, `company`, start = 2026-09 minus tenure, end null) and previous (`prev.role`, `prev.company`, ending at the current start, starting `years − tenure` years earlier) |
| careerAxis | 2015-01 → 2026-09 | (2026 − years)-01 → 2026-09 |
| work | 2 items (§7.1) | 2 items: "{company} — {skills[0]}" (`case study`, year 2025, 7 min, thumb `component-grid`) and "{prev.company} — {skills[1]}" (`case study`, year 2022, 5 min, thumb `stepper`) |
| skillsDetail | 8 with years (§7.1) | the person's 3–4 skills. Years = `min(years, 6)`, then 4, 3, 2 |
| sharedContext | §7.1 (4 lines) | one line: the `people` icon plus Relation line 2, with the `introVia` name in `text-1` when present |
| recommendations / recentActivity | §7.1 | none (the sections are omitted) |
| provenance | "Updated 6d ago · 2 of 4 roles verified" | "Updated 2w ago · 1 of 2 roles verified" |

**Maren only: extra fields used by the Profile (SHEET).**
- **bioLong**, 3 paragraphs:
  1. "Eleven years designing the tools other designers use. At Plinth I lead the design system and own the editor's selection and multiplayer model — the part of the canvas everyone touches and nobody notices when it works."
  2. "Before Plinth I spent three years on Ledgerline's payments console, where I learned to design for people who read tables for a living: disputes, reconciliation, and a lot of keyboard shortcuts."
  3. "I write the spec before the mockup, prototype in code when the interaction is the product, and I am happiest in small teams with hard constraints."
- **Experience notes** (one line under each entry):
  - Plinth: "Leads the design system (140 components, 3 platforms); designed the Canvas 3 selection model."
  - Ledgerline: "Disputes and reconciliation console; introduced the keyboard-first table pattern."
  - Forma Studio: "Client work for Finnish public-sector services."
  - Rautatie Digital: "Timetable and ticketing flows."
- **Experience dates:**
  - Plinth: 2023-08 → present
  - Ledgerline: 2020-04 → 2023-06
  - Forma Studio: 2017-03 → 2020-02
  - Rautatie Digital: 2015-03 → 2017-01
- **Work (4):**

  | Title | Year | Kind | Thumb |
  |---|---|---|---|
  | Plinth Canvas 3 — selection model | 2025 | case study, 8 min | `selection-model` |
  | Ledgerline Console — disputes flow | 2022 | case study, 6 min | `disputes-flow` |
  | Plinth tokens v2 — one source, three platforms | 2024 | essay, 5 min | `token-pipeline` |
  | Selection is a product decision | 2026 | talk, 22 min | `selection-model` |

- **Writing:**
  - "Selection is a product decision, not a UI detail" (14 Sep 2026)
  - "Notes from rebuilding Plinth's token pipeline" (2 Aug 2026)
  - "Dense tables are a kindness" (11 Mar 2026)
- **Margin readouts:**
  - Profile views · 30d `214`
  - Response time `~1 day`
  - Last active `3h ago`
  - Fit · Design leads · EMEA: ticks plus `4/5`

### 13.6 Companies (`companies.ts`), in tile order (strip: Hiring now)

| # | id | Name | Sector · HQ | Founded | Headcount | Open roles | You know | Thesis |
|---|---|---|---|---|---|---|---|---|
| 0 | plinth | Plinth | Collaborative canvas · Berlin | 2019 | 180 | 3 | 6 | A canvas that teams can actually think on. |
| 1 | oriel | Oriel | Editor tools · Paris | 2018 | 95 | 2 | 3 | Open editing primitives for serious writing tools. |
| 2 | **halden** | **Halden** | **Developer platform · Amsterdam** | **2017** | **420** | **6** | **4** | **Build pipelines that explain themselves.** |
| 3 | northdesk | Northdesk | Support software · Stockholm | 2016 | 260 | 4 | 5 | Support queues designed around the agent's day. |
| 4 | ledgerline | Ledgerline | Payments infrastructure · Warsaw | 2015 | 610 | 9 | 7 | Reconciliation you never have to think about. |
| 5 | sable | Sable | Workflow automation · London | 2018 | 340 | 5 | 3 | Approvals and handoffs as a product, not a form. |
| 6 | mawimbi | Mawimbi | Mobile money · Nairobi | 2016 | 510 | 7 | 2 | Wallets for small merchants across East Africa. |
| 7 | tessera | Tessera | Merchant banking · Lagos | 2019 | 380 | 4 | 3 | Business accounts for West African merchants. |
| 8 | brisa | Brisa | Consumer mobility · Barcelona | 2017 | 290 | 3 | 4 | Shared e-bikes priced like public transport. |
| 9 | quanta-labs | Quanta Labs | Design infrastructure · Berlin | 2021 | 70 | 2 | 3 | Design tokens as a build artifact. |
| 10 | atlas-maps | Atlas Maps | Mapping platform · Athens | 2014 | 150 | 3 | 2 | Map styles that read at every zoom. |
| 11 | fondo | Fondo | Fund administration · Milan | 2020 | 220 | 2 | 2 | Back-office software for small funds. |

**Halden Peek:**
- Identity: glyph 56, name 20/24, and "Developer platform · Amsterdam · founded 2017".
- Actions: primary **Follow**, then Save and ⋯.
- Facts grid:

  | Label | Value |
  |---|---|
  | Headcount | `420` |
  | Growth · 12 mo | `+18%` |
  | Open roles | `6` |
  | Design team | `11` |
  | Remote policy | EMEA remote |

- Open roles, as rows:
  - Principal Product Designer, Platform · `€130–150k` · `2d`
  - Senior Product Designer, CI · `€95–115k` · `6d`
  - Design Engineer · `€90–110k` · `9d`
- People you know:
  - Kwame Asante `2°`
  - Lars Visser `1°`
  - Mirte Bakker `2°`
  - Pieter Jansen `3°`

### 13.7 Jobs (`jobs.ts`), Recommended

Clauses: [1] `principal or staff` [2] `product design` [3] `remote in EMEA` [4] `€120k or more` (band top ≥ €120k), then `— by fit`.

| # | id | Title | Company | Location | Comp | Posted | Applicants | Fit |
|---|---|---|---|---|---|---|---|---|
| 0 | **job-halden-principal** | **Principal Product Designer, Platform** | Halden | Amsterdam or remote in EMEA | €130–150k | 2d | 41 | 1111 |
| 1 | job-plinth-staff | Staff Designer, Multiplayer | Plinth | Berlin or remote in EMEA | €120–140k | 3d | 33 | 1111 |
| 2 | job-northdesk-staff | Staff Product Designer, Agent Workspace | Northdesk | Stockholm or remote in EMEA | €115–135k | 1d | 27 | 1111 |
| 3 | job-oriel-head | Head of Design, Editor | Oriel | Paris · hybrid | €140–165k | 4d | 58 | 1101 |
| 4 | job-sable-staff | Staff Product Designer, Approvals | Sable | London · hybrid | £105–125k | 5d | 36 | 1101 |
| 5 | job-brisa-vp | VP Design | Brisa | Barcelona | €150–180k | 10d | 74 | 1101 |
| 6 | job-ledgerline-principal | Principal Designer, Payments Console | Ledgerline | Warsaw or remote in EU | €100–118k | 6d | 19 | 1110 |
| 7 | job-atlas-principal | Principal Designer, Map Styles | Atlas Maps | Athens or remote in EU | €95–115k | 12d | 16 | 1110 |
| 8 | job-quanta-staff | Staff Design Engineer, Tokens | Quanta Labs | Remote in EMEA | €100–120k | 8d | 12 | 1011 |
| 9 | job-mawimbi-lead | Lead Product Designer, Merchant | Mawimbi | Nairobi or remote in EMEA | $90–110k | 7d | 22 | 0110 |

`compNote` is "base + equity" for every row except Brisa ("base + bonus").

**Reader for job-halden-principal:**
- Title, then "Halden · Amsterdam or remote in EMEA · Full-time".
- Facts:

  | Label | Value |
  |---|---|
  | Comp | `€130–150k` + equity |
  | Level | Principal (L7) |
  | Team | Platform · 14 engineers, 2 designers |
  | Reports to | Mirte Bakker, Head of Design |
  | Posted | `2d` ago · `41` applicants |
  | Process | 4 stages · about 3 weeks |

- Actions: **Apply** (primary), Save, ⋯. Target line: "→ as Rhea Kovač · personal".
- **About the role** (one paragraph): "Halden's platform team builds the pipeline views that 30,000 engineering teams open every morning. You will own the design of how builds, deploys and failures are explained — from the first red check to the fix — and set the interaction model the rest of the product follows."
- **What you'll do** (lines):
  - Lead design for pipelines, logs and deploy history.
  - Define the platform's interaction patterns with the design-system team.
  - Prototype in code with engineers; ship weekly.
  - Mentor two product designers.
- **What we look for** (lines):
  - 10+ years in product design, 3+ on developer or data-dense tools.
  - A portfolio that shows systems thinking, not just screens.
  - Comfortable writing specs and reading code.
  - Based in or overlapping with CET.
- **How we interview** (lines):
  - Recruiter call (30 min)
  - Portfolio review (60 min)
  - Working session with the team (90 min)
  - Founder conversation (45 min)

### 13.8 Projects (`projects.ts`), Marketplace

Clauses: [1] `product design` [2] `€15k or more` [3] `4–12 weeks` [4] `remote`, then `— by newest`.

| # | id | Title | Client | Budget | Duration | Proposals | Skills | Posted |
|---|---|---|---|---|---|---|---|---|
| 0 | **brief-brisa-audit** | **Design system audit and token migration** | Brisa | €18–24k | 8 wk | 11 | Design systems · Design tokens · Figma | 1d |
| 1 | brief-quanta-figma | Figma plugin for token linting | Quanta Labs | €18–26k | 8 wk | 12 | Figma API · Design tokens · TypeScript | 2d |
| 2 | brief-fondo-dashboard | Fund reporting dashboard redesign | Fondo | €22–30k | 10 wk | 7 | Data-dense UI · Research | 2d |
| 3 | brief-mawimbi-onboarding | Merchant onboarding flow, Android | Mawimbi | €15–20k | 6 wk | 14 | Mobile · Onboarding · Research | 3d |
| 4 | brief-sable-templates | Workflow template gallery | Sable | €20–28k | 7 wk | 10 | Workflow design · Content design | 4d |
| 5 | brief-veski-docs | Component documentation site | Veski | €16–22k | 6 wk | 5 | Design systems · Documentation | 5d |
| 6 | brief-orbit-dispatch | Dispatch console usability study | Orbit Freight | €15–18k | 5 wk | 8 | Research · Data-dense UI | 6d |
| 7 | brief-hekla-scheduling | Clinician scheduling prototype | Hekla Health | €25–32k | 12 wk | 6 | Prototyping · Healthcare UX | 8d |
| 8 | brief-atlas-legend | Map legend and layer controls | Atlas Maps | €12–16k | 4 wk | 9 | Interaction design · Cartography UI | 9d |

**Peek for brief-brisa-audit:**
- Summary: "Brisa's app and operator console share 60% of their components but three different token sets. We need an audit of the current system and a migration plan to a single token source, then support for the first two migration sprints."
- Client line: "Brisa · Consumer mobility · 12 briefs posted · pays within 14 days".
- Facts:

  | Label | Value |
  |---|---|
  | Budget | `€18–24k` fixed |
  | Timeline | `8 wk` from 19 Oct |
  | Proposals | `11` |
  | Location | Remote, EMEA hours |

- Scope:
  - Inventory of components and tokens across 2 products
  - Gap and duplication report
  - Token architecture proposal (DTCG format)
  - Migration plan with sequencing
  - Pairing on 2 migration sprints
- Actions: primary **Write proposal**, then Save and ⋯.

### 13.9 Applications (`applications.ts`), Active (personal context)

| Group | id | Role | Company | Stage | Next | Updated |
|---|---|---|---|---|---|---|
| Interview | **app-oriel-head** | **Head of Design, Editor** | Oriel | interview | Panel interview · `Thu 1 Oct 14:00` | 1d |
| Interview | app-northdesk-director | Design Director | Northdesk | interview | Portfolio review · `Mon 5 Oct 10:00` | 3d |
| Screen | app-halden-principal | Principal Product Designer, Platform | Halden | screen | Recruiter call · `Wed 30 Sep 16:00` | 2h |
| Applied | app-brisa-vp | VP Design | Brisa | applied | Awaiting review | 6d |
| Applied | app-tessera-lead | Design Lead, Payments | Tessera | applied | Awaiting review | 9d |

**Peek for app-oriel-head:**
- Stage track: 3 of 5 filled.
- **Next step:** "Panel interview · Thu 1 Oct, 14:00–15:30 CEST · with Camille Roux (Head of Product) and Aurélien Duclos (Principal Designer)".
- **Timeline:**
  - `14 Sep` Applied
  - `16 Sep` Recruiter call with Inès Laurent
  - `22 Sep` Portfolio review passed
  - `25 Sep` Panel scheduled
- **Contacts:** Inès Laurent (Recruiter), Camille Roux (Head of Product).
- Actions: primary **Confirm panel slot**. Target line: "→ as Rhea Kovač · personal".

### 13.10 Hiring (`hiring.ts`)

**Requisitions** (channel):

| id | Title | Team | Count |
|---|---|---|---|
| **req-t114** | **Staff Designer, Canvas** | Canvas | 22 |
| req-t109 | Senior Product Designer, Editor | Editor | 31 |
| req-t121 | Design Engineer | Design systems | 14 |
| req-t098 | Product Design Intern 2027 | Design | 58 |
| req-t117 | Staff Engineer, Sync | Platform | 40 |
| req-t102 | Engineering Manager, Platform | Platform | 19 |

**Candidates for req-t114** (lane order top to bottom; "n/5 · d" means fit count and days in stage):
- **New 7:**
  - Noor Haddad 4/5 · 1d
  - Rafael Mendes 3/5 · 1d
  - Leila Ahmadi 4/5 · 2d
  - Oskar Nyberg 3/5 · 2d
  - Chiara Bianchi 4/5 · 3d
  - Daniel Mensah 3/5 · 4d
  - Yuki Tanaka 3/5 · 5d
- **Screen 6:**
  - Ilse de Vries 4/5 · 2d
  - Anya Petrova 4/5 · 3d
  - Mehmet Kaya 3/5 · 3d
  - Sofia Oliveira 4/5 · 5d
  - Pieter Jansen 3/5 · 6d
  - Zanele Dube 4/5 · 8d
- **Interview 5:**
  - **Kwame Asante 5/5 · 3d** (`cand-kwame-asante`, `personId: 'kwame-asante'`, source referral)
  - Jin-woo Park 4/5 · 4d
  - Marta Nowak 4/5 · 6d
  - Elif Şahin 3/5 · 7d
  - Arjun Mehta 4/5 · 9d
- **Final 3:**
  - Camila Reyes 5/5 · 2d
  - Henrik Lund 4/5 · 5d
  - Laila Karimi 4/5 · 6d
- **Offer 1:**
  - Thomas Brandt 5/5 · 4d

Headlines for candidates other than Kwame read "Senior Product Designer · {city}" with cities in EMEA. Hues are `index % 6`.

**Kwame's Pipeline section** (inspector, after Fit):

| Label | Value |
|---|---|
| Stage | Interview · `3d` in stage |
| Next | Design exercise review · `Wed 30 Sep 11:00` |
| Scorecards | `2 of 3` submitted |

Scorecards:
- Rhea Kovač — Strong yes
- Felix Braun — Yes
- Jonas Petersen — Pending

The primary action is **Advance to Final**.

### 13.11 Feed (`feed.ts`), Following

| # | Author (byline) | Time | Body | Attachment | Replies / reposts | Margin note |
|---|---|---|---|---|---|---|
| 0 | Tove Lindqvist (Staff Product Designer · Northdesk) | 09:14 | "We deleted 40% of our components this quarter. The system got faster to use, not smaller. Notes on how we decided what to cut:" | bars: "Components per release, 2024–2026" | 12 / 4 | **Aiko Mori** and 2 others you follow replied |
| 1 | Halden (company) | 08:40 | "We're hiring a Principal Product Designer for the platform team. Amsterdam or remote in EMEA." | job: job-halden-principal | 6 / 9 | Matches your saved search **Principal · EMEA** |
| 2 | Kwame Asante (Senior Product Designer, Platform · Halden) | 08:02 | "Shipped: Halden's component library now builds from the same tokens in Figma and React. Here is the migration diff." | diff: "tokens.json → 3 platforms" | 18 / 7 | 2° · via **Aiko Mori** |
| 3 | Priya Raman (Lead Designer, Workflows · Sable) | Yesterday 18:21 | "Workflow builders fail at the edges: retries, partial approvals, people on holiday. A thread on designing for the unhappy path." | — | 31 / 11 | Your 1° · you worked together at **Sable** |
| 4 | Aurélien Duclos (Principal Designer, Editor · Oriel) | Yesterday 16:05 | "Oriel's editor kit is open source as of today. Selection, comments and presence, 40 components." | — | 44 / 23 | In your segment **Design leads · EMEA** |
| 5 | Felix Braun (Product Designer II · Tandem) | Yesterday 11:30 | "New icon set for Tandem: 212 glyphs on one 16px grid, square caps, no curves we didn't need." | bars: "Glyphs by category" | 5 / 1 | **Your team** |

The top of the margin reads `3 new since 09:14`.

### 13.12 Activity (`activity.ts`) and notifications

| Day | Time | Sentence (object names in 500) | Unread | Opens |
|---|---|---|---|---|
| Today · Mon 28 Sep | 11:52 | **Maren Aaltonen** viewed your job **Staff Designer, Canvas** | yes | people / maren-aaltonen |
| | 11:20 | **Kwame Asante** moved to **Interview** in Staff Designer, Canvas | yes | hiring / cand-kwame-asante |
| | 10:47 | **Tove Lindqvist** and 4 others replied to your post **Selection models are product strategy** | yes | home / post |
| | 10:05 | 2 people entered **Design leads · EMEA**: **Kwame Asante**, **Eleni Papadaki** | yes | people / kwame-asante |
| | 09:31 | **Halden** posted a job that matches **Principal · EMEA** | yes | jobs / job-halden-principal |
| | 09:14 | Your application to **Principal Product Designer, Platform** moved to **Screen** | yes | applications / app-halden-principal |
| | 08:02 | **Aiko Mori** mentioned you in **Token specs in practice** | no | home / post |
| Yesterday · Sun 27 Sep | 18:40 | **27 people** viewed your profile this week (+9) | no | profile |
| | 16:12 | Your brief **Icon audit** received 3 new proposals | no | projects |
| | 14:03 | **Oriel** scheduled your **Panel interview** for Thu 1 Oct | no | applications / app-oriel-head |
| | 11:30 | **Felix Braun** shared **Icon set v2** with your team | no | home / post |
| | 09:02 | Scorecard due tomorrow: **Kwame Asante** · Interview | no | hiring / cand-kwame-asante |

The notification drop (§10.2) shows the 6 unread rows above.

### 13.13 Saved (`saved.ts`), All saved (the first 12 of 64)

| Type | Title | Subtitle | Collection | Saved | Note |
|---|---|---|---|---|---|
| Person | Maren Aaltonen | Senior Product Designer · Plinth | Shortlist · Canvas | 26 Sep | Canvas shortlist, intro via Jonas |
| Job | Principal Product Designer, Platform | Halden · €130–150k | Jobs | 24 Sep | — |
| Person | Tove Lindqvist | Staff Product Designer · Northdesk | Shortlist · Canvas | 22 Sep | Ask about Q1 |
| Project | Design system audit and token migration | Brisa · €18–24k | Projects | 21 Sep | — |
| Company | Quanta Labs | Design infrastructure · Berlin | Companies to watch | 19 Sep | Token tooling |
| Post | We deleted 40% of our components | Tove Lindqvist | Reading | 18 Sep | — |
| Person | Aurélien Duclos | Principal Designer, Editor · Oriel | Shortlist · Canvas | 17 Sep | — |
| Job | Staff Designer, Multiplayer | Plinth · €120–140k | Jobs | 15 Sep | Benchmark comp |
| Company | Oriel | Editor tools · Paris | Companies to watch | 12 Sep | — |
| Post | Workflow builders fail at the edges | Priya Raman | Reading | 9 Sep | — |
| Project | Figma plugin for token linting | Quanta Labs · €18–26k | Projects | 7 Sep | — |
| Person | Eleni Papadaki | Principal Designer · Atlas Maps | Shortlist · Canvas | 3 Sep | — |

---

## 14. Acceptance checklist (1440 × 1024 screenshots)

Check each statement against `shots/people.png`. Items 28–30 use `people-hover.png`, `people-no-inspector.png` and `people-palette.png`, all produced by `node scripts/shot.mjs`.

1. The image is 1440 × 1024. No native scrollbar is visible anywhere, and nothing overflows horizontally.
2. Exactly two typefaces render: Instrument Sans and IBM Plex Mono. There is no serif, and no fallback-font or tofu glyph. `⌘`, `↵` and `→` are crisp SVG glyphs.
3. The rail spans x 0–56 in #121212 with icons only (no text labels): 9 section icons in 4 groups separated by three 8px ticks, then Settings and the `RK` monogram with a `T` badge at the bottom, and the sync dot in the rail foot.
4. The People rail item has a #221F1C 32 × 32 square and a 2 × 20 orange notch on x=56 at y 86–106. Applications shows `2` and Hiring shows `14`. No other rail item has a count or a dot.
5. There is no full-width top bar. The separators at x=56 and x=1040 run unbroken from y=0 to y=1024, except for the crumb-joint chevron at about y=20 on x=1040 and the seam at y 276–320.
6. The workspace cap shows `‹ ›`, then `People › Design leads · EMEA` (with `People` dimmer than the leaf), then `Share`, `Export` and the inspector toggle right-aligned near x=1028.
7. The inspector cap shows a chevron sitting on the x=1040 separator, then `Maren Aaltonen`, a mono `4/22`, and the ↑ ↓ × buttons.
8. The global zone (x 1328–1440) contains exactly two things: a 64 × 24 outlined trigger with a search glyph and visible `⌘` `K` key caps, and a bell with a 5 × 5 orange square. No search field anywhere is wider than 64px.
9. The segment strip reads `All people 1,284 · Design leads · EMEA 22 · Following 212 · Warm intros 17 · Open to contract 96 · +`. The selected tab is the brightest, with a 2px orange notch on the y=76 hairline spanning exactly its label and count.
10. The right end of the segment strip shows a 3-icon view switcher in one outline (Table active) and a `Display` button, and nothing else.
11. The query line shows a search glyph and then, on one line: five clauses with mono indices 1–5, then `— by fit`, then `+ Clause`. No bordered chip, pill or token appears anywhere on screen.
12. The column header reads `Person  Company  Fit ↓  Skills  Availability  Relation` in 11px sentence case. No all-caps UI label appears anywhere on screen (no `PERSON`, no mono-caps headings). Only acronyms such as `EMEA` and `UTC`, initials, and key-cap letters are uppercase.
13. Rows are 44px, and the first starts at y=144. There are no row dividers and no zebra striping. 19 full rows are visible. There is no index or number column.
14. Every row starts with a 28 × 28 square monogram (radius 4) on a muted tile. There are no circles and no photos.
15. All six columns show a line 1 and a line 2 value. Line-2 text is never dimmer than #8F877D. Tenure, UTC offsets, timing, the degree and the fit fraction are set in mono.
16. The Fit column shows 5 ticks, `n/5` and an evidence phrase. Rows 0–2 are `5/5` with all ticks near-white. Maren's row shows 4 filled ticks and 1 outlined. No percentage, bar or ring appears anywhere.
17. Availability uses ●, ◐, ○ and ■ in sage #7FA37A, ochre #C9A55A or gray only. No blue or violet appears anywhere.
18. Relation shows a mono degree (`1°`/`2°`/`3°`) or `Team`, with a word or count on line 2. There are no overlapping avatar stacks.
19. Row 3 (Maren Aaltonen) is filled #1C1B19 all the way to the inspector, with no separator line across y 276–320 except an orange 2 × 20 notch at x 1039–1040, y 288–308.
20. The orange census is exactly 5 marks: the rail notch, the segment notch, the tether notch, the bell square, and the `Request intro via Jonas` button. Only the button is an orange area.
21. The rail, caps and feet are #121212. The workspace body is #161514. The inspector body is #1C1B19. No panel has a border box, radius or shadow, and there are no gradients, glows or blur.
22. The inspector is 400 wide, with its content left edge at x=1060. From the top: a 56px monogram with `Maren Aaltonen` at 20px, a 2-line headline, and meta ending in a mono `14:32 UTC+2`; an availability line with ● and `11 Jan 2027`; the action row at y 200–232 (orange primary, Follow, Save, ⋯); and the target line `→ for Staff Designer, Canvas · Tandem`.
23. The inspector Fit block has the heading `Fit · Design leads · EMEA` with `4/5`, then five lines, each with a tick, index 1–5, the clause and right-aligned evidence. Line 5 is unmet and dimmer: `from 11 Jan 2027 · 15 wks`.
24. Below Fit: a 3-line bio in #BDB5AA; `Experience` with `11y`, a career strip, and 4 entries with years in a hanging column; `Selected work` with 2 schematic thumbnails of 170 × 96 and captions; and the `Skills` heading with at least its first row visible above y=996.
25. The largest text on screen is 20px (the inspector name).
26. The workspace foot shows `22 results · 3 match all 5 · 1 selected · …` at the left and key hints with key caps (`J` `K`, `↵`, `X`, `F`, `S`) at the right. The inspector foot shows `Updated 6d ago · 2 of 4 roles verified` and `↵ Full profile`. The hairline at y=996 spans the full width.
27. The largest visible radius is 4 (buttons, monograms, the ⌘K trigger). Panels and rows have radius 0.
28. **Hover** (`people-hover`, pointer on row 3): the Relation cell shows 3 icon buttons (follow, save, ⋯) in place of `2° / 3 mutual`, and the monogram shows a checkbox. The Availability cell remains fully visible.
29. **Inspector closed** (`?inspector=0`): the workspace runs to x=1440. Row 3 keeps its #1C1B19 fill. There is no orange tether notch and no stub at the right edge. The global zone is unchanged at x 1328–1440, and the cap's right cluster ends near x=1316. The Person and Fit columns are wider.
30. **Palette** (`?palette=1`): the address line becomes a sunken input at x 136–704. The results list hangs from y=40 with square top corners, 6px bottom corners, a 1px border, no shadow and no scrim. The first row is highlighted #221F1C, and the groups read `Suggested`, `Jump to`, `Recent people`.
