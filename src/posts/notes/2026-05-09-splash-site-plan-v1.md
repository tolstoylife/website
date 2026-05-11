---
title: "Splash site — plan (1)"
description: "The first planning iteration for the tolstoy.life public homepage — tech stack decision, content sections, and task outline. Archived once superseded."
date: 2026-05-09
tags: [design]
draft: false
---

# Splash site — plan (1)

*Planning document for the tolstoy.life public splash site and documentation.*

*Archived 2026-05-09: this is the pre-annotation version. Superseded by `splash-site-plan-revised.md` and the active plan at `docs/splash-site-plan.md`.*

---

## Decisions made

### Tech stack
Rebuild the splash site using **Eleventy Excellent** — the same stack as the main tolstoy.life website. This replaces the current Astro installation. The motivation is consistency: one stack across all frontend work, with Every Layout, CUBE CSS, and the established design system already in place.

### Repo structure
The splash page and docs section will live in `tolstoylife/website` — the same repo as the main tolstoy.life site. The separate `tolstoylife/splash` Astro repo is retired once the new homepage is live.

This means the splash page becomes the homepage of `website/`, and the design is literally the alpha of the final site — same tokens, same Every Layout primitives, same CUBE CSS blocks. No migration step later, no design decisions to carry over.

The `docs/` sync script still exists (docs originate in the Tolstoy research repo), but the destination is cleaner and the href rewriting simpler because it is one Eleventy build.

### Draft content and collaborator access
Wiki pages under active development use Eleventy's `draft: true` frontmatter flag, which excludes them from production builds. Two Netlify deploys are configured from the same repo and branch:

- `tolstoy.life` — production build, published content only
- `preview.tolstoy.life` — separate Netlify site, all content including drafts, for collaborators. Password-protected if needed.

This keeps everything in one repo and one branch (`main`) with no branch management overhead.

**AGENTS.md, CLAUDE.md, MANIFEST.md** remain at the Tolstoy repo root as technical documentation, rendered natively by GitHub for collaborators and technical visitors.

### Documentation aesthetic
One-column serif layout. No sidebar. No Docusaurus or Starlight — those carry a developer-product aesthetic that doesn't suit a literary research project. The existing DocsLayout style (paper/serif) is the right direction; carry it forward into the Eleventy rebuild.

---

## Audience
The splash site has two audiences:
1. **Institutions** (archives, libraries, cultural heritage organisations) who may be asked to provide source material. The site needs to communicate that this is a serious, methodologically sound, long-term research effort.
2. **General public** interested in Tolstoy or in how the project works. Technical content is welcome — no reason to shy away from it.

---

## Start page structure

The start page is a rework of MANIFEST.md into a public statement, not a one-to-one port.

