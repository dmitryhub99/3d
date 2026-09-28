# Concept B: Editorial Desk

STRIVO desktop shell. Canvas 1440 × 1024. Dark only. Every value here is final. There are no alternatives.

---

## 1. Thesis

STRIVO sets every surface in two columns: a **margin** and a **measure**. The margin is a narrow column that runs down the left side of every working surface. It holds the page's apparatus: result counts, group labels, network degree, section labels in the dossier, and years in a career record. The measure holds the content itself. When you select something, it **opens into the next plane**. The selected navigation item joins the sheet. The selected result row joins the dossier through a break in the column rule, so the two read as one continuous shape. Three typographic rules sit on top of that grid:

- Proper nouns (people, companies, roles, projects) are set in a serif.
- Figures are set in mono.
- Everything else is set in a grotesk.

Replace the logo and the product is still recognizable. The hanging margin, the fused selection tab, the filters written as a sentence, and the serif proper nouns are all structural decisions, not decoration.

---

## 2. Frame geometry (People state)

### Surface model: desk and sheet
- **Desk** (`--desk` #121212) is the application frame. The **rail** and the **folio bar** (the top header) sit directly on the desk. They have no fill of their own and no borders.
- **Sheet** (`--sheet` #191817) is the single raised working plane. It is flush to the right and bottom edges of the window. Only its top-left corner is rounded, at **10px**, like a sheet of paper tucked under the rail and header. It has a 1px `--rule` (#2A2724) border on its **top and left edges only**.
- **Dossier** (`--leaf` #1F1D1B) is the inspector. It is a second leaf that lies on the right of the sheet. A 1px vertical **column rule** separates it from the work surface. That rule is the only vertical line inside the sheet.

### Regions (x, y in canvas px)

| Region | x | y | w × h | Surface | Borders |
|---|---|---|---|---|---|
| Rail | 0–64 | 0–1024 | 64 × 1024 | desk | none |
| Folio bar (app header) | 64–1440 | 0–44 | 1376 × 44 | desk | none |
| Sheet | 64–1440 | 44–1024 | 1376 × 980 | sheet | top + left 1px `--rule`, top-left radius 10 |
| Work surface | 64–1047 | 44–1024 | 983 × 980 | sheet | — |
| ↳ Margin | 64–176 | | 112 wide | sheet | none |
| ↳ Measure | 176–1023 | | 847 wide | sheet | none |
| ↳ Right gutter | 1023–1047 | | 24 wide | sheet | none |
| Column rule / resize handle | 1047–1048 | 44–1024 | 1 × 980 | `--rule` | broken at the selected row (see "The Tab") |
| Dossier (inspector) | 1048–1440 | 44–1024 | 392 × 980 | leaf | none |
| ↳ Dossier label column | 1072–1136 | | 64 wide | | |
| ↳ Dossier content | 1148–1416 | | 268 wide | | |

People has **no section-local column**. Saved segments sit in the title line and filters sit in the query sentence. The margin does the work a sidebar would do.

### Work-surface vertical stack

| Band | y | h | Notes |
|---|---|---|---|
| Title line | 44–100 | 56 | Title, segment tabs, result count in the margin |
| Query sentence | 100–144 | 44 | Search, filters and sort as one sentence |
| Column heads | 144–172 | 28 | 1px `--rule` at y=172 from x 84 to 1023 (margin + measure) |
| List | 172–996 | 824 | 56px rows; about 14.3 rows visible |
| Colophon | 996–1024 | 28 | 1px `--rule` at y=996 across x 64–1047 |

### The Tab (signature selection)
The selected row's fill (`--leaf` #1F1D1B) runs from x=168 all the way to x=1048. At the row's y-range, the column rule has a gap the height of the row. The row and the dossier become one continuous leaf-colored shape. The row's left corners are rounded at 6px. Its right side has no corner and no line where it meets the dossier. A 2 × 24px `--accent` mark sits at x 170–172, vertically centred in the row: it is the only orange in the work surface.

### ASCII wireframe (1440 × 1024, not to scale)

Key: `:` is the margin/measure alignment line, not a drawn border. `░` is the rail tab fused into the sheet. The row at y292 is the Tab: the column rule is absent there.

```
x:0    64        176                                                                   1047                                 1440
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  y0
│ ◼      ‹ ›  People / Design leads, EU  ○ edited            Share [≡|▦] ⚙                 [⌕ Search people, jobs…   ⌘K]  •  +│  folio bar (desk)
│      ╭─────────────────────────────────────────────────────────────────────────────────┬────────────────────────────────────┤  y44  sheet edge
│ ⌂    │       38 : People   Everyone   Shortlist 12   Design leads, EU 38   +           │ 3 / 214   ˄ ˅              ↗  ⋯  ✕ │  title line
│ ──   │          :                                                                      │                                    │  y84
│ ░◉░░ ░        ⌕ : Showing 38 product designers, senior or above, in Europe,            │ [MS]  Maren Solberg  2°            │  y100 query sentence; rail tab fused
│  ▢   │          : open to offers, with design systems — by fit                         │      Staff product designer —      │
│  ⬚   │───────── ┼──────────────────────────────────────────────────────────────────────│      design systems and dense fin… │  y144
│  ◇   │          : PERSON          COMPANY·PLACE  FIT              AVAIL     CONTEXT    │      Kestrel · Berlin · 16:42 CET  │
│ ──   │───────── ┼──────────────────────────────────────────────────────────────────────│      ● Open to principal roles     │  y172
│  ⇄²  │  5/5   1°: [JH] Jonas Halvorsen Vantage  ▮▮▮▮▮ Leads DS at…  ● Looking 4 mutual │                                    │
│  ◎   │  MATCH   :      Principal Des.  Oslo     Tokens · Figma   now       via Ana R.  │ [Add to pipeline ▾] [Follow] [⌑]   │
│ ──   │  9     2°: [AK] Aiko Kurata    …                                                │  → Principal Designer, Platform    │
│  ⌑   │        ▌ : [MS] Maren Solberg  Kestrel  ▮▮▮▮▮ Leads Quill…   ● Open    3 mutual                                      │  y292  THE TAB: rule broken
│  ◷•  │        ▌ :      Staff Prod. Des. Berlin   Tokens · WCAG    Jan 2027  via Ana R.   FIT     ▮▮▮▮▮ 5 of 5 criteria      │  y348
│      │       2° : [TD] …                                                               │                                    │
│      │          :  …  (9 rows in group 5/5)                                            │ BRIEF   Eleven years designing…    │
│      │───────── ┼──────────────────────────────────────────────────────────────────────│                                    │
│      │  4/5     : [..] …                                                               │ RECORD  11 years · 4 companies     │
│      │  MATCH   :  …                                                                   │ 2022–   Kestrel                    │
│      │  23      :  …                                                                   │ 2019–22 Fjord Freight              │
│      │          :                                                                      │ WORK    [plate 128×84]  [plate]    │
│      │          :                                                                      │ SKILLS  Design systems · Interactio│
│  ⚙   │          :                                                                      │ MUTUAL  Ana Ruiz — Fjord Freight…  │
│ (PR) │─────────────────────────────────────────────────────────────────────────────────│                                    │  y996 colophon
│      │            38 people · 9 full matches · by fit       ↑↓ move  ␣ dossier  ⏎ open │                                    │
└──────┴─────────────────────────────────────────────────────────────────────────────────┴────────────────────────────────────┘  y1024
  rail   margin(112) measure (847) + 24 gutter                               ^ column rule    dossier (392)
```

---

## 3. Global navigation (rail)

**Width 64.** It sits on the desk and has no border. The sheet's left edge is what separates rail from sheet.

- **Mark:** a STRIVO glyph at y 12–32, x 22–42. It is a 20px square made of two stacked horizontal strokes offset by 4px, like a masthead rule, in `--ink-1`. It has no wordmark.
- **Items:** icon only. Each is 20px, in a 40 × 36 hit area at x 12–52, centred at x=32. Items stack 4px apart. Groups are 20px apart. A 16px-wide 1px `--rule` hairline is centred in each gap between groups.

| Group | Items (in order) | y |
|---|---|---|
| Read | Home | 64–100 |
| Discover | People · Jobs · Companies · Projects | 120–156 · 160–196 · 200–236 · 240–276 |
| Work | Applications · Hiring | 296–332 · 336–372 |
| Keep | Saved · Activity | 392–428 · 432–468 |
| Utility (bottom) | Settings | 932–968 |
| Account | Monogram 28 × 28 | 982–1010 |

- **Labels:** none in the default rail. Hovering an item for 400ms shows a **label flag**. The flag sits on `--leaf-2` #262422, 26px tall with 8px horizontal padding and radius 5, 8px to the right of the rail. It shows the label in 12/16 grotesk 500 `--ink-1` and the shortcut in mono 10 `--ink-3` (for example "People  G P"). There is no arrow on the flag.
- **Default state:** icon `--ink-3`. **Hover:** icon `--ink-2` on a `--sheet` fill with radius 6. **Pressed:** `--leaf`.
- **Selected ("rail tab"):** a fill in the sheet's colour runs from x=10 to x=64, 36px tall, with the left corners rounded at 8px. It fuses into the sheet: the sheet's left border has a gap at that y, and 6px concave fillets join the tab to the sheet above and below (drawn with two 6 × 6 SVG corner pieces). The icon is `--ink-1` and switches to its **filled variant**, where one inner shape is solid. No orange is used here.
- **Counts:** Applications shows a mono 10/12 `--ink-2` number ("2") top-right of the icon at (+13, −7), with no pill. Activity shows a 6px `--accent` dot at the same anchor when there are unread items. That dot is one of the allowed orange uses.
- **Account zone:** a serif monogram "PR" (the user, Pia Rehn). It is 28px, radius 5, and fills a `--mono-3` tint. A 12 × 12 org badge sits on its bottom-right corner: an "H" for Halden, the employer the user is acting as, with a 2px `--desk` ring. Clicking opens a menu that switches between personal and employer context and links to profile, preferences and sign-out.
- **Expand/collapse:** `⌘\` expands the rail to **200px**, which pushes the sheet. The expanded rail shows group headers in small caps 10/12 600, tracking 0.08em, `--ink-4` (READ, DISCOVER, WORK, KEEP). Items show 13/18 labels at x 48, with counts right-aligned in mono 11 at x 184. The rail is collapsed by default and the state persists for each viewer.
- **Keyboard:** `G` then a letter: H Home, P People, J Jobs, C Companies, W Projects, A Applications, R Hiring, S Saved, N Activity. `⌘\` toggles the rail.

---

## 4. Top application context (folio bar)

**Height 44.** It sits on the desk with no fill and no bottom border. The sheet's top edge is its lower boundary. The folio bar follows the sheet's column structure: **the local zone** sits over the work surface and **the global zone** sits over the dossier column.

**Local zone (x 64–1047), left to right:**
1. **Back and forward** (x 76 and 102): 24 × 24 icon buttons with 16px chevrons in `--ink-3`, or `--ink-4` when disabled. Shortcuts `⌘[` and `⌘]`. Long-press opens a history list of the last 8 locations, each with its serif noun.
2. **Location** (from x 138): section name 13/18 grotesk 500 `--ink-1`, then " / " in `--ink-4`, then the current view or object 13/18 `--ink-2`.
   - Location rules: at most **two levels**, and the section is never repeated. Section roots show one level ("Jobs"). Saved views and opened objects show two ("People / Maren Solberg", where the object name is serif 13).
   - When the current view differs from its saved state, a 5px hollow ring and "edited" appear 8px after the location, in 11/14 `--ink-3`. Clicking it offers Save or Revert.
3. **Local controls, right-aligned to x=1023** (the measure edge, which aligns them with the content they control):
   - "Share" text button, 28 tall, 13/18 `--ink-2`.
   - A 12px gap, then the view switcher. It is a 2-segment control, 28 tall. Each segment is 28 × 28: Index (rows) and Plates (grid). The container has a 1px `--rule` border and radius 6. The selected segment is filled `--leaf-2` with a `--ink-1` icon.
   - An 8px gap, then the "Display" icon button (28): density, visible columns and grouping.

**Global zone (x 1048–1440), aligned to the dossier content edge:**
4. **Command access** (x 1072–1344, 272 × 28): `--sheet` fill, 1px `--rule` border, radius 6. It shows a 14px search icon in `--ink-3`, the placeholder "Search people, jobs, companies…" in 13/18 `--ink-3`, and a "⌘K" keycap at the right end. It is a trigger, not an input: clicking or pressing ⌘K opens the palette. `/` focuses the local query sentence instead.
5. **Notifications** (x 1356–1384): bell icon, with a 6px `--accent` dot at top-right when unread. It opens a 360px panel that hangs from the folio bar on `--leaf-2`.
6. **New** (x 1396–1424): a plus icon that opens a menu to create a Post, Project brief, Job (employer context) or List. Shortcut `C`.

When the dossier is closed, the global zone stays **264px wide and right-aligned**, and the local controls glide to the new measure edge.

---

## 5. Layout modes (spatial grammar)

There are five compositions. Each can take two optional attachments: the **Shelf**, a 216px section-local column on the sheet with a 1px rule on its right, and the **Dossier**, the inspector on the leaf, 340–560px wide.

**Always constant:**
- The rail, folio bar, and desk/sheet model.
- The margin and measure grid (only the margin width changes by mode).
- Serif proper nouns and mono figures.
- The Tab selection grammar.
- The dossier's anatomy and behaviour (open, resize, close, J/K).
- The colophon line.
- The title line format: serif section title, segments, and the count in the margin.

**What changes:** the measure's content, the margin's width and contents, whether the Shelf and Dossier are present, and the direction of reading.

| Mode | Definition |
|---|---|
| **Index** | Rows in the measure. The margin (112) holds counts, group labels and per-row marginalia. |
| **Column** | One reading column with a 600px measure, centred in the work surface. A 160px margin on its left holds dates and provenance. |
| **Plates** | A grid of 4:3 "plates" drawn with CSS/SVG, in 16px gutters. Group labels hang in the margin. |
| **Lanes** | Horizontal status columns, 248px each, separated by 1px rules. Lane headings hang above a 28px ruled head. Entries are 2-line typographic rows, not shadowed cards. |
| **Folio** | Full-width identity page. A 160px margin holds section labels. The measure splits into 560 (main) + 32 + 240 (facts). There is never a dossier. |

**Section assignments:**

| Section | Mode | Composition sketch |
|---|---|---|
| **Home / Feed** | Column | 600px measure centred in the work surface. Each post shows the author in serif 15 with the time in the margin as mono "09:42". The margin carries a "why you're seeing this" note in small caps. There is no dossier until you select an author, which opens a Person dossier. |
| **People** | Index + Dossier | As specified in this document. |
| **Jobs** | Index + Dossier (520) | Rows show the role title in serif, company, pay band in mono, and location. The dossier widens to 520 to read the job description, with the apply action at the top. The margin groups jobs by posted date ("TODAY", "THIS WEEK"). |
| **Companies** | Plates + Dossier | Each 208 × 156 plate shows a large serif company monogram, headcount and open roles in mono, and a 1-line thesis. The margin groups plates by industry. Selecting a plate fuses it into the dossier through the Tab, drawn as a gap in the rule at the plate's row. |
| **Projects** | Shelf + Index + Dossier | The Shelf holds Marketplace / My briefs / Proposals / Contracts. Rows show the brief title in serif, budget and duration in mono, a skills line, and a 40 × 30 drawn thumbnail in the margin. |
| **Applications** | Lanes + Dossier | Lanes: Applied · In review · Interview · Offer · Closed. Each entry shows the role (serif), company, and "day 12" in mono. The dossier shows the timeline and next step. |
| **Hiring** | Shelf + Lanes + Dossier | The Shelf lists open roles with counts in mono. Lanes hold that role's pipeline. The dossier shows the candidate, reusing the Person dossier plus a "Pipeline" section. |
| **Saved** | Shelf + Index | The Shelf lists collections. The Index mixes object types, each marked by a small-caps type label in the margin (PERSON, JOB, PROJECT). A dossier opens on selection. |
| **Activity** | Column | Chronological. Day heads hang in the margin in serif italic 15 ("Monday 28 September"). Each entry is a one-line sentence with its object nouns in serif. |
| **Profile** | Folio | Name in serif 36/40. The 160px margin holds section labels: BRIEF, RECORD, WORK, WRITING, SKILLS, NETWORK. Work plates are full-bleed within the measure. |

---

## 6. People workspace

### Title line (y 44–100)
- **Margin:** the result count, right-aligned at x=168, mono 12/16 `--ink-3`, baseline y=80. It reads "38", the count for the current segment, like a folio number.
- **Title:** "People" at x=176, Newsreader 22/28, weight 500, opsz 22, `--ink-1`, baseline y=80.
- **Segments (saved filters),** 28px after the title, 13/18 grotesk, 20px apart:
  - Items: `Everyone` · `Shortlist 12` · `Design leads, EU 38` · `Returning talent 7` · `+ Save view`. Counts are mono 11 `--ink-3`.
  - Unselected segments are `--ink-3`, and `--ink-2` on hover. The selected segment is `--ink-1` with a 1px `--ink-1` underline 6px below the baseline.
  - `+ Save view` is `--ink-4` and only appears when the view is edited.
  - Segments can be reordered by drag. Right-clicking a segment offers Rename, Duplicate, Share, Pin to rail and Delete. `⌥1`–`⌥4` jump to segments.

### Query sentence (y 100–144): search, filters and sort as one line
A single line of 14/20 grotesk. Its text starts at x=176. The 16px search icon **hangs in the margin** at x 152–168, like hanging punctuation. The line reads:

> Showing **38** **product designers**, **senior or above**, in **Europe**, **open to offers**, with **design systems** — by **fit**

- Connective words are `--ink-3`. Each **facet** is `--ink-1` with a 1px dotted `--rule-strong` underline 3px below the baseline. On hover the underline turns solid `--ink-3`.
- Clicking a facet opens a facet popover: 280px wide, on `--leaf-2`, radius 8, 1px `--rule-strong`, 8px below the facet. It holds a typeahead and checkbox options with mono counts.
- **Adding a criterion:** clicking the end of the line or pressing `/` puts a caret there. Typing parses free text into facets ("figma berlin" becomes "with **Figma**, in **Berlin**"). Unparsed words stay as keyword search, shown in `"quotes"`.
- **Removing a criterion:** Backspace at an empty caret removes the last facet. Each facet popover also has "Remove".
- **Sort** is the final facet ("by fit" / "by recency" / "by proximity"). **Grouping** follows automatically: fit is grouped by match count, recency by week, proximity by degree.
- Facets are never rendered as pills or chips.

### Column heads (y 144–172)
Small caps 10/12, weight 600, tracking 0.08em, `--ink-4`, baseline y=162. They align to the columns: PERSON x216 · COMPANY · PLACE x428 · FIT x580 · AVAILABILITY x800 · CONTEXT x920. The sorted column's head is `--ink-2` with a mono "↓". Clicking a head sorts by it, which rewrites the sort facet in the sentence.

### Result row anatomy (56px, two lines)
Line 1 baseline at row-top +23. Line 2 baseline at row-top +41.

| Col | x | w | Line 1 | Line 2 |
|---|---|---|---|---|
| Margin marginalia | right-aligned at 168 | — | Degree "1°/2°/3°" mono 11/14 `--ink-4` | — |
| Monogram | 176 | 28 (+12) | 28 × 28 square, radius 5, `--mono-n` tint fill, serif initials 12/12 weight 500 `--ink-1`, vertically centred in the row | |
| Identity | 216 | 196 | **Name** in Newsreader 15/20, weight 500, `--ink-1` | Role, grotesk 12/16 `--ink-2` |
| Company · place | 428 | 136 | Company, grotesk 13/18 weight 500 `--ink-1` | "Berlin · 16:42", 12/16 `--ink-3`, time in mono 11 |
| Fit | 580 | 204 | Criteria ticks + evidence phrase 12.5/16 `--ink-2` | Top skills 12/16. Matched skills `--ink-1`, the rest `--ink-3`, separated by " · " |
| Availability | 800 | 104 | 6px status dot + state 12.5/16 `--ink-2` | "from Jan 2027" or "3 mo notice", mono 11 `--ink-3` |
| Context | 920 | 103 | "3 mutual", 12.5/16 `--ink-2` | "via Ana Ruiz": "via" in `--ink-3`, the name in serif 12.5 `--ink-2` |

- There are **no row dividers**. Rows are held together by alignment.
- **Groups:** a 1px `--rule` at the top of each group, spanning the measure (x 176–1023), with 16px of space above it.
- **Group labels** hang in the margin at x 84, top-aligned to the first row's line 1. Each label has three lines:
  - "5/5" in mono 13/16 `--ink-1`
  - "MATCH" in small caps 10/12 `--ink-3`
  - the count "9" in mono 11 `--ink-4`
- Group labels are **sticky** within their group while scrolling. The labels are 5/5, 4/5 and 3/5.

### How relevance is shown: criteria ticks
- Five vertical ticks, each 3 × 10 with radius 1 and a 2px gap (23px wide in total), sitting on line 1.
- There is **one tick per facet in the query sentence, in the same order**. A matched facet's tick is `--ink-1`. An unmatched one is `--rule-strong`. With 6 facets there are 6 ticks. There is no percentage anywhere.
- Hovering the ticks shows a 5-line flag listing each facet with ✓ or –.
- The **evidence phrase** follows 8px later. It is one short factual clause from the profile that best supports the match, for example "Leads Quill, Kestrel's design system". It is clamped to one line with an ellipsis.

### Availability states (dot + label)

| State | Dot | Label |
|---|---|---|
| Active | `--avail-active` #87A97F, solid | "Looking" |
| Open | `--avail-open` #8FA4BE, solid | "Open" |
| Freelance | `--avail-free` #AC9CC4, solid | "Freelance" |
| Not looking | 1px ring `--ink-4` | "Not looking" |

Availability never appears on the avatar.

### Selection, hover and multi-select
- **Hover:** row fill `--sheet-hover` #1C1B19 from x 168 to 1039 with radius 6. At the same time:
  - The Context column cross-fades to three 24 × 24 icon buttons, right-aligned at x=1023, 4px apart: **Save**, **Message**, and **More** (⋯, which opens the context menu). Each has a mono keycap tooltip (S, M, ⋯).
  - The margin's degree marker becomes a 14px checkbox (1px `--rule-strong`, radius 3).
- **Selected:** this is the Tab from §2. The fill is `--leaf` and fuses through the rule. The 2 × 24 accent mark sits at x 170. The name stays in serif and the role moves up from `--ink-2` to `--ink-1`.
- **Selection persists** when the dossier is closed: the fill stops at x 1039 with radius 6, and the accent mark remains.
- **Multi-select** (`X` or clicking the checkbox):
  - The checkbox fills `--ink-1` with a `--desk` check, and the row fill is `--sheet-hover`.
  - The colophon becomes an action strip: "3 selected · Add to pipeline · Save to list · Message · Compare · Esc".
  - The folio-bar "Share" is replaced by "Compare 3".
- **Context menu:** right-click or ⋯. 220px wide, `--leaf-2`, radius 8, 30px items at 13/18, with shortcuts right-aligned in mono 11 `--ink-4`. Items: Open profile ⏎ · Open in dossier ␣ · Add to pipeline P · Save S · Message M · Follow F · Copy link ⌘C · Hide from results ⌫.

### Keyboard
- `↑` / `↓` or `J` / `K` move the selection, and the dossier follows immediately.
- `␣` toggles the dossier. `⏎` opens the full Profile (Folio mode).
- `X` selects. `⇧↑` / `⇧↓` extend the selection.
- `S` save · `F` follow · `P` add to pipeline · `M` message.
- `/` edits the query. `Esc` steps back one level at a time: popover → dossier → selection.
- The focus ring is 1px `--accent` inset on the row, shown only for keyboard focus.

### Colophon (y 996–1024)
- **Left, at x 176:** mono 11/14 `--ink-3`: "38 people · 9 full matches · by fit, then recency · refreshed 2 min ago".
- **Right, ending at x 1023:** keycaps (mono 10, 16px tall, `--leaf-2`, radius 3, 4px horizontal padding) followed by 11px labels: `↑↓ move` `␣ dossier` `⏎ open` `X select`.

### Empty and loading states
- **Loading:** a typographic skeleton, not a shimmer. Each row shows hairline bars in `--rule` at the exact column positions: name 112 × 8 on the serif x-height, role 80 × 6, company 72 × 8, and 5 ticks in `--rule`. They pulse in opacity 0.55 ↔ 0.9 over 1.4s (ease-in-out). The query sentence and group labels render instantly. The count shows "—".
- **No results:** in the measure at y+48, Newsreader 17/24 `--ink-1`: "No one matches all five criteria." Below it, 13/20 `--ink-2`: "Relax **open to offers** to see 41 more, or **Europe** to see 112 more." The facet words are the same dotted facets as in the sentence and are clickable. There is no illustration.
- **Segment empty (Shortlist 0):** one line, 13/20 `--ink-3`: "Press P on anyone to shortlist them."

---

## 7. Person inspector (the dossier)

Occupies x 1048–1440 on `--leaf`. Inner padding is 24, so content spans x 1072–1416. It is laid out on its own margin: a **64px label column** at x 1072, a 12px gap, then **268px of content** at x 1148.

### Dossier header (y 44–84)
- **Left:** "3 / 214", mono 11 `--ink-3`, at x 1072. Then prev/next chevrons (24px each) for `K` and `J`.
- **Right, ending at x 1416:** Open profile ↗ (⏎), More ⋯, Close ✕ (Esc). Each is 24px, `--ink-3`.
- No border.

### Identity (y 92–318)
- **Monogram:** 48 × 48 at x 1072, y 96. It hangs in the label column. Radius 8, `--mono-2` tint, serif initials "MS" 20/20, weight 500.
- **Name:** **Maren Solberg**, Newsreader 28/32, weight 500, opsz 28, `--ink-1`, at x 1148, top y 94. The degree "2°" follows in mono 11 `--ink-3`.
- **Headline:** grotesk 14/20 `--ink-2`, 2 lines: "Staff product designer — design systems and dense financial tooling"
- **Meta** (8px below): 13/18 `--ink-3`: "**Kestrel**" (serif 13 `--ink-2`) · Berlin, Germany · mono "16:42 CET"
- **Availability** (6px below): an `--avail-open` dot, then "Open to principal roles" in 13/18 `--ink-2`, then " · from Jan 2027 · 3-month notice" in mono 11 `--ink-3`.
- **Actions** (20px below, y 262–294), at x 1148:
  - **Add to pipeline ▾**: `--accent` fill, 32 tall, 152 wide, radius 6, 13/18 weight 600, text `--accent-ink`. The split chevron is its own 28px segment, divided by a 1px `--accent-ink` line at 20% opacity.
  - **Follow**: 68 × 32, transparent with a 1px `--rule-strong` border, 13/18 weight 500 `--ink-1`. After following it reads "Following" in `--ink-2`.
  - **Save**: a 32 × 32 bookmark icon button. When saved, the icon becomes the filled variant in `--ink-1`.
- **Target line** (8px below the actions), 11/14 `--ink-3`: "→ Principal Designer, Platform · Halden", naming the role that the primary action targets. Message stays on `M` and in the ⋯ menu.

### Body sections
The body starts at y 340. Sections are 24px apart with no rules. Every section label is set in small caps 10/12, weight 600, tracking 0.08em, `--ink-4`, in the label column. Each label is baseline-aligned to the first line of its section.

1. **FIT** (y 340–380)
   - Five ticks + "5 of 5 criteria" in 13/18 `--ink-1`.
   - Below, 12/16 `--ink-3`: "Product designer · Staff · Berlin · Open to offers · Design systems".
2. **BRIEF** (y 404–464), 13/20 `--ink-1`, 3 lines:
   "Eleven years designing tools people use eight hours a day. At Kestrel she rebuilt the merchant dashboard on Quill, the system she leads across four teams. Looking for a principal role with real operational complexity."
3. **RECORD** (y 488–690)
   - Summary line: "11 years · 4 companies", 12/16 `--ink-3`.
   - Then 4 entries, 44px apart. **In each entry, the years hang in the label column** in mono 11 `--ink-3`. Each entry has:
     - Line 1: the company in serif 14/20 `--ink-1`
     - Line 2: the role in 12/16 `--ink-2`, with an optional clause in `--ink-3`
   - The entries:

   | Years | Company | Role and clause |
   |---|---|---|
   | 2022– | **Kestrel** | Staff Product Designer · design systems lead |
   | 2019–22 | **Fjord Freight** | Senior Product Designer · carrier dashboard |
   | 2016–19 | **Mosaic Health** | Product Designer · clinician scheduling |
   | 2014–16 | **Bureau Arne** | Interaction Designer · studio, Oslo |

4. **WORK** (y 714–842): two plates, each 128 × 84, radius 4, with a 1px `--rule` border and 12px apart. Both are drawn in CSS/SVG on `--leaf-2`:
   - **Quill** (a component system): a 6 × 4 grid of 14 × 8 rounded rectangles in `--ink-4`. Three of them are `--ink-2`. One 14 × 8 swatch is `--accent` at 70%, the only orange inside the work.
   - **Settlement ledger** (dense table): 9 rows of 1px `--rule-strong` lines 7px apart, a 24px left column band in `--sheet`, and one row highlighted in `--ink-4` at 40%.
   - Captions 6px below each plate: title in serif 13/18 `--ink-1` ("Quill design system" / "Settlement ledger"), then mono 11 `--ink-3` ("2023 · Kestrel" / "2024 · Kestrel").
   - Clicking a plate opens it in Profile's Work section.
5. **SKILLS** (y 866–906), 13/20, running text in 2 lines, separated by " · ":
   Design systems · Interaction design · Data-dense UI · Prototyping (Framer) · Accessibility (WCAG 2.2) · Design ops · Facilitation
   - Skills that match the query are `--ink-1` with a 1px `--ink-4` underline. Others are `--ink-2`.
   - There are no endorsement counts.
6. **MUTUAL** (y 930–970), 13/20:
   - "**Ana Ruiz** — worked together at **Fjord Freight**, 2019–21". Names and companies are serif 13 `--ink-1`, the rest `--ink-2`.
   - Next line: "Also **Jonas Weber**, **Priya Nair** · both in Design Systems Guild", in `--ink-3`.
7. **Provenance** (y 994), mono 10/12 `--ink-4`: "Active 2d ago · profile updated 14 Sep 2026 · viewed by you 12 Sep".

The provenance line is the last line. Everything fits within 1024 at this content length. Longer dossiers scroll inside the leaf. When scrolled past the actions row, the header shows the name in serif 13 and the identity block collapses into it, as a sticky mini-header.

### Behaviour
- **Resize:** the column rule is the handle.
  - Hit zone: 8px wide (x 1043–1051), cursor `col-resize`.
  - On hover (after 150ms), the rule becomes `--rule-strong`, and a 3 × 28 grip (radius 1.5, `--ink-4`) appears centred on the rule at the cursor's y. The grip avoids the Tab gap.
  - While dragging, the colophon shows the width in mono ("392 px").
  - Width limits: min 340, max 560. Double-click resets to 392. Width persists for each section.
- **Close:** ✕, `Esc`, or `␣`. The leaf slides out and the work surface reflows to full width. The Tab collapses back into the row, and the selection persists. Reopen with `␣` or by clicking the selected row.
- **Next/previous:** `J` and `K` swap the dossier contents in place. The header counter updates.

---

## 8. Tokens

### Colour

| Token | Hex | Use |
|---|---|---|
| `--desk` | #121212 | Frame canvas: rail and folio bar |
| `--sheet` | #191817 | Work surface; command trigger fill |
| `--sheet-hover` | #1C1B19 | Row hover; multi-selected rows |
| `--leaf` | #1F1D1B | Dossier; selected row (the Tab); rail tab uses `--sheet` |
| `--leaf-2` | #262422 | Popovers, menus, palette, label flags, keycaps, plate grounds |
| `--leaf-3` | #2E2B28 | Pressed state inside `--leaf-2` surfaces |
| `--rule` | #2A2724 | Default hairlines, sheet edge, column rule |
| `--rule-strong` | #3B3733 | Control borders, rule hover, unmatched ticks, dotted facet underline |
| `--ink-1` | #ECE6DD | Primary text, names |
| `--ink-2` | #B8B0A5 | Secondary text, roles |
| `--ink-3` | #8A8278 | Tertiary text, meta, icons at rest |
| `--ink-4` | #5E5851 | Labels, disabled text, marginalia |
| `--accent` | #E07A3F | Orange |
| `--accent-hover` | #EA8A52 | |
| `--accent-press` | #C8692F | |
| `--accent-ink` | #1B120B | Text on accent |
| `--avail-active` | #87A97F | |
| `--avail-open` | #8FA4BE | |
| `--avail-free` | #AC9CC4 | |
| `--warn` | #C9A45C | Applications/Hiring only |
| `--danger` | #C77466 | Applications/Hiring only |
| `--mono-1…6` | #2B2520, #22282A, #27261F, #2A2327, #23272B, #2A2622 | Monogram tints, assigned by name hash |

**Orange is allowed in exactly these places:**
1. The primary action in the dossier.
2. The 2px selection mark.
3. Unread dots (Activity, notifications).
4. The keyboard focus ring.
5. The single accent swatch inside a drawn work plate.

At most 5 instances may be visible at once, and only one of them (the primary button) may be an area larger than 8px. The People screen shows all five: the button, the mark, the Activity dot, the bell dot and the Quill swatch. Orange is never used for text links, hover states, gradients, tick marks or charts.

### Type
- **Newsreader Variable** (`@fontsource-variable/newsreader`; use the opsz build if the package exposes it). It sets proper nouns and titles only, at weight 500 (400 italic for Activity day heads). `font-optical-sizing: auto`.
- **Schibsted Grotesk Variable** (`@fontsource-variable/schibsted-grotesk`). All UI text, at weights 400 / 500 / 600.
- **DM Mono** (`@fontsource/dm-mono`, weights 400 and 500). Figures, dates, counts, degrees, keycaps and times.
- Grotesk figures use `font-variant-numeric: tabular-nums` wherever they appear.

**Scale (every size in use):**

| Role | Family | Size / line-height | Weight | Notes |
|---|---|---|---|---|
| Profile name (Folio) | Newsreader | 36/40 | 500 | tracking −0.01em |
| Dossier name | Newsreader | 28/32 | 500 | tracking −0.005em |
| Section title | Newsreader | 22/28 | 500 | |
| Empty-state line | Newsreader | 17/24 | 500 | |
| Activity day head | Newsreader | 15/20 | 400 italic | |
| Row name | Newsreader | 15/20 | 500 | |
| Dossier record company, work title | Newsreader | 14/20 and 13/18 | 500 | |
| Inline nouns in running text | Newsreader | 13/18 or 12.5/16 | 500 | matches the size of the grotesk around it |
| Query sentence | Grotesk | 14/20 | 400 (facets 500) | |
| Headline | Grotesk | 14/20 | 400 | |
| UI body, buttons, company, location | Grotesk | 13/18 | 400/500/600 | |
| Dossier prose | Grotesk | 13/20 | 400 | |
| Row line-2, evidence phrase | Grotesk | 12.5/16 and 12/16 | 400 | |
| Target line, hints | Grotesk | 11/14 | 400 | |
| Small-caps labels | Grotesk | 10/12 | 600 | uppercase, tracking 0.08em |
| Counts, dates, times | DM Mono | 11/14 and 12/16 | 400 | "5/5" group label in 13/16, 500 |
| Keycaps, provenance | DM Mono | 10/12 | 400 | |

### Spacing
The scale is 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56. Fixed structural values:

| Element | Value |
|---|---|
| Margin width by mode | Index 112, Column/Folio 160, Dossier 64 |
| Sheet and dossier padding | 24 |
| Column gutters | 16 |
| Section spacing in the dossier | 24 |

### Radii

| Element | Radius |
|---|---|
| Ticks | 1 |
| Keycaps, checkboxes | 3 |
| Plates | 4 |
| Monogram 28, label flags | 5 |
| Buttons, inputs, row hover/selection | 6 |
| Menus, popovers, palette, monogram 48, rail tab | 8 |
| Sheet top-left corner | 10 |

Nothing is pill-shaped except the 6px status dots.

### Icons
Hand-drawn inline SVG.
- **Grid:** 20px grid for the rail and 16px for UI, with a 1.5px live area at the edges.
- **Stroke:** 1.5px on the 20px grid, 1.25px on the 16px grid. **Butt caps and miter joins**, which gives a drafted, technical line rather than a soft, rounded one. Built from straight segments and quarter arcs only, with no fills at rest.
- **Selected variant:** exactly one inner shape is filled solid in `--ink-1`. For example, People fills the second figure's head, and Saved fills the bookmark body.
- **Colour:** `currentColor`, never tinted.
- **Metaphors:**
  - Home: a masthead, two rules over a block.
  - People: two offset heads over shoulders drawn as arcs.
  - Jobs: a folder with a tab.
  - Companies: a building made of three ruled floors.
  - Projects: a plate with a corner fold.
  - Applications: an arrow entering a bracket.
  - Hiring: a funnel made of three rules of decreasing length.
  - Saved: a bookmark.
  - Activity: a dial with one hand.

### Row and control heights

| Element | Height |
|---|---|
| Index row | 56 (compact density 40: single line with role inline after the name) |
| Column head, colophon | 28 |
| Folio bar | 44 |
| Title line | 56 |
| Query sentence | 44 |
| Dossier header | 40 |
| Menu item | 30 |
| Controls | 28 (dossier actions 32) |
| Rail item | 36 |

---

## 9. Motion grammar (motion/react v13)

Wrap the app in `<MotionConfig reducedMotion="user">`. Transitions:

```ts
const snap = { type: "spring", stiffness: 520, damping: 44, mass: 0.8 }   // selection, tabs
const sheet = { type: "spring", stiffness: 380, damping: 40, mass: 1 }    // panels, layout
const fade = { duration: 0.14, ease: [0.2, 0, 0, 1] }
const out = { duration: 0.1, ease: [0.4, 0, 1, 1] }
```

| Interaction | Behaviour |
|---|---|
| **Dossier open** | The leaf mounts in `AnimatePresence`. Its width animates from 0 to 392 with `sheet`, about 280ms to settle. The work surface uses `layout` so the rule and the measure edge glide with it, and the folio-bar local controls ride the same layout transition. The content inside the leaf fades in (opacity 0→1, x 12→0, `fade`, delay 60ms). |
| **Dossier close** | Content opacity goes to 0 over 80ms. Then the width goes to 0 with `sheet`. |
| **Selection Tab** | One `motion.div layoutId="people-tab"` draws the row fill and the rule gap together, plus a second element `layoutId="people-mark"` for the accent mark. Both use `snap`, so the Tab slides between rows as a single object. Holding J/K moves the Tab continuously, with no per-row fades. |
| **Dossier content swap on J/K** | `AnimatePresence mode="popLayout"` keyed by person id. The exiting content fades to 0 over 80ms. The entering content fades 0→1 with y 4→0 over 160ms. The name does not slide sideways. |
| **Row hover** | The background colour changes instantly on enter and fades over 120ms on leave. Hover actions animate opacity 0→1 and x 4→0 over 120ms, and the Context text cross-fades at the same time. There is no hover animation while scrolling (disabled for 150ms after a scroll event). |
| **Nav selection** | The rail tab uses `layoutId="rail-tab"` with `snap`. The icon's filled-variant shape fades in over 120ms. The concave fillets move with the tab. |
| **Section switch** | The frame never moves. The sheet content exits over 90ms (`out`, opacity only). The new content enters with opacity 0→1 and y 6→0 over 200ms, ease [0.2, 0.8, 0.2, 1]. If the mode changes, the Shelf and Dossier widths animate with `sheet`. The serif title swaps via crossfade, without movement. |
| **Command palette** | Palette: 640 × up to 440, top 120, centred on the sheet (not the window). `--leaf-2`, 1px `--rule-strong`, radius 8. Enter: opacity 0→1, scale 0.98→1, y −4→0 over 160ms, ease [0.16, 1, 0.3, 1]. Exit: 100ms, opacity only. Scrim: `--desk` at 48% opacity, with no blur. The results highlight uses `layoutId="palette-hl"` with `snap`. |
| **List entrance** | First load only: the first 12 rows stagger by 18ms, each opacity 0→1 and y 4→0 over 180ms. Filter changes do not stagger: the whole list crossfades over 120ms. The count in the margin tweens its number over 200ms. |
| **Facet popover** | Opacity plus y −2→0 over 120ms. The facet's underline switches from dotted to solid. |

**Restraint rules:**
- No transition longer than 320ms.
- No overshoot beyond 2%.
- Nothing scales above 1.
- No stagger outside the first list load.
- Never animate text colour on more than one element at a time.
- Never animate the rail, the folio bar, or the desk.
- With reduced motion, every transition becomes an opacity change of 120ms or less, and layout animations are instant.

---

## 10. Mature details (and where each lives)

| Detail | Location |
|---|---|
| Result count as a folio number | Title-line margin, right-aligned at x 168 |
| Hanging search icon | Query-sentence margin, x 152 |
| Degree marginalia (1°/2°/3°) that becomes a checkbox on hover | Row margin, right-aligned at x 168 |
| Sticky group labels (5/5 MATCH 9) | Margin, x 84 |
| "edited" view state + Save/Revert | Folio bar, after the location |
| Saved views with counts; ⌥1–4; drag to reorder; right-click menu | Title line |
| Back/forward with long-press history | Folio bar, x 76 / 102 |
| Command trigger with ⌘K keycap | Folio bar global zone, x 1072 |
| Keyboard legend | Colophon, right |
| Freshness line ("refreshed 2 min ago") | Colophon, left |
| Selection-count action strip | Colophon, which replaces itself on multi-select |
| Hover action triplet + ⋯ context menu | Row Context column |
| Resize grip + live width readout | Column rule; width shown in the colophon |
| Dossier position counter "3 / 214" + J/K chevrons | Dossier header |
| Criteria-tick breakdown flag | Hovering ticks in rows and in the dossier FIT section |
| Local time of the person | Row line 2 and dossier meta (mono) |
| Acting-as org badge | Account monogram, bottom of the rail |
| Rail shortcut flags (G + letter) | Rail hover |
| Unread dot (orange) | Activity icon; bell |
| Primary action's target role line | Under the dossier actions |
| Provenance line (last active / updated / viewed) | Foot of the dossier |
| Persistent selection with the dossier closed | Row keeps its fill and accent mark |

---

## 11. Anti-generic audit

| Risk | Where it could happen | Prevention in this spec |
|---|---|---|
| **LinkedIn clone** | Person rows with avatars, "Connect" buttons, endorsements, cover banners | Square serif monograms, not round photos. No cover banners anywhere, including Profile. No endorsement counts. Relationship is shown as degree marginalia plus provenance ("via Ana Ruiz"), not "People also viewed". The primary action is the context-aware "Add to pipeline", not "Connect". Blue is never used. |
| **Linear clone** | A dark inset panel with rounded corners and an icon rail | The sheet is flush right and bottom with a single 10px corner. The rail tab fuses into the sheet with concave fillets. The Tab fuses row and dossier. The fixed margin/measure grid and serif nouns don't exist in Linear. The command trigger sits over the dossier column, not in a sidebar. |
| **shadcn demo** | Filter chips, badge pills, card grids, a default avatar component | Filters are a written sentence with dotted facets. Counts are plain mono, never in pills. There are no cards in Index. Plates in other modes are typographic and have no shadows. Radii are capped at 8 inside the app. |
| **AI dashboard** | "92% match" bars, sparkle icons, gradient accents, KPI tiles | Relevance is shown as criteria ticks mapped 1:1 to the user's own facets, plus a factual evidence clause. No percentages, no gradients, no glow. Orange is limited to five enumerated uses. There are no stat tiles in any mode. |
| **Magazine pastiche** | The serif becoming decoration | Serif is restricted by rule to proper nouns and titles, at 28px or below in working modes (36px only in Folio). Rows stay 56px and dense, with mono figures and a column-headed index. The colophon and keycaps keep it clearly a tool. |
| **Generic HR SaaS / Kanban** | Hiring and Applications lanes | Lanes are ruled typographic columns: 2-line entries, lane headings above a 28px ruled head, and no drop shadows or coloured card tops. Status colour is limited to muted `--warn` and `--danger` dots. |
| **Search-bar-first portal** | A wide centred search | Command access is a 272px trigger in the global zone. Discovery search is the local query sentence, which starts on the measure line. |
| **Logo-swap failure** | — | What remains without the logo: the margin carrying numbers and labels at three scales (list, dossier, profile); selection fusing into the next plane (rail→sheet, row→dossier); the query sentence and its matching ticks; the folio bar split into local and global zones along the sheet's columns. |
