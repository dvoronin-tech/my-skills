---
name: implement-spec
description: Implement a spec by giving each of its tickets its own agent, then squash to one commit.
disable-model-invocation: true
---

# Implement spec

Implement every ticket of one spec as **one new commit on the user's current branch**. Each ready ticket goes to its own agent. `/setup-workflow` chose the store.

## 0. Resolve the target

Local docs is configured when `docs/agents/issue-tracker.md` exists.

Linear is configured when the Linear project named after this repo's directory has a document titled `Workflow`. `list_teams`, then `list_projects`, then `list_documents` with that project's id. Read each tool schema before calling. A failed or unauthenticated call means Linear is unavailable.

| What you found | Do |
| --- | --- |
| Local file only | Read [local.md](local.md) and follow it. |
| `Workflow` only | Read [linear.md](linear.md) and follow it. |
| Both | Ask which store with AskQuestion. Options: Linear, Local docs. Then follow that file. |
| Neither | Stop. Tell the user to run `/setup-workflow`. |

When the reference is a ticket, stop before the steps below. Name the ticket and the spec the store file found. Ask with AskQuestion whether to implement that spec. Options: Implement the spec, Stop. On Stop, finish with no status change and no edits. On Implement the spec, the steps below use that spec.

When the reference is a spec with no tickets, stop. Tell the user to run `/implement` on it.

Done when the target is one spec that has tickets, or the run has stopped.

The steps below are the work. On Linear, [linear.md](linear.md) sets status at the moments it names. Those writes sit beside the step and do not replace it.

## Steps

1. Read the spec and tickets. Record the current branch as the **target branch** and its HEAD as the **starting commit**. Record any existing local changes and preserve them outside the final implementation commit. If HEAD is detached, ask which branch should receive the result.

2. (Optional) Use an **exploration subagent** for codebase or documentation research. Save its notes outside the repo in a location accessible to future subagents.

3. Create a temporary **integration branch** and worktree from the starting commit. Keep the user's checkout on the target branch. Track every temporary branch and worktree created by this run so cleanup affects only those resources.

4. Use **implementer subagents** for ready tickets, each in its own temporary worktree and branch based on the latest integration branch tip. Each implementer:
   - confirms its starting point before editing; recreates an incorrectly based clean temporary worktree rather than discarding work;
   - uses `tdd` to build the ticket, with the store already chosen;
   - merges the latest integration branch tip into its ticket branch and resolves conflicts before reporting completion.

5. Use a **merger subagent** to merge each completed ticket into the integration branch and run the relevant checks. Once the merge is verified and the ticket branch tip is an ancestor of the integration branch, remove that ticket's worktree and delete its local branch immediately. Preserve any uncommitted work before cleanup. Start newly unblocked tickets as the frontier changes.

6. Once all tickets are integrated, use `code-review` to review the full diff from the starting commit to the integration branch. The spec source is the parent spec. Have one implementer subagent fix the findings, integrate its changes, and clean up its temporary worktree and branch as in step 5. Complete the required checks for the combined implementation.

7. Apply the reviewed result to the target branch with a **squash merge**, then create one commit describing the whole implementation. Before applying it, confirm the target branch still points to the starting commit and isolate existing local changes so they are neither overwritten nor included. If the branch has advanced, preserve its new commits, reconcile the implementation with that tip, and review and verify the combined result before the squash. Resolve squash conflicts and rerun affected checks before committing. Restore preserved local changes afterward; retain their recovery copy if restoration conflicts. Never rewrite existing target-branch commits to obtain the single new commit.

8. Verify that exactly one implementation commit was added to the target branch and that it contains the complete reviewed result. Remove the temporary integration worktree, then delete its branch. A squash does not preserve ancestry: forced deletion of this run's temporary integration branch is allowed only after verifying its full result is safely in the final commit. If integration or verification fails, keep the branches needed to recover the work and report what remains.

9. Resolve tickets through the configured tracker workflow. If a PR is required by that workflow or requested by the user, create or update it from the target branch after the final commit, referencing the spec and tickets. Report the target branch, final commit, validation results, and cleanup status. Leave unrelated branches and worktrees untouched.
