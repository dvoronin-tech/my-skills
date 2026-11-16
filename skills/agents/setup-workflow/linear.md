# Linear store

Follow this after the user picks Linear in `SKILL.md`. Linear MCP tools are the whole write path. Read each tool's schema before calling it.

The completed setup is a project, three documents on it, and the triage labels. Role meanings live in [triage-labels.md](triage-labels.md). The repo working tree stays as it was, including any glossary or ADR files already there.

## 1. Team

Use the only team `list_teams` returned. When several teams exist, ask which team with AskQuestion, using the team names as options.

Done when one team is chosen.

## 2. Project

Default name: the repo directory name.

`list_projects` for that name on the chosen team.

- One match: reuse it. Tell the user the name and URL.
- None: create it with `save_project` (`name`, `setTeams` of the chosen team, `lead` `"me"`). When `git remote -v` has an origin URL, add it with `links` as `{url, title: "Repository"}`.
- Several matches: ask which project.

Done when one project is bound. Record its name, identifier, URL, and team.

## 3. Statuses and labels

`list_issue_statuses` for the team. Map workflow moves onto the names that exist:

| Move | Prefer this status |
| --- | --- |
| Publish a spec or ticket | `Todo` |
| Start work | `In Progress` |
| Ready for review | `In Review` |
| Resolve | `Done` |
| Cancel | `Canceled` |
| Duplicate | `Duplicate` |

When a preferred name is missing, ask the user which existing status fills that move. `Backlog` is not the publish status.

`list_issue_labels` for the team. Ensure these labels exist by creating each missing one with `save_issue_label` (workspace label: omit `teamId`):

| Role | Label | Color |
| --- | --- | --- |
| needs-triage | `needs-triage` | `#f2c94c` |
| needs-info | `needs-info` | `#f2994a` |
| ready-for-agent | `ready-for-agent` | `#6fcf97` |
| ready-for-human | `ready-for-human` | `#2f80ed` |
| wontfix | `wontfix` | `#828282` |

Category roles use labels already in the workspace when the name matches, otherwise these: `bug` → `Bug` (`#EB5757`), `enhancement` → `Feature` (`#BB87FC`). Create a missing category label the same way.

Done when every move has a real status name and every label above exists.

## 4. Draft the documents

Read [linear-workflow.md](linear-workflow.md). Fill every placeholder from the team, project, statuses, and labels just resolved.

Glossary content:

- `GLOSSARY.md` exists: its contents
- `GLOSSARY-MAP.md` exists: its contents, and note each per-context glossary path in the draft
- neither exists: an empty glossary whose only heading is `# Glossary` and whose body says terms are added when they are resolved

Decisions content:

- files under `docs/adr/` or `src/*/docs/adr/`: one section per file, heading from the filename, body from the file
- no ADR files: `# Decisions` and the line `ADRs are added here as headings: ADR NNNN: title.`

Show the user the filled Workflow document and the glossary and decisions plan. Let them edit the draft before any document is written.

Done when the user accepts the draft.

## 5. Write the documents

On the bound project, `list_documents` with `projectId` set to that project and match by exact title.

`save_document` with `project` set to the project:

| Title | Content |
| --- | --- |
| `Workflow` | the accepted draft |
| `Glossary` | the glossary content |
| `Decisions` | the decisions content |

A title that already exists is updated (`id` of that document). A missing title is created.

Done when all three documents exist on the project and their URLs are known. This step creates nothing in the repo.
