<script setup>
// The request path for every TMDb call, set as a flow of plain text in the page's own colours.
const steps = [
  { title: 'Browser', lines: ['GET /api/tmdb/movie/603', 'no key, no secrets'] },
  { title: 'Vercel edge', lines: ['rewrites to the function', 'serves cached answers'] },
  { title: 'api/tmdb.js', lines: ['adds TMDB_API_KEY', 'sets s-maxage=3600'] },
  { title: 'TMDb API', lines: ['api.themoviedb.org/3', 'JSON back the same way'] }
]
</script>

<template>
  <figure>
    <ol class="grid gap-x-6 gap-y-16 sm:grid-cols-2 xl:grid-cols-4">
      <li v-for="(step, index) in steps" :key="step.title" v-reveal="index">
        <p class="text-title font-bold leading-none">
          {{ step.title }}<span v-if="index < steps.length - 1" class="text-field-soft" aria-hidden="true"> →</span>
        </p>
        <p v-for="line in step.lines" :key="line" class="mt-2 text-field-soft">{{ line }}</p>
      </li>
    </ol>
    <figcaption class="mt-10 max-w-[62ch] text-field-soft">
      Every request takes the same path. The key is added in the function, and Vercel’s edge keeps each answer for an hour, so repeat requests are served from cache instead of TMDb.
    </figcaption>
  </figure>
</template>
