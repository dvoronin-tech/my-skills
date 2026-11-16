# Local docs

Follow `docs/agents/` in the repo. Those files are the contract `/setup-workflow` wrote.

## Domain

Read `docs/agents/domain.md` and follow it before exploring. When that file is missing, read `GLOSSARY.md` or `GLOSSARY-MAP.md` at the repo root and any ADRs under `docs/adr/` that touch the area. A missing glossary or ADR is fine: continue.

## Publish

Read `docs/agents/issue-tracker.md`. Write one file per ticket. Do not modify the parent spec.

When that file matches the local-markdown contract, the directory is `.scratch/<feature-slug>/issues/`. `<feature-slug>` is the slug of the existing spec file, or the spec title in kebab-case when the spec was just written. Create the directory when it is missing. Number files from `01` in dependency order, blockers first: `<NN>-<slug>.md`. One ticket per file.

Read `docs/agents/triage-labels.md` when it exists. The status string is that file's string for the `ready-for-agent` role. When the file is missing, the string is `ready-for-agent`.

```markdown
# <NN>: <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective, not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles of the tickets that gate this one, or "None (can start immediately)".

**Status:** <ready-for-agent string>

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2
```

Done when every file is on disk and you have reported the paths. The spec file is unchanged.
