/** Content languages offered for TMDb titles, overviews and posters. */
export const languages = [
  { id: 'en-US', name: 'English' },
  { id: 'es-ES', name: 'Español' },
  { id: 'es-MX', name: 'Español (MX)' },
  { id: 'pt-BR', name: 'Português (BR)' },
  { id: 'pt-PT', name: 'Português (PT)' },
  { id: 'fr-FR', name: 'Français' },
  { id: 'de-DE', name: 'Deutsch' },
  { id: 'it-IT', name: 'Italiano' },
  { id: 'ja-JP', name: '日本語' },
  { id: 'ko-KR', name: '한국어' },
  { id: 'zh-CN', name: '中文' },
  { id: 'ar-SA', name: 'العربية' }
]

export const defaultLanguage = languages[0].id

/** Languages written right-to-left, so overview text can set dir="rtl". */
export function isRtl(languageId) {
  return /^(ar|he|fa|ur)/.test(languageId)
}
