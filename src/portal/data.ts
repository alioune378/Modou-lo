import type { Breakdown, Inquiry, Metric, MetricSource, PortalDataset, Series } from './model';

/**
 * MODOU LÔ — portal dataset.
 *
 * Only two real-world figures exist so far: the Instagram and Facebook follower counts
 * read off reference screenshots supplied to Dalal Technologies. They are approximate,
 * undated and unverified, and are labelled that way everywhere.
 *
 * Everything else is either illustrative demo data (clearly marked) or "unavailable"
 * until an authorised source is connected. Nothing here describes real engagement,
 * geography, demographics, revenue, impressions or sponsors.
 */

const RECORDED = '2026-11-03';

const SCREENSHOT: MetricSource = {
  label: {
    fr: 'Capture d’écran de référence fournie à Dalal Technologies (date de la capture inconnue)',
    en: 'Reference screenshot supplied to Dalal Technologies (screenshot date unknown)',
  },
};
const DEMO: MetricSource = {
  label: { fr: 'Données d’illustration générées pour la démonstration', en: 'Illustrative data generated for the demo' },
};
const SNAPSHOT = { fr: 'Instantané', en: 'Snapshot' };
const DEMO_PERIOD = { fr: 'Période fictive (démo)', en: 'Fictional period (demo)' };

const unavailable = (id: string, label: Metric['label'], requires: Metric['requires']): Metric => ({
  id,
  label,
  value: null,
  provenance: 'unavailable',
  source: { label: { fr: 'Aucune source connectée', en: 'No source connected' } },
  period: { fr: '—', en: '—' },
  updatedAt: RECORDED,
  requires,
});

const demo = (id: string, label: Metric['label'], value: number, unit: Metric['unit'] = 'count'): Metric => ({
  id,
  label,
  value,
  unit,
  provenance: 'demo',
  source: DEMO,
  period: DEMO_PERIOD,
  updatedAt: RECORDED,
});

const audience: Metric[] = [
  {
    id: 'instagram-followers',
    label: { fr: 'Abonnés Instagram', en: 'Instagram followers' },
    value: 265000,
    approximate: true,
    provenance: 'screenshot',
    source: SCREENSHOT,
    period: SNAPSHOT,
    updatedAt: RECORDED,
  },
  {
    id: 'facebook-followers',
    label: { fr: 'Abonnés Facebook', en: 'Facebook followers' },
    value: 82000,
    approximate: true,
    provenance: 'screenshot',
    source: SCREENSHOT,
    period: SNAPSHOT,
    updatedAt: RECORDED,
  },
  unavailable(
    'youtube-subscribers',
    { fr: 'Abonnés YouTube', en: 'YouTube subscribers' },
    { fr: 'Chaîne officielle à vérifier, puis YouTube Analytics', en: 'Verify the official channel, then YouTube Analytics' },
  ),
  demo('engagement-rate', { fr: 'Taux d’engagement', en: 'Engagement rate' }, 4.8, 'percent'),
  demo('video-views', { fr: 'Vues vidéo', en: 'Video views' }, 1240000),
  demo('website-visitors', { fr: 'Visiteurs du site', en: 'Website visitors' }, 18400),
];

const sponsorship: Metric[] = [
  demo('inquiries', { fr: 'Demandes de partenariat', en: 'Partnership inquiries' }, 9),
  demo('qualified', { fr: 'Opportunités qualifiées', en: 'Qualified opportunities' }, 4),
  demo('campaigns', { fr: 'Campagnes actives', en: 'Active campaigns' }, 2),
  demo('campaign-reach', { fr: 'Portée des campagnes', en: 'Campaign reach' }, 310000),
  demo('referrals', { fr: 'Visites issues des partenaires', en: 'Visits referred by partners' }, 1260),
  demo('conversions', { fr: 'Conversions (formulaires)', en: 'Conversions (forms)' }, 37),
];

const digital: Metric[] = [
  demo('sessions', { fr: 'Sessions sur le site', en: 'Website sessions' }, 24600),
  unavailable(
    'newsletter',
    { fr: 'Abonnés newsletter', en: 'Newsletter subscribers' },
    { fr: 'Activer l’envoi des formulaires et un outil d’e-mailing', en: 'Turn on form delivery and an email tool' },
  ),
  unavailable(
    'fan-optins',
    { fr: 'Inscriptions communauté (avec consentement)', en: 'Community opt-ins (with consent)' },
    { fr: 'Activer l’envoi des formulaires', en: 'Turn on form delivery' },
  ),
  unavailable(
    'merch',
    { fr: 'Conversions boutique', en: 'Shop conversions' },
    { fr: 'Licence de marque et boutique en ligne', en: 'Brand licence and an online shop' },
  ),
];

/** Deterministic pseudo-random walk so the demo looks the same on every visit. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Smooth, mean-reverting demo series: drifts toward a (possibly rising) target with
 * small daily noise. Optional weekly rhythm for traffic-like data.
 */
