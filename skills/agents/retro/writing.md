# Writing for agents

One set of rules for any document an agent consumes: a skill, a host file, a doc reached by a pointer. Cursor, Codex, and Claude Code differ in which file they load. The prose rules do not change. Do not keep a second copy of the same guidance for a second host.

## Hosts

| Host | Always-loaded project file | Global file it loads by itself | Scoped rules |
| --- | --- | --- | --- |
| Cursor | `AGENTS.md` | none. `~/.cursor/rules/*.mdc` are the global rules | `.cursor/rules/*.mdc` |
| Codex | `AGENTS.md` | `~/.codex/AGENTS.md` | |
| Claude Code | `CLAUDE.md` | `~/.claude/CLAUDE.md` | |

One project `AGENTS.md` is enough for Cursor and Codex. Claude Code does not read that filename; it reads `CLAUDE.md`. Keep one source file and link it to the filename that host loads. Do not write a second copy of the same guidance.

This repo keeps that source at `rules/AGENTS.md`. Cursor still needs `rules/cursor/read-agents-md.mdc`, because a user-level `AGENTS.md` is not on Cursor's auto-load list. Add a `.cursor/rules` file only for a rule scoped to certain files, or for a global Cursor rule that has to be a `.mdc`. When the session host is unclear, ask which host the change is for before choosing the file.

When the document you are writing is a skill, also read Skill mechanics below.

## Context pointers

A **context pointer** is a reference held in the agent's context that names some out-of-context material and encodes the condition for reaching it. A skill's description is one; a line in the host file naming a doc is the same object. The pointer's wording, not its target, decides when the agent reaches the material. A must-have target behind a weakly worded pointer is a variance bug: sharpen the wording first, and inline the material only if sharpening fails.

A pointer does two jobs: state what the material is, and list the **branches** that should trigger reaching it. A branch is a distinct case the document handles. Every word of an always-loaded pointer costs on every turn:

- Front-load the leading word. That is where the pointer does its triggering.
- One trigger per branch. Synonyms that rename a single branch are one branch written twice.
- Cut identity the body already carries.

## The two loads

- **Context load** is the cost of always-loaded material: a host-file line, a skill description, anything sitting in context every turn.
- **Cognitive load** is the cost on the human: which documents exist and when to reach for each. The human is the index. Spend it where human judgement matters.

Material reached only through a pointer escapes context load at the price of the pointer's own line.

## Information hierarchy

A document is **steps** (ordered actions) and **reference** (definitions, rules, facts consulted on demand). Rank each piece by how immediately the agent needs it:

1. **In-file step**: what the agent does, in order.
2. **In-file reference**: consulted on demand. A flat peer-set of rules is a fine arrangement.
3. **Disclosed reference**: a separate file, loaded only when a pointer fires.

Inline what every branch needs. Push behind a pointer what only some branches reach.

**Co-location**: keep a concept's definition, rules, and caveats under one heading.

**Sprawl**: a document too long, even when every line is live. Disclose reference behind pointers, and split by branch or sequence so each path carries only what it needs.

## Steps and completion criteria

Every step ends on a **completion criterion**, the condition that tells the agent the work is done.

- **Clarity**: the agent can tell done from not-done. A vague bound invites ending the step early. Sharpen the bound first.
- **Demand**: how much it requires. "Every modified model accounted for" forces thorough work where "produce a change list" does not.

The strongest criteria are both checkable and exhaustive.

## When to split

Split only when the cut earns its cost:

- **By sequence**: split a run of steps where the later steps tempt the agent to rush the one in front.
- **By invocation**: see Skill mechanics.

## Leading words

A **leading word** is a compact concept already living in the model's pretraining that the agent thinks with while running the document. Repeat it as a token, never as a sentence. Reach for an existing word before coining one.

State the target behaviour. A prohibition drags the forbidden behaviour into context. A ban earns its place only as a hard guardrail you cannot phrase positively, and even then pair it with the positive target.

## Pruning

- One meaning, one place. Duplication costs maintenance and inflates a meaning's rank.
- The environment (`package.json` scripts, config, the directory layout, `--help`) is a source of truth. A document that restates it is a cache. Cache the unwritten convention, the reason, the gotcha. Leave one-command lookups to the environment.
- Delete a line that does not change behaviour versus the model's default. Delete the whole sentence.

## Skill mechanics

### Invocation

- A **model-invoked** skill keeps a `description`, so the agent can fire it, and other skills can reach it. The human can still type its name. Omit `disable-model-invocation`. In `agents/openai.yaml`, set `allow_implicit_invocation: true`.
- A **user-invoked** skill is reached only by the human typing its name. Set `disable-model-invocation: true`. The description is a one-line summary for the human. In `agents/openai.yaml`, set `allow_implicit_invocation: false`. Another skill cannot call it.

Pick model-invocation when the agent must reach the skill on its own, or another skill must. Otherwise make it user-invoked.

Shared reference that two user-invoked skills both need cannot live in either skill: with no description, neither can fire the other. Put it in a plain markdown file beside them, and point at that file.

### Router skills

When user-invoked skills multiply past what you can remember, one user-invoked router names the others and when to reach for each. It can only hint. It cannot fire a user-invoked skill.
