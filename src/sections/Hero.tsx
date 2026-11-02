import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { useReducedMotion } from '../lib/hooks';
import { SandParticles } from '../components/SandParticles';
import { FlagRule, Icon, Img, Modal } from '../components/ui';

export function Hero() {
  const { t } = useI18n();
  const [film, setFilm] = useState(false);
  const reduced = useReducedMotion();
  const portrait = useRef<HTMLDivElement>(null);
  const arena = useRef<HTMLDivElement>(null);
  // The arena backdrop is only rendered on wide screens, so phones never download it.
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 900px)').matches);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 900px)');
    const on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);

  // Fit the monumental title to its line (protects layout while web fonts load or on narrow screens).
  const titleRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = '';
      const max = el.parentElement?.clientWidth ?? el.clientWidth;
      const w = el.scrollWidth;
      if (w > max) el.style.fontSize = `${(parseFloat(getComputedStyle(el).fontSize) * max) / w - 0.5}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Gentle scroll parallax — desktop pointers only, never for reduced motion.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (pointer: fine)');
    if (reduced || !mq.matches) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        if (portrait.current) portrait.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
        if (arena.current) arena.current.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(1.08)`;
      });
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
    };
  }, [reduced, wide]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-arena" ref={arena}>
        {wide && <Img k="stadiumWrestling" sizes="60vw" decorative eager />}
      </div>
      <div className="hero-light" aria-hidden="true" />
      <div className="hero-portrait" ref={portrait}>
        <Img k="arenaArmsCrossed" sizes="(max-width: 900px) 100vw, 55vw" eager />
      </div>
      <div className="hero-veil" aria-hidden="true" />
      <SandParticles />

      <div className="hero-copy">
        <p className="eyebrow hero-in" style={{ ['--d' as string]: '200ms' }}>
          <FlagRule /> {t('hero.kicker')}
        </p>
        <h1 id="hero-title" className="hero-title">
          <span className="hero-name hero-in" style={{ ['--d' as string]: '350ms' }}>
            Modou Lô
          </span>
          <span className="hero-xl" aria-label="Xaragne Lô" ref={titleRef}>
            {'XARAGNE LÔ'.split('').map((c, i) => (
              <span key={i} className="hero-letter" aria-hidden="true" style={{ ['--d' as string]: `${600 + i * 70}ms` }}>
                {c === ' ' ? ' ' : c}
              </span>
            ))}
          </span>
        </h1>
        <p className="hero-tag serif hero-in" style={{ ['--d' as string]: '1500ms' }}>
          {t('hero.supporting')}
        </p>
        <p className="hero-sub hero-in" style={{ ['--d' as string]: '1700ms' }}>
          {t('hero.sub')}
        </p>
        <div className="hero-ctas hero-in" style={{ ['--d' as string]: '1900ms' }}>
          <a className="btn btn-gold" href="#/histoire">
            {t('hero.cta1')} {Icon.arrow}
          </a>
          <button className="btn btn-ghost" type="button" onClick={() => setFilm(true)}>
            {Icon.play} {t('hero.cta2')}
          </button>
        </div>
      </div>

      <a className="hero-scroll" href="#heritage" aria-label={t('hero.scroll')}>
        <span>{t('hero.scroll')}</span>
        <i aria-hidden="true" />
      </a>

      <Modal open={film} onClose={() => setFilm(false)} labelledBy="film-title" className="film-modal">
        <div className="film-stage">
          <Img k="moodyCloseup" sizes="(max-width: 700px) 90vw, 640px" decorative />
          <div className="film-veil" />
          <div className="film-copy">
            <p className="eyebrow">Xaragne TV</p>
            <h2 id="film-title" className="display-3">
              {t('film.title')}
            </h2>
            <p>{t('film.body')}</p>
            <button type="button" className="btn btn-ghost" onClick={() => setFilm(false)}>
              {t('film.close')}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
