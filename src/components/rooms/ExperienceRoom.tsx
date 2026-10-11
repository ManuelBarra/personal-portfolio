'use client'

import { useState } from 'react'
import type { ResumeExperience, Locale } from '@/types/resume'
import { formatMonth } from '@/lib/i18n'
import { useLocale, t } from '@/hooks/useLocale'

interface ExperienceRoomProps {
  experience: ResumeExperience[]
}

const LABELS: Record<Locale, { present: string; parallel: string }> = {
  es: { present: 'Actualidad', parallel: 'en paralelo' },
  en: { present: 'Present', parallel: 'parallel' },
  ca: { present: 'Actualitat', parallel: 'en paral·lel' },
}

function formatDate(date: string | null, current: boolean, locale: Locale): string {
  if (current || !date) return LABELS[locale].present
  return formatMonth(date, locale)
}

export function ExperienceRoom({ experience }: ExperienceRoomProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = experience[activeIdx]
  const { locale } = useLocale()

  return (
    <>
      <h2 className="section-title">
        <span className="section-title__accent">//</span> Experience
      </h2>
      <div className="exp-room">
        <div className="exp-rail">
          {experience.map((exp, i) => (
            <div
              key={exp.id}
              className={`exp-item ${i === activeIdx ? 'exp-item--active' : ''} ${exp.type === 'break' ? 'exp-item--break' : ''}`}
              onClick={() => setActiveIdx(i)}
              role="button"
              tabIndex={0}
              aria-label={`${exp.company} — ${t(exp.position, locale)}`}
              aria-current={i === activeIdx ? 'true' : undefined}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActiveIdx(i)
                }
              }}
            >
              <div className="exp-item__date">
                {formatDate(exp.startDate, false, locale)} — {formatDate(exp.endDate, exp.current, locale)}
                {exp.parallel && <span className="exp-item__parallel"> · {LABELS[locale].parallel}</span>}
              </div>
              {exp.type === 'break' ? (
                <div className="exp-item__break-label">{t(exp.position, locale)}</div>
              ) : (
                <>
                  <div className="exp-item__company">{exp.company}</div>
                  <div className="exp-item__role">{t(exp.position, locale)}</div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="exp-detail">
          <div className="exp-detail__header">
            <div className={`exp-detail__company${active.type === 'break' ? ' exp-detail__company--break' : ''}`}>
              {active.type === 'break' ? t(active.position, locale) : active.company}
            </div>
            {active.type !== 'break' && <div className="exp-detail__role">{t(active.position, locale)}</div>}
            <div className="exp-detail__meta">
              {active.location && <span>{active.location}</span>}
              <span>
                {formatDate(active.startDate, false, locale)} — {formatDate(active.endDate, active.current, locale)}
                {active.parallel && <span className="exp-item__parallel"> · {LABELS[locale].parallel}</span>}
              </span>
            </div>
          </div>

          {t(active.description, locale) && <p className="exp-detail__desc">{t(active.description, locale)}</p>}

          {active.highlights && active.highlights.length > 0 && (
            <ul className="exp-detail__highlights">
              {active.highlights.map((h, i) => (
                <li key={i} className="exp-detail__highlight">{t(h, locale)}</li>
              ))}
            </ul>
          )}

          <div className="exp-detail__tech">
            {active.technologies.map((tech) => (
              <span key={tech} className="exp-detail__tech-tag">{tech}</span>
            ))}
          </div>

          {active.repo && (
            <a
              href={`https://${active.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="exp-detail__link"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>
    </>
  )
}
