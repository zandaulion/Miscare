#!/usr/bin/env python3
"""Create repeatable per-exercise prompt, manifest, and preview files."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "experiments/catalogue-pipeline/specs.json"
OUT_ROOT = ROOT / "experiments/catalogue-pipeline"

COMMON = """Use case: scientific-educational
Asset type: registered four-keyframe source sprite sheet for a mobile exercise animation
Input images: Image 1 is the exercise's original character and app-style reference. Image 2 is the approved layout, registration, palette, texture, and sparse cozy-room reference.
Primary request: Create a precise four-pose {exercise_id} sequence with the same approachable adult from Image 1, rendered directly in the registered lo-fi cozy style of Image 2.
Composition/framing: one square image divided into a strict 2 by 2 grid of four equal square panels with thin plain dividers. Reading order is top-left, top-right, bottom-left, bottom-right. Use {view}. Show the complete person, all contact points, and all required equipment without cropping.
Scene/backdrop: {setup} Use the exact same sparse cozy room in every panel: warm cream wall, light wooden floor, muted woven rug, at most one potted plant and one narrow shelf far from the movement path. Every fixed object, background mark, shadow, camera, and crop must occupy identical coordinates in all four panels.
Style/medium: warm hand-drawn editorial cartoon, subtle paper grain, lightly imperfect ink outlines, soft flat shading, muted cream, sage, dusty terracotta, warm wood, charcoal gray, and faded navy. Friendly understated lo-fi finish matching Mișcare.
Character continuity: the exact same person in every panel, with unchanged face, hair, body proportions, clothing, scale, and viewpoint.
Movement:
1. Top-left — {pose0}
2. Top-right — {pose1}
3. Bottom-left — {pose2}
4. Bottom-right — {pose3}
Biomechanical and object invariants: {invariants}
Constraints: one clean opaque person per panel. Identical character, equipment, room, scale, camera, and background in all four panels. No text, labels, numbers, arrows, logos, watermark, motion blur, ghosts, transparent figures, extra limbs, fused limbs, duplicated hands or feet, double exposure, changing objects, or changing clothing. Exactly two anatomically plausible arms, hands, legs, and feet in every panel.
"""


def prompt_for(exercise_id: str, spec: dict) -> str:
    poses = spec["poses"]
    if len(poses) != 4:
        raise ValueError(f"{exercise_id}: expected exactly four poses")
    return COMMON.format(
        exercise_id=exercise_id.replace("_", " "),
        view=spec["view"],
        setup=spec["setup"],
        pose0=poses[0],
        pose1=poses[1],
        pose2=poses[2],
        pose3=poses[3],
        invariants=spec["invariants"],
    )


def scaffold(exercise_id: str, spec: dict) -> None:
    directory = OUT_ROOT / exercise_id
    directory.mkdir(parents=True, exist_ok=True)
    (directory / "prompt.txt").write_text(prompt_for(exercise_id, spec), encoding="utf-8")

    sequence = spec.get("sequence", [0, 1, 2, 3, 2, 1])
    durations = spec.get("durations_ms", [650, 280, 280, 650, 280, 280])
    labels = ["Start", "Phase 2", "Phase 3", "Finish"]
    crops = [[0, 0, 625, 625], [630, 0, 1254, 625], [0, 630, 625, 1254], [630, 630, 1254, 1254]]
    manifest = {
        "schema_version": 1,
        "exercise_id": exercise_id,
        "source_grid": "source-grid.png",
        "frames": [
            {"id": f"phase-{i + 1}", "label": labels[i], "crop": crops[i]}
            for i in range(4)
        ],
        "sequence": sequence,
        "durations_ms": durations,
        "output": {
            "directory": "output",
            "frame_size": [512, 512],
            "poster_frame": int(spec.get("poster_frame", 0)),
            "webp_quality": 82,
        },
        "semantic_review": {"must_pass": [spec["invariants"]]},
    }
    (directory / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    current = f"../../../web/images/exercises/{exercise_id}.webp"
    preview = f"""<!doctype html>
<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">
<title>{exercise_id} comparison</title><style>
body{{margin:0;background:#f5efe3;color:#1b1d17;font:16px/1.5 system-ui,sans-serif}}main{{width:min(1080px,calc(100% - 32px));margin:28px auto}}
.grid{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}}figure{{margin:0;padding:14px;background:#fffaf1;border:1px solid #d8d0c1;border-radius:16px}}img{{display:block;width:100%;border-radius:10px}}strong,span{{display:block}}span{{color:#686b62}}.sheet{{margin-top:18px}}@media(max-width:720px){{.grid{{grid-template-columns:1fr}}}}
</style></head><body><main><h1>{exercise_id.replace('_', ' ')}</h1><p>Current blended asset versus the registered four-pose candidate.</p><div class=\"grid\">
<figure><img src=\"{current}\" alt=\"Current animation\"><figcaption><strong>Current</strong><span>Blended endpoints</span></figcaption></figure>
<figure><img src=\"output/animation.webp\" alt=\"Candidate animation\"><figcaption><strong>Candidate</strong><span>Four explicit reviewed poses</span></figcaption></figure>
</div><figure class=\"sheet\"><img src=\"output/review-sheet.jpg\" alt=\"Pose review sheet\"><figcaption><strong>Review sheet</strong></figcaption></figure>
</main></body></html>"""
    (directory / "preview.html").write_text(preview, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("exercise_ids", nargs="*")
    args = parser.parse_args()
    data = json.loads(CONFIG.read_text(encoding="utf-8"))
    specs = data["exercises"]
    selected = args.exercise_ids or list(specs)
    for exercise_id in selected:
        if exercise_id not in specs:
            raise SystemExit(f"unknown exercise: {exercise_id}")
        scaffold(exercise_id, specs[exercise_id])
        print(exercise_id)


if __name__ == "__main__":
    main()
