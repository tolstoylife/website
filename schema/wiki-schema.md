# wiki-schema.md — Wiki Article Schema

> **Version:** 1.4 (2026-06-09)
> **Companion to:** `schema/tolstoy-works-schema.md` (v6) for work metadata.
> **Changelog:** v1.4 (2026-06-09) — added the `character` (11th) and `group` (12th) wiki types, driven by the *Resurrection* and *Kreutzer Sonata* novel-dives, which had no home for fictional characters or real-world sects and routed Maslova / Nekhlyudov / Pozdnyshev / the Doukhobors / the Shakers as `concept` stopgaps. **`character`** = a fictional character in Tolstoy's works, minted as a standalone page only when it earns one (a *tiering rule*, below), and carrying a structured `prototypes[]` field — the real person(s) the character is modelled on, with `basis` and `certainty` evidence enums. This is the fiction→life edge (Levin ↔ Tolstoy, Maslova ↔ Rozalia Oni, Nekhlyudov ↔ Chertkov). **`group`** = a bounded real-world community (sect, people, ethnic group), distinct from `concept` (an idea or movement) and `institution` (an organisation). The reverse life→fiction direction is left to Obsidian backlinks (no reciprocal field added to `person`). Also reconciled `.github/scripts/validate-frontmatter.mjs` `WIKI_TYPES`. v1.3 (2026-05-31) — added the `edition` wiki type (10th type) for published editions of Tolstoy's works (e.g. the Jubilee Edition, the in-progress IMLI academic PSS). Distinct from `institution` (the publisher or DH project), `criticalWork` (scholarship *about* Tolstoy), the per-work `editions[]` sidecar in the works schema (publication history of a single work), and a `sources.yaml` citation id. Also reconciled `.github/scripts/validate-frontmatter.mjs` `WIKI_TYPES`, which still listed only the original four types. v1.2 (2026-04-27) — salvaged richer optional fields from the superseded v1 type-specific schemas (now archived under `schema/_archive/`). Added: `nameAlternatives`, `causeOfDeath`, `relationshipDescription`, `periodOfContact`, `authorityTier`, `occupation`, `religion`, `politicalViews`, `synopsis`, `worksAuthored/Translated/Edited/Transcribed` for persons; `nameAlternatives`, `placeType`, `city`, `coordinates.approximate`, `roleInTolstoyLife`, `periodOfAssociation`, `synopsis`, `worksWrittenHere` for places; `viaf`, `lccn`, `bnf` for person identifiers, `geonames`, `openStreetMap` for place identifiers. All additions are optional. v1.1 (2026-04-16) — added 5 wiki types (translator, institution, adaptation, criticalWork, archivalFond), added explicit `title` field, fixed companion ref.

This document defines the structure, frontmatter templates, and conventions for wiki articles in `src/wiki/`. It also covers the source cards, index, and log files in `src/sources/`.

Works have their own schema (`schema/tolstoy-works-schema.md`). This file covers people, places, events, concepts, translators, institutions, adaptations, critical works, archival fonds, editions, characters, and groups.

---

## Page types

Every wiki article has a `type` field in its frontmatter. The twelve types are:

| Type | What it covers | Examples |
|---|---|---|
| `person` | Historical individuals | Sophia Tolstaya, Ivan Turgenev, Aylmer Maude |
| `place` | Locations and buildings | Yasnaya Polyana, Moscow, Astapovo station |
| `event` | Historical events and incidents | Excommunication of Tolstoy, Emancipation reform of 1861 |
| `concept` | Ideas, movements, and themes | Christian anarchism, Tolstoyan movement, Non-resistance |
| `translator` | Translators of Tolstoy's works | Aylmer Maude, Constance Garnett, Louise Maude |
| `institution` | Publishers, archives, organisations | Intermediary (Posrednik), Russkiy Vestnik, Tolstoy Museum |
| `adaptation` | Film, stage, and other adaptations | Anna Karenina (1935 film), War and Peace (1966 film) |
| `criticalWork` | Major scholarly or critical works about Tolstoy | Shklovsky's *Tolstoy*, Eikhenbaum's *Young Tolstoy* |
| `archivalFond` | Archival collections and fonds | GMT fond 1, RGB fond 304 |
| `edition` | Published editions of Tolstoy's works (as bibliographic objects) | Jubilee Edition (Полное собрание сочинений), IMLI academic PSS, Free Age Press series |
| `character` | Fictional characters in Tolstoy's works | Katyusha Maslova, Pozdnyshev, Konstantin Levin |
| `group` | Real-world peoples, sects, and communities | Doukhobors, Shakers, Caucasus highlanders |

