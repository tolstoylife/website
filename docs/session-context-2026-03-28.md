# Session Context — tolstoy.life Schema Design
**Date:** 2026-03-28
**Project:** tolstoy.life — encyclopaedic web app and PWA about Leo Tolstoy

---

## What Was Decided in This Session

### Project Goal
Build a Supabase database (PostgreSQL) and Eleventy static site to catalogue all of Tolstoy's works with rich metadata: manuscripts, transcriptions, authoring locations, physical writing materials, publication history, censorship, and external identifiers.

### Naming Convention
- **camelCase** for all field names in YAML frontmatter and schema documentation
- **snake_case** is the implied Supabase/PostgreSQL equivalent — a 1-to-1 mechanical mapping (e.g. `titleEn` → `title_en`)
- No conversion logic needed to be built; tools handle it automatically

### File Structure
```
tolstoy-life/
├── CLAUDE.md                          # project instructions
├── tolstoy-works-schema.md            # canonical schema reference (v3)
├── sources.yaml                       # shared sources library
└── works/
    └── the-kingdom-of-god-is-within-you.yaml   # first test record
```

---

## Schema Overview (v3)

The schema has 9 sections. Full details in `tolstoy-works-schema.md`.

### 1. Core Identity
`id` · `titleEn` · `titleRu` · `titleAlternatives[]` (objects with `title`, `type`, `language`)

- `id` is the canonical tolstoy.life slug — always include the article (e.g. `the-kingdom-of-god-is-within-you`, not `kingdom-of-god-is-within-you`)
- `id` is the sole unique identifier for this project — `identifiers.tolstoyLife` was removed as redundant

### 2. Type & Genre
`genre` · `language` · `completionStatus` · `publishedDuringLifetime`

