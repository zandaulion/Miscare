#!/usr/bin/env python3
"""Validate and promote the reviewed exercise animation catalogue."""

from __future__ import annotations

import argparse
import json
import os
import shutil
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / "web" / "images" / "exercises"


def catalogue_sources() -> dict[str, Path]:
    specs_path = ROOT / "experiments" / "catalogue-pipeline" / "specs.json"
    with specs_path.open(encoding="utf-8") as handle:
        ids = list(json.load(handle)["exercises"])

    sources = {
        "wall_pushups": ROOT / "experiments" / "wall-pushup-pipeline" / "output",
        "chair_sit_to_stand": ROOT / "experiments" / "chair-sit-to-stand-pipeline" / "output",
    }
    sources.update(
        {
            exercise_id: ROOT / "experiments" / "catalogue-pipeline" / exercise_id / "output"
            for exercise_id in ids
        }
    )
    return sources


def validate_image(path: Path, *, animated: bool) -> tuple[int, int]:
    if not path.is_file() or path.stat().st_size == 0:
        raise ValueError(f"missing or empty asset: {path}")
    with Image.open(path) as image:
        if image.size != (512, 512):
            raise ValueError(f"unexpected dimensions for {path}: {image.size}")
        frame_count = getattr(image, "n_frames", 1)
        if animated and frame_count < 2:
            raise ValueError(f"animation has fewer than two frames: {path}")
        if not animated and frame_count != 1:
            raise ValueError(f"poster is unexpectedly animated: {path}")
        image.seek(frame_count - 1)
        image.load()
    return path.stat().st_size, frame_count


def atomic_copy(source: Path, destination: Path) -> None:
    temporary = destination.with_suffix(destination.suffix + ".tmp")
    shutil.copyfile(source, temporary)
    os.replace(temporary, destination)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--apply",
        action="store_true",
        help="copy validated assets into web/images/exercises",
    )
    args = parser.parse_args()

    sources = catalogue_sources()
    if len(sources) != 45:
        raise ValueError(f"expected 45 exercises, found {len(sources)}")

    total_bytes = 0
    for exercise_id, directory in sources.items():
        assets = {
            ".jpg": (directory / "poster.jpg", False),
            ".webp": (directory / "animation.webp", True),
            ".gif": (directory / "animation.gif", True),
        }
        details = []
        for extension, (source, animated) in assets.items():
            size, frames = validate_image(source, animated=animated)
            total_bytes += size
            details.append(f"{extension[1:]}={size // 1024}KiB/{frames}f")
            if args.apply:
                atomic_copy(source, DESTINATION / f"{exercise_id}{extension}")
        verb = "promoted" if args.apply else "validated"
        print(f"{verb} {exercise_id}: {', '.join(details)}")

    print(f"{len(sources)} exercises, {total_bytes / (1024 * 1024):.1f} MiB total")


if __name__ == "__main__":
    main()
