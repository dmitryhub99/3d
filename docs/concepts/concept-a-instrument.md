# Concept A: Instrument

STRIVO treated as a precision instrument for evaluating professionals.
Canvas 1440 x 1024. Every value below is at 1x on that canvas.

---

## 1. Thesis

**The frame is built from columns, and selection is drawn on the separators.** STRIVO has no top bar and no sidebar. The screen is a set of full-height columns (rail, workspace, inspector). Each column has the same three bands: a 40px **cap**, a scrolling **body** and a 28px **foot**. The cap hairline at y=40 and the foot hairline at y=996 run the full width, and the column separators run the full height. Together they form one fixed lattice, the **graticule**. No horizontal bar ever crosses a vertical separator. Every column owns its cap, which carries its context, and its foot, which carries its readout. The lattice is also the selection system. The current section, the current segment and the person bound to the inspector are marked by a 2px orange **notch** that sits *on the separator line itself*, not on the element. The rail notch sits on x=56. The segment notch sits on y=76. The **tether** notch sits on x=1040 at the selected row's height, so you can see which row the inspector is reading. If you remove the logo, what remains is a lattice of hairlines with orange notches that slide along them. No other product is built this way. The layout and the interaction logic both carry that signature.

---

## 2. Frame geometry (People state)

### 2.1 Regions

| Region | x | y | w × h | Surface | Notes |
|---|---|---|---|---|---|
| Rail cap | 0–56 | 0–40 | 56 × 40 | `frame` #121212 | STRIVO mark, centered |
| Rail body | 0–56 | 40–996 | 56 × 956 | `frame` #121212 | Nav groups (top), account (bottom) |
| Rail foot | 0–56 | 996–1024 | 56 × 28 | `frame` #121212 | Sync indicator |
| Separator R | x=56 | 0–1024 | 1px | `line-1` #242220 | Carries the rail notch. Drawn as the rail's inset right edge |
| Workspace cap | 56–1040 | 0–40 | 984 × 40 | `frame` #121212 | History, address line, contextual actions |
| Workspace body | 56–1040 | 40–996 | 984 × 956 | `surface` #161514 | Segment strip, query line, column header, rows |
| Workspace foot | 56–1040 | 996–1024 | 984 × 28 | `frame` #121212 | Result readout + key hints |
| Separator I | x=1040 | 0–1024 | 1px | `line-1` | Carries the tether notch. Resize handle (5px hit zone, x 1038–1043) |
| Inspector cap | 1040–1440 | 0–40 | 400 × 40 | `frame` #121212 | Object label, position, prev/next, close + global cluster |
| Inspector body | 1040–1440 | 40–996 | 400 × 956 | `raised` #191817 | Person anatomy, scrolls independently |
| Inspector foot | 1040–1440 | 996–1024 | 400 × 28 | `frame` #121212 | Provenance readout |
| Cap line | y=40 | 0–1440 | full width | `line-1` | The only full-width horizontal hairline (with the foot line) |
| Foot line | y=996 | 0–1440 | full width | `line-1` | |

**People has no section-local column.** Saved segments live in the segment strip inside the workspace body (§6.2). A section-local **channel** column (200px) exists as a mode feature for Saved and Profile. It takes its own cap, body and foot, so it obeys the same lattice (§5).

### 2.2 Workspace body sub-bands

| Band | y | h | Surface | Border |
|---|---|---|---|---|
| Segment strip | 40–76 | 36 | `surface` | Hairline `line-1` at y=76. The segment notch sits on it |
| Query line | 76–116 | 40 | `surface` | None below. Separated from the column header by spacing only |
| Column header | 116–144 | 28 | `surface` | Hairline `line-1` at y=144 |
| Rows | 144–996 | 852 | `surface` | Rows have no dividers. 44px rhythm, 19 rows visible (last one clipped by 16px) |

### 2.3 How regions meet

- The **frame** (all caps, all feet, the rail) is one continuous #121212 lattice. The **bodies** are inset plates: the workspace body at #161514 and the inspector body at #191817. The frame reads as the setting and the bodies read as the stones. Brightness goes up by one step in each direction: frame → work → context.
- Borders exist only on the lattice lines (x=56, x=1040, y=40, y=996) and at y=76 and y=144 inside the workspace. There is no border around any panel, no shadow on any panel, and no radius on any panel.
- **Registration marks.** Where a vertical separator crosses the cap line or the foot line (4 points: (56,40), (1040,40), (56,996), (1040,996)), a 9 × 9px cross is drawn in `line-2` #34302C with 1px arms, centered on the intersection. It is the only ornament in the product, and it is structural: it marks the lattice nodes.
- Caps never scroll. Bodies scroll under a 1px cap line. When a body is scrolled by more than 0px, the cap line switches from `line-1` to `line-2` (scroll-state indicator, no shadow).

### 2.4 ASCII wireframe, 1440 × 1024 (1 char ≈ 14.4px horizontal, ≈ 23px vertical)

