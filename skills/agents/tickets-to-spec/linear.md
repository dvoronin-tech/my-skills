# Linear

Read `Workflow` and the domain docs using [to-spec's Linear instructions](../to-spec/linear.md). Resolve each issue identifier or URL with `get_issue` and request relations. Read comments with `list_comments`. Confirm the issues belong to the configured project before planning to reparent them.

1. Publish the approved top-level spec using the `to-spec` instructions above. Its `parentId` is empty. If the user approved reusing an existing spec, use its issue ID and make only the agreed edits.
2. Create any approved additions as sub-issues of the spec using [to-tickets' Linear publish rules](../to-tickets/linear.md). Create new blockers first so their identifiers are available to dependent tickets.
3. Update existing tickets with `save_issue` using their existing `id` and the new spec as `parentId`. Send only the approved fields. Set blockers with `blockedBy`. Use `removeBlockedBy` for approved removals. Preserve the rest of the relations and apply any approved description changes without replacing unrelated content.
4. Complete the spec's ticket links once the new issue identifiers are known. Verify the spec's children with `list_issues` filtered by `parentId` and check each ticket's blockers with `get_issue` and relations. Report the spec and issue identifiers with their URLs.
