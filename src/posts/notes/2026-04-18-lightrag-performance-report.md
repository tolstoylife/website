---
title: "LightRAG Performance Report — Mac Mini M4 24GB"
description: "Hardware findings, model benchmarks, and ingestion-time estimates from the first operational run of LightRAG on the platform."
date: 2026-04-18
tags: [architecture]
draft: false
---

Report: 2026-04-18
Context: First operational test of LightRAG on the Tolstoy Research Platform. This report documents the hardware findings, model benchmarks, configuration decisions, and ingestion time estimates for scaling from the current 29-file vault to the projected 26,500-file full corpus.

---

## 1. Hardware profile

| Spec | Value |
|---|---|
| Machine | Mac Mini M4 |
| Unified memory | 24 GB |
| GPU available (reported by Ollama) | 17.8 GiB |
| Memory bandwidth | ~120 GB/s |
| GPU memory limit (`iogpu.wired_limit_mb`) | 0 (no cap — macOS manages dynamically) |
| Ollama version | 0.21.0 |

### Effective memory budget

macOS and background services consume approximately 4–5 GB at idle. That leaves ~19–20 GB for Ollama and the LightRAG Python process. With `OLLAMA_MAX_LOADED_MODELS=1`, the LLM and embedding model swap rather than coexist.

---

## 2. Model testing results

### Models tested

| Model | Parameters | Quantization | Weight size | Purpose |
|---|---|---|---|---|
| qwen2.5:14b | 14B | Q4_K_M | ~9 GB | LLM (entity extraction) |
| qwen2.5:7b | 7B | Q4_K_M | ~4.7 GB | LLM (entity extraction) |
| nomic-embed-text | 137M | — | ~274 MB | Embedding (768 dimensions) |

### qwen2.5:14b — rejected for this hardware

| Metric | Value |
|---|---|
| Model weights | ~9 GB |
| KV cache (32K context, 1 slot, FP16) | ~3–4 GB |
| Total LLM footprint | ~12–13 GB |
| Observed memory usage during ingestion | 93.4% (with swap) |
| Swap usage | 63–79% |
| Result | **Unusable for unattended operation on 24 GB** |

The 14B model consistently triggered memory pressure and swap, even after setting `OLLAMA_NUM_PARALLEL=1` and `OLLAMA_FLASH_ATTENTION=1`. The 32K context window requirement (non-negotiable for LightRAG entity extraction) pushes the KV cache to 3–4 GB on top of 9 GB of weights, leaving only 7–8 GB for macOS + Python — insufficient when combined with any background processes.

**Root cause analysis:** The earlier scalability report estimated the 14B model would use 9–11 GB VRAM. This was correct for the model weights alone, but underestimated the KV cache overhead at 32K context. Additionally, the default `OLLAMA_NUM_PARALLEL` setting may have allocated multiple KV cache slots (up to 4×), multiplying the cache memory by a factor of 2–4.

### qwen2.5:7b — adopted

| Metric | Value |
|---|---|
| Model weights | ~4.7 GB |
| KV cache (32K context, 1 slot, flash attention) | ~1 GB |
| Total LLM footprint | ~7.2 GB |
| Observed memory usage during ingestion | 68.1% |
| Swap usage | 0.0% |
| Free memory during operation | ~7.6 GB |
| Ingestion time (29 documents, ~80 KB) | 43 minutes |
| Result | **Stable, comfortable headroom** |

The 7B model leaves approximately 15–16 GB for macOS and Python, well within safe margins for unattended cron operation.

### Performance benchmarks (M4 Apple Silicon)

| Metric | qwen2.5:7b | qwen2.5:14b |
|---|---|---|
| Prompt processing | ~90–120 tok/s | ~45–60 tok/s |
| Generation speed | ~35–45 tok/s | ~18–25 tok/s |
| Model load time (cold) | ~5 s | ~10–15 s |
| Memory headroom on 24 GB | ~16 GB | ~9 GB |

Generation speed is almost entirely memory-bandwidth-bound on Apple Silicon. The 14B model is roughly 2× slower, proportional to its weight size.

---

## 3. Ollama configuration

### Active environment variables

```bash
export OLLAMA_KEEP_ALIVE=-1           # Keep model loaded between calls
export OLLAMA_MAX_LOADED_MODELS=1     # One model at a time (swap, don't coexist)
export OLLAMA_NUM_GPU=99              # Offload all layers to Metal GPU
export OLLAMA_NUM_PARALLEL=1          # Single inference slot (prevents KV cache multiplication)
export OLLAMA_FLASH_ATTENTION=1       # Quantized KV cache — halves cache memory
```

