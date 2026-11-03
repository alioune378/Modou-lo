import { useId, useMemo, useState, type PointerEvent } from 'react';
import { useI18n, type Lang } from '../i18n';
import { formatDate } from '../lib/hooks';
import type { Breakdown, Metric, Provenance, Series } from './model';
import { S, type SKey } from './strings';

const NUM: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB' };

/** Portal translation + number formatting. */
export function usePortal() {
  const { L, lang } = useI18n();
  const s = (k: SKey) => L(S[k]);
  const num = (v: number, unit?: 'count' | 'percent' | 'index', compact = false) => {
    const f = new Intl.NumberFormat(NUM[lang], {
      maximumFractionDigits: unit === 'percent' || unit === 'index' ? 1 : 0,
      ...(compact && v >= 10000 ? { notation: 'compact', maximumFractionDigits: 1 } : {}),
    }).format(v);
    return unit === 'percent' ? `${f} %`.replace(' %', lang === 'en' ? '%' : ' %') : f;
  };
  return { s, num, L, lang };
}

/* ------------------------------------------------------------ Badge */

export function ProvenanceBadge({ p }: { p: Provenance }) {
  const { s } = usePortal();
  return <span className={`prov prov-${p}`}>{s(`prov.${p}` as SKey)}</span>;
}

