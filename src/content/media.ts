import manifest from '../media-manifest.json';
import type { Localized } from '../i18n';

/**
 * MEDIA REGISTRY — the single place to replace or re-crop any photograph.
 *
 * - `file` is the base name of the processed images in /public/media
 *   (`<file>-<width>.webp` + one `<file>-<fallbackWidth>.jpg` fallback).
 * - `focus` is the CSS object-position used for art-directed crops.
 * - `focusMobile` (optional) overrides it on narrow screens.
 * - `rights` documents clearance status. Every supplied image is provisional.
 *
 * To swap an image: add the new files to /public/media (see MEDIA.md),
 * add an entry to src/media-manifest.json, then point the key below at it.
 */

export type MediaKey = keyof typeof media;

export type MediaItem = {
  file: keyof typeof manifest;
  alt: Localized;
  focus: string;
  focusMobile?: string;
  /** Contains third-party text, logos or graphics: never use as a hero. */
  thirdPartyGraphics?: boolean;
  rights: {
    status: 'provisional' | 'cleared';
    supplied: string;
    note: Localized;
  };
};

const supplied = 'Dalal Technologies photo package (Nov. 2026)';
const pending: Localized = {
  fr: 'Photographe, droits d’usage et droit à l’image à confirmer.',
  en: 'Photographer, usage rights and likeness permission to be confirmed.',
};