```
0    56                                                                   1040                          1440
+----+--------------------------------------------------------------------+-----------------------------+
| /S |  < >  | People  >  Design leads · EU  [⌘K]           Share  [ ] ] | PERSON  004/038  ^ v  ↗  x |(•)|  y0
+----+--------------------------------------------------------------------+-----------------------------+  y40
| ⌂  | All people 1,284   Design leads · EU 38   Following 212   Warm ... | [MA]  Maren Aaltonen        |
|▐◉  |                    ======                         =  Tbl Cmp Gal  |       Senior Product Designer|  y76
| ▦  | ⌕ designer|  [role: Product Designer][seniority: Senior+]         |       — design systems, edi.. |
|    |              [skill: Design systems][tz: UTC−1…+3][avail: ≤ 6mo]  | Kiln · Berlin, DE · UTC+1   |
| ◫  | #   PERSON                 COMPANY    LOCATION  MATCH   SKILLS  .. | ● Open to roles · from Jan 27|  y144
| ▭  | 001 [AD] Aurélien Duclos   ◻ Oriel    Paris     ■■■■■■  Design s. | [Request intro via Jonas] F S|
|    |          Principal Design…   6y       UTC+1      6/6               |                             |
| ⇄  | 002 [TL] Tove Lindqvist    ◻ Northd.  Stockholm ■■■■■■  Prototyp. | Eleven years designing the  |
| ◎  |          Staff Product De…   3y       UTC+1      6/6               | tools other designers use…  |
|    | 003 [KA] Kwame Asante      ◻ Halden   Amsterdam ■■■■■□  Design s. |                             |
| ☆  |          Senior Product …    2y       UTC+1      5/6               | EXPERIENCE ————————— 11y 2m |
| ◌• |▒004 [MA] Maren Aaltonen    ◻ Kiln     Berlin    ■■■■■□  Design s.▒┃ ▬▬ ▬▬▬▬▬ ▬▬▬▬▬▬ ▬▬▬▬▬▬▬▬ |
|    |▒         Senior Product …    3y       UTC+1      5/6              ▒┃ 2014   2018    2022    2026 |
|    | 005 [PR] Priya Raman       ◻ Sable    London    ■■■■■□  Workflow  | 2022—  Senior Product Des.. |
|    |          Lead Designer, W…   4y       UTC+0      5/6               |        Kiln        3y 9m    |
|    | 006 [JW] Jonas Weber       ◻ Tandem   Munich    ■■■■□□  Design s. | 2019—22 Product Designer    |
|    |          Product Designer…   1y       UTC+1      4/6               |        Ledgerline  3y 2m    |
|    | 007 [SO] Sofia Oliveira    ◻ Parcel   Lisbon    ■■■■□□  Research  | 2016—19 Interaction Des.    |
|    |          Senior Designer,…   5y       UTC+0      4/6               | ...                         |
|    | 008 ...                                                            |                             |
|    | ...                                                                | SELECTED WORK ——————————— 2 |
|    |                                                                    | [thumb 168x104][thumb ...]  |
|    |                                                                    | SKILLS ————————— 4 match    |
|    |                                                                    | ▪ Design systems   41 ...   |
|    | ...                                                                | CONTEXT ———————————————— 3  |
| RK |                                                                    | Worked with Jonas Petersen… |
+----+--------------------------------------------------------------------+-----------------------------+  y996
| •  | 38 results · 1 selected · Match ↓ then Active    [↑↓] move [↵] open | Updated 6d · self + 2 verif.|
+----+--------------------------------------------------------------------+-----------------------------+  y1024
 ▐ = rail notch on x=56   ====== = segment notch on y=76   ┃ = tether notch on x=1040   ▒ = selected row
```

---

## 3. Global navigation (the rail)

**Rule:** the vertical axis is global and the caps are local. Everything that belongs to the whole product lives in the rail or at the fixed right edge of the top row. Nothing global sits inside a workspace cap, except the command trigger, which *is* the address line.

- **Width:** 56px, icon-only by default. Hit targets are 40 × 32px, centered at x=28. Icons are 16px.
- **Cap (y 0–40):** the STRIVO mark, a 16 × 16px glyph made of two 90° brackets offset by 2px to form an S. It echoes the notch. Color `text-2`, `text-1` on hover. Clicking it goes to Home.
- **Groups** (body starts at y=48). There are no group titles in collapsed mode. Groups are separated by a 12px gap with an 8px-wide `line-2` tick centered at x=28 in the middle of the gap.
  1. **Network:** Home (y 48–80), People (80–112), Companies (112–144)
  2. **Work:** Jobs (156–188), Projects (188–220)
  3. **Pipeline:** Applications (232–264), Hiring (264–296)
  4. **You:** Saved (308–340), Activity (340–372)
- **Icons** (hand-drawn, §8.6): Home = a 3-row stream glyph (three horizontal lines, the middle one shorter). People = two stacked squares offset (monogram stack). Companies = a 3 × 3 dot lattice with one filled cell. Jobs = a rectangle with a 1px tab. Projects = an open bracket pair `[ ]` with a centered dot. Applications = three ticks on a baseline (stages). Hiring = a funnel made of 3 descending horizontal lines. Saved = a notched rectangle (bookmark with a square notch, not a ribbon). Activity = a pulse line with 2 right angles.
- **States:**
  - Default: icon `text-3` #8A8279, no background.
  - Hover: icon `text-1`, background `hover` #1C1A18 on a 32 × 32 square with 4px radius. After 400ms a **label flag** appears. The flag is flush against the separator at x=57: 24px tall, padding 0 8, background `overlay` #201E1C, 1px `line-2` border on the top, right and bottom sides only (open toward the rail), radius 0 4 4 0. It shows the label in 12/500 `text-1` plus the shortcut in mono 11 `text-3`, for example "People   G P". Once one flag is visible, moving to another item swaps the flag instantly (0ms delay).
  - Selected: icon `text-1`, background `selected` #221F1C on the 32 × 32 square, plus the **rail notch**, a 2 × 20px `accent` #E07A3F bar straddling x=56 (x 55–57), vertically centered on the item.
- **Counts and badges:** there are no pills. A count is a mono 10/12 numeral in `text-2` placed at the item's lower right (x=42, baseline at item bottom − 6px). Applications shows "2" (status changes). Unread state for Activity is a 5 × 5px `accent` **square** at the icon's top right (offset +3, −3). Hiring shows "14" (new candidates) only while its pipeline has unreviewed items.
- **Account zone (bottom):** the account monogram is 28 × 28, radius 4, initials "RK" (Rhea Kovač, Design Director at Tandem, the viewer), at y 956–984. Above it, at y 916–948, is Settings (a gear drawn as an octagon with a center dot). Clicking the monogram opens a flag-style menu anchored at x=57, bottom-aligned to y=984, 240px wide. It holds a workspace switcher ("Personal", "Tandem · Hiring"), Profile (`G M`), Preferences, Keyboard shortcuts (`?`) and Sign out. The active workspace shows as a 2px `accent` notch on the menu's left edge.
- **Foot (y 996–1024):** a 6px sync dot centered: `ok` #7FA37A when synced, `text-4` hollow when offline. Tooltip: "Synced 12s ago".
- **Collapse behavior:** `[` toggles the **labeled rail**, which is 208px wide. The rail pushes the workspace (it does not overlay) and animates its width. In labeled mode, group titles appear in mono 10/12 uppercase `text-4` with 0.06em tracking ("NETWORK"), labels in 13/500, and shortcut hints right-aligned in mono 11 `text-4`. The rail notch still sits on the separator. The state is remembered per viewer. The rail never auto-expands on hover.
- **Keyboard:** `G H` Home, `G P` People, `G C` Companies, `G J` Jobs, `G R` Projects, `G A` Applications, `G I` Hiring, `G S` Saved, `G N` Activity, `G M` My profile. After `G` is pressed, every rail item shows its second letter as a mono 10 key cap at its lower left for 1.2s.

---

## 4. Top application context (the caps)

The "header" is the row of caps, 40px tall. It is split at x=56 and x=1040 by the separators and has no background difference from the rail.

