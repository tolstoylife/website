---
title: "Tolstoy on copyright — sourcing the splash-page quote"
description: "Recap of a corpus sweep across the 90-volume Jubilee Edition for the splash-page quote on Tolstoy's renunciation of literary property. Six staged moments from 1883 to 1910; the 1895 will-as-diary-entry; the manuscript page that does not yet appear on the open web."
date: 2026-05-10
tags: [design]
draft: false
---

*Session of 2026-05-10. Output: [`docs/research/copyright-renunciation/`](https://github.com/tolstoylife/tolstoy.life/blob/main/docs/research/copyright-renunciation/index.md).*

---

## The brief

Section 7 of the splash-site plan calls for a direct quote from Leo Tolstoy on copyright renunciation or the free flow of knowledge, sourced from the Jubilee Edition (PSS, 90 volumes, Moscow 1928–1958). The placeholder in the plan was the well-known 1891 newspaper notice — *"I give permission to all who wish it to reprint, without any payment, any of my works written after 1880…"* — with a request for a stronger candidate if one existed in the corpus.

The brief implied something that turned out to be true: this is not a one-off declaration. Tolstoy's renunciation of literary property is an evolving position that runs from the early 1880s to his death in 1910.

## Method

The primary search surface was the `tolstoydigital-TEI` corpus held under `primary-sources/`: 9,087 letter files, 4,584 diary entries, 767 published-works files, plus notes and the *Krug chteniya* anthology. This is the structured digital edition of the printed PSS produced by the *Слово Толстого* project at HSE Moscow, CC BY-SA.

The keyword sweep was layered, from high-confidence anchors to broader terms used in combination:

- High-confidence: `авторск[ое]` (author's [right]), `литературн[ая собственность]` (literary property), `безвозмездн[о]` (gratis), `перепечат[ывать]` (to reprint), `гонорар` (honorarium), `вознагражд[ение]` (remuneration), `после 1881`, `1881 г`, `Чертков`.
- Broader, used in combination: `собственност[ь]` (property).

Filename convention encodes the citation: `vXX_NNN_..._YYYY_MM_DD.xml` for diaries, `vXX_NNN_<addressee>.xml` for letters. Every hit comes pre-citationed with its PSS Tom number and, for diaries, the exact date.

The TEI body markup is heavily editorial — `<choice>/<sic>/<corr>` wrappers for orthographic corrections, `<note>` footnote bodies inline. A small lxml-based extractor was written to resolve these to readable Russian prose suitable for grep with context. It lives next to the research essay at [`docs/research/copyright-renunciation/extract_tei.py`](https://github.com/tolstoylife/tolstoy.life/blob/main/docs/research/lib/extract_tei.py). The extracted text matches the printed PSS modulo the orthographic conventions of 1953 typesetting.

## What the corpus contains

The sweep returned approximately 60 letters and 25 diary entries directly on copyright or literary property, plus pages in published works (most prominently *The Kingdom of God Is Within You*) and notebooks. Six staged moments form the spine of the position:

| Year | Material | PSS citation |
| --- | --- | --- |
| 1883 | Philosophical groundwork: property is not in itself evil; *property defended by violence* is. | Tom 49, p. 59 |
| 1891 (Jul) | Household conflict in the diary; nineteen lines of the 22 July entry erased by Sofya Andreyevna. | Tom 52, pp. 45–47 |
| 1891 (Sep) | Public declaration to the editors of *Russkie vedomosti* and *Novoye vremya*, renouncing copyright on all writings from 1881 onward. | Tom 66, letter 36, pp. 47–48 |
| 1895 | Will-as-diary-entry: first-person account of what the renunciation meant to Tolstoy himself. | Tom 53, pp. 14–18 |
| 1909–1910 | Six successive formal wills drafted to find a legally binding form for the renunciation. | Toms 80, 82 |
| 1910 (Jul) | Explanatory Note to the Will. Most legally precise statement; the document that finally made the renunciation binding. | Tom 82, pp. 227–231 |

The full citation map of letters, diaries, polemical works, and notebooks is in [§3 of the research essay](https://github.com/tolstoylife/tolstoy.life/blob/main/docs/research/copyright-renunciation/index.md#3-where-the-theme-clusters-in-the-jubilee-edition).

## Three details from the sweep

The 22 July 1891 diary entry — Tolstoy's most detailed record of the household conflict over the renunciation — was physically erased from the manuscript by Sofya Andreyevna. The TEI text preserves the editorial annotation `[Вымарано 19 строк]` (nineteen lines erased). The fact of the erasure is preserved in the modern edition; the redacted text is not.

The English paraphrase of the 1891 declaration that circulates in secondary literature reads *"any of my works written after 1880"*. The Russian reads `с 1881 года` — *from 1881 onward, inclusive of 1881*. The earliest works covered by the renunciation include *A Confession* (1882). The current placeholder in the splash plan repeats the inaccurate paraphrase.

The longest first-person passage on the subject — and the one written in plain language rather than legal or polemical register — is not any of the public documents. It is point 4 of the 27 March 1895 diary entry, written as a private will to Tolstoy's heirs. The closing line:

> То, что сочинения мои продавались эти последние 10 лет, было самым тяжелым для меня делом в жизни.
>
> *That my writings have been sold during these last ten years was the heaviest thing in my life.*

## Cross-check against the printed Jubilee Edition

The finalist passage was verified against the printed Jubilee Edition. The relevant volume is PSS Tom 53; the local copy is at `primary-sources/jubilee-edition/vol19/vol19.pdf`. The local PDFs are named in chronological publication-order (1928–1958), not by Tom number — the lookup table is at [`docs/research/pss-volume-mapping.md`](https://github.com/tolstoylife/tolstoy.life/blob/main/docs/research/pss-volume-mapping.md).

Pages 14–18 of Tom 53 were extracted at 220 dpi (`pdftoppm`) to `docs/research/copyright-renunciation/extracts/pss-vol53-pages/page-052.png` through `page-056.png`. The will section is on printed p. 16 = PDF page 54. The Russian text in the printed PSS matches the TEI extract; the operative line *То, что сочинения мои продавались…* is visible on `page-054.png`.

## The manuscript page

Whether a high-resolution facsimile of the 27 March 1895 diary page is available on the open web was investigated.

The original manuscripts of the diary entries and letters in this survey are held by the State Tolstoy Museum (Государственный музей-заповедник Л.Н. Толстого) in Moscow. The L. N. Tolstoy fond comprises 71,492 documents — the world's largest collection of Tolstoy manuscript material — stored in the museum's "стальная комната" (steel room).

Two adjacent digitisation projects exist:

- *Весь Толстой в один клик* (All Tolstoy in One Click), 2014. ABBYY OCR plus crowdsourced proofreading, run by the Tolstoy Museum and Yasnaya Polyana with Mellon Foundation and British Council support. Input: scans of the printed 90 volumes. Output: the digitised printed text at [tolstoy.ru](https://tolstoy.ru/) and the per-volume PDFs in this project's `primary-sources/jubilee-edition/`. The handwritten manuscripts were not part of the project's scope.
- The State Tolstoy Museum's online collection at [tolstoy-iss.kamiscloud.ru](https://tolstoy-iss.kamiscloud.ru/), a curated exhibition browser. It is not a full archive and does not appear to expose individual diary pages by date.

The state museum-fund catalogue [Госкаталог](https://web.goskatalog.ru/gk/) catalogues museum holdings administratively but typically does not expose high-resolution image files of working manuscripts.

The State Tolstoy Museum's website footer at the time of the sweep reads: *Использование любых находящихся на сайте материалов без официального разрешения запрещено. © 2026 Государственный музей-заповедник Л.Н. Толстого. Все права защищены* — *The use of any materials found on the site without official permission is prohibited. © 2026 State L.N. Tolstoy Museum-Reserve. All rights reserved.*

A digital photograph of the 1895 diary page at the resolution and licence required for a public-facing reference site would need to be requested from the museum's manuscripts department directly. For the splash-page launch the printed-page image from the 1953 edition (`page-054.png`) is what is held.

## Material not covered

The sweep did not cover:

- Tolstoy's late anthology projects *Krug chteniya* and *Put' zhizni*. The keyword sweep returned a few hits; full coverage was out of scope for the session.
- The commentary apparatus (`texts/comments/`, 807 TEI files).
- Incoming letters to Tolstoy — particularly from Chertkov and Sofya Andreyevna. The TEI corpus appears to hold only Tolstoy's outgoing correspondence.
- The Goldenweiser and Makovický conversation transcripts (`primary-sources/tolstoydigital-TEI/texts_txt/Goldenweiser/` and `texts_txt/Makovitski/`). These verbatim daily logs from the late years almost certainly contain spoken statements on copyright.

## What this feeds into

The output of the session is the reference document at [`docs/research/copyright-renunciation/`](https://github.com/tolstoylife/tolstoy.life/blob/main/docs/research/copyright-renunciation/index.md), which the splash-page editorial work draws from for Section 7, and which any future research into Tolstoy's position on intellectual property can pick up from.

The 1910 Explanatory Note to the Will provides the legal articulation of what tolstoy.life itself is, in plain terms — a public-domain successor to the renunciation. That line is now quoted in the project MANIFEST.
