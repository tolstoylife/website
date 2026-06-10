# CLAUDE.md — website

The authoritative project documentation lives in the parent repo at `../AGENTS.md` (mission, architecture, schema rules, conventions) and `../CLAUDE.md` (Claude-specific notes).

This `website/` directory is a submodule of `tolstoylife/tolstoy.life`. When working in this repo, read `../AGENTS.md` first.

## Site-specific reference

- **Schema** — `schema/wiki-schema.md` (v1.2, wiki articles) and `schema/tolstoy-works-schema.md` (v8, work metadata) are the source of truth for frontmatter. `schema/sources.yaml` is the shared sources library — the canonical list of source `id` values that `fieldSources` blocks reference. Superseded type-specific schemas are archived under `schema/_archive/`.
- **Build** — `npm run build` (production), `npm start` (dev), `npm run test:a11y` (accessibility).
- **Validators** — `.github/scripts/validate-frontmatter.mjs` enforces frontmatter rules and `chapterUri` format on every PR. `.github/scripts/check-determinism.mjs` runs the build twice and diffs output (non-blocking until current drifts resolve).
- **Eleventy ignores** — `src/sources/` and `src/_staging/` excluded via `.eleventyignore`.
- **Design tokens** — JSON sources in `src/_data/designTokens/`; `npm run penpot:tokens` regenerates `tokens/penpot-tokens.dtcg.json` and `../DESIGN.md`. Push to Penpot via MCP (preferred — `tolstoy.life - design tokens` file) or manual UI import. Full workflow + Plugin API gotchas: `../docs/design/penpot-tokens.md`. MCP server registration is in `.mcp.json`.
