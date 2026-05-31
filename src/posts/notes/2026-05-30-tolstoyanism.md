---
title: "Tolstoy on \"Tolstoyism\": a corpus sweep"
description: "Where Tolstoy himself uses the words «толстовство» and «толстовцы» across the Jubilee Edition — and how, of 44 files carrying the term, only four are in his own voice, all of them disowning the label."
date: 2026-05-30
tags: [research, tolstoyanism]
draft: false
---

By the 1890s Tolstoy was a label. *Tolstoyism* («толстовство») named a movement; *Tolstoyan* («толстовец») named a follower. Both words were in wide circulation while he was alive. This dive asks a narrow, checkable question of the corpus: when the words appear, whose voice are they in?

A keyword sweep for the Tolstoyism family across the tolstoydigital TEI letters, diaries and works returns **44 files**. Running each through the TEI extractor — which strips the editors' footnotes and leaves only the document's body — the term survives in **only four**. In the other ~40 it is the editors' word or a third party's, not Tolstoy's: bibliographies, commentary, letters *about* him. As a label, "Tolstoyism" is overwhelmingly something said **about** Tolstoy; in his own voice it is rare, and almost always a refusal.

The four passages span fifteen years and are strikingly consistent:

- **1894, to the journalist V. N. Mac-Gahan** — she had written about "the Tolstoyans" and "the movement raised by my preaching"; he answers that he knows of no such followers or movement, "or rather I know that there is no such thing."
- **1897, the diary, on the disciple Dušan Makovický** — the keystone: to speak of Tolstoyism and seek his guidance "is a great and crude error… there was and is no Tolstoyism and no teaching of mine," only the one teaching of the Gospel.
- **1907, to M. A. Stakhovich** — he would advise giving up meat, "were I not afraid of the ridicule of Tolstoyism": the label with no doctrine behind it but a real social weight.
- **1909, to I. Ivanov** — faulting a correspondent for granting that "some sort of Tolstoyans" exist at all, capped by the dry pun «хотя я и сам Толстой» ("though I myself am a Tolstoy").

The diary entry is the keystone — the one unprompted, self-addressed formulation, set down the evening of the conversation. The three letters are answers to other people's use of the word. Two of the four (Mac-Gahan 1894, Ivanov 1909) are new to this dive, which splits an earlier combined survey into separate passes; the *Christian anarchism* material is held back for the next one.

Where the corpus meets the scholarship (Alston's *Tolstoy and His Disciples*, 2013; Maude; Bartlett): it **confirms** the well-known disavowal, **extends** it with an earlier and blunter movement-denial and with the actual count behind "the label was external," and **complicates** the tidy version once — in 1907 the label's *ridicule* is strong enough to deflect his own counsel.

Every Russian quotation is byte-checked against the extract files by a mechanical gate (`verify_quotes.py`) before any of it is written up — a discipline that earned its keep here: an earlier sitting of this dive was paused when the tool channel began producing plausible-but-fabricated Russian, and the gate is exactly what catches that.

The full survey, with verbatim Russian, working English translations, a machine-readable dossier, and the keystone page facsimile, is in [`docs/research/tolstoyanism/`](https://github.com/tolstoylife/tolstoy.life/blob/main/docs/research/tolstoyanism/index.md) (`index.md` and `dossier.yaml`).
