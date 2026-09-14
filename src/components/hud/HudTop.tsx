'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/hooks/useLocale'

const ROOM_LABELS = ['Home', 'About', 'Experience', 'Education', 'Skills', 'Projects', 'Contact']

interface HudTopProps {
  activeIdx: number
}

export function HudTop({ activeIdx }: HudTopProps) {
  const [time, setTime] = useState('')
  const { locale, toggleLocale } = useLocale()

  useEffect(() => {
    function tick() {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hud-top">
      <div className="hud-top__brand">
        <span className="hud-top__status-dot" />
        malb.dev
      </div>

      <div className="hud-top__sector">
        <span>sector: {ROOM_LABELS[activeIdx]?.toLowerCase()}</span>
        <span>room {activeIdx + 1}/{ROOM_LABELS.length}</span>
      </div>

      <div className="hud-top__right">
        <button
          className="hud-top__lang"
          onClick={toggleLocale}
          aria-label="Toggle language"
          title="ES / EN"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            padding: '0.15rem 0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            color: 'inherit',
            letterSpacing: '0.05em',
          }}
        >
          {locale.toUpperCase()}
        </button>
        <span>{time}</span>
        <span>v3.0</span>
      </div>
    </div>
  )
}
