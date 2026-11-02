import { useEffect, useState } from 'react';
import { LANGS, useI18n } from '../i18n';
import type { Dict } from '../i18n/fr';
import { goToSection, navigate, useScrollLock } from '../lib/hooks';
import { FlagRule, Icon, Wordmark } from './ui';

export const NAV: { id: string; key: keyof Dict }[] = [
  { id: 'heritage', key: 'nav.legacy' },
  { id: 'origines', key: 'nav.origins' },
  { id: 'combats', key: 'nav.glory' },
  { id: 'chronologie', key: 'nav.timeline' },
  { id: 'peuple', key: 'nav.people' },
  { id: 'xaragne-tv', key: 'nav.tv' },
  { id: 'homme', key: 'nav.man' },
  { id: 'heritage-continue', key: 'nav.next' },
  { id: 'boutique', key: 'nav.shop' },
  { id: 'partenariats', key: 'nav.partners' },
];

function LangSwitch({ onPick }: { onPick?: () => void }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="lang" role="group" aria-label={t('nav.language')}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          className={lang === l.code ? 'is-active' : ''}
          aria-pressed={lang === l.code}
          lang={l.code}
          title={l.label}
          onClick={() => {
            setLang(l.code);
            onPick?.();
          }}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useScrollLock(open);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    goToSection(id);
  };

  return (
    <>
      <a className="skip" href="#main">
        {t('nav.skip')}
      </a>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <a
          href="#/"
          className="brand"
          aria-label="Modou Lô — Xaragne Lô"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
            window.scrollTo({ top: 0 });
          }}
        >
          <span className="brand-name">MODOU LÔ</span>
          <span className="brand-sep" aria-hidden="true" />
          <span className="brand-sub">The Legend</span>
        </a>
        <nav className="nav-desktop" aria-label="Principal">
          {NAV.slice(0, 6).map((n) => (
            <button key={n.id} type="button" onClick={() => go(n.id)}>
              {t(n.key)}
            </button>
          ))}
          <button type="button" className="nav-cta" onClick={() => go('partenariats')}>
            {t('nav.partners')}
          </button>
        </nav>
        <div className="header-right">
          <LangSwitch />
          <button type="button" className="menu-btn" aria-expanded={open} aria-controls="fullnav" onClick={() => setOpen(true)}>
            <span>{t('nav.menu')}</span>
            <i aria-hidden="true" />
          </button>
        </div>
      </header>

      <div id="fullnav" className={`fullnav${open ? ' is-open' : ''}`} hidden={!open} role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
        <div className="fullnav-top">
          <Wordmark className="fullnav-mark" />
          <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label={t('nav.close')}>
            {Icon.close}
          </button>
        </div>
        <nav aria-label="Sections">
          <ol>
            {NAV.map((n, i) => (
              <li key={n.id} style={{ ['--i' as string]: i }}>
                <button type="button" onClick={() => go(n.id)}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  {t(n.key)}
                </button>
              </li>
            ))}
            <li style={{ ['--i' as string]: NAV.length }}>
              <a
                href="#/histoire"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <span className="num">—</span>
                {t('nav.story')}
              </a>
            </li>
          </ol>
        </nav>
        <div className="fullnav-foot">
          <LangSwitch onPick={() => undefined} />
          <FlagRule />
        </div>
      </div>
    </>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Wordmark className="footer-mark" />
        <p className="footer-tagline serif">{t('footer.tagline')}</p>
      </div>
      <FlagRule className="footer-rule" />
      <div className="footer-grid">
        <p className="footer-disclaimer">{t('footer.disclaimer')}</p>
        <div className="footer-links">
          <a href="#/concept">{t('footer.concept')}</a>
          <a href="#/histoire">{t('nav.story')}</a>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {t('footer.top')} ↑
          </button>
        </div>
      </div>
      <div className="footer-credit">
        <span>{t('footer.credit')}</span>
        <span className="footer-principle">{t('footer.principle')}</span>
      </div>
    </footer>
  );
}
