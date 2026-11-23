"""Turn the full-page Think Lounge screenshots into web-sized assets.

Source: F:/thinklounge-site-archive  ->  web/public/thinklounge/{web,mobile,app}
Run:    python scripts/process_screenshots.py
"""
import os, sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

SRC = os.environ.get("TL_ARCHIVE", "F:/thinklounge-site-archive")
OUT = os.path.join(os.path.dirname(__file__), "..", "web", "public", "thinklounge")

# Desktop pages: (file stem, fold crop height in source px, also export full page?)
DESKTOP = [
    ("old-home", 1900, True),  # also the source of public/lounge.webp (crop 0,3860-2880,4900)
    ("learn-more", 1900, False),
    ("learn-more-childcare", 1900, True),
    ("drop-in-childcare", 1900, False),
    ("nurture-tots", 1900, False),
    ("preschool", 1900, False),
    ("after-school-0", 1900, False),
    ("cafe", 1900, False),
    ("mobile-app", 1900, False),
    ("events", 1900, False),
    ("pricing-1", 1900, False),
    ("blog", 1900, False),
    ("upcoming-classes", 1900, False),
    ("locations", 1900, False),
]
MOBILE_SITE = ["old-home", "learn-more-childcare", "drop-in-childcare", "cafe", "blog", "pricing-1"]
APP = ["home-page", "new-reservation", "new-reservation-confirm", "reservations", "reservation-details", "profile-settings"]

def save(im, path, w, q=80):
    im = im.convert("RGB")
    if im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "WEBP", quality=q, method=6)
    print(f"{os.path.relpath(path, OUT):55s} {im.width}x{im.height} {os.path.getsize(path)//1024}KB")

for stem, fold, full in DESKTOP:
    im = Image.open(f"{SRC}/website/desktop/{stem}.png")
    save(im.crop((0, 0, im.width, min(fold, im.height))), f"{OUT}/web/{stem}.webp", 1440)
    if full:
        save(im.crop((0, 0, im.width, min(9000, im.height))), f"{OUT}/web/{stem}-full.webp", 1200, 74)

for stem in MOBILE_SITE:
    im = Image.open(f"{SRC}/website/mobile/{stem}.png")
    save(im.crop((0, 0, im.width, min(2500, im.height))), f"{OUT}/mobile/{stem}.webp", 600)

for stem in APP:
    im = Image.open(f"{SRC}/mobile/{stem}.png")
    save(im, f"{OUT}/app/{stem}.webp", 540, 84)

# Brand logo lifted from the app home screen (clean logo on white).
logo = Image.open(f"{SRC}/mobile/home-page.png").crop((60, 185, 835, 375))
logo.save(f"{OUT}/logo.png")
print("logo.png", logo.size)