- `completionStatus`: `complete` · `incomplete` · `fragmentary` (not `unpublished` — that's handled by `publishedDuringLifetime`)
- `publishedDuringLifetime`: boolean replacing the old `unpublished` value and misplaced `posthumous` venue type

### 3. Chronology
All date fields follow this pattern:
- `date...` — Gregorian (NS), canonical, ISO 8601 (`YYYY`, `YYYY-MM`, or `YYYY-MM-DD`)
- `date...OldStyle` — Julian (OS) as recorded in Russian sources (Russia used Julian until 1918)
- `date...Approximate` — boolean, `true` if date is uncertain
- `time...` — time of day, accepts ISO `HH:MM` or descriptive (`morning` · `afternoon` · `evening` · `night`)

**Why Old Style?** The Julian calendar ran 12 days behind Gregorian in the 19th century (13 days from 1 March 1900). Always recording both allows cross-checking against Russian sources and catching dating errors.

Fields: `dateWritingStarted` · `dateWritingStartedOldStyle` · `dateWritingStartedApproximate` · `timeWritingStarted` · `dateWritingCompleted` · `dateWritingCompletedOldStyle` · `dateWritingCompletedApproximate` · `timeWritingCompleted` · `dateFirstPublished` · `dateFirstPublishedOldStyle` · `dateFirstPublishedApproximate` · `firstPublishedVenue` · `firstPublishedVenueType`

`firstPublishedVenueType`: `journal` · `newspaper` · `book` · `samizdat`

### 4. Authoring Locations
Array. Each entry: `country` · `region` · `city` · `estate` · `building` · `room` · `coordinates.lat` · `coordinates.lng` · `dateFrom` · `dateFromOldStyle` · `dateTo` · `dateToOldStyle` · `notes`

### 5. Manuscripts
Array — one entry per known draft (all known drafts, not just final).
Each entry includes: `draftId` · `draftNumber` · `draftLabel` · `dateCreated` · `dateCreatedOldStyle` · `dateCreatedApproximate` · `timeCreated` · `numberOfFolios` · `condition` · `currentRepository` · `repositoryCity` · `repositoryCountry` · `repositoryCallNumber` · `scans[]` · `writingMaterials`

- `scans` is an array (multiple digitisations from different institutions supported)
- `writingMaterials`: `pen` · `ink` · `paper` · `notes` (recorded per manuscript, not per work)
- `draftLabel`: `First draft` · `Intermediate draft` · `Final draft` · `Fair copy` · `Printer's copy`

### 6. Transcriptions
Array — one entry per known transcription.
Controlled transcriber list: `sophia-tolstaya` · `tatyana-tolstaya` · `maria-tolstaya` · `nikolai-gusev` · `leo-tolstoy` · `other`
Each entry: `transcriberId` · `transcriberName` · `relationToAuthor` · `dateTranscribed` · `dateTranscribedOldStyle` · `dateTranscribedApproximate` · `timeTranscribed` · `currentRepository` · `repositoryCity` · `repositoryCountry` · `repositoryCallNumber` · `scans[]` · `notes`

### 7. Bibliographic
`dedicatedToEn` · `dedicatedToRu` · `epigraph` · `epigraphAuthor` · `epigraphSource` · `themes[]` · `subjectHeadings[]` (LCSH) · `synopsis` · `banStatus` · `censorshipNotes` · `wordCount` · `relatedWorks[]` · `notes`

**banStatus** (added from Kingdom of God test): `banned` · `banningAuthority` · `banDate` · `banDateOldStyle` · `banDateApproximate` · `banLiftedDate` · `banLiftedDateOldStyle` · `banLiftedDateApproximate` · `notes`

**relatedWorks** is an array of objects: `id` (tolstoy.life slug) + `relationshipType` (`cycle` · `sequel` · `prequel` · `source` · `companion` · `adaptation`)

### 8. Identifiers
All under `identifiers`: `wikidata` · `openLibrary` · `goodreads` · `librarything` · `gutenberg[]` · `internetArchive[]` · `lccn` · `oclc[]` · `viaf` · `bnf` · `jubileeEdition.volumes` · `jubileeEdition.notes`

- `jubileeEdition.volumes` is a free string (e.g. `"28"` or `"18–19"`)

### 9. Field Sources
A `fieldSources` block at the bottom of each work record maps field names to source IDs from `sources.yaml`. Keeps primary data fields clean while enabling field-level source attribution.

```yaml
fieldSources:
  dateWritingStarted:
    - sourceId: "jubilee-edition"
      volume: "28"
      page: "xii"
      quote: ""
      notes: ""
```

Sub-fields per citation: `sourceId` · `volume` · `page` · `quote` · `notes`
Nested fields use dot notation; array items use index notation (`manuscripts[0].currentRepository`).

---

## Sources Library (`sources.yaml`)

A shared file defining all sources referenced across work records. Source types:
- `book` — author, title, publisher, city, year, language, url
- `article` — same as book plus journal name
- `archival` — repository, city, country, fond, opis, delo, callNumber, description
- `database` — name, url, dateAccessed
- `primary` — author, title, repository, repositoryCallNumber, description

Seed entries already added: Jubilee Edition, Maude biography (vols 1–2), Eikhenbaum, Tolstoy Museum Moscow, RGB Fond 93, Yasnaya Polyana archive, Wikidata, Open Library, Project Gutenberg, Internet Archive, Sophia's diary, Tolstoy's diaries.

---

## Open Questions (not yet resolved)

1. **Supabase table structure** — nested arrays (manuscripts, transcriptions, authoringLocations) will need relational tables or JSONB columns. Not yet decided.
2. **Identifier subtask** — finding/establishing a canonical ID convention for the tolstoy.life `id` slug beyond "include the article". Any external standard to align with?
3. **Master slug list** — `relatedWorks` references other tolstoy.life IDs; a master list of canonical slugs for all works needs to be established to ensure consistency.
4. **`censorshipNotes` structure** — currently free text; could become structured. Deferred.
5. **Word count source** — no canonical word count source established yet.

---

## Key Conventions to Remember

- Article words (`the`, `a`, `an`) are **included** in slugs (e.g. `the-kingdom-of-god-is-within-you`)
- Every date field has an `...OldStyle` Julian companion
- `scan` is always `scans[]` (array) to support multiple digitisations
- Writing materials are per-manuscript, not per-work
- Sources are defined once in `sources.yaml` and referenced by `sourceId` everywhere
- Use `# needs verification` inline comments to flag uncertain data in work records
