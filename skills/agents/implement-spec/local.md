# Local docs

Follow `docs/agents/issue-tracker.md`.

## Load the reference

The user passes a path, an issue number, or a feature slug. Read the file that tracker names. When several files match, ask which one with AskQuestion.

The spec is `.scratch/<feature-slug>/spec.md`. Its tickets are the files in `.scratch/<feature-slug>/issues/`.

A path under `issues/` is a ticket. Its spec is the `spec.md` in that feature directory.

Blocking edges are the tracker's blocking lines. The frontier is the tickets whose blockers are already integrated, as the steps describe.

## Close out

Step 9 resolves tickets the way `docs/agents/issue-tracker.md` closes work. Leave that as the tracker's own rule.
