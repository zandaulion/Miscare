#!/usr/bin/env python3
"""
Generate complementary pose keyframes using Gemini image-to-image API.
"""
import os
import sys
import json
import base64
import time
import urllib.request
import urllib.error

def get_api_key():
    key = os.environ.get('GEMINI_API_KEY')
    if key:
        return key
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if os.path.exists(env_path):
        for line in open(env_path):
            if line.startswith('GEMINI_API_KEY='):
                return line.strip().split('=', 1)[1].strip('"\'')
    raise ValueError("GEMINI_API_KEY not found in environment or .env file")

MODELS = [
    'gemini-2.5-flash-image',
    'gemini-3.1-flash-lite-image',
    'gemini-3.1-flash-image-preview',
    'gemini-3.1-flash-image'
]

def generate_pose(ref_image_path, prompt, output_path, model_index=0):
    api_key = get_api_key()
    with open(ref_image_path, 'rb') as f:
        img_b64 = base64.b64encode(f.read()).decode('utf-8')

    mime = 'image/jpeg' if ref_image_path.lower().endswith(('.jpg', '.jpeg')) else 'image/png'

    data = {
        'contents': [{
            'parts': [
                {
                    'inlineData': {
                        'mimeType': mime,
                        'data': img_b64
                    }
                },
                {
                    'text': prompt
                }
            ]
        }],
        'generationConfig': {
            'responseModalities': ['IMAGE']
        }
    }

    # Try models with fallback
    for idx in range(model_index, len(MODELS)):
        model_name = MODELS[idx]
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        try:
            print(f"Calling {model_name} for {output_path}...")
            t0 = time.time()
            with urllib.request.urlopen(req, timeout=60) as resp:
                res = json.loads(resp.read().decode('utf-8'))
                parts = res['candidates'][0]['content']['parts']
                for p in parts:
                    if 'inlineData' in p:
                        out_bytes = base64.b64decode(p['inlineData']['data'])
                        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
                        with open(output_path, 'wb') as out_f:
                            out_f.write(out_bytes)
                        elapsed = time.time() - t0
                        print(f"SUCCESS: Generated {output_path} ({len(out_bytes)/1024:.1f} KB in {elapsed:.1f}s)")
                        return True
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode('utf-8', errors='ignore')
            print(f"HTTP Error {e.code} on {model_name}: {err_msg[:250]}")
            if e.code in (429, 503):
                print(f"Rate/Availability limit ({e.code}) on {model_name}, trying fallback model...")
                time.sleep(2)
                continue
            else:
                time.sleep(1)
        except Exception as ex:
            print(f"Exception on {model_name}: {ex}")
            time.sleep(1)

    print(f"FAILED to generate pose for {output_path}")
    return False

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: generate_pose.py <ref_image> <prompt> <output_path>")
        sys.exit(1)
    ref = sys.argv[1]
    prm = sys.argv[2]
    out = sys.argv[3]
    ok = generate_pose(ref, prm, out)
    sys.exit(0 if ok else 1)
