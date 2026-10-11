import type { Locale, LocalizedText } from '@/types/resume'

/** Resolve a LocalizedText field for the given locale, with a safe fallback. */
export function t(text: LocalizedText | undefined | null, locale: Locale): string {
  if (!text) return ''
  return text[locale] ?? text.es ?? text.en ?? ''
}

const MONTHS: Record<Locale, string[]> = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ca: ['gen', 'febr', 'març', 'abr', 'maig', 'juny', 'jul', 'ag', 'set', 'oct', 'nov', 'des'],
}

export const PRESENT: Record<Locale, string> = { es: 'Actualidad', en: 'Present', ca: 'Actualitat' }

/** Format a `YYYY-MM` date as a short localized month + year (e.g. `sep 2026`). */
export function formatMonth(date: string, locale: Locale): string {
  const [year, month] = date.split('-')
  const m = MONTHS[locale][parseInt(month, 10) - 1]
  return m ? `${m} ${year}` : year
}
