---
title: "Nightly audit: from LLM cron to deterministic Python"
description: "The nightly hygiene audit ran nine checks through `claude -p` sub-sessions every night. Two hit the org's monthly usage limit on tonight's run, which surfaced the cost. All nine are now deterministic Python — full audit runs in five seconds, zero tokens."
date: 2026-05-14
tags: [development]
draft: false
templateEngineOverride: md
---

The nightly hygiene cron at `.claude/scripts/nightly-audit.sh` runs nine
consistency and quality checks across the repo and writes one HTML report
per check to `_generated/reports/`. The script was written when LLM-as-tool
was the obvious lever for "look at the project and decide if anything is
wrong" — each check shelled out to `claude -p "..."` with a long natural-
language prompt and `--max-turns 50`.

That worked for a while. Tonight two of the nine — `large-files-check` and
`gitignore-check` — failed with *"You've hit your org's monthly usage
limit"*. The other seven completed but had quietly been burning tokens
every night for the same deterministic work. The bill for "find files
larger than 5 MB" or "check whether every subproject's .gitignore covers
node_modules" was an entire Claude session, nightly.

## The conversion

Two of the nine already had Python audit scripts that Claude had
previously generated and saved into `_generated/scripts/`:

- `dead-links-audit.py` (708 lines) — internal link integrity across MD,
  HTML, Nunjucks
- `validate_frontmatter.py` (739 lines) — frontmatter validation per
  content type

Their wrappers were still calling `claude -p` every night, presumably to
regenerate or re-orchestrate. Both wrappers now just `exec python3
_generated/scripts/<script>.py`.

The remaining seven got fresh Python scanners, written to the same
pattern as `dead-links-audit.py`:

| Check | New script | What it does |
|---|---|---|
| `orphan-files` | `orphan-files-audit.py` | substring-matches every filename against a one-pass corpus of all text files; flags candidates with zero references |
| `large-files` | `large-files-audit.py` | walks tree, applies size + type thresholds, reports git-tracked status |
| `gitignore` | `gitignore-audit.py` | parses every `.gitignore`, checks each subproject covers expected patterns (node_modules, .DS_Store, .env), surfaces tracked-but-noisy files |
| `dependency-audit` | `dependency-audit.py` | builds a `{package: {file: version}}` matrix across all package.json files, flags mismatches |
| `encoding` | `encoding-audit.py` | byte-level checks for BOM/CRLF/non-UTF-8 plus character-level mojibake and mixed straight/curly quotes |
| `eleventy-config` | `eleventy-config-audit.py` | regex-extracts addCollection/addFilter/addShortcode/addPlugin/dir keys from every `.eleventy.js`, surfaces names that occur in multiple configs |
| `consistency` | `consistency-audit.py` | scans top-level docs for inline path mentions that don't resolve and for semver-like version strings disagreeing across files |

All seven use a shared set of skip rules — `primary-sources/` (immutable
upstream texts), `projects/bethink-yourselves/` and
`projects/birukoff-biography/md/` (OCR transcripts and raw scans),
`lightrag/data/` (runtime state), `_generated/`, `__backup`, `__scrap`,
node_modules, build outputs.

## Numbers

Full nightly audit, before and after:

| | Before | After |
|---|---|---|
| wall time | minutes to hours (intermittent timeouts and usage-limit failures) | **5 seconds** |
| token cost per night | meaningful (two scripts hit monthly limit tonight) | **$0** |
| reports produced | 5 of 9 on a good night, 7 of 9 on a great one | **9 of 9, every time** |

Tonight's results, signal-quality reasonable across the board:

- **consistency** — 18 docs scanned, 23 stale path references
- **dead-links** — 270 files scanned, 91 broken internal links across 25 files
- **orphan-files** — 786 files in scope, 52 orphan candidates (Eleventy Excellent
  starter-template leftovers — demo images, gallery, unused fonts, unused platform
  SVGs)
- **dependency-audit** — 3 package.json files, 2 version mismatches
- **eleventy-config** — 1 config, 0 divergences (only `website/.eleventy.js` exists)
- **encoding** — 311 files, 14 issues (mostly mixed straight/curly quotes)
- **frontmatter** — 288 files, 164 issues, 3 duplicate permalinks
- **large-files** — 2,316 files, 2 flagged
- **gitignore** — 3 subprojects, 3 missing-pattern issues

## What was lost

The previous LLM consistency check could in principle catch prose
contradictions — file X claims "the schema is v1.2", file Y claims "the
schema is v1.1". The deterministic version cannot. It catches three
things reliably:

1. Stale path mentions in docs (file/folder paths in inline-code that
   don't resolve, with suffix-match fallback so refs that exist under
   any subproject base are accepted)
2. Semver-like version strings that disagree across docs for the same
   package name
3. Glob patterns and code-block contents are skipped to keep noise down

For prose-level contradictions, the right answer is a human re-read
before a release, or an on-demand `claude -p` pass when something
specific is suspected — not a nightly bill.

## Two side fixes that fell out

- **`encoding-check.sh` had a shell quoting bug on line 26.** The
  prompt body contained an unescaped `"` character inside a
  double-quoted argument, so bash never got past parsing — the check
  never ran in its entire lifetime. The original `claude -p` version
  silently emitted nothing; the cron-log line was `"syntax error near
  unexpected token \`)'"`. Fixed before the conversion as a courtesy
  to the old script; moot now.
- **`nightly-audit.sh` `run_check()` swallowed exit codes.** Every
  check was wrapped in `bash "$script" >> "$LOG" 2>&1` followed
  unconditionally by `echo "$name done."`. Failed runs reported
  `done.` indistinguishable from successful runs, which is what
  hid the encoding bug for so long. `run_check` now captures `$?`
  and prints `FAILED (exit N)` to both stdout and the cron log on
  non-zero exit.

## Where the code lives

- Wrappers: `.claude/scripts/*-check.sh` (gitignored)
- Audit scripts: `_generated/scripts/*-audit.py` (gitignored)
- Reports: `_generated/reports/<check>-YYYY-MM-DD.html` (gitignored)

These are local nightly hygiene tools — they don't ship with the site,
they don't go in the public history. The deliberate gitignore on
`.claude/` and `_generated/` is the right call for working state.

The lesson is the obvious one in retrospect: an LLM is not a cron
runner. For deterministic checks at fixed intervals, the LLM should
write the script once, and the script runs forever after.
