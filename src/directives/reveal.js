/**
 * v-reveal: marks an element for a once-only entrance when it scrolls into view.
 * Usage: <h2 v-reveal> or <p v-reveal="1"> where the value is the stagger index.
 */
let observer = null

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
  return observer
}

export const reveal = {
  mounted(el, binding) {
    el.setAttribute('data-reveal', '')
    if (binding.value !== undefined) el.style.setProperty('--i', binding.value)
    const io = getObserver()
    if (io) io.observe(el)
    else el.classList.add('is-visible')
  },
  unmounted(el) {
    observer?.unobserve(el)
  }
}
