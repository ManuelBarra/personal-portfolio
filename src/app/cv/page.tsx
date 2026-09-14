import type { Metadata } from 'next'
import resumeData from '@/data/resume.json'
import type { Resume, Locale } from '@/types/resume'
import { t } from '@/lib/i18n'
import { CvToolbar } from './CvToolbar'
import { CvViewportFix } from './CvViewportFix'

const resume = resumeData as Resume

const UI: Record<Locale, Record<string, string>> = {
  es: {
    summary: 'Resumen',
    experience: 'Experiencia',
    education: 'Educación',
    trainingInProgress: 'Formación en curso · 2026',
    skills: 'Habilidades',
    projects: 'Proyectos destacados',
    languages: 'Idiomas',
    certifications: 'Certificaciones',
    present: 'Actualidad',
    parallel: 'en paralelo',
    visit: 'Enlace',
  },
  en: {
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    trainingInProgress: 'In-progress training · 2026',
    skills: 'Skills',
    projects: 'Featured projects',
    languages: 'Languages',
    certifications: 'Certifications',
    present: 'Present',
    parallel: 'parallel',
    visit: 'Link',
  },
  ca: {
    summary: 'Resum',
    experience: 'Experiència',
    education: 'Educació',
    trainingInProgress: 'Formació en curs · 2026',
    skills: 'Habilitats',
    projects: 'Projectes destacats',
    languages: 'Idiomes',
    certifications: 'Certificacions',
    present: 'Actualitat',
    parallel: 'en paral·lel',
    visit: 'Enllaç',
  },
}

function parseLocale(lang: string | undefined): Locale {
  if (lang === 'en' || lang === 'ca') return lang
  return 'es'
}

function formatDate(date: string | null, current: boolean, present: string): string {
  if (current || !date) return present
  const [year, month] = date.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month, 10) - 1]} ${year}`
}

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ lang?: string }> }
): Promise<Metadata> {
  const { lang } = await searchParams
  const locale = parseLocale(lang)
  const title = locale === 'en'
    ? `Resume — ${resume.personal.firstName} ${resume.personal.lastName}`
    : `CV — ${resume.personal.firstName} ${resume.personal.lastName}`
  return {
    title,
    description: t(resume.personal.bio, locale),
    alternates: { canonical: '/cv' },
  }
}

export default async function CvPage(
  { searchParams }: { searchParams: Promise<{ lang?: string }> }
) {
  const { lang } = await searchParams
  const locale = parseLocale(lang)
  const ui = UI[locale]
  const { personal, experience, education, skills, projects } = resume

  const completedEdu = education.filter((e) => !e.status)
  const plannedEdu = education.filter((e) => e.status)

  const skillCategories = skills.reduce<Record<string, string[]>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] ?? []
    acc[skill.category].push(skill.name)
    return acc
  }, {})

  const featuredProjects = projects.filter((p) => p.featured)

  const contactLine = [
    personal.location,
    personal.email,
    personal.links.website,
    personal.links.github,
    personal.links.linkedin,
  ].filter(Boolean).join('  ·  ')

  return (
    <div className="cv-page">
      <CvViewportFix />
      <CvToolbar locale={locale} />

      <article className="cv-doc" lang={locale}>
        <header className="cv-doc__header">
          <h1 className="cv-doc__name">{personal.firstName} {personal.lastName}</h1>
          <p className="cv-doc__title">{t(personal.title, locale)}</p>
          <p className="cv-doc__contact">{contactLine}</p>
        </header>

        <section className="cv-doc__section">
          <h2 className="cv-doc__section-title">{ui.summary}</h2>
          <p className="cv-doc__text">{t(personal.bio, locale)}</p>
        </section>

        <section className="cv-doc__section">
          <h2 className="cv-doc__section-title">{ui.experience}</h2>
          {experience.map((exp) => (
            <div key={exp.id} className={`cv-doc__entry${exp.type === 'break' ? ' cv-doc__entry--break' : ''}`}>
              <div className="cv-doc__entry-head">
                <span className="cv-doc__entry-title">
                  {exp.type === 'break' ? exp.company : `${exp.company} — ${t(exp.position, locale)}`}
                  {exp.parallel && <span className="cv-doc__tag"> ({ui.parallel})</span>}
                </span>
                <span className="cv-doc__entry-date">
                  {formatDate(exp.startDate, false, ui.present)} – {formatDate(exp.endDate, exp.current, ui.present)}
                </span>
              </div>
              {exp.type !== 'break' && (
                <>
                  <p className="cv-doc__text">{t(exp.description, locale)}</p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="cv-doc__list">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{t(h, locale)}</li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies.length > 0 && (
                    <p className="cv-doc__tech">{exp.technologies.join(' · ')}</p>
                  )}
                </>
              )}
            </div>
          ))}
        </section>

        <section className="cv-doc__section">
          <h2 className="cv-doc__section-title">{ui.education}</h2>
          {completedEdu.map((edu) => (
            <div key={edu.id} className="cv-doc__entry">
              <div className="cv-doc__entry-head">
                <span className="cv-doc__entry-title">{edu.institution} — {t(edu.degree, locale)}</span>
                <span className="cv-doc__entry-date">
                  {formatDate(edu.startDate, false, ui.present)} – {formatDate(edu.endDate, edu.current, ui.present)}
                </span>
              </div>
              <p className="cv-doc__text">{t(edu.field, locale)}</p>
              {edu.description && <p className="cv-doc__text">{t(edu.description, locale)}</p>}
            </div>
          ))}
          {plannedEdu.length > 0 && (
            <>
              <p className="cv-doc__subhead">{ui.trainingInProgress}</p>
              {plannedEdu.map((edu) => (
                <div key={edu.id} className="cv-doc__entry cv-doc__entry--break">
                  <div className="cv-doc__entry-head">
                    <span className="cv-doc__entry-title">{edu.institution} — {t(edu.degree, locale)}</span>
                    <span className="cv-doc__entry-date">{edu.status ? t(edu.status, locale) : ''}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </section>

        <section className="cv-doc__section">
          <h2 className="cv-doc__section-title">{ui.skills}</h2>
          {Object.entries(skillCategories).map(([category, names]) => (
            <p key={category} className="cv-doc__text">
              <strong>{category}:</strong> {names.join(', ')}
            </p>
          ))}
        </section>

        <section className="cv-doc__section">
          <h2 className="cv-doc__section-title">{ui.projects}</h2>
          {featuredProjects.map((project) => (
            <div key={project.id} className="cv-doc__entry">
              <div className="cv-doc__entry-head">
                <span className="cv-doc__entry-title">{project.name}</span>
                {project.url && <span className="cv-doc__entry-date">{project.url.replace(/^https?:\/\//, '')}</span>}
              </div>
              <p className="cv-doc__text">{t(project.description, locale)}</p>
              {project.impact && <p className="cv-doc__tech">{t(project.impact, locale)}</p>}
            </div>
          ))}
        </section>

        {personal.languages && personal.languages.length > 0 && (
          <section className="cv-doc__section">
            <h2 className="cv-doc__section-title">{ui.languages}</h2>
            <p className="cv-doc__text">
              {personal.languages.map((l) => `${l.name} (${t(l.level, locale)})`).join(' · ')}
            </p>
          </section>
        )}

        {personal.certifications && personal.certifications.length > 0 && (
          <section className="cv-doc__section">
            <h2 className="cv-doc__section-title">{ui.certifications}</h2>
            <p className="cv-doc__text">
              {personal.certifications.map((c) => t(c, locale)).join(' · ')}
            </p>
          </section>
        )}
      </article>
    </div>
  )
}
