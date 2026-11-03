#!/usr/bin/env python3
"""Install this repository's skills using links, or copies with --copy."""

import argparse
from datetime import datetime
import os
from pathlib import Path
import shutil
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--replace", action="store_true",
        help="Back up existing skills before replacing them.",
    )
    parser.add_argument(
        "--copy", action="store_true",
        help="Copy folders instead of linking them (for Windows without symlink access).",
    )
    args = parser.parse_args()
    repo = Path(__file__).resolve().parent
    codex_home = Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex"))).expanduser()
    locations = (
        (repo / "skills" / "agents", Path.home() / ".agents" / "skills"),
        (repo / "skills" / "codex", codex_home / "skills"),
    )
    plan = []
    for source_root, target_root in locations:
        for manifest in sorted(source_root.glob("*/SKILL.md")):
            source = manifest.parent
            target = target_root / source.name
            if target.is_symlink() and target.resolve() == source:
                continue
            plan.append((source, target))

    conflicts = [target for _, target in plan if target.exists() or target.is_symlink()]
    if conflicts and not args.replace:
        print("Existing skills found. No changes made:", file=sys.stderr)
        for target in conflicts:
            print(f"  {target}", file=sys.stderr)
        print("Run again with --replace to back them up and install this version.", file=sys.stderr)
        return 1

    stamp = datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    backups = set()
    for source, target in plan:
        target.parent.mkdir(parents=True, exist_ok=True)
        backup = None
        if target.exists() or target.is_symlink():
            backup = target.parent.parent / f"skills-backup-{stamp}" / target.name
            backup.parent.mkdir(parents=True, exist_ok=True)
            target.rename(backup)
            backups.add(backup.parent)
        try:
            if args.copy:
                shutil.copytree(source, target)
            else:
                target.symlink_to(source, target_is_directory=True)
        except (OSError, NotImplementedError) as error:
            if target.is_symlink():
                target.unlink()
            elif target.is_dir():
                shutil.rmtree(target)
            if backup is not None:
                backup.rename(target)
            print(f"Could not install {source.name}: {error}", file=sys.stderr)
            if not args.copy:
                print("If symlinks are unavailable, run again with --copy.", file=sys.stderr)
            return 1

    method = "copied" if args.copy else "linked"
    print(f"Installed {len(plan)} skills ({method}). Existing correct links were kept.")
    for backup_root in sorted(backups):
        print(f"Previous skills saved in: {backup_root}")
    runtime = repo / "skills" / "codex" / "batchprompt-device-images" / "runtime"
    if not (runtime / "node_modules").is_dir():
        print(f"Image generation also needs Node.js/npm. Run npm ci in: {runtime}")
        if args.copy:
            print("Then rerun this installer with --copy --replace to include those packages.")
    print("Image compression also needs Node.js, ImageMagick, and pngquant.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
