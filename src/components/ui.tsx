import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react';
import { media, mediaManifest, type MediaKey } from '../content/media';
import { sources, type SourceKey } from '../content/facts';
import { useI18n } from '../i18n';
import { useReveal, useScrollLock } from '../lib/hooks';

/* ---------------------------------------------------------------- Picture */

type ImgProps = {
  k: MediaKey;
  sizes: string;
  className?: string;
  eager?: boolean;
  /** Overrides registry focus point. */
  focus?: string;
  style?: CSSProperties;
  decorative?: boolean;
};

/** Responsive <picture>: WebP srcset with JPEG fallback, intrinsic size to avoid layout shift. */
export function Img({ k, sizes, className, eager, focus, style, decorative }: ImgProps) {
  const { L } = useI18n();
  const item = media[k];
  const m = mediaManifest[item.file];
  const base = `/media/${item.file}`;
  const srcSet = m.widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
  const vars = {
    '--focus': focus ?? item.focus,
    '--focus-m': 'focusMobile' in item ? item.focusMobile : focus ?? item.focus,
    ...style,
  } as CSSProperties;
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={`${base}-${m.fallback}.jpg`}
        width={m.w}
        height={m.h}
        alt={decorative ? '' : L(item.alt)}
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager ? 'sync' : 'async'}
        {...(eager ? { fetchpriority: 'high' } : {})}
        style={vars}
      />
    </picture>
  );
}

/* ----------------------------------------------------------------- Reveal */

export function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
  className?: string;
  delay?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------ Section head */

export function SectionHead({ eyebrow, title, intro, center }: { eyebrow: string; title: string; intro?: string; center?: boolean }) {
  return (
    <Reveal as="header" className={`section-head${center ? ' is-center' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display-2">{title}</h2>
      {intro && <p className="lede">{intro}</p>}
    </Reveal>
  );
}

/* ----------------------------------------------------------------- Source */

export function SourceLink({ k, compact }: { k: SourceKey; compact?: boolean }) {
  const { t } = useI18n();
  const s = sources[k];
  return (
    <a className="source-link" href={s.url} target="_blank" rel="noopener noreferrer" title={s.label}>
      {compact ? t('common.source') : s.label}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

/* --------------------------------------------------------------- Wordmark */

/** Custom XARAGNE LÔ signature wordmark: monumental caps + a signature swash and minimal crown. */
export function Wordmark({ className = '', title = 'Xaragne Lô' }: { className?: string; title?: string }) {
  const gid = `wm-${useId().replace(/:/g, '')}`;
  const g = `url(#${gid})`;
  return (
    <svg className={`wordmark ${className}`} viewBox="0 0 420 120" role="img" aria-label={title}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9C77B" />
          <stop offset=".55" stopColor="#C9A35F" />
          <stop offset="1" stopColor="#8E6F38" />
        </linearGradient>
      </defs>
      {/* crown */}
      <path d="M190 22 l10 10 10-18 10 18 10-10 -4 20 h-32z" fill="none" stroke={g} strokeWidth="2.4" strokeLinejoin="round" />
      <text x="210" y="86" textAnchor="middle" fill={g} fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontWeight="600" fontSize="58" letterSpacing="1">
        Xaragne Lô
      </text>
      {/* signature swash */}
      <path d="M78 100 C150 86, 250 116, 352 92 C362 90, 368 94, 360 98" fill="none" stroke={g} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Thin tri-colour rule — the only use of the flag colours. */
export function FlagRule({ className = '' }: { className?: string }) {
  return (
    <span className={`flag-rule ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/* ------------------------------------------------------------------ Modal */

export function Modal({
  open,
  onClose,
  labelledBy,
  children,
  className = '',
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const el = ref.current;
    const focusables = () =>
      Array.from(el?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea,select,iframe,[tabindex]:not([tabindex="-1"])') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const f = focusables();
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={ref}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-body">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- Icons */

export const Icon = {
  arrow: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  chevL: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevR: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
