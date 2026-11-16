---
name: setup-workflow
description: Configure a repo's workflow in Linear or as local docs.
disable-model-invocation: true
---

# Setup workflow

Scaffold where this repo's work lives. Two stores:

- **Linear**: the Linear project is the only store. Glossary, decisions, specs, and tickets live there. The repo working tree stays as it was.
- **Local docs**: markdown in this repo. Issues under `.scratch/`, domain docs at the root, agent config under `docs/agents/`.

Prompt-driven. Explore, present, confirm, then write. One store per run.

## Process

### 1. Explore

Read what is already there:

- `git remote -v` and the repo directory name
- `AGENTS.md` and `CLAUDE.md`: an existing `## Agent skills` section
- `GLOSSARY.md`, `GLOSSARY-MAP.md`, `docs/adr/`, and any `src/*/docs/adr/`
- `docs/agents/` and `.scratch/`
- Monorepo signals: `pnpm-workspace.yaml`, a `workspaces` field in `package.json`, or a populated `packages/*` with its own `src/`
- Linear MCP: `whoami`, then `list_teams`. A failed or unauthenticated call means Linear is unavailable

Done when you can say what already exists, whether Linear answers, and whether the repo is a monorepo.

### 2. Choose the store

Summarise what is present. Then ask exactly one question with AskQuestion.

Recommend **Linear** when Linear MCP answered. Recommend **Local docs** when it did not.

Options:

- **Linear**
- **Local docs**

Done when the user has picked one. A repo that already has the other store still follows the pick. Say what the existing store is before they answer.

### 3. Run that store

- **Linear**: read [linear.md](linear.md) and follow it.
- **Local docs**: read [local.md](local.md) and follow it.

### 4. Done

Tell the user which store is configured and where glossary, specs, and tickets live.

Linear: the project URL, the document titles (`Workflow`, `Glossary`, `Decisions`), and that this run added no repo files.

Local docs: the paths written under `docs/agents/`, plus `GLOSSARY.md` and `docs/adr/`.

Re-run this skill only to switch stores or start over. Later edits happen in the store itself.
