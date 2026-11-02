import { useState } from 'react';
import { manChapters, nextGenConcepts, socialLinks, videoCategories, videoSlots, videos, type VideoCategory } from '../content/editorial';
import { useI18n } from '../i18n';
import type { Dict } from '../i18n/fr';
import { Form } from '../components/Form';
import { FlagRule, Icon, Img, Reveal, SectionHead } from '../components/ui';

/** EXPERIENCE 05 — The people's champion. */
export function People() {
  const { t } = useI18n();
  return (
    <section id="peuple" className="people section" aria-labelledby="people-title">
      <div className="people-hero">
        <Reveal className="people-img-a">
          <Img k="senegalJersey" sizes="(max-width: 900px) 70vw, 32vw" />
        </Reveal>
        <Reveal className="people-img-b" delay={120}>
          <Img k="stadiumWrestling" sizes="(max-width: 900px) 100vw, 50vw" />
        </Reveal>
        <div className="people-copy">
          <p className="eyebrow">{t('people.eyebrow')}</p>
          <h2 id="people-title" className="display-1">
            {t('people.title')}
          </h2>
          <FlagRule />
          <p className="lede">{t('people.body')}</p>
          <p className="people-diaspora serif">{t('people.diaspora')}</p>
        </div>
      </div>

      <div className="people-grid">
        <Reveal className="card wall">
          <h3 className="card-title">{t('people.wallTitle')}</h3>
          <div className="wall-empty">
            <span className="wall-quote serif" aria-hidden="true">
              “
            </span>
            <p>{t('people.wallEmpty')}</p>
          </div>
        </Reveal>
        <Reveal className="card" delay={100}>
          <h3 className="card-title">{t('people.shareTitle')}</h3>
          <p className="muted small">{t('form.moderation')}</p>
          <Form
            name="supporters"
            compact
            fields={[
              { name: 'name', label: 'form.name', required: true, autoComplete: 'name' },
              { name: 'city', label: 'form.city', required: true, autoComplete: 'address-level2' },
              { name: 'email', label: 'form.email', type: 'email', required: true, autoComplete: 'email', full: true },
              { name: 'memory', label: 'form.memory', type: 'textarea', required: true, minLength: 20 },
              { name: 'consent', label: 'form.consentFan', type: 'checkbox', required: true },
            ]}
          />
        </Reveal>
        <Reveal className="card" delay={200}>
          <h3 className="card-title" id="newsletter">
            {t('people.newsletterTitle')}
          </h3>
          <p className="muted small">{t('people.newsletterBody')}</p>
          <Form
            name="newsletter"
            compact
            submitLabel="form.subscribe"
            fields={[
              { name: 'email', label: 'form.email', type: 'email', required: true, autoComplete: 'email', full: true },
              { name: 'consent', label: 'form.consentNews', type: 'checkbox', required: true },
            ]}
          />
        </Reveal>
      </div>
    </section>
  );
}

