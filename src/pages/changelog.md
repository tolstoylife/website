---
title: Changelog
description: 'A record of all notable changes to tolstoy.life'
layout: page
permalink: /changelog/index.html
---

All notable changes to the tolstoy.life research platform are documented here.

This project uses date-based versioning (`YYYY-MM-DD`). Entries are grouped by date and categorised as **New content**, **Improvements**, or **Corrections**.

## 2026-04-13

### Improvements

- Consolidated all project instructions into a single root-level `CLAUDE.md`, replacing separate files in `website/` and `tools/`
- Added this changelog to track project evolution publicly

## 2026-04-11

### Improvements

- Replaced Unlicense with Soli Deo Gloria public domain dedication
- Updated wiki and works schemas with clean permalink generation
- Retired the Supabase sync pipeline — all metadata now lives directly in Markdown frontmatter

## 2026-04-09

### Improvements

- Reorganised project folder structure: `tolstoy-life/` renamed to `website/`, cleaner root layout
- Excluded Obsidian workspace files from version control

## 2026-04-07

### New content

- Established the LLM Wiki model: Claude now maintains the Obsidian vault as the single source of truth
- Expanded the works bibliography with full scholarly metadata schemas
- Added wiki and works schema documentation (`wiki-schema.md`, `tolstoy-works-schema.md`)

## 2026-04-02

### Improvements

- Moved works into individual per-slug subfolders (e.g. `works/fiction/novels/anna-karenina/`) to support sidecar data files and source texts

## 2026-04-01

### New content

- Synced initial works and wiki metadata from Supabase — first batch of bibliographic records now in the vault

### Improvements

- Added Supabase-to-Markdown generation pipeline (since retired in favour of direct editing)

## 2026-03-31

### New content

- Wiki and Works sections added to the site — the two core content types for the research platform
- Initialised Obsidian vault at `src/` with wiki as the default note folder
- First seed pages: wiki note and work page for pipeline verification

### Improvements

- Added wiki and work layouts, collections, index pages, and navigation links
- Homepage permalink fix to ensure correct build output

## 2026-03-29

### New content

- Rebranded site from personal blog to tolstoy.life — the Tolstoy research platform
- Added project-specific files (MANIFEST, README, LICENSE)
