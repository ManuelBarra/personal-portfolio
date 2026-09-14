'use client'

import type { Locale } from '@/types/resume'

interface CvToolbarProps {
  locale: Locale
}

const LABELS: Record<Locale, { print: string; back: string }> = {
  es: { print: 'Descargar / Imprimir PDF', back: '← Volver al portfolio' },
  en: { print: 'Download / Print PDF', back: '← Back to portfolio' },
  ca: { print: 'Descarregar / Imprimir PDF', back: '← Tornar al portfolio' },
}

const LOCALES: Locale[] = ['es', 'en', 'ca']

export function CvToolbar({ locale }: CvToolbarProps) {
  return (
    <div className="cv-toolbar">
      <a className="cv-toolbar__back" href="/">{LABELS[locale].back}</a>
      <div className="cv-toolbar__actions">
        <div className="cv-toolbar__lang-group">
          {LOCALES.map((loc) => (
            <a
              key={loc}
              className={`cv-toolbar__lang${loc === locale ? ' cv-toolbar__lang--active' : ''}`}
              href={`/cv?lang=${loc}`}
            >
              {loc.toUpperCase()}
            </a>
          ))}
        </div>
        <button className="cv-toolbar__print" onClick={() => window.print()}>
          {LABELS[locale].print}
        </button>
      </div>
    </div>
  )
}
