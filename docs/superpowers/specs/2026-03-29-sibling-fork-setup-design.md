# Sibling Fork Setup for tolstoy-life

**Date:** 2026-03-29
**Status:** Draft

## Goal

Set up tolstoy-life as a sibling fork of eleventy-excellent, sharing the same Eleventy foundation as JEDEE (johanedlund.se) without a parent-child dependency between the two sites.

## Relationship diagram

```
eleventy-excellent (madrilene/eleventy-excellent)
    |
    +-- JEDEE (pjedlund/JEDEE) — johanedlund.se
    |
    +-- tolstoy-life (pjedlund/tolstoy-life) — tolstoy.life
```

Both sites independently pull upstream updates from eleventy-excellent. Cross-site improvements are shared via cherry-pick.

## Current state

- `tolstoy-life/` exists locally with no git commits
- Contains Tolstoy-specific files: `tolstoy-works-schema.md`, `sources.yaml`, `works/`, `_resources/`, `CLAUDE.md`
- Contains a copy of JEDEE inside `JEDEE/` subdirectory
- JEDEE is a separate repo at `git@github.com:pjedlund/JEDEE.git`

## Steps

### 1. Preserve Tolstoy-specific files

Before replacing the repo, copy Tolstoy-specific files to a temporary location:

- `CLAUDE.md`
- `tolstoy-works-schema.md`
- `tolstoy-works-schema.html`
- `sources.yaml`
- `works/` (contains `the-kingdom-of-god-is-within-you.yaml`)
- `_resources/`
- `session-context-2026-03-28.md`
- `schmem-questions.md`

### 2. Clone eleventy-excellent as tolstoy-life

Clone eleventy-excellent into a fresh directory, then set up remotes:

```bash
git clone https://github.com/madrilene/eleventy-excellent.git tolstoy-life-new
cd tolstoy-life-new
git remote rename origin upstream
git remote add origin git@github.com:pjedlund/tolstoy-life.git
```

This gives:
- `upstream` pointing to eleventy-excellent (for pulling base updates)
- `origin` pointing to the tolstoy-life GitHub repo

Optionally add JEDEE as a remote for cherry-picking:

```bash
git remote add jedee git@github.com:pjedlund/JEDEE.git
```

### 3. Create the tolstoy-life GitHub repo

Create `pjedlund/tolstoy-life` on GitHub (if it doesn't already exist) and push:

```bash
git push -u origin main
```

### 4. Move Tolstoy-specific files into the new repo

Copy the preserved files into appropriate locations:

| Source file | Destination |
|---|---|
| `CLAUDE.md` | `CLAUDE.md` (root) |
| `tolstoy-works-schema.md` | `tolstoy-works-schema.md` (root) |
| `tolstoy-works-schema.html` | `tolstoy-works-schema.html` (root) |
| `sources.yaml` | `sources.yaml` (root) |
| `works/` | `works/` (root) |
| `_resources/` | `_resources/` (root) |
| `session-context-2026-03-28.md` | `docs/session-context-2026-03-28.md` |
| `schmem-questions.md` | `docs/schmem-questions.md` |

Commit these as the first tolstoy-life-specific commit.

### 5. Remove eleventy-excellent demo content

Remove content that is specific to the eleventy-excellent starter and not needed for tolstoy-life:

- Demo blog posts and pages
- Sample images and placeholder content
- Starter site metadata (replace with tolstoy.life values)

Keep:
- Eleventy config and plugin setup
- CSS system (Every Layout compositions, CUBE CSS layers)
- Build tooling (package.json, scripts)
- Base layouts and HTML boilerplate

This will be done incrementally as tolstoy-life content replaces the demo content.

### 6. Replace the old directory

Once verified, replace the old `tolstoy-life/` directory with `tolstoy-life-new/`:

```bash
# From the parent directory
rm -rf tolstoy-life
mv tolstoy-life-new tolstoy-life
```

### 7. Verify JEDEE is unaffected

Confirm JEDEE still works independently at its own location with its own remotes.

## Ongoing workflows

### Pulling upstream updates (eleventy-excellent)

```bash
cd tolstoy-life
git fetch upstream
git merge upstream/main
# resolve conflicts between upstream changes and tolstoy-life customizations
```

### Cherry-picking from JEDEE

When an improvement in JEDEE should also apply to tolstoy-life:

```bash
cd tolstoy-life
git fetch jedee
git cherry-pick <commit-hash>
```

### Divergence management

Over time, tolstoy-life will diverge from eleventy-excellent in these areas:
- Content and data (entirely different)
- Site metadata and branding (entirely different)
- Design tokens (colors, typography — Tolstoy-specific)
- Templates (new work pages, wiki, search — Tolstoy-specific)

The shared foundation that should stay aligned:
- Eleventy core config and plugins
- CSS methodology (Every Layout + CUBE CSS layer structure)
- Build scripts and tooling
- Accessibility patterns

When merging upstream, conflicts will concentrate in the diverged areas. This is expected and manageable.

## Files NOT migrated

These files from the current tolstoy-life directory are not carried over:

- `JEDEE/` — stays as its own repo
- `.DS_Store` — OS artifact
- `bug-report-cowork-file-write.md` — transient debugging file

## Success criteria

- [ ] tolstoy-life is a git repo with `upstream` pointing to eleventy-excellent
- [ ] tolstoy-life has its own `origin` on GitHub
- [ ] All Tolstoy-specific files are present and committed
- [ ] `npm start` runs the Eleventy dev server successfully
- [ ] `npm run build` produces a working build
- [ ] JEDEE remains functional and independent
- [ ] `git fetch upstream && git merge upstream/main` works without error (on a fresh clone, no conflicts expected)
