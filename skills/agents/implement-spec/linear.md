# Linear

The `Workflow` document is the contract. Read it before the first write. Read each tool schema before calling it.

The parent agent sets every status. Implementer subagents leave Linear alone.

## Load the reference

The user passes an identifier (`DVO-12`), an issue URL, or a title.

- An identifier, or the identifier in an issue URL (the segment after `/issue/`): `get_issue`.
- A title: `list_issues` with the team and project from `Workflow`, `query` set to the title. One match: use it. Several: ask with AskQuestion. None: stop.

From `get_issue`, use `title`, `url`, `parentId`, and `status`. Pass `includeRelations: true` when loading a ticket that may have blockers.

A ticket has `parentId`. Its spec is the ancestor whose `parentId` is empty. Walk with `get_issue`.

A spec has an empty `parentId`. Its tickets are `list_issues` with `parentId` set to the spec. Follow `cursor` while `hasNextPage` is true.

A ticket is ready when every issue in its `blockedBy` relations is already integrated in this run. That is the frontier in the steps.

## Status

Use the Status table in `Workflow`. `save_issue` with `id` and `state`.

| Moment | Issue | Status |
| --- | --- | --- |
| Step 1, spec and tickets are read | Spec | Start work |
| Step 4, an implementer is about to start a ticket | That ticket | Start work |
| Step 9, after verifying the final commit and creating or updating any required PR | Spec and all its tickets | Ready for review |

A run that stops early leaves each issue at the last status set above.
