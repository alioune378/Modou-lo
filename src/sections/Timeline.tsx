import { useMemo, useState } from 'react';
import { milestones, timelineCategories, type TimelineCategory } from '../content/facts';
import { useI18n } from '../i18n';
import { useReducedMotion } from '../lib/hooks';
import { Icon, Img, SectionHead, SourceLink } from '../components/ui';

/** Interactive career documentary. With reduced motion it renders as a static, fully readable list. */
export function Timeline({ standalone }: { standalone?: boolean }) {
  const { t, L } = useI18n();
  const reduced = useReducedMotion();
  const [cat, setCat] = useState<TimelineCategory | 'all'>('all');
  const list = useMemo(() => (cat === 'all' ? milestones : milestones.filter((m) => m.category === cat)), [cat]);
  const [i, setI] = useState(0);
  const cur = list[Math.min(i, list.length - 1)];

  const pick = (c: TimelineCategory | 'all') => {
    setCat(c);
    setI(0);
  };

  const filters = (
    <div className="tl-filters" role="group" aria-label={t('timeline.eyebrow')}>
      <button type="button" aria-pressed={cat === 'all'} className={cat === 'all' ? 'is-active' : ''} onClick={() => pick('all')}>
        {t('timeline.all')}
      </button>
      {timelineCategories.map((c) => (
        <button key={c.id} type="button" aria-pressed={cat === c.id} className={cat === c.id ? 'is-active' : ''} onClick={() => pick(c.id)}>
          {L(c.label)}
        </button>
      ))}
    </div>
  );

  if (reduced) {
    return (
      <section id={standalone ? undefined : 'chronologie'} className="timeline section is-static" aria-labelledby="tl-title">
        <SectionHead eyebrow={t('timeline.eyebrow')} title={t('timeline.title')} />
        {filters}
        <ol className="tl-static">
          {list.map((m) => (
            <li key={m.id} className={m.placeholder ? 'is-pending' : ''}>
              <span className="tl-year">{m.year}</span>
              <h3>{L(m.title)}</h3>
              <p>{L(m.body)}</p>
              {m.source ? <SourceLink k={m.source} compact /> : m.placeholder && <span className="pill">{t('timeline.placeholder')}</span>}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section id={standalone ? undefined : 'chronologie'} className="timeline section" aria-labelledby="tl-title">
      <div className="tl-head">
        <SectionHead eyebrow={t('timeline.eyebrow')} title={t('timeline.title')} />
        {filters}
      </div>

      <div className="tl-stage">
        <div className="tl-visual" key={cur.id}>
          <Img k={cur.image} sizes="(max-width: 900px) 100vw, 50vw" className={cur.placeholder ? 'mono dim' : ''} />
          <span className="illus">{t('common.illustrative')}</span>
          <span className="tl-bigyear" aria-hidden="true">
            {cur.year}
          </span>
        </div>
        <div className="tl-text" aria-live="polite">
          <div key={cur.id} className="tl-text-in">
            <p className="tl-year">{cur.year}</p>
            <h3 className="display-3" id="tl-title">
              {L(cur.title)}
            </h3>
            <p className="tl-body serif">{L(cur.body)}</p>
            {cur.source ? <SourceLink k={cur.source} /> : cur.placeholder && <span className="pill">{t('timeline.placeholder')}</span>}
          </div>
          <div className="tl-arrows">
            <button type="button" className="icon-btn" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} aria-label="←">
              {Icon.chevL}
            </button>
            <span className="tl-count">
              {String(Math.min(i, list.length - 1) + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
            </span>
            <button type="button" className="icon-btn" onClick={() => setI((v) => Math.min(list.length - 1, v + 1))} disabled={i >= list.length - 1} aria-label="→">
              {Icon.chevR}
            </button>
          </div>
        </div>
      </div>

      <ol className="tl-track" aria-label={t('timeline.title')}>
        {list.map((m, n) => (
          <li key={m.id}>
            <button
              type="button"
              className={`tl-marker${n === i ? ' is-active' : ''}${m.placeholder ? ' is-pending' : ''}`}
              aria-current={n === i ? 'step' : undefined}
              onClick={() => setI(n)}
            >
              <i aria-hidden="true" />
              <span className="tl-m-year">{m.year}</span>
              <span className="tl-m-title">{L(m.title)}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
