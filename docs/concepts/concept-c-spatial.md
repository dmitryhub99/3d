# Concept C: Seam

A spatial system for STRIVO. Canvas 1440 × 1024. Every value is at 1x on that canvas.
Surfaces: `chassis` #0E0E0D, `canvas` #121212, `raised` #191817 (§8).

---

## 1. Thesis

**In STRIVO, focus moves to the right, and each boundary it crosses stays open.** Every section is a staircase that gets more specific from left to right: section (rail), then view (scope), then set (surface), then object (inspector). Each step sits one surface level higher than the step before it. The active item in each panel breaks the separator to its right and takes on the fill of the next panel, the way a folder tab joins its folder. We call that break a **seam**. On the People screen you can trace the path in one glance: the *Design leads · Bay Area* view runs into the result list, and the selected row, Ines Achterberg, runs into the inspector. Two more rules keep the path spatial. First, the **context line is a map, not a breadcrumb.** Each crumb is anchored above the panel it names, and its `›` separator sits on that panel's boundary. Second, **width is negotiated in a fixed order and never reflowed.** When space runs out, the scope folds first, then the surface's low-priority columns yield, and then the inspector narrows. Nothing ever overlaps. Remove the logo and the product is still identifiable by open seams, crumbs that ride above their panels, and a frame that gives way in a known order.

---

## 2. Frame geometry (People state)

### 2.1 Regions

| Region | x | y | w × h | Surface | Border |
|---|---|---|---|---|---|
| Context line | 0–1440 | 0–44 | 1440 × 44 | chassis #0E0E0D | none of its own. The well's top hairline sits below it |
| Mark cell | 0–56 | 0–44 | 56 × 44 | chassis | none |
| Rail | 0–56 | 44–1024 | 56 × 980 | chassis | **none** between rail and scope |
| Scope column | 56–264 | 44–1024 | 208 × 980 | chassis | none on its left |
| Well top hairline | 264–1440 | y=44 | 1px | `line-1` #242321 | continuous |
| Well left hairline | x=264 | 44–1024 | 1px | `line-1` | **open 104–132** (seam 1, active view) |
| Work surface | 265–1047 | 45–1024 | 782 × 979 | canvas #121212 | — |
| Surface / inspector separator | x=1047 | 45–1024 | 1px | `line-1` | **open 713–769** (seam 2, selected row). Resize handle |
| Inspector | 1048–1440 | 45–1024 | 392 × 979 | raised #191817 | — |
| Key line | 56–1440 | y=996 | 1px | `line-1` | one hairline shared by the scope, surface and inspector footers (28px each). The rail has no footer |

The **frame** is an L of chassis (context line + rail + scope). The **well** (surface + inspector) is set into it. Only the well has edges: its top and left hairlines and one internal separator. The frame has no internal borders. The rail and scope are separated only by their content type (icons vs. text) and 8px of air. No panel has a radius, a shadow or an outer border.

**Proportion rules.** At default, the inspector is half the surface (392 : 782 ≈ 1 : 2). The scope is 208 = 13 × 16. In any mode, the inspector never exceeds 0.9 × surface.

### 2.2 Surface bands (People)

| Band | y | h | Notes |
|---|---|---|---|
| Query bar | 45–93 | 48 | search + filter sentence. No border |
| Result line | 93–125 | 32 | count, freshness, group/sort. No border |
| Column header | 125–153 | 28 | sticky. 1px `line-1` at y=152 |
| Group header "Open now · 23" | 153–181 | 28 | `line-1` hairline on its top edge only when it isn't the first group |
| Rows 1–7 | 181–573 | 7 × 56 | no row dividers |
| Group header "Open selectively · 58" | 573–601 | 28 | |
| Rows 8–14 | 601–993 | 7 × 56 | row 10 (Ines) = 713–769, selected |
| Footer | 996–1024 | 28 | on the key line |

### 2.3 ASCII wireframe (1 char ≈ 12px horizontal; rows are not to vertical scale)

