import { describe, it, expect } from 'vitest'
import { runtime, year, longDate, money, compactNumber, rating, age, pickTrailer } from './format'

describe('format', () => {
  it('formats runtimes as hours and padded minutes', () => {
    expect(runtime(136)).toBe('2h 16m')
    expect(runtime(125)).toBe('2h 05m')
    expect(runtime(45)).toBe('45m')
    expect(runtime(0)).toBeNull()
  })

  it('extracts the year from a TMDb date', () => {
    expect(year('1999-03-31')).toBe('1999')
    expect(year('')).toBeNull()
  })

  it('formats dates without timezone drift', () => {
    expect(longDate('1999-03-31')).toBe('March 31, 1999')
    expect(longDate('not a date')).toBeNull()
  })

  it('formats money and large numbers compactly', () => {
    expect(money(63000000)).toBe('$63M')
    expect(money(463517383)).toBe('$463.5M')
    expect(money(0)).toBeNull()
    expect(compactNumber(1234567)).toBe('1.2M')
  })

  it('rounds ratings to one decimal', () => {
    expect(rating(8.217)).toBe('8.2')
    expect(rating(0)).toBeNull()
  })

  it('computes age from a birthday, or at death', () => {
    expect(age('1964-09-02', '2024-09-01')).toBe(59)
    expect(age('1964-09-02', '2024-09-02')).toBe(60)
    expect(age(null)).toBeNull()
  })

  it('prefers official YouTube trailers, then trailers, then teasers', () => {
    const videos = [
      { key: 'a', site: 'YouTube', type: 'Featurette', official: true },
      { key: 'b', site: 'YouTube', type: 'Teaser', official: true },
      { key: 'c', site: 'Vimeo', type: 'Trailer', official: true },
      { key: 'd', site: 'YouTube', type: 'Trailer', official: false },
      { key: 'e', site: 'YouTube', type: 'Trailer', official: true }
    ]
    expect(pickTrailer(videos).key).toBe('e')
    expect(pickTrailer(videos.slice(0, 2)).key).toBe('b')
    expect(pickTrailer([{ key: 'x', site: 'YouTube', type: 'Clip' }])).toBeNull()
    expect(pickTrailer()).toBeNull()
  })
})
