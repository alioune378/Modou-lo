import { useEffect, useMemo, useState } from 'react';
import { sources, type SourceKey } from '../content/facts';
import { formatDate } from '../lib/hooks';
import { SourceLink, Wordmark } from '../components/ui';
import { BarList, KpiCard, ProvenanceBadge, ProvenanceLegend, TrendChart, downloadCsv, usePortal } from './components';
import { modouLoDataset as data } from './data';
import type { Inquiry, InquiryStatus, Metric } from './model';
import type { SKey } from './strings';

type Tab = 'audience' | 'sponsorship' | 'digital' | 'assets';
const TABS: Tab[] = ['audience', 'sponsorship', 'digital', 'assets'];
const STATUSES: InquiryStatus[] = ['new', 'qualified', 'discussion', 'proposal', 'won', 'declined'];
const RANGES = [30, 90, 365] as const;
const KEY = 'xl-portal-demo';

function readFlag() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * EXECUTIVE DASHBOARD (#/espace-direction).
 *
 * DEMO ONLY: the gate below is not authentication. It exists so the preview is never
 * mistaken for a live system. Live use requires named accounts and server-side
 * authorisation before any private figure is served (see PARTNERSHIP_PORTAL.md).
 */
export function Dashboard() {
  const { s } = usePortal();
  const [open, setOpen] = useState(readFlag);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [open]);

  if (!open) {
    return (
      <div className="portal portal-gate">
        <Wordmark className="gate-mark" />
        <p className="eyebrow">{s('dash.sub')}</p>
        <h1 className="display-2">{s('gate.title')}</h1>
        <p className="lede">{s('gate.body')}</p>
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => {
            try {
              sessionStorage.setItem(KEY, '1');
            } catch {
              /* storage unavailable: preview still opens */
            }
            setOpen(true);
          }}
        >
          {s('gate.enter')}
        </button>
        <a className="page-back" href="#/">
          ← {s('gate.back')}
        </a>
      </div>
    );
  }
  return (
    <Workspace
      onExit={() => {
        try {
          sessionStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
        setOpen(false);
      }}
    />
  );
}

