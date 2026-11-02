import type { Localized } from '../i18n';
import type { MediaKey } from './media';

/**
 * VERIFIED FACTS — every fact on the site points to a source below.
 * Anything without a source is rendered as "À confirmer" / "To be confirmed".
 * Checked on 2 November 2026.
 */
export const sources = {
  soleilRois: {
    label: 'Le Soleil via AllAfrica — « De Manga 2 à Sa Thiès : neuf Rois des arènes en 42 ans » (8 avr. 2026)',
    url: 'https://fr.allafrica.com/stories/202604080280.html',
  },
  soleilSaThies: {
    label: 'Le Soleil — « Lutte : Sa Thiès bat Modou Lô et détrône le roi » (avr. 2026)',
    url: 'https://lesoleil.sn/actualites/sports/lutte-sa-thies-bat-modou-lo-et-detrone-le-roi/',
  },
  ecuries: {
    label: 'AllAfrica — « Modou Lô–Sa Thiès : au-delà du combat, une bataille d’écuries » (25 mars 2026)',
    url: 'https://fr.allafrica.com/stories/202603250616.html',
  },
} as const;

export type SourceKey = keyof typeof sources;

/** Achievement strip ("illuminated inscriptions"). */
export type Inscription = {
  label: Localized;
  value: Localized;
  detail: Localized;
  source?: SourceKey;
};

