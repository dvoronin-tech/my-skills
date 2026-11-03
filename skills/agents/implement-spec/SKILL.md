---
name: implement-spec
description: "Implement a spec and its tickets as one commit on the current branch, then remove temporary branches and worktrees."
disable-model-invocation: true
---

You have been provided a spec with tickets describing how to implement it.

The issue tracker should have been provided to you. If not, tell the user to run `/setup-matt-pocock-skills`.

The goal is the entire spec implemented as **one new commit on the user's current branch**, with every ticket resolved the way the issue tracker closes work. Preserve the branch's existing history. Temporary branches and worktrees are implementation details; remove them once their work is safely integrated.

The tickets form a **task graph** with blocking relationships. Work the **frontier**: tickets whose blockers have all been integrated.

Communicate with subagents primarily through **context pointers** to the spec, tickets, research notes, and commits. Run implementer subagents in the background where possible.

## Steps

1. Read the spec and tickets. Record the current branch as the **target branch** and its HEAD as the **starting commit**. Record any existing local changes and preserve them outside the final implementation commit. If HEAD is detached, ask which branch should receive the result.

2. (Optional) Use an **exploration subagent** for codebase or documentation research. Save its notes outside the repo in a location accessible to future subagents.

3. Create a temporary **integration branch** and worktree from the starting commit. Keep the user's checkout on the target branch. Track every temporary branch and worktree created by this run so cleanup affects only those resources.

4. Use **implementer subagents** for ready tickets, each in its own temporary worktree and branch based on the latest integration branch tip. Each implementer:
   - confirms its starting point before editing; recreates an incorrectly based clean temporary worktree rather than discarding work;
   - uses `tdd` to build the ticket;
   - merges the latest integration branch tip into its ticket branch and resolves conflicts before reporting completion.

5. Use a **merger subagent** to merge each completed ticket into the integration branch and run the relevant checks. Once the merge is verified and the ticket branch tip is an ancestor of the integration branch, remove that ticket's worktree and delete its local branch immediately. Preserve any uncommitted work before cleanup. Start newly unblocked tickets as the frontier changes.

6. Once all tickets are integrated, use `code-review` to review the full diff from the starting commit to the integration branch. Have one implementer subagent fix the findings, integrate its changes, and clean up its temporary worktree and branch as in step 5. Complete the required checks for the combined implementation.

7. Apply the reviewed result to the target branch with a **squash merge**, then create one commit describing the whole implementation. Before applying it, confirm the target branch still points to the starting commit and isolate existing local changes so they are neither overwritten nor included. If the branch has advanced, preserve its new commits, reconcile the implementation with that tip, and review and verify the combined result before the squash. Resolve squash conflicts and rerun affected checks before committing. Restore preserved local changes afterward; retain their recovery copy if restoration conflicts. Never rewrite existing target-branch commits to obtain the single new commit.

8. Verify that exactly one implementation commit was added to the target branch and that it contains the complete reviewed result. Remove the temporary integration worktree, then delete its branch. A squash does not preserve ancestry: forced deletion of this run's temporary integration branch is allowed only after verifying its full result is safely in the final commit. If integration or verification fails, keep the branches needed to recover the work and report what remains.

9. Resolve tickets through the configured tracker workflow. If a PR is required by that workflow or requested by the user, create or update it from the target branch after the final commit, referencing the spec and tickets. Report the target branch, final commit, validation results, and cleanup status. Leave unrelated branches and worktrees untouched.