**Note on `translator` vs `person`:** Translators who are notable in their own right (e.g. Aylmer Maude, who was also a biographer and friend of Tolstoy) should use `type: person` with a `translator` role. The `translator` type is for individuals known primarily as translators, where the translation work is the main subject of the article.

**Note on `character` vs `person`:** A `character` is a fictional figure who exists inside a work (Maslova, Pozdnyshev, Levin); a `person` is a historical individual who existed in life. The connection between them — the real model a character is drawn from — is carried by the `character` type's `prototypes[]` field, *not* by conflating the two. A historical person who merely appears as themselves in a documentary passage stays a `person`.

**Note on `group` vs `concept` vs `institution`:** A `group` is a bounded community of real people — a sect, a people, an ethnic group (Doukhobors, Shakers, the Caucasus highlanders). It is distinct from a `concept`, which is an *idea or movement* (Christian anarchism, non-resistance, the Tolstoyan movement as a body of thought), and from an `institution`, which is a formally organised body (a publisher, archive, museum, or church). The test: if it has members, a founding, and a geography, it is a `group`; if it is a system of ideas, it is a `concept`; if it is an organisation with an administrative structure, it is an `institution`.

---

## Frontmatter conventions

All frontmatter follows these rules (inherited from the root CLAUDE.md):

- Fields use **camelCase**.
- Dates are **ISO 8601** (`YYYY-MM-DD`, `YYYY-MM`, or `YYYY`).
- Pre-1918 dates must have a `...OldStyle` companion field.
- Uncertain dates use a `...Approximate: true` companion.
- Empty optional fields use `""` (string) or `[]` (array) — never `null` or omitted.
- Prefer **Wikidata QIDs** as the primary external identifier.
- `id` is the canonical slug — kebab-case, unique across the entire vault.
- `recordStatus` is one of: `draft`, `reviewed`, `verified`.

---

## Person template

```yaml
---
id: sophia-tolstaya
recordStatus: draft
type: person
title: Sophia Tolstaya
titleEn: Sophia Tolstaya
titleRu: Софья Андреевна Толстая
nameAlternatives:
  - name: "Sofya Andreyevna Bers"
    type: maiden
    language: en
description: "Wife of Leo Tolstoy, diarist, and manuscript transcriber (1844–1919)."
birthDate: "1844-10-03"
birthDateOldStyle: "1844-09-21"
birthDateApproximate: false
deathDate: "1919-11-04"
deathDateOldStyle: ""
deathDateApproximate: false
birthPlace: "Pokrovskoye-Streshnevo, Moscow, Russia"
deathPlace: "Yasnaya Polyana, Tula Oblast, Russia"
causeOfDeath: ""
nationality: Russian
religion: ""
politicalViews: ""
roles:
  - diarist
  - transcriber
  - photographer
occupation:
  - diarist
  - transcriber
relationToTolstoy: wife
relationshipDescription: "Tolstoy's wife of 48 years; principal manuscript copyist and household manager."
periodOfContact:
  from: "1862"
  to: "1910"
  notes: ""
authorityTier: 1
synopsis: ""
worksAuthored: []
worksTranslated: []
worksEdited: []
worksTranscribed:
  - anna-karenina
  - war-and-peace
relatedWorks:
  -
    id: anna-karenina
    role: transcriber
  -
    id: war-and-peace
    role: transcriber
relatedArticles:
  - yasnaya-polyana
  - leo-tolstoy
themes:
  - Tolstoy family
  - manuscript transcription
identifiers:
  wikidata: Q2917962
  viaf: ""
  lccn: ""
  bnf: ""
fieldSources:
  birthDate:
    -
      sourceId: jubilee-edition
      volume: ""
      page: ""
      notes: ""
---

Prose content about this person. All claims cite primary sources.
Uses [[wikilinks]] to connect to other vault files.
```

### Field notes for `person`

