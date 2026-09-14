import resumeData from '@/data/resume.json'
import type { Resume } from '@/types/resume'
import { SITE_URL } from '@/lib/site'

const resume = resumeData as unknown as Resume

export function JsonLd() {
  const { personal } = resume

  const sameAs = [
    personal.links?.linkedin && `https://${personal.links.linkedin.replace(/^https?:\/\//, '')}`,
    personal.links?.github && `https://${personal.links.github.replace(/^https?:\/\//, '')}`,
    personal.links?.twitter && `https://${personal.links.twitter.replace(/^https?:\/\//, '')}`,
  ].filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: `${personal.firstName} ${personal.lastName}`,
        jobTitle: personal.title.es,
        url: SITE_URL,
        email: personal.email,
        address: personal.location,
        sameAs,
      },
      {
        '@type': 'WebSite',
        name: 'malb.dev',
        url: SITE_URL,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
