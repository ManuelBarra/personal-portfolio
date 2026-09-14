'use client'

import Image from 'next/image'
import type { ResumeProject } from '@/types/resume'
import { useLocale, t } from '@/hooks/useLocale'

interface ProjectsRoomProps {
  projects: ResumeProject[]
}

const TECH_COLOR: Record<string, string> = {
  'Next.js':       '#3DDCFF',
  'React':         '#61DAFB',
  'React.js':      '#61DAFB',
  'Vue.js':        '#42D392',
  'Three.js':      '#FF3CAC',
  'GSAP':          '#FFB800',
  'TypeScript':    '#5B7CFF',
  'JavaScript':    '#FFB800',
  'Python':        '#00FF88',
  'AEM':           '#FF4757',
  'WordPress':     '#9B8AFF',
  'Framer Motion': '#FF3CAC',
  'Canvas 2D':     '#3DDCFF',
}

function accentFor(techs: string[]): string {
  for (const tech of techs) if (TECH_COLOR[tech]) return TECH_COLOR[tech]
  return '#3DDCFF'
}

function gradientFor(techs: string[]): string {
  const c1 = accentFor(techs)
  const c2 = TECH_COLOR[techs[1]] ?? '#5B7CFF'
  return `linear-gradient(135deg, ${c1}22 0%, ${c2}14 100%)`
}

export function ProjectsRoom({ projects }: ProjectsRoomProps) {
  const { locale } = useLocale()

  return (
    <div className="proj-gallery-root">
      <h2 className="section-title">
        <span className="section-title__accent">//</span> Projects
        <span className="proj-gallery-counter">{String(projects.length).padStart(2, '0')} total</span>
      </h2>

      <div className="proj-grid">
        {projects.map((project) => {
          const accent = accentFor(project.technologies)
          const primaryHref = project.url ?? (project.repo ? `https://${project.repo}` : undefined)

          return (
            <div
              key={project.id}
              className={`proj-tile${project.featured ? ' proj-tile--featured' : ''}`}
              style={{ '--tile-accent': accent } as React.CSSProperties}
              tabIndex={0}
            >
              <div className="proj-tile__visual" style={{ background: gradientFor(project.technologies) }}>
                <div className="proj-tile__visual-grid" />
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
                    className="proj-tile__image"
                  />
                ) : (
                  <div className="proj-tile__visual-label" style={{ color: accent }}>
                    <span className="proj-tile__visual-glyph">{'</>'}</span>
                    <span className="proj-tile__visual-name">{project.name}</span>
                  </div>
                )}
                {project.featured && <span className="proj-tile__badge">FEATURED</span>}
                {project.status && (
                  <span className="proj-tile__badge proj-tile__badge--status">
                    {t(project.status, locale)}
                  </span>
                )}
              </div>

              <div className="proj-tile__panel">
                <div className="proj-tile__panel-peek">
                  <span className="proj-tile__name">{project.name}</span>
                  {project.url && (
                    <span className="proj-tile__hint" aria-hidden="true">↑</span>
                  )}
                </div>

                <div className="proj-tile__panel-reveal">
                  {project.impact && (
                    <div className="proj-tile__impact" style={{ color: accent }}>
                      ▲ {t(project.impact, locale)}
                    </div>
                  )}
                  <p className="proj-tile__desc">{t(project.description, locale)}</p>
                  <div className="proj-tile__tech">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="proj-tile__tech-tag">{tech}</span>
                    ))}
                  </div>
                  <div className="proj-tile__links">
                    {primaryHref && (
                      <a
                        href={primaryHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-tile__link"
                      >
                        Visit site →
                      </a>
                    )}
                    {project.repo && project.url && (
                      <a
                        href={`https://${project.repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-tile__link proj-tile__link--muted"
                      >
                        GitHub →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
