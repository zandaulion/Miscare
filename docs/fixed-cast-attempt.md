# Fixed-cast artwork attempt

Date: 2026-09-25

## Decision

Keep the current exercise artwork. An attempt to redraw all 45 exercises with a
fixed cast of three people and one shared room produced animations that were
worse than the ones in place, and was abandoned. Nothing it produced was
promoted into `web/images/exercises/`.

Do not repeat it in the same form. The reasons are below, with what a future
attempt would have to do differently.

## What was tried

The catalogue shows several different people across exercises (versions of a
curly-haired woman, a bearded man, an older man) and rooms that vary from sparse
to furnished. The aim was one recurring cast and one room across the catalogue:

- Three characters taken from existing artwork: a woman (from
  `reverse_lunges`), the bearded man in the navy sweater (from `wall_pushups`),
  and the older, heavier man (from `dumbbell_goblet_squat`), 15 exercises each,
  with the older man present at every level, not only the gentle ones.
- One room: the sparse room of the `wall_pushups` style reference.
- Each exercise's approved 2x2 source grid was given to an image model together
  with a character reference sheet and the room reference, with instructions to
  keep every pose and change only the person and the room. The results went
  through `build_pose_grid_animation.py` with each exercise's existing sequence
  and timing.

Two routes were compared on three exercises first. A hosted image model
(Gemini image generation) beat an open image-edit model run on a rented GPU
(Qwen-Image-Edit-2511): the open model swapped the person but kept the old room
every time, and took about 20 times longer per image. The hosted route was then
run across all 45, two variants each, with a pre-screen of every variant against
its source grid.

## Why it failed

Of the 32 exercises reviewed in motion, 2 were acceptable and 30 needed redoing.
The dominant failure was not the pose. It was registration: **the four panels
were not drawn over one identical background.** Played as an animation, that
shows as:

- the room shaking or changing between frames: plants, rug orientation, a corner
  becoming a straight wall, books appearing on the shelf;
- the person or the equipment changing size, or the camera zooming in and out;
- clothing details changing mid-movement (shoes appearing and disappearing).

There were also outright errors: a body passing through the pull-up bar, a table
half inside the wall, a leg disappearing, and movements that no longer matched
the named exercise (crunches, diamond push-ups).

The current artwork does not have these problems because it was produced
through repeated review and correction passes per exercise (the
`prompt-correction-*.txt` files in the catalogue pipeline), until every fixed
object stayed at the same coordinates across the four frames. Redrawing a whole
grid in one pass discards that work. A still-image pre-screen does not catch
it either: the drift is a few pixels per frame and only becomes visible when the
frames play in sequence.

## If this is attempted again

- Keep the background fixed by construction rather than by instruction. For
  example, generate only the person against a plain background and composite
  them onto one shared room image, so the room cannot move between frames.
- Review every candidate as an animation, not as a still grid.
- Budget for several correction rounds per exercise, as the original catalogue
  needed. A single pass across 45 exercises does not reach the current quality.
- Always request a square output (`imageConfig.aspectRatio: "1:1"`): without it
  about one output in six came back as a 1376x768 landscape image.
- Put each exercise's written pose descriptions from `specs.json` into the
  prompt. Showing the approved grid alone was not enough to stop pose drift;
  describing each panel's phase in words fixed the cases that failed repeatedly.

The attempt cost about $8 in image generation and GPU time.