- **`nameAlternatives`** (optional) — array of `{name, type, language}` entries for maiden names, aliases, common transliterations, or variants. `type` values: `maiden` · `alias` · `transliteration` · `variant`.
- **`causeOfDeath`** (optional) — free text. Useful for figures where this is documented and historically relevant.
- **`relationshipDescription`** (optional) — one-sentence summary of the relationship to Tolstoy.
- **`periodOfContact`** (optional) — `{from, to, notes}`. ISO 8601 years or dates. Useful for non-family figures whose contact with Tolstoy is bounded.
- **`authorityTier`** (optional, integer 1–3) — source authority tier. `1` = inner circle (Birukoff, Chertkov, family), `2` = trusted secondary, `3` = fact-check only. Helps weight conflicting claims.
- **`occupation`** (optional, string array) — free keyword tags. Distinct from `roles` (which describes roles in relation to Tolstoy and his works); `occupation` is the person's general profession.
- **`religion`**, **`politicalViews`** (optional, free text) — when documented and relevant to the person's relationship to Tolstoy.
- **`synopsis`** (optional, 2–4 sentences) — biographical summary embedded in frontmatter for use by indexes and previews. The article body remains the canonical prose.
- **`worksAuthored` / `worksTranslated` / `worksEdited` / `worksTranscribed`** (optional, string arrays of `id` slugs) — typed lists of associated works. Distinct from `relatedWorks`, which carries free-form `role` values.
- **`identifiers.viaf` / `.lccn` / `.bnf`** (optional) — additional authority-file identifiers beyond Wikidata. Useful for scholars cross-referencing library catalogues.

---

## Place template

```yaml
---
id: yasnaya-polyana
recordStatus: draft
type: place
title: Yasnaya Polyana
titleEn: Yasnaya Polyana
titleRu: Ясная Поляна
nameAlternatives:
  - name: "Bright Glade"
    type: translation
    language: en
description: "Tolstoy's primary estate in Tula Oblast, Russia."
placeType: estate
country: Russia
region: Tula Oblast
city: Tula
coordinates:
  lat: 54.0667
  lon: 37.5167
  approximate: false
significancePeriod: "1828–1910"
roleInTolstoyLife: primary-residence
periodOfAssociation:
  from: "1828"
  fromOldStyle: "1828"
  to: "1910"
  toOldStyle: "1910"
  notes: "Birthplace and lifelong home, except for periods in Moscow and travels."
synopsis: ""
worksWrittenHere:
  - war-and-peace
  - anna-karenina
relatedArticles:
  - leo-tolstoy
  - sophia-tolstaya
themes:
  - Tolstoy residences
  - Russian literary landmarks
identifiers:
  wikidata: Q830274
  geonames: ""
  openStreetMap: ""
fieldSources: {}
---

Prose content about this place.
```

### Field notes for `place`

