# Mișcare — Play Store listing assets

All listing materials live in this dedicated `store/` folder.
`Miscare-Play-Store.zip` contains the complete package.
`Miscare-Screenshots.zip` contains just the 36 screenshots and their alt text.

Prepared for the Android 0.1.0 app. Text listings for all 12 interface languages
are in `LISTINGS.md`; localized artwork is supplied in English (`en-US`) and
Romanian (`ro-RO`).

## Releases

The next upload is **0.1.1** (versionCode 2): fixes from closed testing and a
dark theme. Its Play release notes, one block per language, are in
`RELEASE_NOTES_0.1.1.txt`; paste the file into the release notes box.
The bundle was built on 2026-10-28 at 08:52 from commit `9cae96c` and signed
with the Play upload key; its SHA-256 is
`601379f05fc38a025e2237a454953b02036e50a122336644a8008d372df05e9b`.
Before it, 0.1.0 (versionCode 1) went to closed testing with
`RELEASE_NOTES_0.1.0.txt`.

## All-language text import

Use `LISTINGS.md` for Play Console's **Import translations with AI** action.
It follows the same Markdown layout as Bitey's listing file: a heading for each
language, followed by **App name**, **Short description**, and **Full description**.
It contains English, Arabic, Simplified Chinese, French, German, Hindi, Japanese,
Korean, Brazilian Portuguese, Romanian, Spanish (Spain), and Ukrainian.

The headings use Play Console language codes, including `ro` and `uk` rather
than regional codes. Review the imported language and field mapping before
applying changes. This file supplies text only; localized images remain separate.
All 12 sets of text are checked by `scripts/package-play-store.py` against the
30/80/4,000-character limits.

## Privacy policy

The Android privacy policy is available in editable Markdown and standalone HTML:

- English: `privacy-policy.md` and `privacy-policy.html`.
- Romanian: `ro-RO/privacy-policy.md` and `ro-RO/privacy-policy.html`.

The policy covers the free app, local exercise and health-related preferences,
optional exports/imports, deletion, device services, and support correspondence.
The public privacy contact is `zandaulion@gmail.com`. These documents apply to
the Android app, not the separately hosted web version.

Before the Play release, host the HTML at a stable public URL and add the policy
link in Play Console and inside the app. Local files do not supply that URL;
the policy has not been published or added to the current APK.
See [Google Play's privacy policy requirements](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en).

## Upload mapping

For each locale, paste `title.txt`, `short-description.txt`, and `full-description.txt`
into the matching Play Console fields. Upload `feature-graphic.png` and the six
ordered files from each screenshot folder into the corresponding device section:

| Play Console section | Folder within each locale | Resolution |
| --- | --- | --- |
| Phone screenshots | `phone-screenshots/` | 1080 × 1920, portrait |
| 7-inch tablet screenshots | `tablet-7-screenshots/` | 1440 × 2560, portrait |
| 10-inch tablet screenshots | `tablet-10-screenshots/` | 2560 × 1440 landscape; guided session 1440 × 2560 portrait |

Each folder contains six ordered PNG files: daily routine, guided session,
exercise library, equipment, journal, and local data settings. Both `en-US` and
`ro-RO` contain all three device sets, for 36 screenshots in total. Upload the
individual PNG files, not the overview sheets in `previews/`.

The shared store icon is
`graphics/icon-512.png`. `alt-text.json` contains descriptions for each image.
`listing.json` combines the copy and upload paths for convenience.

| Asset | Delivered format |
| --- | --- |
| App name | At most 30 characters |
| Short description | At most 80 characters |
| Full description | At most 4,000 characters |
| Store icon | 512 × 512 PNG, RGBA, square corners, no baked shadow |
| Feature graphic | 1024 × 500 PNG, RGB |
| Phone screenshots | Six per locale, 1080 × 1920 PNG, RGB |
| 7-inch tablet screenshots | Six per locale, 1440 × 2560 PNG, RGB |
| 10-inch tablet screenshots | Six per locale, 2560 × 1440 or 1440 × 2560 PNG, RGB |
| Additional landscape hero | 1920 × 1080 PNG, RGB, one per locale |

`hero-1920x1080.png` is additional promotional artwork. Use `feature-graphic.png`
for Play Console's feature graphic field. The files in `previews/` are contact
sheets for review; upload the individual screenshots.

## Image provenance

Screenshots show the actual HTML/CSS/JavaScript extracted from the signed Android
APK, rendered in Chromium at 2× density. CSS viewports are 540 × 960 for phones,
720 × 1280 for 7-inch tablets, and 1280 × 720 for 10-inch tablets. The 10-inch
guided session is captured after rotating to 720 × 1280. Each device
set is rendered independently at its viewport; tablet images are not resized
phone images. The 10-inch library capture opens the actual side-by-side exercise
detail panel provided by the app's responsive layout.
The current build compresses the exercise illustration in landscape guided
sessions; those captures use portrait orientation to keep the illustration and
controls visible. No CSS changes are used to conceal that limitation.

These are app captures from the packaged interface, not photographs or OS
screenshots from physical tablets or a personal phone. A temporary profile and explicitly synthetic session history
supply the example content. No production database, private health records,
phone notifications, accounts, device identifiers or real user history are used.
The five days and 35 minutes in the journal are sample data, not a testimonial.
The capture clock is fixed to 17 October 2026; the selected time zone is a fixture.
`source/capture-manifest.json` records the source APK hash and capture profiles.
The renderer checks for JavaScript errors, unexpected requests, broken images,
and horizontal overflow before accepting captures.

The renderer supplies a local Noto Color Emoji fallback to match glyphs available
on Android and waits for image decoding. It leaves the application layout and
visible product strings intact. Some guided-session labels in the current
English UI remain Romanian; the captures preserve that shipped behavior.

The icon is rendered from the existing code-native Mișcare SVG mark with a full
square cream background. The illustration was made with the built-in imagegen
tool, using existing exercise illustrations as style references. The exact
prompt is in `source/hero-prompt.txt`; the original generated illustration is
`source/hero-illustration.png`. Typography and output sizes are rendered from
HTML by `scripts/render-play-store-art.mjs`.

## Reproduction

Run from the project root with the signed APK available at
`artifacts/Miscare-0.1.0.apk`:

```sh
# EMOJI_FONT is a local NotoColorEmoji.ttf path; it is a rendering resource only.
EMOJI_FONT=/path/to/NotoColorEmoji.ttf node scripts/generate-play-store.mjs
node scripts/render-play-store-art.mjs
python3 scripts/package-play-store.py
```

Set `CHROMIUM_PATH` if using an existing Chromium installation instead of a
Playwright-managed browser. The generated hero illustration must already be
present before rendering the feature graphics. The original generated image
stays unchanged; no generative call is needed to reproduce the typesetting.

## References

Sizes and text limits were checked against Google's guidance on 2026-10-17:

- [Preview assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- [App details and text limits](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)
- [Icon design](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)
- [Noto Emoji font project](https://github.com/googlefonts/noto-emoji)

This work generates local files. No Play Console or GitHub publication is performed.
