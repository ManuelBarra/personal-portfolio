import { useEffect, useState } from 'react'
import type { Resume } from '@/types/resume'

export function useResume() {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    import('@/data/resume.json')
      .then((data) => {
        const source = data.default as Resume
        let draft: Resume | null = null
        try {
          const raw = localStorage.getItem('resume_draft')
          const parsed = raw ? (JSON.parse(raw) as Resume) : null
          // Only reuse a draft made against the current resume.json version,
          // so a content update is never hidden behind a stale local copy.
          if (parsed?.metadata?.version === source.metadata.version) draft = parsed
          else if (raw) localStorage.removeItem('resume_draft')
        } catch {
          try { localStorage.removeItem('resume_draft') } catch { /* storage unavailable */ }
        }
        setResume(draft ?? source)
        setLoading(false)
      })
      .catch(() => {
        setError('Error cargando datos del portfolio')
        setLoading(false)
      })
  }, [])

  const updateResume = (updates: Partial<Resume>) => {
    setResume((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      localStorage.setItem('resume_draft', JSON.stringify(updated))
      return updated
    })
  }

  const resetToDraft = () => {
    localStorage.removeItem('resume_draft')
    window.location.reload()
  }

  return { resume, loading, error, updateResume, resetToDraft }
}