- **`nameAlternatives`** (optional) — same shape as for persons. `type` values: `historical` · `transliteration` · `variant` · `translation`.
- **`placeType`** (optional, controlled vocabulary) — `estate` · `city` · `town` · `village` · `region` · `country` · `building` · `room` · `station` · `monastery` · `other`. Use `building` or `room` for sub-locations within a larger place (e.g. Tolstoy's study within Yasnaya Polyana).
- **`city`** (optional) — nearest city or town for non-urban places (estates, villages, stations).
- **`coordinates.approximate`** (optional, boolean) — `true` when coordinates are estimated rather than verified.
- **`roleInTolstoyLife`** (optional, controlled vocabulary) — `birthplace` · `primary-residence` · `writing-location` · `death-location` · `exile` · `visited` · `correspondence-destination` · `other`. Captures the place's specific significance.
- **`periodOfAssociation`** (optional) — `{from, fromOldStyle, to, toOldStyle, notes}`. Date range of Tolstoy's primary association with the place. Use `fromOldStyle` and `toOldStyle` for pre-1918 dates.
- **`synopsis`** (optional, 2–4 sentences) — frontmatter summary, parallel to person `synopsis`.
- **`worksWrittenHere`** (optional, string array of `id` slugs) — works authored at this location.
- **`identifiers.geonames` / `.openStreetMap`** (optional) — additional geographic identifiers beyond Wikidata. `openStreetMap` accepts node/way/relation IDs.

---

## Event template

```yaml
---
id: excommunication-of-tolstoy
recordStatus: draft
type: event
title: Excommunication of Tolstoy
titleEn: Excommunication of Tolstoy
titleRu: Отлучение Толстого от церкви
description: "The Holy Synod's 1901 proclamation declaring Tolstoy outside the Orthodox Church."
date: "1901-02-24"
dateOldStyle: "1901-02-11"
dateApproximate: false
location: "Saint Petersburg, Russia"
relatedArticles:
  - leo-tolstoy
  - sophia-tolstaya
themes:
  - Russian Orthodox Church
  - censorship
  - Tolstoy's religious views
identifiers:
  wikidata: ""
fieldSources: {}
---

Prose content about this event.
```

---

## Concept template

```yaml
---
id: christian-anarchism
recordStatus: draft
draft: true
type: concept
title: Christian Anarchism
titleEn: Christian Anarchism
titleRu: Христианский анархизм
description: "Political philosophy combining Christianity with anarchism, heavily influenced by Tolstoy's later writings."
relatedArticles:
  - leo-tolstoy
  - the-kingdom-of-god-is-within-you
relatedWorks:
  -
    id: the-kingdom-of-god-is-within-you
    relationshipType: source
themes:
  - political philosophy
  - pacifism
  - non-resistance
identifiers:
  wikidata: Q192936
fieldSources: {}
---

Prose content about this concept.
```

**Note on `title` field:** The Eleventy wiki index template (`index.njk`) uses `entry.data.title` for display. All wiki pages must include an explicit `title` field in frontmatter — not only `titleEn`. For most pages, `title` and `titleEn` should be identical.

**Note on `draft: true`:** Pages with `draft: true` are excluded from the production build but visible locally with `npm run dev`. Use this alongside `recordStatus: draft` for pages that are not yet ready for the live site.

---

## Translator template

```yaml
---
id: constance-garnett
recordStatus: draft
type: translator
title: Constance Garnett
titleEn: Constance Garnett
titleRu: Констанс Гарнетт
description: "English translator who produced the first widely-read English translations of Tolstoy, Dostoevsky, and Chekhov."
birthDate: "1861-12-19"
deathDate: "1946-12-17"
nationality: British
languages:
  - ru
  - en
translatedWorks:
  -
    id: anna-karenina
    year: "1901"
    publisher: "William Heinemann"
  -
    id: war-and-peace
    year: "1904"
    publisher: "William Heinemann"
relatedArticles:
  - aylmer-maude
themes:
  - translation
  - English reception of Tolstoy
identifiers:
  wikidata: Q237126
fieldSources: {}
---

Prose content about this translator.
```

---

## Institution template

```yaml
---
id: posrednik
recordStatus: draft
type: institution
title: Intermediary (Posrednik)
titleEn: Intermediary (Posrednik)
titleRu: Посредник
description: "Publishing house founded in 1884 by Vladimir Chertkov and Ivan Sytin to distribute affordable editions of Tolstoy's works to the Russian peasantry."
foundedDate: "1884"
foundedDateOldStyle: ""
foundedDateApproximate: false
dissolvedDate: "1935"
dissolvedDateApproximate: true
institutionType: publisher
location: "Moscow, Russia"
founders:
  - vladimir-chertkov
  - ivan-sytin
relatedArticles:
  - leo-tolstoy
  - vladimir-chertkov
themes:
  - publishing
  - popular education
  - Tolstoyan movement
identifiers:
  wikidata: Q4380199
fieldSources: {}
---

Prose content about this institution.
```

**Controlled values for `institutionType`:** `publisher` · `archive` · `museum` · `university` · `church` · `government` · `literary-society` · `other`

---

## Adaptation template

```yaml
---
id: anna-karenina-1935-film
recordStatus: draft
type: adaptation
title: Anna Karenina (1935 film)
titleEn: Anna Karenina (1935 film)
titleRu: ""
description: "1935 American film adaptation starring Greta Garbo, directed by Clarence Brown."
sourceWork: anna-karenina
adaptationType: film
year: "1935"
director: "Clarence Brown"
language: en
country: "United States"
relatedArticles:
  - anna-karenina
themes:
  - film adaptation
  - American reception of Tolstoy
identifiers:
  wikidata: Q272628
fieldSources: {}
---

Prose content about this adaptation.
```

**Controlled values for `adaptationType`:** `film` · `television` · `stage` · `opera` · `ballet` · `radio` · `musical` · `graphic-novel` · `other`

---

## Critical work template

```yaml
---
id: eikhenbaum-young-tolstoy
recordStatus: draft
type: criticalWork
title: "The Young Tolstoy"
titleEn: "The Young Tolstoy"
titleRu: "Молодой Толстой"
description: "Boris Eikhenbaum's 1922 formalist study of Tolstoy's early literary development."
author: "Boris Eikhenbaum"
publicationDate: "1922"
language: ru
subjectWorks:
  - childhood
  - sevastopol-sketches
  - the-cossacks
relatedArticles:
  - leo-tolstoy
themes:
  - literary criticism
  - Russian formalism
identifiers:
  wikidata: ""
fieldSources: {}
---

Prose content about this critical work.
```

---

## Archival fond template

```yaml
---
id: gmt-fond-1
recordStatus: draft
type: archivalFond
title: "GMT Fond 1"
titleEn: "GMT Fond 1 — Manuscripts of Leo Tolstoy"
titleRu: "ГМТ Фонд 1 — Рукописи Л.Н. Толстого"
description: "Primary manuscript collection of Leo Tolstoy at the State Museum of Leo Tolstoy, Moscow."
repository: "State Museum of Leo Tolstoy (GMT)"
repositoryCity: "Moscow"
repositoryCountry: "Russia"
fondNumber: "1"
opis: ""
estimatedItems: 0
dateRange: "1840s–1910"
relatedArticles:
  - leo-tolstoy
themes:
  - archives
  - manuscripts
identifiers:
  wikidata: ""
fieldSources: {}
---

Prose content about this archival fond.
```

---

## Edition template

An `edition` article documents a **published edition of Tolstoy's works as a bibliographic object** — the edition itself is the subject (its editorial history, scope, principles, and reception), not any single work it contains.

```yaml
---
id: jubilee-edition
recordStatus: draft
type: edition
title: The Jubilee Edition
titleEn: "The Jubilee Edition (Complete Collected Works)"
titleRu: "Полное собрание сочинений (Юбилейное издание)"
description: "The authoritative 90-volume scholarly edition of Tolstoy's complete works, diaries, and letters (1928–1958), with a 1964 index volume."
editionType: complete-collected
format: print
editorInChief: vladimir-chertkov
publisher: "Goslitizdat (Государственное издательство «Художественная литература»)"
publisherCity: "Moscow"
publicationStartDate: "1928"
publicationStartDateOldStyle: ""
publicationStartDateApproximate: false
publicationEndDate: "1958"
publicationEndDateOldStyle: ""
publicationEndDateApproximate: false
volumes: 90
language: ru
basedOn: "Tolstoy's manuscripts (GMT, RGB), diaries, and letters; a maximalist completeness principle"
sourceId: jubilee-edition
relatedArticles:
  - vladimir-chertkov
  - leo-tolstoy
  - alexandra-tolstaya
themes:
  - textual scholarship
  - Soviet-era publishing
  - copyright renunciation
identifiers:
  wikidata: ""
fieldSources: {}
---

Prose content about this edition.
```

**Controlled values for `editionType`:** `complete-collected` · `selected-works` · `academic-critical` · `popular` · `translation-series` · `other`

**Controlled values for `format`:** `print` · `digital` · `both`

### Field notes for `edition`

- **`editionType`** (controlled vocabulary) — the kind of edition. `complete-collected` (e.g. the Jubilee Edition), `academic-critical` (e.g. the IMLI PSS), `popular` (cheap mass editions, e.g. Posrednik / Free Age Press), `selected-works`, `translation-series`, `other`. Distinct from the works-schema §8 `editionType` (`first`/`revised`/`collected-works`/…), which classifies a *single work's* publication record, not the edition as a whole.
- **`format`** (controlled vocabulary) — `print`, `digital`, or `both`. Distinguishes the print Jubilee Edition from a digital edition such as the tolstoydigital TEI corpus.
- **`editorInChief`** (optional) — wiki `id` slug of the editor-in-chief or general editor; use free text if they have no wiki page. For an editorial board, name the chief here and list the rest in prose.
- **`publisher` / `publisherCity`** (optional) — the publishing house. When the publisher also warrants its own article, give it an `institution` page and link from `relatedArticles`.
- **`publicationStartDate` / `publicationEndDate`** (optional) — the publication span. Use `...OldStyle` companions for pre-1918 dates and `...Approximate: true` for uncertain ones (per the frontmatter conventions above).
- **`volumes`** (optional, integer) — number of volumes; `0` if not volume-based.
- **`basedOn`** (optional, free text) — the textual/manuscript base and the editorial principle behind the edition.
- **`sourceId`** (optional) — the matching `id` in `schema/sources.yaml` when the edition is *also* registered as a citable source (e.g. `jubilee-edition`, `tolstoydigital-tei`). This is the bridge between the edition-as-subject (this article) and the edition-as-citation (the sources library).

**Note on `edition` vs adjacent models:** an `edition` is the whole published edition as a subject. It is distinct from (1) `institution` — the publisher or digital-humanities project that *produced* the edition; (2) `criticalWork` — scholarship written *about* Tolstoy; (3) the per-work `editions[]` array in `schema/tolstoy-works-schema.md` §8, which records the publication history of one individual work; and (4) a bare `sources.yaml` id, which is only a citation handle. A digital edition (e.g. the tolstoydigital TEI corpus) may be modelled as an `edition`, an `institution`, or both, depending on whether the article's subject is the encoded text or the project behind it.

---

## Character template

A `character` article documents a **fictional character in one (or more) of Tolstoy's works**. Its distinctive payload is the `prototypes[]` field: the real person(s) the character is drawn from, with the evidence basis and confidence recorded — the fiction→life edge that gives a character a reason to be a graph node rather than a line of prose on the work's page.

```yaml
---
id: katyusha-maslova
recordStatus: draft
type: character
title: Katyusha Maslova
titleEn: Katyusha Maslova
titleRu: Катюша Маслова
description: "The heroine of Tolstoy's Resurrection (1899); a wronged servant-girl turned prisoner whose trial reopens Prince Nekhlyudov's conscience."
appearsIn:
  - resurrection
roleInWork: protagonist
prototypes:
  -
    person: ""
    name: "Rozalia Oni"
    basis: documented
    certainty: probable
    note: "The 1887 St Petersburg court case the jurist A. F. Koni told Tolstoy; the plot seed («Коневская повесть»)."
    sourceId: ""
relatedArticles:
  - resurrection
  - anatoly-koni
themes:
  - guilt and repentance
  - prostitution and the courts
identifiers:
  wikidata: ""
fieldSources: {}
---

Prose about the character: genesis, the prototype basis, and the character's role in the work. Hard facts and *attributed* attributions only — no literary interpretation (see Prose conventions).
```

### When a character earns its own page (the tiering rule)

A 500-page novel has dozens of named figures; do **not** mint a page for each. Create a standalone `character` page only when the figure meets at least one of:

1. **Principal or titular** — a protagonist, narrator, or title figure (Maslova, Nekhlyudov, Pozdnyshev, Hadji Murat).
2. **Documented or attributed prototype** — there is a real model worth recording as a `prototypes[]` edge (this is the main reason the type exists).
3. **Recurs across works** — the same character appears in more than one work.

A figure that meets none of these folds into the work's own overview page (prose) or the principal character's page, and is left out of the entity manifest as a standalone node. Record the call in the dive's `needsReview` when it is a judgment call.

### Field notes for `character`

- **`appearsIn`** (required, string array of work `id` slugs) — the work(s) the character appears in. The array handles Tolstoy's reused names: when *the same* character recurs, list every work id on one page; when a name is reused for a *different* figure (e.g. the several distinct "Nekhlyudov"s across *A Landowner's Morning*, *Lucerne*, and *Resurrection*), give each its own page and disambiguate the title (`Dmitri Nekhlyudov (Resurrection)`).
- **`roleInWork`** (controlled vocabulary) — `protagonist` · `principal` · `secondary` · `narrator` · `antagonist` · `titular`.
- **`prototypes`** (optional, array) — the real person(s) the character is modelled on. Each entry:
  - **`person`** — wiki `id` slug of the real person, or `""` if they have no page (yet).
  - **`name`** — free-text name; always present, even when `person` is empty, so the model is named even before a page exists.
  - **`basis`** (controlled vocabulary) — *how the attribution is known*: `author-stated` (Tolstoy named or acknowledged the model) · `autobiographical` (the character carries Tolstoy's own biography, e.g. Levin) · `editorial` (the PSS / Jubilee editors' conjecture) · `scholarly` (a later scholarly attribution) · `contemporary` (a memoirist or family member identified them).
  - **`certainty`** (controlled vocabulary) — *confidence*: `documented` · `probable` · `conjectured`. Orthogonal to `basis`: an `editorial` attribution may be `probable` or `conjectured`; an `author-stated` one is `documented`. Never flatten a conjecture into a fact — a too-confident prototype link silently overclaims (cf. Levin ↔ Tolstoy, which is `autobiographical` + `probable`, never `author-stated`).
  - **`note`** (free text) — the substance of the attribution.
  - **`sourceId`** (optional) — the `sources.yaml` id attesting the attribution.