export const inscriptions: Inscription[] = [
  {
    label: { fr: 'Roi des arènes', en: 'King of the Arenas' },
    value: { fr: '2019 — 2026' },
    detail: {
      fr: 'Du 28 juillet 2019 au 5 avril 2026 — près de sept ans de règne.',
      en: 'From 28 July 2019 to 5 April 2026 — nearly seven years on the throne.',
    },
    source: 'soleilRois',
  },
  {
    label: { fr: 'Couronné face à', en: 'Crowned against' },
    value: { fr: 'Eumeu Sène' },
    detail: { fr: '28 juillet 2019', en: '28 July 2019' },
    source: 'soleilRois',
  },
  {
    label: { fr: 'Titre défendu face à', en: 'Title defended against' },
    value: { fr: 'Ama Baldé · Boy Niang 2 · Siteu' },
    detail: { fr: 'Novembre 2023 — novembre 2024', en: 'November 2023 — November 2024' },
    source: 'soleilRois',
  },
  {
    label: { fr: 'Premier combat', en: 'First bout' },
    value: { fr: '4 février 2006', en: '4 February 2006' },
    detail: { fr: 'Face à Pape Sène 2', en: 'Against Pape Sène 2' },
    source: 'soleilRois',
  },
  {
    label: { fr: 'Écurie', en: 'Stable' },
    value: { fr: 'Rock Énergie' },
    detail: {
      fr: 'Fondée en mai 2002 aux Parcelles Assainies par feu Demba Dia.',
      en: 'Founded in May 2002 in Parcelles Assainies by the late Demba Dia.',
    },
    source: 'ecuries',
  },
  {
    label: { fr: 'Bilan officiel', en: 'Official record' },
    value: { fr: 'À confirmer', en: 'To be confirmed' },
    detail: {
      fr: 'Le bilan complet sera publié après vérification auprès d’une source officielle.',
      en: 'The full record will be published once verified with an official source.',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* HALL OF GLORY — add a fight by appending an object.                         */
/* -------------------------------------------------------------------------- */

export type Fight = {
  id: string;
  opponent: string;
  date: string; // ISO; empty string = to be confirmed
  venue?: Localized; // omitted = to be confirmed
  result?: Localized; // omitted = to be confirmed
  tag: Localized;
  image: MediaKey;
  /** Extra archival image shown in the detail view (third-party poster). */
  archive?: MediaKey;
  context: Localized;
  highlights: { youtubeId: string; title: Localized }[]; // approved embeds only
  sources: SourceKey[];
};

export const fights: Fight[] = [
  {
    id: 'pape-sene-2',
    opponent: 'Pape Sène 2',
    date: '2006-02-04',
    tag: { fr: 'Le premier pas', en: 'The first step' },
    image: 'bwPortrait',
    context: {
      fr: 'Le premier combat recensé de sa carrière. C’est ici que commence le chemin qui mènera, treize ans plus tard, à la couronne.',
      en: 'The first recorded bout of his career — the start of a road that would lead, thirteen years later, to the crown.',
    },
    highlights: [],
    sources: ['soleilRois'],
  },
  {
    id: 'eumeu-sene',
    opponent: 'Eumeu Sène',
    date: '2019-07-28',
    result: { fr: 'Victoire — sacré Roi des arènes', en: 'Victory — crowned King of the Arenas' },
    tag: { fr: 'Le sacre', en: 'The coronation' },
    image: 'arenaAttire',
    context: {
      fr: 'En battant Eumeu Sène, Modou Lô devient Roi des arènes. Le début d’un règne qui durera près de sept ans.',
      en: 'By beating Eumeu Sène, Modou Lô became King of the Arenas — the start of a reign that would last nearly seven years.',
    },
    highlights: [],
    sources: ['soleilRois'],
  },
  {
    id: 'ama-balde',
    opponent: 'Ama Baldé',
    date: '2023-11-05',
    result: { fr: 'Victoire — titre conservé', en: 'Victory — title retained' },
    tag: { fr: 'La couronne défendue', en: 'The crown defended' },
    image: 'fightingPose',
    context: {
      fr: 'Une défense du titre de Roi des arènes, citée parmi les grands rendez-vous de son règne.',
      en: 'A defence of the King of the Arenas title, cited among the major events of his reign.',
    },
    highlights: [],
    sources: ['soleilRois'],
  },
  {
    id: 'boy-niang-2',
    opponent: 'Boy Niang 2',
    date: '2024-01-01',
    result: { fr: 'Victoire — titre conservé', en: 'Victory — title retained' },
    tag: { fr: 'Le Nouvel An du roi', en: "The king's New Year" },
    image: 'stadiumWrestling',
    context: {
      fr: 'Le 1er janvier 2024, le roi ouvre l’année en conservant sa couronne face à Boy Niang 2.',
      en: 'On 1 January 2024, the king opened the year by keeping his crown against Boy Niang 2.',
    },
    highlights: [],
    sources: ['soleilRois'],
  },
  {
    id: 'siteu',
    opponent: 'Siteu',
    date: '2024-11-24',
    result: { fr: 'Victoire — titre conservé', en: 'Victory — title retained' },
    tag: { fr: 'Le règne prolongé', en: 'The reign extended' },
    image: 'trainingWrap',
    archive: 'crownedPoster',
    context: {
      fr: 'Nouvelle défense réussie de la couronne, face à Siteu, en novembre 2024.',
      en: 'Another successful defence of the crown, against Siteu, in November 2024.',
    },
    highlights: [],
    sources: ['soleilRois'],
  },
  {
    id: 'sa-thies',
    opponent: 'Sa Thiès',
    date: '2026-04-05',
    result: { fr: 'Défaite — fin du règne', en: 'Defeat — end of the reign' },
    tag: { fr: 'La couronne transmise', en: 'The crown passes on' },
    image: 'moodyCloseup',
    context: {
      fr: 'Le 5 avril 2026, Sa Thiès s’impose en moins de deux minutes selon Le Soleil et devient Roi des arènes. Une page se tourne ; la légende, elle, demeure.',
      en: 'On 5 April 2026, Sa Thiès won in under two minutes, according to Le Soleil, and became King of the Arenas. A chapter closes; the legend remains.',
    },
    highlights: [],
    sources: ['soleilSaThies', 'soleilRois'],
  },
];

/* -------------------------------------------------------------------------- */
/* TIMELINE — structured milestones.                                          */
/* -------------------------------------------------------------------------- */

export type TimelineCategory = 'early' | 'breakthrough' | 'fights' | 'reign' | 'community' | 'next';

export const timelineCategories: { id: TimelineCategory; label: Localized }[] = [
  { id: 'early', label: { fr: 'Débuts', en: 'Early career' } },
  { id: 'breakthrough', label: { fr: 'Ascension', en: 'Breakthroughs' } },
  { id: 'fights', label: { fr: 'Combats historiques', en: 'Historic fights' } },
  { id: 'reign', label: { fr: 'Le règne', en: 'The reign' } },
  { id: 'community', label: { fr: 'Communauté', en: 'Community' } },
  { id: 'next', label: { fr: 'Le prochain chapitre', en: 'The next chapter' } },
];

export type Milestone = {
  id: string;
  year: string;
  category: TimelineCategory;
  title: Localized;
  body: Localized;
  image: MediaKey;
  placeholder?: boolean;
  source?: SourceKey;
};

export const milestones: Milestone[] = [
  {
    id: 'rock-energie',
    year: '2002',
    category: 'early',
    title: { fr: 'Rock Énergie voit le jour', en: 'Rock Énergie is born' },
    body: {
      fr: 'En mai 2002, feu Demba Dia fonde l’écurie Rock Énergie aux Parcelles Assainies. Elle deviendra la maison de Modou Lô.',
      en: 'In May 2002, the late Demba Dia founded the Rock Énergie stable in Parcelles Assainies. It would become Modou Lô’s home.',
    },
    image: 'trainingArrival',
    source: 'ecuries',
  },
  {
    id: 'debut',
    year: '2006',
    category: 'early',
    title: { fr: 'Le premier combat', en: 'The first bout' },
    body: {
      fr: 'Le 4 février 2006, face à Pape Sène 2.',
      en: 'On 4 February 2006, against Pape Sène 2.',
    },
    image: 'bwPortrait',
    source: 'soleilRois',
  },
  {
    id: 'rise',
    year: '2006 — 2019',
    category: 'breakthrough',
    title: { fr: 'L’ascension', en: 'The rise' },
    body: {
      fr: 'Les victoires décisives qui ont mené au combat royal seront documentées ici à partir de sources confirmées.',
      en: 'The decisive victories that led to the title fight will be documented here from confirmed sources.',
    },
    image: 'fightingPose',
    placeholder: true,
  },
  {
    id: 'crown',
    year: '2019',
    category: 'fights',
    title: { fr: 'Le sacre', en: 'The coronation' },
    body: {
      fr: 'Le 28 juillet 2019, il bat Eumeu Sène et devient Roi des arènes.',
      en: 'On 28 July 2019, he beat Eumeu Sène to become King of the Arenas.',
    },
    image: 'arenaAttire',
    source: 'soleilRois',
  },
  {
    id: 'defences',
    year: '2023 — 2024',
    category: 'reign',
    title: { fr: 'Le roi tient son rang', en: 'The king holds his ground' },
    body: {
      fr: 'Il conserve sa couronne face à Ama Baldé (5 novembre 2023), Boy Niang 2 (1er janvier 2024) et Siteu (24 novembre 2024).',
      en: 'He retained his crown against Ama Baldé (5 November 2023), Boy Niang 2 (1 January 2024) and Siteu (24 November 2024).',
    },
    image: 'arenaArmsCrossed',
    source: 'soleilRois',
  },
  {
    id: 'sa-thies',
    year: '2026',
    category: 'fights',
    title: { fr: 'La fin d’un règne', en: 'The end of a reign' },
    body: {
      fr: 'Le 5 avril 2026, Sa Thiès le bat et devient Roi des arènes, près de sept ans après le sacre de Modou Lô.',
      en: 'On 5 April 2026, Sa Thiès beat him to become King of the Arenas, nearly seven years after Modou Lô’s coronation.',
    },
    image: 'moodyCloseup',
    source: 'soleilSaThies',
  },
  {
    id: 'community',
    year: '—',
    category: 'community',
    title: { fr: 'Les Parcelles, toujours', en: 'Parcelles, always' },
    body: {
      fr: 'Son engagement auprès de la communauté sera présenté ici avec des informations approuvées par son équipe.',
      en: 'His community involvement will be presented here with information approved by his team.',
    },
    image: 'senegalJersey',
    placeholder: true,
  },
  {
    id: 'next',
    year: '—',
    category: 'next',
    title: { fr: 'Le prochain chapitre', en: 'The next chapter' },
    body: {
      fr: 'Un chapitre à écrire avec lui.',
      en: 'A chapter to be written with him.',
    },
    image: 'formalSuit',
    placeholder: true,
  },
];

/* -------------------------------------------------------------------------- */
/* ORIGINS — short sourced chapters.                                          */
/* -------------------------------------------------------------------------- */

export const originChapters: { id: string; label: Localized; title: Localized; body: Localized; source?: SourceKey }[] = [
  {
    id: 'quartier',
    label: { fr: 'Le quartier', en: 'The neighbourhood' },
    title: { fr: 'Le « Roc » des Parcelles', en: 'The “Roc” of Parcelles' },
    body: {
      fr: 'Aux Parcelles Assainies, à Dakar, on l’appelle le « Roc » des Parcelles. Le quartier n’est pas un décor : c’est le point de départ, et le point de retour.',
      en: 'In Parcelles Assainies, Dakar, he is known as the “Roc” of Parcelles. The neighbourhood is not a backdrop: it is the point of departure, and of return.',
    },
    source: 'ecuries',
  },
  {
    id: 'ecurie',
    label: { fr: 'L’écurie', en: 'The stable' },
    title: { fr: 'Rock Énergie', en: 'Rock Énergie' },
    body: {
      fr: 'Fondée en mai 2002 aux Parcelles Assainies par feu Demba Dia, l’écurie Rock Énergie est le cadre de sa formation de lutteur.',
      en: 'Founded in May 2002 in Parcelles Assainies by the late Demba Dia, the Rock Énergie stable is where he was shaped as a wrestler.',
    },
    source: 'ecuries',
  },
  {
    id: 'debut',
    label: { fr: 'Les débuts', en: 'The debut' },
    title: { fr: '4 février 2006', en: '4 February 2006' },
    body: {
      fr: 'Premier combat face à Pape Sène 2. Le début d’un long apprentissage dans l’arène.',
      en: 'First bout, against Pape Sène 2 — the start of a long apprenticeship in the arena.',
    },
    source: 'soleilRois',
  },
  {
    id: 'couronne',
    label: { fr: 'La couronne', en: 'The crown' },
    title: { fr: '28 juillet 2019', en: '28 July 2019' },
    body: {
      fr: 'Treize ans après ses débuts, il bat Eumeu Sène et devient Roi des arènes.',
      en: 'Thirteen years after his debut, he beat Eumeu Sène and became King of the Arenas.',
    },
    source: 'soleilRois',
  },
];
