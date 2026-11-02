import { useState } from 'react';
import { inscriptions, originChapters } from '../content/facts';
import { useI18n } from '../i18n';
import { Icon, Img, Reveal, SectionHead, SourceLink } from '../components/ui';

/** EXPERIENCE 02 — The champion's legacy: illuminated inscriptions. */
export function Legacy() {
  const { t, L } = useI18n();
  return (
    <section id="heritage" className="legacy" aria-labelledby="legacy-title">
      <div className="legacy-inner">
        <Reveal className="legacy-head">
          <p className="eyebrow">{t('legacy.eyebrow')}</p>
          <h2 id="legacy-title" className="display-3">
            {t('legacy.title')}
          </h2>
        </Reveal>
        <ol className="inscriptions">
          {inscriptions.map((ins, i) => {
            const pending = !ins.source;
            return (
              <Reveal as="li" key={i} delay={i * 90} className={`inscription${pending ? ' is-pending' : ''}`}>
                <span className="ins-num" aria-hidden="true">
                  {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i]}
                </span>
                <p className="ins-label">{L(ins.label)}</p>
                <p className="ins-value">{L(ins.value)}</p>
                <p className="ins-detail">{L(ins.detail)}</p>
                {ins.source ? <SourceLink k={ins.source} compact /> : <span className="pill">{t('legacy.pending')}</span>}
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** EXPERIENCE 03 — The origins. */
export function Origins() {
  const { t, L } = useI18n();
  const [active, setActive] = useState(0);
  const ch = originChapters[active];

  return (
    <section id="origines" className="origins section" aria-labelledby="origins-title">
      <div className="origins-media">
        <Reveal className="origins-main">
          <Img k="bwPortrait" sizes="(max-width: 900px) 100vw, 50vw" className="mono" />
        </Reveal>
        <Reveal className="origins-second" delay={150}>
          <Img k="trainingArrival" sizes="(max-width: 900px) 45vw, 22vw" className="mono" />
        </Reveal>
        <Reveal className="origins-placeholder" delay={250}>
          <span>{t('origins.parcellesPlaceholder')}</span>
        </Reveal>
      </div>

      <div className="origins-copy">
        <SectionHead eyebrow={t('origins.eyebrow')} title={t('origins.title')} />
        <div className="chapters" role="tablist" aria-label={t('origins.chapters')}>
          {originChapters.map((c, i) => (
            <button
              key={c.id}
              role="tab"
              id={`ch-${c.id}`}
              aria-selected={active === i}
              aria-controls="ch-panel"
              tabIndex={active === i ? 0 : -1}
              className={active === i ? 'is-active' : ''}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  const n = (i + 1) % originChapters.length;
                  setActive(n);
                  document.getElementById(`ch-${originChapters[n].id}`)?.focus();
                }
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  const n = (i - 1 + originChapters.length) % originChapters.length;
                  setActive(n);
                  document.getElementById(`ch-${originChapters[n].id}`)?.focus();
                }
              }}
            >
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              {L(c.label)}
            </button>
          ))}
        </div>
        <div id="ch-panel" role="tabpanel" aria-labelledby={`ch-${ch.id}`} className="chapter-panel" key={ch.id}>
          <h3 className="serif chapter-title">{L(ch.title)}</h3>
          <p>{L(ch.body)}</p>
          {ch.source && <SourceLink k={ch.source} compact />}
        </div>
        <a className="btn btn-ghost" href="#/histoire">
          {t('origins.cta')} {Icon.arrow}
        </a>
      </div>
    </section>
  );
}