- **Reverse direction:** there is deliberately **no** reciprocal field on `person`. The life→fiction direction (Tolstoy → Levin, Nekhlyudov, Pozdnyshev…) is served by Obsidian backlinks and `relatedArticles`, keeping the already-heavy `person` type lean.

---

## Group template

A `group` article documents a **bounded real-world community** — a religious sect, a people, an ethnic group. Distinct from `concept` (an idea or movement) and `institution` (a formally organised body); see the disambiguation note under *Page types*.

```yaml
---
id: doukhobors
recordStatus: draft
type: group
title: Doukhobors
titleEn: Doukhobors
titleRu: Духоборцы
description: "A Russian pacifist Christian sect; Tolstoy funded their 1898–1899 emigration to Canada with the fees from Resurrection."
groupType: religious-sect
originDate: ""
originDateApproximate: false
originPlace: "Russia"
relatedArticles:
  - resurrection
  - leo-tolstoy
  - vladimir-chertkov
themes:
  - sectarianism
  - pacifism
  - emigration
identifiers:
  wikidata: Q319099
fieldSources: {}
---

Prose about the group: origin, beliefs, geography, and its documented relationship to Tolstoy and his works.
```

### Field notes for `group`

- **`groupType`** (controlled vocabulary) — `religious-sect` · `ethnic-group` · `people` · `community` · `other`. Doukhobors and Shakers are `religious-sect`; the Caucasus highlanders are an `ethnic-group`.
- **`originDate`** (optional) — founding or first-attestation date; use `...OldStyle` / `...Approximate` companions per the frontmatter conventions.
- **`originPlace`** (optional, free text) — place of origin.
- A `group` is the *community of people*. A doctrine the group holds (e.g. non-resistance, total chastity) is a separate `concept`; a publishing or administrative body it runs is an `institution`. Link across the three with `relatedArticles`.

