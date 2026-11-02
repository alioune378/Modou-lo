import { useEffect, useRef } from 'react';
import { fights } from '../content/facts';
import { useI18n } from '../i18n';
import { formatDate, navigate, useScrollLock } from '../lib/hooks';
import { Icon, Img, Reveal, SectionHead, SourceLink } from '../components/ui';

/** EXPERIENCE 04 — Hall of glory. Cards are data-driven from content/facts.ts. */
export function Glory() {
  const { t, L, lang } = useI18n();
  return (
    <section id="combats" className="glory section" aria-labelledby="glory-title">
      <div className="glory-head">
        <SectionHead eyebrow={t('glory.eyebrow')} title={t('glory.title')} intro={t('glory.intro')} />
      </div>
      <p className="swipe-hint" aria-hidden="true">
        {t('glory.swipe')} →
      </p>
      <ol className="fight-rail" aria-labelledby="glory-title">
        {fights.map((f, i) => (
          <Reveal as="li" key={f.id} delay={i * 80} className="fight-card">
            <a href={`#/combats/${f.id}`} className="fight-link" aria-label={`${f.opponent} — ${t('glory.open')}`}>
              <div className="fight-img">
                <Img k={f.image} sizes="(max-width: 700px) 80vw, 340px" />
              </div>
              <div className="fight-veil" aria-hidden="true" />
              <div className="fight-meta">
                <span className="fight-tag">{L(f.tag)}</span>
                <span className="fight-vs">vs</span>
                <h3 className="fight-opponent">{f.opponent}</h3>
                <p className="fight-date">{f.date ? formatDate(f.date, lang) : t('common.toConfirm')}</p>
                <p className={`fight-result${f.result ? '' : ' is-pending'}`}>{f.result ? L(f.result) : `${t('glory.result')} : ${t('common.toConfirm')}`}</p>
                <span className="fight-open">
                  {t('glory.open')} {Icon.arrow}
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/** Immersive full-screen fight view (#/combats/:id). */
export function FightDetail({ id }: { id: string }) {
  const { t, L, lang } = useI18n();
  const idx = fights.findIndex((f) => f.id === id);
  const f = fights[idx];
  const closeRef = useRef<HTMLButtonElement>(null);
  useScrollLock(!!f);

  useEffect(() => {
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight' && idx < fights.length - 1) navigate(`/combats/${fights[idx + 1].id}`);
      if (e.key === 'ArrowLeft' && idx > 0) navigate(`/combats/${fights[idx - 1].id}`);
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [idx]);

  const close = () => {
    navigate('/');
    window.setTimeout(() => document.getElementById('combats')?.scrollIntoView(), 30);
  };

  if (!f) return null;
  const prev = fights[idx - 1];
  const next = fights[idx + 1];

  return (
    <div className="fight-detail" role="dialog" aria-modal="true" aria-labelledby="fd-title" key={f.id}>
      <div className="fd-media">
        <Img k={f.image} sizes="(max-width: 900px) 100vw, 60vw" eager />
        <div className="fd-veil" aria-hidden="true" />
        <span className="illus">{t('common.illustrative')}</span>
      </div>
      <button ref={closeRef} type="button" className="icon-btn fd-close" onClick={close} aria-label={t('glory.back')}>
        {Icon.close}
      </button>
      <div className="fd-body">
        <p className="eyebrow">
          {String(idx + 1).padStart(2, '0')} / {String(fights.length).padStart(2, '0')} — {L(f.tag)}
        </p>
        <p className="fd-vs">Modou Lô vs</p>
        <h2 id="fd-title" className="fd-opponent">
          {f.opponent}
        </h2>
        <dl className="fd-facts">
          <div>
            <dt>{t('glory.date')}</dt>
            <dd>{f.date ? formatDate(f.date, lang) : t('common.toConfirm')}</dd>
          </div>
          <div>
            <dt>{t('glory.venue')}</dt>
            <dd className={f.venue ? '' : 'is-pending'}>{f.venue ? L(f.venue) : t('common.toConfirm')}</dd>
          </div>
          <div>
            <dt>{t('glory.result')}</dt>
            <dd className={f.result ? '' : 'is-pending'}>{f.result ? L(f.result) : t('common.toConfirm')}</dd>
          </div>
        </dl>
        <h3 className="fd-h">{t('glory.context')}</h3>
        <p className="fd-context serif">{L(f.context)}</p>

        <h3 className="fd-h">{t('glory.highlights')}</h3>
        {f.highlights.length ? (
          <div className="fd-videos">
            {f.highlights.map((h) => (
              <iframe
                key={h.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${h.youtubeId}`}
                title={L(h.title)}
                loading="lazy"
                allow="encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ))}
          </div>
        ) : (
          <p className="muted">{t('glory.highlightsEmpty')}</p>
        )}

        {f.archive && (
          <figure className="fd-archive">
            <Img k={f.archive} sizes="160px" />
            <figcaption>{t('glory.archive')}</figcaption>
          </figure>
        )}

        <h3 className="fd-h">{t('glory.sources')}</h3>
        <ul className="fd-sources">
          {f.sources.map((s) => (
            <li key={s}>
              <SourceLink k={s} />
            </li>
          ))}
        </ul>

        <nav className="fd-nav" aria-label={t('glory.title')}>
          {prev ? (
            <a href={`#/combats/${prev.id}`} className="fd-step">
              {Icon.chevL}
              <span>
                <small>{t('glory.prev')}</small>
                {prev.opponent}
              </span>
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a href={`#/combats/${next.id}`} className="fd-step is-next">
              <span>
                <small>{t('glory.next')}</small>
                {next.opponent}
              </span>
              {Icon.chevR}
            </a>
          )}
        </nav>
      </div>
    </div>
  );
}
