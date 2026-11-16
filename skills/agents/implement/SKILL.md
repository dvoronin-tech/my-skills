---
name: implement
description: Implement one spec or one ticket from the configured store.
disable-model-invocation: true
---

# Implement

Implement one issue. A ticket is that ticket. A spec is one task: its body, not its child tickets. `/setup-workflow` chose the store.

## 1. Resolve the store

Local docs is configured when `docs/agents/issue-tracker.md` exists.

Linear is configured when the Linear project named after this repo's directory has a document titled `Workflow`. `list_teams`, then `list_projects`, then `list_documents` with that project's id. Read each tool schema before calling. A failed or unauthenticated call means Linear is unavailable.

| What you found | Do |
| --- | --- |
| Local file only | Read [local.md](local.md) and follow it. |
| `Workflow` only | Read [linear.md](linear.md) and follow it. |
| Both | Ask which store with AskQuestion. Options: Linear, Local docs. Then follow that file. |
| Neither | Stop. Tell the user to run `/setup-workflow`. |

Done when the reference is loaded and classified as a spec or a ticket.

## 2. Confirm a spec

State the title before any edit.

When the reference is a ticket, continue at step 3.

When the reference is a spec, warn the user with AskQuestion before editing. Name its identifier and title. Say that this run implements the spec as one task and does not open its child tickets. Options: Implement the spec, Stop.

On Stop, finish. Leave every status as it is.

On Implement the spec, when child tickets exist, ask the removal question the store file gives. Remember the answer. A spec with no children skips that question.

Done when the work item is one issue and, for a spec, the user has accepted it.

## 3. Do the work

Implement the work described in that issue.

Call the Skill tool with "tdd" where possible, at pre-agreed seams. The store is already chosen.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, call the Skill tool with "code-review" to review the work. The spec source is this issue.

## 4. Close out

Follow the store file. Set the finishing status only after code review of this run is done. Remove child tickets only then, and only when the user agreed.

Done when you have reported the issue title, where it lives, its status, and what happened to its children.