**Workspace cap (x 56–1040), left to right:**
1. **History** (x 68–120): Back and Forward buttons, 24 × 24 each, 4px gap, 12px chevron icons in `text-3`. A button is disabled at `text-4`. Hovering shows the target location in a flag, for example "← People › All people". Long-press or right-click opens a history list of up to 10 entries. **History records selection:** Back restores the previous segment *and* the previous inspector subject.
2. A tick: 1px × 16px `line-1` at x=132.
3. **Address line** (x 144, up to 480px): the location path in 13/500. Ancestors are `text-3` and the leaf is `text-1`. The separator is a 10px chevron in `text-4` with 6px on each side. People state: `People › Design leads · EU`. **Breadcrumb rule:** show at most 3 levels, and only real containers (section › segment/collection › object). Never repeat the section name as a page title in the body. When the segment is **dirty** (query edited), the leaf gets a mono `•` in `accent` and "(edited)" in `text-3` 12/400.
   **The address line is the command trigger.** On hover it gains a 1px `line-2` outline (radius 4, padding 4 8) and shows a key cap `⌘K` at its right end. A click or `⌘K` turns the path into an editable query in place, and the palette hangs from the cap line (§9, §10).
4. **Right cluster** (right-aligned, 12px from x=1040):
   - Contextual actions for the section, as text buttons 24px tall in 12/500 `text-2` with padding 0 8: in People, **Share** and **Export**. They show "Compare (n)" in place of Export when 2–4 rows are checked.
   - A 1px × 16px tick.
   - **Inspector toggle** `]`, a 24 × 24 icon (panel glyph whose right third is filled when open). Tooltip "Inspector   ]".
- View controls (table/compact/gallery, sort, group, columns) are *not* in the cap. They belong to the list, so they live in the segment strip. The cap carries **where**. The body carries **how you look at it**.

**Inspector cap (x 1040–1440), left to right:**
- Object label in mono 10.5/14 500 uppercase `text-3` with 0.06em tracking: `PERSON`. Then position in mono 11 `text-4`: `004 / 038`.
- Right side: prev/next (`K`/`J` are mirrored as `↑`/`↓` buttons, 24 × 24), **Open full profile** `↗` (24 × 24, `↵`) and **Close** `×` (24 × 24, `Esc`).
- A 1px × 16px tick, then the **global cluster**.

**Global cluster, pinned to the right edge (x 1400–1428):** Notifications, a 24 × 24 bell drawn as a trapezoid with a 2px clapper line. Unread shows as a 5 × 5 `accent` square at top right. A click opens the notification drop, which hangs from the cap line flush with the window's right edge, is 360 wide, and has radius 0 0 0 6. **The cluster's x never changes.** It always sits in whichever cap is rightmost. When the inspector closes, the workspace cap grows to x=1440 and the cluster stays where it was.

---

## 5. Layout modes: the spatial grammar

Six compositions. Each is a rule for how the workspace body divides and whether the inspector participates.

| Mode | Structure inside the workspace | Inspector |
|---|---|---|
| **INDEX** | Dense sortable rows, full workspace width | Opens on selection (400) |
| **SPLIT** | Fixed list pane 400 plus a reading pane (the rest) | Off. The reading pane *is* the detail |
| **STREAM** | One measure column (560) plus a margin column (240) aligned to it | Opens on selection (400) |
| **MATRIX** | A hairline tile lattice with zero gaps. Tiles are divided by `line-1`, not carded | Opens on selection (400) |
| **BOARD** | Horizontal stage lanes (224 each) of 2px-radius slabs | Opens on selection (400) |
| **SHEET** | A channel column (200, its own cap and foot) plus a document measure (680) plus margin readouts | Off |

**Section mapping and composition sketches:**

- **Home / Feed: STREAM.** The measure column sits at x 56+120 to 736 (560 wide). The margin column runs x 784–1024 (240) and holds margin notes aligned to each post's first line: "Tove Lindqvist and 2 others you follow commented", or a mono readout "↑ 3 new since 09:14". Posts are separated by 32px space and a 1px `line-1` rule that starts at the measure's left edge. There are no cards.
- **People: INDEX + inspector.** 984 of rows at 44px, tethered to the 400 inspector (§6, §7).
- **Jobs: SPLIT.** The list pane runs x 56–456 with its own column header. Rows are 64px: title 13/500, company 12 `text-2`, and a mono line with comp, remote status and age. The reading pane runs x 456–1440 with the detail at a 640 measure. The tether notch sits on the list/reading separator at x=456. The inspector toggle is disabled, and the global cluster lives at the right of the reading pane cap.
- **Companies: MATRIX.** 4 × n tiles of 246 × 176 divided by hairlines. Each tile has a 32px company glyph, name 13/500, a mono readout grid (headcount, open roles, people you know) and a one-line thesis. Selecting a tile opens the inspector and reflows the lattice to 3 columns of 328.
- **Projects: MATRIX.** 3 × n tiles of 328 × 200. Each tile has a CSS-drawn brief thumbnail (a 3-bar scope diagram), title, and mono budget, duration and proposal count ("€18–24k · 8 wk · 11 proposals"). A filter strip identical to People's query line.
- **Applications: INDEX, grouped by stage.** Group headers are 28px mono uppercase with counts ("INTERVIEW · 2"). Rows are 44px. A **stage track** column shows 5 ticks (Applied → Screen → Interview → Offer → Closed), filled up to the current stage, the same component as the People match ticks.
- **Hiring: BOARD + inspector.** A requisition selector sits in the segment strip. Five lanes of 224 each (1120 total; the body scrolls horizontally when the inspector is open). The lane header sits in the column-header band at y 116–144. Candidate slabs are 56px (monogram, name, mono "5/6 · 2d in stage"). The inspector shows the candidate plus a scorecard section.
- **Saved: INDEX + channel.** A channel column (collections) of 200 at x 56–256 has its own cap ("Collections"), body and foot. The workspace INDEX then holds mixed object types. A mono type column ("PERSON", "JOB", "PROJECT") replaces Company.
- **Activity: STREAM with a time gutter.** Day headers are mono 10.5 uppercase ("TODAY · 28 SEP"). A 72px mono time gutter ("09:14") sits left of the measure. Unread items carry a 2px `accent` notch on the gutter's hairline.
- **Profile: SHEET.** The channel column (200) holds the TOC (Overview, Experience, Work, Writing, Skills, Recommendations). The TOC notch sits on the channel's right separator. The document measure is 680 at x 304–984. Identity uses 28/32 600, the only size above 20 in the product. The margin runs x 1032–1400 with mono readouts (profile views, response time, last active).

