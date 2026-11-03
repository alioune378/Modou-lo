import { useState } from 'react';
import { partnerCategories } from '../content/editorial';
import { inscriptions, sources, type SourceKey } from '../content/facts';
import { useI18n } from '../i18n';
import { goToSection } from '../lib/hooks';
import { Form } from '../components/Form';
import { Img, Reveal, SourceLink } from '../components/ui';
import { ProvenanceBadge, usePortal } from './components';
import { modouLoDataset } from './data';
import type { SKey } from './strings';

const OPPS: { id: string; t: SKey; b: SKey }[] = [
  { id: 'ambassador', t: 'opp.ambassador.t', b: 'opp.ambassador.b' },
  { id: 'events', t: 'opp.events.t', b: 'opp.events.b' },
  { id: 'content', t: 'opp.content.t', b: 'opp.content.b' },
  { id: 'sponsoring', t: 'opp.sponsoring.t', b: 'opp.sponsoring.b' },
];

const PUBLIC_AUDIENCE = ['instagram-followers', 'facebook-followers'];

/** EXPERIENCE 10 — Partenariats (public). Private analytics live at #/espace-direction. */
export function PartnershipsPublic() {
  const { t, L } = useI18n();
  const { s, num } = usePortal();
  const [tab, setTab] = useState<'partner' | 'appearance' | 'press'>('partner');
  const audience = modouLoDataset.audience.filter((m) => PUBLIC_AUDIENCE.includes(m.id));
  const career = inscriptions.filter((i) => i.source);
  const typeOptions = (['ambassador', 'sponsoring', 'appearance', 'content', 'other'] as const).map((v) => ({
    value: v,
    label: s(`type.${v}` as SKey),
  }));
  const budgetOptions = (['tbd', '1', '2', '3', '4'] as const).map((v) => ({ value: v, label: s(`budget.${v}` as SKey) }));

  return (
    <section id="partenariats" className="partners section" aria-labelledby="partners-title">
      <div className="partners-hero">
        <div className="partners-img">
          <Img k="formalSuit" sizes="(max-width: 900px) 100vw, 45vw" />
        </div>
        <Reveal className="partners-copy">
          <p className="eyebrow">{s('pub.eyebrow')}</p>
          <h2 id="partners-title" className="display-2 pp-title">
            {s('pub.title')}
          </h2>
          <p className="lede">{s('pub.body')}</p>
          <div className="pp-ctas">
            <button type="button" className="btn btn-gold" onClick={() => goToSection('demande-partenariat')}>
              {s('pub.cta')}
            </button>
            <a className="btn btn-ghost" href="#/media-kit">
              {s('pub.kit')}
            </a>
          </div>
          <p className="small muted pp-note">{s('pub.note')}</p>
        </Reveal>
      </div>

      <div className="pp-grid">
        <Reveal className="pp-block">
          <h3 className="eyebrow">{s('pub.career')}</h3>
          <ul className="pp-career">
            {career.map((c) => (
              <li key={L(c.label)}>
                <span className="pp-k">{L(c.label)}</span>
                <span className="pp-v serif">{L(c.value)}</span>
                <span className="small muted">{L(c.detail)}</span>
                {c.source && <SourceLink k={c.source} compact />}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="pp-side">
          <Reveal className="pp-block">
            <h3 className="eyebrow">{s('pub.audience')}</h3>
            <ul className="pp-audience">
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
          </Reveal>

          <Reveal className="pp-block">
            <h3 className="eyebrow">{s('pub.media')}</h3>
            <p className="small muted">{s('pub.mediaNote')}</p>
            <ul className="pp-press">
              {(Object.keys(sources) as SourceKey[]).map((k) => (
                <li key={k}>
                  <SourceLink k={k} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <h3 className="partners-cat-title eyebrow">{s('pub.opps')}</h3>
      <ul className="pp-opps">
        {OPPS.map((o, i) => (
          <Reveal as="li" key={o.id} delay={i * 70} className="card">
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <h4 className="card-title">{s(o.t)}</h4>
            <p className="muted small">{s(o.b)}</p>
          </Reveal>
        ))}
      </ul>

      <h3 className="partners-cat-title eyebrow">{s('pub.categories')}</h3>
      <ul className="partner-cats">
        {partnerCategories.map((c, i) => (
          <Reveal as="li" key={c.id} delay={i * 60}>
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <h4>{L(c.label)}</h4>
            <p className="muted small">{L(c.body)}</p>
          </Reveal>
        ))}
      </ul>

      <div className="partners-forms card" id="demande-partenariat">
        <div className="pp-form-head">
          <h3 className="display-3">{s('pub.formTitle')}</h3>
          <p className="muted small">{s('pub.formBody')}</p>
        </div>
        <div className="tabs" role="tablist" aria-label={s('pub.formTitle')}>
          {(['partner', 'appearance', 'press'] as const).map((k) => (
            <button
              key={k}
              role="tab"
              id={`tab-${k}`}
              aria-selected={tab === k}
              aria-controls={`panel-${k}`}
              className={tab === k ? 'is-active' : ''}
              onClick={() => setTab(k)}
            >
              {t(`partners.tab.${k}` as const)}
            </button>
          ))}
        </div>
        {tab === 'partner' && (
          <div role="tabpanel" id="panel-partner" aria-labelledby="tab-partner">
            <Form
              name="partenariat"
              submitLabel="form.sendRequest"
              note="form.privacy"
              fields={[
                { name: 'company', label: 'form.company', required: true, autoComplete: 'organization' },
                { name: 'contact', label: 'form.contact', required: true, autoComplete: 'name' },
                { name: 'email', label: 'form.proEmail', type: 'email', required: true, autoComplete: 'email' },
                { name: 'type', label: 'form.partnerType', type: 'select', required: true, options: typeOptions },
                { name: 'collaboration', label: 'form.collab', required: true, full: true },
                { name: 'dates', label: 'form.datesReq', required: true },
                { name: 'budget', label: 'form.budget', type: 'select', options: budgetOptions },
                { name: 'website', label: 'form.website', type: 'url', autoComplete: 'url' },
                { name: 'message', label: 'form.message', type: 'textarea', required: true, minLength: 20 },
                { name: 'consent', label: 'form.consent', type: 'checkbox', required: true },
              ]}
            />
          </div>
        )}
        {tab === 'appearance' && (
          <div role="tabpanel" id="panel-appearance" aria-labelledby="tab-appearance">
            <Form
              name="apparition"
              fields={[
                { name: 'name', label: 'form.name', required: true, autoComplete: 'name' },
                { name: 'company', label: 'form.company', required: true, autoComplete: 'organization' },
                { name: 'email', label: 'form.email', type: 'email', required: true, autoComplete: 'email' },
                { name: 'eventDate', label: 'form.eventDate', type: 'date', required: true },
                { name: 'location', label: 'form.location', required: true, full: true },
                { name: 'message', label: 'form.message', type: 'textarea', required: true, minLength: 20 },
                { name: 'consent', label: 'form.consent', type: 'checkbox', required: true },
              ]}
            />
          </div>
        )}
        {tab === 'press' && (
          <div role="tabpanel" id="panel-press" aria-labelledby="tab-press">
            <Form
              name="presse"
              fields={[
                { name: 'name', label: 'form.name', required: true, autoComplete: 'name' },
                { name: 'outlet', label: 'form.outlet', required: true, autoComplete: 'organization' },
                { name: 'email', label: 'form.email', type: 'email', required: true, autoComplete: 'email' },
                { name: 'deadline', label: 'form.deadline', type: 'date' },
                { name: 'message', label: 'form.message', type: 'textarea', required: true, minLength: 20 },
                { name: 'consent', label: 'form.consent', type: 'checkbox', required: true },
              ]}
            />
          </div>
        )}
      </div>

      <p className="pp-portal-link">
        <a className="source-link" href="#/espace-direction">
          {s('nav.portal')} →
        </a>
      </p>
    </section>
  );
}
