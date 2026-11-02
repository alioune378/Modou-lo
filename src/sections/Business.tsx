import { useState } from 'react';
import { partnerCategories, products, type Product } from '../content/editorial';
import { useI18n } from '../i18n';
import { goToSection } from '../lib/hooks';
import { Form } from '../components/Form';
import { Icon, Img, Reveal, SectionHead } from '../components/ui';

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

/** EXPERIENCE 10 — Global partnerships. */
export function Partnerships() {
  const { t, L } = useI18n();
  const [tab, setTab] = useState<'partner' | 'appearance' | 'press'>('partner');
  const catOptions = partnerCategories.map((c) => ({ value: c.id, label: L(c.label) }));

  return (
    <section id="partenariats" className="partners section" aria-labelledby="partners-title">
      <div className="partners-hero">
        <div className="partners-img">
          <Img k="formalSuit" sizes="(max-width: 900px) 100vw, 45vw" />
        </div>
        <div className="partners-copy">
          <SectionHead eyebrow={t('partners.eyebrow')} title={t('partners.title')} intro={t('partners.body')} />
          <button type="button" className="btn btn-ghost" disabled aria-disabled="true">
            {Icon.lock} {t('partners.mediaKit')}
          </button>
        </div>
      </div>

      <h3 className="partners-cat-title eyebrow">{t('partners.categories')}</h3>
      <ul className="partner-cats">
        {partnerCategories.map((c, i) => (
          <Reveal as="li" key={c.id} delay={i * 60}>
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <h4>{L(c.label)}</h4>
            <p className="muted small">{L(c.body)}</p>
          </Reveal>
        ))}
      </ul>

      <div className="partners-forms card">
        <div className="tabs" role="tablist" aria-label={t('partners.title')}>
          {(['partner', 'appearance', 'press'] as const).map((k) => (
            <button
              key={k}
              role="tab"
              id={`tab-${k}`}
              aria-selected={tab === k}
              aria-controls={`panel-${k}`}
              className={tab === k ? 'is-active' : ''}
              onClick={() => setTab(k)}
            >
              {t(`partners.tab.${k}` as const)}
            </button>
          ))}
        </div>
        {tab === 'partner' && (
          <div role="tabpanel" id="panel-partner" aria-labelledby="tab-partner">
            <Form
              name="partenariat"
              fields={[
                { name: 'name', label: 'form.name', required: true, autoComplete: 'name' },
                { name: 'company', label: 'form.company', required: true, autoComplete: 'organization' },
                { name: 'email', label: 'form.email', type: 'email', required: true, autoComplete: 'email' },
                { name: 'phone', label: 'form.phone', type: 'tel', autoComplete: 'tel' },
                { name: 'category', label: 'form.category', type: 'select', required: true, options: catOptions },
                { name: 'budget', label: 'form.budget' },
                { name: 'message', label: 'form.message', type: 'textarea', required: true, minLength: 20 },
                { name: 'consent', label: 'form.consent', type: 'checkbox', required: true },
              ]}
            />
          </div>
        )}
        {tab === 'appearance' && (
          <div role="tabpanel" id="panel-appearance" aria-labelledby="tab-appearance">
            <Form
              name="apparition"
              fields={[
                { name: 'name', label: 'form.name', required: true, autoComplete: 'name' },
                { name: 'company', label: 'form.company', required: true, autoComplete: 'organization' },
                { name: 'email', label: 'form.email', type: 'email', required: true, autoComplete: 'email' },
                { name: 'eventDate', label: 'form.eventDate', type: 'date', required: true },
                { name: 'location', label: 'form.location', required: true, full: true },
                { name: 'message', label: 'form.message', type: 'textarea', required: true, minLength: 20 },
                { name: 'consent', label: 'form.consent', type: 'checkbox', required: true },
              ]}
            />
          </div>
        )}
        {tab === 'press' && (
          <div role="tabpanel" id="panel-press" aria-labelledby="tab-press">
            <Form
              name="presse"
              fields={[
                { name: 'name', label: 'form.name', required: true, autoComplete: 'name' },
                { name: 'outlet', label: 'form.outlet', required: true, autoComplete: 'organization' },
                { name: 'email', label: 'form.email', type: 'email', required: true, autoComplete: 'email' },
                { name: 'deadline', label: 'form.deadline', type: 'date' },
                { name: 'message', label: 'form.message', type: 'textarea', required: true, minLength: 20 },
                { name: 'consent', label: 'form.consent', type: 'checkbox', required: true },
              ]}
            />
          </div>
        )}
      </div>
    </section>
  );
}