**What stays constant across modes:** the lattice (cap at 40, foot at 28, separators full-height, registration marks), rail and notch, the cap's left cluster (history + address line), the right-edge global cluster, the inspector's width, surface and anatomy order (identity → actions → narrative → evidence → context), selection = notch on a separator, row metrics (44/32 heights, 16px row padding), the key map (`J/K`, `↵`, `Esc`, `]`, `F`, `S`, `X`) and all typography.

**What changes:** how the workspace body divides (the 6 modes), which band of the body holds the controls (segment strip vs requisition selector vs channel), and whether the inspector exists (SPLIT and SHEET forbid it, because they already are the detail).

---

## 6. People workspace

### 6.1 Band layout
The segment strip (y 40–76), query line (76–116), column header (116–144) and rows (144+). Horizontal padding is 16px (content x 72–1024) unless a column spec says otherwise.

### 6.2 Segment strip (saved filters / segments), 36px
- Left: segment tabs. Label 13/500, count in mono 11 `text-3` with 6px gap, 20px between tabs. Unselected label `text-3`, hover `text-2`, selected `text-1`.
  `All people 1,284` · `Design leads · EU 38` (selected) · `Following 212` · `Warm intros 17` · `Open to contract 96` · then a `+` (16px icon, "New segment"). Overflow collapses into a `⋯ 3 more` menu.
- The **segment notch** is a 2px `accent` line lying *on* the y=76 hairline (y 75–77), as wide as the selected label and its count.
- Right: view controls, 24px tall:
  - **View switcher:** 3 icon buttons of 24 × 24 inside one 1px `line-1` outline, radius 4, with a 1px divider between them: Table (default), Compact, Gallery. The selected button gets a `selected` background and a `text-1` icon.
  - **Sort:** a text button `Match ↓` in 12/500 `text-2`, where the arrow is mono.
  - **Group:** `Group: None`.
  - **Columns:** a 24 × 24 icon (4 vertical bars).
  - 8px gaps. The segment's context menu is `⋯` on hover of the selected tab (Rename, Duplicate, Share with team, Subscribe to changes, Delete).

### 6.3 Query line (search + filters), 40px
- A single field with no box. A 14px search glyph at x=72 in `text-3`, then free text in 13/400 `text-1` ("designer"). Placeholder is `text-4`: "Search people, skills, companies…". Pressing `/` focuses it.
- Filter **tokens** follow inline and wrap to a second line if needed (the band then grows to 64px and everything below shifts, animated). Each token is 22px tall with radius 2, 1px `line-2` border and no fill. Key in mono 11 `text-3`, value in 12/500 `text-1`, separated by `: `. A `×` appears on hover only.
  `role: Product Designer` `seniority: Senior+` `skill: Design systems` `tz: UTC−1 … +3` `avail: ≤ 6 mo`
- `+ Filter` is a 12/500 `text-3` text button, key hint `F` only when the field is focused (otherwise `F` = Follow).
- Right end (when dirty): `Revert` in 12 `text-3` and `Save segment ⌘S` in 12/500 `text-1` with a mono key cap.

### 6.4 Column header, 28px
Labels are mono 10.5/14 500 uppercase in `text-4` with 0.06em tracking. The sorted column is `text-2` with a mono `↓`. Hovering a header shows `line-2` hairlines at its left and right edges (resize) and a `⋯` menu (Sort, Hide, Move).

### 6.5 Row anatomy (Table view, 44px). Column x positions relative to the workspace (0 = x 56)

| Col | x | w | Content and type |
|---|---|---|---|
| Index | 0–40 | 40 | Mono 11 `text-4`, right-aligned at x=32: `004`. On row hover or when any row is checked, it becomes a 14 × 14 checkbox (1px `line-2`, radius 2, a check drawn at 1.5 stroke) |
| Person | 40–300 | 260 | Monogram 28 × 28 radius 4 at x 44, then 10px gap, then two lines: **name** 13/18 500 `text-1`, **headline** 12/16 400 `text-3`, both truncated with an ellipsis |
| Company | 300–436 | 136 | 14 × 14 company glyph (1px `line-2` square with a 9px mono initial), 6px gap, name 12/16 400 `text-2`. Second line: tenure in mono 11 `text-4` `3y` |
| Location | 436–548 | 112 | City 12/16 `text-2`. Second line: mono 11 `text-4` `UTC+1` |
| Match | 548–640 | 92 | **Match ticks** plus mono 11 `5/6` (§6.6) |
| Skills | 640–800 | 160 | Up to 2 skills in 12/16, separated by ` · `. Skills that match the query are `text-1`, others `text-3`. Second line: mono 11 `text-4` `+6` |
| Availability | 800–896 | 96 | Status glyph (7px) + label 12/16 `text-2`. Second line: mono 11 `text-4` timing (`from Jan`) |
| Relation | 896–984 | 88 | Degree in mono 12 500 `text-2` (`2°`), 6px gap, up to 2 mutual monograms of 16 × 16 overlapping by 4px (1px `surface` ring), and mono 11 `text-4` `+1` |

Vertical rhythm: line 1 baseline at row top + 19, line 2 baseline at row top + 34. Every second line uses mono or `text-3/4`, so the eye reads the first line as the "header row" of each person.

**Sample rows (Design leads · EU, sorted by Match):**

| # | Person | Company | Location | Match | Skills | Availability | Rel |
|---|---|---|---|---|---|---|---|
| 001 | Aurélien Duclos · Principal Designer, Editor | Oriel · 6y | Paris · UTC+1 | 6/6 | Design systems · Prototyping | ● Open · from Dec | 2° ·5 |
| 002 | Tove Lindqvist · Staff Product Designer | Northdesk · 3y | Stockholm · UTC+1 | 6/6 | Design systems · Tooling | ◐ Exploring | 1° |
| 003 | Kwame Asante · Senior Product Designer, Platform | Halden · 2y | Amsterdam · UTC+1 | 5/6 | Design systems · Figma API | ◐ Exploring | 2° ·2 |
| **004** | **Maren Aaltonen · Senior Product Designer** | **Kiln · 3y** | **Berlin · UTC+1** | **5/6** | **Design systems · Editor UX** | **● Open · from Jan** | **2° ·3** |
| 005 | Priya Raman · Lead Designer, Workflows | Sable · 4y | London · UTC+0 | 5/6 | Workflow design · Systems | ○ Not looking | 1° |
| 006 | Jonas Weber · Product Designer II | Tandem · 1y | Munich · UTC+1 | 4/6 | Design systems · Motion | ◐ Exploring | Team |
| 007 | Sofia Oliveira · Senior Designer, Research Ops | Parcel · 5y | Lisbon · UTC+0 | 4/6 | Research · Service design | ● Open · now | 3° |
| 008 | Mateusz Król · Senior UX Engineer | Ledgerline · 2y | Warsaw · UTC+1 | 4/6 | Prototyping · React | ● Freelance | 2° ·1 |