function Workspace({ onExit }: { onExit: () => void }) {
  const { s, L, lang } = usePortal();
  const [tab, setTab] = useState<Tab>('audience');
  const [days, setDays] = useState<(typeof RANGES)[number]>(90);
  const [pipeline, setPipeline] = useState<Inquiry[]>(data.inquiries);

  const series = (id: string) => data.series.find((x) => x.id === id)!;
  const breakdown = (id: string) => data.breakdowns.find((x) => x.id === id)!;
  const allMetrics: Metric[] = useMemo(() => [...data.audience, ...data.sponsorship, ...data.digital], []);

  const exportMetrics = () =>
    downloadCsv(`xaragne-lo-indicateurs-${data.generatedAt}.csv`, [
      ['id', 'indicator', 'value', 'approximate', 'provenance', 'source', 'period', 'as_of', 'updated_at'],
      ...allMetrics.map((m) => [
        m.id,
        L(m.label),
        m.value ?? '',
        m.approximate ? 'yes' : 'no',
        m.provenance,
        L(m.source.label),
        L(m.period),
        m.asOf ?? '',
        m.updatedAt,
      ]),
    ]);
  const exportPipeline = () =>
    downloadCsv(`xaragne-lo-pipeline-${data.generatedAt}.csv`, [
      ['organisation', 'type', 'received', 'status', 'provenance'],
      ...pipeline.map((p) => [p.company, s(`type.${p.type}` as SKey), p.received, s(`status.${p.status}` as SKey), p.provenance]),
    ]);

  const statusCounts = STATUSES.map((st) => ({ st, n: pipeline.filter((p) => p.status === st).length }));
  const maxCount = Math.max(1, ...statusCounts.map((c) => c.n));

  return (
    <div className="portal">
      <header className="portal-head">
        <div className="portal-id">
          <p className="eyebrow">Xaragne Lô · {s('dash.sub')}</p>
          <h1 className="display-3 portal-title">{s('dash.title')}</h1>
        </div>
        <div className="portal-actions">
          <button type="button" className="btn btn-line" onClick={exportMetrics}>
            ↓ {s('report.metrics')}
          </button>
          <a className="btn btn-line" href="#/media-kit">
            {s('report.kit')}
          </a>
          <button type="button" className="btn btn-line" onClick={onExit}>
            {s('gate.exit')}
          </button>
        </div>
      </header>

      <p className="portal-banner" role="note">
        {s('dash.demoBanner')}
      </p>
      <ProvenanceLegend />

      <div className="portal-bar">
        <div className="tabs portal-tabs" role="tablist" aria-label={s('dash.title')}>
          {TABS.map((k, i) => (
            <button
              key={k}
              role="tab"
              id={`ptab-${k}`}
              aria-selected={tab === k}
              aria-controls={`ppanel-${k}`}
              className={tab === k ? 'is-active' : ''}
              onClick={() => setTab(k)}
            >
              <span className="num">{String.fromCharCode(65 + i)}</span> {s(`tab.${k}` as SKey)}
            </button>
          ))}
        </div>
        {(tab === 'audience' || tab === 'digital') && (
          <div className="range" role="group" aria-label={s('range.label')}>
            {RANGES.map((r) => (
              <button key={r} type="button" aria-pressed={days === r} className={days === r ? 'is-active' : ''} onClick={() => setDays(r)}>
                {s(`range.${r}` as SKey)}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === 'audience' && (
        <section role="tabpanel" id="ppanel-audience" aria-labelledby="ptab-audience" className="portal-panel">
          <div className="kpi-grid">
            {data.audience.map((m) => (
              <KpiCard key={m.id} m={m} />
            ))}
          </div>
          <div className="chart-grid2">
            <TrendChart series={series('audience-index')} days={days} />
            <TrendChart series={series('engagement')} days={days} />
          </div>
          <div className="bar-grid">
            <BarList b={breakdown('social-geography')} />
            <BarList b={breakdown('age-gender')} />
          </div>
        </section>
      )}

      {tab === 'sponsorship' && (
        <section role="tabpanel" id="ppanel-sponsorship" aria-labelledby="ptab-sponsorship" className="portal-panel">
          <div className="kpi-grid">
            {data.sponsorship.map((m) => (
              <KpiCard key={m.id} m={m} />
            ))}
          </div>
          <article className="pipe">
            <header className="kpi-head">
              <h4>{s('pipe.title')}</h4>
              <ProvenanceBadge p="demo" />
            </header>
            <ol className="funnel" aria-label={s('pipe.status')}>
              {statusCounts.map(({ st, n }) => (
                <li key={st} className={`st-${st}`}>
                  <span className="funnel-n">{n}</span>
                  <span className="funnel-bar" aria-hidden="true">
                    <i style={{ height: `${(n / maxCount) * 100}%` }} />
                  </span>
                  <span className="funnel-l">{s(`status.${st}` as SKey)}</span>
                </li>
              ))}
            </ol>
            <div className="table-scroll">
              <table className="pipe-table">
                <thead>
                  <tr>
                    <th scope="col">{s('pipe.company')}</th>
                    <th scope="col">{s('pipe.type')}</th>
                    <th scope="col">{s('pipe.received')}</th>
                    <th scope="col">{s('pipe.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pipeline.map((p) => (
                    <tr key={p.id}>
                      <td>{p.company}</td>
                      <td>{s(`type.${p.type}` as SKey)}</td>
                      <td className="tnum">{formatDate(p.received, lang)}</td>
                      <td>
                        <label className="sr-only" htmlFor={`st-${p.id}`}>
                          {s('pipe.status')} — {p.company}
                        </label>
                        <select
                          id={`st-${p.id}`}
                          className={`status-select st-${p.status}`}
                          value={p.status}
                          onChange={(e) =>
                            setPipeline((rows) => rows.map((r) => (r.id === p.id ? { ...r, status: e.target.value as InquiryStatus } : r)))
                          }
                        >
                          {STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {s(`status.${st}` as SKey)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pipe-foot">
              <p className="small muted">{s('pipe.note')}</p>
              <button type="button" className="btn btn-line" onClick={exportPipeline}>
                ↓ {s('report.pipeline')}
              </button>
            </div>
          </article>
        </section>
      )}

      {tab === 'digital' && (
        <section role="tabpanel" id="ppanel-digital" aria-labelledby="ptab-digital" className="portal-panel">
          <div className="kpi-grid">
            {data.digital.map((m) => (
              <KpiCard key={m.id} m={m} />
            ))}
          </div>
          <TrendChart series={series('visitors')} days={days} />
          <div className="bar-grid bar-grid-3">
            <BarList b={breakdown('traffic-sources')} />
            <BarList b={breakdown('top-content')} />
            <BarList b={breakdown('countries')} />
          </div>
        </section>
      )}

      {tab === 'assets' && (
        <section role="tabpanel" id="ppanel-assets" aria-labelledby="ptab-assets" className="portal-panel">
          <ul className="assets">
            {(
              [
                ['assets.bio', 'assets.bio.s', '#/histoire'],
                ['assets.stats', 'assets.stats.s', '#/'],
                ['assets.photos', 'assets.photos.s', '#/concept'],
                ['assets.brand', 'assets.brand.s', '#/concept'],
                ['assets.kit', 'assets.kit.s', '#/media-kit'],
              ] as [SKey, SKey, string][]
            ).map(([t, st, href]) => (
              <li key={t} className="asset">
                <div>
                  <h4>{s(t)}</h4>
                  <p className="small muted">{s(st)}</p>
                </div>
                <a className="btn btn-line" href={href}>
                  {s('assets.open')}
                </a>
              </li>
            ))}
            <li className="asset asset-press">
              <div>
                <h4>{s('assets.press')}</h4>
                <ul>
                  {(Object.keys(sources) as SourceKey[]).map((k) => (
                    <li key={k}>
                      <SourceLink k={k} />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>

          <article className="register">
            <header>
              <h4>{s('register.title')}</h4>
              <p className="small muted">{s('register.body')}</p>
            </header>
            <div className="table-scroll">
              <table className="pipe-table">
                <thead>
                  <tr>
                    <th scope="col">{s('register.metric')}</th>
                    <th scope="col">{s('kpi.source')}</th>
                    <th scope="col">{s('kpi.period')}</th>
                    <th scope="col">{s('kpi.updated')}</th>
                  </tr>
                </thead>
                <tbody>
                  {allMetrics.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <span className="reg-name">{L(m.label)}</span>
                        <ProvenanceBadge p={m.provenance} />
                      </td>
                      <td className="small">{L(m.source.label)}</td>
                      <td className="small">{L(m.period)}</td>
                      <td className="small tnum">{formatDate(m.updatedAt, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-line" onClick={exportMetrics}>
              ↓ {s('report.metrics')}
            </button>
          </article>
        </section>
      )}
    </div>
  );
}
