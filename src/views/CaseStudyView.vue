<script setup>
import { onMounted, ref } from 'vue'
import ArchitectureDiagram from '@/components/ArchitectureDiagram.vue'
import TmdbLogo from '@/components/ui/TmdbLogo.vue'
import { usePageTitle } from '@/composables/usePageTitle'

usePageTitle('How it’s built')

const REPO = 'Luigi-DV/vue-movies-api'

// The latest commit on master, read live from GitHub so the page never goes stale
const commit = ref(null)
onMounted(async () => {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/commits/master`, { headers: { Accept: 'application/vnd.github+json' } })
    if (!response.ok) return
    const body = await response.json()
    commit.value = {
      sha: body.sha.slice(0, 7),
      message: body.commit.message.split('\n')[0],
      date: new Date(body.commit.author.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      url: body.html_url
    }
  }
  catch {
    // Rate limited or offline: the section simply omits the commit
  }
})

const decisions = [
  {
    title: 'The API key never reaches the browser',
    text: 'The client calls /api/tmdb/*. A Vercel function appends the key on the server and the Vite dev server does the same locally, so the bundle and the network tab hold nothing secret.'
  },
  {
    title: 'One request per film page',
    text: 'A film page needs details, credits, videos, recommendations and certifications. TMDb’s append_to_response folds all five into a single call instead of five round trips.'
  },
  {
    title: 'Stale answers never win',
    text: 'The useTmdb composable aborts the request in flight whenever its inputs change, so quick filter changes cannot paint an older result over a newer one. Answers stay in memory for five minutes, which makes the back button instant.'
  },
  {
    title: 'The address bar holds the state',
    text: 'Genre, year, sort order and page are read from and written to the query string through useRouteQuery. Any view can be bookmarked, shared or undone with the back button.'
  },
  {
    title: 'A watchlist without a backend',
    text: 'Saved films live in localStorage through a Pinia store built on VueUse. Storage events keep every open tab in step, and clearing the list offers an undo instead of a confirmation dialog.'
  },
  {
    title: 'Accessible from the first commit',
    text: 'Headless UI handles focus and keyboard in the search palette and the trailer player. There is a skip link, a visible focus ring, live regions for results, and reduced-motion support for every animation.'
  },
  {
    title: 'Images sized to their slot',
    text: 'Posters and stills ship with srcset, sizes, width and height, so the browser downloads only the resolution it needs and nothing shifts while images arrive.'
  }
]

const tokens = [
  { name: 'Ground', className: 'bg-ground text-ink' },
  { name: 'Surface', className: 'bg-surface text-ink' },
  { name: 'Ink', className: 'bg-ink text-ground' },
  { name: 'Emerald accent', className: 'bg-accent text-on-accent' },
  { name: 'Field', className: 'bg-field text-on-field' }
]

const stack = [
  ['Vue 3.5', 'Composition API and script setup throughout'],
  ['Pinia 3', 'preferences, watchlist and search state'],
  ['Vue Router 4', 'lazy-loaded routes, query-string state'],
  ['Vite 7', 'dev server, proxy and production build'],
  ['Tailwind CSS 4', 'design tokens declared once with @theme'],
  ['VueUse and Headless UI', 'storage, observers, accessible dialogs'],
  ['Vercel', 'static hosting, rewrites and the serverless proxy']
]

const quality = [
  ['Vitest', 'unit tests for the API client, composables, stores, components and the serverless handler'],
  ['Playwright', 'browser tests for search, filters, film pages, trailers and the watchlist, against a mocked TMDb'],
  ['GitHub Actions', 'lint, unit tests, build and browser tests on Node 22 for every push'],
  ['ESLint 9', 'flat config with the recommended Vue rules']
]
</script>

<template>
  <div>
    <section class="page-x pt-16 pb-24 lg:pt-28 lg:pb-36">
      <h1 class="lines text-display font-bold">
        <span class="line"><span data-line style="--i: 0">How it’s</span></span>
        <span class="line"><span data-line style="--i: 1">built</span></span>
      </h1>
      <p data-rise style="--i: 2" class="mt-10 max-w-[30ch] text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-tight font-medium">
        A Vue single-page app over the TMDb API, rebuilt to show how I design and engineer a front end today.
      </p>
      <dl data-rise style="--i: 3" class="mt-14 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt class="text-small text-soft">Role</dt>
          <dd class="font-semibold">Design and engineering</dd>
        </div>
        <div>
          <dt class="text-small text-soft">Built with</dt>
          <dd class="font-semibold">Vue 3, Vite, Vercel</dd>
        </div>
        <div>
          <dt class="text-small text-soft">Source</dt>
          <dd><a :href="`https://github.com/${REPO}`" class="link font-semibold" target="_blank" rel="noopener">GitHub repository</a></dd>
        </div>
        <div>
          <dt class="text-small text-soft">Latest commit</dt>
          <dd v-if="commit">
            <a :href="commit.url" class="link font-semibold" target="_blank" rel="noopener">{{ commit.message }}</a>
            <span class="block text-small text-soft">{{ commit.date }}</span>
          </dd>
          <dd v-else class="font-semibold">On GitHub</dd>
        </div>
      </dl>
    </section>

    <figure class="page-x pb-24 lg:pb-36">
      <img
        v-reveal
        src="/case-study/home.jpg"
        alt="The Movie App home page in dark mode: the headline Find your next film beside a still from this week’s most trending film"
        width="1440"
        height="900"
        class="w-full bg-surface"
      />
      <figcaption class="mt-4 text-small text-soft">The home page in dark mode. The stage on the right cycles through this week’s trending films.</figcaption>
    </figure>

    <section aria-labelledby="architecture-title" class="page-x bg-field py-24 text-on-field lg:py-36">
      <h2 id="architecture-title" v-reveal class="text-title font-bold">Where the key lives</h2>
      <p v-reveal="1" class="mt-4 max-w-[56ch] text-lead text-field-soft">The first version shipped its TMDb key inside the JavaScript bundle. Now the browser never sees it.</p>
      <div class="mt-14">
        <ArchitectureDiagram />
      </div>
      <pre v-reveal class="mt-14 max-w-3xl overflow-x-auto bg-black/25 p-6 text-small leading-relaxed text-on-field"><code>// api/tmdb.js (Vercel function)
const url = new URL(`https://api.themoviedb.org/${version}/${path}`)
url.searchParams.set('api_key', process.env.TMDB_API_KEY)

const response = await fetch(url)
res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
return res.status(response.status).json(await response.json())</code></pre>
    </section>

    <section aria-labelledby="decisions-title" class="page-x py-24 lg:py-36">
      <h2 id="decisions-title" v-reveal class="text-title font-bold">Seven decisions</h2>
      <dl class="mt-14 max-w-5xl space-y-12">
        <div v-for="decision in decisions" :key="decision.title" v-reveal class="grid gap-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
          <dt class="text-lead font-semibold">{{ decision.title }}</dt>
          <dd class="max-w-[60ch]">{{ decision.text }}</dd>
        </div>
      </dl>
    </section>

    <section aria-labelledby="screens-title" class="page-x pb-24 lg:pb-36">
      <h2 id="screens-title" v-reveal class="text-title font-bold">Screens</h2>
      <div class="mt-12 grid gap-3 lg:grid-cols-3">
        <figure class="lg:col-span-2">
          <img v-reveal src="/case-study/film.jpg" alt="The Matrix film page: sticky poster beside the title, rating, trailer button and credits" width="1440" height="900" loading="lazy" class="w-full bg-surface" />
          <figcaption class="mt-3 text-small text-soft">A film page. The poster stays in place while the facts, cast and recommendations scroll past.</figcaption>
        </figure>
        <figure class="row-span-2">
          <img v-reveal="1" src="/case-study/phone.jpg" alt="The Matrix film page on a phone in light mode" width="780" height="1688" loading="lazy" class="w-full bg-surface lg:h-[calc(100%-3.5rem)] lg:object-cover lg:object-top" />
          <figcaption class="mt-3 text-small text-soft">The same page on a phone, in light mode.</figcaption>
        </figure>
        <figure>
          <img v-reveal src="/case-study/search.jpg" alt="The search palette open over the discover page with results for dune" width="1440" height="900" loading="lazy" class="w-full bg-surface" />
          <figcaption class="mt-3 text-small text-soft">The search palette, opened with ⌘K.</figcaption>
        </figure>
        <figure>
          <img v-reveal="1" src="/case-study/discover.jpg" alt="Discover filtered to science fiction, sorted by rating, in light mode" width="1440" height="900" loading="lazy" class="w-full bg-surface" />
          <figcaption class="mt-3 text-small text-soft">Discover, filtered to science fiction and sorted by rating.</figcaption>
        </figure>
      </div>
    </section>

    <section aria-labelledby="design-title" class="bg-surface py-24 lg:py-36">
      <div class="page-x">
        <h2 id="design-title" v-reveal class="text-title font-bold">A small design system</h2>
        <p v-reveal="1" class="mt-4 max-w-[60ch] text-lead">
          One typeface, one emerald accent, five type sizes and square corners. Surfaces are separated by a step in tone, never by lines or shadows, so the films supply the colour.
        </p>
      </div>
      <div class="page-x mt-14 grid gap-10 lg:grid-cols-2">
        <p v-reveal class="text-display font-bold leading-none">Aa</p>
        <div v-reveal="1" class="space-y-2">
          <p class="text-title font-bold">Inter, variable</p>
          <p class="text-lead">Set tight at display sizes, open at reading sizes.</p>
          <p>Body text runs at 17 pixels in full ink, with tabular figures wherever numbers line up.</p>
          <p class="text-small text-soft">Secondary notes use the small size in the softer ink.</p>
        </div>
      </div>
      <ul class="mt-14 grid grid-cols-2 sm:grid-cols-5" aria-label="Colour tokens">
        <li v-for="(token, index) in tokens" :key="token.name" v-reveal="index" :class="token.className" class="flex aspect-square items-end p-5 font-semibold sm:aspect-[3/4]">
          {{ token.name }}
        </li>
      </ul>
    </section>

    <section aria-labelledby="stack-title" class="page-x grid gap-16 py-24 lg:grid-cols-2 lg:py-36">
      <div>
        <h2 id="stack-title" v-reveal class="text-title font-bold">Stack</h2>
        <dl class="mt-10 space-y-5">
          <div v-for="[name, role] in stack" :key="name" v-reveal>
            <dt class="font-semibold">{{ name }}</dt>
            <dd class="text-soft">{{ role }}</dd>
          </div>
        </dl>
      </div>
      <div>
        <h2 v-reveal class="text-title font-bold">Quality</h2>
        <dl class="mt-10 space-y-5">
          <div v-for="[name, role] in quality" :key="name" v-reveal>
            <dt class="font-semibold">{{ name }}</dt>
            <dd class="text-soft">{{ role }}</dd>
          </div>
        </dl>
        <a href="https://github.com/Luigi-DV/vue-movies-api/actions" target="_blank" rel="noopener" class="mt-8 inline-block">
          <img src="https://github.com/Luigi-DV/vue-movies-api/actions/workflows/build.yml/badge.svg" alt="CI status for the master branch" height="20" loading="lazy" />
        </a>
      </div>
    </section>

    <section class="page-x bg-field py-24 text-on-field lg:py-32">
      <p v-reveal class="max-w-[22ch] text-title font-bold">Read the code, or come and talk about it.</p>
      <div v-reveal="1" class="mt-10 flex flex-wrap gap-3">
        <a href="https://github.com/Luigi-DV/vue-movies-api" class="btn btn-on-field" target="_blank" rel="noopener">Open the repository</a>
        <a href="https://github.com/Luigi-DV" class="btn text-on-field hover:bg-white/10" target="_blank" rel="me noopener">Luigelo on GitHub</a>
      </div>
      <p class="mt-16 flex flex-wrap items-center gap-3 text-small text-field-soft">
        Film data and images from <TmdbLogo class="h-3.5 w-auto" />
      </p>
    </section>
  </div>
</template>
