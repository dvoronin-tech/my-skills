# Linear

The `Workflow` document is the contract. Read each tool schema before calling it. Leave every issue status as it is.

## Load

The reference is an identifier (`DVO-12`), an issue URL, or a title.

- An identifier, or the identifier in an issue URL (the segment after `/issue/`): `get_issue`.
- A title: `list_issues` with the team and project from `Workflow`, `query` set to the title. One match: use it. Several: ask with AskQuestion. None: stop.

The body is the issue `description`.

A ticket has `parentId`. Its spec is the ancestor whose `parentId` is empty. Walk with `get_issue`.

A spec has an empty `parentId`.

## From commits

An identifier is the team key, a hyphen, and a number (`DVO-12`), or an issue URL. Load each with `get_issue`.

One issue: that description is the body. Several tickets with the same parent: the parent spec's description is the body. Tickets with different parents: ask which spec with AskQuestion.

## From the branch

`list_issues` with the team and project from `Workflow`, `query` set to the branch slug, keeping issues whose `parentId` is empty. One match: use it. Several: ask with AskQuestion. None: no match.
