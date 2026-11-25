---
name: fix-bug
description: Fix a reported software bug and have a separate agent independently write and verify a regression test. Use when asked to repair a specific bug with regression coverage.
---

# Fix a bug with independent regression coverage

The primary agent owns the product fix and final verification. A separate subagent owns the regression test. Finish when the fix and the test are in the working tree and the test demonstrably fails before the fix and passes with it.

1. Capture the pre-fix state before editing, including existing changes relevant to reproducing the bug. Save the original report or a short brief with reproduction steps, inputs, observed behavior, and expected behavior. Reproduce the issue as far as the environment permits and implement the product fix.
2. Before final review, start a fresh test subagent without inherited conversation. Give it an isolated checkout of the pre-fix state, the bug brief, and the applicable repository instructions or their locations. Keep the product diff and the primary agent's implementation notes out of its context. Pass the isolated path explicitly and direct it to work there. Ask it to choose an existing test level that reproduces the failure through an observable interface, derive expected results from the report or product contract, and change only tests and necessary test fixtures. Have it run the focused test against the pre-fix state and return its test changes, the command, and the relevant failure. The failure must show the reported behavior. A setup, compilation, or unrelated failure is insufficient evidence.
3. Apply the independently written test to the fixed tree and run the same command. If it fails on the fixed tree, investigate the product fix first. If the test needs changes, send the test author observable failure details and let that agent revise it and recheck the pre-fix failure. Keep test expectations independent of the fix.
4. Review the fix and test together through the repository's normal review process and run the relevant checks. Report the pre-fix failure and post-fix pass, along with any verification you could not perform. If independent delegation is unavailable, surface that blocker rather than treating a self-authored test as satisfying the workflow.
