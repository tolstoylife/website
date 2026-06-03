import { normalizeTitle, escapeHtml, slugifyHeading } from './util.js';

// markdown-it inline rule: resolves [[Target]], [[Target|Label]], [[Target#Heading]]
// at PARSE time using the prebuilt index (no render-pipeline re-entry).
export function installWikilinkRule(md, index) {
  md.inline.ruler.before('link', 'wikilink', (state, silent) => {
    const { src, pos } = state;
    if (src.charCodeAt(pos) !== 0x5b /* [ */ || src.charCodeAt(pos + 1) !== 0x5b) return false;
    const close = src.indexOf(']]', pos + 2);
    if (close < 0) return false;
    const inner = src.slice(pos + 2, close);
    if (inner.includes('[') || inner.includes('\n')) return false; // not a wikilink

    if (!silent) {
      let [targetRaw, labelRaw] = inner.split('|');
      let heading = '';
      const hash = targetRaw.indexOf('#');
      if (hash >= 0) { heading = targetRaw.slice(hash + 1); targetRaw = targetRaw.slice(0, hash); }
      const target = targetRaw.trim();
      const label = (labelRaw ?? targetRaw).trim();
      const hit = index.byTitle.get(normalizeTitle(target));

      const token = state.push('html_inline', '', 0);
      if (hit) {
        const href = heading ? `${hit.url}#${slugifyHeading(heading)}` : hit.url;
        token.content = `<a class="wikilink" href="${href}">${escapeHtml(label)}</a>`;
      } else {
        index.dead.push({ target });
        token.content = `<a class="wikilink wikilink--dead" href="#" aria-disabled="true" title="No page named &quot;${escapeHtml(target)}&quot;">${escapeHtml(label)}</a>`;
      }
    }
    state.pos = close + 2;
    return true;
  });
}
