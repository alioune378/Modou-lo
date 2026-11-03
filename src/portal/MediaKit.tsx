import { useEffect } from 'react';
import { partnerCategories } from '../content/editorial';
import { inscriptions, sources, type SourceKey } from '../content/facts';
import { Img, SourceLink, Wordmark } from '../components/ui';
import { ProvenanceBadge, usePortal } from './components';
import { modouLoDataset as data } from './data';
import type { SKey } from './strings';

/**
 * MEDIA KIT (#/media-kit) — print-ready pages.
 * "Exporter en PDF" uses the browser's print dialog; print CSS lays the pages out on A4.
 * A server-side PDF renderer can replace this later without changing the content.
 */
export function MediaKit() {
  const { s, L, num } = usePortal();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  const audience = data.audience.filter((m) => m.provenance !== 'demo' && m.provenance !== 'unavailable');
  const career = inscriptions.filter((i) => i.source);
  const deliverables: SKey[] = ['kit.d1', 'kit.d2', 'kit.d3', 'kit.d4', 'kit.d5', 'kit.d6'];
  const opps: [SKey, SKey][] = [
    ['opp.ambassador.t', 'opp.ambassador.b'],
    ['opp.events.t', 'opp.events.b'],
    ['opp.content.t', 'opp.content.b'],
    ['opp.sponsoring.t', 'opp.sponsoring.b'],
  ];

  return (
    <div className="kit">
      <div className="kit-toolbar no-print">
        <a className="page-back" href="#/" onClick={() => window.setTimeout(() => document.getElementById('partenariats')?.scrollIntoView(), 80)}>
          ← {s('kit.back')}
        </a>
        <div className="kit-tools">
          <button type="button" className="btn btn-gold" onClick={() => window.print()}>
            {s('kit.export')}
          </button>
          <span className="small muted">{s('kit.exportHint')}</span>
        </div>
      </div>

      {/* Page 1 — cover */}
      <section className="kit-page kit-cover">
        <div className="kit-cover-img">
          <Img k="arenaAttire" sizes="(max-width: 900px) 100vw, 900px" eager />
        </div>
        <div className="kit-cover-copy">
          <p className="eyebrow">{s('kit.title')}</p>
          <h1 className="display-1">Modou Lô</h1>
          <Wordmark className="kit-mark" />
          <p className="serif kit-tag">{s('pub.title')}</p>
        </div>
        <p className="kit-draft">{s('kit.draft')}</p>
      </section>

      {/* Page 2 — biography & highlights */}
      <section className="kit-page">
        <header className="kit-h">
          <span className="num">01</span>
          <h2 className="display-3">{s('kit.bio')}</h2>
        </header>
        <div className="kit-two">
          <p className="kit-lede serif">{s('kit.bioBody')}</p>
          <div className="kit-photo">
            <Img k="ceremonial" sizes="(max-width: 900px) 100vw, 360px" />
          </div>
        </div>
        <header className="kit-h">
          <span className="num">02</span>
          <h2 className="display-3">{s('kit.highlights')}</h2>
        </header>
        <ul className="kit-facts">
          {career.map((c) => (
            <li key={L(c.label)}>
              <span className="pp-k">{L(c.label)}</span>
              <span className="pp-v serif">{L(c.value)}</span>
              <span className="small muted">{L(c.detail)}</span>
            </li>
          ))}
        </ul>
        <p className="kit-draft">{s('kit.draft')}</p>
      </section>

      {/* Page 3 — audience & exposure */}
      <section className="kit-page">
        <header className="kit-h">
          <span className="num">03</span>
          <h2 className="display-3">{s('kit.audience')}</h2>
        </header>
        <ul className="kit-audience">
          {audience.map((m) => (
            <li key={m.id}>
              <span className="pp-big">
                {m.approximate && <span className="kpi-approx">≈</span>}
                {num(m.value as number, m.unit, true)}
              </span>
              <span className="pp-k">{L(m.label)}</span>
              <ProvenanceBadge p={m.provenance} />
            </li>
          ))}
        </ul>
        <p className="small muted">{s('pub.audienceNote')}</p>

        <header className="kit-h">
          <span className="num">04</span>
          <h2 className="display-3">{s('kit.exposure')}</h2>
        </header>
        <ul className="kit-press">
          {(Object.keys(sources) as SourceKey[]).map((k) => (
            <li key={k}>
              <SourceLink k={k} />
            </li>
          ))}
        </ul>
        <p className="kit-draft">{s('kit.draft')}</p>
      </section>

      {/* Page 4 — opportunities, deliverables, contact */}
      <section className="kit-page">
        <header className="kit-h">
          <span className="num">05</span>
          <h2 className="display-3">{s('kit.opps')}</h2>
        </header>
        <ul className="kit-opps">
          {opps.map(([t, b]) => (
            <li key={t}>
              <h3 className="serif">{s(t)}</h3>
              <p className="small muted">{s(b)}</p>
            </li>
          ))}
        </ul>
        <p className="small muted kit-sectors">{partnerCategories.map((c) => L(c.label)).join(' · ')}</p>

        <header className="kit-h">
          <span className="num">06</span>
          <h2 className="display-3">{s('kit.deliverables')}</h2>
        </header>
        <ul className="kit-deliv">
          {deliverables.map((d) => (
            <li key={d}>{s(d)}</li>
          ))}
        </ul>
        <p className="small muted">{s('kit.deliverablesNote')}</p>

        <div className="kit-contact">
          <div>
            <p className="eyebrow">{s('kit.contact')}</p>
            <p className="serif kit-contact-body">{s('kit.contactBody')}</p>
          </div>
          <p className="kit-rates">{s('kit.rates')}</p>
        </div>
        <p className="kit-draft">{s('kit.draft')}</p>
      </section>
    </div>
  );
}
