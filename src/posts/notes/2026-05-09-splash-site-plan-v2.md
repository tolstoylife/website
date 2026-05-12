---
title: "Splash site — plan (2)"
description: "Second iteration of the splash-site plan: four-task sequence (design tokens, license, homepage rebuild, nav) with homepage sections defined."
date: 2026-05-09
tags: [design]
draft: false
---

*Planning document for the tolstoy.life public homepage and documentation.*

---

## Task order

Four sequenced tasks, in this order:

1. **Design-system port + Penpot token sync** — port JEDEE's evolved token pipeline (`semanticColors.json`, `typography.json`, `build-penpot-tokens.js`, `build-design-md.js`, `--color-accent-*` CSS layer, `themeColor-*` → `base-*` rename), then retoken with tolstoy.life's period palette, then run the pipeline and import into Penpot.
2. **License finalisation + SDG graphic** — tighten the LICENSE prose; integrate the illustrator's vectorized Soli Deo Gloria graphic (with and without caption) once delivered.
3. **Splash homepage rebuild** — replace `website/src/pages/index.njk` with the public homepage described below.
4. **Documentation build pipeline** — markdown → HTML via Eleventy, replacing the current ad-hoc HTML generator in `docs/`.

Sections further down describe the content and structure of Task 3 in detail. Tasks 1 and 2 are prerequisites for Task 3 — no homepage CSS work begins before tokens and license land. Task 4 can run in parallel with Task 3 because it touches the build, not the design tokens.

---

## Decisions made

### Tech stack
The splash site is no longer a separate site at all — it becomes the homepage of the main `tolstoylife/website` installation (Eleventy Excellent + Every Layout + CUBE CSS). The previous Astro splash repo (`tolstoylife/splash`) is retired once the new homepage is live.

One stack across all frontend work, with Every Layout primitives and the established design system already in place.

### Repo structure
The splash page and docs section live in `tolstoylife/website` — the same repo as the main tolstoy.life site. This means the splash page becomes the homepage of `website/`, and the design is literally the alpha of the final site — same tokens, same Every Layout primitives, same CUBE CSS blocks. No migration step later, no design decisions to carry over.

The `docs/` sync script still exists (docs originate in the Tolstoy research repo), but the destination is cleaner and the href rewriting simpler because it is one Eleventy build.

### Draft content and collaborator access
Wiki pages under active development use Eleventy's `draft: true` frontmatter flag, which excludes them from production builds. Two Netlify deploys are configured from the same repo and branch:

- `tolstoy.life` — production build, published content only
- `preview.tolstoy.life` — separate Netlify site, all content including drafts, for collaborators. Password-protected if needed.

This keeps everything in one repo and one branch (`main`) with no branch management overhead.

**AGENTS.md, CLAUDE.md, MANIFEST.md** remain at the Tolstoy repo root as technical documentation, rendered natively by GitHub for collaborators and technical visitors.

### Documentation aesthetic
Single-column layout. No sidebar. No Docusaurus or Starlight — those carry a developer-product aesthetic that doesn't suit a literary research project. The existing DocsLayout style (paper-like, generous reading measure) is the right direction; carry it forward into the Eleventy rebuild using Every Layout primitives and the design-system fonts.

---

## Audience

The homepage addresses everyone in plain terms. The project is focused on reaching ordinary people — readers of Tolstoy, anyone curious about how a long-form public-domain reference work is built. Institutions (archives, libraries, cultural heritage organisations) are a secondary concern; the same content speaks to them without special framing.

The page does not divide its voice between a "general public" register and a "scholarly / institutional" register. One register, factual and direct, for everyone.

---

## Start page structure

The start page is a rework of MANIFEST.md into a public statement, not a one-to-one port.

