# Local docs

Follow `docs/agents/issue-tracker.md`.

## Load the reference

The user passes a path, an issue number, or a feature slug. Read the file that tracker names. When several files match, ask which one with AskQuestion.

The spec is the file the tracker calls the spec: `.scratch/<feature-slug>/spec.md`.

A ticket is a file under `.scratch/<feature-slug>/issues/`.

Child tickets are the files in that `issues/` directory.

## Confirm a spec

Removal question, asked only after the user chooses Implement the spec and the `issues/` directory has files:

> Delete the child ticket files after this spec is implemented?

Options: Delete them, Keep them.

## Close out

Leave each file's `Status:` line as it was.

When the user chose Delete them, delete the child ticket files after code review. Leave `spec.md` in place. Report the paths removed.
