# Sibling Fork Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up tolstoy-life as a fresh clone of eleventy-excellent with Tolstoy-specific files migrated in, replacing the current uncommitted directory.

**Architecture:** Clone eleventy-excellent into a new directory, configure remotes (upstream = eleventy-excellent, origin = pjedlund/tolstoy-life), copy Tolstoy files in, verify the build works.

**Tech Stack:** Git, Eleventy, Node.js

---

### Task 1: Back up Tolstoy-specific files

**Files:**
- Read from: `/Users/johanedlund/Projects/tolstoy-life/` (current directory)
- Write to: `/Users/johanedlund/Projects/_tmp/tolstoy-backup/`

- [ ] **Step 1: Create backup directory**

```bash
mkdir -p /Users/johanedlund/Projects/_tmp/tolstoy-backup
```

- [ ] **Step 2: Copy Tolstoy-specific files to backup**

```bash
cp /Users/johanedlund/Projects/tolstoy-life/CLAUDE.md /Users/johanedlund/Projects/_tmp/tolstoy-backup/
cp /Users/johanedlund/Projects/tolstoy-life/tolstoy-works-schema.md /Users/johanedlund/Projects/_tmp/tolstoy-backup/
cp /Users/johanedlund/Projects/tolstoy-life/tolstoy-works-schema.html /Users/johanedlund/Projects/_tmp/tolstoy-backup/
cp /Users/johanedlund/Projects/tolstoy-life/sources.yaml /Users/johanedlund/Projects/_tmp/tolstoy-backup/
cp -R /Users/johanedlund/Projects/tolstoy-life/works /Users/johanedlund/Projects/_tmp/tolstoy-backup/
cp -R /Users/johanedlund/Projects/tolstoy-life/_resources /Users/johanedlund/Projects/_tmp/tolstoy-backup/
cp /Users/johanedlund/Projects/tolstoy-life/session-context-2026-03-28.md /Users/johanedlund/Projects/_tmp/tolstoy-backup/
cp /Users/johanedlund/Projects/tolstoy-life/schmem-questions.md /Users/johanedlund/Projects/_tmp/tolstoy-backup/
cp -R /Users/johanedlund/Projects/tolstoy-life/docs /Users/johanedlund/Projects/_tmp/tolstoy-backup/
cp -R /Users/johanedlund/Projects/tolstoy-life/.claude /Users/johanedlund/Projects/_tmp/tolstoy-backup/
```

- [ ] **Step 3: Verify backup contents**

```bash
ls -la /Users/johanedlund/Projects/_tmp/tolstoy-backup/
```

Expected: All files listed above are present.

---

### Task 2: Clone eleventy-excellent as new tolstoy-life

**Files:**
- Create: `/Users/johanedlund/Projects/tolstoy-life-new/` (temporary name)

- [ ] **Step 1: Clone eleventy-excellent**

```bash
cd /Users/johanedlund/Projects
git clone https://github.com/madrilene/eleventy-excellent.git tolstoy-life-new
```

Expected: Cloning completes successfully.

- [ ] **Step 2: Verify clone contents**

```bash
ls /Users/johanedlund/Projects/tolstoy-life-new/
```

Expected: Standard eleventy-excellent file structure (package.json, eleventy.config.js, src/, etc.)

---

### Task 3: Configure git remotes

**Files:**
- Modify: `/Users/johanedlund/Projects/tolstoy-life-new/.git/config`

- [ ] **Step 1: Rename origin to upstream**

```bash
cd /Users/johanedlund/Projects/tolstoy-life-new
git remote rename origin upstream
```

- [ ] **Step 2: Create the GitHub repo (if needed) and add as origin**

```bash
cd /Users/johanedlund/Projects/tolstoy-life-new
gh repo create pjedlund/tolstoy-life --public --source=. --remote=origin
```

If the repo already exists:

```bash
git remote add origin git@github.com:pjedlund/tolstoy-life.git
```

- [ ] **Step 3: Add JEDEE as a remote for cherry-picking**

```bash
cd /Users/johanedlund/Projects/tolstoy-life-new
git remote add jedee git@github.com:pjedlund/JEDEE.git
```

- [ ] **Step 4: Verify remotes**

```bash
cd /Users/johanedlund/Projects/tolstoy-life-new
git remote -v
```

Expected output (URLs may vary slightly):

```
jedee    git@github.com:pjedlund/JEDEE.git (fetch)
jedee    git@github.com:pjedlund/JEDEE.git (push)
origin   git@github.com:pjedlund/tolstoy-life.git (fetch)
origin   git@github.com:pjedlund/tolstoy-life.git (push)
upstream https://github.com/madrilene/eleventy-excellent.git (fetch)
upstream https://github.com/madrilene/eleventy-excellent.git (push)
```

---

### Task 4: Copy Tolstoy-specific files into the new repo

