import { afterEach, describe, expect, it, vi } from 'vitest'
import { dropBotEvents, isBot } from './analytics'

const CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
const SAFARI_IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1'

describe('isBot', () => {
  it.each([CHROME, SAFARI_IOS])('lets real browsers through: %s', (userAgent) => {
    expect(isBot({ userAgent, webdriver: false })).toBe(false)
  })

  it.each([
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)',
    'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/142.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; spider-feedback@bytedance.com)',
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
  ])('flags crawlers: %s', (userAgent) => {
    expect(isBot({ userAgent, webdriver: false })).toBe(true)
  })

  it('flags automated browsers that keep a normal user agent', () => {
    expect(isBot({ userAgent: CHROME, webdriver: true })).toBe(true)
  })

  it('does not fail without a navigator', () => {
    expect(isBot(null)).toBe(false)
  })
})

describe('dropBotEvents', () => {
  const event = { type: 'pageview', url: 'https://movieapp.ldvloper.com/movies/title/603' }

  afterEach(() => vi.unstubAllGlobals())

  it('passes the event through for visitors', () => {
    vi.stubGlobal('navigator', { userAgent: CHROME, webdriver: false })
    expect(dropBotEvents(event)).toBe(event)
  })

  it('drops the event for bots', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1)', webdriver: false })
    expect(dropBotEvents(event)).toBeNull()
  })
})
