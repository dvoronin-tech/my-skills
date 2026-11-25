---
name: tickets-to-spec
description: Turn two or more existing tickets into a shared spec. Discuss cross-ticket decisions, then publish the parent spec, link the original tickets, and set blockers. Add tickets only for agreed gaps. Supports Linear and local Markdown.
---

# Tickets to spec

Start with the existing tickets. The result is a spec that tells separate implementers how their work fits together, with the original tickets organized under it.

## 1. Read the tickets and code

Use the configured store already chosen for this run or clearly identified by the ticket references. Otherwise use the **Resolve the store** section of [to-spec](../to-spec/SKILL.md). Follow [Linear](linear.md) or [local docs](local.md) for this workflow. Ask when the store or a ticket reference is ambiguous.

Resolve at least two distinct tickets from the user's references or selection. Read their full descriptions, comments, current parents, statuses, and blocker relations. Read the store's domain docs and inspect the relevant parts of the codebase. If a ticket is missing or the tickets do not share a coherent outcome, ask the user to resolve the input before publishing.

## 2. Discuss the shared decisions

Explain the common outcome, what each ticket already covers, and where separate implementations could diverge. Look for shared interfaces, conventions, configuration, and gaps in integration or verification. Bring up decisions that materially affect implementation, with a recommendation grounded in the repo. Carry forward decisions already settled in the conversation.

State what each existing ticket will deliver and which shared choices the spec needs to settle before agents start. Add a ticket to the proposal only when agreed work is missing and deserves a verifiable slice of its own, such as a prerequisite or integration step too large to fit an existing ticket. Propose changes to existing descriptions or acceptance criteria where the agreed plan affects them.

For each ticket, show what it delivers and which tickets must finish before it can start. Give the reason for each proposed blocker change. A decision recorded in the spec can let related tickets run in parallel. Add a blocker only when the other ticket must deliver something first. Account for existing blockers, including external ones, and check the resulting graph for cycles. Preserve existing dependencies unless the user approves a change. A ticket can have zero blockers and still need triage. Use its current status when discussing readiness.

Propose test seams that cover the shared outcome, using the highest existing seam that can observe it. Confirm the decisions, test seams, ticket changes, and blocker plan together before publishing. Include any reparenting from another spec or local file moves in that review. Resolve any material changes before writing. When the user asks to discuss or draft only, finish with the proposal.

## 3. Write and publish

Use the template in the **Write** section of [to-spec](../to-spec/SKILL.md). Put the shared contract and responsibility boundaries in **Implementation Decisions**. In **Further Notes**, link the tickets under the spec and summarize what can run in parallel, what must wait, and what each external blocker gates. Use final ticket links once known. Keep the spec usable with the normal `implement-spec` workflow.

Check for a spec with the same title or slug before writing. Reuse or update it only with the user's approval. Publish the spec, attach the original tickets using the store's normal structure, create only the approved additions, and apply the approved blockers. Preserve existing ticket identity, history, status, and unrelated fields. The spec itself is their parent. Record execution blockers between tickets.

Read back the spec, ticket membership, and blocker relations. If a write fails or its outcome is unclear, check the store before retrying so the spec and tickets are created only once. Stop if recovery would change the approved plan. Report the spec link or path, which tickets were attached or created, what can start in parallel given current statuses and blockers, and any writes still pending or unverified.
