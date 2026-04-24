#!/usr/bin/env node
/**
 * check-determinism.mjs — verifies the build is byte-deterministic.
 *
 * Runs `npm run build` twice from the same source tree and diffs the
 * SHA-256 of every output file. Exits 0 if identical, 1 if any file
 * differs, 2 on harness error.
 *
 * Why this exists: the PWA's work-version scheme (see
 * _generated/PWA/tl-pipeline-integration.md §3.2 and §4.6) derives a
 * work's identity from the SHA-256 of its rendered output. If the same
 * source produces different bytes on successive builds, every work
 * appears to re-version on every build, the 3-version retention cap
 * collapses, and every reader re-downloads every work. This script
 * catches the regression the moment it appears.
 *
 * Scope: currently tests the Eleventy output in `dist/`. When the
 * Layer-1 generators (generate-wiki-previews.py, generate-asset-
 * manifests.py, generate-works-index.py, generate-related-wiki.py)
 * land, their outputs are also emitted into `dist/` and will be
 * covered automatically.
 *
 * Limitation: this script runs both builds in the *same* environment,
 * so it catches within-environment non-determinism (timestamps,
 * filesystem walk order, random IDs, etc.). Cross-environment
 * determinism — e.g. Netlify vs. Cloudflare Pages producing identical
 * bytes — requires a separate cross-host test. See architecture-
 * review.html Part 8.
 */

import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { readdir, rename, rm } from 'node:fs/promises'
import { join, relative } from 'node:path'
import process from 'node:process'

const REPO = process.cwd()
const DIST = join(REPO, 'dist')
const DIST_A = join(REPO, '.determinism-a')
const DIST_B = join(REPO, '.determinism-b')

const MAX_REPORTED_DIFFS = 50

async function hashFile(path) {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(path)) hash.update(chunk)
  return hash.digest('hex')
}

async function* walk(root) {
  const entries = await readdir(root, { withFileTypes: true })
  entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))
  for (const entry of entries) {
    const full = join(root, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (entry.isFile()) yield full
  }
}

async function hashTree(root) {
  const hashes = new Map()
  for await (const path of walk(root)) {
    hashes.set(relative(root, path), await hashFile(path))
  }
  return hashes
}

function runBuild(label) {
  console.log(`\n[${label}] npm run build …`)
  execSync('npm run build', { stdio: 'inherit' })
}

async function moveDistTo(target) {
  await rm(target, { recursive: true, force: true })
  await rename(DIST, target)
}

function diffHashes(a, b) {
  const onlyA = []
  const onlyB = []
  const changed = []
  for (const [path, hash] of a) {
    if (!b.has(path)) onlyA.push(path)
    else if (b.get(path) !== hash) changed.push({ path, a: hash, b: b.get(path) })
  }
  for (const path of b.keys()) {
    if (!a.has(path)) onlyB.push(path)
  }
  return { onlyA, onlyB, changed }
}

function reportDiff(diff) {
  if (diff.changed.length) {
    console.error(`\n${diff.changed.length} file(s) with different contents:`)
    for (const { path, a, b } of diff.changed.slice(0, MAX_REPORTED_DIFFS)) {
      console.error(`  ${path}`)
      console.error(`    A: ${a.slice(0, 16)}…`)
      console.error(`    B: ${b.slice(0, 16)}…`)
    }
    if (diff.changed.length > MAX_REPORTED_DIFFS) {
      console.error(`  …and ${diff.changed.length - MAX_REPORTED_DIFFS} more`)
    }
  }
  if (diff.onlyA.length) {
    console.error(`\n${diff.onlyA.length} file(s) only in build A:`)
    diff.onlyA.slice(0, MAX_REPORTED_DIFFS).forEach((p) => console.error(`  ${p}`))
  }
  if (diff.onlyB.length) {
    console.error(`\n${diff.onlyB.length} file(s) only in build B:`)
    diff.onlyB.slice(0, MAX_REPORTED_DIFFS).forEach((p) => console.error(`  ${p}`))
  }
  console.error('')
  console.error('Common non-determinism sources: embedded timestamps, filesystem')
  console.error('walk order, JSON key ordering, locale-dependent sort, random')
  console.error('IDs, PID-based names. See _generated/PWA/tl-pipeline-integration.md §6.3.')
}

async function main() {
  runBuild('A')
  await moveDistTo(DIST_A)

  runBuild('B')
  await moveDistTo(DIST_B)

  const [a, b] = await Promise.all([hashTree(DIST_A), hashTree(DIST_B)])
  const diff = diffHashes(a, b)

  const mismatch = diff.onlyA.length || diff.onlyB.length || diff.changed.length
  if (!mismatch) {
    console.log(`\n✓ Deterministic — ${a.size} files, identical across both builds.`)
    return
  }

  console.error('\n✗ Build is NOT deterministic.')
  reportDiff(diff)
  process.exit(1)
}

main().catch((err) => {
  console.error('Harness error:', err)
  process.exit(2)
})
