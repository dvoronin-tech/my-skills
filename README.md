# My skills

My local, edited collection of 42 personal agent skills, including skills from
[Matt Pocock's collection](https://github.com/mattpocock/skills).
The upstream MIT notice is preserved in [LICENSE.mattpocock](LICENSE.mattpocock).

The complete skill folders are included: instructions, references, scripts,
metadata, and runtime assets. Built-in Codex skills and plugin-managed skills
are installed through Codex and their plugins separately.

## Install

You need Git, Python 3, and SSH access to this GitHub repository.

```sh
git clone git@github.com:dvoronin-tech/my-skills.git
cd my-skills
python3 install.py
```

The installer keeps the original locations:

| Repository folder | Installation folder |
| --- | --- |
| `skills/agents/` | `~/.agents/skills/` |
| `skills/codex/` | `$CODEX_HOME/skills/`, or `~/.codex/skills/` by default |

By default, each installed folder is a symlink to this checkout. Keep the
checkout on disk. Edit skills here, commit, and push to save your changes.
Running the installer again keeps links that already point to this checkout.
Restart Codex if newly installed skills do not appear.

If existing skills would be replaced, the installer stops before making changes.
To keep those versions in dated backup folders and install this collection:

```sh
python3 install.py --replace
```

Backups are stored beside the relevant `skills/` folder, as
`skills-backup-<date-and-time>/`. They are local and are not pushed to GitHub.

On Windows, use Python 3 with `python install.py --copy` if symlinks are
unavailable. WSL can use the normal commands above. Copy installations need
`--copy --replace` again after pulling updates.

## Image tools

Instruction-only skills need no extra packages. The image skills need additional
tools on each computer:

- `batchprompt-device-images` and `english-device-page-assets`: Node.js 20+,
  npm, and ImageMagick (`magick`). Install the bundled runtime's locked
  dependencies from this checkout:

  ```sh
  npm --prefix skills/codex/batchprompt-device-images/runtime ci
  ```

- `image-compression`: Node.js, ImageMagick (`magick`), and `pngquant` on `PATH`.

Installed npm packages are excluded from Git so each computer gets the correct
platform binaries. With `--copy`, prepare the runtime before running the installer,
or run it again with `--copy --replace` after installing the packages.
The image generator uses Unix shell commands; on Windows, run it in WSL.

Some skills are specific to a project or agent tool, such as Butlerapp asset
generation or Claude Code hooks. Their original requirements still apply.

## Update another computer

```sh
git pull --ff-only
python3 install.py
```

Existing symlinks see edited files immediately. Rerunning the installer also
links newly added skills. If the image runtime's lockfile changes, run its
`npm ci` command again. Use `--copy --replace` instead for copy installations.
