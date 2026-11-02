import type { Localized } from '../i18n';
import type { MediaKey } from './media';

/* -------------------------------------------------------------------------- */
/* XARAGNE TV — curated, editable video list.                                  */
/* Only add videos whose publication has been authorised.                      */
/* `youtubeId` is embedded via youtube-nocookie.com.                           */
/* -------------------------------------------------------------------------- */

export type VideoCategory = 'documentary' | 'interview' | 'training' | 'entrance' | 'bts' | 'community' | 'announcement';

export type Video = {
  id: string;
  category: VideoCategory;
  title: Localized;
  youtubeId: string;
  /** Poster from the media registry (lightweight) — avoids loading YouTube until play. */
  poster: MediaKey;
  duration?: string; // e.g. "12:40" — only when known
};

/** Empty on purpose: no approved video has been supplied yet. */
export const videos: Video[] = [];

export const videoCategories: VideoCategory[] = [
  'documentary',
  'interview',
  'training',
  'entrance',
  'bts',
  'community',
  'announcement',
];

/** Visual placeholders shown while `videos` is empty. Not playable. */
export const videoSlots: { category: VideoCategory; poster: MediaKey }[] = [
  { category: 'interview', poster: 'interview' },
  { category: 'training', poster: 'strength' },
  { category: 'entrance', poster: 'stadiumWrestling' },
  { category: 'bts', poster: 'trainingArrival' },
  { category: 'documentary', poster: 'bwPortrait' },
  { category: 'community', poster: 'senegalJersey' },
];

/** Official social accounts — fill in only once verified with his team. */
export const socialLinks: { network: string; url: string }[] = [];

/* -------------------------------------------------------------------------- */
/* THE MAN BEYOND THE ARENA                                                    */
/* -------------------------------------------------------------------------- */

