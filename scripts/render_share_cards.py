"""Redraw the two 1200 × 630 meeting share cards using the site's own assets.

Run `python -m pip install "Pillow>=10.1" qrcode`, then `python scripts/render_share_cards.py`.
The optional `--verify-qr` check also requires opencv-python-headless and NumPy.
No browser, network connection or system fonts are needed.
"""

import argparse
from functools import lru_cache
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFont, ImageOps


ASSETS = Path(__file__).resolve().parents[1] / 'dist' / 'assets'
ORIGIN = 'https://pkulhc.github.io/asvb-portal/'
PHOTO_PAGE = ('https://commons.wikimedia.org/wiki/'
              'File:Lago_Nam_Van,_Macao,_2013-08-08,_DD_04.jpg')
PHOTO_LICENSE = 'https://creativecommons.org/licenses/by-sa/3.0/'
WIDTH, HEIGHT, HERO = 1200, 630, 449
NAVY, PAPER, INK, GOLD = '#102a40', '#faf9f5', '#112d45', '#f0d396'


@lru_cache(maxsize=48)
def font(face, size, weight=400):
    if face == 'sans':
        return ImageFont.load_default(size=size)
    filename = {'cn': 'cn-display.woff2', 'regular': 'instrument-regular.woff2',
                'italic': 'instrument-italic.woff2'}[face]
    result = ImageFont.truetype(str(ASSETS / filename), size)
    if face == 'cn':
        result.set_variation_by_axes([weight])
    return result


def background():
    canvas = Image.new('RGB', (WIDTH, HEIGHT), PAPER)
    hero = Image.new('RGB', (WIDTH, HERO), NAVY)
    with Image.open(ASSETS / 'macao-waterfront.webp') as photo:
        waterfront = ImageOps.fit(photo.convert('RGB'), (966, HERO), Image.Resampling.LANCZOS)
    hero.paste(waterfront, (WIDTH - waterfront.width, 0))
    # The city landmark sits just to the right of the typography. Keep its silhouette clear.
    ramp = Image.new('L', (WIDTH, 1))
    for x in range(WIDTH):
        t = max(0, min(1, (x - 335) / 540))
        smooth = t * t * (3 - 2 * t)
        ramp.putpixel((x, 0), round(255 - 232 * smooth))
    hero.paste(Image.new('RGB', hero.size, NAVY), (0, 0), ramp.resize(hero.size))
    canvas.paste(hero, (0, 0))
    return canvas


def qr_image(url):
    code = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,
                         box_size=4, border=4)
    code.add_data(url)
    code.make(fit=True)
    return code.make_image(fill_color=INK, back_color='white').convert('RGB')


