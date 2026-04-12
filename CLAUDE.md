# CLAUDE.md — tolstoy.life website

> **⚠️ DEPRECATED** — This file is no longer maintained. 
> All project documentation has been consolidated into the parent CLAUDE.md at `../CLAUDE.md`. 
> Please refer to that file for the authoritative reference on architecture, schema, vocabulary, and operations.
>
> This file is kept for reference only and may become stale.

---

The front-end PWA, e-reader, and Obsidian vault for tolstoy.life, built with Eleventy.

> **See also:** `../CLAUDE.md` for the shared mission, vocabulary, data flow, wiki operations model, schema reference, and content accuracy standards that apply across all projects in this folder.

---

## What this project does

A progressive web app (PWA) and e-reader covering the life and works of Leo Tolstoy. Four core sections:

1. **Wiki** — Obsidian markdown articles with wikilinks covering people, events, places, and concepts. Note: wiki articles cover entities — *not* works. There is no separate wiki article for *Anna Karenina*; the work's own overview file is the canonical article for it.
2. **Works** — complete bibliography. Each work has an overview page (frontmatter + prose) inside a named folder, with an optional sidecar `.data.yaml` for deep scholarly metadata. Long-form works also have a `text/` subfolder containing one file per chapter.
3. **My Library** — users add editions to a personal library cached on-device for offline reading (`IndexedDB`, no backend).
4. **E-reader** — focus-mode reading view with togglable wikilinks, footnotes, and a chapter Table of Contents.

Plus **posts** (blog/news) and **pages** (about, legal, accessibility).

---

## Stack

**Eleventy (11ty) · Obsidian · Vanilla HTML/CSS/JS**
**Domain:** tolstoy.life
**Deployed on:** Netlify (builds from committed `.md` files — no database, no network calls at build time)

---

## Project structure

```
website/
├── src/                          # Obsidian vault root + Eleventy input
│   ├── .obsidian/                # Obsidian config (do not edit manually)
│   ├── _config/                  # Eleventy config modules
│   │   ├── collections.js
│   │   ├── filters/
│   │   ├── plugins/
│   │   └── events/               # Build-time tasks (CSS, JS bundling, OG images)
│   ├── _data/                    # Global Eleventy data files
│   ├── _includes/                # Nunjucks layouts and partials
│   ├── _layouts/                 # Page layout templates
│   ├── assets/
│   │   ├── css/
│   │   │   └── global/
│   │   │       ├── base/         # Resets and element defaults
│   │   │       ├── compositions/ # Every Layout primitives
│   │   │       ├── blocks/       # CUBE CSS blocks (scoped components)
│   │   │       ├── utilities/    # Single-purpose helpers
│   │   │       └── global.css    # Custom properties + layer imports
│   │   └── scripts/              # Vanilla JS modules
│   ├── common/                   # System files: feeds, sitemap, robots, PWA manifest
│   ├── pages/                    # Static pages (about, legal, accessibility, etc.)
│   ├── posts/                    # Blog / news posts
│   ├── sources/                  # Source cards + index + log (LLM Wiki operational files)
│   │   ├── index.md              # Catalog of all wiki + works pages (LLM navigation)
│   │   ├── log.md                # Chronological record of ingest/query/lint operations
│   │   └── ...                   # Source cards — .md stubs for each major source (wikilink-able)
│   ├── _staging/                 # Clippings, notes, extracted passages (not in git)
│   ├── wiki/                     # Wiki articles (people, events, places, concepts)
│   └── works/                    # Work folders: [Title].md overview + sidecar + text/
├── schema/                       # Schema and convention documents
│   ├── tolstoy-works-schema.md   # Canonical works metadata schema (v5)
│   ├── wiki-schema.md            # Wiki article schema (page types, frontmatter, operations)
│   ├── tolstoy-person-schema.md  # Person page schema (superseded by wiki-schema.md)
│   └── tolstoy-place-schema.md   # Place page schema (superseded by wiki-schema.md)
├── eleventy.config.js
└── CLAUDE.md                     # This file
```

---

## Data architecture

**Single source of truth:** the Obsidian vault (`src/`). All metadata lives in YAML frontmatter within `.md` files and companion `.data.yaml` sidecars. No external database.

Claude maintains the vault directly during the R&D phase — reading sources, writing and updating pages, maintaining cross-references. Johan reviews changes in Obsidian and git. When the project goes live, Claude shifts to a PR workflow (changes proposed on a branch, merged after review).

### .md file structure

Work overview files (`src/works/.../Anna Karenina.md`) have frontmatter and prose:

```md
---
id: anna-karenina
recordStatus: draft
titleEn: Anna Karenina
titleRu: Анна Каренина
genre: novel
language: ru
completionStatus: complete
# ...core schema fields...
---

Factual prose about composition, publication history, reception, etc.
All claims cite a verified primary source. [[wikilinks]] to people, places, events.
```

The `---` delimiters separate frontmatter from prose. No zone markers needed — the boundary is the closing `---`.

Deep scholarly metadata (manuscripts, transcriptions, bans, fieldSources) lives in a **sidecar file**:

```
anna-karenina/
├── Anna Karenina.md          ← core frontmatter + prose
└── anna-karenina.data.yaml   ← full schema v5 deep metadata
```

Source text files (`src/works/.../text/Part 1, Chapter 1.md`) have a TEXT zone:

```md
---
title: Part 1, Chapter 1
work: anna-karenina
part: 1
chapter: 1
---

<!-- TEXT — source text, do not modify -->

The full text of the chapter with [[wikilinks]] woven in.
```

Wiki article files (`src/wiki/Sophia Tolstaya.md`) follow the templates in `schema/wiki-schema.md`.

**Rules:**
- Frontmatter is authored by Claude based on primary sources. During R&D, Claude writes directly. In production, changes come via PR.
- The TEXT zone in source text files is never touched by wiki maintenance operations.
- All prose must cite primary sources. No unattributed claims, no literary interpretation.

### Sidecar convention

The sidecar `[id].data.yaml` file holds the full schema v5 metadata that would make frontmatter unwieldy: manuscript records, transcription details, ban histories, scan references, and fieldSources attribution. Eleventy consumes it via the data cascade (Eleventy automatically merges `*.data.yaml` files in the same directory with the template data).

Start with frontmatter only. Add the sidecar when a work has enough deep metadata to warrant it. Not every work needs one.

### Work file naming

Work overview files use human-readable title-case names matching the work title (e.g. `Anna Karenina.md`). This is required for Obsidian wikilinks to resolve correctly — `[[Anna Karenina]]` must find exactly one file. Clean URLs are handled by the `permalink` in `works.11tydata.json`, derived from the `id` slug, not the filename.

The text landing file for a work is named `[Title] — Text.md` (em-dash, not hyphen) to avoid wikilink collision with the overview file. Chapter files use title-case part and chapter names: `Part 1, Chapter 1.md`.

### Eleventy ignores

`src/sources/` and `src/_staging/` are excluded from Eleventy via `.eleventyignore` — the index, log, source cards, and staging materials must never generate pages. If adding other vault-only folders in future, add them to `.eleventyignore` as well.

### Obsidian vault

`src/` is the Obsidian vault. Open `src/` directly in Obsidian. Wikilinks, backlinks, and graph view work against all `.md` files in `wiki/`, `works/`, and `sources/`.

---

## Commands

```bash
npm start            # Eleventy dev server
npm run build        # Clean + production build
```

---

## Build pipeline

`npm run build` works purely from committed `.md` files — no scripts, no external dependencies, no network calls.

**Local development workflow:**
```bash
# 1. Claude session: ingest sources, update vault files
# 2. Review changes in Obsidian (graph view, backlinks, content)
# 3. git add src/wiki/ src/works/ src/sources/
# 4. git commit
# 5. npm run build / push to deploy
```

---

## CSS methodology

CSS is written using **CUBE CSS** layered on **Every Layout** primitives with **lean web** principles.

**Tailwind is used as a design token compiler only** — not as a utility-class framework. `tailwind.config.js` defines the design system (colour palette, type scale, spacing). The Tailwind build step compiles these tokens into CSS custom properties. **Tailwind utility classes must not appear in HTML templates.**

Layer order:

1. **Base** — resets, element defaults
2. **Compositions** — Every Layout primitives (Stack, Center, Cluster, Sidebar, Grid, etc.)
3. **Blocks** — scoped component styles (`.work-card`, `.timeline-entry`, `.reader-view`)
4. **Utilities** — single-purpose helpers (`.sr-only`, `.text-center`)

Rules:

- Use CSS custom properties for all design tokens. Never hardcode values.
- Reach for an Every Layout primitive before writing custom layout CSS.
- Prefer the CSS class approach (`.stack`) over web components (`<stack-l>`) unless progressive enhancement is needed.
- Media queries are a last resort — use intrinsic layout first.

---

## JavaScript conventions

- **Vanilla JS only** — no frameworks, no build-step JS transforms unless strictly necessary.
- Prefer platform APIs: `fetch`, `IntersectionObserver`, `ResizeObserver`, `dialog`, `details/summary`.
- Use `<script type="module">` for all JS.
- Keep scripts small and purpose-specific — no large monolithic bundles.
- Progressive enhancement: the page must be useful without JS.
- PWA features (service worker, caching, install prompt) live in `src/common/serviceworker.njk` and related files.

---

## Sensible defaults

- When creating new content files, use the templates in `schema/wiki-schema.md` or `schema/tolstoy-works-schema.md` as the starting point.
- When in doubt about a schema field, check the relevant schema before inventing structure.
- Prefer static generation over dynamic rendering — Eleventy pages should be pre-rendered wherever possible.
- Images in WebP/AVIF with `width`/`height` attributes and `loading="lazy"`.
- All interactive elements must be keyboard-accessible.

---

## Git remotes

- `origin` → `https://github.com/tolstoylife/website.git`
- `upstream` → `https://github.com/madrilene/eleventy-excellent.git` (Eleventy Excellent theme — pull updates from here)