### 6.6 How professional relevance is shown: Match ticks
There is no opaque percentage and no progress bar. Relevance is **evidence**. Each tick is one active criterion, in the **same order as the query tokens** (keyword, role, seniority, skill, tz, avail). A tick is 8 × 10px with 2px gaps (6 ticks = 58px). Satisfied ticks are filled `text-2` #BDB5AA; on a 6/6 row they are filled `text-1`. Unsatisfied ticks are a 1px `line-2` outline. Then mono 11 `text-3` `5/6`, 6px after.
Hovering a tick highlights the matching query token: its border becomes `text-2` and a flag shows "tz: UTC−1…+3 · ✕ Berlin is UTC+1 in winter, +2 in summer — matched" or "avail ✕ from Mar 2027". The structure and the query are the same object seen twice. This is why the device is justified.

### 6.7 Availability and status
The shape encodes the status and the color reinforces it, so it reads in grayscale:
- `●` filled 7px circle, `ok` #7FA37A: **Open** (label + mono timing)
- `◐` half-filled, `warn` #C9A55A: **Exploring**
- `○` 1px ring, `text-4`: **Not looking**
- `■` filled 7px square, `ok`: **Freelance / available for projects**
- The "Team" relation label means the person is in the viewer's company (a mono 11 badge-less label in `text-3`).

### 6.8 Relationship and context
Degree (`1°`, `2°`, `3°`, `Team`) comes first, because it decides the action (message vs intro). Mutual monograms come second. Richer context (worked together, viewed your job) is kept for the inspector's CONTEXT section, so the row stays a scannable ledger.

### 6.9 Selection, hover, multi-select
- **Hover:** row background `hover` #1C1A18, applied instantly. Hover actions appear at the right, x 880–976 relative, over the Relation and Availability columns: a solid `hover` background panel with a 16px left fade *in the same color* (no gradient to a different color). Three 24 × 24 icon buttons: Follow (a person glyph with a `+` tick), Save (the notched rectangle) and `⋯` (context menu, same as right-click). Each has a tooltip with its key (`F`, `S`, `.`).
- **Selected (bound to the inspector):** background `selected` #221F1C, name stays `text-1`, headline lifts to `text-2`. The **tether notch** is a 2 × 44px `accent` bar straddling x=1040 at the row's y (y 276–320 for row 004 in the default scroll). If the selected row scrolls out of view, the notch pins to the top or bottom of the body (y 144 or y 994) as a 2 × 8px stub, and clicking it scrolls the row back.
- **Focus (keyboard cursor, not yet opened):** a 1px `line-2` inset outline on the row. `J/K` move focus. With the inspector open, focus *is* selection (the inspector follows). `Space` peeks the inspector without committing history.
- **Checked (multi-select):** the index cell shows a filled checkbox (`text-1` fill, `canvas` check). The row background is `hover`. A foot readout counts them. The cap shows "Compare (2)".

### 6.10 Keyboard
`/` search · `J/K` or `↑/↓` move · `↵` open full profile · `Space` peek inspector · `Esc` close inspector, then clear focus · `X` check · `⇧J/K` extend check · `F` follow · `S` save · `M` message/intro · `.` context menu · `1/2/3` view (Table/Compact/Gallery) · `⌘S` save segment · `⌥1…9` jump to segment.

### 6.11 Other views
- **Compact:** 32px single-line rows. The person column shows name only (headline dropped), and the second-line data moves to a tooltip.
- **Gallery:** a MATRIX of 3 columns × 328 tiles. Each has a 328 × 184 work thumbnail (CSS/SVG), then the identity row. It is for portfolio-first evaluation.

### 6.12 Empty and loading
- **Loading:** rows render as skeleton *ledger lines* at exact column positions: 1px-tall `line-2` bars at each text baseline, 40–70% of the column width, with no shimmer. A mono `text-4` "Querying 1,284 profiles…" sits in the foot. If the query takes more than 600ms, the first 12 rows fade in (§9).
- **No results:** the column header stays. At y=200, x=72: "No one matches all 6 criteria." in 13/500 `text-1`, then in 12 `text-3` the nearest relaxations as clickable lines: "Drop `avail: ≤ 6 mo` → 61 people", "Widen `tz` to ±4 → 52 people". There is no illustration.
- **No segment yet:** the segment strip shows only `All people`, plus a `text-3` hint "Refine a query and press ⌘S to keep it."

---

## 7. Person inspector

The inspector is 400 wide with 20px padding, so content runs x 1060–1420. The surface is `raised` #191817. The body scrolls. When scrolled more than 96px, a **condensed identity bar** (40px: 24px monogram, name 13/500, availability glyph and the primary button in compact form) pins to the top of the body.

### 7.1 Anatomy, top to bottom (example: Maren Aaltonen)

1. **Identity** (y 60–146)
   - Monogram 56 × 56, radius 4, at (1060, 60). Initials "MA" in 20/600 `text-1`. Background is the person's hue tile #2C2A33 with a 1px `line-2` inner edge. A 4 × 4 `ok` square at bottom-right indicates Open.
   - At x=1128: **Maren Aaltonen** in 20/24 600 `text-1`, −0.01em.
   - Headline in 13/18 400 `text-2`, 2 lines max: "Senior Product Designer — design systems, editor tooling and multiplayer UX".
   - Meta line in mono 11/16 `text-3`: `Kiln · Berlin, DE · UTC+1 · active 3h`.
2. **Availability** (y 158–174): `●` `ok`, then in 12/16 `text-2` "Open to roles from Jan 2027 · full-time or contract · hybrid Berlin / remote EU".
3. **Actions** (y 190–222, 32px tall):
   - **Primary:** `Request intro via Jonas`, 196px, radius 4, `accent` #E07A3F fill, text 13/500 #1A120C. It is the only orange fill on the screen. Key `M`. It becomes "Message" for 1° connections.
   - `Follow`: 76px, 1px `line-2` border, text 13/500 `text-1` with a glyph. Once following it reads `Following` in `text-2` with a check glyph.
   - `Save`: 32 × 32 icon button, border `line-2`. When saved, the notched-rectangle glyph fills with `text-1`.
   - `⋯`: 32 × 32 (Add to list, Add to requisition…, Copy link, Hide from results, Report).
   - 8px gaps, 360px total.
