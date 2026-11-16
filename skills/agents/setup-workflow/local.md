# Local docs store

Follow this after the user picks Local docs in `SKILL.md`. This store is markdown in the repo.

## 1. Triage labels

The five roles and their default strings live in [triage-labels.md](triage-labels.md). Ask exactly one question:

> Keep the default triage labels? (recommended: yes)

Defaults, each string equal to its role: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.

On yes, use them as-is. On no, collect the override string for each role.

Done when the five strings are fixed.

## 2. Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. Write that layout without asking.

Multi-context only when exploration found monorepo signals. Then ask whether they want single-context or a root `GLOSSARY-MAP.md` pointing at per-context glossaries.

Done when the layout is chosen.

## 3. Confirm

Show the draft and let the user edit it before writing:

- the `## Agent skills` block
- `docs/agents/issue-tracker.md` from [issue-tracker-local.md](issue-tracker-local.md)
- `docs/agents/domain.md` from [domain.md](domain.md)
- `docs/agents/triage-labels.md` from [triage-labels.md](triage-labels.md). Put the chosen strings in the "Label in our tracker" column

The block:

```markdown
## Agent skills

### Issue tracker

Issues and specs live as markdown under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage roles use the default label strings. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. See `docs/agents/domain.md`.
```

When the domain layout is multi-context, say multi-context in that sub-block and in `domain.md`. When label strings were overridden, say so in the triage sub-block.

Done when the user accepts the draft.

## 4. Write

Edit the host file the repo already uses. When both `AGENTS.md` and `CLAUDE.md` exist, edit `AGENTS.md` for anything Cursor and Codex share, and leave `CLAUDE.md` unless the user is on Claude Code and the instruction is Claude-only. When neither exists, ask which file to create: `AGENTS.md` for Cursor or Codex, `CLAUDE.md` for Claude Code.

Update an existing `## Agent skills` block in place. Leave the surrounding sections as they are.

Write the accepted docs. Create empty `GLOSSARY.md` and `docs/adr/` only when the user asked for those files in the draft. The domain doc tells skills to create them lazily, so the default draft does not add them.

Done when the accepted files are on disk.
