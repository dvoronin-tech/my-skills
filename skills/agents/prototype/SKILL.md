---
name: prototype
description: Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or logic feels right, or explore what a UI should look like. All work runs on a single prototype branch created from the current branch; only the chosen variant survives on it.
---

# Prototype

A prototype is **throwaway code that answers a question**. The question decides the shape.

## Pick the shape

Identify which question is being answered, using the user's prompt, the surrounding code, or by asking if the user is around:

- **"Does this logic / state model feel right?"** → [LOGIC.md](LOGIC.md). Build a single shareable HTML file (free-play buttons plus tabbed guided walkthroughs) that pushes the state machine through cases that are hard to reason about on paper, and that a non-developer can drive.
- **"What should this look like?"** → [UI.md](UI.md). Generate several radically different UI variations on a single route, switchable via a URL search param and a floating bottom bar.

The two shapes produce very different artifacts, so getting this wrong wastes the whole prototype. If the question is genuinely ambiguous and the user isn't reachable, default to whichever shape better matches the surrounding code (a backend module → logic; a page or component → UI) and state the assumption at the top of the prototype.

## Rules that apply to both

1. **Throwaway from day one, and clearly marked as such.** Locate the prototype code close to where it will actually be used (next to the module or page it's prototyping for) so context is obvious, but name it so a casual reader can see it's a prototype, not production. For throwaway UI routes, obey whatever routing convention the project already uses; don't invent a new top-level structure.
2. **Trivial to run.** A UI prototype starts from one command in the project's task runner: `pnpm <name>`, `python <path>`, `bun <path>`, etc. A logic demo is a single HTML file the user double-clicks. Either way, no thinking required to start it.
3. **No persistence by default.** State lives in memory. Persistence is the thing the prototype is _checking_, not something it should depend on. If the question explicitly involves a database, hit a scratch DB or a local file with a clear "PROTOTYPE, wipe me" name.
4. **Skip the polish.** No tests, no error handling beyond what makes the prototype _runnable_, no abstractions. The point is to learn something fast.
5. **Surface the state.** After every action (logic) or on every variant switch (UI), print or render the full relevant state so the user can see what changed.
6. **One branch, one variant, no leftovers.** Before generating anything, create one git branch from the user's current branch — named so it's obviously a prototype (e.g. `prototype/<topic>`, adapted to the project's branch naming) — and do all prototyping there; the starting branch stays untouched. No other branches, ever: not one per variant, not a backup. Don't commit the variant experiments while exploring. When a variant wins, fold it into the real code **on the prototype branch**, delete everything else — losing variants, the switcher, `?variant=` gates, throwaway routes, demo shells — and commit the fold-in. Deleted means deleted: not stashed, not parked on a side branch, not commented out. The commit message (or the issue, if one exists) records the question and the verdict. Merging the prototype branch back where the user came from — or deleting it — is the user's call afterwards.