4. **Bio** (y 238–298), 13/20 400 `text-2`, 3 lines:
   "Eleven years designing the tools other designers use. At Kiln I lead the design system and the editor's selection and multiplayer model; before that, payments tooling at Ledgerline. I like hard constraints, dense UIs and writing the spec before the mockup."
5. **EXPERIENCE** section (heading at y 322). Headings are mono 10.5/14 500 uppercase `text-4` with 0.06em tracking, followed by a 1px `line-1` rule that runs to x=1420 and ends in a right-aligned mono 11 `text-3` readout: `11y 2m`.
   - **Career strip** (y 346–352): a 360px axis from 2014 to 2026, 6px tall. Segments sit end to end with 2px gaps. Past roles are `text-4` #5E5852 and the current one is `text-2`. Tick labels in mono 10 `text-4` at 2014, 2018, 2022 and 2026 (y 356–370). It shows tenure pattern at a glance.
   - **Entries** (from y 384, 40px each). Years in mono 11 `text-3` at x 1060 (64px column). Role 13/18 500 `text-1`, with company in 12/16 `text-2` beneath. Duration in mono 11 `text-4`, right-aligned.

     | Years | Role | Company | Duration |
     |---|---|---|---|
     | 2022— | Senior Product Designer | Kiln (collaborative canvas) | 3y 9m |
     | 2019—22 | Product Designer, Console | Ledgerline (payments infra) | 3y 2m |
     | 2016—19 | Interaction Designer | Forma Studio, Helsinki | 2y 11m |
     | 2014—16 | UX Designer (junior) | Rautatie Digital | 1y 6m |
6. **SELECTED WORK** (heading at y 568, readout `2`). Two tiles of 168 × 104 with a 24px gap. Each thumbnail is `sunken` #0F0F0E with a 1px `line-1` border and radius 2. It is drawn in SVG:
   - *Kiln Canvas 3 — selection model* (2024): three overlapping 1px rectangles in `text-4`, one of them selected with `text-2` stroke and four 4px square handles, plus a marquee in dashed `line-2`.
   - *Ledgerline Console — disputes flow* (2021): 5 stepped nodes (8px squares) joined by right-angle connectors, with the 4th node filled `text-2`.
   Caption under each: title in 12/16 500 `text-1`, then mono 11 `text-4` `2024 · case study · 8 min`.
7. **SKILLS** (heading at y 756, readout `4 of 6 match`). Two columns of 176 with an 8px gap, 24px rows. Skill name in 12/16. Matched skills are `text-1` and prefixed with a 4 × 4 `text-1` square; the others are `text-2` with no prefix. Endorsement counts are right-aligned in mono 11 `text-4`.
   - ▪ Design systems `41` · ▪ Editor / canvas UX `27`
   - ▪ Prototyping (code) `22` · ▪ Interaction design `19`
   - Multiplayer UX `14` · Design tokens `12`
   - Figma plugin API `9` · Accessibility `7`
8. **CONTEXT** (heading at y 900, readout `3`). Each line is 12/20 `text-2` behind a 12px glyph in `text-3`, with names in `text-1`:
   - ⇄ Worked with **Jonas Petersen** at Ledgerline, 2019–21 (Jonas is your 1°)
   - ◫ 3 mutual: **Jonas Petersen**, **Aiko Mori**, **Tomás Rey**
   - ◎ Viewed your job *Staff Designer, Canvas* · mono `2d ago`
   - (below the fold) ☆ Saved by 2 people on your team · Follows *Editor Tools Guild*
9. (below the fold) **RECOMMENDATIONS** (2) and **ACTIVITY** (recent posts), following the same section grammar.

**Inspector foot (28px):** mono 11 `text-4` reading `Profile updated 6d ago · self-reported + 2 verified roles`. At the right is a `?` explaining verification.

### 7.2 Resize handle
Separator I (x=1040) has a 5px hit zone. On hover (after 150ms) the 1px line changes to `line-2` over its full height, and a **grip** appears at the body's vertical center: a 2 × 20px pill of 3 `text-3` 2px dots. The cursor is `col-resize`. While dragging, the inspector cap shows the width live in mono 11 `text-2` (`400 → 452`), replacing the position readout. Snap points are 360, 400, 480 and 560 (a 6px snap zone). Double-click resets to 400. The minimum is 360; the maximum is 560, or less if the workspace would drop below 720. The width is remembered per section.

### 7.3 Close behavior
- `×`, `Esc` or `]` close the inspector. So does clicking the already-selected row.
- Closing keeps the **selection**: the row keeps its `selected` background, and the tether notch becomes a 2 × 44px `line-2` stub at x=1439 (the right edge), so reopening with `]` restores the same person.
- The workspace cap grows to 1440. The global cluster stays in place (§4).
- The inspector never opens automatically on hover. It opens on click, `Space` or `↵` with the inspector on. `↵` again goes to the full Profile (SHEET).

---

## 8. Tokens

### 8.1 Color
| Token | Hex | Use |
|---|---|---|
| `frame` | #121212 | Rail, all caps, all feet. The canvas |
| `surface` | #161514 | Workspace body |
| `raised` | #191817 | Inspector body, channel column body |
| `hover` | #1C1A18 | Row and icon hover |
| `selected` | #221F1C | Selected row, selected nav square, selected view button |
| `overlay` | #201E1C | Flags, menus, palette, notification drop |
| `sunken` | #0F0F0E | Work thumbnails, text inputs when focused, key caps |
| `line-1` | #242220 | Lattice and hairlines (default border) |
| `line-2` | #34302C | Strong: tokens, buttons, hover-revealed separators, registration marks, focus outline |
| `text-1` | #ECE6DC | Primary: names, values, selected labels |
| `text-2` | #BDB5AA | Secondary: headlines in the inspector, company, body copy |
| `text-3` | #8A8279 | Tertiary: row headlines, default icons, labels |
| `text-4` | #5E5852 | Quaternary: indices, column headers, mono metadata, disabled |
| `accent` | #E07A3F | Notches, primary fill, unread square |
| `accent-text` | #EE9460 | Orange as text (the dirty-state `•` only) |
| `accent-wash` | #2A1C14 | Pressed state of the primary button's surroundings only. Never a row background |
| `ok` | #7FA37A | Open / available / synced |
| `warn` | #C9A55A | Exploring |
| `err` | #C0675C | Errors and failed sync only |
| Monogram hues | #2C2A33, #2A302C, #332B27, #2B2E33, #31292E, #2E2F28 | Person tiles (initials `text-2`, `text-1` in the inspector) |

