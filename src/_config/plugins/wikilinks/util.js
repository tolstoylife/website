// Title normalization + small HTML helpers shared by the rule and the index.
export const normalizeTitle = (s) =>
  String(s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();

export const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const slugifyHeading = (s) =>
  String(s ?? '').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
