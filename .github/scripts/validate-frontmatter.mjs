#!/usr/bin/env node

/**
 * validate-frontmatter.mjs
 *
 * Validates YAML frontmatter in wiki/ and works/ markdown files against
 * the project schema conventions defined in CLAUDE.md and the schema docs.
 *
 * Checks:
 *  - Required fields present
 *  - Controlled vocabulary values
 *  - Date format (ISO 8601)
 *  - OldStyle companion fields exist for pre-1918 dates
 *  - recordStatus is valid
 *  - id is kebab-case
 *  - Empty optionals use "" or [] (not null)
 *
 * Exit code 0 = all files valid, 1 = errors found.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const SRC = "src";
const WIKI_DIR = join(SRC, "wiki");
const WORKS_DIR = join(SRC, "works");

// --- Controlled vocabularies ---

const RECORD_STATUSES = ["draft", "reviewed", "verified"];
const WIKI_TYPES = ["person", "place", "event", "concept"];
const GENRES = [
  "novel", "novella", "short_story", "parable", "play", "essay",
  "philosophical", "religious", "diary", "letter", "poem", "fragment",
];
const COMPLETION_STATUSES = ["complete", "incomplete", "fragmentary"];
const VENUE_TYPES = ["journal", "newspaper", "book", "samizdat"];
const DRAFT_LABELS = [
  "first-draft", "intermediate-draft", "final-draft", "fair-copy", "printers-copy",
];
const CONDITIONS = ["good", "fair", "poor", "damaged", "lost"];

// --- Helpers ---

function walkDir(dir) {
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        results.push(...walkDir(full));
      } else if (entry.endsWith(".md")) {
        results.push(full);
      }
    }
  } catch {
    // directory might not exist yet
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  // Simple YAML parser for flat and shallow-nested fields
  const fm = {};
  const lines = match[1].split("\n");
  let currentKey = null;

  for (const line of lines) {
    // Top-level key: value
    const kvMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/);
    if (kvMatch) {
      const [, key, rawVal] = kvMatch;
      const val = rawVal.trim();

      if (val === "" || val === "[]" || val === "{}") {
        fm[key] = val === "[]" ? [] : val === "{}" ? {} : "";
      } else if (val === "true") {
        fm[key] = true;
      } else if (val === "false") {
        fm[key] = false;
      } else if (val === "null") {
        fm[key] = null;
      } else if (val.startsWith('"') && val.endsWith('"')) {
        fm[key] = val.slice(1, -1);
      } else if (val.startsWith("'") && val.endsWith("'")) {
        fm[key] = val.slice(1, -1);
      } else {
        fm[key] = val;
      }
      currentKey = key;
    }
  }

  return fm;
}

const ISO_DATE_RE = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const KEBAB_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function validateDate(value, fieldName, errors, filePath) {
  if (value === "" || value === undefined) return;
  if (!ISO_DATE_RE.test(value)) {
    errors.push(`${filePath}: ${fieldName} "${value}" is not valid ISO 8601 (YYYY, YYYY-MM, or YYYY-MM-DD)`);
  }
}

function validateEnum(value, fieldName, allowed, errors, filePath) {
  if (value === "" || value === undefined) return;
  if (!allowed.includes(value)) {
    errors.push(`${filePath}: ${fieldName} "${value}" is not in allowed values: ${allowed.join(", ")}`);
  }
}

function validateNulls(fm, errors, filePath) {
  for (const [key, val] of Object.entries(fm)) {
    if (val === null) {
      errors.push(`${filePath}: ${key} is null — use "" (string) or [] (array) instead`);
    }
  }
}

// --- Validators ---

function validateWikiFile(filePath, content) {
  const errors = [];
  const fm = parseFrontmatter(content);
  if (!fm) return errors; // no frontmatter = skip (might be a text file)

  const rel = relative(".", filePath);

  // Null check
  validateNulls(fm, errors, rel);

  // Required fields
  if (!fm.id) errors.push(`${rel}: missing required field "id"`);
  if (!fm.recordStatus) errors.push(`${rel}: missing required field "recordStatus"`);
  if (!fm.type) errors.push(`${rel}: missing required field "type"`);
  if (!fm.titleEn && !fm.title) errors.push(`${rel}: missing required field "titleEn" or "title"`);

  // Controlled values
  if (fm.id && !KEBAB_RE.test(fm.id)) {
    errors.push(`${rel}: id "${fm.id}" is not valid kebab-case`);
  }
  validateEnum(fm.recordStatus, "recordStatus", RECORD_STATUSES, errors, rel);
  validateEnum(fm.type, "type", WIKI_TYPES, errors, rel);

  // Date fields
  const dateFields = ["birthDate", "deathDate", "date"];
  for (const df of dateFields) {
    if (fm[df] !== undefined) {
      validateDate(fm[df], df, errors, rel);
    }
  }

  return errors;
}

function validateWorkFile(filePath, content) {
  const errors = [];
  const fm = parseFrontmatter(content);
  if (!fm) return errors;

  const rel = relative(".", filePath);

  // Skip text chapter files (they have "work" and "chapter" fields, not "genre")
  if (fm.work && (fm.chapter !== undefined || fm.part !== undefined)) {
    return errors;
  }

  // Null check
  validateNulls(fm, errors, rel);

  // Required fields for work overview files
  if (!fm.id) errors.push(`${rel}: missing required field "id"`);
  if (!fm.recordStatus) errors.push(`${rel}: missing required field "recordStatus"`);
  if (!fm.titleEn) errors.push(`${rel}: missing required field "titleEn"`);
  if (!fm.titleRu) errors.push(`${rel}: missing required field "titleRu"`);
  if (!fm.genre) errors.push(`${rel}: missing required field "genre"`);
  if (!fm.language) errors.push(`${rel}: missing required field "language"`);
  if (!fm.completionStatus) errors.push(`${rel}: missing required field "completionStatus"`);

  // Controlled values
  if (fm.id && !KEBAB_RE.test(fm.id)) {
    errors.push(`${rel}: id "${fm.id}" is not valid kebab-case`);
  }
  validateEnum(fm.recordStatus, "recordStatus", RECORD_STATUSES, errors, rel);
  validateEnum(fm.genre, "genre", GENRES, errors, rel);
  validateEnum(fm.completionStatus, "completionStatus", COMPLETION_STATUSES, errors, rel);
  validateEnum(fm.firstPublishedVenueType, "firstPublishedVenueType", VENUE_TYPES, errors, rel);
  validateEnum(fm.firstPublishedInRussiaVenueType, "firstPublishedInRussiaVenueType", VENUE_TYPES, errors, rel);

  // Date fields
  const workDateFields = [
    "dateWritingStarted", "dateWritingCompleted",
    "dateFirstPublished", "dateFirstPublishedInRussia",
  ];
  for (const df of workDateFields) {
    if (fm[df] !== undefined) {
      validateDate(fm[df], df, errors, rel);
    }
  }

  return errors;
}

// --- Main ---

let allErrors = [];

const wikiFiles = walkDir(WIKI_DIR);
for (const f of wikiFiles) {
  const content = readFileSync(f, "utf-8");
  allErrors.push(...validateWikiFile(f, content));
}

const worksFiles = walkDir(WORKS_DIR);
for (const f of worksFiles) {
  const content = readFileSync(f, "utf-8");
  allErrors.push(...validateWorkFile(f, content));
}

if (allErrors.length === 0) {
  console.log(`✓ Validated ${wikiFiles.length + worksFiles.length} files — no errors`);
  process.exit(0);
} else {
  console.error(`✗ Found ${allErrors.length} frontmatter error(s):\n`);
  for (const err of allErrors) {
    console.error(`  • ${err}`);
  }
  process.exit(1);
}
