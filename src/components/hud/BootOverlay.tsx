'use client'

import { useEffect, useState } from 'react'

const BOOT_LINES = [
  'malb.dev v3.0 — Initializing...',
  'Loading kernel modules...',
  'Mounting /dev/portfolio...',
  'Checking filesystem integrity... OK',
  'Loading design tokens... OK',
  'Initializing HUD subsystem... OK',
  'Connecting to creative.engine... OK',
  'All systems nominal.',
  '',
  'Welcome, guest.',
]

interface BootOverlayProps {
  onComplete: () => void
}

export function BootOverlay({ onComplete }: BootOverlayProps) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [progress, setProgress] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lineTimer: ReturnType<typeof setTimeout>
    let currentLine = 0

    function showNextLine() {
      currentLine++
      setVisibleLines(currentLine)
      setProgress(Math.round((currentLine / BOOT_LINES.length) * 100))

      if (currentLine < BOOT_LINES.length) {
        const delay = currentLine === BOOT_LINES.length - 1 ? 400 : 80 + Math.random() * 120
        lineTimer = setTimeout(showNextLine, delay)
      } else {
        lineTimer = setTimeout(() => {
          setHidden(true)
          setTimeout(onComplete, 600)
        }, 800)
      }
    }

    lineTimer = setTimeout(showNextLine, 300)

    return () => clearTimeout(lineTimer)
  }, [onComplete])

  // Allow skip with any key or click
  useEffect(() => {
    function skip() {
      setHidden(true)
      setTimeout(onComplete, 100)
    }

    window.addEventListener('keydown', skip, { once: true })
    window.addEventListener('click', skip, { once: true })

    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('click', skip)
    }
  }, [onComplete])

  return (
    <div className={`boot-overlay ${hidden ? 'boot-overlay--hidden' : ''}`}>
      <div className="boot-text">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="boot-text__line"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {line || '\u00A0'}
          </div>
        ))}
      </div>
      <div className="boot-progress">
        <div className="boot-progress__bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
