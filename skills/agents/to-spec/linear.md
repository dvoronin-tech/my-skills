# Linear

The `Workflow` document on the project is the contract. Read it before publishing. Team, project, publish status, and the `ready-for-agent` label all come from that document.

Read each Linear tool schema before calling it.

## Domain

Read the project documents titled `Glossary` and `Decisions` before exploring. A missing document is fine: continue. Use the glossary's terms. When a decision conflicts with the spec, say so in the spec.

## Publish

Create one issue with `save_issue`:

- `team` and `project` from `Workflow`
- `title`: the spec title
- `description`: the spec body, starting at `## Problem Statement`
- `state`: the status `Workflow` names for publishing a spec
- `labels`: the label `Workflow` names for `ready-for-agent`

The spec is a top-level issue in the project. Leave `parentId` unset.

Done when the issue exists and you have reported its identifier and URL.
