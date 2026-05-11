---
title: "docs/ → dev blog migration plan"
description: "Reframe docs/ as a dated build log; port evergreen reference material to the real website."
date: 2026-05-11
tags: [design, development]
draft: false
---

# docs/ → dev blog migration plan

Reframe `docs/` from a documentation hub into a dated build log. Move
evergreen reference material to the real website at `website/`. Keep
`docs/` as the chronological record of what was tried, what was decided,
and when.

The discipline that makes the split honest: anything with a `latest` or
`current` qualifier is reference (real site). Anything written from a
snapshot in time is blog (this directory).

---

## The split

### Reference → port to `website/`

System facts that should always reflect the current state.

- `editorial/editorial.md`
- `editorial/conventions.md`
- `editorial/source-mode.md`
- `architecture/internal-operations.md`
- `pwa/local-first-architecture.md`
- `pwa/yjs-schema-and-sync.md`
- `pwa/wiki-integration.md`
- `pwa/tl-pipeline-integration.md`
- `pwa/README.md`
- `development/README.md`
- `research/tolstoydigital-tei-reference.md`
- `research/copyright-renunciation/index.md`
- `design/penpot-tokens.md` (if still current)

### Blog → stays in `docs/`

Snapshots, reports, plans, exploratory work.

Already dated:

- `architecture/lightrag-performance-report-2026-04-18.md`
- `architecture/wiki-rewrite-workflow-2026-04-15.md`
- `architecture/scalability-deep-dive-2026-04-15.md`
- `architecture/epub-a11y-w3c-review-2026-04-22.md`
- `superpowers/plans/2026-04-29-timelinegraph.md`
- `superpowers/specs/2026-04-29-timelinegraph-design.md`
- `superpowers/specs/2026-05-04-timelinegraph-prototype-10-design.md`

Versioned by suffix (rename to dated form):

- `design/splash-site-plan-original.md` → date-of-first-commit + `-splash-site-plan-v1`
- `design/splash-site-plan-revised.md` → date + `-splash-site-plan-v2`
- `design/splash-site-plan.md` → date + `-splash-site-plan-v3`

Exploratory / process logs:

- `design/period-colours-research.md` + `period-colours-preview.html`
- `pwa/stage-1-implementation.md`
- `development/source-mode-implementation.md`
- `architecture/architecture-review.html`
  → rename `architecture/2026-MM-DD-pwa-architecture-deep-research.html`,
  drop from `FEATURED`.

### Edge cases resolved

| File | Layer | Reason |
|---|---|---|
| `architecture/architecture-review.html` | blog | Deep-research report, same shape as the dated `2026-04-15` entries — missing the date in the filename, not the spirit |
| `editorial/source-mode.md` | reference | Clean spec with `lastUpdated` + `changelog`; defines what source mode *is*. Versioned in place |
| `development/source-mode-implementation.md` | blog | Recipe, "no code shipped yet", acceptance checklist. Mid-flight build doc. Archive or fold into the spec once shipped |

---

## Phases

### Phase 1 — annotate, don't move

For each file in `docs/`, add a `layer:` frontmatter field
(`reference` or `blog`) and, for blog files, a `date:` field. Files
without dates that resolve to `blog` get an ISO date prefix on the
filename — use the git first-commit date when there's no better signal.

Nothing physically moves yet. This is enough to drive a smarter index
and to verify the categorization before any deletion.

### Phase 2 — blog-shape the index

Update `serve.py`:

- Read `date:` and `layer:` frontmatter; default `layer: reference` for
  files without it (safer during migration).
- Sort blog entries chronologically by `date:`, newest first. Replace
  `FOLDER_ORDER` grouping with year-based grouping for the blog layer.
- Render a small "Reference docs (pending port)" appendix below the
  blog feed.
- Drop the `FEATURED` constant — in a chronological feed the top entry
  *is* the featured entry.

No RSS generation here. `serve.py` is temporary scaffolding;
eleventy-excellent at `website/` already handles RSS for content
collections, so RSS lands free in Phase 3 when content moves to
`website/src/notes/`.

### Phase 3 — port reference docs to website

When the eleventy site has a reference section, move reference-tagged
files into the eleventy tree. Exact route (`/docs/`, `/contributing/`,
a separate section) decided at port time.

Each successful port deletes the file from `docs/`. The blog never
links the `docs/` copy of a reference doc after porting — links point
at the canonical website URL.

### Phase 4 — drop generated `.html` siblings

After the layout is stable, remove `*.html` companions from git.
`serve.py` regenerates them on demand. Keep `INDEX.html` tracked
because it's the published entry point.

---

## Blog conventions

### Filename

`YYYY-MM-DD-slug.md`, lowercase, kebab-case slug. Date is the
publication date, not the work date.

### Frontmatter

```yaml
---
title: Wiki rewrite workflow
date: 2026-04-15
layer: blog
tags: [architecture, wiki]
description: One-line lede.
---
```

`layer:` is the partition. `tags:` are the cross-cutting facets. The
folder a file sits in is incidental — tags replace folders as the
primary categorization, though existing folders may stay as filesystem
organization during migration.

### Allowed tags

Reuse the labels already in `serve.py`'s `FOLDER_META`: `architecture`,
`editorial`, `design`, `pwa`, `research`, `development`. Add
`superpowers` for plan and spec entries.

### Length

No rule. A 200-word post counts.

---

## Changes to `serve.py`

Concretely, the diff:

1. Extend `_extract_*_md` to also pull `date:` and `layer:`.
2. Replace `build_index()`'s folder-grouped pass with:
   - Blog pass: collect `layer: blog` entries, sort by `date:` desc,
     group by year.
   - Reference pass: collect `layer: reference` entries, alphabetical,
     rendered as a smaller appendix labelled "Reference (pending port
     to website)".
3. Add `build_rss(blog_entries)` and write `rss.xml` in `build_all()`.
4. Remove `FEATURED` and its featured-card rendering.

---

## Decisions (2026-05-11)

1. **Destination on the real site.** The blog becomes the `notes`
   collection at `website/src/notes/`. "Notes" matches the project's
   single-word convention (`LOG.md`, `MANIFEST.md`, `TODO.md`) and
   reads as a research notebook rather than a corporate dev blog.
2. **Blog moves fully into the real website.** `docs/` and `serve.py`
   are temporary scaffolding. Once the eleventy `notes` collection is
   live, `docs/` is retired.
3. **Backdating policy: git first-commit date in this repo.** Single
   rule, deterministic, verifiable. Don't try to reconstruct
   authorship dates for content imported from elsewhere — the
   first-commit date here is when the writing became visible in the
   project, and that is what the timestamp records.

### Backfill script (Phase 1)

```sh
# For every .md under docs/ without a date: in frontmatter, insert
# the git first-commit date. Idempotent.
for f in $(find docs -name '*.md' -type f); do
  if ! grep -q '^date:' "$f"; then
    d=$(git log --diff-filter=A --follow --format=%aI -- "$f" \
        | tail -1 | cut -dT -f1)
    [ -z "$d" ] && d=$(date +%Y-%m-%d)   # uncommitted → today
    # insert `date: $d` after the opening `---`
  fi
done
```

The actual insert respects existing frontmatter shape; full script
ships with the Phase 1 commit.

---

## Next concrete step

Build the full per-file table (every `.md` under `docs/`, with proposed
`layer:` and `date:`), agree on the categorization, then execute Phase 1
in a single commit.