export const media = {
  arenaArmsCrossed: {
    file: '18_arena_arms_crossed',
    alt: {
      fr: 'Modou Lô, bras croisés, en tenue de lutte traditionnelle dans l’arène, la foule en arrière-plan.',
      en: 'Modou Lô, arms crossed, in traditional wrestling attire in the arena, the crowd behind him.',
    },
    focus: '50% 18%',
    focusMobile: '52% 12%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  stadiumWrestling: {
    file: '13_stadium_wrestling',
    alt: {
      fr: 'Modou Lô dans l’arène devant des tribunes pleines.',
      en: 'Modou Lô in the arena in front of packed stands.',
    },
    focus: '45% 40%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  bwPortrait: {
    file: '08_black_white_athlete_portrait',
    alt: {
      fr: 'Portrait en noir et blanc de Modou Lô, torse nu, regard droit.',
      en: 'Black-and-white portrait of Modou Lô, bare-chested, looking straight ahead.',
    },
    focus: '35% 30%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  moodyCloseup: {
    file: '15_moody_black_white_closeup',
    alt: {
      fr: 'Gros plan en noir et blanc du visage de Modou Lô.',
      en: 'Black-and-white close-up of Modou Lô’s face.',
    },
    focus: '50% 40%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  trainingArrival: {
    file: '02_training_arrival',
    alt: {
      fr: 'Modou Lô en survêtement, entouré d’un groupe, sur un terrain de sable.',
      en: 'Modou Lô in a tracksuit, surrounded by a group, on a sand ground.',
    },
    focus: '50% 30%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  ceremonial: {
    file: '03_traditional_ceremonial_attire',
    alt: {
      fr: 'Modou Lô portant une tenue cérémonielle traditionnelle ornée de gris-gris.',
      en: 'Modou Lô wearing traditional ceremonial attire adorned with amulets.',
    },
    focus: '45% 35%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  formalSuit: {
    file: '04_formal_suit_event',
    alt: {
      fr: 'Modou Lô en costume sombre et cravate lors d’un événement.',
      en: 'Modou Lô in a dark suit and tie at an event.',
    },
    focus: '50% 25%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  tracksuit: {
    file: '05_tracksuit_portrait',
    alt: {
      fr: 'Portrait de Modou Lô en veste de survêtement.',
      en: 'Portrait of Modou Lô in a track jacket.',
    },
    focus: '55% 25%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  trainingWrap: {
    file: '06_training_blue_wrap',
    alt: {
      fr: 'Modou Lô à l’entraînement, pagne bleu noué à la taille.',
      en: 'Modou Lô training, a blue cloth tied at the waist.',
    },
    focus: '50% 25%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  fightingPose: {
    file: '09_classic_fighting_pose',
    alt: {
      fr: 'Modou Lô en garde, poing levé, devant un feuillage.',
      en: 'Modou Lô in a fighting stance, fist raised, in front of foliage.',
    },
    focus: '45% 35%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  interview: {
    file: '10_media_interview',
    alt: {
      fr: 'Modou Lô répondant à une interview, micro tendu.',
      en: 'Modou Lô giving an interview, a microphone held out to him.',
    },
    focus: '45% 40%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  redHoodie: {
    file: '12_red_hoodie_casual',
    alt: {
      fr: 'Modou Lô accroupi sur le sable, en sweat rouge.',
      en: 'Modou Lô crouching on the sand in a red hoodie.',
    },
    focus: '50% 40%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  senegalJersey: {
    file: '14_senegal_jersey',
    alt: {
      fr: 'Modou Lô souriant, en maillot vert du Sénégal, la main sur le cœur.',
      en: 'Modou Lô smiling in a green Senegal jersey, hand on his heart.',
    },
    focus: '50% 30%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  arenaAttire: {
    file: '16_traditional_arena_attire',
    alt: {
      fr: 'Modou Lô marchant dans l’arène en tenue traditionnelle, gris-gris aux bras.',
      en: 'Modou Lô walking in the arena in traditional attire, amulets on his arms.',
    },
    focus: '50% 25%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  strength: {
    file: '17_strength_training',
    alt: {
      fr: 'Modou Lô en séance de musculation.',
      en: 'Modou Lô during a strength training session.',
    },
    focus: '40% 30%',
    rights: { status: 'provisional', supplied, note: pending },
  },
  studioPortrait: {
    file: '01_champion_studio_portrait',
    alt: {
      fr: 'Portrait studio de Modou Lô en chemise, un genou posé près d’un trône. Visuel promotionnel tiers.',
      en: 'Studio portrait of Modou Lô in a shirt, one knee down beside a throne. Third-party promotional artwork.',
    },
    focus: '50% 20%',
    thirdPartyGraphics: true,
    rights: {
      status: 'provisional',
      supplied,
      note: {
        fr: 'Visuel promotionnel avec texte et marque d’un diffuseur tiers : autorisation du diffuseur requise.',
        en: 'Promotional artwork with a third-party broadcaster’s text and brand: broadcaster permission required.',
      },
    },
  },
  recordPoster: {
    file: '07_fight_record_poster',
    alt: {
      fr: 'Affiche « Imbattable » d’un média sportif. Statistiques imprimées non vérifiées.',
      en: '“Imbattable” poster from a sports outlet. Printed statistics unverified.',
    },
    focus: '50% 30%',
    thirdPartyGraphics: true,
    rights: {
      status: 'provisional',
      supplied,
      note: {
        fr: 'Affiche d’un média tiers (filigrane visible). Archive uniquement ; chiffres à vérifier.',
        en: 'Third-party outlet poster (visible watermark). Archive only; figures to verify.',
      },
    },
  },
  crownedPoster: {
    file: '11_crowned_victory_poster',
    alt: {
      fr: 'Affiche « Victoire — Modou Lô bat Siteu », visage couronné. Visuel tiers.',
      en: '“Victory — Modou Lô beats Siteu” poster, crowned portrait. Third-party artwork.',
    },
    focus: '50% 35%',
    thirdPartyGraphics: true,
    rights: {
      status: 'provisional',
      supplied,
      note: {
        fr: 'Affiche avec logos et texte de tiers. Archive uniquement ; chiffres à vérifier.',
        en: 'Poster with third-party logos and text. Archive only; figures to verify.',
      },
    },
  },
} satisfies Record<string, MediaItem>;

export const mediaManifest = manifest as Record<string, { w: number; h: number; widths: number[]; fallback: number }>;
