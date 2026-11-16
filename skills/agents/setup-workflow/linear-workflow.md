# Workflow

This Linear project is the store for the repo. Glossary, decisions, specs, and tickets live here.

- **Team**: {{TEAM_NAME}} (`{{TEAM_KEY}}`)
- **Project**: {{PROJECT_NAME}} (`{{PROJECT_ID}}`)
- **Project URL**: {{PROJECT_URL}}

Find this store later by listing projects for the team and opening the project named {{PROJECT_NAME}}, then reading the documents titled `Workflow`, `Glossary`, and `Decisions`.

## Domain docs

Before exploring the codebase, read `Glossary` and the decisions in `Decisions` that touch the area. Use the glossary's terms in issue titles and in anything else that names a domain concept. When an output contradicts a decision, say so in that output.

Single project, one glossary, one decisions document. Terms and decisions are added when they are actually resolved.

## Where specs and tickets go

A **spec** is one issue in this project. The issue body is the spec. State `{{STATUS_PUBLISH}}`. Label `ready-for-agent`.

A **ticket** is a sub-issue of that spec (`parentId` is the spec). Publish blockers first, then the tickets they block, and set `blockedBy` to the blocking issue identifiers. State `{{STATUS_PUBLISH}}`. Label `ready-for-agent`.

## Issue operations

Use the Linear MCP. Read the tool schema before calling.

- **Create an issue**: `save_issue` with `team` `{{TEAM_NAME}}`, `project` `{{PROJECT_ID}}`, `title`, `description`.
- **Read an issue**: `get_issue`. Comments via `list_comments` with `issueId`.
- **List issues**: `list_issues` with `team` `{{TEAM_NAME}}` and `project` `{{PROJECT_ID}}`.
- **Comment**: `save_comment` with `issueId`.
- **Labels**: `save_issue` `addLabels` / `removeLabels`.
- **Parent**: `save_issue` `parentId`.
- **Blocking**: `save_issue` `blockedBy`. A ticket is unblocked when every blocking issue is `{{STATUS_RESOLVE}}`.

## Status

| Move | Status |
| --- | --- |
| Publish a spec or ticket | `{{STATUS_PUBLISH}}` |
| Start work | `{{STATUS_START}}` |
| Ready for review | `{{STATUS_REVIEW}}` |
| Resolve | `{{STATUS_RESOLVE}}` |
| Cancel | `{{STATUS_CANCEL}}` |
| Duplicate | `{{STATUS_DUPLICATE}}` |

Set the status with `save_issue` `state`.

## Triage labels

| Role | Label |
| --- | --- |
| needs-triage | `needs-triage` |
| needs-info | `needs-info` |
| ready-for-agent | `ready-for-agent` |
| ready-for-human | `ready-for-human` |
| wontfix | `wontfix` |
| bug | `{{LABEL_BUG}}` |
| enhancement | `{{LABEL_ENHANCEMENT}}` |

An issue carries one category label and one state label. The workflow status column above is separate from these labels.
