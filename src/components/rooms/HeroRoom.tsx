'use client'

import type { ResumePersonal } from '@/types/resume'
import { useLocale, t } from '@/hooks/useLocale'

interface HeroRoomProps {
  personal: ResumePersonal
}

export function HeroRoom({ personal }: HeroRoomProps) {
  const { locale } = useLocale()

  return (
    <div className="hero-room">
      <div className="hero-info">
        <div className="hero-glitch">
          <h1 className="hero-name">
            {personal.firstName}
            <br />
            <span className="hero-name__accent">{personal.lastName}</span>
          </h1>
        </div>

        <div className="hero-meta">
          <div className="hero-meta__row">
            <span className="hero-meta__label">role</span>
            <span className="hero-meta__value">{t(personal.title, locale)}</span>
          </div>
          <div className="hero-meta__row">
            <span className="hero-meta__label">location</span>
            <span className="hero-meta__value">{personal.location}</span>
          </div>
          {personal.alias && (
            <div className="hero-meta__row">
              <span className="hero-meta__label">alias</span>
              <span className="hero-meta__value hero-meta__value--neon">@{personal.alias}</span>
            </div>
          )}
        </div>

        {personal.status && (
          <div className="hero-status">
            <span className="hero-status__dot" />
            {t(personal.status, locale)}
          </div>
        )}

        <div className="hero-prompt">
          <span style={{ color: 'var(--color-neon)' }}>guest@malb.dev</span>
          <span style={{ color: 'var(--color-text-muted)' }}>:~$</span>
          {' '}navigate --explore
          <span className="hero-prompt__cursor" />
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        {personal.tagline && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            maxWidth: '400px',
          }}>
            {t(personal.tagline, locale)}
          </p>
        )}
      </div>
    </div>
  )
}
