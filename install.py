#!/usr/bin/env python3
"""Install this repository's skills and rules using links, or copies with --copy."""

import argparse
from datetime import datetime
import os
from pathlib import Path
import shutil
import sys


def backup_path(kind, target, stamp):
    if kind == "skill" or target.parent.name == "rules":
        root = target.parent.parent
    else:
        root = target.parent
    label = "skills" if kind == "skill" else "rules"
    return root / f"{label}-backup-{stamp}" / target.name


def place(source, target, copy, directory):
    if copy:
        if directory:
            shutil.copytree(source, target)
        else:
            shutil.copy2(source, target)
        return
    if directory:
        target.symlink_to(source, target_is_directory=True)
    else:
        target.symlink_to(source)


def remove_installed(target):
    if target.is_symlink() or target.is_file():
        target.unlink()
    elif target.is_dir():
        shutil.rmtree(target)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--replace", action="store_true",
        help="Back up existing skills and rules before replacing them.",
    )
    parser.add_argument(
        "--copy", action="store_true",
        help="Copy folders and files instead of linking them (for Windows without symlink access).",
    )
    args = parser.parse_args()
    repo = Path(__file__).resolve().parent
    home = Path.home()
    codex_home = Path(os.environ.get("CODEX_HOME", str(home / ".codex"))).expanduser()
    host_paths = (
        ("cursor", home / ".cursor"),
        ("codex", codex_home),
        ("claude", home / ".claude"),
    )
    present = []
    skipped = []
    for name, path in host_paths:
        if path.is_dir():
            present.append((name, path))
        else:
            skipped.append((name, path))
    present_names = {name for name, _ in present}
    if present:
        detected = ", ".join(f"{name} ({path})" for name, path in present)
    else:
        detected = "none"
    print(f"Detected hosts: {detected}")
    for name, path in skipped:
        print(f"Skipped {name}: {path} is not a directory")

    plan = []
    mention_image = "codex" in present_names and (
        repo / "skills" / "codex" / "image-compression" / "SKILL.md"
    ).is_file()

    def consider(kind, source, target):
        source = source.resolve()
        if target.is_symlink() and target.resolve() == source:
            return
        plan.append((kind, source, target))

    if "cursor" in present_names or "codex" in present_names:
        source_root = repo / "skills" / "agents"
        target_root = home / ".agents" / "skills"
        for manifest in sorted(source_root.glob("*/SKILL.md")):
            source = manifest.parent
            consider("skill", source, target_root / source.name)

    if "codex" in present_names:
        source_root = repo / "skills" / "codex"
        target_root = codex_home / "skills"
        for manifest in sorted(source_root.glob("*/SKILL.md")):
            source = manifest.parent
            consider("skill", source, target_root / source.name)

    agents_md = repo / "rules" / "AGENTS.md"
    if agents_md.is_file():
        if "cursor" in present_names:
            consider("rule", agents_md, home / ".cursor" / "AGENTS.md")
        if "codex" in present_names:
            consider("rule", agents_md, codex_home / "AGENTS.md")
        if "claude" in present_names:
            consider("rule", agents_md, home / ".claude" / "CLAUDE.md")

    if "cursor" in present_names:
        for source in sorted((repo / "rules" / "cursor").glob("*.mdc")):
            consider("rule", source, home / ".cursor" / "rules" / source.name)

    conflicts = [target for _, _, target in plan if target.exists() or target.is_symlink()]
    if conflicts and not args.replace:
        print("Existing skills or rules found. No changes made:", file=sys.stderr)
        for target in conflicts:
            print(f"  {target}", file=sys.stderr)
        print("Run again with --replace to back them up and install this version.", file=sys.stderr)
        return 1

    stamp = datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    backups = set()
    for kind, source, target in plan:
        target.parent.mkdir(parents=True, exist_ok=True)
        backup = None
        if target.exists() or target.is_symlink():
            backup = backup_path(kind, target, stamp)
            backup.parent.mkdir(parents=True, exist_ok=True)
            target.rename(backup)
            backups.add(backup.parent)
        try:
            place(source, target, args.copy, kind == "skill")
        except (OSError, NotImplementedError) as error:
            remove_installed(target)
            if backup is not None:
                backup.rename(target)
            print(f"Could not install {target}: {error}", file=sys.stderr)
            if not args.copy:
                print("If symlinks are unavailable, run again with --copy.", file=sys.stderr)
            return 1

    skill_count = sum(1 for kind, _, _ in plan if kind == "skill")
    rule_count = sum(1 for kind, _, _ in plan if kind == "rule")
    method = "copied" if args.copy else "linked"
    print(
        f"Installed {skill_count} skills and {rule_count} rule files ({method}). "
        "Existing correct links were kept."
    )
    for backup_root in sorted(backups):
        print(f"Previous files saved in: {backup_root}")
    if mention_image:
        print("Image compression also needs Node.js, ImageMagick (magick), and pngquant.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
