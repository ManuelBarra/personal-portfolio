export type Locale = 'es' | 'en' | 'ca'

export interface LocalizedText {
  es: string
  en: string
  ca: string
}

export interface ResumeMetadata {
  version: string
  lastUpdated: string
  author: string
}

export interface ResumeLinks {
  github?: string
  linkedin?: string
  website?: string
  twitter?: string
}

export interface ResumePersonal {
  firstName: string
  lastName: string
  alias?: string
  title: LocalizedText
  tagline?: LocalizedText
  status?: LocalizedText
  location: string
  email: string
  phone?: string
  bio: LocalizedText
  about?: LocalizedText[]
  links: ResumeLinks
  avatar?: string
  languages?: { name: string; level: LocalizedText }[]
  interests?: LocalizedText[]
  certifications?: LocalizedText[]
}

export interface ResumeExperience {
  id: string
  company: string
  position: LocalizedText
  startDate: string
  endDate: string | null
  current: boolean
  parallel?: boolean
  type?: 'work' | 'break'
  location: string
  description: LocalizedText
  technologies: string[]
  highlights?: LocalizedText[]
  repo?: string
}

export interface ResumeSkill {
  id: string
  name: string
  category: string
  level: 1 | 2 | 3 | 4 | 5
  icon?: string
}

export interface ResumeProject {
  id: string
  name: string
  description: LocalizedText
  impact?: LocalizedText
  url?: string
  repo?: string
  technologies: string[]
  featured: boolean
  status?: LocalizedText
  image?: string
}

export interface ResumeEducation {
  id: string
  institution: string
  degree: LocalizedText
  field: LocalizedText
  startDate: string
  endDate: string | null
  current: boolean
  location: string
  description?: LocalizedText
  status?: LocalizedText
}

export interface ResumeTheme {
  primary: string
  secondary: string
  accent: string
}

export interface Resume {
  metadata: ResumeMetadata
  personal: ResumePersonal
  experience: ResumeExperience[]
  skills: ResumeSkill[]
  projects: ResumeProject[]
  education: ResumeEducation[]
  theme: ResumeTheme
}
