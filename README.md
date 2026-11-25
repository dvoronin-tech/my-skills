# My skills

Personal agent skills for Cursor and Codex. Engineering skills descend from
[Matt Pocock's collection](https://github.com/mattpocock/skills).

The installer links skills and rules only for agent hosts whose home is already a directory. It prints each host it finds. When a known home is absent, it prints that the host was skipped.

- `cursor` — `~/.cursor`
- `codex` — `$CODEX_HOME`, or `~/.codex` when `CODEX_HOME` is unset
- `claude` — `~/.claude`

`~/.agents` is the shared skill home. The installer creates it when shared skills are installed. Host homes are used only when they already exist.

| Repository path | Installed path | Hosts |
| --- | --- | --- |
| `skills/agents/<name>` | `~/.agents/skills/<name>` | Cursor or Codex |
| `skills/codex/<name>` | `$CODEX_HOME/skills/<name>` (`~/.codex/skills/<name>` by default) | Codex |
| `rules/AGENTS.md` | `~/.cursor/AGENTS.md` | Cursor |
| `rules/cursor/*.mdc` | `~/.cursor/rules/<filename>` | Cursor |
| `rules/AGENTS.md` | `$CODEX_HOME/AGENTS.md` (`~/.codex/AGENTS.md` by default) | Codex |
| `rules/AGENTS.md` | `~/.claude/CLAUDE.md` | Claude |

`rules/AGENTS.md` is one file. Codex loads `$CODEX_HOME/AGENTS.md`. Claude loads those same bytes from `~/.claude/CLAUDE.md`. Cursor loads `~/.cursor/rules` on its own. `rules/cursor/read-agents-md.mdc` tells Cursor to read `~/.cursor/AGENTS.md` as well.

## Skills

`skills/agents/`:

- `code-review`
- `domain-modeling`
- `grill-me` — the interview. `/grill-with-docs` calls it together with `domain-modeling`
- `grill-with-docs`
- `handoff`
- `implement`
- `implement-spec`
- `prototype`
- `retro` — writing rules for Cursor, Codex, and Claude Code are in `retro/writing.md`
- `setup-workflow`
- `tdd` — module vocabulary is in `tdd/codebase-design.md`
- `tickets-to-spec`
- `to-spec`
- `to-tickets`

`skills/codex/`:

- `image-compression`

`setup-workflow` writes triage roles from `setup-workflow/triage-labels.md`. There is no separate triage skill.

Host rules live in `rules/`.

## Install

You need Git and Python 3.

```sh
git clone git@github.com:dvoronin-tech/my-skills.git
cd my-skills
python3 install.py
```

By default, each installed skill folder and rule file is a symlink to this checkout. Keep the checkout on disk. Edit skills and rules here, commit, and push to save your changes. Running the installer again keeps links that already point to this checkout.

If an existing skill or rule would be replaced, the installer stops before making any change. To keep those versions in dated backup folders and install this collection:

```sh
python3 install.py --replace
```

Skill backups are stored beside the relevant `skills/` folder, as `skills-backup-<date-and-time>/<skill-name>`. Rule backups use that same timestamp. Cursor's `AGENTS.md` and `*.mdc` files go to `~/.cursor/rules-backup-<date-and-time>/`. Codex's `AGENTS.md` goes to `$CODEX_HOME/rules-backup-<date-and-time>/`. Claude's `CLAUDE.md` goes to `~/.claude/rules-backup-<date-and-time>/`. Backups are local and are not pushed to GitHub.

On Windows, use `python install.py --copy` if symlinks are unavailable. WSL can use the normal commands above. `--copy` copies skill folders and rule files. Copy installations need `--copy --replace` again after pulling updates.

## Image compression

`image-compression` needs Node.js, ImageMagick (`magick`), and `pngquant` on `PATH`.

```sh
brew install imagemagick pngquant
```

## Update another computer

```sh
git pull --ff-only
python3 install.py
```

Existing symlinks see edited files immediately. Rerunning the installer also links newly added skills and rules. Use `--copy --replace` instead for copy installations.