### 1. Hero
- The decorative ornamental T (current placeholder logo, dark background)
- Tagline: *The life and works of Leo Tolstoy*
- Countdown ticker directly below — counting down to **9 September 2028** (Tolstoy's 200th birth anniversary). Display: days, hours, minutes, seconds. Typographic treatment, not flashy.

*Note: The illustrator may deliver a proper tolstoy.life logo. When it arrives, it replaces the decorative T.*

### 2. Project statement
Three or four sentences drawn from MANIFEST "What this is". Keep the directness of the original — "It is not a Wikipedia mirror. It is not a popular biography." is strong enough to preserve almost verbatim. Plain register; no audience-specific framing.

### 3. Editorial focus
One short paragraph on the late period. This is what makes tolstoy.life distinct: treating Tolstoy's post-1878 religious, philosophical, and social writings with the same seriousness as the great novels. Stated as fact, not as a signal to any particular reader.

### 4. Collaborate
A section pointing to the GitHub organisation.

> *The project is built in the open. Contributions are welcome.*
> [Join us on GitHub →](https://github.com/tolstoylife)

Anyone — readers, contributors, institutions — can see exactly what is being built.

### 5. License — Soli Deo Gloria
The SDG section with:
- The illustrator's **SDG lettering graphic** (donated, vectorized; arrives later — placeholder in the meantime). Two variants will be available: graphic only, and graphic with the caption *"Soli Deo Gloria"* underneath.
- The Bach paragraph from the LICENSE file as the introduction to this section:
  > *Johann Sebastian Bach inscribed these words on his manuscripts to declare that his work belonged not to himself but to something greater. Leo Tolstoy held the same conviction…*
- Brief statement of the public domain dedication
- Link to full LICENSE

*Note: The license text is finalised in Task 2, before this section's copy is written.*

### 6. Documentation link
A quiet link into the `/docs` section.

### 7. Tolstoy quote
A direct quote from Tolstoy — from his diaries **or letters** — on copyright renunciation or the free flow of knowledge. Gives the page literary texture and grounds the SDG license in his own words rather than just editorial framing. Sits naturally as a bridge between sections, likely between the editorial focus and the license section. Source from the Jubilee Edition; needs dedicated research to find the right line.

**This is a major research task.** Tolstoy's views on copyright and private property — including his active efforts to renounce ownership of his own work — have been systematically under-represented and at times suppressed by the very institutions that hold and profit from his legacy. Web searches consistently fail to surface the primary source material. Finding the right quote requires working directly in the Jubilee Edition, not secondary sources.

**Interim placeholder** (widely documented, verifiable): his 1891 public notice in Russian newspapers — *"I give permission to all who wish it to reprint, without any payment, any of my works written after 1880."* Direct and plain. Usable as a placeholder until a stronger line is found.

**The real prize**: a letter or diary passage — likely mid-1890s — where he reflects on the absurdity of owning thoughts, or on knowledge as inherently common property. The letters in particular are a strong candidate; over 50,000 survive and the relevant correspondence often states his position more openly than the diaries. If found and verified against the Jubilee Edition, this replaces the 1891 notice.

### 8. Sense of scale
One short line near the top conveying the ambition in concrete terms — gentle, fact-based, no marketing cadence. Something close to: *"The Jubilee Edition runs to ninety volumes. Tolstoy's surviving letters number in the tens of thousands. This site sets out to be a freely available reference to that body of work."* Plain numbers, plain framing. Implicitly explains why 2028 is the target without selling it.

### 9. Live progress — recent commits
Instead of a manually-written status note, this section loads recent commits from the tolstoylife GitHub organisation **at build time** using Eleventy's `@11ty/eleventy-fetch` plugin. Displays the last 5–7 commits across a whitelist of repos: date, repo name, and the first line of the commit message, each linking through to the commit on GitHub.

This replaces vague "in active development" language with verifiable, live evidence of work. Anyone can click through and see the actual commits. Commit messages should stay meaningful — `fix typo` or `wip` would undermine rather than build credibility.

**Technical approach:** server-side `fetch` via [`@11ty/eleventy-fetch`](https://www.11ty.dev/docs/plugins/fetch/) (already a dependency in `website/package.json`). Hits `https://api.github.com/repos/tolstoylife/{repo}/commits` per repo in the whitelist with a cache `duration` of about an hour. Renders to static HTML at build time — no client JS, no rate-limit risk on visitors, no JS-off degradation problem. If a fetch fails the section either renders stale-cached content or simply does not render that build.

### 10. Mailing list signup — launch notification
A simple "notify me when it launches" input for anyone who wants to be told when the wiki opens. People who find tolstoy.life in 2026 currently have no way to be notified — this closes that gap. Minimal: one email field, one submit button, no marketing language.

**Implementation: Netlify Forms** (free tier, 100 submissions/month per site). Plain `<form netlify>` HTML, honeypot field for spam, no client JS, no third-party signup. Buttondown was considered and rejected — its non-profit discount is only 50% off, which is not a meaningful free path. Netlify Forms simply collects addresses; for the actual launch announcement (one-time, near 2028) we export the list and send via a free transactional sender — MailerLite free tier (up to 1,000 subscribers) or self-hosted Listmonk. That sender choice can be made closer to launch.

If Netlify Forms turns out to be unsuitable later, the form HTML stays valid and we swap the action URL to a different receiver — the page itself does not change.

### 11. Contact
A plain contact line at the bottom of the page: `info@tolstoy.life`. This single address handles all enquiries for v1 — readers, contributors, institutions. Additional role-based addresses (e.g. `contribute@`, `institutions@`) can be added later if volume justifies it; both would route to the same inbox initially.

---

## Documentation section

- Built from `docs/` in the Tolstoy repo, synced via the existing script
- Single-column layout using Eleventy Excellent and Every Layout
- Public-facing but technically complete — no need to dumb down methodology or tooling details
- Same plain register as the homepage — no special "for institutions" voice

---

## Design system

The rebuild uses Eleventy Excellent with Every Layout and CUBE CSS — same as the main site. `website/` is currently a clone of the JEDEE design system (Johan's personal site), so the design tokens — colours, fonts, spacing — need to be replaced with tolstoy.life's own values before any serious CSS work begins.

### Layout and typography
- **Single column.** Composed from Every Layout primitives already shipping in the stack (Stack, Center, Box). No new layout block needed for the splash page.
- **Fonts come from the design system.** Whatever lands in `designTokens/fonts.json` after Task 1 is what the splash page uses — no page-specific font declarations.
- **Reader-side font and line-length controls** (typeface switching, measure adjustment, etc.) are explicitly **out of scope for this phase**. Captured here as a future-phase note.

### Font direction
The site has two distinct reading contexts with different needs:

- **Website and wiki** — modern feel, likely a humanist sans-serif. The wiki is a reference work, not a book: density, scannability, and clarity at small sizes matter more than literary warmth. A well-chosen sans-serif signals that this is a contemporary, maintained project.
- **E-reader / ebook** — a proper book serif, optimised for long-form reading. This is where the traditional literary register belongs. Readers spending hours with a text expect book typography.

Font choices to be decided as part of Task 1. The token keys (`--font-base`, `--font-display`, `--font-mono`) stay the same; only the values change.

### CSS organisation
The stack (Eleventy Excellent + Every Layout + CUBE CSS) imposes a structure: `global/blocks/` for reusable named blocks, `local/` only for genuinely page-specific styles, and CUBE class names treated as render hints rather than pixel-perfect bespoke selectors. **Following that structure matters more than producing files that match the homepage one-for-one.**

Rules for this rebuild:

- **No `local/homepage.css`.** The splash page has no truly unique-to-one-page styling needs that justify a page-specific stylesheet. Earlier drafts of this plan listed `hero.css`, `commits-feed.css`, `email-signup.css` and `homepage.css` — none are written.
- **Every new CSS file must be flagged in this plan and justified before it is added.**
- **Reuse what is already in `global/blocks/`** first: `prose.css`, `section.css`, `button.css`, `site-logo.css`, `seperator.css`, etc.
- The hero is rendered as a `section` block variant via data-attributes (CUBE-style), not as a new `hero.css`.
- The commits feed and email signup are layout-only — composed from existing blocks and Every Layout primitives, no bespoke block CSS.
- Only candidate new block: a small `countdown.css` for the bicentennial ticker, *if and only if* it cannot be expressed via existing utilities plus a tiny inline rule. Default assumption: no new files.

### Penpot
The Penpot token pipeline is already built in the JEDEE codebase and carries over to `website/` unchanged. No MCP needed — the workflow is:

1. Edit token JSON files in `src/_data/designTokens/`
2. `npm run colors` — regenerates CSS custom properties (only needed if `colorsBase.json` changed)
3. `npm run penpot:tokens` — generates `tokens/penpot-tokens.dtcg.json` and regenerates `DESIGN.md`
4. Manual import in Penpot: Tokens panel → import → select the file

`DESIGN.md` is an AI-readable design system spec regenerated by the same script — it's the bridge between the token JSON files and what Claude reads when working on the design system. The token JSON files are always the source of truth; the DTCG file and `DESIGN.md` are derived artifacts.

See `docs/design/penpot-tokens.md` for the full reference.

---

## Pending before build

Ordered to match the task sequence at the top of this doc.

**Task 1 — Design-system port + Penpot token sync (first):**

JEDEE has evolved meaningfully since `website/` was forked from it: a new `semanticColors.json` powers Penpot's `theme/light` / `theme/dark` sets, a `typography.json` carries composite type styles, the build pipeline now emits `DESIGN.md`, and `variables.css` has a `--color-accent-*` semantic layer between palette ramps and components. The schema port lands first; only after the port does Tolstoy's period-palette retoning make sense.

*Step 1a — Port JEDEE design-system updates.* See the **Files to port from JEDEE** inventory below. Schema and pipeline only at this stage; **colour values stay at JEDEE defaults during the port** so the diff is purely structural and reviewable. Tolstoy-specific values land in step 1b.

*Step 1b — Apply the Tolstoy period palette.* Edit `colorsBase.json` to the four-period palette from [docs/design/period-colours-research.md](docs/design/period-colours-research.md) (Green for Youth, Red for Soldier, Amber for Great Works, Blue for Prophet). Three open shade questions: amber vs gold for Period III, forest vs spring green for Period I, and whether the dark-theme amber accent reuses `amber-500` or steps lighter. Settle these as part of step 1b, not 1a.

*Step 1c — Font selection.* Choose typefaces for (a) website/wiki: humanist sans-serif, and (b) e-reader: book serif. Update `designTokens/fonts.json` and `typography.json` (composite type styles).

*Step 1d — Run the pipeline.* `npm run colors` (regenerates `colors.json`), then `npm run penpot:tokens` (regenerates `tokens/penpot-tokens.dtcg.json` and `DESIGN.md`).

*Step 1e — Penpot import.* Manual import of the DTCG file into the tolstoy.life Penpot file. Set theme set membership manually if Light/Dark themes import empty.

### Files to port from JEDEE (Task 1a)

Source: `/Users/johanedlund/Projects/JEDEE`. Target: `/Volumes/Graugear/Tolstoy/website`. Categories:

- **Wholesale copy** — files that don't exist in `website/` yet, or where the JEDEE version is the canonical design-system definition.
- **Merge** — files that exist in both with project-specific local changes; port the JEDEE design-system parts, keep the Tolstoy parts.
- **Skip** — JEDEE-specific (Strava, listening, reading, personal blog content) or Tolstoy-specific (wiki, works, schema). Not part of this port.

#### Wholesale copy

| Source | Purpose |
|---|---|
| `src/_data/designTokens/semanticColors.json` | Theme-aware bg/text/headline tokens. Drives Penpot `theme/light` and `theme/dark` sets. Currently absent from `website/`. |
| `src/_data/designTokens/typography.json` | Composite type styles (body, heading.1–3, blockquote, citation, caption) referenced by Penpot. Currently absent. |
| `src/_config/setup/build-penpot-tokens.js` | Generates `tokens/penpot-tokens.dtcg.json`. Currently absent — the `npm run penpot:tokens` script in the planned Step 1d points at this file. |
| `src/_config/setup/build-design-md.js` | Regenerates `DESIGN.md` (AI-readable design-system spec). Currently absent. |

#### Merge — schema port only, no value changes during 1a

| Source | What to port |
|---|---|
| `src/_data/designTokens/colorsBase.json` | Rename `palette[]` slots `themeColor-Darkest/Dark/Mid/Light/Lightest` → `base-darkest/dark/light/lightest` (drop `Mid`). **Keep all hex values untouched in 1a.** Tolstoy palette values land in 1b. |
| `src/_data/designTokens/fonts.json` | Adopt JEDEE's structural shape (the `penpot:` field per family the build script expects). Values stay JEDEE's during 1a; Tolstoy fonts land in 1c. |
| `src/_config/setup/create-colors.js` | One-line comment update reflecting the `base-*` slot rename. Logic unchanged. |
| `src/_config/utils/dtcg-to-tailwind.js`, `src/_config/filters/dtcg-items.js`, `src/_config/filters.js`, `src/_config/collections.js` | Read the JEDEE versions; port the design-system filter/collection additions; preserve any Tolstoy additions. |
| `src/assets/css/global/base/variables.css` | Introduce the `--color-accent-*` semantic layer; rename `--color-themecolor-*` references → `--color-base-*`. |
| `src/assets/css/global/base/global-styles.css` | JEDEE migrated direct `--color-orange-500` references to `--color-accent-orange`. Port that style of indirection. |
| `src/assets/css/global/blocks/button.css`, `external-link.css`, `main-nav.css`, `prose.css`, `site-footer.css`, `site-logo.css` | Same pattern: replace direct ramp references with `--color-accent-*`. |
| `src/assets/css/local/custom-card.css`, `details.css`, `footnotes.css`, `forms.css`, `pagination.css` | Same accent-layer migration. |
| `src/_includes/scripts/details.js`, `theme-toggle.js`, `src/assets/scripts/bundle/details.js`, `theme-toggle.js` | Read both versions; port any design-system-touching JS changes. |
| `eleventy.config.js` | Surgically add the `design:md` build hook and any new filter/shortcode registrations the new pipeline needs. Keep all Tolstoy additions (interlinker, drafts, wiki/works collections). |
| `package.json` | Surgically add the new scripts (`penpot:tokens`, `design:md`) and any required deps. Do **not** wholesale-replace — the `name`, version, and Tolstoy-specific deps must stay. |

#### Skip

- **JEDEE-only:** `src/_data/strava.js`, `src/_data/github.js`, `src/_layouts/{listening,reading}.njk`, `src/pages/{listening,reading,get-started}.{njk,md}`, `src/posts/{articles,docs,listening,notes,reading,watching}/`, `src/__ideas`, `src/_obsidian`, `src/_raw`, `_originals`, `_resources`, `LOG.md`, `TODO.md`, `AGENTS.md`, `tokens/penpot-tokens.dtcg.json` (Tolstoy will generate its own), `DESIGN.md` (likewise generated).
- **Tolstoy-only (already present, don't touch from JEDEE):** `src/_layouts/{wiki,work}.njk`, `src/{wiki,works,sources,_design,_staging}/`, `schema/`, `.github/`, `src/pages/{works.njk,changelog.md}`.
- **Project-specific even though both repos have them:** `CLAUDE.md`, `LICENSE`, `readme.md`, `src/_data/{meta.js,navigation.js,personal.yaml}`, `src/pages/{about.md,accessibility.md,privacy.md,sustainability.md,index.njk,articles.njk,notes.njk,styleguide.njk}`, `src/common/{feed-atom.njk,og-images.njk}`, `src/_includes/partials/backlinks.njk`, `src/_layouts/pageIndex.njk`, `.eleventyignore`, `.gitignore`, `.env`, `package-lock.json`. These have Tolstoy-tailored content; do not overwrite.

### Verification after 1a

- `npm run build` — no broken token references; the build still produces output.
- `npm run colors` — `colors.json` regenerates without errors; only renamed `base-*` keys appear (no `themecolor-*`).
- `npm run penpot:tokens` — produces `tokens/penpot-tokens.dtcg.json` and refreshes `DESIGN.md`.
- Visual smoke test: `npm start`, load the homepage, confirm theme toggle and accent colours behave as expected (still JEDEE values; only the indirection layer has changed).

**Task 2 — License + SDG (second):**

- **License finalisation** — tighten the LICENSE prose. Specific gaps: clearer separation between the dedication and third-party-source notes, a plain-language summary at the top, and consistency between the LICENSE file and any condensed version that appears on the homepage.
- **SDG lettering graphic** — donated by the illustrator, vectorized, arriving later. Two variants: graphic only, and graphic with *"Soli Deo Gloria"* caption underneath. Placeholder stays in the license section until delivered.

**Task 3 — Splash homepage rebuild:**

- **tolstoy.life logo** — hoping the illustrator will help. Until then, the decorative T stays.
- **Tolstoy quote research** — dedicated research session in the Jubilee Edition. Scope includes letters and diaries (mid-1890s window). Do not attempt via web search. The 1891 newspaper notice serves as placeholder in the meantime.
- **Move splash into `website/`** — the homepage of `tolstoylife/website` becomes the splash page. Retire the `tolstoylife/splash` Astro repo once the new homepage is live. The current Astro `DocsLayout.astro` CSS is the reference for the docs template styling.
- **Set up `preview.tolstoy.life`** — configure a second Netlify site from the same repo pointing at `tolstoylife/website`, with a build flag that includes `draft: true` pages. Password-protect if needed.
- **Mailing list — Netlify Forms** — wire up the plain HTML form in section 10 with the `netlify` attribute and a honeypot field. Sender choice for the eventual launch broadcast can be deferred.
- **Countdown degradation** — JS countdown degrades gracefully to "Coming 2028" if JS is off or unavailable.
- **GitHub commits whitelist** — decide which tolstoylife repos to include in the live progress feed (`@11ty/eleventy-fetch` reads this whitelist at build time).
- **GitHub organisation URL** — confirm the canonical URL for the collaboration CTA (currently assumed `github.com/tolstoylife`).

**Task 4 — Documentation build pipeline (Markdown → HTML via Eleventy):**

The `docs/` folder currently mixes `.md` source files with `.html` artifacts generated by an ad-hoc tool (Obsidian export, Pandoc, or similar). The pipeline needs to be replaced so markdown stays the single source of truth, Eleventy is the only HTML generator, and rendered docs match the published site.

- **Identify and retire the current generator** producing the stray `docs/**/*.html` files (e.g. `docs/INDEX.html`, `docs/design/penpot-tokens.html`, `docs/splash-site-plan.html`).
- **Pick the build location.** Two viable approaches: (1) single Eleventy build in `website/` only, with docs synced in via the existing script — simplest, local preview means running `npm start` in `website/`; or (2) a small `eleventy.config.js` at the research-repo root for in-place doc preview, sharing a layout/CSS bridge with `website/`. Default recommendation: (1).
- **Shared template/CSS layer.** Whichever wins, the layout and tokens come from `website/`'s design system. No drift between local doc preview and the published site.
- **Cleanup.** Remove committed `docs/**/*.html` artifacts once the Eleventy pipeline lands; generated HTML lives in `website/dist/` (untracked) or is rebuilt on demand.
- This task can run in parallel with Task 3; it does not depend on Penpot tokens or the license rewrite.

---

## Notes on the current splash site
The existing Astro splash site (`tolstoylife/splash`) has:
- A dark start page with the decorative T and "The life and works of Leo Tolstoy. Coming 2028."
- A working docs section with one-column paper-like styling — this is the aesthetic reference to preserve in the rebuild
- A sync pipeline: `scripts/sync-docs.sh` copies `docs/**` from the Tolstoy repo, stripping frontmatter

The "Coming 2028" line reads as both a statement of timeline and a reference to the bicentennial. This is intentional and worth keeping — the countdown ticker makes it explicit.

---

*Created: May 2026. Revised 2026-05-09 to fold in Johan's annotations.*