export function ProvenanceLegend() {
  const { s } = usePortal();
  const all: Provenance[] = ['verified', 'screenshot', 'manual', 'demo', 'unavailable'];
  return (
    <details className="prov-legend">
      <summary>{s('prov.legend')}</summary>
      <dl>
        {all.map((p) => (
          <div key={p}>
            <dt>
              <ProvenanceBadge p={p} />
            </dt>
            <dd>{s(`prov.${p}.d` as SKey)}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

/* ------------------------------------------------------------ KPI */

export function KpiCard({ m }: { m: Metric }) {
  const { s, num, L, lang } = usePortal();
  const missing = m.value === null;
  return (
    <article className={`kpi kpi-${m.provenance}`}>
      <header className="kpi-head">
        <h4>{L(m.label)}</h4>
        <ProvenanceBadge p={m.provenance} />
      </header>
      {missing ? (
        <p className="kpi-empty">
          <span className="kpi-dash" aria-hidden="true">
            —
          </span>
          <span>
            <b>{s('kpi.requires')} :</b> {m.requires ? L(m.requires) : ''}
          </span>
        </p>
      ) : (
        <p className="kpi-value">
          {m.approximate && <span className="kpi-approx">≈</span>}
          {num(m.value as number, m.unit, true)}
        </p>
      )}
      <details className="kpi-meta">
        <summary>{s('kpi.source')}</summary>
        <dl>
          <div>
            <dt>{s('kpi.source')}</dt>
            <dd>{m.source.url ? <a href={m.source.url} target="_blank" rel="noopener noreferrer">{L(m.source.label)}</a> : L(m.source.label)}</dd>
          </div>
          <div>
            <dt>{s('kpi.period')}</dt>
            <dd>{L(m.period)}</dd>
          </div>
          {m.provenance !== 'unavailable' && (
            <div>
              <dt>{s('kpi.asOf')}</dt>
              <dd>{m.asOf ? formatDate(m.asOf, lang) : s('kpi.asOfUnknown')}</dd>
            </div>
          )}
          <div>
            <dt>{s('kpi.updated')}</dt>
            <dd>{formatDate(m.updatedAt, lang)}</dd>
          </div>
        </dl>
      </details>
    </article>
  );
}

/* ------------------------------------------------------------ Trend chart */

/** Line chart drawn to one scale, with gridlines, an emphasised endpoint and a pointer tooltip. */
export function TrendChart({ series, days }: { series: Series; days: number }) {
  const { s, num, L, lang } = usePortal();
  const uid = useId().replace(/:/g, '');
  const pts = series.points.slice(-days);
  const [hover, setHover] = useState<number | null>(null);

  const W = 640;
  const H = 240;
  const pad = { l: 52, r: 18, t: 18, b: 30 };

  const { min, max, ticks } = useMemo(() => {
    const vals = pts.map((p) => p.value);
    let lo = Math.min(...vals);
    let hi = Math.max(...vals);
    const span = hi - lo || 1;
    lo -= span * 0.12;
    hi += span * 0.12;
    if (series.unit !== 'index') lo = Math.max(0, lo);
    const step = niceStep((hi - lo) / 4);
    const start = Math.floor(lo / step) * step;
    // Ticks always span the full data range: the last tick is at or above the highest value.
    const t: number[] = [Math.round(start * 100) / 100];
    while (t[t.length - 1] < hi) t.push(Math.round((t[t.length - 1] + step) * 100) / 100);
    return { min: t[0], max: t[t.length - 1], ticks: t };
  }, [pts, series.unit]);

  const x = (i: number) => pad.l + (i / Math.max(1, pts.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min || 1)) * (H - pad.t - pad.b);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join('');
  const area = `${line}L${x(pts.length - 1).toFixed(1)},${H - pad.b}L${pad.l},${H - pad.b}Z`;

  const first = pts[0]?.value ?? 0;
  const last = pts[pts.length - 1]?.value ?? 0;
  const avg = pts.reduce((a, p) => a + p.value, 0) / Math.max(1, pts.length);
  const change = series.unit === 'percent' ? last - first : first ? ((last - first) / first) * 100 : 0;

  const xLabels = [0, Math.floor((pts.length - 1) / 2), pts.length - 1];
  const short = (iso: string) =>
    new Date(iso + 'T12:00:00Z').toLocaleDateString(NUM[lang], { day: 'numeric', month: 'short', timeZone: 'UTC' });

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (pts.length - 1));
    setHover(Math.max(0, Math.min(pts.length - 1, i)));
  };

  const h = hover !== null ? pts[hover] : null;

  return (
    <figure className="chart">
      <figcaption className="chart-head">
        <div>
          <h4>{L(series.label)}</h4>
          <p className="chart-stats">
            <span>
              {s('chart.avg')} <b>{num(avg, series.unit)}</b>
            </span>
            <span>
              {s('chart.change')}{' '}
              <b>
                {change >= 0 ? '+' : '−'}
                {series.unit === 'percent' ? `${num(Math.abs(change), 'index')} pt` : num(Math.abs(change), 'percent')}
              </b>
            </span>
          </p>
        </div>
        <ProvenanceBadge p={series.provenance} />
      </figcaption>
      <div className="chart-box">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`${L(series.label)} — ${s('chart.demo')}`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c9a35f" stopOpacity="0.28" />
              <stop offset="1" stopColor="#c9a35f" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((tk) => (
            <g key={tk}>
              <line x1={pad.l} x2={W - pad.r} y1={y(tk)} y2={y(tk)} className="chart-grid" />
              <text x={pad.l - 10} y={y(tk) + 4} textAnchor="end" className="chart-tick">
                {num(tk, series.unit === 'percent' ? 'percent' : undefined, true)}
              </text>
            </g>
          ))}
          {xLabels.map((i, k) => (
            <text key={i} x={x(i)} y={H - 8} textAnchor={k === 0 ? 'start' : k === 2 ? 'end' : 'middle'} className="chart-tick">
              {pts[i] ? short(pts[i].date) : ''}
            </text>
          ))}
          {series.provenance === 'demo' && (
            <text x={(W + pad.l) / 2} y={H / 2 + 8} textAnchor="middle" className="chart-watermark">
              {s('chart.demo').toUpperCase()}
            </text>
          )}
          <path d={area} fill={`url(#fill-${uid})`} />
          <path d={line} className="chart-line" />
          <circle cx={x(pts.length - 1)} cy={y(last)} r="4.5" className="chart-end" />
          {h && hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="chart-cursor" />
              <circle cx={x(hover)} cy={y(h.value)} r="4" className="chart-dot" />
            </g>
          )}
        </svg>
        {h && hover !== null && (
          <div className="chart-tip" style={{ left: `${(x(hover) / W) * 100}%` }}>
            <span>{formatDate(h.date, lang)}</span>
            <b>{num(h.value, series.unit)}</b>
          </div>
        )}
      </div>
    </figure>
  );
}

function niceStep(raw: number) {
  const p = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

/* ------------------------------------------------------------ Breakdown */

export function BarList({ b }: { b: Breakdown }) {
  const { s, L, num } = usePortal();
  const total = b.items.reduce((a, i) => a + i.value, 0) || 1;
  const top = Math.max(1, ...b.items.map((i) => i.value));
  return (
    <article className={`barlist kpi-${b.provenance}`}>
      <header className="kpi-head">
        <h4>{L(b.label)}</h4>
        <ProvenanceBadge p={b.provenance} />
      </header>
      {b.items.length === 0 ? (
        <p className="kpi-empty">
          <span className="kpi-dash" aria-hidden="true">
            —
          </span>
          <span>
            <b>{s('kpi.requires')} :</b> {b.requires ? L(b.requires) : ''}
          </span>
        </p>
      ) : (
        <ol>
          {b.items.map((i) => (
            <li key={L(i.label)}>
              <span className="bl-label">{L(i.label)}</span>
              <span className="bl-val">{num((i.value / total) * 100, 'percent')}</span>
              <span className="bl-track" aria-hidden="true">
                <i style={{ width: `${(i.value / top) * 100}%` }} />
              </span>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

/* ------------------------------------------------------------ CSV */

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const esc = (v: string | number) => {
    const t = String(v);
    return /[",;\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  const csv = '﻿' + rows.map((r) => r.map(esc).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
