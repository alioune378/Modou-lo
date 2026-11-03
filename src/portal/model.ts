import type { Localized } from '../i18n';

/**
 * PARTNERSHIP PORTAL — structured metrics model.
 *
 * Reusable for any athlete or public figure: nothing here is specific to Modou Lô.
 * Every number on the portal is a `Metric`, and every metric carries where it came
 * from, which period it covers and when it was last updated.
 */

/** How much a figure can be trusted. Shown as a badge next to every value. */
export type Provenance =
  /** Pulled from an authorised source (platform API, analytics export) and checked. */
  | 'verified'
  /** Read off a screenshot. Approximate, date often unknown. */
  | 'screenshot'
  /** Typed in by management, not yet cross-checked. */
  | 'manual'
  /** Illustrative data for the demo. Never a real measurement. */
  | 'demo'
  /** No data yet: shows an empty state explaining what to connect. */
  | 'unavailable';

export type MetricSource = {
  label: Localized;
  url?: string;
};

export type Metric = {
  id: string;
  label: Localized;
  /** Null when provenance is "unavailable". */
  value: number | null;
  unit?: 'count' | 'percent';
  /** Rounded figures (e.g. screenshot observations) are shown with "≈". */
  approximate?: boolean;
  provenance: Provenance;
  source: MetricSource;
  /** Reporting period, e.g. "Snapshot", "Last 30 days". */
  period: Localized;
  /** Date the figure describes (ISO), if known. */
  asOf?: string;
  /** Date the figure was entered or last refreshed (ISO). */
  updatedAt: string;
  /** For "unavailable": what has to be connected to fill it. */
  requires?: Localized;
};

export type SeriesPoint = { date: string; value: number };

export type Series = {
  id: string;
  label: Localized;
  provenance: Provenance;
  source: MetricSource;
  unit?: 'count' | 'percent' | 'index';
  points: SeriesPoint[];
};

export type Breakdown = {
  id: string;
  label: Localized;
  provenance: Provenance;
  source: MetricSource;
  items: { label: Localized; value: number }[];
  requires?: Localized;
};

/** Sponsorship pipeline. */
export type InquiryStatus = 'new' | 'qualified' | 'discussion' | 'proposal' | 'won' | 'declined';

export type Inquiry = {
  id: string;
  company: string;
  type: string;
  received: string;
  status: InquiryStatus;
  /** Demo rows are fictional and never named after real companies. */
  provenance: 'demo' | 'verified';
};

/** Everything the portal needs for one athlete. Swap this object to reuse the portal. */
export type PortalDataset = {
  athlete: { name: string; alias?: string };
  generatedAt: string;
  audience: Metric[];
  sponsorship: Metric[];
  digital: Metric[];
  series: Series[];
  breakdowns: Breakdown[];
  inquiries: Inquiry[];
};
