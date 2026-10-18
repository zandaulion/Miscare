"""Validate and package locally generated Play Store listing assets."""
import hashlib
import json
import re
from pathlib import Path
import zipfile
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
STORE = ROOT / 'store'

def store_files(pattern='*'):
    # An extracted copy of the output archive may exist beside the source assets.
    # Keep it out of both validation and the next archive without deleting it.
    return (path for path in STORE.rglob(pattern)
        if path.relative_to(STORE).parts[0] not in ('Miscare-Play-Store', 'Miscare-Screenshots'))

SCREENSHOT_SIZES = {
    'phone-screenshots': (1080, 1920),
    'tablet-7-screenshots': (1440, 2560),
    'tablet-10-screenshots': (2560, 1440),
}

ALT = {
    'en-US': [
        'Daily routine with intensity levels, suggested duration, equipment and exercise instructions.',
        'Paused guided exercise with an illustration, timer, repetition counter and set controls.',
        'Beginner exercise library with illustrated movements and equipment requirements.',
        'Equipment preferences for bodyweight exercise, a chair, a wall and optional home equipment.',
        'Sample workout journal with five active days, 35 minutes and completed sessions.',
        'Local data settings with language selection and data export, import and deletion controls.'
    ],
    'ro-RO': [
        'Sesiunea de azi cu nivelul de intensitate, durata, echipamentul și instrucțiunile exercițiilor.',
        'Exercițiu ghidat în pauză, cu ilustrație, timer, contor de repetări și comenzi pentru serie.',
        'Catalog de exerciții pentru începători, cu mișcări ilustrate și echipamentul necesar.',
        'Preferințe pentru greutatea corpului, scaun, perete și echipament opțional pentru acasă.',
        'Jurnal demonstrativ cu cinci zile active, 35 de minute și sesiunile înregistrate.',
        'Setări pentru limbă și date locale, cu export, import și ștergerea datelor.'
    ]
}
# Required channel encodings only: keep the rendered pixels unchanged.
for png in store_files('*.png'):
    if png.parts[-2] in ('source', 'previews'):
        continue
    expected = 'RGBA' if png.name == 'icon-512.png' else 'RGB'
    with Image.open(png) as image:
        if image.mode != expected:
            converted = image.convert(expected)
            converted.save(png, optimize=True)

report = {'text': {}, 'images': [], 'translations': {}}
listings = {}
document = (STORE / 'LISTINGS.md').read_text()
for match in re.finditer(r'^## (.+?) \(([^)]+)\)\n(.*?)(?=^## |\Z)', document, re.M | re.S):
    language, code, block = match.groups()
    fields = re.fullmatch(
        r'\n\*\*App name:\*\* ([^\n]+)\n\n'
        r'\*\*Short description:\*\* ([^\n]+)\n\n'
        r'\*\*Full description:\*\*\n\n(.+?)\s*', block, re.S)
    assert fields, f'Invalid listing structure: {code}'
    assert code not in listings, f'Duplicate language: {code}'
    listings[code] = dict(zip(('title', 'short_description', 'full_description'), fields.groups()))
    report['translations'][code] = {'language': language, 'fields': {}}
    for (field, value), limit in zip(listings[code].items(), (30, 80, 4000)):
        # Count UTF-16 units too, so supplementary characters never undercount.
        count = len(value.encode('utf-16-le')) // 2
        assert 0 < count <= limit, (code, field, count, limit)
        report['translations'][code]['fields'][field] = {'characters': count, 'limit': limit}
app_languages = {entry['code'] for entry in json.loads((ROOT / 'web/i18n/index.json').read_text())}
play_codes = {'en': 'en-US', 'ro': 'ro', 'ar': 'ar', 'de': 'de-DE', 'es': 'es-ES',
    'fr': 'fr-FR', 'hi': 'hi-IN', 'ja': 'ja-JP', 'ko': 'ko-KR', 'pt': 'pt-BR',
    'uk': 'uk', 'zh': 'zh-CN'}