function walk(
  seed: number,
  days: number,
  opts: { start: number; target: number; growth?: number; pull?: number; noise: number; weekly?: number; min?: number; max?: number },
  end = '2026-11-02',
) {
  const r = seeded(seed);
  const last = new Date(end + 'T12:00:00Z').getTime();
  const pts = [];
  let v = opts.start;
  let target = opts.target;
  for (let i = days - 1; i >= 0; i--) {
    const t = last - i * 86400000;
    target *= 1 + (opts.growth ?? 0);
    v += (target - v) * (opts.pull ?? 0.08) + (r() - 0.5) * opts.noise;
    const wd = new Date(t).getUTCDay();
    const week = opts.weekly && (wd === 0 || wd === 6) ? 1 + opts.weekly : 1;
    let out = v * week;
    if (opts.min !== undefined) out = Math.max(opts.min, out);
    if (opts.max !== undefined) out = Math.min(opts.max, out);
    pts.push({ date: new Date(t).toISOString().slice(0, 10), value: Math.round(out * 10) / 10 });
  }
  return pts;
}

const series: Series[] = [
  {
    id: 'audience-index',
    label: { fr: 'Croissance de l’audience (indice 100)', en: 'Audience growth (index 100)' },
    provenance: 'demo',
    source: DEMO,
    unit: 'index',
    points: walk(11, 365, { start: 100, target: 100, growth: 0.0009, pull: 0.12, noise: 0.5 }),
  },
  {
    id: 'engagement',
    label: { fr: 'Taux d’engagement', en: 'Engagement rate' },
    provenance: 'demo',
    source: DEMO,
    unit: 'percent',
    points: walk(29, 365, { start: 4.6, target: 4.8, pull: 0.1, noise: 0.45, min: 2.5, max: 8 }),
  },
  {
    id: 'visitors',
    label: { fr: 'Visiteurs du site', en: 'Website visitors' },
    provenance: 'demo',
    source: DEMO,
    unit: 'count',
    points: walk(47, 365, { start: 420, target: 420, growth: 0.0018, pull: 0.15, noise: 70, weekly: 0.12, min: 0 }),
  },
];

const breakdowns: Breakdown[] = [
  {
    id: 'traffic-sources',
    label: { fr: 'Sources de trafic', en: 'Traffic sources' },
    provenance: 'demo',
    source: DEMO,
    items: [
      { label: { fr: 'Instagram', en: 'Instagram' }, value: 41 },
      { label: { fr: 'Recherche Google', en: 'Google search' }, value: 23 },
      { label: { fr: 'Accès direct', en: 'Direct' }, value: 16 },
      { label: { fr: 'Facebook', en: 'Facebook' }, value: 12 },
      { label: { fr: 'Sites de presse', en: 'Press sites' }, value: 8 },
    ],
  },
  {
    id: 'top-content',
    label: { fr: 'Contenus les plus consultés', en: 'Most-viewed content' },
    provenance: 'demo',
    source: DEMO,
    items: [
      { label: { fr: 'Le panthéon des combats', en: 'Hall of glory' }, value: 34 },
      { label: { fr: 'Son histoire', en: 'His story' }, value: 27 },
      { label: { fr: 'Chronologie', en: 'Timeline' }, value: 18 },
      { label: { fr: 'Xaragne TV', en: 'Xaragne TV' }, value: 12 },
      { label: { fr: 'Partenariats', en: 'Partnerships' }, value: 9 },
    ],
  },
  {
    id: 'countries',
    label: { fr: 'Pays des visiteurs', en: 'Visitor countries' },
    provenance: 'unavailable',
    source: { label: { fr: 'Aucune source connectée', en: 'No source connected' } },
    items: [],
    requires: { fr: 'Outil d’analyse du site, avec consentement des visiteurs', en: 'Website analytics, with visitor consent' },
  },
  {
    id: 'social-geography',
    label: { fr: 'Géographie de l’audience sociale', en: 'Social audience geography' },
    provenance: 'unavailable',
    source: { label: { fr: 'Aucune source connectée', en: 'No source connected' } },
    items: [],
    requires: { fr: 'Statistiques Meta (Instagram et Facebook) autorisées par la direction', en: 'Meta insights (Instagram and Facebook) authorised by management' },
  },
  {
    id: 'age-gender',
    label: { fr: 'Âge et genre', en: 'Age and gender' },
    provenance: 'unavailable',
    source: { label: { fr: 'Aucune source connectée', en: 'No source connected' } },
    items: [],
    requires: { fr: 'Statistiques Meta agrégées uniquement, si la direction le souhaite', en: 'Aggregated Meta insights only, if management wishes' },
  },
];

const inquiries: Inquiry[] = [
  { id: 'd1', company: 'Organisation exemple A', type: 'ambassador', received: '2026-10-29', status: 'new', provenance: 'demo' },
  { id: 'd2', company: 'Organisation exemple B', type: 'appearance', received: '2026-10-24', status: 'qualified', provenance: 'demo' },
  { id: 'd3', company: 'Organisation exemple C', type: 'content', received: '2026-10-17', status: 'discussion', provenance: 'demo' },
  { id: 'd4', company: 'Organisation exemple D', type: 'sponsoring', received: '2026-10-08', status: 'proposal', provenance: 'demo' },
  { id: 'd5', company: 'Organisation exemple E', type: 'appearance', received: '2026-09-30', status: 'declined', provenance: 'demo' },
  { id: 'd6', company: 'Organisation exemple F', type: 'sponsoring', received: '2026-09-21', status: 'new', provenance: 'demo' },
];

export const modouLoDataset: PortalDataset = {
  athlete: { name: 'Modou Lô', alias: 'Xaragne Lô' },
  generatedAt: RECORDED,
  audience,
  sponsorship,
  digital,
  series,
  breakdowns,
  inquiries,
};