/** EXPERIENCE 06 — Xaragne TV. Works gracefully with zero videos. */
export function XaragneTV() {
  const { t, L } = useI18n();
  const [cat, setCat] = useState<VideoCategory | 'all'>('all');
  const [playing, setPlaying] = useState<string | null>(null);
  const list = cat === 'all' ? videos : videos.filter((v) => v.category === cat);
  const slots = cat === 'all' ? videoSlots : videoSlots.filter((s) => s.category === cat);
  const catKey = (c: VideoCategory) => `tv.cat.${c}` as keyof Dict;

  return (
    <section id="xaragne-tv" className="tv section" aria-labelledby="tv-title">
      <div className="tv-head">
        <SectionHead eyebrow={t('tv.eyebrow')} title={t('tv.title')} />
        <div className="chips" role="group" aria-label={t('tv.eyebrow')}>
          <button type="button" aria-pressed={cat === 'all'} className={cat === 'all' ? 'is-active' : ''} onClick={() => setCat('all')}>
            {t('tv.cat.all')}
          </button>
          {videoCategories.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} className={cat === c ? 'is-active' : ''} onClick={() => setCat(c)}>
              {t(catKey(c))}
            </button>
          ))}
        </div>
      </div>

      {list.length > 0 ? (
        <ul className="tv-grid">
          {list.map((v) => (
            <li key={v.id} className="tv-card">
              {playing === v.id ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1`}
                  title={L(v.title)}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button type="button" className="tv-thumb" onClick={() => setPlaying(v.id)} aria-label={L(v.title)}>
                  <Img k={v.poster} sizes="(max-width: 700px) 90vw, 400px" decorative />
                  <span className="tv-play">{Icon.play}</span>
                  {v.duration && <span className="tv-dur">{v.duration}</span>}
                </button>
              )}
              <p className="tv-cat">{t(catKey(v.category))}</p>
              <h3 className="tv-title">{L(v.title)}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <p className="tv-empty">{t('tv.empty')}</p>
          <ul className="tv-grid is-slots">
            {slots.map((s, i) => (
              <Reveal as="li" key={s.category + i} delay={i * 60} className="tv-card is-slot">
                <div className="tv-thumb" aria-hidden="true">
                  <Img k={s.poster} sizes="(max-width: 700px) 90vw, 400px" decorative />
                  <span className="tv-lock">
                    {Icon.lock} {t('tv.soon')}
                  </span>
                </div>
                <p className="tv-cat">{t(catKey(s.category))}</p>
                <h3 className="tv-title">{t('tv.slot')}</h3>
              </Reveal>
            ))}
            {slots.length === 0 && <li className="tv-card is-slot muted">{t('tv.empty')}</li>}
          </ul>
        </>
      )}

      <div className="tv-social">
        <span>{t('tv.follow')}</span>
        {socialLinks.length ? (
          socialLinks.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
              {s.network}
            </a>
          ))
        ) : (
          <span className="muted">{t('tv.followNote')}</span>
        )}
      </div>
    </section>
  );
}

/** EXPERIENCE 07 — The man beyond the arena. */
export function ManBeyond() {
  const { t, L } = useI18n();
  return (
    <section id="homme" className="man section" aria-labelledby="man-title">
      <div className="man-intro">
        <Reveal className="man-portrait">
          <Img k="redHoodie" sizes="(max-width: 900px) 80vw, 30vw" />
        </Reveal>
        <div>
          <SectionHead eyebrow={t('man.eyebrow')} title={t('man.title')} />
          <blockquote className="motto serif">
            <p>{t('motto')}</p>
          </blockquote>
        </div>
      </div>
      <ul className="man-grid">
        {manChapters.map((c, i) => (
          <Reveal as="li" key={c.id} delay={i * 70} className={`man-card${c.image ? ' has-img' : ''}`}>
            {c.image && (
              <div className="man-card-img">
                <Img k={c.image} sizes="(max-width: 700px) 90vw, 360px" />
              </div>
            )}
            <div className="man-card-body">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="serif">{L(c.title)}</h3>
              <p>{L(c.lead)}</p>
              <span className="pill">{t('man.pending')}</span>
            </div>
          </Reveal>
        ))}
      </ul>
      <Reveal className="interview">
        <div className="interview-img">
          <Img k="interview" sizes="(max-width: 900px) 100vw, 45vw" />
        </div>
        <div className="interview-copy">
          <p className="eyebrow">{t('man.interviewTitle')}</p>
          <p className="serif interview-body">{t('man.interviewBody')}</p>
        </div>
      </Reveal>
    </section>
  );
}

/** EXPERIENCE 08 — The next generation (concepts only). */
export function NextGeneration() {
  const { t, L } = useI18n();
  return (
    <section id="heritage-continue" className="nextgen section" aria-labelledby="next-title">
      <div className="nextgen-media">
        <Reveal className="nextgen-a">
          <Img k="trainingWrap" sizes="(max-width: 900px) 60vw, 26vw" />
        </Reveal>
        <Reveal className="nextgen-b" delay={140}>
          <Img k="strength" sizes="(max-width: 900px) 60vw, 26vw" />
        </Reveal>
      </div>
      <div className="nextgen-copy">
        <SectionHead eyebrow={t('next.eyebrow')} title={t('next.title')} intro={t('next.body')} />
        <ul className="concepts">
          {nextGenConcepts.map((c, i) => (
            <Reveal as="li" key={c.id} delay={i * 90} className="concept">
              <span className="pill">{t('next.concept')}</span>
              <h3 className="serif">{L(c.title)}</h3>
              <p>{L(c.body)}</p>
            </Reveal>
          ))}
        </ul>
        <button type="button" className="btn btn-ghost" disabled aria-disabled="true">
          {Icon.lock} {t('next.closed')}
        </button>
      </div>
    </section>
  );
}
