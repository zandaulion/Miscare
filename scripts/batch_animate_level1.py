#!/usr/bin/env python3
import os
import sys
import time
from generate_pose import generate_pose
from make_animation import create_exercise_animation

EXERCISES_L1 = [
    {
        'id': 'doorway_row',
        'ref': 'web/images/exercises/doorway_row.jpg',
        'keyframe': '/tmp/doorway_row_pull.png',
        'prompt': 'Modify the reference image to show the exact same woman in the exact same cozy living room, but at the FINISH / PEAK PULL position of the doorway row: she has pulled her chest all the way forward into the doorway, elbows bent and pulled back behind her ribs, pinching her shoulder blades together. Exact same character, face, clothing, doorframe, art style, colors and background.',
        'order': ['web/images/exercises/doorway_row.jpg', '/tmp/doorway_row_pull.png']
    },
    {
        'id': 'knee_pushups',
        'ref': 'web/images/exercises/knee_pushups.jpg',
        'keyframe': '/tmp/knee_pushups_top.png',
        'prompt': 'Modify the reference image to show the exact same person in the exact same cozy living room, but at the TOP / PUSHED-UP position of the knee pushup: arms pushed straight under shoulders, chest elevated, body in a clean straight diagonal line from knees to head. Exact same character, face, clothes, art style, colors and mat.',
        'order': ['/tmp/knee_pushups_top.png', 'web/images/exercises/knee_pushups.jpg']
    },
    {
        'id': 'box_squat_touch',
        'ref': 'web/images/exercises/box_squat_touch.jpg',
        'keyframe': '/tmp/box_squat_standing.png',
        'prompt': 'Modify the reference image to show the exact same woman in the exact same cozy living room, but at the STANDING upright position of the box squat: standing fully upright in front of the chair, arms relaxed at her sides, smiling happily. Exact same character, face, hair, clothing, art style, chair and background.',
        'order': ['/tmp/box_squat_standing.png', 'web/images/exercises/box_squat_touch.jpg']
    },
    {
        'id': 'wall_sit',
        'ref': 'web/images/exercises/wall_sit.jpg',
        'keyframe': '/tmp/wall_sit_stand.png',
        'prompt': 'Modify the reference image to show the exact same man in the exact same cozy living room, but STANDING upright with his back against the wall, preparing to slide down into the wall sit. Exact same character, face, clothing, wall, art style, colors and background.',
        'order': ['/tmp/wall_sit_stand.png', 'web/images/exercises/wall_sit.jpg']
    },
    {
        'id': 'prone_cobra',
        'ref': 'web/images/exercises/prone_cobra.jpg',
        'keyframe': '/tmp/prone_cobra_down.png',
        'prompt': 'Modify the reference image to show the exact same woman in the exact same cozy living room, but at the REST / STARTING position of the prone cobra: lying flat on her stomach on the mat, forehead resting near hands or arms relaxed alongside body, completely relaxed. Exact same character, clothing, art style, colors and mat.',
        'order': ['/tmp/prone_cobra_down.png', 'web/images/exercises/prone_cobra.jpg']
    },
    {
        'id': 'bird_dog_gentle',
        'ref': 'web/images/exercises/bird_dog_gentle.jpg',
        'keyframe': '/tmp/bird_dog_tabletop.png',
        'prompt': 'Modify the reference image to show the exact same person in the exact same cozy living room, but at the STARTING quad table-top position: on all fours with both hands and both knees resting squarely on the mat, back flat and neutral. Exact same character, face, clothing, art style, colors and mat.',
        'order': ['/tmp/bird_dog_tabletop.png', 'web/images/exercises/bird_dog_gentle.jpg']
    },
    {
        'id': 'deadbug_assisted',
        'ref': 'web/images/exercises/deadbug_assisted.jpg',
        'keyframe': '/tmp/deadbug_tabletop.png',
        'prompt': 'Modify the reference image to show the exact same man in the exact same cozy living room, but at the STARTING table-top position of deadbug: lying on his back, BOTH knees bent at 90 degrees up in the air, BOTH arms extended straight up towards the ceiling. Exact same character, face, clothing, art style, colors and rug.',
        'order': ['/tmp/deadbug_tabletop.png', 'web/images/exercises/deadbug_assisted.jpg']
    },
    {
        'id': 'crunches_standard',
        'ref': 'web/images/exercises/crunches_standard.jpg',
        'keyframe': '/tmp/crunches_flat.png',
        'prompt': 'Modify the reference image to show the exact same woman in the exact same cozy living room, but at the LOWERED / FLAT position of the crunch: lying comfortably flat on her back on the mat with knees bent and feet flat on the floor, head and upper back resting gently on the mat, hands at temples. Exact same character, face, clothes, art style and room.',
        'order': ['/tmp/crunches_flat.png', 'web/images/exercises/crunches_standard.jpg']
    },
    {
        'id': 'side_plank',
        'ref': 'web/images/exercises/side_plank.jpg',
        'keyframe': '/tmp/side_plank_down.png',
        'prompt': 'Modify the reference image to show the exact same man in the exact same cozy living room, but at the LOWERED / REST position of the modified side plank: supporting himself on his forearm, but with his hips resting gently down on the yoga mat. Exact same character, face, clothes, art style and room.',
        'order': ['/tmp/side_plank_down.png', 'web/images/exercises/side_plank.jpg']
    },
    {
        'id': 'dumbbell_seated_bicep_curl',
        'ref': 'web/images/exercises/dumbbell_seated_bicep_curl.jpg',
        'keyframe': '/tmp/bicep_curl_down.png',
        'prompt': 'Modify the reference image to show the exact same man in the exact same cozy living room, but with his arms fully EXTENDED DOWN at his sides holding the dumbbells next to the chair, elbows straight, before starting the curl. Exact same character, face, clothes, dumbbells, chair and art style.',
        'order': ['/tmp/bicep_curl_down.png', 'web/images/exercises/dumbbell_seated_bicep_curl.jpg']
    },
    {
        'id': 'dumbbell_seated_shoulder_press',
        'ref': 'web/images/exercises/dumbbell_seated_shoulder_press.jpg',
        'keyframe': '/tmp/shoulder_press_racked.png',
        'prompt': 'Modify the reference image to show the exact same woman in the exact same cozy living room, but at the LOWERED / RACKED position of the shoulder press: dumbbells held at shoulder level, elbows bent and slightly forward, preparing to press up. Exact same character, face, clothes, chair, dumbbells and art style.',
        'order': ['/tmp/shoulder_press_racked.png', 'web/images/exercises/dumbbell_seated_shoulder_press.jpg']
    },
    {
        'id': 'band_seated_row',
        'ref': 'web/images/exercises/band_seated_row.jpg',
        'keyframe': '/tmp/band_row_reach.png',
        'prompt': 'Modify the reference image to show the exact same man in the exact same cozy living room, but with his arms EXTENDED STRAIGHT FORWARD holding the resistance band handles towards his feet, before pulling back into the row. Exact same character, face, clothes, chair, band and art style.',
        'order': ['/tmp/band_row_reach.png', 'web/images/exercises/band_seated_row.jpg']
    },
    {
        'id': 'active_hang',
        'ref': 'web/images/exercises/active_hang.jpg',
        'keyframe': '/tmp/active_hang_passive.png',
        'prompt': 'Modify the reference image to show the exact same person hanging from the doorway pull-up bar, but in a PASSIVE / RELAXED hang: shoulders elevated naturally up towards the ears, body completely relaxed and hanging long. Exact same character, face, clothes, bar and art style.',
        'order': ['/tmp/active_hang_passive.png', 'web/images/exercises/active_hang.jpg']
    }
]

def run():
    print(f"Starting batch animation of {len(EXERCISES_L1)} Level 1 exercises...")
    for item in EXERCISES_L1:
        ex_id = item['id']
        out_webp = f"web/images/exercises/{ex_id}.webp"
        out_gif = f"web/images/exercises/{ex_id}.gif"
        
        print(f"\n[{ex_id}] Step 1: Generating complementary keyframe...")
        ok = generate_pose(item['ref'], item['prompt'], item['keyframe'])
        if not ok:
            print(f"FAILED keyframe for {ex_id}, skipping...")
            continue
            
        print(f"[{ex_id}] Step 2: Creating WebP and GIF animations...")
        create_exercise_animation(item['order'], out_webp, output_gif=out_gif)
        print(f"[{ex_id}] Done!")
        time.sleep(1)

if __name__ == '__main__':
    run()