---

## Source card template — `src/sources/`

Each major source gets a small `.md` stub in `src/sources/`. Source cards make sources visible in Obsidian's graph and wikilink-able from wiki articles and log entries. The binary file itself stays in `primary-sources/` at the project root.

```yaml
---
id: birukoff-biography
type: source
titleEn: "Leo Tolstoy: His Life and Work"
titleRu: "Биография Л.Н. Толстого"
author: "Paul Birukoff"
publicationDate: "1911"
language: en
format: epub
binaryPath: "primary-sources/birukoff/leo-tolstoy-his-life-and-work.epub"
ingestionStatus: pending
ingestionDate: ""
pagesCreated: []
pagesUpdated: []
notes: "Awaiting cleaned EPUB. Original OCR had spacing artifacts."
---

One of the earliest comprehensive biographies of Tolstoy, written by a close associate. Primary source for biographical dates and events up to 1910.

Covers: early life, education, military service, literary career, religious crisis, final years.
```

### Fields

- `ingestionStatus`: `pending` · `partial` · `complete`
- `binaryPath`: relative path from the project root to the actual file in `primary-sources/`
- `pagesCreated` / `pagesUpdated`: filled in by Claude after ingestion, creating a record of what this source contributed to the wiki
- The prose section is a brief description of the source's scope and relevance

