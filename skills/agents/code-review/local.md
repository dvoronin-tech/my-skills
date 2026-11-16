# Local docs

Follow `docs/agents/issue-tracker.md`.

## Load

- A path: read that file.
- An issue number: the file that tracker calls "fetch the relevant ticket".
- A title: the `spec.md` or ticket file whose H1 matches. One match: use it. Several: ask with AskQuestion. None: stop.

A file under `.scratch/<feature-slug>/issues/` is a ticket. Its spec is `.scratch/<feature-slug>/spec.md`.

The spec file is `.scratch/<feature-slug>/spec.md`.

## From commits

Take paths, `.scratch/` references, and issue numbers the tracker file describes.

One ticket file: that file is the body. Several ticket files in one feature directory: `.scratch/<feature-slug>/spec.md` is the body. Ticket files in different feature directories: ask which spec with AskQuestion.

## From the branch

Open `.scratch/<slug>/spec.md` when the branch name or feature slug matches `<slug>`. A missing file is no match.