def render(language, destination):
    zh = language == 'zh'
    canvas = background()
    draw = ImageDraw.Draw(canvas)

    def line(x, baseline, value, face, size, color, *, weight=400, right=False, limit=WIDTH):
        selected = font(face, size, weight)
        anchor = 'rs' if right else 'ls'
        bounds = draw.textbbox((x, baseline), value, font=selected, anchor=anchor)
        if bounds[0] < 0 or bounds[1] < 0 or bounds[2] > limit or bounds[3] > HEIGHT:
            raise ValueError(f'{language} text crosses its allotted bounds: {value!r} {bounds}')
        draw.text((x, baseline), value, fill=color, font=selected, anchor=anchor)
        return bounds[2]

    with Image.open(ASSETS / 'society-logo.png') as source:
        logo = source.convert('RGBA').resize((55, 55), Image.Resampling.LANCZOS)
    draw.ellipse((55, 28, 117, 90), fill=PAPER)
    canvas.paste(logo, (59, 32), logo)
    line(132, 58, '亚洲血管生物学学会' if zh else 'ASVB',
         'cn' if zh else 'regular', 24 if zh else 36, '#ffffff', weight=620)
    line(133, 81, 'Asian Society for Vascular Biology', 'sans', 16, '#e2e9eb')

    draw.line((57, 131, 102, 131), fill=GOLD, width=2)
    line(116, 138, '第十二届 ASVB 学术会议' if zh else '12TH ASVB SCIENTIFIC MEETING',
         'cn' if zh else 'sans', 22 if zh else 19, GOLD, weight=580)
    edge = line(51, 279, '澳门' if zh else 'Macao', 'cn' if zh else 'regular',
                111 if zh else 141, '#ffffff', weight=560)
    line(edge + (26 if zh else 20), 279, '2027', 'italic', 153, GOLD)

    if zh:
        line(58, 342, '血管健康与疾病发生', 'cn', 36, '#ffffff', weight=580)
        line(59, 385, '机制与转化前沿探索', 'cn', 29, '#e0e9ec', weight=430)
    else:
        line(57, 343, 'Vascular Health and Disease Pathogenesis', 'regular', 40, '#ffffff')
        line(58, 383, 'Exploring Mechanistic and Translational Frontiers',
             'regular', 32, '#e0e9ec')

    credit = 'Diego Delso / delso.photo / CC BY-SA 3.0'
    credit_width = round(draw.textlength(credit, font=font('sans', 15)))
    credit_box = (WIDTH - 35 - credit_width - 17, HERO - 38, WIDTH - 30, HERO - 10)
    ImageDraw.Draw(canvas, 'RGBA').rounded_rectangle(credit_box, radius=2, fill=(10, 26, 38, 205))
    line(WIDTH - 41, HERO - 19, credit, 'sans', 15, '#ffffff', right=True)

    draw.rectangle((0, HERO, WIDTH, HERO + 2), fill='#d5b481')
    for x in (391, 817):
        draw.line((x, 492, x, 585), fill='#cbd1ce', width=1)
    label_color = '#536470'
    if zh:
        line(58, 512, '拟定学术会期', 'cn', 20, label_color, weight=600, limit=385)
        line(58, 566, '2027年8月23–24日', 'cn', 35, INK, weight=600, limit=385)
        line(418, 512, '拟定会场', 'cn', 20, label_color, weight=600, limit=810)
        line(417, 566, '澳门科技大学', 'cn', 37, INK, weight=600, limit=810)
        line(975, 531, '查看', 'cn', 19, label_color, weight=520, right=True)
        line(975, 561, '会议网页', 'cn', 24, INK, weight=620, right=True)
    else:
        line(58, 511, 'PROPOSED DATES', 'sans', 16, label_color, limit=385)
        line(57, 567, '23–24 August 2027', 'regular', 45, INK, limit=385)
        line(418, 504, 'PROPOSED VENUE', 'sans', 16, label_color, limit=810)
        line(417, 547, 'Macau University of Science', 'regular', 34, INK, limit=810)
        line(417, 580, 'and Technology', 'regular', 34, INK, limit=810)
        line(975, 531, 'Scan for the', 'sans', 18, label_color, right=True)
        line(975, 560, 'meeting page', 'regular', 28, INK, right=True)

    url = ORIGIN + ('' if zh else 'en/') + 'macao-2027.html'
    qr = qr_image(url)
    # Align four-pixel modules with the half- and three-quarter-size preview grids.
    qr_left = 4 * round((WIDTH - 45 - qr.width) / 4)
    qr_top = 4 * round((HERO + (HEIGHT - HERO - qr.height) / 2) / 4)
    canvas.paste(qr, (qr_left, qr_top))

    exif = Image.Exif()
    exif[270] = (f'ASVB Macao 2027 | {url} | Waterfront photograph by Diego Delso, '
                 f'delso.photo. Resized, cropped and shaded. {PHOTO_PAGE} | {PHOTO_LICENSE}')
    canvas.save(destination, 'JPEG', quality=94, optimize=True, subsampling=0, exif=exif)
    return url


def verify_qr(path, expected):
    import cv2
    import numpy as np

    encoded = np.frombuffer(path.read_bytes(), dtype=np.uint8)
    image = cv2.imdecode(encoded, cv2.IMREAD_COLOR)
    if image.shape[:2] != (HEIGHT, WIDTH):
        raise ValueError(f'Incorrect dimensions in {path}')
    for scale in (1, 0.75, 0.5):
        preview = cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
        decoded = cv2.QRCodeDetector().detectAndDecode(preview)[0]
        if decoded != expected:
            raise ValueError(f'QR check failed at {scale:g}x for {path.name}: {decoded!r}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', type=Path, default=ASSETS)
    parser.add_argument('--verify-qr', action='store_true')
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for locale in ('zh', 'en'):
        path = args.output_dir / f'macao-2027-{locale}.jpg'
        url = render(locale, path)
        if args.verify_qr:
            verify_qr(path, url)
        print(f'{path.name}   {WIDTH} x {HEIGHT}   {path.stat().st_size:,} bytes   {url}')
