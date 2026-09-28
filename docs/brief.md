# STRIVO desktop shell: design brief

(Verbatim product brief from the requester. "STRIVO" is the product name.)

React motion. Design a world-class desktop application shell for STRIVO — a professional network and career operating system.

Canvas: 1440 × 1024. Desktop web application. High-fidelity product UI, not a landing page, not a concept shot, not a dashboard template.

STRIVO combines several major product areas inside ONE coherent application:
professional feed · people discovery · rich professional profiles · companies · jobs · freelance projects · applications · hiring / employer workflows · saved items · activity and notifications

The goal is NOT to make all these screens look identical. The goal is to design a strong APP SHELL capable of hosting very different task-specific working surfaces while still feeling like one mature product.

REFERENCE QUALITY: Linear, Raycast, Framer, Figma, Confluence, Attio, Vercel. Do NOT visually copy them. Extract their level of product maturity, spatial discipline, information density and interaction clarity.

## Core idea
STRIVO should feel like one professional operating environment. The shell must be calm and persistent. The work surface must dominate the screen.
Think: stable application frame + changing task-specific workspace + optional contextual inspector.
Do not build a classic SaaS dashboard.

## Structure
1. GLOBAL NAVIGATION — compact left navigation area. Destinations: Home, People, Jobs, Companies, Projects, Applications, Hiring, Saved, Activity. Not a giant 240px sidebar full of text. Explore: compact rail, grouped navigation, icon + label only where necessary, subtle hierarchy, account/profile at bottom, minimal visual chrome. Navigation integrated into the application frame rather than placed inside a floating card.
2. TOP APPLICATION CONTEXT — subtle application-level header: current location, breadcrumbs only when useful, global search / command access, contextual actions, view controls, notifications, account. Do NOT create a giant search bar across the whole screen. Linear / Raycast level restraint.
3. WORK SURFACE — the central area is the main product; must support multiple spatial compositions. Show the shell in a PEOPLE DISCOVERY state: people search, filters, dense professional results, selection, contextual person preview. Make it obvious that the same shell could also support: Feed → focused stream; Jobs → list + job detail; Profile → full-width identity page; Companies → discovery surface; Projects → marketplace/work surface; Applications → workflow/status surface; Hiring → candidates + pipeline + inspector. The shell must not visually force every section into three fixed columns.
4. CONTEXT INSPECTOR — optional contextual inspector on the right, appears only when selection requires additional context. For People: select one person → rich person inspector (identity, headline, location, availability, professional context, skills, current company, selected work, primary action). Integrated into the product, not a generic modal or floating card.
5. SPATIAL GRAMMAR — global shell › local controls › primary work surface › selection state › contextual inspector. Use precise panel boundaries, restrained separators, subtle surface differences, strong alignment, compact controls, deliberate whitespace, high information density. Avoid excessive card containers. Sections separated through spacing and typography rather than rounded rectangles.
6. VISUAL LANGUAGE — extremely modern 2026–2027 product design. Professional, calm, dense, precise, confident. Editorial where appropriate, technical where appropriate.
   STRIVO design language: dark neutral canvas around #121212; slightly elevated surfaces around #191817; soft warm off-white text instead of pure white; muted warm gray secondary text; subtle low-contrast borders; orange accent used sparingly.
   NO neon. NO glowing gradients. NO glassmorphism. NO huge rounded cards. NO excessive pills. NO giant hero typography. NO colorful SaaS illustrations. NO generic shadcn dashboard aesthetic. NO "AI startup" visual language.
   Sophistication comes from layout, hierarchy, typography, density, alignment, interaction architecture — not decoration.
7. PEOPLE WORKSPACE EXAMPLE — People is the active section.
   LEFT persistent global navigation. CENTER People workspace: compact header (People, search, small view/filter controls), then professional results: avatar, name, role, company, location, professional relevance, skills where useful, availability/status, relationship/context. Do not turn every result into a huge card. Use sophisticated rows or hybrid identity blocks.
   RIGHT selected Person inspector. Show a senior designer / product professional. Inspector: identity, professional headline, current company, availability, short bio, experience snapshot, selected project/work, skills, Follow / Save / relevant action. The entire experience should feel purpose-built for evaluating professional people.
8. PRODUCT COHERENCE — most important: this shell must plausibly support all sections without redesigning the frame. Same product when switching People → Jobs → Feed → Profile → Hiring, but the INNER WORKSPACE may change significantly. Consistency from navigation, panel behavior, headers, spacing, interaction grammar, selection, context, typography, object representation — NOT from making every screen use the same layout.
9. PRODUCT MATURITY — subtle details: selected navigation state, keyboard shortcut hints, saved filters, view switcher, context menu triggers, hover actions, persistent selection, resizable panel indication, back/forward context, command palette affordance, subtle status indicators. Do not overload the screen.
10. FINAL QUALITY TEST — must NOT look like: LinkedIn redesign, generic HR SaaS, Dribbble dashboard, admin template, shadcn UI demo, social media clone, AI-generated dashboard. It should look like a real product team spent months designing the foundation of a professional operating system. If replacing the logo with another SaaS name still makes the design feel generic, the concept has failed. Make the app shell itself distinctive through structure, proportion and interaction logic.

Render one complete high-resolution 1440px desktop People workspace inside this shell.
