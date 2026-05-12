---
title: "Source mode — implementation recipe"
description: "Four-piece implementation recipe for the source-mode footnote toggle — what already exists, the CSS block, the vanilla toggle component, and the build-time summary filter."
date: 2026-05-11
tags: [development]
draft: false
templateEngineOverride: md
---

How to implement the toggle and rendering described in
[`docs/editorial/source-mode.md`](../editorial/source-mode.md).

The editorial spec is the source of truth for *what* source mode is.
This file describes *how* to wire it up inside the Eleventy Excellent
site at `website/`. Read both before touching code.

---

## What already exists in the codebase

Before adding anything, confirm these are still in place:

| What | Where | Notes |
|---|---|---|
| `markdown-it-footnote` plugin | `website/src/_config/plugins/markdown.js` (line 8, line 44) | Already wired into the `markdownLib` instance. Renders `[^n]` syntax and produces a `.footnotes` block at the end of each rendered page. **Do not replace.** Configure it. |
| `markdown-it-attrs` | same file | Lets authors add `{.class}` to markdown elements — useful for tagging individual footnotes or licence-tag spans if needed. |
| CUBE CSS cascade with auto-imported `blocks/`, `compositions/`, `utilities/` | `website/src/assets/css/global/` | Any new CSS block dropped in `blocks/` is auto-imported. No registration needed. |
| Per-page CSS bundles via `{% css "local" %}` | layouts | Available if source-mode CSS turns out to be wiki-only and shouldn't ship on every page. |
| `<template>`-injected JS UI pattern | see `website/src/_includes/partials/main-nav.njk` (burger button) | The Lene-approved pattern for JS-only UI: live in a `<template>` so they never exist without JS. The source-mode toggle button should follow this pattern. |
| `data-theme` attribute pattern on `<html>` | `website/src/_includes/head/js-inline.njk` (theme toggle) | The toggle and persistence pattern to mirror. Source mode uses `data-sources` the same way. |

If any of these have moved or changed, update this recipe before
following it.

---

## What to add

Four pieces, in this order. Each piece works without the next, so you
can ship in stages.

### 1. CSS block — visibility rules

Add `website/src/assets/css/global/blocks/source-mode.css`. Auto-imported
via glob, no registration needed.

Responsibility: show/hide the footnote markers and the rendered
`.footnotes` block based on `data-sources` on `<html>`.

```css
/* Off (default) — clean reading */
:where(html[data-sources="off"], html:not([data-sources])) :is(
  .footnote-ref,
  .footnotes
) {
  display: none;
}

/* On — Wikipedia-style markers + References block */
html[data-sources="on"] .footnotes {
  /* layout, type, spacing — match site rhythm via design tokens */
}
```

Conventions: use design-token custom properties for every value
(spacing, type, colour). Read the `cube-css` skill before writing the
final styles. The block above is a sketch — the production CSS belongs
in CUBE form with `@layer blocks`.

### 2. Toggle button — `<template>`-injected, vanilla JS

Add `website/src/_includes/partials/source-mode-toggle.njk` — a
`<template>` containing the button markup, included in the wiki layout
header.

Add `website/src/assets/scripts/components/source-mode.js` — the JS
that:

1. Reads `localStorage.getItem('sourceMode')` (default: `"off"`).
2. Sets `data-sources` on `<html>` to match.
3. Injects the `<template>` button into a hook element in the header.
4. Wires the button to flip `data-sources` between `"off"` and `"on"`,
   persisting to `localStorage`.

ESM, vanilla, ~30 lines. Follow the theme-toggle pattern in
`website/src/_includes/head/js-inline.njk` — that's the project's
established model for this kind of state.

### 3. "Sources used on this page" summary block

This is the off-state replacement for the References block.

Implementation choice — pick at impl time:

**Option A — Eleventy filter.** Add
`website/src/_config/filters/source-summary.js`: takes the rendered
post HTML, parses out unique footnote contents (using cheerio or a
regex over `.footnotes li`), deduplicates by source name, returns the
summary HTML. Invoked from the wiki layout. Pro: deterministic, runs
once per build. Con: HTML parsing.

**Option B — markdown-it plugin extension.** Hook into the footnote
plugin's render rules to also build a summary token alongside the
References block. Pro: stays inside the markdown pipeline. Con: more
markdown-it knowledge required.

Recommend Option A for the first version. The filter approach is
debuggable, easy to test, and doesn't risk destabilising the existing
markdown plugin chain.

The summary block lives inside the wiki layout, in a small WebC
component or Nunjucks partial. CSS hides it when `data-sources="on"`
and shows the full References block instead.

### 4. Licence-tag lint (optional, later)

A node script under `website/scripts/` that walks every
`src/wiki/**/*.md` file, parses footnotes, and fails the build if any
footnote definition is missing a `(PD)` / `(CC BY-SA 4.0)` / similar
tag. Wire into `npm run build` once the corpus is large enough that
manual review isn't enough.

Not required for source mode to work — only for the licence-tag rule
in the editorial spec to be machine-enforced.

---

## What not to do

- **Do not replace `markdown-it-footnote`** with a custom prefix
  handler. The decision (documented in the editorial spec) is to use
  plain numbered footnotes. The licence-tag distinction lives in the
  footnote *text*, not in the footnote *ID*.
- **Do not put source-mode CSS in `local/`** unless it's confirmed
  wiki-only and there is a measurable bundle-size benefit. Default to
  a global block — simpler.
- **Do not introduce a JS framework.** This is a localStorage flip
  and a class toggle. Vanilla ESM. See `lean-web` skill.
- **Do not write inline `<style>` or `<script>` blocks.** Use the
  established CSS-block + ESM-component pattern from the rest of the
  site.

---

## Decisions left for implementation time

The design is settled. These are tactical choices that should be made
when writing the actual code:

- Where the toggle button visually sits (page header, sidebar, footer).
  Recommend page header next to existing controls.
- The visual treatment of the `[1]` markers in the on state. Should
  match site type-scale and feel literary rather than encyclopaedic.
- Whether the summary block lists sources by appearance order or
  alphabetically. Recommend appearance order — matches the reading flow.
- HTML parser choice for Option A (cheerio, linkedom, regex). Tiny
  dependency footprint preferred.

---

## Acceptance check

Source mode is shipped when:

1. A wiki page with `[^1]: source text (PD)` footnotes renders cleanly
   with no markers visible by default.
2. A "Sources used on this page" summary appears at the bottom in the
   off state.
3. A button toggles between off and on; on shows numbered markers and
   the full References block.
4. The state persists across page loads via `localStorage`.
5. The page is fully readable and accessible with JavaScript disabled
   (off state, summary visible, no broken UI).
6. `npm run test:a11y` passes.

---

## References

- Editorial spec: [`docs/editorial/source-mode.md`](../editorial/source-mode.md)
- LICENSE boundary rules: [`/LICENSE`](../../LICENSE)
- Wiki schema (`fieldSources` companion): `website/schema/wiki-schema.md`
- Eleventy Excellent markdown setup: `website/src/_config/plugins/markdown.js`
- Skill references to read before coding: `cube-css`, `lean-web`,
  `every-layout`, `eleventy-excellent`.