**Accent rules:** orange appears in exactly four roles: the **notches** (rail, segment, tether, TOC/gutter), **one primary action fill per screen**, the **unread square**, and the **dirty `•`**. It never appears as text links, icon color, chart fill, focus ring or hover.

### 8.2 Type families
- **Instrument Sans Variable** (`@fontsource-variable/instrument-sans`, import `standard.css` for wght 400–700 plus wdth 75–100). This is the primary UI face. Its narrow apertures and flat terminals read like a technical label face without being mono. Use wdth 100 everywhere, except **wdth 90** for the labeled-rail item labels (208px mode), so long labels like "Applications" plus their key hints fit. Features: `"ss01"` off, `"tnum"` on for any numerals in sans.
- **IBM Plex Mono** (`@fontsource/ibm-plex-mono`, weights 400 and 500). This is the metadata voice: indices, counts, time zones, tenure, dates, key caps, section readouts, object labels.

### 8.3 Type scale (every size used)
| Size/LH | Family, weight | Role |
|---|---|---|
| 10/12 | Mono 500 | Rail counts, key hints under rail items, axis ticks |
| 10.5/14 | Mono 500 uppercase, +0.06em | Column headers, section headings, object label `PERSON`, group titles |
| 11/16 | Mono 400 | Metadata: tz, tenure, index, timing, readouts, key caps (11/14 inside a 16px cap) |
| 12/16 | Sans 400/500 | Row second lines, skills, availability, buttons (500), tokens' values (500) |
| 12/20 | Sans 400 | Inspector context lines |
| 13/18 | Sans 400/500 | Base UI: row names (500), address line (500), tabs (500), inspector role titles (500), query text |
| 13/20 | Sans 400 | Inspector bio and long-form reading in 400-wide contexts |
| 15/24 | Sans 400 | Reading pane body in SPLIT (Jobs) and SHEET (Profile) |
| 20/24 | Sans 600, −0.01em | Inspector name, Jobs detail title |
| 28/32 | Sans 600, −0.015em | Profile identity name (SHEET only) |

### 8.4 Spacing
A 4px base. The scale is **2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48**. Standard gutters: workspace 16, inspector 20, section gap 24, group gap 12. Every region edge sits on an 8px grid (56, 1040, 40, 996 and so on) except the 28px foot, which absorbs the remainder: 1024 = 40 + 956 + 28.

### 8.5 Radii
Panels are 0. Tokens, checkboxes, key caps and thumbnails are 2. Buttons, inputs, monograms, the nav square and the view-switcher outline are 4. Menus, palette and drops are 6, and hanging surfaces keep a square edge on the side attached to a lattice line. Nothing is fully round except status dots.

### 8.6 Icons
Icons are hand-drawn inline SVG on a 16 × 16 grid with a 1.5px live area inset. The stroke is 1.5px `currentColor`, with **square caps and miter joins**, and coordinates snapped to .75 so strokes render crisp at 1x. Shapes are orthogonal first: rectangles, right angles and ticks. Diagonals are allowed only for chevrons and arrows at 45°. There are no filled shapes except a 2 × 2 "active pixel" used for selected states (for example Saved filled) and status glyphs. Small icons (chevrons in the address line, section glyphs) are 12 × 12 with a 1.25 stroke. Icon color is `text-3` by default, `text-1` on hover or selected, and never `accent`.

### 8.7 Row heights and control sizes
Table rows 44. Compact rows 32. Board slabs 56. Jobs list rows 64. Column header 28. Segment strip 36. Query line 40 (64 when wrapped). Caps 40. Feet 28. Buttons 24 (toolbar) and 32 (inspector actions). Tokens 22. Key caps 16 tall, min 16 wide, mono 10/500 `text-3` on `sunken` with a 1px `line-2` border, radius 2.

---

## 9. Motion grammar (motion/react)

