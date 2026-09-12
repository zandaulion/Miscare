#!/usr/bin/env python3
"""Build an honest stepped exercise animation from a reviewed pose grid.

Unlike ``make_animation.py``, this builder never blends independently generated
people together. Every displayed frame must be an explicit, reviewable pose in
the source grid.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


def load_manifest(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        manifest = json.load(handle)

    required = {"exercise_id", "source_grid", "frames", "sequence", "output"}
    missing = sorted(required.difference(manifest))
    if missing:
        raise ValueError(f"manifest is missing: {', '.join(missing)}")
    if len(manifest["sequence"]) != len(manifest.get("durations_ms", [])):
        raise ValueError("sequence and durations_ms must contain the same number of items")
    return manifest


def resolve(base: Path, value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else base / path


def font(size: int):
    for candidate in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    ):
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def crop_frames(source: Image.Image, manifest: dict, output_dir: Path) -> list[Image.Image]:
    target_size = tuple(manifest["output"].get("frame_size", [512, 512]))
    frame_dir = output_dir / "frames"
    frame_dir.mkdir(parents=True, exist_ok=True)

    frames = []
    for index, item in enumerate(manifest["frames"], start=1):
        box = tuple(item["crop"])
        if len(box) != 4 or box[0] < 0 or box[1] < 0 or box[2] > source.width or box[3] > source.height:
            raise ValueError(f"invalid crop for {item['id']}: {box}")
        if box[2] <= box[0] or box[3] <= box[1]:
            raise ValueError(f"empty crop for {item['id']}: {box}")

        frame = ImageOps.fit(source.crop(box), target_size, method=Image.Resampling.LANCZOS)
        frame.save(frame_dir / f"{index:02d}-{item['id']}.png", optimize=True)
        frames.append(frame)
    return frames


def validate_frames(frames: list[Image.Image], manifest: dict) -> None:
    ids = [item["id"] for item in manifest["frames"]]
    if len(ids) != len(set(ids)):
        raise ValueError("frame ids must be unique")
    if not frames:
        raise ValueError("at least one frame is required")
    if any(frame.size != frames[0].size for frame in frames):
        raise ValueError("all frames must have identical dimensions")
    for index in manifest["sequence"]:
        if not isinstance(index, int) or index < 0 or index >= len(frames):
            raise ValueError(f"sequence refers to missing frame index {index}")
    for duration in manifest["durations_ms"]:
        if not isinstance(duration, int) or duration < 40:
            raise ValueError(f"invalid frame duration {duration}")


def write_animation(frames: list[Image.Image], manifest: dict, output_dir: Path) -> None:
    sequence = [frames[index] for index in manifest["sequence"]]
    durations = manifest["durations_ms"]
    quality = int(manifest["output"].get("webp_quality", 82))

    sequence[0].save(
        output_dir / "animation.webp",
        save_all=True,
        append_images=sequence[1:],
        duration=durations,
        loop=0,
        quality=quality,
        method=6,
    )
    sequence[0].save(
        output_dir / "animation.gif",
        save_all=True,
        append_images=sequence[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )

    poster_index = int(manifest["output"].get("poster_frame", 0))
    frames[poster_index].save(output_dir / "poster.jpg", quality=88, optimize=True)


def write_review_sheet(frames: list[Image.Image], manifest: dict, output_dir: Path) -> None:
    cell = 300
    label_h = 42
    canvas = Image.new("RGB", (cell * len(frames), cell + label_h), "#f5efe3")
    draw = ImageDraw.Draw(canvas)
    label_font = font(18)

    for index, (frame, item) in enumerate(zip(frames, manifest["frames"])):
        preview = ImageOps.fit(frame, (cell, cell), method=Image.Resampling.LANCZOS)
        canvas.paste(preview, (index * cell, 0))
        label = f"{index + 1}. {item['label']}"
        draw.text((index * cell + 10, cell + 10), label, fill="#1b1d17", font=label_font)
    canvas.save(output_dir / "review-sheet.jpg", quality=90, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path, help="path to the pipeline JSON manifest")
    args = parser.parse_args()

    manifest_path = args.manifest.resolve()
    manifest = load_manifest(manifest_path)
    base = manifest_path.parent
    source_path = resolve(base, manifest["source_grid"])
    output_dir = resolve(base, manifest["output"].get("directory", "output"))
    output_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(source_path) as image:
        source = image.convert("RGB")
    frames = crop_frames(source, manifest, output_dir)
    validate_frames(frames, manifest)
    write_animation(frames, manifest, output_dir)
    write_review_sheet(frames, manifest, output_dir)

    print(f"built {manifest['exercise_id']}: {len(frames)} reviewed poses")
    print(f"output: {output_dir}")


if __name__ == "__main__":
    main()
