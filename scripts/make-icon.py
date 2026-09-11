#!/usr/bin/env python3
"""
Semnul aplicației, desenat din cod.

Silueta e cea dintâi -- cerc și picătură -- fiindcă oamenii o au deja pe
ecranul principal și o recunosc. Ce s-a schimbat e mâna: contur de cerneală cu
grosime variabilă, hârtie crem și salvie din paleta ilustrațiilor, în locul
degradeului de smarald rece care părea din altă aplicație.

Arcurile nu sunt ornament. Fără ele, forma închisă pe fond deschis citește
exact ca un pin de hartă -- s-a văzut limpede la proba de contur. Sunt subțiri
cât să spună mișcare, nu paranteză.

Rulează: python3 scripts/make-icon.py
"""
import math
import pathlib

PAPER, INK, DEEP, TERRA = '#F5EFE3', '#6B5544', '#4E6A57', '#C97F5F'


def _qbez(p0, p1, p2, t):
    u = 1 - t
    return (u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
            u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1])


def _qtan(p0, p1, p2, t):
    u = 1 - t
    return (2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]),
            2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]))


def brush(p0, p1, p2, wmax, phase=0.0, n=28):
    """Arc ca tușă: gros la mijloc, subțire la capete.

    Un `stroke` uniform are aceeași grosime peste tot, ceea ce citește ca
    tipar. O tușă apasă la mijloc și se ridică la capete, ca un gest.
    """
    left, right = [], []
    for i in range(n + 1):
        t = i / n
        x, y = _qbez(p0, p1, p2, t)
        tx, ty = _qtan(p0, p1, p2, t)
        m = math.hypot(tx, ty) or 1.0
        nx, ny = -ty / m, tx / m
        w = (wmax * math.sin(math.pi * t) ** 0.65) / 2
        d = 1.1 * math.sin(t * math.pi * 2.1 + phase)
        left.append((x + nx * (w + d), y + ny * (w + d)))
        right.append((x - nx * (w - d), y - ny * (w - d)))
    return _path(left + right[::-1])


def wobbly(segs, wob=2.2, n=22):
    """Contur închis cu tremur de mână: undă joasă, nu zgomot."""
    pts = []
    for si, (p0, p1, p2) in enumerate(segs):
        for i in range(n):
            t = i / n
            x, y = _qbez(p0, p1, p2, t)
            tx, ty = _qtan(p0, p1, p2, t)
            m = math.hypot(tx, ty) or 1.0
            nx, ny = -ty / m, tx / m
            d = wob * math.sin(t * math.pi * 1.7 + si * 2.0)
            pts.append((x + nx * d, y + ny * d))
    return _path(pts)


def circle(cx, cy, r, wob=2.0, n=40):
    pts = [(cx + (r + wob * math.sin(2 * math.pi * i / n * 3 + 0.7)) * math.cos(2 * math.pi * i / n),
            cy + (r + wob * math.sin(2 * math.pi * i / n * 3 + 0.7)) * math.sin(2 * math.pi * i / n))
           for i in range(n)]
    return _path(pts)


def _path(pts):
    return 'M ' + ' L '.join(f'{x:.1f},{y:.1f}' for x, y in pts) + ' Z'


DROP = wobbly([((256, 410), (198, 372), (176, 288)),
               ((176, 288), (178, 206), (256, 200)),
               ((256, 200), (334, 206), (336, 288)),
               ((336, 288), (314, 372), (256, 410))])
HEAD = circle(256, 146, 44)
ARC_L = brush((144, 258), (126, 306), (148, 356), 15, 0.8)
ARC_R = brush((368, 258), (386, 306), (364, 356), 15, 2.4)

MARK = f'''  <path d="{ARC_L}" fill="{TERRA}"/>
  <path d="{ARC_R}" fill="{TERRA}"/>
  <g fill="{DEEP}" stroke="{INK}" stroke-width="13" stroke-linejoin="round">
    <path d="{DROP}"/>
    <path d="{HEAD}"/>
  </g>'''


def build(rounded=True, safe=1.0):
    """`safe` micșorează semnul pentru varianta maskable.

    Android decupează dala maskable la cerc sau squircle, iar zona sigură e
    doar 80% din mijloc. Varianta de acum era copie fidelă a celei obișnuite,
    deci pe unele lansatoare semnul se tăia pe margini.
    """
    radius = 'rx="112" ' if rounded else ''
    inner = MARK if safe == 1.0 else (
        f'  <g transform="translate({256 * (1 - safe):.1f},{256 * (1 - safe):.1f}) scale({safe})">\n'
        + '\n'.join('  ' + l for l in MARK.splitlines()) + '\n  </g>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">\n'
            f'  <rect width="512" height="512" {radius}fill="{PAPER}"/>\n{inner}\n</svg>\n')


if __name__ == '__main__':
    out = pathlib.Path(__file__).resolve().parent.parent / 'web' / 'icons'
    (out / 'icon.svg').write_text(build(), encoding='utf-8')
    # Colțurile drepte: masca le pune ea. Semnul, la 78%, încape în cercul sigur.
    (out / 'icon-maskable.svg').write_text(build(rounded=False, safe=0.78), encoding='utf-8')
    print('scrise: icon.svg, icon-maskable.svg')