**Files:**
- Create in `/Users/johanedlund/Projects/tolstoy-life-new/`:
  - `CLAUDE.md`
  - `tolstoy-works-schema.md`
  - `tolstoy-works-schema.html`
  - `sources.yaml`
  - `works/the-kingdom-of-god-is-within-you.yaml`
  - `_resources/` (directory)
  - `docs/session-context-2026-03-28.md`
  - `docs/schmem-questions.md`
  - `docs/superpowers/specs/2026-03-29-sibling-fork-setup-design.md`
  - `docs/superpowers/plans/2026-03-29-sibling-fork-setup.md`
  - `.claude/` (directory)

- [ ] **Step 1: Copy files from backup**

```bash
cd /Users/johanedlund/Projects/tolstoy-life-new
cp /Users/johanedlund/Projects/_tmp/tolstoy-backup/CLAUDE.md .
cp /Users/johanedlund/Projects/_tmp/tolstoy-backup/tolstoy-works-schema.md .
cp /Users/johanedlund/Projects/_tmp/tolstoy-backup/tolstoy-works-schema.html .
cp /Users/johanedlund/Projects/_tmp/tolstoy-backup/sources.yaml .
cp -R /Users/johanedlund/Projects/_tmp/tolstoy-backup/works .
cp -R /Users/johanedlund/Projects/_tmp/tolstoy-backup/_resources .
cp -R /Users/johanedlund/Projects/_tmp/tolstoy-backup/.claude .
mkdir -p docs/superpowers/specs docs/superpowers/plans
cp /Users/johanedlund/Projects/_tmp/tolstoy-backup/session-context-2026-03-28.md docs/
cp /Users/johanedlund/Projects/_tmp/tolstoy-backup/schmem-questions.md docs/
cp -R /Users/johanedlund/Projects/_tmp/tolstoy-backup/docs/superpowers/specs/* docs/superpowers/specs/
cp -R /Users/johanedlund/Projects/_tmp/tolstoy-backup/docs/superpowers/plans/* docs/superpowers/plans/
```

- [ ] **Step 2: Verify files are present**

```bash
ls -la /Users/johanedlund/Projects/tolstoy-life-new/CLAUDE.md
ls -la /Users/johanedlund/Projects/tolstoy-life-new/works/
ls -la /Users/johanedlund/Projects/tolstoy-life-new/sources.yaml
```

Expected: All files exist.

- [ ] **Step 3: Commit Tolstoy-specific files**

```bash
cd /Users/johanedlund/Projects/tolstoy-life-new
git add CLAUDE.md tolstoy-works-schema.md tolstoy-works-schema.html sources.yaml works/ _resources/ docs/ .claude/
git commit -m "feat: add Tolstoy-specific project files

Migrate schema, sources, work records, and documentation
from the initial project setup into the eleventy-excellent fork."
```

---

### Task 5: Verify the build works

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/johanedlund/Projects/tolstoy-life-new
npm install
```

Expected: Dependencies install without errors.

- [ ] **Step 2: Run the build**

```bash
cd /Users/johanedlund/Projects/tolstoy-life-new
npm run build
```

Expected: Eleventy builds successfully. There may be warnings about demo content — that's fine.

- [ ] **Step 3: Run the dev server briefly to confirm it starts**

```bash
cd /Users/johanedlund/Projects/tolstoy-life-new
npx @11ty/eleventy --serve &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080
kill %1
```

Expected: HTTP 200 response.

---

### Task 6: Swap directories

- [ ] **Step 1: Remove the old tolstoy-life directory**

```bash
rm -rf /Users/johanedlund/Projects/tolstoy-life
```

- [ ] **Step 2: Rename the new directory**

```bash
mv /Users/johanedlund/Projects/tolstoy-life-new /Users/johanedlund/Projects/tolstoy-life
```

- [ ] **Step 3: Verify the swap**

```bash
cd /Users/johanedlund/Projects/tolstoy-life
git remote -v
ls CLAUDE.md works/ sources.yaml
```

Expected: Remotes show upstream/origin/jedee, Tolstoy files are present.

---

### Task 7: Push to origin and clean up

- [ ] **Step 1: Push to GitHub**

```bash
cd /Users/johanedlund/Projects/tolstoy-life
git push -u origin main
```

Expected: Push succeeds to pjedlund/tolstoy-life.

- [ ] **Step 2: Verify upstream merge works**

```bash
cd /Users/johanedlund/Projects/tolstoy-life
git fetch upstream
```

Expected: Fetch completes without error. (No merge needed — we just cloned, so we're already up to date.)

- [ ] **Step 3: Remove backup directory**

```bash
rm -rf /Users/johanedlund/Projects/_tmp/tolstoy-backup
```

- [ ] **Step 4: Verify JEDEE is unaffected**

```bash
cd /Users/johanedlund/Projects/JEDEE
git status
git remote -v
```

Expected: JEDEE repo is clean, remotes are intact.
