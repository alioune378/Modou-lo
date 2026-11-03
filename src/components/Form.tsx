import { useRef, useState, type FormEvent } from 'react';
import { useI18n } from '../i18n';
import type { Dict } from '../i18n/fr';

/**
 * Demo-safe form.
 * - Validates every field, with accessible error messages.
 * - Spam protection: hidden honeypot + minimum fill time.
 * - VITE_FORMS_MODE=demo (default): nothing is transmitted; the UI says so truthfully.
 * - VITE_FORMS_MODE=netlify: posts to Netlify Forms (destination = Netlify dashboard / notifications).
 */
export const FORMS_MODE: 'demo' | 'netlify' = import.meta.env.VITE_FORMS_MODE === 'netlify' ? 'netlify' : 'demo';

export type Field = {
  name: string;
  label: keyof Dict;
  type?: 'text' | 'email' | 'tel' | 'url' | 'date' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  minLength?: number;
  options?: { value: string; label: string }[];
  autoComplete?: string;
  full?: boolean;
};

type Status = 'idle' | 'invalid' | 'sending' | 'sent' | 'demo' | 'error' | 'fast';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URLISH = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#]\S*)?$/i;

export function Form({
  name,
  fields,
  submitLabel = 'form.submit',
  compact,
  note,
}: {
  name: string;
  fields: Field[];
  submitLabel?: keyof Dict;
  compact?: boolean;
  /** Optional notice shown above the submit button (e.g. privacy). */
  note?: keyof Dict;
}) {
  const { t } = useI18n();
  const [errors, setErrors] = useState<Record<string, keyof Dict>>({});
  const [status, setStatus] = useState<Status>('idle');
  const started = useRef(Date.now());
  const id = (f: string) => `${name}-${f}`;

  const validate = (fd: FormData) => {
    const e: Record<string, keyof Dict> = {};
    for (const f of fields) {
      const v = String(fd.get(f.name) ?? '').trim();
      if (f.type === 'checkbox') {
        if (f.required && !fd.get(f.name)) e[f.name] = 'form.consentRequired';
        continue;
      }
      if (f.required && !v) e[f.name] = 'form.required';
      else if (f.type === 'email' && v && !EMAIL.test(v)) e[f.name] = 'form.invalidEmail';
      else if (f.type === 'url' && v && !URLISH.test(v)) e[f.name] = 'form.invalidUrl';
      else if (f.minLength && v && v.length < f.minLength) e[f.name] = 'form.tooShort';
    }
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus('invalid');
      const first = fields.find((f) => e[f.name]);
      if (first) (form.elements.namedItem(first.name) as HTMLElement | null)?.focus();
      return;
    }
    // Honeypot filled → silently treat as done without sending.
    if (fd.get('bot-field')) {
      setStatus(FORMS_MODE === 'demo' ? 'demo' : 'sent');
      return;
    }
    if (Date.now() - started.current < 2500) {
      setStatus('fast');
      return;
    }
    if (FORMS_MODE === 'demo') {
      setStatus('demo');
      form.reset();
      return;
    }
    setStatus('sending');
    try {
      fd.set('form-name', name);
      const body = new URLSearchParams(fd as unknown as Record<string, string>).toString();
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  const message: Partial<Record<Status, keyof Dict>> = {
    invalid: 'form.fixErrors',
    sending: 'form.sending',
    sent: 'form.sent',
    demo: 'form.demoSent',
    error: 'form.error',
    fast: 'form.tooFast',
  };

  return (
    <form className={`form${compact ? ' is-compact' : ''}`} name={name} noValidate onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value={name} />
      <p className="hp" aria-hidden="true">
        <label>
          Ne pas remplir <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="form-grid">
        {fields.map((f) => {
          const err = errors[f.name];
          const describedBy = err ? `${id(f.name)}-err` : undefined;
          if (f.type === 'checkbox') {
            return (
              <div key={f.name} className="field field-check is-full">
                <input id={id(f.name)} type="checkbox" name={f.name} value="yes" aria-invalid={!!err} aria-describedby={describedBy} />
                <label htmlFor={id(f.name)}>{t(f.label)}</label>
                {err && (
                  <p className="field-err" id={describedBy}>
                    {t(err)}
                  </p>
                )}
              </div>
            );
          }
          const common = {
            id: id(f.name),
            name: f.name,
            'aria-invalid': !!err,
            'aria-describedby': describedBy,
            'aria-required': f.required,
            autoComplete: f.autoComplete,
          };
          return (
            <div key={f.name} className={`field${f.full || f.type === 'textarea' ? ' is-full' : ''}${err ? ' has-err' : ''}`}>
              <label htmlFor={id(f.name)}>
                {t(f.label)}
                {f.required && <span aria-hidden="true"> *</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea {...common} rows={compact ? 3 : 5} />
              ) : f.type === 'select' ? (
                <select {...common} defaultValue="">
                  <option value="" disabled>
                    —
                  </option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input {...common} type={f.type ?? 'text'} inputMode={f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : f.type === 'url' ? 'url' : undefined} />
              )}
              {err && (
                <p className="field-err" id={describedBy}>
                  {t(err)}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {note && <p className="form-note small muted">{t(note)}</p>}
      <div className="form-foot">
        <button className="btn btn-gold" type="submit" disabled={status === 'sending'}>
          {t(status === 'sending' ? 'form.sending' : submitLabel)}
        </button>
        {FORMS_MODE === 'demo' && <span className="form-mode">{t('form.demoNote')}</span>}
      </div>
      <p className={`form-status is-${status}`} role="status" aria-live="polite">
        {message[status] ? t(message[status]!) : ''}
      </p>
    </form>
  );
}