**Restraint rules:** nothing bounces (every spring is critically damped or overdamped). Nothing scales more than 2%. No duration exceeds 240ms. Content never slides more than 8px. The lattice itself never animates (lines don't fade or draw). Notches, panel widths and content move. `prefers-reduced-motion`: every transform becomes a 0ms change and opacity fades are capped at 80ms.

Shared definitions:
- `snap = { type: "spring", stiffness: 700, damping: 56, mass: 0.6 }`: notches (a crisp ~150ms settle with no overshoot)
- `panel = { type: "spring", stiffness: 420, damping: 44, mass: 1 }`: widths (~240ms)
- `out = [0.16, 1, 0.3, 1]` (expo-out) for entrances, and `in = [0.5, 0, 0.75, 0]` for exits

| Interaction | Spec |
|---|---|
| **Inspector open** | The grid track animates 0 → 400 with `panel`. Inspector content starts at `opacity 0, x 8` and reaches `1, 0` over 180ms `out` with a 60ms delay. The workspace columns reflow via `layout` (Skills compresses first). The tether notch appears with `scaleY 0 → 1` from the row's center, 120ms `out` |
| **Inspector close** | Content fades to 0 over 90ms `in`, then the track goes 400 → 0 with `panel`. The notch travels with `layoutId="tether"` to the right-edge stub |
| **Selection change** | The tether notch uses `layoutId="tether"` with `snap` and slides along x=1040. Inspector content crossfades: out 70ms, in 120ms, `y 4 → 0`. The monogram and name swap in the same crossfade. The inspector frame does not move. Holding `J` with auto-repeat skips the crossfade (it updates instantly past 8 changes/sec) |
| **Row hover** | Background changes instantly on enter and fades over 120ms linear on leave. Hover actions reach `opacity 0 → 1` in 80ms with no movement |
| **Nav selection** | The rail notch uses `layoutId="rail-notch"` with `snap` and slides along x=56. The selected square's background crossfades over 100ms. The hover flag reaches `opacity 0 → 1, x −4 → 0` in 100ms `out` |
| **Segment change** | The segment notch uses `layoutId="segment-notch"` with `snap` along y=76. Rows use list re-entry (below) |
| **Section switch** | Workspace body: outgoing `opacity → 0` in 80ms, then incoming `opacity 0 → 1, y 6 → 0` in 160ms `out`. Mode geometry (split pane, channel column, inspector width) animates with `panel` at the same time. The address line leaf swaps like an odometer: old `y 0 → −8, opacity → 0` and new `y 8 → 0` in 140ms `out`. Caps and rail do not move |
| **Command palette** | Hangs from y=40 below the address line. Open: `opacity 0 → 1, y −4 → 0, scaleY 0.98 → 1` with origin top, 140ms `out`. Close: 90ms `in`. The result highlight is a `selected` background using `layoutId="cmd-hl"` with `snap` |
| **List entrance** | First paint: none (the product opens already there). Query or segment change: rows fade `opacity 0 → 1, y 4 → 0`, 120ms `out`, staggered 12ms across the first 12 visible rows only; the rest appear together. A sort-only change moves rows with `layout` position at 180ms `out` and no fade |
| **Filter token add/remove** | Width animates via `layout` with `snap`. A wrap to 2 lines animates the band height 40 → 64 with `panel` |
| **Resize drag** | Follows the pointer 1:1. On release it snaps to the nearest snap point with `snap` |

---

## 10. Mature details and where they live

| Detail | Location |
|---|---|
| **Registration marks** (9px crosses at lattice nodes) | (56,40), (1040,40), (56,996), (1040,996). Move with the separators |
| **Rail label flags** with shortcut | Flush at x=57 beside the hovered rail item |
| **`G`-chord key hints** | Mono key caps at the lower left of each rail item while `G` is held |
| **Address line = command trigger** | Workspace cap x 144+. `⌘K` cap appears on hover |
| **Command palette** | Hangs from y=40 at x=144, 560 wide, max 440 tall, `overlay`, radius 0 0 6 6. The input is the address line edited in place. Results are 32px rows with a mono type label on the right (`PERSON`, `JOB`, `SEGMENT`, `ACTION`) and a shortcut key cap. Groups: Jump to, People, Jobs, Actions. `⌘↵` opens a result in the inspector without leaving the current location |
| **Back/forward with selection history** | Workspace cap x 68–120. Long-press shows a history list |
| **Dirty segment `•`** | After the address line leaf, plus Revert and Save at the query line's right |
| **Saved views / segments** | Segment strip tabs with mono counts. `⋯` on the selected tab for segment management. "Subscribe to changes" adds a mono `+3` delta to the tab when new people enter the segment |
| **View switcher** | Segment strip right: Table / Compact / Gallery, keys `1/2/3` |
| **Context menu triggers** | Row `⋯` on hover (x 952–976 relative), right-click anywhere on the row, column header `⋯` on hover, segment tab `⋯`, inspector action `⋯`, section heading chevron (collapse) on hover in the inspector |
| **Hover actions** | Right end of the row, over the Availability and Relation columns |
| **Persistent selection** | The row keeps its `selected` background with the inspector closed, and the notch parks at the right edge. Selection is stored in history and in the URL (`/people/design-leads-eu?p=maren-aaltonen`) |
| **Resizable panel indication** | The separator brightens to `line-2`, a 3-dot grip appears at mid-height, and the live width readout shows in the inspector cap |
| **Column resize** | Column header hairlines are revealed on hover. Widths are remembered per segment |
| **Scroll-state indicator** | The cap line changes from `line-1` to `line-2` when the body under it is scrolled (per column) |
| **Result readout** | Workspace foot left, mono 11 `text-3`: `38 results · 1 selected · Match ↓ then Active · updated 2m ago` |
| **Key hint strip** | Workspace foot right: key caps plus 11 `text-4` labels: `↑↓ move  ↵ open  X select  F follow  S save  ⌘K command`. It is context-aware: with rows checked it becomes `M message 3  E export  Esc clear` |
| **Sync status** | Rail foot dot |
| **Provenance** | Inspector foot: "Profile updated 6d ago · self-reported + 2 verified roles" |
| **Unread** | A 5px `accent` square at the Activity rail item and the bell. Never a number pill |
| **Off-screen selection stub** | A 2 × 8 notch pinned to the top or bottom of Separator I when the selected row is out of view |
| **Empty-state relaxations** | Rows area: clickable "drop this filter → n people" lines |
| **Keyboard sheet** | `?` opens the keyboard sheet: a SHEET-style overlay with the channel column listing key groups |

---

## 11. Anti-generic audit

| Risk | Where it could slip | How this spec prevents it |
|---|---|---|
| **LinkedIn clone** | Person rows with round photos, a blue "Connect" button, "3rd+" chips, a feed of cards | Monograms are **square** with muted hue tiles. There are no photos. The relation is a mono degree number, not a chip. The primary action is contextual ("Request intro via Jonas", derived from real graph data) and is the only orange on screen. The feed is a STREAM with margin notes, not cards |
| **shadcn demo** | Rounded bordered cards, pill badges, a 240px sidebar, a Tabs component, a gray-on-white-ish zinc palette, 8px radius everywhere | Panels have zero radius, the maximum radius is 6, and there are no pills anywhere (tokens are 2px-radius rectangles). The rail is 56px with flags. Tabs are text plus a notch on a hairline, not boxed segments. The palette is warm (#121212 → #ECE6DC), not zinc |
| **AI dashboard** | "Match 92%" gradient bars, sparkle icons, glowing accents, KPI tiles on top | Relevance is **evidence ticks** tied one-to-one to the query tokens, with no percentage. There is no KPI row, and counts live in mono readouts in the feet. There are no gradients, glows or sparkles. Orange is limited to four enumerated roles |
| **Generic SaaS shell** ("sidebar + topbar + cards") | A full-width topbar with a centered search, the logo in a sidebar header, the account in the top right | There is no topbar. **Caps** belong to their columns, the lattice is split at every separator, and the global cluster is pinned to the right edge. Command access *is* the address line. The account sits at the bottom of the rail |
| **Admin template / data grid** | Zebra stripes, row borders, checkbox columns always on, heavy table header | There are no row dividers or zebra striping. The index column turns into a checkbox only on intent. The table header is a quiet mono line. Two-line rows give each person a readable identity block before the metrics |
| **Dribbble dashboard** | Oversized hero type, decorative illustrations, floating glass inspector | The largest type is 20px (28px only on the Profile SHEET). Thumbnails are schematic SVG in `sunken` wells. The inspector is a flush column in the lattice with no shadow, no float and no blur |
| **Replace-the-logo test** | Anything that relies on the mark or the color alone | The identity lives in the **graticule** (cap/body/foot per column, full-length hairlines, registration marks), the **notch-on-separator** selection grammar (rail, segment, tether, TOC, gutter), the **tether** binding a row to the inspector, the **address line as command line**, and **evidence ticks** that mirror the query. Removing the name leaves all of these structural signatures in place |
