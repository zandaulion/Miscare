#!/usr/bin/env python3
import os
import sys
import time
from generate_pose import generate_pose
from make_animation import create_exercise_animation

EXERCISES_L2_3 = [
    # LEVEL 2
    {
        'id': 'standard_pushups',
        'ref': 'web/images/exercises/standard_pushups.jpg',
        'keyframe': '/tmp/standard_pushups_down.png',
        'prompt': 'Modify the reference image to show the exact same person, but at the LOWERED / BOTTOM position of the standard floor pushup: chest lowered close to the floor, elbows bent back at 45 degrees, body maintaining a rigid straight plank line. Exact same person, attire, setting and art style.',
        'order': ['web/images/exercises/standard_pushups.jpg', '/tmp/standard_pushups_down.png']
    },
    {
        'id': 'full_squats',
        'ref': 'web/images/exercises/full_squats.jpg',
        'keyframe': '/tmp/full_squats_stand.png',
        'prompt': 'Modify the reference image to show the exact same person in the exact same cozy living room, but STANDING fully upright: legs straight, arms relaxed down by sides, smiling with good posture. Exact same character, clothes, rug, plants and art style.',
        'order': ['/tmp/full_squats_stand.png', 'web/images/exercises/full_squats.jpg']
    },
    {
        'id': 'forearm_plank',
        'ref': 'web/images/exercises/forearm_plank.jpg',
        'keyframe': '/tmp/forearm_plank_knees.png',
        'prompt': 'Modify the reference image to show the exact same man in the exact same cozy living room, but at the REST position: knees gently lowered to rest on the mat, relaxing out of the forearm plank. Exact same character, face, clothes, mat, plants and art style.',
        'order': ['/tmp/forearm_plank_knees.png', 'web/images/exercises/forearm_plank.jpg']
    },
    {
        'id': 'reverse_lunges',
        'ref': 'web/images/exercises/reverse_lunges.jpg',
        'keyframe': '/tmp/reverse_lunges_stand.png',
        'prompt': 'Modify the reference image to show the exact same woman in the exact same cozy living room, but STANDING upright with feet together, hands on hips, ready to step back into the lunge. Exact same character, face, clothes, rug, plants and art style.',
        'order': ['/tmp/reverse_lunges_stand.png', 'web/images/exercises/reverse_lunges.jpg']
    },
    {
        'id': 'chair_dips',
        'ref': 'web/images/exercises/chair_dips.jpg',
        'keyframe': '/tmp/chair_dips_top.png',
        'prompt': 'Modify the reference image to show the exact same man in the exact same cozy living room, but at the TOP / PUSHED-UP position of the chair dip: arms fully extended supporting his weight on the chair edge, chest upright, smiling calmly. Exact same character, face, clothes, chair and art style.',
        'order': ['/tmp/chair_dips_top.png', 'web/images/exercises/chair_dips.jpg']
    },
    {
        'id': 'mountain_climbers',
        'ref': 'web/images/exercises/mountain_climbers.jpg',
        'keyframe': '/tmp/mountain_climbers_alt.png',
        'prompt': 'Modify the reference image to show the exact same person in the exact same cozy living room, but with the OPPOSITE knee driven forward toward the chest (the other leg extended straight back), alternating the mountain climber stride. Exact same character, clothes, mat, plants and art style.',
        'order': ['web/images/exercises/mountain_climbers.jpg', '/tmp/mountain_climbers_alt.png']
    },
    {
        'id': 'dumbbell_bent_over_row',
        'ref': 'web/images/exercises/dumbbell_bent_over_row.jpg',
        'keyframe': '/tmp/bent_over_row_down.png',
        'prompt': 'Modify the reference image to show the exact same man in the exact same cozy living room, but with his arms EXTENDED STRAIGHT DOWN holding the dumbbells, elbows straight while keeping hips hinged and spine flat. Exact same character, clothes, dumbbells and art style.',
        'order': ['/tmp/bent_over_row_down.png', 'web/images/exercises/dumbbell_bent_over_row.jpg']
    },
    {
        'id': 'single_leg_glute_bridge',
        'ref': 'web/images/exercises/single_leg_glute_bridge.jpg',
        'keyframe': '/tmp/single_leg_bridge_down.png',
        'prompt': 'Modify the reference image to show the exact same woman in the exact same cozy living room, but with her hips LOWERED TO THE MAT, one knee still bent and one leg still extended straight. Exact same character, clothes, mat and art style.',
        'order': ['/tmp/single_leg_bridge_down.png', 'web/images/exercises/single_leg_glute_bridge.jpg']
    },
    {
        'id': 'chin_ups',
        'ref': 'web/images/exercises/chin_ups.jpg',
        'keyframe': '/tmp/chin_ups_hang.png',
        'prompt': 'Modify the reference image to show the exact same person hanging from the doorway pull-up bar, but at the BOTTOM / FULL HANG position: arms fully extended in underhand grip, body hanging long, smiling with focus before pulling up. Exact same character, clothes, bar and art style.',
        'order': ['/tmp/chin_ups_hang.png', 'web/images/exercises/chin_ups.jpg']
    },
    {
        'id': 'negative_pullups',
        'ref': 'web/images/exercises/negative_pullups.jpg',
        'keyframe': '/tmp/negative_pullups_bottom.png',
        'prompt': 'Modify the reference image to show the exact same person at the doorway pull-up bar, but having LOWERED completely down into a straight-arm hang with control, feet touching floor or hanging relaxed. Exact same character, clothes, bar and art style.',
        'order': ['web/images/exercises/negative_pullups.jpg', '/tmp/negative_pullups_bottom.png']
    },
    {
        'id': 'hanging_knee_raises',
        'ref': 'web/images/exercises/hanging_knee_raises.jpg',
        'keyframe': '/tmp/hanging_knee_raises_down.png',
        'prompt': 'Modify the reference image to show the exact same man hanging from the doorway pull-up bar, but with his legs EXTENDED STRAIGHT DOWN in a relaxed vertical hang, before raising his knees. Exact same character, clothes, bar and art style.',
        'order': ['/tmp/hanging_knee_raises_down.png', 'web/images/exercises/hanging_knee_raises.jpg']
    },
    {
        'id': 'dumbbell_goblet_squat',
        'ref': 'web/images/exercises/dumbbell_goblet_squat.jpg',
        'keyframe': '/tmp/goblet_squat_stand.png',
        'prompt': 'Modify the reference image to show the exact same person in the exact same cozy living room, but STANDING upright holding the dumbbell securely with both hands at chest level, legs straight. Exact same character, clothes, dumbbell and art style.',
        'order': ['/tmp/goblet_squat_stand.png', 'web/images/exercises/dumbbell_goblet_squat.jpg']
    },
    {
        'id': 'dumbbell_romanian_deadlift',
        'ref': 'web/images/exercises/dumbbell_romanian_deadlift.jpg',
        'keyframe': '/tmp/romanian_deadlift_stand.png',
        'prompt': 'Modify the reference image to show the exact same woman in the exact same cozy living room, but STANDING fully upright tall and proud, holding the dumbbells resting in front of her thighs, chest up. Exact same character, clothes, dumbbells, rug and art style.',
        'order': ['/tmp/romanian_deadlift_stand.png', 'web/images/exercises/dumbbell_romanian_deadlift.jpg']
    },
    {
        'id': 'dumbbell_floor_press',
        'ref': 'web/images/exercises/dumbbell_floor_press.jpg',
        'keyframe': '/tmp/floor_press_bottom.png',
        'prompt': 'Modify the reference image to show the exact same man on the mat in the cozy living room, but at the LOWERED position: elbows resting gently on the floor beside his ribs with forearms vertical, holding dumbbells at chest height before pressing. Exact same character, clothes, mat, dumbbells and art style.',
        'order': ['/tmp/floor_press_bottom.png', 'web/images/exercises/dumbbell_floor_press.jpg']
    },
    {
        'id': 'dumbbell_single_arm_row',
        'ref': 'web/images/exercises/dumbbell_single_arm_row.jpg',
        'keyframe': '/tmp/single_arm_row_down.png',
        'prompt': 'Modify the reference image to show the exact same woman supported on the chair, but with her free arm EXTENDED STRAIGHT DOWN towards the floor holding the dumbbell, shoulder relaxed before rowing up. Exact same character, clothes, chair, dumbbell and art style.',
        'order': ['/tmp/single_arm_row_down.png', 'web/images/exercises/dumbbell_single_arm_row.jpg']
    },
    {
        'id': 'dumbbell_farmers_carry',
        'ref': 'web/images/exercises/dumbbell_farmers_carry.jpg',
        'keyframe': '/tmp/farmers_carry_step2.png',
        'prompt': 'Modify the reference image to show the exact same man walking with dumbbells in the cozy room, but in the NEXT WALKING STRIDE: the opposite foot stepping forward, maintaining tall upright posture and arms straight down. Exact same character, clothes, dumbbells, room and art style.',
        'order': ['web/images/exercises/dumbbell_farmers_carry.jpg', '/tmp/farmers_carry_step2.png']
    },
    # LEVEL 3
    {
        'id': 'diamond_pushups',
        'ref': 'web/images/exercises/diamond_pushups.jpg',
        'keyframe': '/tmp/diamond_pushups_top.png',
        'prompt': 'Modify the reference image to show the exact same person on the mat, but at the TOP / PUSHED-UP position: arms pressed straight under chest with diamond hand placement, body in a high straight plank line. Exact same character, clothes, mat and art style.',
        'order': ['/tmp/diamond_pushups_top.png', 'web/images/exercises/diamond_pushups.jpg']
    },
    {
        'id': 'jump_squats',
        'ref': 'web/images/exercises/jump_squats.jpg',
        'keyframe': '/tmp/jump_squats_land.png',
        'prompt': 'Modify the reference image to show the exact same person in the cozy living room, but at the DEEP SQUAT / LANDING position: feet flat on the floor, knees bent deep into a squat, arms swung back ready to jump. Exact same character, clothes, room and art style.',
        'order': ['/tmp/jump_squats_land.png', 'web/images/exercises/jump_squats.jpg']
    },
    {
        'id': 'plank_shoulder_taps',
        'ref': 'web/images/exercises/plank_shoulder_taps.jpg',
        'keyframe': '/tmp/plank_shoulder_taps_alt.png',
        'prompt': 'Modify the reference image to show the exact same man on the mat, but tapping his RIGHT shoulder with his LEFT hand (the opposite side), hips held firm and level. Exact same character, clothes, mat and art style.',
        'order': ['web/images/exercises/plank_shoulder_taps.jpg', '/tmp/plank_shoulder_taps_alt.png']
    },
    {
        'id': 'burpees_clean',
        'ref': 'web/images/exercises/burpees_clean.jpg',
        'keyframe': '/tmp/burpees_plank.png',
        'prompt': 'Modify the reference image to show the exact same person in the cozy living room, but down in the LOW PLANK / PUSH-UP position on the floor, body straight and hands firmly planted. Exact same character, clothes, room and art style.',
        'order': ['/tmp/burpees_plank.png', 'web/images/exercises/burpees_clean.jpg']
    },
    {
        'id': 'pullups_standard',
        'ref': 'web/images/exercises/pullups_standard.jpg',
        'keyframe': '/tmp/pullups_standard_hang.png',
        'prompt': 'Modify the reference image to show the exact same person at the doorway pull-up bar, but in a FULL OVERHAND HANG: arms extended straight with wide overhand grip, body hanging long, looking upward with calm focus before pulling up. Exact same character, clothes, bar and art style.',
        'order': ['/tmp/pullups_standard_hang.png', 'web/images/exercises/pullups_standard.jpg']
    }
]

def run():
    print(f"Starting batch animation of {len(EXERCISES_L2_3)} Level 2 & 3 exercises...")
    for item in EXERCISES_L2_3:
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
