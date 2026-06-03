// ⚠ PROPOSED — not yet wired into the build (inert until imported in
// src/_config/plugins.js and registered in eleventy.config.js). Drop-in
// replacement for @photogabble/eleventy-plugin-interlinker that does NOT
// re-enter the render pipeline, so it scales to the full vault. Validated
// against the wiki conventions (title resolution, real /wiki/{id}/ URLs,
// [[T|alias]]). See docs/architecture/wikilinks-migration-plan.md.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { installWikilinkRule } from './markdown-rule.js';
import { normalizeTitle } from './util.js';

const WIKILINK = /\[\[([^\]\n]+)\]\]/g;

/**
 * Parse-level wikilinks + pre-computed backlinks — a drop-in replacement for
 * @photogabble/eleventy-plugin-interlinker that never re-enters the render
 * pipeline. The link graph is built ONCE from the real page set (via a
 * collection callback, so URLs are Eleventy's own — no permalink re-derivation),
 * inline [[ ]] is resolved at markdown-parse time, and backlinks are served by a
 * render-time filter.
 */
export default function wikilinks(eleventyConfig, options = {}) {
  const opts = { deadLinkReport: 'none', ...options };

  // Shared, mutable index. Populated in the collection phase (before any
  // template renders) and read by the markdown rule + the backlinks filter.
  const index = {
    byTitle: new Map(),   // normalizedTitle -> { url, title }
    backlinks: new Map(), // url -> [{ url, title }]
    dead: [],             // { from?, target }
  };

  // 1. Build the graph once from every page. addCollection runs before
  //    templates render; api.getAll() exposes each page's real .url + .data.
  eleventyConfig.addCollection('_wikilinkIndex', (api) => {
    buildIndex(api.getAll(), index);
    return [];
  });

  // 2. Resolve inline [[ ]] at parse time using the prebuilt index.
  eleventyConfig.amendLibrary('md', (md) => installWikilinkRule(md, index));

  // 3. Serve backlinks at render time (index is ready by then). Templates do:
  //    {% set backlinks = page.url | wikiBacklinks %}
  eleventyConfig.addFilter('wikiBacklinks', (url) => index.backlinks.get(url) ?? []);

  // 4. Dead-link report — parity with interlinker's deadLinkReport.
  if (opts.deadLinkReport === 'json') {
    eleventyConfig.on('eleventy.after', () => {
      writeFileSync(join(process.cwd(), '.dead-links.json'), JSON.stringify(index.dead, null, 2));
    });
  } else if (opts.deadLinkReport === 'console') {
    eleventyConfig.on('eleventy.after', () => {
      for (const d of index.dead) console.warn(`[wikilinks] dead link [[${d.target}]]`);
    });
  }
}

function buildIndex(pages, index) {
  index.byTitle.clear();
  index.backlinks.clear();
  index.dead.length = 0;

  // Pass 1: title -> url (Eleventy's real URL, whatever the permalink scheme).
  for (const page of pages) {
    const title = page.data?.title;
    if (title && page.url) index.byTitle.set(normalizeTitle(title), { url: page.url, title });
  }

  // Pass 2: extract outbound [[ ]] from each page's raw source, invert -> backlinks.
  for (const page of pages) {
    const raw = rawOf(page);
    if (!raw) continue;
    const fromUrl = page.url;
    const fromTitle = page.data?.title ?? fromUrl;
    const seen = new Set();
    let m;
    while ((m = WIKILINK.exec(raw))) {
      const target = m[1].split('|')[0].split('#')[0].trim();
      const hit = index.byTitle.get(normalizeTitle(target));
      if (!hit) { index.dead.push({ from: fromUrl, target }); continue; }
      if (hit.url === fromUrl) continue;            // no self-backlink
      if (seen.has(hit.url)) continue;              // dedupe per source page
      seen.add(hit.url);
      const list = index.backlinks.get(hit.url) ?? [];
      list.push({ url: fromUrl, title: fromTitle });
      index.backlinks.set(hit.url, list);
    }
  }
}

// Eleventy 3.x exposes rawInput on collection items; fall back to the file.
function rawOf(page) {
  if (typeof page.rawInput === 'string') return page.rawInput;
  try { return readFileSync(page.inputPath, 'utf8'); } catch { return ''; }
}
