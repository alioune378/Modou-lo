import { useEffect, type ReactNode } from 'react';
import { media } from '../content/media';
import { fights, originChapters, sources, type SourceKey } from '../content/facts';
import { useI18n } from '../i18n';
import { Icon, Img, Reveal, SourceLink, Wordmark } from '../components/ui';
import { Hero } from '../sections/Hero';
import { Legacy, Origins } from '../sections/Legacy';
import { Glory } from '../sections/Glory';
import { ReignInterlude } from '../sections/ReignInterlude';
import { Timeline } from '../sections/Timeline';
import { ManBeyond, NextGeneration, People, XaragneTV } from '../sections/Community';
import { Partnerships, Shop } from '../sections/Business';
import { formatDate } from '../lib/hooks';

export function Home() {
  const { t } = useI18n();
  return (
    <>
      <Hero />
      <Legacy />
      <Origins />
      <ReignInterlude />
      <Glory />
      <Timeline />
      <section className="interlude" aria-label={t('motto')}>
        <Img k="ceremonial" sizes="100vw" className="interlude-img" decorative />
        <div className="interlude-veil" aria-hidden="true" />
        <Reveal className="interlude-copy">
          <p className="serif interlude-quote">{t('motto')}</p>
        </Reveal>
      </section>
      <People />
      <XaragneTV />
      <ManBeyond />
      <NextGeneration />
      <Shop />
      <Partnerships />
    </>
  );
}

function PageShell({ title, back, children }: { title: string; back: string; children: ReactNode }) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div className="page">
      <a className="page-back" href="#/">
        {Icon.chevL} {back}
      </a>
      <header className="page-head">
        <Wordmark className="page-mark" />
        <h1 className="display-1">{title}</h1>
      </header>
      {children}
    </div>
  );
}

/** Long-form biography page (#/histoire). */
export function Story() {
  const { t, L, lang } = useI18n();
  return (
    <PageShell title={t('story.title')} back={t('story.back')}>
      <div className="story-hero">
        <Img k="moodyCloseup" sizes="(max-width: 700px) 100vw, 420px" className="mono" eager />
        <p className="lede serif">{t('story.intro')}</p>
      </div>
      <ol className="story-chapters">
        {originChapters.map((c, i) => (
          <Reveal as="li" key={c.id}>
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <p className="eyebrow">{L(c.label)}</p>
              <h2 className="serif">{L(c.title)}</h2>
              <p>{L(c.body)}</p>
              {c.source && <SourceLink k={c.source} compact />}
            </div>
          </Reveal>
        ))}
        {fights.slice(2).map((f, i) => (
          <Reveal as="li" key={f.id}>
            <span className="num">{String(originChapters.length + i + 1).padStart(2, '0')}</span>
            <div>
              <p className="eyebrow">{formatDate(f.date, lang)}</p>
              <h2 className="serif">Modou Lô vs {f.opponent}</h2>
              <p>{L(f.context)}</p>
              <a className="source-link" href={`#/combats/${f.id}`}>
                {t('glory.open')} →
              </a>
            </div>
          </Reveal>
        ))}
      </ol>
      <Timeline standalone />
    </PageShell>
  );
}

/** About the concept: disclaimer, sources and rights-clearance list (#/concept). */
export function Concept() {
  const { t, L } = useI18n();
  return (
    <PageShell title={t('concept.title')} back={t('concept.back')}>
      <p className="lede concept-body">{t('concept.body')}</p>
      <h2 className="display-3 concept-h">{t('concept.factsTitle')}</h2>
      <ul className="concept-sources">
        {(Object.keys(sources) as SourceKey[]).map((k) => (
          <li key={k}>
            <SourceLink k={k} />
          </li>
        ))}
      </ul>
      <h2 className="display-3 concept-h">{t('concept.rightsTitle')}</h2>
      <ul className="rights-list">
        {Object.entries(media).map(([key, m]) => (
          <li key={key}>
            <Img k={key as keyof typeof media} sizes="72px" />
            <div>
              <code>{m.file}</code>
              <p className="small">{L(m.rights.note)}</p>
            </div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