export const manChapters: { id: string; title: Localized; lead: Localized; image?: MediaKey }[] = [
  {
    id: 'values',
    title: { fr: 'Ses valeurs', en: 'His values' },
    lead: {
      fr: 'Ce qui le guide, dans ses propres mots — à recueillir lors d’un entretien approuvé.',
      en: 'What guides him, in his own words — to be gathered in an approved interview.',
    },
  },
  {
    id: 'discipline',
    title: { fr: 'La discipline', en: 'Discipline' },
    lead: {
      fr: 'Les heures de sable et de fonte qui ne se voient pas le jour du combat.',
      en: 'The hours of sand and iron that no one sees on fight day.',
    },
    image: 'strength',
  },
  {
    id: 'life',
    title: { fr: 'Hors de l’arène', en: 'Outside the arena' },
    lead: {
      fr: 'L’homme au quotidien, tel qu’il choisira de se montrer.',
      en: 'The man day to day, as he chooses to be seen.',
    },
    image: 'tracksuit',
  },
  {
    id: 'business',
    title: { fr: 'L’entrepreneur', en: 'The entrepreneur' },
    lead: {
      fr: 'Ses activités et projets professionnels, présentés avec son accord.',
      en: 'His business activities and projects, presented with his agreement.',
    },
    image: 'formalSuit',
  },
  {
    id: 'community',
    title: { fr: 'La communauté', en: 'Community' },
    lead: {
      fr: 'Le lien avec les Parcelles Assainies et ceux qui l’ont porté.',
      en: 'The bond with Parcelles Assainies and those who carried him.',
    },
    image: 'senegalJersey',
  },
  {
    id: 'future',
    title: { fr: 'Demain', en: 'Tomorrow' },
    lead: {
      fr: 'Ses aspirations pour la suite — un chapitre qu’il lui revient d’écrire.',
      en: 'His aspirations for what comes next — a chapter for him to write.',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* NEXT GENERATION — concepts only.                                            */
/* -------------------------------------------------------------------------- */

export const nextGenConcepts: { id: string; title: Localized; body: Localized }[] = [
  {
    id: 'academy',
    title: { fr: 'Académie Xaragne', en: 'Xaragne Academy' },
    body: {
      fr: 'Concept d’espace de formation pour jeunes lutteurs : technique, préparation physique, encadrement.',
      en: 'Concept for a training space for young wrestlers: technique, conditioning, supervision.',
    },
  },
  {
    id: 'mentorship',
    title: { fr: 'Mentorat', en: 'Mentorship' },
    body: {
      fr: 'Concept de transmission entre lutteurs confirmés et talents émergents, sur et hors de l’arène.',
      en: 'Concept for passing knowledge from seasoned wrestlers to emerging talent, in and out of the arena.',
    },
  },
  {
    id: 'impact',
    title: { fr: 'Rapports d’impact', en: 'Impact reports' },
    body: {
      fr: 'Concept de suivi public des actions menées, une fois une structure officielle établie.',
      en: 'Concept for public reporting on activities, once an official structure exists.',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* XARAGNE OFFICIAL — merchandise concepts (no commerce).                      */
/* -------------------------------------------------------------------------- */

export type Product = {
  id: string;
  name: Localized;
  line: Localized;
  kind: 'tee' | 'hoodie' | 'poster' | 'training' | 'accessory';
  tone: 'black' | 'ivory' | 'gold';
  image?: MediaKey;
};

export const products: Product[] = [
  {
    id: 'signature-tee',
    name: { fr: 'T-shirt Signature', en: 'Signature Tee' },
    line: { fr: 'Coton lourd · broderie or', en: 'Heavyweight cotton · gold embroidery' },
    kind: 'tee',
    tone: 'black',
  },
  {
    id: 'reign-hoodie',
    name: { fr: 'Hoodie « Le Règne »', en: '“The Reign” Hoodie' },
    line: { fr: 'Édition limitée 2019 — 2026', en: 'Limited edition 2019 — 2026' },
    kind: 'hoodie',
    tone: 'ivory',
  },
  {
    id: 'collector-poster',
    name: { fr: 'Affiche de collection', en: 'Collector poster' },
    line: { fr: 'Tirage numéroté · photographie à autoriser', en: 'Numbered print · photograph to be licensed' },
    kind: 'poster',
    tone: 'black',
    image: 'moodyCloseup',
  },
  {
    id: 'training-set',
    name: { fr: 'Ensemble d’entraînement', en: 'Training set' },
    line: { fr: 'Technique · respirant', en: 'Technical · breathable' },
    kind: 'training',
    tone: 'gold',
  },
  {
    id: 'crown-cap',
    name: { fr: 'Casquette Couronne', en: 'Crown Cap' },
    line: { fr: 'Accessoire commémoratif', en: 'Commemorative accessory' },
    kind: 'accessory',
    tone: 'black',
  },
];

/* -------------------------------------------------------------------------- */
/* PARTNERSHIPS                                                                */
/* -------------------------------------------------------------------------- */

export const partnerCategories: { id: string; label: Localized; body: Localized }[] = [
  {
    id: 'national',
    label: { fr: 'Grandes entreprises sénégalaises', en: 'Major Senegalese companies' },
    body: { fr: 'Ancrage local, fierté nationale.', en: 'Local roots, national pride.' },
  },
  {
    id: 'telecom',
    label: { fr: 'Télécoms & services financiers', en: 'Telecoms & financial services' },
    body: { fr: 'Proximité avec une audience mobile et connectée.', en: 'Close to a mobile, connected audience.' },
  },
  {
    id: 'sportswear',
    label: { fr: 'Équipementiers sportifs', en: 'Sportswear brands' },
    body: { fr: 'Performance, tradition et culture de l’arène.', en: 'Performance, tradition and arena culture.' },
  },
  {
    id: 'media',
    label: { fr: 'Médias & diffuseurs', en: 'Media & broadcasters' },
    body: { fr: 'Contenus, documentaires, formats exclusifs.', en: 'Content, documentaries, exclusive formats.' },
  },
  {
    id: 'events',
    label: { fr: 'Promoteurs & événements', en: 'Promoters & events' },
    body: { fr: 'Apparitions, galas, événements communautaires.', en: 'Appearances, galas, community events.' },
  },
  {
    id: 'international',
    label: { fr: 'Marques & organisations internationales', en: 'International brands & organisations' },
    body: { fr: 'Rayonnement auprès de la diaspora.', en: 'Reach across the diaspora.' },
  },
];
