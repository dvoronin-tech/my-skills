---
name: tdd
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests. Test names use the project glossary from the configured store, local docs or Linear.
---

# Test-Driven Development

TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of the loop. Every section applies on every cycle: consult them before and during the loop, not after.

## Domain language

Test names use the glossary's terms. Name a decision that conflicts with the test before writing it.

When the caller already chose Linear or Local docs this run, use that store. Otherwise:

Local docs is configured when `docs/agents/issue-tracker.md` exists.

Linear is configured when the Linear project named after this repo's directory has a document titled `Workflow`. `list_teams`, then `list_projects`, then `list_documents` with that project's id. Read each tool schema before calling. A failed or unauthenticated call means Linear is unavailable.

| What you found | Do |
| --- | --- |
| Local file only | Read [local.md](local.md) and follow it. |
| `Workflow` only | Read [linear.md](linear.md) and follow it. |
| Both | Ask which store with AskQuestion. Options: Linear, Local docs. Then follow that file. |
| Neither | Use the words already in the code. |

Read the store file before the first test. A missing glossary is fine: continue.

Done when the terms in the test names are the glossary's, or the glossary is missing.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam. You can't test everything, so agreeing the seams up front is how testing effort lands on the critical paths and complex logic instead of every edge case.

Ask: "What's the public interface, and which seams should we test?" Give each proposed seam a one-line note on what it catches and what it misses.

When the shape of that interface is itself in question (how deep the module is, where the seam belongs, what the interface should expose), read [codebase-design.md](codebase-design.md). It is the vocabulary for module, interface, depth, seam, adapter, leverage, and locality. Consult it. Run a design session from that file only when the user asks to explore the interface.

## Anti-patterns

- **Implementation-coupled**: mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological**: the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth: a known-good literal, a worked example, the spec.
- **Horizontal slicing**: writing all tests first, then all implementation. Bulk tests verify _imagined_ behavior: you test the _shape_ of things rather than user-facing behavior, the tests go insensitive to real changes, and you commit to test structure before understanding the implementation. Work in **vertical slices** instead: one test → one implementation → repeat, each test a **tracer bullet** that responds to what the last cycle taught you.

## Rules of the loop

- **Red before green.** Write the failing test first, then only enough code to pass it. Don't anticipate future tests or add speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Refactoring is not part of the loop.** It belongs to the review stage (see the `code-review` skill), not the red → green implementation cycle.