### Rules

- One source card per major source (not per chapter or per file within an archive)
- For large archives (e.g., the TEI/XML collection), one card for the collection with notes on which subsets have been ingested
- Source cards are referenced from the log: `Ingested from [[Birukoff Biography]]`
- Source cards are referenced from wiki articles via fieldSources or inline citations

---

## Index file — `src/sources/index.md`

The index is a catalog of every content page in the vault. Claude reads this first when navigating the vault at the start of a session or when answering queries. It should be kept current — updated on every ingest operation.

### Format

```md
# Vault Index

Last updated: 2026-04-06

## People

- [[Sophia Tolstaya]] — Wife of LT, diarist, manuscript transcriber (1844–1919)
- [[Leo Tolstoy]] — Russian novelist and moral philosopher (1828–1910)

## Places

- [[Yasnaya Polyana]] — Tolstoy's primary estate, Tula Oblast

## Events

(none yet)

## Concepts

(none yet)

## Translators

(none yet)

## Institutions

(none yet)

## Adaptations

(none yet)

## Critical Works

(none yet)

## Archival Fonds

(none yet)

## Characters

(none yet)

## Groups

(none yet)

## Works

- [[Anna Karenina]] — Novel (1878), genre: novel, status: draft
- [[War and Peace]] — Novel (1869), genre: novel, status: draft

## Letters

(none yet)

## Images

(none yet)

## Sources

- [[Birukoff Biography]] — Paul Birukoff, biography (1911), status: pending
- [[TEI Reference Data]] — tolstoydigital TEI/XML (persons, locations, works), status: partial
```

