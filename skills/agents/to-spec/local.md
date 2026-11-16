# Local docs

Follow `docs/agents/` in the repo. Those files are the contract `/setup-workflow` wrote.

## Domain

Read `docs/agents/domain.md` and follow it before exploring. When that file is missing, read `GLOSSARY.md` or `GLOSSARY-MAP.md` at the repo root and any ADRs under `docs/adr/` that touch the area. A missing glossary or ADR is fine: continue.

## Publish

Read `docs/agents/issue-tracker.md`. Write the spec at the path that file calls the spec.

When that file matches the local-markdown contract, the path is `.scratch/<feature-slug>/spec.md`. `<feature-slug>` is the spec title in kebab-case. Create the directory when it is missing.

Read `docs/agents/triage-labels.md` when it exists. The status string is that file's string for the `ready-for-agent` role. When the file is missing, the string is `ready-for-agent`.

```markdown
# <title>

Status: <ready-for-agent string>

<spec body>
```

The spec body is the filled template, starting at `## Problem Statement`.

Done when the file is on disk and you have reported its path.
