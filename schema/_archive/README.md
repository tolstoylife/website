# Schema archive

This folder holds superseded schema files. They are kept as historical reference only — they are **not** authoritative and **not** consumed by any tooling.

## Contents

### `tolstoy-person-schema.md` (v1, 2026-04-03)

Type-specific person schema. Superseded on 2026-04-16 by `wiki-schema.md` v1.1, which added a person template covering the same ground. Salvaged on 2026-04-27 into `wiki-schema.md` v1.2: the richer optional fields (`nameAlternatives`, `causeOfDeath`, `relationshipDescription`, `periodOfContact`, `authorityTier`, `occupation`, `religion`, `politicalViews`, `synopsis`, `worksAuthored/Translated/Edited/Transcribed`, `viaf`, `lccn`, `bnf`) are now part of the v1.2 person template.

Note: this file uses the old `nameEn`/`nameRu` and `dateBorn`/`dateDied` field names. The corpus uses `titleEn`/`titleRu` and `birthDate`/`deathDate` — those are canonical, not the v1 names.

### `tolstoy-place-schema.md` (v1, 2026-04-03)

Type-specific place schema. Superseded on 2026-04-16 by `wiki-schema.md` v1.1. Salvaged on 2026-04-27 into v1.2: `nameAlternatives`, `placeType`, `city`, `coordinates.approximate`, `roleInTolstoyLife`, `periodOfAssociation`, `synopsis`, `worksWrittenHere`, `geonames`, `openStreetMap`. Same naming caveats as the person schema (also: `coordinates.lng` here, but the canonical name is `coordinates.lon` per the v6 commit).

## Authoritative schema today

- **Wiki articles** (person, place, event, concept, translator, institution, adaptation, criticalWork, archivalFond): `../wiki-schema.md` (v1.2).
- **Works metadata**: `../tolstoy-works-schema.md` (v6).
