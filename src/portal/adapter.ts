import type { Metric, PortalDataset, Provenance } from './model';
import { modouLoDataset } from './data';

/**
 * DATA ADAPTERS — where portal figures come from.
 *
 * The demo only uses `fixtureAdapter`. Live use adds server-side adapters (see
 * PARTNERSHIP_PORTAL.md): each one runs in a protected backend function, holds its
 * own credentials, and returns metrics already labelled with provenance, source,
 * period and timestamps. The browser never sees platform tokens.
 */
export interface MetricsAdapter {
  id: string;
  /** Human-readable origin shown in the data register. */
  describe: string;
  load(): Promise<Partial<PortalDataset>>;
}

/** Bundled demo data (screenshot observations + clearly labelled illustrations). */
export const fixtureAdapter: MetricsAdapter = {
  id: 'fixtures',
  describe: 'Bundled demo dataset',
  load: async () => modouLoDataset,
};

/**
 * Manual upload: management supplies a JSON export of figures (e.g. from Meta Business
 * Suite). Every row is labelled "manual" unless a later check marks it "verified".
 */
export function manualUploadAdapter(rows: Array<Pick<Metric, 'id' | 'value'> & { asOf?: string; source?: string }>): MetricsAdapter {
  return {
    id: 'manual-upload',
    describe: 'Figures supplied by management',
    load: async () => {
      const now = new Date().toISOString().slice(0, 10);
      const patch = (m: Metric): Metric => {
        const row = rows.find((r) => r.id === m.id);
        if (!row || row.value === null || !Number.isFinite(row.value)) return m;
        return {
          ...m,
          value: row.value,
          approximate: false,
          provenance: 'manual',
          asOf: row.asOf,
          updatedAt: now,
          source: { label: { fr: row.source ?? 'Fourni par la direction', en: row.source ?? 'Supplied by management' } },
        };
      };
      return {
        audience: modouLoDataset.audience.map(patch),
        sponsorship: modouLoDataset.sponsorship.map(patch),
        digital: modouLoDataset.digital.map(patch),
      };
    },
  };
}

/** Merge adapters in order; later adapters win for the fields they return. */
export async function loadDataset(adapters: MetricsAdapter[]): Promise<PortalDataset> {
  let out = { ...modouLoDataset };
  for (const a of adapters) out = { ...out, ...(await a.load()) };
  return out;
}

/** Trust order, used to sort and to decide which badge wins when sources conflict. */
export const TRUST: Record<Provenance, number> = { verified: 4, manual: 3, screenshot: 2, demo: 1, unavailable: 0 };