```
x=0   56               264                                                              1047                              1440
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ▀▄▄   ‹ ›  People      › Design leads · Bay Area ▾  142         [≡│▦]  Display  ⋯       › Ines Achterberg 10/142 ↑↓ × ⌘K ◔┃  y0–44  CONTEXT LINE (chassis)
┃                       ┌────────────────────────────────────────────────────────────────┬──────────────────────────────────┨  y44   well top hairline
┃  ⌂    Views        +  │ ⌕ Search  ¹Product designers ²Senior+ ³in Bay Area/remote      │  (IA)  Ines Achterberg           ┃  y45    query bar 48
┃       All people 18.2k│           ⁴with design systems    + clause                     │        Principal Product Designer┃
┃  ◉    Design leads 142  142 people · 18 new since Sep 21    Group: Avail.  Sort: Fit ↓ │        Ledgerline · Oakland · 09:┃  y93    result line 32 ◄ SEAM 1 (active view)
┃  ▥    Staff eng fin 67│ Name                   Location   Fit         Avail.  Context  │        ● Open selectively · Jan 2┃  y125   column header 28
┃       Alumni F&T 311  │────────────────────────────────────────────────────────────────│  [Request intro via Ana] Follow ▯┃
┃  ▭    Hiring·Design 38│ Open now · 23                                                  │                                  ┃  y153   group header 28
┃  ▦                    │ (TE) Tomas Ekholm       SF         ▮▮▮▮ 4/4    ● Now    2 mutua│ Match                          4/┃  y181   rows 56
┃  ⋮    Segments        │      Sr Product Designer  Remote     Design sys  Full-time via │ ¹ Product designer    ✓ Principal┃
┃       Following 248   │ (AB) Aiko Brandt        Berkeley   ▮▮▮▯ 3/4    ● Now    Follows│ ² Senior+             ✓ 13 yrs   ┃
┃  ⋎    Mutuals 1,204   │      Lead Designer, Pay…  Hybrid     Tokens,a11y Contract you  │ ³ Bay Area/remote     ✓ Oakland  ┃
┃       Intro requests 3│  …  5 more rows                                                │ ⁴ Design systems      ✓ led 3 yrs┃
┃  ▯    Reached out 19  │ Open selectively · 58                                          │                                  ┃  y573   group header 28
┃  ≡⁷   Viewed you 27   │ (BH) Beatrix Holm       SF         ▮▮▮▯ 3/4    ● Select 1 mutua│ About                            ┃
┃                       │ (JP) Jun Park           Oakland    ▮▮▮▮ 4/4    ● Select Ex-Tess│ Designs financial tools that     ┃
┃       Recent           ▌(IA) Ines Achterberg    Oakland    ▮▮▮▮ 4/4    ● Select 3 mutua  stay legible under pressure. …   ┃  y713   SELECTED ROW ◄ SEAM 2 (raised, fused)
┃       (IA) Ines Achter│      Principal Product…  Hybrid     Design sys  Jan 27  Replied│                                  ┃
┃       (TE) Tomas Ekhol│ (SO) Sam Okoro          Remote     ▮▮▮▯ 3/4    ● Select —      │ Experience                13 yrs ┃
┃       (AB) Aiko Brandt│ (CV) Clara Vey          SF         ▮▮▯▯ 2/4    ● Select Viewed │ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ tenure strip    ┃
┃       (JP) Jun Park   │  …                                                             │ ▪ Ledgerline  Principal  2023–now┃
┃                       │                                                                │ ▪ Tessellate  Staff      2019–23 ┃
┃  (JR)                 │                                                                │ Selected work  [thumb]  [thumb]  ┃  y952   account
┃      ─────────────────┼────────────────────────────────────────────────────────────────┼──────────────────────────────────┨  y996   key line: three footers share one hairline
┃       [ hide   ⌥1–5   │ 142 people · 1 selected      J K move  ↵ open  S save  ⌘K      │ Updated 2d ago   ↵ full profile  ┃  28px
┗━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  y1024
```

Legend: `│` = hairline. A blank where a hairline should be = open seam. `▌` = the 2px orange focus tick (the only orange mark on the list). `▮▯` = fit ticks.

---

## 3. Global navigation (rail, x 0–56)

**Structure.** The rail is icon-only. Items are 40 × 36 hit cells at x=8, with a 20px icon centered in each. Groups are separated by a 16px gap that holds a centered 16 × 1px `line-1` dash. Group names are never shown in the rail; they appear only in Alt-peek.

| Group | Items (y) |
|---|---|
| — | STRIVO mark in the mark cell (19,13), 18 × 18 |
| Start | Home 56–92 |
| Network | People 108–144 · Companies 144–180 |
| Work | Jobs 196–232 · Projects 232–268 · Applications 268–304 |
| Employer | Hiring 320–356 (shown only with an employer seat) |
| Library | Saved 372–408 · Activity 408–444 |
| Account | Settings 912–948 · account monogram "JR" (Jonah Reyes) 28px circle in cell 952–988 |

**Mark.** Three 3px-tall bars, 18 / 12 / 6px wide, left edges stepped 0 / 6 / 12px, 4px vertical gap, in `text-1`. It is the staircase itself.

**States.**
- Rest: icon `text-3` #857F78.
- Hover: icon `text-2` #B5AEA5, cell fill `hover-chassis` #161615, radius 6. Color is instant; the fill fades in over 60ms.
- Active, when a scope column is present: cell fill `raised` #191817, radius 6, icon `text-1` #EDE8E1.
- Active, when it holds the seam (scope collapsed or the section has no scope): the cell becomes a tab 49 × 36 (x 8–57), fill `canvas` #121212, left corners radius 6, right corners 0. It covers the well's left hairline at that height.

