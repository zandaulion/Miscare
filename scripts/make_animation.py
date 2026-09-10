#!/usr/bin/env python3
"""
Script to create smooth looping animated WebP and GIF from exercise keyframes.
Interpolates between keyframes with realistic exercise tempo.
"""

import os
import sys
from PIL import Image

def create_exercise_animation(
    keyframes,
    output_webp,
    output_gif=None,
    size=(512, 512),
    transition_steps=3,
    step_duration_ms=90,
    hold_extremes_ms=(500, 450),
    webp_quality=80
):
    """
    keyframes: list of PIL Images or file paths in forward order:
      e.g. [start_pose, peak_pose] or [start_pose, mid_pose, bottom_pose]
    The script builds a full cycle:
      start -> (transitions) -> peak/bottom -> (transitions) -> start
    """
    loaded = []
    for k in keyframes:
        if isinstance(k, str):
            im = Image.open(k).convert('RGB')
        else:
            im = k.convert('RGB')
        if im.size != size:
            im = im.resize(size, Image.Resampling.LANCZOS)
        loaded.append(im)

    if len(loaded) < 2:
        raise ValueError("At least 2 keyframes required for animation")

    frames = []
    durations = []

    def add_tween(im_a, im_b, steps, dur):
        for i in range(steps):
            alpha = (i + 1) / (steps + 1)
            frames.append(Image.blend(im_a, im_b, alpha))
            durations.append(dur)

    # Forward pass through keyframes
    for i in range(len(loaded) - 1):
        if i == 0:
            frames.append(loaded[i])
            durations.append(hold_extremes_ms[0])
        else:
            frames.append(loaded[i])
            durations.append(step_duration_ms + 30)

        add_tween(loaded[i], loaded[i+1], transition_steps, step_duration_ms)

    # Peak / Bottom hold
    frames.append(loaded[-1])
    durations.append(hold_extremes_ms[1])

    # Backward pass back to start
    for i in range(len(loaded) - 1, 0, -1):
        add_tween(loaded[i], loaded[i-1], transition_steps, step_duration_ms)
        if i > 1:
            frames.append(loaded[i-1])
            durations.append(step_duration_ms + 30)

    # Save Animated WebP
    os.makedirs(os.path.dirname(os.path.abspath(output_webp)), exist_ok=True)
    frames[0].save(
        output_webp,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        quality=webp_quality,
        method=6
    )
    print(f"Saved Animated WebP: {output_webp} ({len(frames)} frames, {os.path.getsize(output_webp)/1024:.1f} KB)")

    # Save Animated GIF if requested
    if output_gif:
        os.makedirs(os.path.dirname(os.path.abspath(output_gif)), exist_ok=True)
        frames[0].save(
            output_gif,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0,
            optimize=True
        )
        print(f"Saved Animated GIF: {output_gif} ({os.path.getsize(output_gif)/1024:.1f} KB)")

    return len(frames)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: make_animation.py <output_webp> <frame1> <frame2> [frame3...]")
        sys.exit(1)
    out_webp = sys.argv[1]
    in_frames = sys.argv[2:]
    out_gif = out_webp.rsplit('.', 1)[0] + '.gif'
    create_exercise_animation(in_frames, out_webp, output_gif=out_gif)
