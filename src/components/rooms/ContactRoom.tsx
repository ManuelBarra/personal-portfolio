'use client'

import type { ResumePersonal } from '@/types/resume'

interface ContactRoomProps {
  personal: ResumePersonal
}

export function ContactRoom({ personal }: ContactRoomProps) {
  const contacts = [
    { label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    ...(personal.links.github ? [{ label: 'GitHub', value: personal.links.github, href: `https://${personal.links.github}` }] : []),
    ...(personal.links.linkedin ? [{ label: 'LinkedIn', value: personal.links.linkedin, href: `https://${personal.links.linkedin}` }] : []),
    ...(personal.links.website ? [{ label: 'Website', value: personal.links.website, href: `https://${personal.links.website}` }] : []),
  ]

  return (
    <div className="contact-room">
      <h2 className="contact-headline">
        <span className="contact-headline__gradient">Let&apos;s build</span>
        <br />
        something together
      </h2>

      <div className="contact-grid">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="contact-row"
          >
            <span className="contact-row__label">{c.label}</span>
            <span className="contact-row__value">{c.value}</span>
          </a>
        ))}
      </div>

      <a
        href="/cv/Manuel_Barra_Lazo_CV_2026.pdf"
        download
        className="contact-cv-cta"
      >
        Download CV (PDF) →
      </a>
    </div>
  )
}
