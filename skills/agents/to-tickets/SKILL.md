---
name: to-tickets
description: Break a plan, spec, or the current conversation into tracer-bullet tickets with blocking edges, and publish them to the store /setup-workflow chose.
disable-model-invocation: true
---

# To Tickets

Break a plan, spec, or conversation into a set of **tickets**: tracer-bullet vertical slices, each declaring the tickets that **block** it.

The store was chosen by `/setup-workflow`.

## 1. Resolve the store

Local docs is configured when `docs/agents/issue-tracker.md` exists.

Linear is configured when the Linear project named after this repo's directory has a document titled `Workflow`. `list_teams`, then `list_projects`, then `list_documents` with that project's id. Read each tool schema before calling. A failed or unauthenticated call means Linear is unavailable.

| What you found | Do |
| --- | --- |
| Local file only | Read [local.md](local.md) and follow it. |
| `Workflow` only | Read [linear.md](linear.md) and follow it. |
| Both | Ask which store with AskQuestion. Options: Linear, Local docs. Then follow that file. |
| Neither | Stop. Tell the user to run `/setup-workflow`. |

When the caller already chose the store this run, do not ask again.

Done when one store is chosen.

## 2. Gather context

Work from whatever is already in the conversation context. If the user passes a reference (a spec path, an issue number or URL) as an argument, fetch it and read its full body and comments.

## 3. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Read the domain docs the store file names before exploring. Ticket titles and descriptions use the project's glossary vocabulary, and respect ADRs in the area you're touching.

Look for opportunities to prefactor the code to make the implementation easier. Make the change easy, then make the easy change.

## 4. Draft vertical slices

Break the work into **tracer bullet** tickets.

- Each slice cuts a narrow but complete path through every layer (schema, API, UI, tests): vertical, not a horizontal slice of one layer.
- A completed slice is demoable or verifiable on its own.
- Each slice is sized to fit in a single fresh context window.
- Any prefactoring comes first.

Give each ticket its **blocking edges**: the other tickets that must complete before it can start. A ticket with no blockers can start immediately.

**Wide refactors are the exception to vertical slicing.** A wide refactor is one mechanical change (rename a column, retype a shared symbol) whose blast radius fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Sequence it as expand–contract. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own ticket blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a ticket blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify ticket; green is promised only there.

## 5. Quiz the user

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Blocked by**: which other tickets (if any) must complete first
- **What it delivers**: the end-to-end behaviour this ticket makes work

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct: does each ticket only depend on tickets that genuinely gate it?
- Should any tickets be merged or split further?

Iterate until the user approves the breakdown.

## 6. Publish

Follow the Publish section of the store file from step 1. Publish blockers first.

Do not close or modify the parent spec.

In either store, avoid specific file paths or code snippets: they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it and note briefly that it came from a prototype. Trim to the decision-rich parts.
