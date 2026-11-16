# Linear

The `Workflow` document is the contract. Read it before the first write. Read each tool schema before calling it.

## Load the reference

The user passes an identifier (`DVO-12`), an issue URL, or a title.

- An identifier, or the identifier in an issue URL (the segment after `/issue/`): `get_issue`.
- A title: `list_issues` with the team and project from `Workflow`, `query` set to the title. One match: use it. Several: ask with AskQuestion. None: stop.

From `get_issue`, use `title`, `url`, `parentId`, and `status`.

A ticket has `parentId`. Its spec is the ancestor whose `parentId` is empty. Walk with `get_issue`.

A spec has an empty `parentId`. Its child tickets are `list_issues` with `parentId` set to the spec. Follow `cursor` while `hasNextPage` is true.

## Confirm a spec

Removal question, asked only after the user chooses Implement the spec and the spec has child tickets:

> Cancel the child tickets after this spec is implemented?

Options: Cancel them, Keep them.

## Status

Use the Status table in `Workflow`. `save_issue` with `id` and `state`.

| Moment | Status |
| --- | --- |
| About to edit this issue | Start work |
| Code review of this run is finished | Ready for review |

A run that stops before code review leaves the status at Start work.

## Cancel children

When the user chose Cancel them, set each child ticket's `state` to the Cancel status from `Workflow` after code review. Report each identifier. Linear tools have no issue delete; Cancel is how a child ticket is removed.