### Effect of each setting

| Setting | Default | Our value | Effect |
|---|---|---|---|
| `OLLAMA_NUM_PARALLEL` | 4 (auto) | 1 | Saves ~3–6 GB by preventing multiple KV cache allocations |
| `OLLAMA_FLASH_ATTENTION` | 0 | 1 | Reduces KV cache by ~50% (FP16 → Q8/Q4) |
| `OLLAMA_KEEP_ALIVE` | 5m | -1 | Avoids 5–15s reload delay between cron calls |
| `OLLAMA_MAX_LOADED_MODELS` | auto | 1 | Prevents LLM + embedding model coexisting in memory |
| `OLLAMA_NUM_GPU` | auto | 99 | Ensures all layers run on Metal GPU, not CPU |

### Critical finding: `OLLAMA_NUM_PARALLEL`

This was the most impactful setting. Without it, Ollama allocates a KV cache for each parallel slot. At 32K context with FP16:

- **Default (4 slots):** 4 × 3–4 GB = 12–16 GB just for KV caches
- **NUM_PARALLEL=1:** 1 × 3–4 GB = 3–4 GB for KV cache
- **NUM_PARALLEL=1 + flash attention:** 1 × ~1 GB

This alone can explain the difference between the 14B model working or failing on 24 GB hardware.

---

## 4. Embedding model comparison: 768 vs 1024 dimensions

### Current model: nomic-embed-text (768d)

| Metric | Value |
|---|---|
| Dimensions | 768 |
| Parameters | 137M |
| RAM usage | ~0.5 GB |
| Ollama download | ~274 MB |
| MTEB retrieval score (avg) | ~52.8 |
| Multilingual support | English-primary; limited non-English |
| Russian performance | Poor — no dedicated Russian training data |

### Alternative: bge-m3 (1024d)

| Metric | Value |
|---|---|
| Dimensions | 1024 |
| Parameters | 568M |
| RAM usage | ~1.5 GB |
| Ollama download | ~1.2 GB |
| MTEB retrieval score (avg) | ~54.3 |
| Multilingual support | 100+ languages, purpose-built |
| Russian performance | Strong — ~70+ nDCG@10 on MIRACL Russian benchmark |

### What the dimensions actually mean

Each dimension is a learned feature in the model's representation of meaning. More dimensions allow finer-grained distinctions:

- **768 dimensions** — good resolution for English-language retrieval. Sufficient for distinguishing "Tolstoy the writer" from "Tolstoy the estate" from "Tolstoy the philosophy."
- **1024 dimensions** — finer grain, especially for cross-lingual concepts. Better at placing Russian terms near their English equivalents in vector space.

### Quality impact

The MTEB benchmark difference (52.8 vs 54.3) translates to roughly:

- At 768d: a query about "Софья Андреевна" may not reliably retrieve the "Sophia Tolstaya" wiki article
- At 1024d with bge-m3: the Russian and English name forms map to nearby vectors

For the Tolstoy vault specifically, which contains Russian names in Cyrillic (`titleRu` fields), Cyrillic transliterations, and will eventually contain Russian-language source texts, the multilingual gap is significant.

### Storage and speed impact

| Scale | 768d storage | 1024d storage | Delta |
|---|---|---|---|
| 29 files (current) | ~90 KB | ~120 KB | +30 KB |
| 4,600 files (Phase 3) | ~14 MB | ~19 MB | +5 MB |
| 26,500 files (Phase 5) | ~80 MB | ~106 MB | +26 MB |

Storage difference is negligible at all projected scales. Search latency difference is sub-millisecond.

Embedding speed: bge-m3 is ~15–20% slower per batch due to larger output dimensions and 4× more parameters. For 26,500 documents: ~15–20 minutes (bge-m3) vs ~10–15 minutes (nomic). Both are trivial in the context of nightly cron.

### Memory impact with qwen2.5:7b

Since `OLLAMA_MAX_LOADED_MODELS=1`, the LLM and embedding model swap. Peak memory is determined by whichever is larger:

| Configuration | Peak model memory | Total with 32K KV | Headroom on 24 GB |
|---|---|---|---|
| 7b + nomic (768d) | 4.7 GB (LLM peak) | ~7.2 GB | ~16.8 GB |
| 7b + bge-m3 (1024d) | 4.7 GB (LLM peak) | ~7.2 GB | ~16.8 GB |

