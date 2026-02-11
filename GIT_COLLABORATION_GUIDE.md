# Git Collaboration Guide for Team Development

## Overview

When working with multiple people, you need a workflow that ensures everyone's local repository stays in sync with GitHub. Here's how to set it up properly.

---

## The Problem

**What you're asking:** After a push is approved, how do everyone's local repositories automatically sync with GitHub?

**Answer:** They don't automatically sync. Each team member needs to **pull** changes from GitHub to their local repository.

---

## Basic Git Workflow for Teams

### 1. **Pull Before You Start Working**

**Always pull the latest changes before starting work:**

```bash
# Pull latest changes from GitHub
git pull origin main

# Or if you're on a different branch
git pull origin your-branch-name
```

**Why?** This ensures you have the latest code from your teammates.

---

### 2. **Work on Your Changes**

```bash
# Make your changes
# Edit files, add features, etc.

# Stage your changes
git add .

# Commit your changes
git commit -m "Your descriptive commit message"

# Push to GitHub
git push origin main
```

---

### 3. **Pull After Teammates Push**

**When a teammate pushes changes, everyone else should pull:**

```bash
# Pull latest changes
git pull origin main
```

**This merges their changes into your local repository.**

---

## Recommended Workflow: Feature Branches + Pull Requests

**Best practice for 3+ people working simultaneously:**

### Step 1: Create a Feature Branch

**Each person works on their own branch:**

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Example:
git checkout -b feature/add-search-filter
git checkout -b feature/update-teacher-dashboard
git checkout -b feature/fix-mobile-layout
```

### Step 2: Work on Your Branch

```bash
# Make changes
# Stage and commit
git add .
git commit -m "Add search filter functionality"

# Push your branch to GitHub
git push origin feature/your-feature-name
```

### Step 3: Create a Pull Request

1. Go to GitHub → Your repository
2. Click "Pull Requests" → "New Pull Request"
3. Select your branch (`feature/your-feature-name`) → `main`
4. Add description, request review
5. Wait for approval

### Step 4: After Approval - Merge

**Once approved, merge the PR:**
- Click "Merge pull request" on GitHub
- This merges the branch into `main`

### Step 5: Everyone Pulls the Updated Main

**After merge, everyone should pull:**

```bash
# Switch back to main branch
git checkout main

# Pull the latest changes (includes merged PR)
git pull origin main

# Delete your local feature branch (optional cleanup)
git branch -d feature/your-feature-name
```

---

## Setting Up Branch Protection (Recommended)

**Protect the `main` branch so changes require approval:**

### On GitHub:

1. Go to your repository → **Settings** → **Branches**
2. Click **Add rule** or **Edit** next to `main`
3. Enable:
   - ✅ **Require a pull request before merging**
   - ✅ **Require approvals** (set to 1 or 2)
   - ✅ **Require status checks to pass** (if you have CI/CD)
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Do not allow bypassing the above settings**

**This ensures:**
- No direct pushes to `main`
- All changes go through Pull Requests
- At least one person reviews before merging
- Everyone's local repos stay in sync

---

## Daily Workflow for Your Team

### Morning Routine (Start of Day)

```bash
# 1. Pull latest changes
git checkout main
git pull origin main

# 2. Create your feature branch
git checkout -b feature/your-task-today

# 3. Start working
```

### During the Day

```bash
# If someone merged a PR, pull again
git checkout main
git pull origin main

# Update your feature branch with latest main
git checkout feature/your-task-today
git merge main  # or: git rebase main
```

### End of Day

```bash
# Push your work
git push origin feature/your-task-today

# Create Pull Request on GitHub
# Wait for review/approval
```

---

## Handling Conflicts

**When two people edit the same file:**

### If you get a conflict when pulling:

```bash
git pull origin main
# Git will show: "CONFLICT (content): Merge conflict in file.txt"

# Open the conflicted file(s)
# Look for conflict markers:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# Resolve conflicts manually
# Keep what you need, remove conflict markers

# Stage resolved files
git add .

# Complete the merge
git commit -m "Merge main into feature branch, resolve conflicts"

