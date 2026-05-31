---
title: "Cross-dive evidence index"
description: "A generated index that aggregates every corpus-dive dossier by entity, so writing a wiki page reuses verified citations instead of re-collating them across dives."
date: 2026-05-30
tags: [architecture]
draft: false
---

Report: 2026-05-30
Context: Each corpus-dive already welds its findings to primary sources — a TEI id, a PSS volume and page range, a byte-faithful Russian quote, an extract file. But that connection lives inside a single dive. The same people recur across dives, and there was no view that spanned them. This note describes the index that closes that gap.

---

## The problem

A corpus-dive produces a `dossier.yaml`: an evidence ledger (verified quotes, with their TEI ids and PSS pages) and an entity list (the people, works, places, and concepts those findings concern, each marked as already in the vault, a stub, or missing). It is the bridge from research to wiki page.

The bridge only spans one dive. Across the five dives so far, the same entities recur — Vladimir Chertkov appears in all five, Pavel Biryukov in three. When the time comes to write Chertkov's wiki page, the research is done, but it is scattered across five files. Collating it by hand is the step where "redoing the research" creeps back in — not re-reading Tolstoy, but re-finding the quotes already verified. With every new dive the collation gets longer.

## What was rejected

The first idea was to scaffold the wiki the other way: generate a stub page for every entity in the tolstoydigital TEI reference data (3,113 persons, 770 places) and fill in prose later. That runs against the method this wiki is built on — a page grows by reading a source and citing it, not by a mechanical bulk transform of structured data. The 3,113 persons are a universe of possible pages, not an import queue. Empty stubs are also low-signal for semantic search, so they would not help the retrieval layer either.

## What it does

`build_evidence_index.py` walks every `docs/research/*/dossier.yaml` and groups entities by a stable key — the slug of the entity's title, which is also its eventual wiki URL. For each entity it:

- resolves the dive's evidence references to full rows, tagged with the dive they came from;
- collates and de-duplicates visuals (the same portrait cached in several dives merges to one entry);
- re-derives vault status live against `website/src/` rather than trusting the dossier's stored value.

It writes a machine-readable `evidence-index.yaml` and a human-readable `index.md`, and creates no wiki pages — it is pure aggregation of already-verified research.

The current run covers 5 dives, 41 distinct entities, 41 evidence rows, and 46 visuals. The output is deterministic: rebuilding on an unchanged tree produces byte-identical files.

## What it surfaces

Two sections do the work. An **ingestion work-order** ranks the entities that have verified evidence but no written page yet — the things ready to write, citations attached. An **integrity report** flags the inconsistencies worth resolving before ingestion: a name spelled two ways across dives (Birukoff / Biryukov), a person typed inconsistently (Maude as person in one dive, translator in another), and entities named but not yet evidenced.

The index lives at [`docs/research/evidence-index/`](https://github.com/tolstoylife/tolstoy.life/blob/main/docs/research/evidence-index/index.md). Regenerate it with `python3 docs/research/lib/build_evidence_index.py`, then `python3 docs/serve.py --build-only` to render the HTML.