assert set(listings) == {play_codes[language] for language in app_languages}, 'Listing languages must match the app'
for locale in ('en-US', 'ro-RO'):
    directory = STORE / locale
    fields = {}
    report['text'][locale] = {}
    for field, name, limit in [('title', 'title.txt', 30), ('short_description', 'short-description.txt', 80), ('full_description', 'full-description.txt', 4000)]:
        value = (directory / name).read_text().strip()
        assert 0 < len(value) <= limit, (locale, field, len(value))
        code = 'ro' if locale == 'ro-RO' else locale
        assert value == listings[code][field], f'{locale}/{name} differs from LISTINGS.md'
        fields[field] = value
        report['text'][locale][field] = {'characters': len(value), 'limit': limit}
    screenshot_groups = {}
    alt = {}
    for folder in SCREENSHOT_SIZES:
        screenshots = sorted((directory / folder).glob('*.png'))
        assert len(screenshots) == 6, (locale, folder, len(screenshots))
        screenshot_groups[folder] = [str(p.relative_to(directory)) for p in screenshots]
        alt.update({str(p.relative_to(directory)): text for p, text in zip(screenshots, ALT[locale])})
    # The wide tablet library also shows the selected exercise's detail panel.
    alt['tablet-10-screenshots/03-exercise-library.png'] = (
        'Beginner exercise list beside illustrated wall push-up instructions in the tablet detail panel.'
        if locale == 'en-US' else 'Lista de exerciții pentru începători, alături de instrucțiunile ilustrate pentru flotări la perete.')
    alt['feature-graphic.png'] = ('Mișcare: gentle movement at home, illustrated with a person using a sturdy chair.'
        if locale == 'en-US' else 'Mișcare: exerciții blânde acasă, ilustrate printr-o persoană care se sprijină pe un scaun stabil.')
    alt['hero-1920x1080.png'] = alt['feature-graphic.png']
    alt['../graphics/icon-512.png'] = ('Mișcare sage-green figure with terracotta motion marks on a cream background.'
        if locale == 'en-US' else 'Siluetă Mișcare verde salvie, cu semne de mișcare teracotă pe fond crem.')
    assert all(len(text) <= 140 for text in alt.values())
    (directory / 'alt-text.json').write_text(json.dumps(alt, ensure_ascii=False, indent=2) + '\n')
    fields['locale'] = locale
    fields['assets'] = {'icon': '../graphics/icon-512.png', 'feature_graphic': 'feature-graphic.png',
        'phone_screenshots': screenshot_groups['phone-screenshots'],
        'tablet_7_screenshots': screenshot_groups['tablet-7-screenshots'],
        'tablet_10_screenshots': screenshot_groups['tablet-10-screenshots'],
        'hero': 'hero-1920x1080.png', 'alt_text': 'alt-text.json'}
    (directory / 'listing.json').write_text(json.dumps(fields, ensure_ascii=False, indent=2) + '\n')

for png in sorted(store_files('*.png')):
    if 'source' in png.parts or 'previews' in png.parts:
        continue
    with Image.open(png) as image:
        assert image.format == 'PNG'
        if png.name == 'icon-512.png':
            assert image.size == (512, 512) and image.mode == 'RGBA' and png.stat().st_size <= 1024 * 1024
            assert image.getpixel((0, 0))[3] == 255, 'Keep full square corners; Play applies its own mask.'
        elif png.name == 'feature-graphic.png':
            assert image.size == (1024, 500) and image.mode == 'RGB'
        elif png.name.startswith('hero-'):
            assert image.size == (1920, 1080) and image.mode == 'RGB'
        else:
            assert png.parent.name in SCREENSHOT_SIZES, png
            expected_size = SCREENSHOT_SIZES[png.parent.name]
            if png.parent.name == 'tablet-10-screenshots' and png.name == '02-guided-session.png':
                expected_size = tuple(reversed(expected_size))
            assert image.size == expected_size and image.mode == 'RGB', png
            width, height = image.size
            assert min(width, height) >= 1080 and max(width, height) <= 3840
            assert max(width, height) * 9 == min(width, height) * 16
            assert png.stat().st_size < 8 * 1024 * 1024
        report['images'].append({'path': str(png.relative_to(STORE)), 'size': list(image.size), 'mode': image.mode,
            'bytes': png.stat().st_size, 'sha256': hashlib.sha256(png.read_bytes()).hexdigest()})
report['status'] = 'All text and image format checks passed'
(STORE / 'validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
archive = STORE / 'Miscare-Play-Store.zip'
archive.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for source in sorted(store_files()):
        if source.is_file() and source.suffix.lower() != '.zip':
            z.write(source, 'store/' + str(source.relative_to(STORE)))
screenshots_archive = STORE / 'Miscare-Screenshots.zip'
with zipfile.ZipFile(screenshots_archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for locale in ('en-US', 'ro-RO'):
        for folder in SCREENSHOT_SIZES:
            for source in sorted((STORE / locale / folder).glob('*.png')):
                z.write(source, str(source.relative_to(STORE)))
        alt_file = STORE / locale / 'alt-text.json'
        screenshot_alt = {key: value for key, value in json.loads(alt_file.read_text()).items()
            if key.split('/')[0] in SCREENSHOT_SIZES}
        z.writestr(f'{locale}/alt-text.json', json.dumps(screenshot_alt, ensure_ascii=False, indent=2) + '\n')
print(report['status'])
print(f'{len(report["images"])} upload/promotional images; {len(listings)} text languages; 2 artwork locales; {archive.stat().st_size:,} bytes')
print(archive)
print(screenshots_archive)
