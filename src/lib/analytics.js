// Crawlers, link previewers and headless browsers that run JavaScript and would otherwise
// be counted as visitors, spending the Web Analytics event quota.
const BOT_PATTERN = /bot\b|crawl|spider|slurp|headless|lighthouse|pagespeed|prerender|preview|scrape|fetch|monitor|GPTBot|ClaudeBot|anthropic|perplexity|bytespider|facebookexternalhit|python|curl|wget|axios|go-http/i

/** True when the current browser looks automated. */
export function isBot(nav = globalThis.navigator) {
  if (!nav) return false
  return nav.webdriver === true || BOT_PATTERN.test(nav.userAgent || '')
}

/** `beforeSend` for Vercel Web Analytics: returning null drops the event before it is sent. */
export function dropBotEvents(event) {
  return isBot() ? null : event
}
