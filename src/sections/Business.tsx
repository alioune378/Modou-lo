import { products, type Product } from '../content/editorial';
import { useI18n } from '../i18n';
import { goToSection } from '../lib/hooks';
import { Img, Reveal, SectionHead } from '../components/ui';

function ProductVisual({ p }: { p: Product }) {
  if (p.image) {
    return (
      <div className="pv pv-poster">
        <Img k={p.image} sizes="(max-width: 700px) 70vw, 280px" />
        <span className="pv-poster-mark">XARAGNE LÔ</span>
      </div>
    );
  }
  // Typographic garment silhouettes — no fake product photography.
  const shapes: Record<Product['kind'], string> = {
    tee: 'M60 20l30-12h20l30 12 30 26-20 22-18-12v108H48V56L30 68 10 46z',
    hoodie: 'M70 26c6-14 54-14 60 0l34 20 18 70-22 6-12-52v116H50V70L38 122l-22-6 18-70z',
    training: 'M64 18h72l14 40-18 6v118h-26l-6-84-6 84H68V64l-18-6z',
    accessory: 'M40 120c0-44 26-74 60-74s60 30 60 74zM30 120h150v14H30z',
    poster: '',
  };
  return (
    <div className={`pv pv-${p.tone}`}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <path d={shapes[p.kind]} />
      </svg>
      <span className="pv-mark">XL</span>
    </div>
  );
}

/** EXPERIENCE 09 — Xaragne Official (concept, no commerce). */
export function Shop() {
  const { t, L } = useI18n();
  return (
    <section id="boutique" className="shop section" aria-labelledby="shop-title">
      <div className="shop-head">
        <SectionHead eyebrow={t('shop.eyebrow')} title={t('shop.title')} intro={t('shop.body')} />
      </div>
      <ul className="shop-rail">
        {products.map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 70} className="product">
            <ProductVisual p={p} />
            <span className="pill pill-gold">{t('shop.badge')}</span>
            <h3 className="product-name">{L(p.name)}</h3>
            <p className="muted small">{L(p.line)}</p>
            <p className="product-price">{t('shop.price')}</p>
            <button type="button" className="btn btn-line" onClick={() => goToSection('newsletter')}>
              {t('shop.notify')}
            </button>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/** EXPERIENCE 10 — Partenariats: see src/portal/PartnershipsPublic.tsx. */
export { PartnershipsPublic as Partnerships } from '../portal/PartnershipsPublic';
