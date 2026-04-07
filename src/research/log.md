# Wiki Operations Log

## [2026-04-06] ingest | TEI Reference Data — test run (5 entities)

**Source:** [[TEI Reference Data]] (`corpus/data/unprocessed/tolstoydigital-TEI/reference/`)
**Pages created:** [[Sophia Tolstaya]], [[Vladimir Chertkov]], [[Pavel Birukoff]], [[Yasnaya Polyana]], [[Astapovo]]
**Pages updated:** [[Leo Tolstoy]] (frontmatter migrated to new wiki-schema person template; legacy zone marker removed)

**Date conversion note:** All dates in personList.xml are Old Style (Julian). Applied +12 days to pre-1900 dates and +13 days to post-1900 dates for NS (Gregorian) canonical values. OS values recorded in `...OldStyle` companion fields.

**Open questions:**
- Aylmer Maude is not in personList.xml as a standalone entry. Will need to create his wiki page from a different source (Maude biography or Standard Ebooks metadata).
- The TEI person descriptions are in Russian only. English prose for wiki articles is synthesised from the Russian descriptions + general knowledge. These should be verified against primary sources (Jubilee Edition, Birukoff biography) before `recordStatus` is raised from `draft` to `reviewed`.
- locationList.xml description for Yasnaya Polyana uses "1847" for when Tolstoy inherited the estate — cross-check against Birukoff.

**Next:** Continue tiered ingestion of TEI persons. Suggested next batch: LT's children (Tatyana, Ilya, Lev, Maria, Andrei, Mikhail, Alexandra) + key locations (Moscow house on Khamovniki Lane, Optina Pustyn, Shamordino).
