# Media replacement guide

Every photograph on the site is controlled from **one file**: `src/content/media.ts`.

## How images are delivered

Each source photo becomes a set of files in `public/media/`:

```
<name>-480.webp   <name>-960.webp   <name>-1600.webp   (never upscaled: capped at the original width)
<name>-<≤960>.jpg                                       (JPEG fallback for older browsers)
```

`src/media-manifest.json` records each image's original size, available widths and fallback width. The `<Img>` component reads it to build a `<picture>` with a WebP `srcset`, a JPEG fallback, and explicit `width`/`height` to prevent layout shift.

Original aspect ratios are never changed. Crops are applied **non-destructively** in CSS with `object-fit: cover` and `object-position`, so the photo files themselves are never cut, warped or retouched.

## Replace an existing photo (same slot)

1. Put the new JPG in a folder, for example `incoming/18_arena_arms_crossed.jpg`. Use the same base name to overwrite the slot.
2. Run `pip install pillow`, then `python3 scripts/process-images.py incoming public/media`.
3. Delete any old size files that no longer apply.
4. In `media.ts`, adjust `focus` (and `focusMobile`) so the face stays in frame. Use `'50% 20%'` for a subject near the top.
5. Update `alt` (in both FR and EN) and the `rights` note.

## Add a new photo

1. Process it as above, for example `19_new_photo.jpg`.
2. Add an entry to `media` in `media.ts`:

```ts
newPhoto: {
  file: '19_new_photo',
  alt: { fr: '…', en: '…' },
  focus: '50% 30%',
  rights: { status: 'provisional', supplied: 'Photographer / agency', note: { fr: '…', en: '…' } },
},
```

3. Use it anywhere with `<Img k="newPhoto" sizes="…" />`, or by referencing `'newPhoto'` in the content files (fights, milestones, videos, products).

## Current slot map

| Slot (key) | File | Used in |
|---|---|---|
| arenaArmsCrossed | 18_arena_arms_crossed | **Hero portrait**, og-image, Defences milestone |
| stadiumWrestling | 13_stadium_wrestling | Hero arena backdrop (desktop), Boy Niang 2 card, People, TV slot |
| bwPortrait | 08_black_white_athlete_portrait | Origins (main), Pape Sène 2 card, Debut milestone, TV slot |
| trainingArrival | 02_training_arrival | Origins (secondary), Rock Énergie milestone, TV slot |
| moodyCloseup | 15_moody_black_white_closeup | Sa Thiès card, film modal, biography page, collector poster concept |
| arenaAttire | 16_traditional_arena_attire | Eumeu Sène card, Coronation milestone |
| fightingPose | 09_classic_fighting_pose | Ama Baldé card, Rise milestone |
| trainingWrap | 06_training_blue_wrap | Siteu card, Next generation |
| strength | 17_strength_training | Man → Discipline, Next generation, TV slot |
| ceremonial | 03_traditional_ceremonial_attire | Motto interlude |
| redHoodie | 12_red_hoodie_casual | Man (portrait) |
| tracksuit | 05_tracksuit_portrait | Man → Outside the arena |
| formalSuit | 04_formal_suit_event | Partnerships, Man → Entrepreneur, Next chapter milestone |
| interview | 10_media_interview | Exclusive interview block, TV slot |
| senegalJersey | 14_senegal_jersey | People, Man → Community, Community milestone, TV slot |
| crownedPoster | 11_crowned_victory_poster | **Archive only**: small thumbnail in the Siteu detail view |
| recordPoster | 07_fight_record_poster | Not displayed. Its statistics are unverified. Listed for rights review |
| studioPortrait | 01_champion_studio_portrait | Not displayed. It carries a broadcaster's promo text. Listed for rights review |

Images containing third-party text or graphics (`thirdPartyGraphics: true`) are never used as a hero or main visual.

Fight cards and timeline visuals are labelled **"Photo d'illustration"**, because the supplied photos are not documented as coming from those specific events. Once you have dated event photography, replace them and remove the label.