**Badges.** Activity shows a count, "7", in a 14 × 14 box (radius 3, `raised-2` #22211F, Geist Mono 10/14 500 `text-1`) at the icon's top-right (+6, −6). Applications shows a 5px `sage` dot (an offer changed) at the same anchor. No other badges.

**Tooltips.** A tooltip appears after 400ms at the rail's right edge + 8px. It shows the label (13/18 500 `text-1`) and a key chord in kbd chips: People `G` `P`, Home `G` `H`, Jobs `G` `J`, Companies `G` `C`, Projects `G` `R`, Applications `G` `A`, Hiring `G` `I`, Saved `G` `S`, Activity `G` `V`.

**Alt-peek.** Holding ⌥ for 300ms fades in a 148px label strip at overlay level (`overlay` #22211F, `line-2` right edge) from x=56. Next to each icon it shows the label, and above each group it shows the group name (11/16 600 `text-3`). It never pushes layout. Releasing ⌥ removes it in 90ms.

**Collapse.** The rail never collapses or expands. It is the one invariant. Collapsing belongs to the scope (`[`).

**Account zone.** Clicking the account cell opens a menu at overlay level, anchored bottom-left, x=64, bottom y=988. It lists: Your profile (`G` `M`), Switch to Employer: Parcelwise, Availability: *Not looking*, Settings, Sign out.

---

## 4. Top application context (the context line, y 0–44)

The context line is one row of chassis with no background change. Its contents are split into **zones that sit exactly above the panels below them**. When a panel resizes or folds, its zone moves with it (§9).

| Zone | x (People) | Contents, left → right |
|---|---|---|
| Mark | 0–56 | Mark |
| Scope zone | 56–264 | Back `‹` and forward `›` 24 × 24 ghost buttons at x=64 and x=90 (16px chevrons, `text-2`, disabled `text-4`). Section name "People" 13/18 600 `text-1` at x=124 |
| Surface zone | 264–1047 | `›` 12px `text-4` centered on x=264 (on the seam line). View crumb "Design leads · Bay Area" 13/18 500 `text-1` at x=281, then a 12px chevron-down (view menu) and "142" Geist Mono 11/16 `text-3`. **Right-aligned to x=1031:** view switcher (segmented, 52 × 24: Rows / Grid, 16px icons, active segment `raised` fill + `text-1`), "Display" ghost button (sliders icon + label, 24h), `⋯` (view actions: Rename, Duplicate, Share with team, Subscribe to changes) |
| Inspector zone | 1047–1328 | `›` centered on x=1047. Object crumb "Ines Achterberg" 13/18 500 `text-1` at x=1068. "10/142" Geist Mono 11/16 `text-4`. `↑` `↓` 24px buttons (previous/next row) at x=1236 and 1260. Close `×` at x=1292 |
| Global end | 1328–1440 (fixed) | Command trigger 64 × 24 at x=1332: 14px search glyph + kbd `⌘K`, `raised-2` #22211F fill, `line-2` border, radius 6. Bell 24 × 24 at x=1404, with a 6px `accent` dot at (+14, +4) when there are unread items. Right padding 12 |

**Location rules.** There is one crumb per visible panel, and never more than three. Crumbs name panels, not a hierarchy. When the inspector closes, its crumb goes with it. When a section has no scope, the section name moves into the surface zone. Clicking a crumb focuses its panel. Clicking the view crumb chevron opens the saved-views menu (the same list as the scope, which is useful when the scope is folded).

**Back / forward.** History records section switches, view changes, inspector open/close and selections. Rapid J/K moves within 800ms merge into one entry. Long-press or right-click on `‹` opens a history menu with the last 12 entries. Each entry shows a panel glyph (section / view / object) and its label, e.g. "◧ Ines Achterberg · Design leads". Shortcuts: `⌘[` and `⌘]`.

**Command access.** There is no search bar in the header. `⌘K` opens the palette (§9). The trigger is 64px wide. Search inside a view lives in the query bar and is local.

**Notifications.** The bell does not open a floating dropdown. It opens the **Activity peek in the inspector slot**, which replaces the current object and is labeled "Activity" in the inspector zone. Closing it restores the previous object. Rule: contextual content always opens in the inspector slot. Only menus and the palette float.

---

## 5. Layout modes (the spatial grammar)

There are five compositions. All of them use the same frame, the same seam rule, the same inspector slot, the same key line and the same selection model.

| Mode | Surface content | Inspector | Surface min width |
|---|---|---|---|
| **Ledger** | aligned rows with columns | Peek 392 or Reader 560 | 560 |
| **Gallery** | a grid of cells that share hairlines (never separate cards) | Peek 392 or Reader 560 | 600 |
| **Board** | stage columns of compact 52px cards | Peek 392 | 880 |
| **Stream** | a single 600px reading column plus a 240px margin column | Peek 392, opened on demand | 640 |
| **Document** | a full-width identity band plus a 680px text column and a 240px facts column | none by default; Reader for sub-objects | 720 |

**Yield order** (applies in every mode). When `available < mode min + inspector`, the following happens in order. (1) The scope folds to 0. Its active item stays addressable through the view crumb, and the seam moves to the rail tab. (2) The mode's low-priority parts yield: Ledger columns (Context, then Location), the Stream margin column, Board stages collapsed to a 40px spine. (3) The inspector narrows toward 336. The system never overlays and never scrolls the page horizontally.

| Section | Mode | Scope contents | Composition sketch |
|---|---|---|---|
| Home | Stream | Feeds: Following, Your field, Companies, Saved searches | `[rail][scope 208│ stream 600 @ x+48 │ margin 240: "why this is here", people named in the post ]`. Clicking a person in a post opens Peek. The margin yields first |
| People | Ledger + Peek | Views, Segments, Recent | As §2. 56px identity rows, fit ticks, inspector at 392 |
| Jobs | Ledger + Reader | Saved searches, Tracked, Applied | `[scope│ 614 compact rows (40px: role / company·comp) ║ Reader 560: job doc, sticky "Apply" ]`. The reader is a document, so it gets width. |
| Companies | Gallery + Peek | Lists: Following, Hiring now, Fintech · Bay Area | `[scope│ 4-col grid of 190 × 148 cells sharing 1px lines: logo mono, name, sector, headcount + 12-mo sparkline, open roles ║ Peek]` |
| Projects | Gallery + Reader | Open briefs, My proposals, Active contracts | `[scope│ 3-col brief cells with 3:2 CSS thumbnails, budget, duration ║ Reader 560: brief + proposal composer ]` |
| Applications | Board | Active 9, Drafts 2, Archived 31, By company | `[scope│ Applied │ Screening │ Interviewing │ Offer │ Closed ]`. Cards are 52px (company mono, role, next event "Panel · Thu 14:00"). Peek shows the timeline |
| Hiring | Board + Peek | Requisitions (Senior PD · 38, Staff Eng · 61) | Opening a candidate folds the scope by rule (board min 880): `[rail-tab│ Sourced│Screen│Interview│Final│Offer ~990 ║ candidate Peek 392]`. The requisition stays in the view crumb. The focus path is req → candidate → inspector |
| Saved | Ledger + Peek | Collections: Shortlist, Reading, Companies to watch | Mixed rows grouped by object type. The avatar slot shows a type glyph. The Peek anatomy adapts to the object type |
| Activity | Stream (timeline) | All, Mentions, Profile views, Applications, Hiring | `[scope│ day-grouped 40px log rows, Geist Mono time in a 64px gutter ║ Peek = source object]` |
| Profile | Document | **Outline** (About, Experience, Work, Skills, Writing, Recommendations) | `[scope outline│ identity band 160 full width / text 680 + facts 240 ]`. Scroll-spy moves seam 1 down the outline. No inspector until a work item opens in Reader |

**Constant across modes:** the rail, the context line and its zone anchoring, the two seams, the key line at y=996, J/K and ↵/Esc semantics, the inspector slot's position and resize behavior, the footer key hints, type, tokens and motion. **What changes:** the surface's internal composition, the scope's contents, the inspector's width class (none / Peek / Reader), and the mode's minimum width, which drives the yield order.

---

## 6. People workspace

**Scope column (x 56–264).** Items span x 64–256, 28h, radius 6, with text at x=76 in 13/18 400 `text-2` and counts right-aligned at x=248 in Geist Mono 11/16 `text-4`. Section labels are 11/16 600 `text-3`, 24h, sentence case, with a 24px `+` button at x=228 on "Views".
- Views (from y=52): All people 18.2k · **Design leads · Bay Area 142** (active: extends to x=265, fill canvas #121212, `text-1`, left radius 6, right radius 0, **seam 1**) · Staff engineers, fintech 67 · Figma & Tessellate alumni 311 · Hiring · Design Q4 38 (shared: 12px two-person glyph plus a 14px "AR" monogram before the count).
- Segments (relationship-based): Following 248 · Mutuals 1,204 · Intro requests 3 (count in `text-1`) · Reached out 19 · Viewed you 27.
- Recent: the last 4 inspected people, as 16px monograms plus a name. This is the visible side of the back-history.
- Footer (996–1024): kbd `[` "hide" · `⌥1–5` "views", Geist Mono 11/16 `text-4`.

**Query bar (45–93).** The search input is at x=281, 160 × 28 (with inspector open), with `inset` #171716 fill, radius 6, a 14px search glyph, placeholder "Search 142" in `text-4`, and kbd `/` at its right end. After a 1px `line-1` vertical divider, 16px tall, comes the **filter sentence**: *¹Product designers ²Senior or above ³in Bay Area or remote ⁴with design systems*, set in 13/18 500 `text-1`. The connecting words ("in", "with", "or above") are 400 `text-3`. Each clause carries a Geist Mono 10/14 500 `text-4` index, raised 4px. Clauses are plain text with no fill. On hover a clause gets a 1px dotted `text-3` underline, and on click it opens a clause editor menu. "+ clause" is a 13/18 `text-3` ghost. The sentence wraps to a second line (the bar grows to 72px) rather than hiding clauses.

**Result line (93–125).** Left, at x=281: "142 people · 18 new since Sep 21" 12/16 `text-3`, with "18 new" in `text-2` as a clickable filter. Right-aligned to x=1031: "Group: Availability ▾" and "Sort: Fit ↓ ▾" as 12/16 `text-2` ghost buttons, 24h. An unsaved change to the view shows a 5px `text-2` dot after the view crumb and a "Save view" ghost button here.

**Column header (125–153).** 11/16 500 `text-3`: Name (x=325) · Location (569) · Fit (685) · Availability (845) · Context (949). The sorted column shows a 10px arrow in `text-2`. Hovering a header shows `⋯` (sort, hide, move).

**Row anatomy (56h, x 265–1047).**

| Part | x / w | Line 1 (13/18) | Line 2 (12/16) |
|---|---|---|---|
| Focus tick | 265, 2 × 24 centered | orange, selected row only | — |
| Avatar | 281, 32 × 32 circle | monogram 12/16 600 | — |
| Identity | 325, w232 | name, 500 `text-1` | role · company, 400 `text-2`, truncated |
| Location | 569, w104 | city, 400 `text-1` | work mode "Hybrid" / "Remote", `text-3` |
| Fit | 685, w148 | 4 fit ticks + "4/4" Geist Mono 11 `text-2` | evidence: matched terms, `text-2` ("Design systems, Figma API") |
| Availability | 845, w92 | 6px dot + state, 400 `text-1` | terms ("Full-time", "From Jan 27"), `text-3` |
| Context | 949, w82 | relationship, `text-2` ("3 mutuals") | provenance, `text-3` ("Replied to you") |

**Fit, without percentages.** Each **fit tick** is 4 × 12, radius 1, 2px gap, and stands for one clause of the filter sentence in order. Filled `text-2` = satisfied; 1px `line-2` outline = not satisfied. Hovering tick ³ underlines clause ³ in the query bar, and hovering a clause dims every row's tick in that position except the satisfied ones. So relevance is never a number that STRIVO computes and hides. It is the user's own query answered row by row. Sorting by Fit orders by clauses met, then by evidence strength (tenure in the matched skill).

**Availability states.** Open now (`sage` #8FAA84 dot) · Open selectively (`ochre` #C4A262) · Interviewing elsewhere (`steel` #8497AE) · Not looking (1.5px `text-4` ring, hollow). The labels are short in the row ("Now", "Selective"). The full text lives in the inspector.

**Rows visible.** Open now: Tomas Ekholm (Senior Product Designer · Parcelwise, SF, 4/4, Full-time, "2 mutuals / via Ana Ruiz"), Aiko Brandt (Lead Designer, Payments · Vireo Bank, Berkeley, 3/4, Contract, "Follows you"), Dev Malhotra, Hanna Sorensen, Kwame Asante, Lucia Ferrand, Omar Siddiqui. Open selectively: Beatrix Holm (Ledgerline), Jun Park (Halden), **Ines Achterberg** (Principal Product Designer · Ledgerline, Oakland / Hybrid, 4/4 "Design systems, prototyping", Selective / From Jan 27, "3 mutuals / Replied to you"), Sam Okoro, Clara Vey, Mateo Ruiz-Lang, Yara Haddad.

**States.**
- Hover: fill `hover` #161615. The Context column cross-fades to three 24px ghost icon buttons at x 951 / 979 / 1007: Save (bookmark), Follow (plus-person), `⋯` (menu). The avatar swaps to a 14px checkbox (`line-2` border, radius 4) for multi-select.
- Selected, inspector open: fill `raised` #191817 across x 265–1048, which covers the separator (**seam 2**). Focus tick in orange. The name stays at 500 (no weight change, so nothing jumps).
- Selected, inspector closed ("quiet selection"): the same fill, the separator stays intact (no seam), and the tick is `text-3`. Selection persists across sort, filter and section switches.
- Multi-select (`X` or checkbox): fill #171615 with the checkbox checked in `text-1`. At 2 or more, the inspector shows "3 selected" with batch actions (Save to…, Add to view, Request intros).
- Keyboard focus without selection (Tab): 1px inset `accent` outline at 60% opacity.

**Keyboard.** `J`/`K` or `↓`/`↑` moves the selection, and the inspector follows. `↵` opens the full profile (Document mode; pushes history). `Space` toggles the inspector while keeping the selection. `Esc` closes the inspector, then clears the selection. `X` multi-selects. `S` saves, `F` follows, `I` requests an intro. `/` focuses search, `⌥/` adds a clause, `[` hides the scope, `]` hides the inspector, `⌥1–5` switches views, `⌘K` opens commands. Right-click on a row opens the `⋯` menu at the pointer.

**Loading.** Rows render as skeletons at exact column positions, as `raised-2` bars (name 120 × 8, role 168 × 6, fit ticks as outlines) that pulse opacity 0.5↔0.8 over 1.2s. There is no shimmer, and headers and the query sentence render immediately. **Empty** (no rows match all clauses): set at x=325 in the rows area, 13/18 `text-2`: "No one matches all 4 clauses." Below it, per-clause relaxations with counts as ghost buttons: "Drop ³ in Bay Area or remote → 61 people", "Drop ² Senior or above → 23". **Zero-state view:** the sentence is empty and shows the placeholder "Describe who you're looking for" in `text-4`.

---

## 7. Person inspector (x 1048–1440, content x 1068–1420, w352)

The inspector's header lives in the context line's inspector zone (crumb, 10/142, ↑↓, ×). The body starts at y=45 and scrolls independently. Sections are separated by 16px of space and a heading. The only hairline in the body sits under the action row.

1. **Identity (65–147).** Avatar 48 circle at (1068, 65), monogram "IA" 16/20 600 on `mono-3` (#232826 / #A9C3B8). At x=1128: **Ines Achterberg** 20/24 600 `text-1`, −0.012em. Then "Principal Product Designer at Ledgerline" 13/18 400 `text-2`. Then "Oakland, CA · Hybrid · 09:14 local" 12/16 `text-3` (the time in Geist Mono). Then an `ochre` dot + "Open to selective offers · from January 2027 · Full-time or lead contract" 12/16 `text-2`.
2. **Actions (167–199).** **Request intro via Ana**: primary, 32h, `accent` #E5712C fill, `accent-ink` #1C0F06 text 13/18 600, radius 6, x=1068, w176. **Follow**: secondary, 32h, `raised-2` fill, `line-2` border, w72. **Save**: 32 × 32 bookmark icon button. **⋯**: 32 × 32 (Message, Add to view, Copy link, Hide from this view). A 1px `line-1` hairline follows at y=215.
3. **Fit · Design leads · Bay Area (223–351).** Label 11/16 600 `text-3`, with "4/4" right-aligned in Geist Mono. Four 24h lines, each made of an index (Geist Mono 10 `text-4`), the clause (12/16 `text-2`), a check glyph (12px `sage`) and evidence right-aligned (12/16 `text-1`):
   ¹ Product designer: *Principal, 13 yrs* · ² Senior or above: *Principal since 2023* · ³ Bay Area or remote: *Oakland, hybrid* · ⁴ Design systems: *led Ledgerline DS, 3 yrs*.
4. **About (367–483).** 14/21 400 `text-1`, max 4 lines, then "More" in `text-3`. The text: "Designs financial tools that stay legible under pressure. Leads the design system and the approvals product at Ledgerline; before that built the prototyping engine at Tessellate. Cares about density, keyboard-first workflows, and writing that ships with the interface."
5. **Experience · 13 yrs (499–711).** First a **tenure strip**: a 352 × 4 bar, 2013 → now, with segments proportional to tenure and separated by 2px gaps. The current role is `text-1` and older roles step down through `text-3` → `line-2`. Year ticks sit below it ("2013", "2019", "2026"), Geist Mono 10 `text-4`. Then 4 entries, 40h each, with a 20px company square (radius 4, `raised-2`, initial 10/14 600 `text-2`), role 13/18 500 `text-1`, company 12/16 `text-3` under it, and years right-aligned in Geist Mono 11 `text-3`:
   - Ledgerline, Principal Product Designer, 2023–now
   - Tessellate, Staff Designer, Prototyping, 2019–2023
   - Orbital Health, Senior Product Designer, 2016–2019
   - Kinfolk Studio, Interaction Designer, 2013–2016
6. **Selected work (727–911).** Two cells, each 168 × 112 at radius 8, with a 16px gap. Captions follow as 13/18 500 title and 12/16 `text-3` meta.
   - *Approvals 2.0*, Ledgerline, 2025. "Median approval time 26h → 4h." Thumbnail: `#1B1A18` ground, a 3-node vertical stepper at x+16 (5px `sage` dots joined by a 1px `line-2` line), and four 6px-tall bars at 60/80/48/72% width in `#34322F`, the second highlighted `#3F3C38`.
   - *Prototype Engine*, Tessellate, 2021. Thumbnail: `#171615` ground with six 10px square nodes in a 3 × 2 lattice, joined by 1px `#4A4742` orthogonal connectors, one node outlined in `text-2`.
7. **Skills (927–).** A 2-column text list, 24h rows, 13/18 `text-1`, with the endorsement count in Geist Mono 11 `text-4`: Design systems 41 · Interaction design 36 · Prototyping in code 22 · Fintech workflows 19 · Design writing 14 · Figma plugin dev 9. Skills that match a clause are shown in 500 weight. No pills.
8. **Shared context.** Three rows of 20px monograms + 12/16 text. "Ana Ruiz worked with Ines at Tessellate, 2019–2021" · "Kofi Mensah and 1 other follow her" · "Replied to your post *Approval flows are org charts*, Sep 12".
9. **Footer (996–1024, on the key line).** "Profile updated 2d ago" 11/16 `text-4` on the left; `↵` "Open full profile" on the right.

**Resize.** The handle is the separator at x=1047, with a 9px hit zone (x 1043–1051). After 150ms of hover the line turns `line-2`, the cursor becomes `col-resize`, and a 3 × 28 grip (`text-4`, radius 2) appears at the pointer's y. While dragging, a Geist Mono 11 `text-3` width readout ("392") shows in the context line centered on the separator. Snap points are 336 / 392 / 448 / 560, with 8px magnetism. Range: 336–560. Double-click resets. Seam 2 moves with the separator during the drag. The width persists per mode.

**Close.** Close with `×`, `Esc` or `]`. The selection becomes quiet (§6), the inspector crumb leaves, and the surface regains its Context column. Reopen with `Space`/`]`/click, which restores the scroll position.

---

## 8. Tokens

### 8.1 Color

| Token | Hex | Use |
|---|---|---|
| `chassis` | #0E0E0D | frame: context line, rail, scope |
| `hover-chassis` | #161615 | hover in rail/scope |
| `canvas` | #121212 | work surface; the seam-1 tab |
| `hover` | #161615 | row hover |
| `inset` | #171716 | inputs on canvas |
| `raised` | #191817 | inspector; selected row (seam 2); active rail cell |
| `raised-2` | #22211F | secondary buttons, command trigger, kbd, skeletons |
| `overlay` | #22211F + shadow `0 16px 40px -8px rgba(0,0,0,.6)`, inset `0 1px 0 rgba(255,255,255,.03)` | menus, palette, Alt-peek |
| `scrim` | rgba(8,8,7,.5) | behind the palette only |
| `line-1` | #242321 | panel edges, column header, key line |
| `line-2` | #33312E | control borders, hovered separator, outlined fit ticks |
| `text-1` | #EDE8E1 | primary |
| `text-2` | #B5AEA5 | secondary |
| `text-3` | #857F78 | tertiary, labels |
| `text-4` | #5D5954 | hints, indices, disabled |
| `accent` | #E5712C | see restraint below |
| `accent-hover` / `accent-press` | #EE7E3A / #CF6322 | primary button |
| `accent-ink` | #1C0F06 | text on accent |
| `sage` | #8FAA84 | open now, satisfied check |
| `ochre` | #C4A262 | open selectively |
| `steel` | #8497AE | interviewing / in process |
| `brick` | #C0766A | destructive, rejected (rare) |

**Orange is used in exactly four places:** the one primary button per screen, the 2px focus tick on the deepest selection, the unread dot on the bell, and keyboard focus rings (60% opacity). It never appears as a background wash, in icons, in charts or in headings.

**Monogram palette** (bg / fg; hashed from the name): #2B2621/#D8B99C · #20262A/#A9BFCC · #252A22/#B4C4A2 · #2A2228/#CDB1C4 · #2A2720/#D3C49B · #22242A/#B3B7D1 · #232826/#A9C3B8 · #2A2320/#D5A897. Every avatar gets an inset ring `rgba(255,255,255,.04)`. Companies use squares (radius 4) and people use circles.

### 8.2 Type

Families: **Schibsted Grotesk Variable** (`@fontsource-variable/schibsted-grotesk`, wght 400–600 used) for everything; **Geist Mono Variable** (`@fontsource-variable/geist-mono`, 400/500) for numbers that are data: counts, years, times, indices and kbd. Schibsted's sturdy, slightly editorial grotesk carries names well at 13px and does not read as a default. Use `font-feature-settings: "tnum"` wherever numbers align.

| Size / LH | Weight | Family | Role |
|---|---|---|---|
| 28 / 32, −0.016em | 600 | Schibsted | Profile name (Document mode only) |
| 20 / 24, −0.012em | 600 | Schibsted | inspector name |
| 16 / 20 | 600 | Schibsted | Stream/Document section titles; monogram 48 |
| 14 / 21 | 400 | Schibsted | inspector bio, post body |
| 13 / 18 | 400 · 500 · 600 | Schibsted | base UI, row line 1, crumbs (500), section name (600), buttons (600 primary / 500 others) |
| 12 / 16 | 400 | Schibsted | row line 2, meta, result line, avatar monogram 32 (600) |
| 11 / 16 | 500 · 600 | Schibsted | column headers (500), section labels (600) |
| 11 / 16 | 400 | Geist Mono | counts, years, local time, "10/142", width readout |
| 10 / 14 | 500 | Geist Mono | kbd, clause indices, badge counts |

### 8.3 Space, radius, stroke, heights

- **Spacing:** 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64. Panel gutters: surface 16, inspector 20, scope 8 (item) + 12 (text).
- **Radii:** 0 panels and rows · 1 fit ticks · 2 grips · 4 kbd, checkbox, company squares · 6 buttons, inputs, nav cells, scope items, menu items · 8 thumbnails, menus, palette · full for avatars and dots.
- **Icons:** hand-drawn inline SVG, `currentColor`, no fills. Rail icons are drawn in a 20 box at 1.5px stroke; UI icons in a 16 box at 1.25px stroke. Square caps, miter joins, geometry on a 2px grid, only 90°/45° angles; circles are reserved for people. Nav glyphs: Home = three horizontal strokes 14/10/14 (a stream) · People = 6px circle over an open 12px shoulder arc · Companies = three bars 8/14/11 on a baseline · Jobs = 14 × 10 rectangle with a 6px handle notch · Projects = 2 × 2 grid of 5px squares with one missing · Applications = vertical track with three 3px nodes, the last one hollow · Hiring = converging funnel lines 14 → 4 · Saved = 10 × 14 bookmark notch · Activity = three 10px strokes, each with a leading 2px dot.
- **Heights:** context line 44 · rail cell 36 · scope item 28 · query bar 48 · result line 32 · column header 28 · group header 28 · person row 56 (Comfortable) / 40 (Compact: single line, role inline in `text-3`) · menu item 28 · palette row 36 · palette input 44 · buttons 24 (toolbar) / 28 (default) / 32 (inspector) · footers 28 · kbd 16.

---

## 9. Motion grammar (motion/react)

Shared transitions:
```
panel = { type: "spring", stiffness: 420, damping: 40, mass: 0.9 }   // ζ≈1.03, settles ≈260ms, no overshoot
seam  = { type: "spring", stiffness: 700, damping: 52, mass: 0.8 }   // ζ≈1.1, ≈180ms
snap  = { type: "spring", stiffness: 600, damping: 46, mass: 0.8 }   // ζ≈1.05, rail/scope indicators
out   = { duration: 0.16, ease: [0.2, 0, 0, 1] }
exit  = { duration: 0.09, ease: [0.4, 0, 1, 1] }
```

- **Inspector open.** The panel's width animates 0 → 392 (`panel`). The surface yields at the same time through `layout` on its columns, so columns never jump. The inner content has a fixed width of 392 and animates x 16→0 and opacity 0→1 (`out`, 40ms delay). Seam 2 opens once the panel passes 90% width: the row fill extension scales X 0→1 from its left edge over 100ms. The context line's inspector crumb fades in with y 3→0. **Hand-off:** only when opening from closed, the row avatar (`layoutId="avatar-{id}"`, a ghost copy) travels to the inspector avatar slot and grows 32→48 (`panel`). The row keeps its own avatar.
- **Inspector close.** The content fades out (`exit`), then the width goes 392 → 0 (`panel`). The seam closes first (60ms), so the separator is whole before the panel moves.
- **Selection change (J/K, click).** The row fill + tick is a single `motion.div layoutId="focus"` that moves under `seam`. Inspector content swaps by **opacity only** (100ms cross-fade, keyed by person), with no slide and no re-stagger, so rapid comparison stays spatially still. The crumb text and "10/142" swap instantly.
- **Row hover.** Fill fades in over 60ms and out over 140ms (CSS). The hover actions fade in over 100ms with x 4→0. Nothing scales.
- **Nav selection.** The rail active cell uses `layoutId="rail-active"` (`snap`). The scope active item uses `layoutId="scope-seam"` (`snap`). Icon color changes over 120ms.
- **Section switch.** The frame never moves. The outgoing scope and well content fade out (`exit`), and the incoming content fades in with y 4→0 (`out`). If the new mode changes panel widths (e.g., Jobs → Reader 560), the widths animate under `panel` and the context-line zones slide to their new anchors with the same spring, so the crumbs visibly stay attached to their panels.
- **Scope fold (`[`).** Width 208 → 0 (`panel`). Seam 1 hands off to the rail tab through a shared `layoutId="seam-1"`.
- **Command palette.** The scrim fades in over 120ms. The palette (600w, top at y=56, centered on the well at x=552) animates opacity 0→1, y −6→0 and scale 0.985→1 over 160ms `out`, and exits with opacity only over 90ms. Result height changes use `layout` over 140ms. Rows are 36h, with prefixes `>` commands, `@` people, `#` companies, `/` views, and a right-aligned kbd per row.
- **List entrance.** On first mount or a view switch, rows animate opacity 0→1 and y 4→0 (`out`) with a 14ms stagger, capped at 14 rows; the rest appear instantly. On filter change there is no stagger: leaving rows fade out over 80ms, and remaining rows use `layout="position"` (`panel`) only when 30 or fewer rows move.

**Restraint rules.** Motion only reports spatial change (open, move, swap), never decoration. No overshoot (all springs ζ ≥ 1). No hover or press scaling; a press only darkens the fill. Only one moving group per interaction. Nothing loops except skeleton pulses. With `prefers-reduced-motion`, transforms and layout animations are replaced by 100ms opacity fades, and `layoutId` moves become instant.

---

## 10. Mature details (and where each lives)

| Detail | Location |
|---|---|
| Two open seams tracing the focus path | well left edge at the active view (y 104–132); surface/inspector separator at the selected row |
| Crumb separators on panel boundaries | context line, `›` centered on x=264 and x=1047 |
| Back/forward + history menu (long-press) | context line scope zone, x 64/90 |
| Position readout "10/142" + ↑↓ | context line inspector zone |
| `⌘K` trigger (64px, not a search bar) | global end, x 1332 |
| Unread dot → Activity opens in the inspector slot | bell, x 1404 |
| Saved views with counts, shared-view owner monogram | scope "Views" |
| Unsaved-view dot + "Save view" | after the view crumb; result line |
| Numbered filter clauses ↔ fit ticks | query bar ↔ Fit column ↔ inspector Fit block |
| Per-clause relaxation counts | empty state |
| Hover actions replace the Context column (no overlay on text) | row, x 951–1031 |
| Avatar → checkbox on hover | row, x 281 |
| Quiet selection when inspector closed | selected row keeps fill, tick goes gray |
| Resize grip at pointer y + live width readout + snap points | separator x=1047; readout in context line |
| Key line: three footers on one hairline with per-panel key hints | y=996 |
| Rail badge (Activity "7"), status dot (Applications) | rail icons, top-right |
| Alt-peek labels | overlay strip from x=56 |
| Local time for each person | row Location line 2 on hover; inspector identity |
| Recent people list mirroring history | scope bottom |
| Column header `⋯` (sort/hide/move) | column header on hover |
| Right-click = row `⋯` menu at pointer | anywhere on a row |

---

## 11. Anti-generic audit

| Risk | Where it could happen | How the spec prevents it |
|---|---|---|
| LinkedIn clone | person header with banner, "Connect" button, big avatar, blue | No banners anywhere. The avatar is 48 in the inspector and 32 in rows. The primary action is situational ("Request intro via Ana"), not a universal Connect. Relationship appears as provenance text ("Ana worked with her at Tessellate") rather than degree badges. The feed is a 600 column with an annotation margin, not cards. |
| shadcn demo | 8px radius on everything, outline buttons, Inter, badge pills, cards | Panels and rows have 0 radius and there are no card containers. Filters are a sentence, not chips, and skills are a text list with counts. The type is Schibsted Grotesk + Geist Mono. Gallery cells share hairlines like a sheet instead of floating as cards. |
| AI dashboard | match-% rings, sparkle icons, gradient accents, "AI insights" | Relevance is shown as the user's own clauses, ticked, with evidence. There is no score and no gradient. Orange has four enumerated uses. The only chart is the tenure strip, a 4px data bar. |
| Generic three-column SaaS | always rail + list + detail | There are five modes with explicit minimum widths. The inspector has none/Peek/Reader widths. Hiring folds the scope by rule, and Profile has no inspector. |
| Header-bar sameness | logo, search bar, avatar top-right | The context line has no search field. Crumbs are anchored to panels with separators on the seams. The account lives in the rail. The bell opens into the inspector slot. |
| Decorative "premium" | glass, glow, big shadows | Only overlays have a shadow. Surfaces step in three flat levels (#0E0E0D → #121212 → #191817), and depth is shown by where the seams open, not by effects. |
| Logo-swap test | — | What stays distinctive without the logo is structural: the staircase of surface levels, the open seams, the map-style context line, the fixed yield order, and clause-indexed fit ticks. The mark itself is the staircase. |