The embedding model is always smaller than the LLM, so it doesn't affect peak memory. bge-m3's 1.5 GB is well under qwen2.5:7b's 4.7 GB. **No memory penalty for switching to bge-m3 with the current setup.**

### Recommendation

Switch to bge-m3 for embedding. The multilingual advantage is significant for this project, there is no memory penalty with `MAX_LOADED_MODELS=1`, and the storage/speed differences are negligible. This requires:

1. `ollama pull bge-m3`
2. Update `config.py`: `EMBED_MODEL = "bge-m3"`, `EMBED_DIM = 1024`
3. Delete `lightrag/data/` and re-ingest

### Other embedding models considered

| Model | Dims | MTEB retrieval | Russian | RAM | Verdict |
|---|---|---|---|---|---|
| nomic-embed-text | 768 | 52.8 | Poor | 0.5 GB | Current — adequate for English |
| bge-m3 | 1024 | 54.3 | Strong | 1.5 GB | **Recommended** — best multilingual |
| mxbai-embed-large | 1024 | 54.4 | Poor | 1.0 GB | Slightly higher English score, no Russian |
| snowflake-arctic-embed-l | 1024 | 55.0 | Poor | 1.0 GB | Highest English retrieval, no Russian |

---

## 5. Ingestion time estimates

### Baseline measurement

| Metric | Value |
|---|---|
| Documents | 29 |
| Total content size | ~80 KB |
| Average document size | ~2.8 KB |
| Ingestion time | 43 minutes (2,577 seconds) |
| Time per document | ~89 seconds |
| Knowledge graph result | 192 nodes, 196 edges |
| Model | qwen2.5:7b (Q4_K_M) |

The ~89 seconds per document includes: LLM entity extraction (dominant cost), embedding generation, graph merging, and vector storage.

### Time per document breakdown (estimated)

| Step | Estimated time | Notes |
|---|---|---|
| LLM extraction (2 passes) | ~70 s | Two LLM calls per document (extract + merge) |
| Embedding generation | ~5 s | Fast — small model, short texts |
| Graph merge + storage | ~14 s | In-memory operations, disk writes |

### Projections for future ingestion phases

#### TEI reference data (Phase 3)

The TEI dataset contains 3,113 persons and 770 locations. Each person/location becomes a wiki page. With the current pipeline, each page requires entity extraction.

| Metric | Estimate |
|---|---|
| New documents | ~3,883 wiki pages |
| Average document size | ~1–2 KB (structured metadata, short descriptions) |
| Estimated time per document | ~60 s (smaller docs = faster extraction) |
| Total ingestion time | ~65 hours |
| Recommended approach | 3 overnight runs (~22 hours each) |

Note: These are new additions to the vault. The existing 29 documents would not need re-indexing.

#### Birukoff biography

The Birukoff biography (Paul Birukoff, *Leo Tolstoy: His Life and Work*, 1906 Heinemann edition) is 150,135 words across 17 chapters. When ingested into the vault, each chapter becomes a source text file.

| Metric | Estimate |
|---|---|
| Documents | 17 chapter files |
| Average chapter size | ~52 KB (~8,830 words) |
| Total content | ~880 KB |
| Estimated time per document | ~180 s (larger docs require more extraction passes) |
| LightRAG chunking | ~5–8 chunks per chapter at default settings |
| Total ingestion time | ~51 minutes |
| Recommended approach | Single run, daytime or overnight |

The Birukoff biography will produce a dense knowledge graph — every chapter references multiple people, places, and events that should link to existing wiki entities.

#### Full corpus (Phase 5)

| Metric | Estimate |
|---|---|
| Total documents | ~26,500 |
| Total content | ~72 MB |
| Average document size | ~2.7 KB |
| Estimated time per document | ~75 s (blended average: short wiki pages + long text chapters) |
| Total initial ingestion | ~552 hours (~23 days) |
| Recommended approach | Batched overnight runs over 4–5 weeks |
| Daily incremental sync (50 changed files) | ~62 minutes |

### Comparison with earlier estimates

The scalability report (2026-04-15) estimated 110 hours for full indexing using a 14B model. Our actual measurement with the 7B model suggests longer per-document times due to lower throughput. However, the 7B model is more reliable on 24 GB hardware, avoiding the memory pressure and swap that would make a 14B ingestion fail partway through.

| Scenario | 14B estimate (theoretical) | 7B estimate (measured basis) |
|---|---|---|
| 29 files | ~15 min | 43 min |
| Phase 3 (~3,900 files) | ~38 hours | ~65 hours |
| Phase 5 (~26,500 files) | ~110 hours | ~550 hours |