### 1. Hero
- The decorative ornamental T (current placeholder logo, dark background)
- Tagline: *The life and works of Leo Tolstoy*
- Countdown ticker directly below — counting down to **9 September 2028** (Tolstoy's 200th birth anniversary). Display: days, hours, minutes, seconds. Typographic treatment, not flashy.

*Note: The illustrator may deliver a proper tolstoy.life logo. When it arrives, it replaces the decorative T.*

### 2. Project statement
Three or four sentences drawn from MANIFEST "What this is". Keep the directness of the original — "It is not a Wikipedia mirror. It is not a popular biography." is strong enough to preserve almost verbatim.

### 3. Editorial focus
One short paragraph on the late period. This is what makes tolstoy.life distinct: treating Tolstoy's post-1878 religious, philosophical, and social writings with the same seriousness as the great novels. This signals scholarly intent to institutions.

### 4. Collaborate
A section pointing to the GitHub organisation.

> *The project is built in the open. Contributions are welcome.*
> [Join us on GitHub →](https://github.com/tolstoylife)

Institutions can also see exactly what is being built.

### 5. License — Soli Deo Gloria
The SDG section with:
- The illustrator's **SDG lettering graphic** as a logo (donated; arrives later — placeholder in the meantime)
- The Bach paragraph from the LICENSE file as the introduction to this section:
  > *Johann Sebastian Bach inscribed these words on his manuscripts to declare that his work belonged not to himself but to something greater. Leo Tolstoy held the same conviction…*
- Brief statement of the public domain dedication
- Link to full LICENSE

*Note: The license text needs a little more work before finalising. See the LICENSE file in the Tolstoy repo root.*

### 6. Documentation link
A quiet link into the `/docs` section.

### 7. Tolstoy quote
A direct quote from Tolstoy — from his diaries or letters — on copyright renunciation or the free flow of knowledge. Gives the page literary texture and grounds the SDG license in his own words rather than just editorial framing. Sits naturally as a bridge between sections, likely between the editorial focus and the license section. Source from the Jubilee Edition; needs dedicated research to find the right line.

**This is a major research task.** Tolstoy's views on copyright and private property — including his active efforts to renounce ownership of his own work — have been systematically under-represented and at times suppressed by the very institutions that hold and profit from his legacy. Web searches consistently fail to surface the primary source material. Finding the right quote requires working directly in the Jubilee Edition, not secondary sources.

**Interim placeholder** (widely documented, verifiable): his 1891 public notice in Russian newspapers — *"I give permission to all who wish it to reprint, without any payment, any of my works written after 1880."* Direct and plain. Usable as a placeholder until a stronger line is found.

**The real prize**: a diary or letter passage — likely mid-1890s — where he reflects on the absurdity of owning thoughts, or on knowledge as inherently common property. More literary, more personal, more resonant. If found and verified against the Jubilee Edition, this replaces the 1891 notice.

### 8. Sense of scale
One line near the top conveying the ambition in concrete terms. Something like: *"90 volumes in the Jubilee Edition. Over 50,000 surviving letters. One freely available reference work."* Makes the abstract claim tangible and implicitly explains why 2028 is the target. Institutions respond to numbers.

### 9. Live progress — recent commits
Instead of a manually-written status note, this section loads recent commits from the tolstoylife GitHub organisation via the public GitHub API (client-side JS, no authentication required). Displays the last 5–7 commits: date, repo name, and the first line of the commit message, each linking through to the commit on GitHub.

This replaces vague "in active development" language with verifiable, live evidence of work. Institutions can click through and see the actual commits. Commit messages should stay meaningful — `fix typo` or `wip` would undermine rather than build credibility.

**Technical approach:** `fetch()` to `api.github.com/repos/tolstoylife/{repo}/commits` on page load, across a whitelist of repos. Graceful degradation: if JS is off or the fetch fails, the section simply does not render.

### 10. Mailing list signup
A simple "notify me when it launches" input for the general public and interested researchers. People who find tolstoy.life in 2026 currently have no way to be notified when the wiki opens — this closes that gap. Minimal: one email field, one submit button, no marketing language.

Implementation TBD — options include a simple mailto form, Buttondown, or a similar low-friction newsletter tool appropriate for a non-commercial scholarly project.

### 11. Institutional contact
A plain contact line at the bottom of the page for archives and libraries considering contributing source material. Email is how institutions work. Even a simple *"For institutional enquiries: [email]"* closes a loop that is otherwise missing entirely.

---

## Documentation section

- Built from `docs/` in the Tolstoy repo, synced via the existing script
- One-column serif layout using Eleventy Excellent
- Public-facing but technically complete — no need to dumb down methodology or tooling details
- Structured to show institutions: scope, methodology, source authority hierarchy, draft/verified status system

---

## Design system

The rebuild uses Eleventy Excellent with Every Layout and CUBE CSS — same as the main site. `website/` is currently a clone of the JEDEE design system (Johan's personal site), so the design tokens — colours, fonts, spacing — need to be replaced with tolstoy.life's own values before any serious CSS work begins.

### Font direction
The site has two distinct reading contexts with different needs:

- **Website and wiki** — modern feel, likely a humanist sans-serif. The wiki is a reference work, not a book: density, scannability, and clarity at small sizes matter more than literary warmth. A well-chosen sans-serif signals that this is a contemporary, maintained project.
- **E-reader / ebook** — a proper book serif, optimised for long-form reading. This is where the traditional literary register belongs. Readers spending hours with a text expect book typography.

Font choices to be decided before token updates. The token keys (`--font-base`, `--font-display`, `--font-mono`) stay the same; only the values change.

### CSS organisation
CUBE CSS requires named, single-purpose files — no monolithic page stylesheets. New components for the splash page will be added as discrete blocks in `src/assets/css/global/blocks/`:

- `hero.css` — full-bleed dark hero section
- `commits-feed.css` — live GitHub commits list
- `email-signup.css` — mailing list form

Anything truly unique to the homepage layout (if anything) goes in `src/assets/css/local/homepage.css`. Design tokens must be in place before these files are written.

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

- **Font selection** — choose typefaces for (a) website/wiki: modern humanist sans-serif, and (b) e-reader: book serif. Update `designTokens/fonts.json` and run `npm run colors` once decided.
- **Design token replacement** — replace JEDEE colour and font tokens with tolstoy.life values. Prerequisite for all CSS block work.
- **Penpot token sync** — after font and colour decisions are made, run `npm run penpot:tokens` and import the resulting DTCG file into the tolstoy.life Penpot file. See `docs/penpot-tokens.md`.
- **Tolstoy quote research** — dedicated research session in the Jubilee Edition. Do not attempt via web search. The 1891 newspaper notice serves as placeholder in the meantime.
- **tolstoy.life logo** — hoping the illustrator will help. Until then, the decorative T stays.
- **SDG lettering graphic** — donated by the illustrator, arriving later. Placeholder in the license section until delivered.
- **License finalisation** — the LICENSE file in the repo root needs a little more work.
- **GitHub organisation URL** — confirm the canonical URL for the collaboration CTA (currently assumed `github.com/tolstoylife`).
- **Move splash into `website/`** — the homepage of `tolstoylife/website` becomes the splash page. Retire the `tolstoylife/splash` Astro repo once the new homepage is live. The current Astro `DocsLayout.astro` CSS is the reference for the docs template styling.
- **Set up `preview.tolstoy.life`** — configure a second Netlify site from the same repo pointing at `tolstoylife/website`, with a build flag that includes `draft: true` pages. Password-protect if needed. This is the collaborator-facing deploy.
- **Mailing list tool** — choose a newsletter/notification tool appropriate for a non-commercial scholarly project (e.g. Buttondown). Wire up the signup form in section 10.
- **Countdown degradation** — JS countdown degrades gracefully to "Coming 2028" if JS is off or unavailable.
- **GitHub commits whitelist** — decide which tolstoylife repos to include in the live progress feed.

---

## Notes on the current splash site
The existing Astro splash site (`tolstoylife/splash`) has:
- A dark start page with the decorative T and "The life and works of Leo Tolstoy. Coming 2028."
- A working docs section with one-column paper/serif styling — this is the aesthetic reference to preserve in the rebuild
- A sync pipeline: `scripts/sync-docs.sh` copies `docs/**` from the Tolstoy repo, stripping frontmatter

The "Coming 2028" line reads as both a statement of timeline and a reference to the bicentennial. This is intentional and worth keeping — the countdown ticker makes it explicit.

---

*Created: May 2026.*
