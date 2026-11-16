# Linear

The `Workflow` document on the project is the contract. Read it before publishing. Team, project, publish status, the resolve status, and the `ready-for-agent` label all come from that document.

Read each Linear tool schema before calling it.

## Domain

Read the project documents titled `Glossary` and `Decisions` before exploring. A missing document is fine: continue. Use the glossary's terms.

## Publish

The parent spec is the issue the user named, or the spec this conversation produced. It is a top-level issue: empty `parentId`. Do not close it and do not change its body, status, or labels.

When no spec issue exists, stop. Tell the user to run `/to-spec`.

Create one child issue per ticket with `save_issue`, blockers first so each `blockedBy` can name a real identifier:

- `team` and `project` from `Workflow`
- `parentId`: the spec
- `title`: the ticket title
- `description`: the body below
- `state`: the status `Workflow` names for publishing a spec or ticket
- `labels`: the label `Workflow` names for `ready-for-agent`
- `blockedBy`: the identifiers of the tickets that block this one. Omit it when nothing blocks this ticket.

```markdown
## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective, not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
```

A ticket is unblocked when every issue in `blockedBy` has the resolve status from `Workflow`.

Done when every ticket exists and you have reported each identifier and URL. The parent spec is unchanged.
