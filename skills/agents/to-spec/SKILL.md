---
name: to-spec
description: Turn the current conversation into a spec and publish it to the configured store.
disable-model-invocation: true
---

# To spec

Synthesize a spec from the current conversation and the codebase, then publish it. The store was chosen by `/setup-workflow`.

The only question in a normal run is whether the test seams match. Ask anything else only when both stores are configured, or when a spec with the same name already exists.

## 1. Resolve the store

Local docs is configured when `docs/agents/issue-tracker.md` exists.

Linear is configured when the Linear project named after this repo's directory has a document titled `Workflow`. `list_teams`, then `list_projects`, then `list_documents` with that project's id. Read each tool schema before calling. A failed or unauthenticated call means Linear is unavailable.

| What you found | Do |
| --- | --- |
| Local file only | Read [local.md](local.md) and follow it for domain docs and publishing. |
| `Workflow` only | Read [linear.md](linear.md) and follow it. |
| Both | Ask which store with AskQuestion. Options: Linear, Local docs. Then follow that file. |
| Neither | Stop. Tell the user to run `/setup-workflow`. |

Done when one store is chosen.

## 2. Explore

Read the domain docs named by the store file, then explore the repo around the feature. Use the glossary's terms in the spec. When a decision conflicts with the spec, say so in the spec.

Done when you can name the current behavior this spec changes.

## 3. Seams

Sketch the seams where the feature will be tested. Prefer a seam that already exists. Use the highest seam that can see the behavior. One seam is the goal.

Ask the user with AskQuestion whether these seams match. Options: yes, adjust. On adjust, take the correction and restate the seams.

Done when the user has accepted the seams.

## 4. Write

Fill the template from the conversation, the codebase, and the accepted seams. Title the spec from the feature the conversation is about.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)
- The accepted test seams

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>

Done when every section is filled.

## 5. Publish

Follow the store file from step 1. Mark the spec `ready-for-agent`.

When a spec with the same slug or title already exists, ask with AskQuestion before replacing it. Options: replace, keep the existing one.

Done when you have told the user the spec's path or Linear URL.
