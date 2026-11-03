import { useEffect, useRef, useState } from 'react';
import type { Localized } from '../i18n';
import { useI18n } from '../i18n';
import { prefersReducedMotion } from '../lib/hooks';
import { Img, SourceLink } from '../components/ui';

/** Verified figures only (Le Soleil, 8 Apr 2026 — see facts.ts → soleilRois). */
const FIGURES: { value: number; prefix?: string; label: Localized }[] = [
  { value: 2006, label: { fr: 'Premier combat recensé', en: 'First recorded bout' } },
  { value: 2019, label: { fr: 'Sacré Roi des arènes', en: 'Crowned King of the Arenas' } },
  { value: 3, label: { fr: 'Défenses du titre', en: 'Title defences' } },
  { value: 7, prefix: '≈', label: { fr: 'Années de règne', en: 'Years on the throne' } },
];

function CountUp({ to, run }: { to: number; run: boolean }) {
  // Years count from the century, small numbers from zero: both settle on the exact value.
  const from = to > 1000 ? to - 40 : 0;
  const [v, setV] = useState(run ? from : to);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, from]);
  return <>{v}</>;
}

/** A cinematic pause between the origins and the fight archive: one photograph, four verified numbers. */
export function ReignInterlude() {
  const { L } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window) || prefersReducedMotion()) return;
    // Only animate if the band starts off-screen; otherwise numbers stay at their final value.
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="reign" aria-label={L({ fr: 'Le règne en chiffres', en: 'The reign in numbers' })}>
      <Img k="arenaAttire" sizes="100vw" className="reign-img" decorative />
      <div className="reign-veil" aria-hidden="true" />
      <div className="reign-copy">
        <p className="eyebrow">{L({ fr: 'Le règne', en: 'The reign' })}</p>
        <ul className="reign-figures">
          {FIGURES.map((f) => (
            <li key={f.value}>
              <span className="reign-n">
                {f.prefix}
                {armed ? <CountUp to={f.value} run={seen} /> : f.value}
              </span>
              <span className="reign-l">{L(f.label)}</span>
            </li>
          ))}
        </ul>
        <SourceLink k="soleilRois" compact />
      </div>
    </section>
  );
}