# Push
git push origin feature/your-feature-name
```

---

## Quick Reference Commands

### Check Current Status
```bash
git status                    # See what's changed
git log --oneline            # See commit history
git branch                   # List all branches
```

### Sync with GitHub
```bash
git pull origin main         # Get latest changes
git push origin main         # Send your changes
```

### Branch Management
```bash
git checkout -b feature/new  # Create new branch
git checkout main            # Switch to main
git branch -d feature/old    # Delete local branch
```

### Undo Changes (if needed)
```bash
git reset --hard HEAD        # Discard uncommitted changes (CAREFUL!)
git checkout -- filename     # Discard changes to one file
```

---

## Best Practices for Your Team

### ✅ DO:
1. **Always pull before starting work**
2. **Work on feature branches** (not directly on `main`)
3. **Commit frequently** with descriptive messages
4. **Pull before pushing** to avoid conflicts
5. **Communicate** when you're working on shared files
6. **Review Pull Requests** before merging
7. **Test before pushing** to avoid breaking `main`

### ❌ DON'T:
1. **Don't force push to `main`** (use Pull Requests)
2. **Don't commit directly to `main`** (use branches)
3. **Don't ignore conflicts** (resolve them properly)
4. **Don't push broken code** (test first)
5. **Don't skip Pull Requests** (even for small changes)

---

## Setting Up for Your Team

### 1. Set Up Branch Protection

**On GitHub:**
- Settings → Branches → Add rule for `main`
- Require Pull Requests
- Require 1 approval minimum

### 2. Create a `.gitignore` File

**Make sure everyone ignores the same files:**
```gitignore
# Already in your project
node_modules/
.env.local
.DS_Store
dist/
```

### 3. Document Your Workflow

**Create a `CONTRIBUTING.md` file:**
- How to create branches
- Naming conventions (e.g., `feature/`, `fix/`, `docs/`)
- Commit message format
- When to create PRs

### 4. Use GitHub Issues

**Track work:**
- Create issues for tasks
- Link PRs to issues
- Use labels (bug, feature, enhancement)

---

## Example: 3 People Working Simultaneously

### Scenario: Adding 3 different features

**Person A:**
```bash
git checkout main
git pull origin main
git checkout -b feature/add-search-bar
# Work on search bar
git add .
git commit -m "Add search bar component"
git push origin feature/add-search-bar
# Create PR on GitHub
```

**Person B:**
```bash
git checkout main
git pull origin main
git checkout -b feature/update-footer
# Work on footer
git add .
git commit -m "Update footer design"
git push origin feature/update-footer
# Create PR on GitHub
```

**Person C:**
```bash
git checkout main
git pull origin main
git checkout -b feature/fix-mobile-menu
# Work on mobile menu
git add .
git commit -m "Fix mobile menu styling"
git push origin feature/fix-mobile-menu
# Create PR on GitHub
```

**After Person A's PR is approved and merged:**

**Person B & C:**
```bash
git checkout main
git pull origin main  # Now includes Person A's changes
git checkout feature/their-branch
git merge main        # Update their branch with Person A's changes
```

---

## Automated Solutions (Advanced)

### Option 1: GitHub Actions (Auto-sync)

**Create `.github/workflows/sync.yml`:**
```yaml
name: Notify Team on Merge

on:
  pull_request:
    types: [closed]

jobs:
  notify:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
    steps:
      - name: Notify team
        run: |
          echo "PR merged! Everyone should pull: git pull origin main"
```

**Note:** This just notifies. People still need to pull manually.

### Option 2: Git Hooks (Local)

**Create `.git/hooks/post-merge`:**
```bash
#!/bin/sh
echo "✅ Latest changes pulled from GitHub!"
```

**Note:** This only works locally, not across team members.

---

## Summary

**To answer your question directly:**

❌ **No automatic sync** - Local repos don't automatically update

✅ **Manual sync required** - Each person must run `git pull origin main`

✅ **Best practice** - Use feature branches + Pull Requests + Branch protection

✅ **Workflow:**
1. Pull before starting work
2. Work on feature branch
3. Push and create PR
4. After PR merged, everyone pulls again

**This ensures everyone stays in sync while working simultaneously!**

---

## Quick Setup Checklist

- [ ] Set up branch protection for `main`
- [ ] Everyone clones the repository
- [ ] Everyone understands the workflow
- [ ] Create a `CONTRIBUTING.md` with your team's rules
- [ ] Use feature branches for all work
- [ ] Require Pull Requests for merging
- [ ] Communicate when working on shared files

---

**Need help setting this up? Let me know!**