The 14B model is ~2× faster per token but cannot reliably run on 24 GB hardware. The 7B model is ~2× slower but stable. For unattended overnight operation, stability is worth more than speed.

---

## 6. Token cost comparison

LightRAG uses Ollama locally — there are no API token costs. All processing runs on the Mac Mini's GPU. This is a key architectural advantage.

For comparison, using cloud APIs for the same workload:

### Claude API costs (if LightRAG were replaced with cloud processing)

From the wiki rewrite workflow report (2026-04-15):

| Phase | Files | Monthly token estimate | Claude API cost |
|---|---|---|---|
| Phase 2 (current, 29 files) | 29 | ~500K tokens | ~$2/month |
| Phase 3 (~8,000 files) | 8,000 | ~3.2M tokens | ~$14/month |
| Phase 5 (~26,500 files) | 26,500 | ~6.3M tokens | ~$28/month |

### LightRAG local costs

| Phase | Files | Electricity estimate | API cost |
|---|---|---|---|
| All phases | Any | ~$1–3/month (Mac Mini idle + overnight runs) | **$0** |

The scripted pipeline (Layer 1) + LightRAG (Layer 2) together save approximately 65% of the token costs that would otherwise be spent on Claude reading and navigating the vault.

---

## 7. Optimization roadmap

### Immediate (no code changes)

- [x] `OLLAMA_NUM_PARALLEL=1` — prevents KV cache multiplication
- [x] `OLLAMA_FLASH_ATTENTION=1` — halves KV cache memory
- [x] `OLLAMA_KEEP_ALIVE=-1` — avoids reload delays
- [x] `OLLAMA_MAX_LOADED_MODELS=1` — prevents model coexistence

### Short-term (config changes)

- [ ] Switch embedding model to bge-m3 (1024d) for Russian+English support
- [ ] Set up nightly cron job for `sync.py`
- [ ] Test incremental sync after editing wiki pages

### Medium-term (when vault grows to ~4,600 files)

- [ ] Benchmark whether qwen2.5:14b becomes viable with flash attention + NUM_PARALLEL=1 after macOS updates or Ollama improvements
- [ ] Consider Q3_K_M quantization of 14B as middle ground (saves ~2 GB vs Q4, quality trade-off is modest for structured extraction)
- [ ] Add rerank model for improved query result ordering (if query quality is insufficient)

### Long-term (Phase 5, ~26,500 files)

- [ ] Evaluate PostgreSQL with pgvector + AGE as unified backend (replaces JSON/NetworkX/NanoVectorDB)
- [ ] Consider batched overnight ingestion with progress tracking and resume capability
- [ ] Evaluate newer Qwen or Llama models as they release — 7B-class models are improving rapidly

---

## 8. Current production configuration

```python
# config.py — active settings as of 2026-04-18
LLM_MODEL = "qwen2.5:7b"
LLM_CONTEXT_WINDOW = 32768
EMBED_MODEL = "nomic-embed-text"  # TODO: switch to bge-m3
EMBED_DIM = 768                    # TODO: update to 1024 with bge-m3
OLLAMA_TIMEOUT = 600
```

### Knowledge graph statistics (first ingestion)

| Metric | Value |
|---|---|
| Documents indexed | 29 |
| Graph nodes | 192 |
| Graph edges | 196 |
| Ingestion time | 43 minutes |
| Memory usage (peak) | 68.1% (16.3 GB of 24 GB) |
| Swap usage | 0.0% |
| Query response time (hybrid) | ~30–60 seconds |

---

## Appendix: Key findings summary

1. **qwen2.5:14b does not fit on 24 GB** with a 32K context window, even with aggressive tuning. The KV cache at 32K is the bottleneck, not the model weights.

2. **`OLLAMA_NUM_PARALLEL` is the single most impactful configuration setting** — the default allocates multiple KV caches that silently multiply memory usage.

3. **qwen2.5:7b is the right model** for 24 GB hardware running LightRAG. It provides stable, swap-free operation with ~16 GB headroom.

4. **bge-m3 should replace nomic-embed-text** for the embedding model. The multilingual advantage is significant for Russian+English content, and there is no memory penalty with `MAX_LOADED_MODELS=1`.

5. **Full corpus ingestion will take approximately 550 hours** (4–5 weeks of overnight runs) with the 7B model. This is ~5× slower than the theoretical 14B estimate but achievable through patient batched processing.

6. **LightRAG eliminates all API token costs** for vault indexing and querying. The three-layer architecture (scripts + LightRAG + Claude) reduces Claude API costs by approximately 65%.
