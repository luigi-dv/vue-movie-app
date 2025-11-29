/** Formatting helpers shared by views; all are pure so they are unit-tested in isolation. */

export function runtime(minutes) {
  if (!minutes) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m` // taste-skill-ignore: clock-style minutes
}

export function year(date) {
  return date ? date.slice(0, 4) : null
}

export function longDate(date, locale = 'en-US') {
  if (!date) return null
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
}

export function money(amount) {
  if (!amount) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(amount)
}

export function compactNumber(value) {
  if (value === null || value === undefined) return null
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function rating(vote) {
  return vote ? vote.toFixed(1) : null
}

export function age(birthday, deathday) {
  if (!birthday) return null
  const end = deathday ? new Date(deathday) : new Date()
  const start = new Date(birthday)
  let years = end.getFullYear() - start.getFullYear()
  const beforeBirthday = end.getMonth() < start.getMonth()
    || (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
  if (beforeBirthday) years--
  return years
}

/** Picks the best YouTube trailer: official trailers first, then any trailer, then teasers. */
export function pickTrailer(videos = []) {
  const youtube = videos.filter((video) => video.site === 'YouTube')
  const score = (video) => (video.type === 'Trailer' ? 2 : video.type === 'Teaser' ? 1 : 0) * 2 + (video.official ? 1 : 0)
  return youtube.filter((video) => score(video) > 1).sort((a, b) => score(b) - score(a))[0] || null
}