### Rules

- One line per entry: `- [[Title]] — one-line summary`
- Organised by type, then alphabetically within each type
- Summaries should be under 80 characters
- Include key metadata inline (dates, genre, status) so Claude can quickly assess relevance without opening the file
- Works entries link to the work overview file, not the text files

---

## Log file — `src/sources/log.md`

The log is an append-only chronological record of wiki operations. It provides narrative context that git history doesn't capture.

### Format

```md
# Wiki Operations Log

## [2026-04-06] ingest | TEI personList.xml (test run)

**Source:** `sources/tolstoydigital-TEI/reference/personList.xml`
**Pages created:** Sophia Tolstaya, Tatyana Tolstaya, Maria Tolstaya
**Pages updated:** Leo Tolstoy (added relatedArticles)
**Notes:** Test run with 3 entities from Tolstoy's immediate family. Wikidata QIDs confirmed for all three. Sophia's birth date cross-checked against Jubilee Edition vol. 83.
**Open questions:** Sophia's death date varies across sources — 1919-11-04 (Maude) vs 1919-11-04 (Birukoff). Both agree; recorded as verified.

## [2026-04-06] lint | Initial vault health check

**Pages reviewed:** 5
**Issues found:** Leo Tolstoy.md had frontmatter fields from the old Supabase schema that needed updating.
**Actions taken:** Updated frontmatter to match wiki-schema.md person template. Removed legacy zone marker from pre-LLM-Wiki era.
```

### Rules

- Each entry starts with `## [YYYY-MM-DD] operation | Subject`
- Operations: `ingest`, `query`, `lint`, `edit`
- Always record: source, pages touched, notes, open questions
- Parseable with grep: `grep "^## \[" log.md | tail -5`
- Append only — never edit or delete old entries

---

## Prose conventions

All wiki article prose follows these standards:

- **Hard facts only.** No literary interpretation, no aesthetic judgments, no unattributed claims.
- **Every claim cites a primary source.** Use inline parenthetical citations: `(Jubilee Edition, vol. 83, p. 12)` or `(Maude, *The Life of Tolstoy*, vol. 2, ch. 14)`.
- **Source authority order:** Jubilee Edition → Tolstoy's diaries and letters → Birukoff biography → Chertkov correspondence → Maude biography.
- **When sources conflict**, record both values and note the conflict explicitly. Never silently prefer one source.
- **NS/OS dates:** Use NS (Gregorian) as the primary date in prose. Include OS in parentheses on first mention: "9 September 1828 (OS: 28 August)".
- **Wikilinks:** Use `[[double brackets]]` to link to other vault files. Link on first meaningful mention per article, not every occurrence.
- **Russian names:** Use the most common English transliteration for the article title. Include the full Russian name in Cyrillic in the first sentence.

---

## Wikilink targets

Wikilinks must resolve to existing files in the vault. The target is the filename without extension:

- `[[Anna Karenina]]` → `src/works/fiction/novels/anna-karenina/Anna Karenina.md`
- `[[Sophia Tolstaya]]` → `src/wiki/Sophia Tolstaya.md`
- `[[Yasnaya Polyana]]` → `src/wiki/Yasnaya Polyana.md`

If a wikilink target doesn't exist yet, either create a stub page or use plain text (no brackets) and note the missing page in the index as a gap to fill.
